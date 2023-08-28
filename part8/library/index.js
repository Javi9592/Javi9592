const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const {
  ApolloServerPluginDrainHttpServer,
} = require('@apollo/server/plugin/drainHttpServer')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { WebSocketServer } = require('ws')
const { useServer } = require('graphql-ws/lib/use/ws')
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()
const express = require('express')
const http = require('http')
const cors = require('cors')
const bodyParser = require('body-parser')
const { expressMiddleware } = require('@apollo/server/express4')

require('dotenv').config()

const app = express()
const httpServer = http.createServer(app)

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = `#graphql
  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: [Book!]
  }

  type Query {
    authorCount: Int!
    bookCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`

const resolvers = {
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      try {
        let query = {}

        if (args.author) {
          const author = await Author.findOne({ name: args.author })
          if (author) {
            query.author = author._id
          }
        }

        if (args.genre) {
          query.genres = args.genre
        }

        const books = await Book.find(query)

        // Resuelve el campo 'author' en cada libro con el objeto Author correspondiente
        const booksWithAuthors = await Promise.all(
          books.map(async (book) => {
            const author = await Author.findById(book.author)
            return {
              ...book.toObject(),
              id: book._id.toString(), // Convertir el ObjectId a una cadena para el campo id
              author: author,
            }
          })
        )

        return booksWithAuthors
      } catch (error) {
        throw new Error('Error fetching books: ' + error.message)
      }
    },
    allAuthors: async () => {
      try {
        const authors = await Author.find().populate('bookCount')
        return authors
      } catch (error) {
        throw new Error('Error fetching authors: ' + error.message)
      }
    },
    me: (root, args, context) => {
      console.log('context in me Query', context)
      return context.currentUser
    },
  },
  Author: {
    bookCount: async (root, args, context) => {
      try {
        const authorName = root.name
        const author = await Author.findOne({ name: authorName }).exec()
        if (!author) {
          return []
        }
        const books = await Book.find({ author: author._id }).exec()
        return books
      } catch (error) {
        throw new Error('Error fetching book count: ' + error.message)
      }
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      if (args.title.length < 7) {
        throw new GraphQLError('Title is too short', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      if (args.author.length < 7) {
        throw new GraphQLError('Authors name is too short', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.author,
          },
        })
      }

      let existingAuthor = await Author.findOne({ name: args.author })

      if (!existingAuthor) {
        const newAuthor = new Author({
          name: args.author,
        })
        existingAuthor = await newAuthor.save()
      }

      const newBook = new Book({
        title: args.title,
        published: args.published,
        author: existingAuthor,
        genres: args.genres,
      })

      const savedBook = await newBook.save()
      pubsub.publish('BOOK_ADDED', { bookAdded: savedBook })

      return savedBook
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if (!currentUser) {
        throw new GraphQLError('not authenticated', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      try {
        const author = await Author.findOne({ name: args.name })

        if (!author) {
          return null
        }

        author.born = args.setBornTo
        await author.save()

        return author
      } catch (error) {
        throw new Error('Error updating author: ' + error.message)
      }
    },
    createUser: async (root, args) => {
      if (args.username.length < 5) {
        throw new GraphQLError('Too short username', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.title,
          },
        })
      }

      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      })

      return user.save().catch((error) => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error,
          },
        })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT',
          },
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
        favoriteGenre: user.favoriteGenre,
      }

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    },
  },
}

const schema = makeExecutableSchema({ typeDefs, resolvers })

const server = new ApolloServer({
  schema,
  plugins: [
    // Proper shutdown for the HTTP server.
    ApolloServerPluginDrainHttpServer({ httpServer }),

    // Proper shutdown for the WebSocket server.
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose()
          },
        }
      },
    },
  ],
})

// Creating the WebSocket server
const wsServer = new WebSocketServer({
  // This is the `httpServer` we created in a previous step.
  server: httpServer,
  // Pass a different path here if app.use
  // serves expressMiddleware at a different path
  path: '/graphql',
})

// Hand in the schema we just created and have the
// WebSocketServer start listening.
const serverCleanup = useServer(
  {
    schema,
  },
  wsServer
)

const corsOptions = {
  origin: [
    'https://studio.apollographql.com',
    'http://localhost:3000',
    'https://localhost:3000',
  ],
  credentials: true,
}

server.start().then(() => {
  app.use(
    '/graphql',
    cors(corsOptions),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => {
        const auth = req ? req.headers.authorization : null
        if (auth && auth.startsWith('Bearer ')) {
          const token = auth.substring(7)
          try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
            const currentUser = await User.findById(decodedToken.id)
            return { currentUser }
          } catch (error) {
            console.error('Token Verification Error:', error)
          }
        }
      },
    })
  )
})

const PORT = 4000
// Now that our HTTP server is fully set up, we can listen to it.
httpServer.listen(PORT, () => {
  console.log(`🚀 Query endpoint ready at http://localhost:${PORT}/graphql`)
  console.log(
    `🚀 Subscription endpoint ready at ws://localhost:${PORT}/graphql`
  )
})

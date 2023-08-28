const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')
const User = require ('./models/user')
const Book = require ('./models/book')
const Author = require ('./models/author')

const resolvers = {
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
        const authors = await Author.find()
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
          return 0
        }

        const bookCount = await Book.countDocuments({
          author: author._id,
        }).exec()
        return bookCount
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
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers

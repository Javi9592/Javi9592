describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3003/api/users/', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.get('#username').should('exist')
    cy.get('#password').should('exist')
    cy.contains('login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()

      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('wrong')
      cy.get('#login-button').click()

      cy.get('.alert')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'Matti Luukkainen logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('A blog can be created', function() {
      cy.contains('newBlog').click()
      cy.get('#newTitle').type('How to configure ESLint and Prettier in an Expo project')
      cy.get('#newAuthor').type('Aman Mittal')
      cy.get('#newUrl').type('https://amanhimself.dev/blog/configure-eslint-prettier-expo-project')
      cy.get('#create-button').click()

      cy.contains('How to configure ESLint and Prettier in an Expo project')
      cy.contains('view').click()
      cy.contains('like')
    })

    describe('a blog exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'How to configure ESLint and Prettier in an Expo project', author: 'Aman Mittal', url: 'https://amanhimself.dev/blog/configure-eslint-prettier-expo-project' })
      })

      it('user can like the blog', function () {
        let count = 0
        cy.get('#view').click()
        cy.get('#like').click()
        count++
        cy.contains(`likes: ${count}`)
      })

      it('user can delete the blog', function () {
        cy.get('#view').click()
        cy.get('#remove').click()
        cy.contains('a blog How to configure ESLint and Prettier in an Expo project has been removed')
      })
    })
    describe('different blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({ title: 'Middle likes Title', author: 'Aman Mittal', url: 'https://amanhimself.dev/blog/configure-eslint-prettier-expo-project' })
        cy.createBlog({ title: 'Less likes Title', author: 'Michael Chan', url: 'https://reactpatterns.com/' })
        cy.createBlog({ title: 'Most likes Title', author: 'Robert C. Martin', url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll' })
      })
      it.only('user can check the order of the blogs', function () {
        cy.contains('Most likes Title').parent().find('#view').click()
        cy.contains('Most likes Title').parent().find('#like').click().click()
        cy.wait(1000)
        cy.contains('Most likes Title').parent().find('#like').click().click()
        cy.wait(1000)
        cy.contains('Middle likes Title').parent().find('#view').click()
        cy.contains('Middle likes Title').parent().find('#like').click().click()
        cy.wait(1000)

        cy.visit('http://localhost:3000')
        cy.get('.blog').eq(0).should('contain', 'Most likes Title')
        cy.get('.blog').eq(1).should('contain', 'Middle likes Title')
        cy.get('.blog').eq(2).should('contain', 'Less likes Title')
      })
    })
  })

  describe('new user try to delete one blog', function () {
    beforeEach(function () {
      const user = {
        name: 'Javier',
        username: 'javier',
        password: 'javier'
      }
      cy.request('POST', 'http://localhost:3003/api/users/', user)
      cy.login({ username: 'javier', password: 'javier' })
      cy.createBlog({ title: 'How to configure ESLint and Prettier in an Expo project', author: 'Aman Mittal', url: 'https://amanhimself.dev/blog/configure-eslint-prettier-expo-project' })
      cy.visit('http://localhost:3000')
      cy.contains('logout').click()
      cy.login({ username: 'mluukkai', password: 'salainen' })
    })

    it('loggin and try to delete, but user is Unauthorized', function () {
      cy.contains('view').click()
      cy.contains('remove').click()
      cy.contains('Unauthorized to delete')
    })
  })
})
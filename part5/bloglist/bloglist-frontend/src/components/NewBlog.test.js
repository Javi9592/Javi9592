import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import NewBlog from './NewBlog'

test('<NewBlog /> updates parent state and calls onSubmit', () => {
  const newBlog = jest.fn()

  const component = render(
    <NewBlog addBlog={newBlog} />
  )

  const title = component.container.querySelector('#newTitle')
  const author = component.container.querySelector('#newAuthor')
  const url = component.container.querySelector('#newUrl')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'How to configure ESLint and Prettier in an Expo project' }
  })
  fireEvent.change(author, {
    target: { value: 'Amman Mittal' }
  })
  fireEvent.change(url, {
    target: { value: 'https://amanhimself.dev/blog/configure-eslint-prettier-expo-project' }
  })
  fireEvent.submit(form)

  expect(newBlog.mock.calls).toHaveLength(1)
  expect(newBlog.mock.calls[0][0].title).toBe('How to configure ESLint and Prettier in an Expo project' )
  expect(newBlog.mock.calls[0][0].author).toBe('Amman Mittal' )
  expect(newBlog.mock.calls[0][0].url).toBe('https://amanhimself.dev/blog/configure-eslint-prettier-expo-project' )
})
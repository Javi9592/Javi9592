
import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import Blog from './Blog'

describe('<Blog />', () => {
  let component

  const blog = {
    title: 'How to configure ESLint and Prettier in an Expo project',
    author: 'Aman Mittal',
    url: 'https://amanhimself.dev/blog/configure-eslint-prettier-expo-project',
    likes: 8
  }

  const user = {
    name: 'Javier Saldaño'
  }


  beforeEach(() => {
    component = render(
      <Blog blog={blog} user={user} />
    )
  })


  test('at start the children are not displayed', () => {
    const div = component.container.querySelector('.togglableContent2')
    const div2 = component.container.querySelector('.togglableContent1')

    expect(div).toHaveStyle('display: none')
    expect(div2).not.toHaveStyle('display: none')
  })

  test('after clicking the button, children are displayed', () => {
    const button = component.getByText('view')
    fireEvent.click(button)

    const div = component.container.querySelector('.togglableContent2')
    const div2 = component.container.querySelector('.togglableContent1')
    expect(div).not.toHaveStyle('display: none')
    expect(div2).toHaveStyle('display: none')
  })


})

test('clicking the button calls event handler two times', () => {
  const blog = {
    title: 'How to configure ESLint and Prettier in an Expo project',
    author: 'Aman Mittal',
    url: 'https://amanhimself.dev/blog/configure-eslint-prettier-expo-project',
    likes: 8
  }

  const user = {
    name: 'Javier Saldaño'
  }
  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} user={user} editBlog={mockHandler}/>
  )

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls).toHaveLength(2)
})


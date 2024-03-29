import React from 'react'

const Header = ({ course }) => <h1>{course}</h1>

const Total = ({ parts }) => {
  const sum = parts.reduce((sum, item) => sum + item.exercises, 0)
  return (
  <p><b>Number of exercises {sum}</b></p>
  )
}
const Part = ({ part }) => <p>{part.name} {part.exercises}</p>
const Content = ({ parts }) => <>{parts.map(item => (<Part part={item} key={item.id}/>))}</>

const Course = ({course}) =>
    <>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </>

export default Course
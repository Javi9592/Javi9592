import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Feedback = (props) => <div><h1>{props.text}</h1></div>

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = (props) => <tr><td>{props.text}</td><td>{props.result}</td></tr>

const Statistics = (props) => {

  if ((props.good + props.neutral + props.bad) === 0){
    return (
    <div>
      <h2>{props.text}</h2>
      <p>No feedback given</p>
    </div>)
  } else {
    return (
      <div>
        <h2>{props.text}</h2>
        <table>
          <StatisticLine result={props.good} text="good"/>
          <StatisticLine result={props.neutral} text="neutral"/>
          <StatisticLine result={props.bad} text="bad"/>
          <StatisticLine result={props.good + props.neutral + props.bad} text="all"/>
          <StatisticLine result={(props.good - props.bad)/(props.good + props.neutral + props.bad)} text="average"/>
          <StatisticLine result={(props.good * 100)/(props.good + props.neutral + props.bad)} text="positive"/>
        </table>
      </div>
    )
  } 
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <Feedback text="give feedback"/>
      <Button handleClick={() => setGood(good + 1)} text="good"/>
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral"/>
      <Button handleClick={() => setBad(bad + 1)} text="bad"/>
      <Statistics text="statistics" good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

ReactDOM.render(<App />, 
  document.getElementById('root')
)
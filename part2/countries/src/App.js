import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css';
import {weatherCodes} from './const'


const Filter = ({filterInput, handleFilterChange}) => <div>find countries: <input value={filterInput} onChange={handleFilterChange}/></div>

const Countries = ({filterNations, switchNations, showOne, weatherCapital}) => {
  return (
    <>
      {filterNations.length > 10 ? <h4>{switchNations}</h4> : filterNations.length > 1 ? filterNations.map((item, i) => {
        return (<h4 key={i}>{item.name.common} <button onClick={(e) => showOne(e,'value')} value={i}>show</button></h4>);
      }) : filterNations.length === 1 ? 
        <div key="filter"> 
          <h1>{filterNations[0].name.common}</h1>
          <p key="capital">Capital {filterNations[0].capital[0]}</p>
          <p key="population">Population {filterNations[0].population}</p>
          <h3>Languages</h3>
          <ul>
            {Object.values(filterNations[0].languages).map((item,i) => <p key={i}><b>·</b> {item}</p>)}
          </ul>
          {console.log(weatherCapital)}
          <img alt={filterNations[0].flags.alt} src={filterNations[0].flags.png}></img>
          <h3>Wheather in {filterNations[0].capital}</h3>
          <p><b>Temperature: {weatherCapital.current_weather?.temperature} celsius</b></p>
          <img src={weatherCodes[weatherCapital.current_weather?.weathercode]?.day?.image} alt={weatherCodes[weatherCapital.current_weather?.weathercode]?.day?.description}></img>
          <p>{weatherCodes[weatherCapital.current_weather?.weathercode]?.day?.description}</p>
          <p><b>Wind: {weatherCapital.current_weather?.windspeed}</b></p>
        </div> 
        : ''}
    </>
  )
}

function App() {
  const [ nations, setNations ] = useState([])
  const [ nameCountries, setNameCountries ] = useState([])
  const [ filterInput, setFilterInput ] = useState('')
  const [ filterNations, setFilterNations] = useState([])
  const [ weatherCapital, setWeatherCapital] = useState([])
  
  useEffect(() => {
    console.log('effect1')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('promise fulfilled')
        setNations(response.data)
        setNameCountries(response.data.map(item => item.name.common))
      })
  }, [])

  /*useEffect(() => {
    if (filterNations.length === 1) {
const capital = filterNations[0].capitalInfo
const params = {
  access_key: process.env.REACT_APP_API_KEY,
  query: capital
}
axios.get('http://api.weatherstack.com/current', {params})
        .then(response => {
          console.log('promise fulfilled 2')
          console.log(response.data)
        })
      }

  }, [filterNations])*/

  useEffect(() => {
    if (filterNations.length === 1) {
      const capital = filterNations[0].capitalInfo.latlng

      const params = {
        latitude: capital[0],
        longitude: capital[1]
      }
    
      axios.get('https://api.open-meteo.com/v1/forecast?current_weather=true&hourly=temperature_2m,relativehumidity_2m,windspeed_10m', {params})
        .then(response => {
          console.log('promise fulfilled 2')
          setWeatherCapital(response.data)
        })
      }

  }, [filterNations])

  const switchNations = filterNations.length > 10 ? "Too many matches, specify another filter" : []

  const handleFilterChange = (event) => {
    setFilterInput(event.target.value)
    filterNationsFunc(event.target.value)
  }

  const filterNationsFunc = (filter) => {
    const regex = new RegExp(filter, "i")
    const filteredListCountries = nameCountries.filter(item => item.match(regex))
    const copyNations = nations.filter(item => filteredListCountries.includes(item.name.common))
    setFilterNations(copyNations)
  }

  const showOne = (e) => {
    const index = e.target.value
    const chooseCountry = filterNations[index]
    setFilterNations([chooseCountry])
    setFilterInput('')
  }  
  return (
    <div key="main1">
      <Filter filterInput={filterInput} handleFilterChange={handleFilterChange} />
      <Countries filterNations={filterNations} switchNations={switchNations} showOne={showOne} weatherCapital={weatherCapital}/>
    </div>
  );
}

export default App;

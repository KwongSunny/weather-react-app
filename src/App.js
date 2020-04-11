import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './App.module.css'

function App() {
  const [search, setSearch] = useState();
  const [searching, setSearching] = useState(false);
  const [location, setLocation] = useState();
  const [currentTime, setCurrentTime] = useState();
  const [hourlyInfo, setHourlyInfo] = useState();
  const [dailyInfo, setDailyInfo] = useState();
  const unit = "imperial";
  const appID = "6dd2e40e4f5e4bef22ad159ca06b9dd7";

  //converts 0-6 to the day of the week
  const numToDay = (num) => {
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return weekdays[num];
  }

  //converts 0-11 to the month
  const numToMonth = (num) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[num];
  }

  useEffect(() => {
    if(search !== undefined)
    {
      axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${search}&units=imperial&${unit}&appid=${appID}`)
        .then(res => {
          setCurrentTime(new Date());
          setLocation(res.data);
        });
    }
  },[searching])

  useEffect(() => {
    if(location !== undefined)
    {
      axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${location.coord.lat}&lon=${location.coord.lon}&units=${unit}&appid=${appID}`)
      .then(res => {
        setHourlyInfo(res.data.hourly);
        setDailyInfo(res.data.daily);
      });
    }
  }, [location])


  if(location !== undefined && hourlyInfo !== undefined)
  {
    return (
      <div className="App">
          <div className = {styles.searchBar}>
              <input onChange = {e => {setSearch(e.target.value)}}></input>
              <button onClick = {e => {setSearching(!searching)}}>Search</button>
          </div>
          <div className = {styles.currentWeather}>
              {`${location.name}, ${location.sys.country}`}
              <br />
              {`${currentTime}`}
              <br />
              {`Current: ${location.main.temp}°F`}
              <br />
              {`High: ${location.main.temp_max}`}
              <br />
              {`Low: ${location.main.temp_min}`}
          </div>
          <div className = {styles.scrollableWeather}>
              <div className = {styles.hourly}>
                {
                  hourlyInfo.map(hour => 
                    <div className = {styles.hourlyItem}>
                        {`${numToDay(currentTime.getDay())}
                        , ${numToMonth(currentTime.getMonth())} ${currentTime.getDate()} ${currentTime.getFullYear()}
                        , ${currentTime.getHours()}:00`}
                        : {hour.temp}
                    </div>
                  )
                }
              </div>
              <div className = {styles.sevenDay}>

              </div>
          </div>
      </div>
    );        
  }
  else
  {
    return(
      <div className="App">
        <div className = {styles.searchBar}>
          <input onChange = {e => {setSearch(e.target.value)}}></input>
          <button onClick = {e => {setSearching(!searching)}}>Search</button>
        </div>
      </div>
    )
  }



}

export default App;

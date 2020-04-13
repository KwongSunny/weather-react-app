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
  const [showingHour, setShowingHour] = useState(true);
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

  const offsetTime = (date, seconds, minutes, hours, days) => {
    const newDate = new Date();
    newDate.setTime(date.getMilliseconds()
      + (seconds * 1000)
      + (minutes * 1000 * 60)
      + (hours * 1000 * 60 * 60)
      + (days * 1000 * 60 * 60 * 24))
    return newDate;
  }

  const switchScrollableContent = (thisElement, alternateElement) => {
    setShowingHour(!showingHour);
    thisElement.style.display = "block";
    alternateElement.style.display = "none";
  }

  useEffect(() => {
    if(search !== undefined)
    {
      axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${search}&units=${unit}&appid=${appID}`)
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


  if(location !== undefined && hourlyInfo !== undefined && dailyInfo !== undefined)
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
          <div>
            <button onClick = {e => {switchScrollableContent(document.getElementById("hourlyScroll"), document.getElementById("dailyScroll"))}}>48 hour</button>
            <button onClick = {e => {switchScrollableContent(document.getElementById("dailyScroll"), document.getElementById("hourlyScroll"))}}>15 day</button>
          </div>
          <div className = {styles.scrollableWeather}>
              <div id = "hourlyScroll" className = {styles.hourly}>
                {
                  hourlyInfo.map((hour, i) => 
                      <div className = {styles.hourlyItem}>
                          {`${(currentTime.getHours() + i)%24}:00`}
                          <br />
                          {hour.temp}
                          <div className = {styles.divider}/> 
                      </div> 
                  )
                }
              </div>
              <div id = "dailyScroll" className = {styles.sevenDay}>
              {
                dailyInfo.map((day, i) => 
                  <div className = {styles.hourlyItem}>
                      {`${offsetTime(currentTime, 0, 0, 0, 0).getDate()}`}
                      <br />
                      {

                      }
                      <div className = {styles.divider}/> 
                  </div> 
                )
              } 
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

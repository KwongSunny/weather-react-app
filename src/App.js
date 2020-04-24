import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from './App.module.css';
import './App.css';
import SimpleBar from 'simplebar-react';
import 'simplebar/dist/simplebar.min.css';

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
  let dailyScroll = undefined;

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

  const numToHour = (num) => {
    if(num > 11)
    {
      if(num%12 === 0)
        return `12:00 PM`
      else return `${num%12}:00 PM`
    }
    else
    {
      if(num%12 === 0)
        return `12:00 AM`
      else return `${num%12}:00 AM`
    }
  }

  const offsetTime = (date, seconds, minutes, hours, days) => {
    const newDate = new Date(Date.now());
    newDate.setTime(
      Date.now() 
      + date.getMilliseconds()
      + (seconds * 1000)
      + (minutes * 1000 * 60)
      + (hours * 1000 * 60 * 60)
      + (days * 1000 * 60 * 60 * 24))
    //console.log(newDate);
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

  useEffect(() => {
    if(dailyInfo !== undefined && dailyInfo.length === 8){
      dailyInfo.pop();
    }
  }, [dailyInfo])

  if(location !== undefined && hourlyInfo !== undefined && dailyInfo !== undefined)
  {
    return (
      <div className={styles.app}>
          <div className = {styles.searchBar}>
              <input onChange = {e => {setSearch(e.target.value)}}></input>
              <button onClick = {e => {setSearching(!searching)}}>Search</button>
          </div>
          <div className = {styles.currentWeather}>
              {`${location.name}, ${location.sys.country}`}
              <br />
              {`${numToDay(currentTime.getDay())}, ${numToMonth(currentTime.getMonth())} ${currentTime.getDate()} ${currentTime.getFullYear()}`}
              <br />
              {`Current: ${Math.round(location.main.temp)}°F`}
              <br />
              {`High: ${Math.round(location.main.temp_max)}°F`}
              <br />
              {`Low: ${Math.round(location.main.temp_min)}°F`}
              <br />
              {`Wind: ${Math.round(location.wind.speed)} MPH`}
          </div>
          <div>
            <button onClick = {e => {switchScrollableContent(document.getElementById("hourlyScroll"), document.getElementById("dailyScroll"))}}>48 hour</button>
            <button onClick = {e => {switchScrollableContent(document.getElementById("dailyScroll"), document.getElementById("hourlyScroll"))}}>7 day</button>
          </div>
          <div className = {styles.scrollableWeather}>
              <SimpleBar id = "hourlyScroll" className = {styles.hourly}>
                <div className = {styles.itemSpacer}/>
                {
                  hourlyInfo.map((hour, i) => 
                      <div className = {styles.hourlyItem}>
                          {`${numToMonth(offsetTime(currentTime, 0, 0, i, 0).getMonth())} ${offsetTime(currentTime, 0, 0, i, 0).getDate()}`}
                          <br /> 
                          {`${numToHour(offsetTime(currentTime, 0, 0, i, 0).getHours())}`}
                          <br />
                          {`${Math.round(hour.temp)}°F`}
                          <br />
                          {`Wind: ${Math.round(hour.wind_speed)} MPH`}
                          <div className = {styles.divider}/> 
                      </div> 
                  )
                }
              </SimpleBar>
              <div id = "dailyScroll" className = {styles.sevenDay}>
                <div className = {styles.itemSpacer}></div>
                {
                  dailyInfo.map((day, i) => 
                    <div className = {styles.dailyItem}>
                        {`${numToMonth(offsetTime(currentTime, 0, 0, 0, i).getMonth())} ${offsetTime(currentTime, 0, 0, 0, i).getDate()}`}
                        <br />
                        {`High: ${Math.round(day.temp.max)}°F`}
                        <br />
                        {`Low: ${Math.round(day.temp.min)}°F`}
                        <br />
                        {`Wind: ${Math.round(day.wind_speed)} MPH`}
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
        <SimpleBar style={{ height: '300px' }}>
          {[...Array(50)].map((x, i) =>
            <p key={i} className="odd">Some content</p>
          )}
        </SimpleBar>
      </div>
    )
  }



}

export default App;

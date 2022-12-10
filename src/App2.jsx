import { useState } from 'react'

import './App.css'
import { useEffect } from 'react'

function App() {
const [displayTime, setDisplayTime] = useState(1500);
const [breakTime, setBreakTime] = useState(300);
const [sessionTime, setSessionTime] = useState(1500);
const [timerOn, setTimerOn] = useState(false);
const [onBreak, setOnBreak] = useState(false);
const [breakAudio, setBreakAudio] = useState(new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"));

const playBreakSound = () => {
  breakAudio.currentTime = 0;
  breakAudio.play()
}

const formatTime = (time) => {
  let minutes = Math.floor(time/60)
  let seconds = time % 60
  return (
    (minutes < 10 ? "0" + minutes: minutes) + ":" +
    (seconds < 10 ? "0" + seconds : seconds)
  );
}

const changeTime = (amount,type) => {
  if(type == 'break') {
    if(breakTime <= 60 && amount < 0 || breakTime >= 3600 || timerOn== true){
      return
    } 
    setBreakTime(prev => prev + amount)
  } else {
    if(type == 'session'){

      if (sessionTime <= 60 && amount < 0 || sessionTime <= 0 && amount <= 0 || timerOn == true || sessionTime > 3600) {
        return
      } 
      setSessionTime((prev)=> prev + amount)
    }
 
}
const resetTime = () => {
  setDisplayTime(25* 60)
  setBreakTime(5*60)
  setSessionTime(25*60)
}
const controlTime = ()=> {
  let second = 1000;
  let date= new Date().getTime()
  let nextDate = new Date().getTime()+ second
  let onBreakVariable = onBreak;

  if(!timerOn){
    let interval = setInterval(()=> {
      date = new Date().getTime();
      if(date > nextDate){
        setDisplayTime(prev => {
          if(prev <= 0 && !onBreakVariable){
         playBreakSound();
         onBreakVariable = true;
         setOnBreak(true);
         return breakTime;
        } else if(prev <= 0 && onBreakVariable){
          playBreakSound();
          onBreakVariable = false;
          setOnBreak(false);
          return sessionTime;
        }
          return prev - 1
        })
        nextDate += second
      }
    }, 1000);
    // store and clear interval
    localStorage.clear()
    localStorage.setItem('interval-id', interval)
  }
  if (timerOn){
    clearInterval(localStorage.getItem('interval-id'));
  }
  setTimerOn(!timerOn)
}

  return (
    <div className="App">
     <Titles
    title={"break length"}
    type={"break"}
    changeTime={changeTime}
    formatTime={formatTime}
    time={breakTime}
    label={"break-label"}
    />
     <Titles
    title={"session length"}
    type={"session"}
    changeTime={changeTime}
    formatTime={formatTime}
    time={sessionTime}
    label={'session-label'}
    />
    <h2 id="timer-label">{onBreak ? "Break": "Session" }</h2>
<h1 id="time-left">  {formatTime(displayTime)}</h1>
<button id="start_stop" onClick={controlTime}>Play</button>
<button  id="reset" onClick={resetTime}>Reset</button>
</div>
    
  )

  function  Titles({title , changeTime, type, time, formatTime, id, label}){
    return (
      <div>
        <h3 id={label}>{title}</h3>
        <div className='time-sets'>
          <button id={`${type}-decrement`} onClick={() =>changeTime(-60,type)}></button>
          <h3 id={`${type}-length`}>{time/60}</h3>
          <button id={`${type}-increment`} onClick={() =>changeTime(60,type)}></button>
        </div>
      </div>
    )
  }
}

export default App

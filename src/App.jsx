import { useState, useEffect, useRef } from 'react';

import './App.css';


function App() {
const [sessionTime, setSessionTime] = useState(25*60);
const [breakTime, setBreakTime] = useState(5*60);
const [runTime, setrunTime] = useState(false);
const [runBreak, setRunBreak] = useState(false);
const [mode, setMode] = useState("uninit")
const [delay, setDelay] = useState(1000)
const [count, setCount] = useState(5)

const [sessionC, setSessionC] = useState(25)
const [breakAudio, setBreakAudio] = useState(new Audio("https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav"));

//Time Format
const formatTime = (time) => {
  let minutes = Math.floor(time/60);
  let seconds = time % 60;
  return (
    (minutes < 10 ? "0" + minutes: minutes) + ":" +
    (seconds < 10 ? "0" + seconds : seconds)
    
    );
  }


// Playing Beeps
const playBreakSound = () => {
  document.getElementById('beep').currentTime = 0;
 document.getElementById('beep').play();
}
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}
// Incrementing and Decrementing lengths
const incrementTimer = () => {
  if (runTime || runBreak){
    return 
  }
  setSessionC(sessionC + 1)
  setSessionTime((sessionC + 1) * 60 )
if(sessionC >= 60) {
 return setSessionC(60)
}
} 
 const decrementTimer = () => {
  if (runTime || runBreak){
    return 
  }
  
  if( sessionC <= 1){
     setSessionTime(60);
  } else {
    setSessionC(sessionC - 1)
    setSessionTime((sessionC-1)* 60);
  }

}
const incrementBreak = () => {
  if (runTime || runBreak){
     return
  }
  setCount(count+1)
  setBreakTime((count+1) * 60 )
  if(count >= 60){
   return setCount(60)
  }
}
  const decrementBreak = () => {
    if (runTime || runBreak){
       return
    }
  if(count == 1){
    return setCount(1)
  } else {
    setCount(count -1)
    setBreakTime((count-1)* 60);
  }
}
////////////////////////////////////////////

// Custom Hook for countdown timer
function useInterval(callback, delay) {
  const savedCallback = useRef();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }
    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}



  useInterval(()=> {
    
    console.log("break:" , runBreak, "session:", runTime)
    
    if(runTime){
     
   
        setSessionTime((prev) => prev? prev - 1 : 0 )
     
      
       if(sessionTime <= 0){
         playBreakSound();
         
         
         setrunTime(false);
         // Somehow fails  test #13 and #15
         setSessionTime(Number((document.getElementById('session-length').textContent)) * 60);
         setBreakTime(Number((document.getElementById('break-length').textContent))* 60);
       
          setRunBreak(true);
        
            setMode("break");

              console.log('break')
              
              
              
            }
      
       }
       
       
       if( mode=="break" || runBreak){
         
         setBreakTime((prev)=> prev? prev - 1: 0)
         
         if(breakTime <= 0 ){
           playBreakSound();
          
             
             setRunBreak(false);
             setSessionTime(Number((document.getElementById('session-length').textContent)) * 60);
             setBreakTime(Number((document.getElementById('break-length').textContent))* 60);
            
               setrunTime(true);
              
              setMode("runTime");
      
      
      }
    }

  }, runTime || runBreak ? delay: null);









const runTimer = () => {
 
if(mode == "uninit"){
  setrunTime(true);
  setMode("runTime")
} else if(mode=="runTime"){
  setrunTime(false);
  setMode("runTimePaused");
} else if(mode == "runTimePaused"){
  setrunTime(true);
  setMode("runTime");
} else if(mode == "break"){
  setRunBreak(false);
  setMode("breakPaused");
} else if(mode == "breakPaused"){
  setRunBreak(true);
  setMode("break");
} else {mode =="uninit"}

}



const sessionLabel = () =>{
  if(mode == "uninit"){
    return('Session')
  } else if(mode=="runTime" || mode=="runTimePaused"){
    return ('Session')
  } else if(mode=="break" || mode=="breakPaused") {
    return ('Break')
  }
}
const timerLabel = () => {
 
    if(mode == "uninit"){
      return formatTime(sessionTime)
    } else if(mode=="runTime" || mode=="runTimePaused"){
      return formatTime(sessionTime)
    } else if(mode=="break" || mode=="breakPaused") {
      return formatTime(breakTime)
    }
  
}
const globalReset = () =>{
  document.getElementById('beep').currentTime = 0;
  document.getElementById('beep').pause();
  setMode('uninit')
  setrunTime(false);
  setRunBreak(false);
  
  setSessionTime(25*60);
  setBreakTime(5*60);
  setCount(5);
  setSessionC(25);
}




  return (
    <div className="App">
      <audio id="beep"  preload="true">
        <source src="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav" type="audio/wav"/>
          </audio>
      <h1>25+5 Clock</h1>
      
      <div className='Breaks-Length'>
    <h3 id="break-label">Break Length</h3>
   
    <button id="break-increment" onClick={()=>{
      incrementBreak();
     
    }}>Up</button> <h3 id="break-length"  >{count}</h3> <button id="break-decrement" onClick={()=> {
      decrementBreak();
    
    }}>down</button>
      </div >

      <div className='Session-Length'>
    <h3 id="session-label">Session Length</h3>
    <button id="session-increment"  onClick={()=>{
      incrementTimer();
      
    }}>Up</button><h3 id="session-length" >{sessionC}</h3><button id="session-decrement" onClick={()=>{
      decrementTimer();
      
    }}>down</button>
      </div>
      <div className='session'>
<h2 id="timer-label">{sessionLabel()}</h2>
    <h2 id="time-left" > {timerLabel()}</h2>
      </div>
<div className='Buttons'>
<button id="start_stop" onClick={runTimer}>Start</button><button onClick={globalReset} id="reset">Reset</button>

</div>

    </div>
  )
}


export default App

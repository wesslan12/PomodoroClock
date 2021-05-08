const useState = React.useState;
const useEffect = React.useEffect;
const useRef = React.useRef;

const audioSrc ="https://raw.githubusercontent.com/freeCodeCamp/cdn/master/build/testable-projects-fcc/audio/BeepSound.wav";

function App(){

const [displayTime, setDisplayTime] = useState(25*60);
const [breakTime, setBreakTime] = useState(5*60);
const [sessionTime, setSessionTime] = useState(25*60);
const [timerOn, setTimerOn] = useState(false);
const [onBreak, setOnBreak] = useState(false);
//const [breakAudio, setBreakAudio] = React.useState(
    //new Audio("./breakTime.mp3"));

let player = useRef(null);

useEffect(() => {
    if(displayTime <= 0) {
        setOnBreak(true);
        playBreakSound();
    } else if (!timerOn && displayTime === breakTime) {
        setOnBreak(false);
    }
    console.log("test")
}, [displayTime, onBreak, timerOn, breakTime, sessionTime]);

const playBreakSound = () => {
    player.currentTime = 0;
    player.play();
}
const formatDisplayTime = (time) => {
    let minutes = Math.floor(time/60);
    let seconds = time % 60;
    return (
        (minutes < 10 ? "0" + minutes : minutes) + 
        ":" +
        (seconds < 10 ? "0" + seconds : seconds)
    );
};
const formatTime = (time) => {
    return time / 60;
};

const changeTime = (amount, type) => {
    if(type === "break"){
        if((breakTime <= 60 && amount < 0) || breakTime >= 60 * 60){
            return;
        }
        setBreakTime((prev) => prev + amount);
    }else{
        if((sessionTime <= 60 && amount < 0) || sessionTime >= 60 * 60){
            return;
        }
        setSessionTime((prev) => prev + amount);
        if(!timerOn){
            setDisplayTime(sessionTime + amount);
        }
    }
};
const controlTime = () => {
    let second = 1000;
    let date = new Date().getTime();
    let nextDate = new Date().getTime() + second;
    let onBreakVariable = onBreak;
    if(!timerOn) {
       let interval = setInterval(() => {
           date = new Date().getTime();
           if(date > nextDate) {
               setDisplayTime((prev) => {
                   if(prev <= 0 && !onBreakVariable){
                       //playBreakSound();
                       onBreakVariable=true;
                       //setOnBreak(true)
                       return breakTime;
                   }else if(prev <=0 && onBreakVariable){
                        //playBreakSound();
                        onBreakVariable=false;
                        setOnBreak(false)
                        return sessionTime;
                   }
                   return prev - 1;
               });
               nextDate += second;
           }       
       }, 30);
       localStorage.clear();
       localStorage.setItem("interval-id", interval)
    }

    if(timerOn) {
       clearInterval(localStorage.getItem("interval-id"));
    }
    setTimerOn(!timerOn);
};
const resetTime = () => {
    clearInterval(localStorage.getItem("interval-id"));
    setDisplayTime(25*60);
    setBreakTime(5*60);
    setSessionTime(25*60);
    player.pause();
    player.currentTime = 0;
    setTimerOn(false);
    setOnBreak(false);

};
    return (
        <div className="center-align">
            <h1>Pomodoro Clock</h1>
            <div className="dual-container">
                <Length 
                title={"Break length"} 
                changeTime={changeTime} 
                type={"break"} 
                time={breakTime}
                formatTime={formatTime}
                formatDisplayTime={formatDisplayTime}
                />
                <Length
                title={"Session length"} 
                changeTime={changeTime} 
                type={"session"} 
                time={sessionTime}
                formatTime={formatTime}
                formatDisplayTime={formatDisplayTime}
                />
            </div>
            <h3 className="text-center disply-4" id="timer-label">
                {onBreak ? "Break" : "Session"}
            </h3>
            <h1 id="time-left">
                {formatDisplayTime(displayTime)}
            </h1>
            <button className="btn-small deep-purple lighten-2" id="start_stop" onClick={controlTime}>
                {timerOn ? (
                    <i className="material-icons">paus_circle_filled</i>
                ) : (
                    <i className="material-icons" id="start_stop">play_circle_filled</i>
                )}
            </button>
            <button className="btn-small deep-purple lighten-2" id="reset" onClick={resetTime}>
                <i className="material-icons">autorenew</i>
            </button>
            <audio ref={(t) => (player = t)} src={audioSrc} id="beep" />
            
        </div>
        );
}

function Length({title, changeTime, type, time, formatTime}) {
    return (
<div>
    <h3
        id={type === "break" ? "break-label" : "session-label"}
        >
            {title}
    </h3>
    <div className="time-sets">
        <button className="btn-small deep-purple lighten-2" 
            id={type === "break" ? "break-decrement" : "session-decrement"}
            onClick={() => changeTime(-60, type)}
        >
            <i className="material-icons">arrow_downward</i>
        </button>
        <h3
          id={type === "break" ? "break-length" : "session-length"}
        >
          {formatTime(time)}
        </h3>
        <button className="btn-small deep-purple lighten-2"
        id={type === "break" ? "break-increment" : "session-increment"}
        onClick={() => changeTime(60, type)}>
            <i className="material-icons">arrow_upward</i>
        </button>
    </div>
</div>
    );
}

ReactDOM.render(<App/>, document.getElementById("root"));
import React, {useEffect, useRef, useState} from 'react';
import './Timer.css';

export default function Timer() {
    const [inputTime, setInputTime] = useState({h: 0, m: 0, s: 0});
    const [timeLeft, setTimeLeft] = useState(0);
    const [totalDuration, setTotalDuration] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [isInputting, setIsInputting] = useState(true);
    const timerRef = useRef(null);

    const playAlarm = () => {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
        gain.gain.setValueAtTime(0.01, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
    };

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            document.title = `(${formatTime(timeLeft)}) Timer`;
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            document.title = "TIME'S UP!";
            playAlarm();
            if (Notification.permission === 'granted') {
                new Notification('Timer Finished', { body: '時間到了老哥' });
            }
        } else {
            document.title = 'React Timer';
        }
        return () => clearInterval(timerRef.current);
    }, [isRunning, timeLeft]);

    const handleStart = () => {
        const totalSeconds = (parseInt(inputTime.h) || 0) * 3600 +
            (parseInt(inputTime.m) || 0) * 60 +
            (parseInt(inputTime.s) || 0);
        if (totalSeconds > 0) {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
            setTotalDuration(totalSeconds);
            setTimeLeft(totalSeconds);
            setIsInputting(false);
            setIsRunning(true);
        }
    };

    const handleReset = () => {
        setIsRunning(false);
        setIsInputting(true);
        setTimeLeft(0);
        setTotalDuration(0);
        setInputTime({h: 0, m: 0, s: 0});
    };

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleChange = (e, field) => {
        let val = parseInt(e.target.value) || 0;
        if (val < 0) val = 0;
        if (field !== 'h' && val > 59) val = 59;
        setInputTime({...inputTime, [field]: val});
    };

    const progressPercentage = totalDuration > 0 ? (timeLeft / totalDuration) * 100 : 0;

    return (
        <div className="timer-container">
            {isInputting ? (
                <div className="timer-input-group">
                    <div className="time-field-wrapper">
                        <div className="time-field">
                            <input
                                type="number"
                                value={inputTime.h}
                                onChange={(e) => handleChange(e, 'h')}
                                onFocus={(e) => e.target.select()}
                            />
                            <span>HOURS</span>
                        </div>
                        <div className="time-field">
                            <input
                                type="number"
                                value={inputTime.m}
                                onChange={(e) => handleChange(e, 'm')}
                                onFocus={(e) => e.target.select()}
                            />
                            <span>MINS</span>
                        </div>
                        <div className="time-field">
                            <input
                                type="number"
                                value={inputTime.s}
                                onChange={(e) => handleChange(e, 's')}
                                onFocus={(e) => e.target.select()}
                            />
                            <span>SECS</span>
                        </div>
                    </div>
                    <button className="timer-btn start" onClick={handleStart}>START TIMER</button>
                </div>
            ) : (
                <div className="timer-display-group">
                    <div className={`timer-digits ${timeLeft === 0 ? 'finished' : ''}`}>
                        {formatTime(timeLeft)}
                    </div>
                    <div className="timer-progress-track">
                        <div
                            className="timer-progress-fill"
                            style={{width: `${progressPercentage}%`}}
                        ></div>
                    </div>
                    <div className="timer-controls">
                        <button className="timer-btn toggle" onClick={() => setIsRunning(!isRunning)}>
                            {isRunning ? 'PAUSE' : 'RESUME'}
                        </button>
                        <button className="timer-btn reset" onClick={handleReset}>RESET</button>
                    </div>
                </div>
            )}
        </div>
    );
}
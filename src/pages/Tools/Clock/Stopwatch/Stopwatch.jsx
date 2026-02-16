import { useState, useRef, useEffect } from "react";
import "./Stopwatch.css";

export default function Stopwatch() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const startTimeRef = useRef(0);
    const requestRef = useRef();

    useEffect(() => {
        const savedData = localStorage.getItem("ethan_stopwatch");
        if (savedData) {
            const { savedTime, savedIsRunning, lastTimestamp } = JSON.parse(savedData);

            if (savedIsRunning) {
                const gap = Date.now() - lastTimestamp;
                const totalTime = savedTime + gap;
                setTime(totalTime);
                startTimeRef.current = Date.now() - totalTime;
                setIsRunning(true);
                requestRef.current = requestAnimationFrame(step);
            } else {
                setTime(savedTime);
            }
        }
    }, []);

    useEffect(() => {
        const handleSave = () => {
            const data = {
                savedTime: time,
                savedIsRunning: isRunning,
                lastTimestamp: Date.now()
            };
            localStorage.setItem("ethan_stopwatch", JSON.stringify(data));
        };

        handleSave();
    }, [time, isRunning]);

    const format = (ms) => {
        const s = Math.floor(ms / 1000);
        const m = Math.floor(s / 60);
        const msPart = Math.floor((ms % 1000) / 10);
        return `${String(m % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}.${String(msPart).padStart(2, "0")}`;
    };

    const step = () => {
        setTime(Date.now() - startTimeRef.current);
        requestRef.current = requestAnimationFrame(step);
    };

    const toggle = () => {
        if (!isRunning) {
            startTimeRef.current = Date.now() - time;
            setIsRunning(true);
            requestRef.current = requestAnimationFrame(step);
        } else {
            setIsRunning(false);
            cancelAnimationFrame(requestRef.current);
        }
    };

    const handleReset = () => {
        setTime(0);
        setIsRunning(false);
        cancelAnimationFrame(requestRef.current);
        localStorage.removeItem("ethan_stopwatch");
    };

    return (
        <div className="stopwatch-wrapper">
            <div className="sw-display">{format(time)}</div>
            <div className="sw-controls">
                <button className="sw-btn reset" onClick={handleReset}>RESET</button>
                <button className={`sw-btn ${isRunning ? "stop" : "start"}`} onClick={toggle}>{isRunning ? "STOP" : "START"}</button>
            </div>
        </div>
    );
}
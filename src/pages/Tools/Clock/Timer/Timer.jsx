import { useState, useEffect, useRef } from "react";
import "./Timer.css";

export default function Timer() {
    const [ms, setMs] = useState(1500000);
    const [isRunning, setIsRunning] = useState(false);
    const timerRef = useRef();

    useEffect(() => {
        if (isRunning && ms > 0) {
            timerRef.current = setInterval(() => setMs(v => Math.max(0, v - 1000)), 1000);
        } else { clearInterval(timerRef.current); }
        return () => clearInterval(timerRef.current);
    }, [isRunning, ms]);

    const format = (milli) => {
        const s = Math.floor(milli / 1000);
        return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
    };

    return (
        <div className="tool-full-page">
            <div className="tm-container">
                <div className="tm-display">{format(ms)}</div>
                <div className="tm-controls">
                    <button className="tm-btn" onClick={() => setIsRunning(!isRunning)}>
                        {isRunning ? "PAUSE" : "START"}
                    </button>
                    <button className="tm-btn" onClick={() => {setIsRunning(false); setMs(1500000);}}>RESET</button>
                </div>
            </div>
        </div>
    );
}
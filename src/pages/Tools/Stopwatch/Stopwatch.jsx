import React, { useState, useEffect, useRef } from 'react';
import './Stopwatch.css';

export default function Stopwatch() {
    const [time, setTime] = useState(0);
    const [running, setRunning] = useState(false);
    const [laps, setLaps] = useState([]);

    const timerRef = useRef(null);
    const startTimeRef = useRef(0);
    const accumulatedTimeRef = useRef(0);

    useEffect(() => {
        if (running) {
            startTimeRef.current = Date.now() - accumulatedTimeRef.current;
            timerRef.current = setInterval(() => {
                const now = Date.now();
                const delta = now - startTimeRef.current;
                setTime(delta);
                accumulatedTimeRef.current = delta;
            }, 10);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [running]);

    const handleReset = () => {
        setRunning(false);
        setTime(0);
        setLaps([]);
        accumulatedTimeRef.current = 0;
    };

    const format = (ms) => {
        const m = Math.floor(ms / 60000);
        const s = Math.floor((ms % 60000) / 1000);
        const l = Math.floor((ms % 1000) / 10);
        return {
            main: `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`,
            ms: l.toString().padStart(2, '0')
        };
    };

    const t = format(time);

    return (
        <div className="sw-card">
            <div className="sw-display">
                <span className="sw-main">{t.main}</span>
                <span className="sw-dot">.</span>
                <span className="sw-sub">{t.ms}</span>
            </div>

            <div className="sw-actions">
                <button
                    className={`sw-btn ${running ? 'btn-stop' : 'btn-start'}`}
                    onClick={() => setRunning(!running)}
                >
                    {running ? 'STOP' : 'START'}
                </button>
                <button
                    className="sw-btn btn-lap"
                    onClick={() => setLaps([time, ...laps])}
                    disabled={!running && time === 0}
                >
                    Lap
                </button>
                <button
                    className="sw-btn btn-reset"
                    onClick={handleReset}
                >
                    Reset
                </button>
            </div>

            {laps.length > 0 && (
                <div className="sw-laps-area">
                    {laps.map((lt, i) => {
                        const lf = format(lt);
                        return (
                            <div key={i} className="sw-lap-row">
                                <span className="lap-idx">Lap {laps.length - i}</span>
                                <span className="lap-val">{lf.main}<small>.{lf.ms}</small></span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
import { useEffect, useRef, useState, useLayoutEffect } from "react";
import Navbar from "./Navbar.jsx";
import "./Clock.css";

export default function Clock() {
    const [mode, setMode] = useState("CLOCK");
    const [timeStr, setTimeStr] = useState("00:00.00");
    const [isRunning, setIsRunning] = useState(false);
    const [fontSize, setFontSize] = useState(16); // 單位: vw
    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const requestRef = useRef();
    const startTimeRef = useRef(0);
    const elapsedRef = useRef(0);
    const displayRef = useRef(null);
    const idleTimerRef = useRef(null);

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        const d = Math.floor(totalSeconds / 86400);
        const h = Math.floor((totalSeconds % 86400) / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const pad = (num) => String(num).padStart(2, "0");

        if (d > 0) return `${d}:${pad(h)}:${pad(m)}:${pad(s)}`;
        if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}.${pad(centiseconds)}`;
        return `${pad(m)}:${pad(s)}.${pad(centiseconds)}`;
    };

    const resetIdleTimer = () => {
        setShowControls(true);
        if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
        idleTimerRef.current = setTimeout(() => {
            if (isRunning || mode === "CLOCK") setShowControls(false);
        }, 3000);
    };

    useLayoutEffect(() => {
        if (displayRef.current) {
            const containerWidth = window.innerWidth * 0.95;
            const textWidth = displayRef.current.scrollWidth;
            if (textWidth > containerWidth) {
                const newSize = (containerWidth / textWidth) * fontSize;
                setFontSize(newSize);
            }
        }
    }, [timeStr, fontSize]);

    const animate = () => {
        if (mode === "CLOCK") {
            const now = new Date();
            setTimeStr(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`);
            requestRef.current = setTimeout(animate, 1000);
        } else {
            const currentElapsed = isRunning
                // eslint-disable-next-line react-hooks/purity
                ? Date.now() - startTimeRef.current + elapsedRef.current
                : elapsedRef.current;
            setTimeStr(formatTime(currentElapsed));
            requestRef.current = requestAnimationFrame(animate);
        }
    };

    useEffect(() => {
        animate();
        window.addEventListener("mousemove", resetIdleTimer);
        const fsChange = () => setIsFullscreen(!!document.fullscreenElement);
        document.addEventListener("fullscreenchange", fsChange);

        return () => {
            clearTimeout(requestRef.current);
            cancelAnimationFrame(requestRef.current);
            window.removeEventListener("mousemove", resetIdleTimer);
            document.removeEventListener("fullscreenchange", fsChange);
        };
    }, [mode, isRunning]);

    const toggleStopwatch = () => {
        if (!isRunning) {
            startTimeRef.current = Date.now();
            setIsRunning(true);
        } else {
            elapsedRef.current += Date.now() - startTimeRef.current;
            setIsRunning(false);
        }
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <div className={`clock-shell ${!showControls ? "hide-cursor" : ""}`}>
            <div className={`clock-nav-container ${(!showControls || isFullscreen) ? "fade-out" : ""}`}>
                <Navbar />
            </div>

            <div
                ref={displayRef}
                className="time-display"
                style={{ fontSize: `${fontSize}vw` }}
            >
                {timeStr}
            </div>
            <div className={`ui-overlay ${showControls ? "visible" : "hidden"}`}>
                <button className="btn-fs" onClick={toggleFullscreen}>
                    {isFullscreen ? (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
                    ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    )}
                </button>

                <div className={`controls-layer ${mode === "STOPWATCH" ? "is-stopwatch" : ""}`}>
                    <button className="btn-circle reset" onClick={() => { elapsedRef.current = 0; if(!isRunning) setTimeStr("00:00.00"); }}>
                        Reset
                    </button>
                    <button className={`btn-circle ${isRunning ? "stop" : "start"}`} onClick={toggleStopwatch}>
                        {isRunning ? "Stop" : "Start"}
                    </button>
                </div>

                <div className="slider-container">
                    <p className="slider-icon">A</p>
                    <input
                        type="range"
                        min="2"
                        max="20"
                        step="0.1"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseFloat(e.target.value))}
                        className="ios-slider"
                    />
                    <h2 className="slider-icon large">A</h2>
                </div>

                <div className="mode-pill-container">
                    <button className="btn-pill" onClick={() => setMode(mode === "CLOCK" ? "STOPWATCH" : "CLOCK")}>
                        {mode === "CLOCK" ? "Stopwatch" : "Clock"}
                    </button>
                </div>
            </div>
        </div>
    );
}
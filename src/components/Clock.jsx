import { useEffect, useRef, useState } from "react";
import Navbar from "./Navbar.jsx";
import "./Clock.css";
import Background from "./Background.jsx";

export default function Clock() {
    const [mode, setMode] = useState("CLOCK");
    const [timeStr, setTimeStr] = useState("00:00.00");
    const [isRunning, setIsRunning] = useState(false);
    const [laps, setLaps] = useState([]);
    const [fontSize, setFontSize] = useState(12);
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
        const h = Math.floor((totalSeconds % 86400) / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const pad = (num) => String(num).padStart(2, "0");

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

    const animate = () => {
        if (mode === "CLOCK") {
            const now = new Date();
            setTimeStr(`${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`);
            requestRef.current = setTimeout(animate, 1000);
        } else {
            const currentElapsed = isRunning
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

    const handleReset = () => {
        elapsedRef.current = 0;
        setIsRunning(false);
        setTimeStr("00:00.00");
        setLaps([]);
    };

    const handleLap = () => {
        const currentNow = Date.now();
        const totalCurrentElapsed = currentNow - startTimeRef.current + elapsedRef.current;
        const prevTotal = laps.length > 0 ? laps[0].totalRaw : 0;
        const currentLapDuration = totalCurrentElapsed - prevTotal;

        const newLap = {
            id: laps.length + 1,
            totalRaw: totalCurrentElapsed,
            lapDuration: currentLapDuration,
            formatted: formatTime(currentLapDuration)
        };

        setLaps([newLap, ...laps]);
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
            <Background />
            <div className="bg-mask"></div>

            <div className={`clock-nav-container ${(!showControls || isFullscreen) ? "fade-out" : ""}`}>
                <Navbar />
            </div>

            <div className={`content-layout ${laps.length > 0 && mode === "STOPWATCH" ? "split-view" : "centered-view"}`}>
                <div
                    ref={displayRef}
                    className="time-display"
                    style={{ fontSize: `${fontSize}vw` }}
                >
                    {timeStr}
                </div>

                {mode === "STOPWATCH" && laps.length > 0 && (
                    <div className={`laps-container ${showControls ? "visible" : "dimmed"}`}>
                        {laps.map((lap) => (
                            <div key={lap.id} className="lap-item">
                                <span className="lap-index">Lap {lap.id}</span>
                                <span className="lap-time">{lap.formatted}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className={`ui-overlay ${showControls ? "visible" : "hidden"}`}>
                <button className="btn-fs" onClick={toggleFullscreen}>
                    {isFullscreen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"/></svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/></svg>
                    )}
                </button>

                <div className={`controls-layer ${mode === "STOPWATCH" ? "is-stopwatch" : ""}`}>
                    <button
                        className="btn-outline secondary"
                        onClick={isRunning ? handleLap : handleReset}
                    >
                        {isRunning ? "LAP" : "RESET"}
                    </button>

                    <button
                        className={`btn-outline ${isRunning ? "stop" : "start"}`}
                        onClick={toggleStopwatch}
                    >
                        {isRunning ? "STOP" : "START"}
                    </button>
                </div>

                <div className="slider-wrapper">
                    <span className="slider-label small">A</span>
                    <input
                        type="range"
                        min="2"
                        max="12"
                        step="0.5"
                        value={fontSize}
                        onChange={(e) => setFontSize(parseFloat(e.target.value))}
                        className="clean-slider"
                    />
                    <span className="slider-label large" >A</span>
                </div>

                <div className="mode-switch-container">
                    <button className={`mode-btn ${mode === "CLOCK" ? "active" : ""}`} onClick={() => setMode("CLOCK")}>CLOCK</button>
                    <div className="divider"></div>
                    <button className={`mode-btn ${mode === "STOPWATCH" ? "active" : ""}`} onClick={() => setMode("STOPWATCH")}>STOPWATCH</button>
                </div>
            </div>
        </div>
    );
}
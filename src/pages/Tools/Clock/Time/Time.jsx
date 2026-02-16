import { useEffect, useState } from "react";
import "./Time.css";

export default function Time() {
    const [timeStr, setTimeStr] = useState("00:00:00");

    useEffect(() => {
        const animate = () => {
            const now = new Date();
            setTimeStr(now.toLocaleTimeString('en-GB', { hour12: false }));
        };
        const timer = setInterval(animate, 1000);
        animate();
        return () => clearInterval(timer);
    }, []);

    return (
        <div className="time-wrapper">
            <div className="large-display">{timeStr}</div>
        </div>
    );
}
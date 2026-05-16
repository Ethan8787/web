import React, {useEffect, useState} from 'react';
import './Ring.css';

export default function Ring({targetDate, type, max, label, colorClass}) {
    const radius = 36;
    const circumference = 2 * Math.PI * radius;
    const [displayValue, setDisplayValue] = useState(0);
    const [offset, setOffset] = useState(circumference);

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const diff = targetDate - now;

            if (diff <= 0) {
                setOffset(circumference);
                setDisplayValue(0);
                return;
            }

            let value;
            let progress;

            if (type === 's') {
                value = Math.floor((diff % 60000) / 1000);
                progress = value / 60;
            } else if (type === 'm') {
                value = Math.floor((diff % 3600000) / 60000);
                progress = value / 60;
            } else if (type === 'h') {
                value = Math.floor((diff % 86400000) / 3600000);
                progress = value / 24;
            } else {
                value = Math.floor(diff / 86400000);
                progress = value / max;
            }

            setOffset(circumference - (progress * circumference));
            setDisplayValue(value);
        };

        update();
        const intervalId = setInterval(update, 1000);
        return () => clearInterval(intervalId);
    }, [targetDate, type, max, circumference]);

    return (
        <div className="ring-item">
            <div className="svg-container">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle className="ring-bg" cx="50" cy="50" r={radius} fill="none"/>
                    <circle
                        className={`ring-fg ${colorClass}`}
                        cx="50"
                        cy="50"
                        r={radius}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={offset}
                        transform="rotate(-90 50 50)"
                    />
                </svg>
                <div className="ring-value">{displayValue}</div>
            </div>
            <div className="ring-label">{label}</div>
        </div>
    );
}
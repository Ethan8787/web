import React, { useEffect, useState, useRef } from 'react';
import './Ring.css';

export default function Ring({ targetDate, type, max, label, colorClass }) {
    const radius = 36;
    const centerX = 50;
    const centerY = 50;
    const [displayValue, setDisplayValue] = useState(0);
    const [pathD, setPathD] = useState("");
    const isResettingRef = useRef(false);
    const prevValue = useRef(0);
    const requestRef = useRef();

    const polarToCartesian = (cx, cy, r, angleInDegrees) => {
        const radians = (angleInDegrees * Math.PI) / 180.0;
        return {
            x: cx + r * Math.cos(radians),
            y: cy + r * Math.sin(radians)
        };
    };

    const getPathData = (progress) => {
        const startAngle = -90;
        const endAngle = startAngle + (progress * 359.999);
        const start = polarToCartesian(centerX, centerY, radius, startAngle);
        const end = polarToCartesian(centerX, centerY, radius, endAngle);
        const largeArcFlag = progress > 0.5 ? "1" : "0";
        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
        ].join(" ");
    };

    const update = () => {
        if (isResettingRef.current) return;

        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            setPathD("");
            setDisplayValue(0);
            return;
        }

        let value;
        let progress;

        if (type === 's') {
            const ms = diff % 60000;
            value = Math.floor(ms / 1000);
            progress = ms / 60000;
        } else if (type === 'm') {
            const totalMs = diff % 3600000;
            value = Math.floor(totalMs / 60000);
            progress = totalMs / 3600000;
        } else if (type === 'h') {
            const totalMs = diff % 86400000;
            value = Math.floor(totalMs / 3600000);
            progress = totalMs / 86400000;
        } else {
            value = Math.floor(diff / 86400000);
            progress = value / max;
        }

        if (value > prevValue.current && prevValue.current !== 0) {
            isResettingRef.current = true;
            setPathD(getPathData(0.9999));

            setTimeout(() => {
                isResettingRef.current = false;
                requestRef.current = requestAnimationFrame(update);
            }, 300);
        } else {
            setPathD(getPathData(progress));
            requestRef.current = requestAnimationFrame(update);
        }

        prevValue.current = value;
        setDisplayValue(value);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(update);
        return () => cancelAnimationFrame(requestRef.current);
    }, [targetDate]);

    return (
        <div className="ring-item">
            <div className="svg-container">
                <svg width="100" height="100" viewBox="0 0 100 100">
                    <circle className="ring-bg" cx="50" cy="50" r={radius} fill="none" />
                    <path
                        className={`ring-fg ${colorClass} ${isResettingRef.current ? 'is-animating' : ''}`}
                        d={pathD}
                        fill="none"
                    />
                </svg>
                <div className="ring-value">{displayValue}</div>
            </div>
            <div className="ring-label">{label}</div>
        </div>
    );
}
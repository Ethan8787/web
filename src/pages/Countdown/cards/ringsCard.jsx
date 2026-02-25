import React, {useEffect, useState} from 'react';
import './ringsCard.css';

const Ring = ({value, max, label, colorClass}) => {
    const radius = 36;
    const dashArray = 2 * Math.PI * radius;
    const safeValue = Math.min(value, max);
    const dashOffset = dashArray - (safeValue / max) * dashArray;

    return (<div className="ring-item">
        <div className="svg-container">
            <svg width="85" height="85" viewBox="0 0 100 100">
                <circle className="ring-bg" cx="50" cy="50" r={radius} fill="none"/>
                <circle
                    className={`ring-fg ${colorClass}`}
                    cx="50" cy="50" r={radius}
                    fill="none"
                    style={{
                        strokeDasharray: dashArray,
                        strokeDashoffset: dashOffset,
                        transition: "stroke-dashoffset 0.3s ease"
                    }}
                />
            </svg>
            <div className="ring-value">{value}</div>
        </div>
        <div className="ring-label">{label}</div>
    </div>);
};

export default function RingsCard() {
    const [time, setTime] = useState({d: 0, h: 0, m: 0, s: 0});

    useEffect(() => {
        const target = new Date('2026-05-16T08:30:00');
        const update = () => {
            const now = new Date();
            const diff = target - now;
            if (diff <= 0) return;

            setTime({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff / (1000 * 60 * 60)) % 24),
                m: Math.floor((diff / 1000 / 60) % 60),
                s: Math.floor((diff / 1000) % 60)
            });
        };

        update();
        const timer = setInterval(update, 1000);
        return () => clearInterval(timer);
    }, []);

    return (<div className="rings-container">
        <Ring value={time.d} max={365} label="天" colorClass="c-red"/>
        <Ring value={time.h} max={24} label="時" colorClass="c-yellow"/>
        <Ring value={time.m} max={60} label="分" colorClass="c-cyan"/>
        <Ring value={time.s} max={60} label="秒" colorClass="c-blue"/>
    </div>);
}
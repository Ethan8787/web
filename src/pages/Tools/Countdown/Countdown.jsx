import React, {useEffect, useState} from 'react';
import RingsCard from './cards/ringsCard';
import GoalsCard from './cards/goalsCard';
import './Countdown.css';

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState(0);
    const totalDays = 365;

    useEffect(() => {
        const targetDate = new Date('2026-05-16T08:30:00');
        const updateCountdown = () => {
            const now = new Date();
            const diffTime = targetDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setTimeLeft(diffDays > 0 ? diffDays : 0);
        };
        updateCountdown();
        const timer = setInterval(updateCountdown, 1000 * 60);
        return () => clearInterval(timer);
    }, []);

    const progressPercent = (timeLeft / totalDays) * 100;

    return (
        <div className="countdown-main-layout">
            <div className="countdown-card glass-card">
                <h2 className="countdown-title">115 會考</h2>
                <RingsCard/>
                <div className="days-display">
                    <span className="days-left">{timeLeft}</span>
                    <span className="days-total"> / {totalDays} Days Left</span>
                </div>
                <div className="divider"></div>
                <div className="bar-container">
                    <div className="bar-fill" style={{width: `${progressPercent}%`}}></div>
                </div>
            </div>
            <GoalsCard/>
        </div>
    );
}
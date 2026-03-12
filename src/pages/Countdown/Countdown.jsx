import React, { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import ExamCard from './cards/examCard.jsx';
import GraduateCard from './cards/graduateCard';
import './Countdown.css';

export default function Countdown() {
    const [examDays, setExamDays] = useState(0);
    const [gradDays, setGradDays] = useState(0);
    const cardRef = useRef(null);
    const gradRef = useRef(null);

    useEffect(() => {
        const examTarget = new Date('2026-05-16T08:30:00');
        const gradTarget = new Date('2026-06-05T12:00:00');

        const update = () => {
            const now = new Date();
            const diffExam = examTarget - now;
            const diffGrad = gradTarget - now;

            setExamDays(diffExam > 0 ? Math.ceil(diffExam / (1000 * 60 * 60 * 24)) : 0);
            setGradDays(diffGrad > 0 ? Math.ceil(diffGrad / (1000 * 60 * 60 * 24)) : 0);
        };

        update();
        const t1 = setInterval(update, 60000);
        return () => clearInterval(t1);
    }, []);

    const takeScreenshot = async (targetRef, fileNamePrefix) => {
        const isVerified = localStorage.getItem('verified') === 'true';

        if (!isVerified) {
            const inputUUID = prompt("UUID:");
            if (!inputUUID) return;
            try {
                const res = await fetch('/caf', { cache: 'no-store' });
                if (!res.ok) throw new Error('auth fetch failed');
                const storedUUID = (await res.text()).trim();

                if (inputUUID.trim() === storedUUID) {
                    localStorage.setItem('verified', 'true');
                } else {
                    alert("Authentication Failed.");
                    return;
                }
            } catch (e) {
                alert("Security System Offline.");
                return;
            }
        }

        if (!targetRef.current) return;

        try {
            const canvas = await html2canvas(targetRef.current, {
                scale: 5,
                useCORS: true,
                backgroundColor: null,
                onclone: (clonedDoc) => {
                    if (clonedDoc.body) clonedDoc.body.style.backgroundColor = 'transparent';
                    const card = clonedDoc.querySelector('.countdown-card');
                    if (card) {
                        const wm = clonedDoc.createElement('div');
                        wm.innerText = '@Ethan';
                        wm.style.cssText = `
                            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
                            display: flex; align-items: center; justify-content: center;
                            opacity: 0.05; font-size: 0.8rem; color: white; pointer-events: none;
                            z-index: 9999; font-family: sans-serif;
                        `;
                        card.appendChild(wm);
                    }
                }
            });

            const a = document.createElement('a');
            a.download = `${fileNamePrefix}-${Date.now()}.png`;
            a.href = canvas.toDataURL('image/png');
            a.click();
        } catch (error) {
            console.error("Error taking screenshot:", error);
            alert("截圖失敗。");
        }
    };

    return (
        <div className="countdown-main-layout">
            <div className="side-tools">
                <button onClick={() => takeScreenshot(cardRef, '115')} className="tool-btn screenshot" title="截圖會考倒數">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                </button>
                <button onClick={() => takeScreenshot(gradRef, 'Grad')} className="tool-btn screenshot" title="截圖畢業倒數" style={{ marginTop: '10px' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                        <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                </button>
            </div>

            <div className="countdown-card glass-card" ref={cardRef}>
                <h2 className="countdown-title">115 會考</h2>
                <ExamCard />
                <div className="days-display">
                    <span className="days-left">{examDays}</span>
                    <span className="days-total"> / 365 Days</span>
                </div>
                <p className="time-date">2026 年 5 月 16 日 08:30</p>
                <div className="card-divider"></div>
                <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${(examDays / 365) * 100}%` }}></div>
                </div>
            </div>

            <div className="countdown-card glass-card grad-card-parent" ref={gradRef} style={{ marginTop: '20px' }}>
                <h2 className="countdown-title grad-title-color">畢業倒數</h2>
                <GraduateCard />
                <div className="grad-days-display">
                    <span className="grad-days-left">{gradDays}</span>
                    <span className="grad-days-total"> / 365 Days</span>
                </div>
                <p className="time-date">2026 年 6 月 5 日 12:00</p>
                <div className="card-divider"></div>
                <div className="grad-bar-container">
                    <div className="grad-bar-fill" style={{ width: `${(gradDays / 365) * 100}%` }}></div>
                </div>
            </div>
        </div>
    );
}
import React, {useEffect, useRef, useState} from 'react';
import html2canvas from 'html2canvas';
import ExamCard from './components/ExamCard/ExamCard.jsx';
import GraduateCard from './components/GraduateCard/GraduateCard.jsx';
import './Countdown.css';

export default function Countdown() {
    const [days, setDays] = useState({exam: 0, grad: 0});
    const refs = {exam: useRef(null), grad: useRef(null)};

    useEffect(() => {
        const update = () => {
            const now = new Date();
            const d1 = new Date('2026-05-16T08:20:00') - now;
            const d2 = new Date('2026-06-05T12:00:00') - now;
            setDays({
                exam: d1 > 0 ? Math.ceil(d1 / 86400000) : 0, grad: d2 > 0 ? Math.ceil(d2 / 86400000) : 0
            });
        };
        update();
        const t = setInterval(update, 1000);
        return () => clearInterval(t);
    }, []);

    const handleCapture = async (ref, prefix) => {
        if (localStorage.getItem('verified') !== 'true') {
            const id = prompt("UUID:");
            if (!id) return;
            try {
                const res = await fetch('/caf', {cache: 'no-store'});
                const storedUUID = (await res.text()).trim();
                if (id.trim() === storedUUID) localStorage.setItem('verified', 'true'); else return alert("Authentication Failed.");
            } catch (e) {
                return alert("Security System Offline.");
            }
        }
        if (!ref.current) return;
        try {
            const canvas = await html2canvas(ref.current, {
                scale: 5, useCORS: true, backgroundColor: '#000000', onclone: (clonedDoc) => {
                    const card = clonedDoc.querySelector('.countdown-card');
                    if (card) {
                        const wm = clonedDoc.createElement('div');
                        wm.innerText = '@ethantw.dev';
                        wm.style.cssText = `
                        position:absolute;
                        top:0;
                        left:0;
                        width:100%;
                        height:100%;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        opacity:0.5;
                        font-size:0.8rem;
                        color:white;
                        pointer-events:none;
                        z-index:9999;
                        font-family:sans-serif;
                        `;
                        card.appendChild(wm);
                    }
                }
            });
            const a = document.createElement('a');
            a.download = `${prefix}-${Date.now()}.png`;
            a.href = canvas.toDataURL('image/png');
            a.click();
        } catch (error) {
            alert("截圖失敗。");
        }
    };

    return (<div className="countdown-main-layout">
            <div className="side-tools">
                <button onClick={() => handleCapture(refs.exam, '115')} className="tool-btn" title="截圖會考倒數">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#afafff" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round">
                        <path
                            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                </button>
                <button onClick={() => handleCapture(refs.grad, 'Grad')} className="tool-btn" title="截圖畢業倒數"
                        style={{marginTop: '10px'}}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#afafff" strokeWidth="2"
                         strokeLinecap="round" strokeLinejoin="round">
                        <path
                            d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                </button>
            </div>

            <div className="countdown-card glass-card" ref={refs.exam}>
                <h2 className="countdown-title">67</h2>
                <div className="card-divider"></div>
                <ExamCard/>
                <div className="days-display">
                    <span className="days-left">{days.exam}</span>
                    <span className="days-total"> / 365 Days</span>
                </div>
                <p className="time-date">2026/5/16 08:20</p>
                <div className="card-divider"></div>
                <div className="bar-container">
                    <div className="bar-fill" style={{width: `${(days.exam / 365) * 100}%`}}></div>
                </div>
            </div>

            <div className="countdown-card glass-card" ref={refs.grad} style={{marginTop: '20px'}}>
                <h2 className="countdown-title grad-title-color">畢業倒數</h2>
                <div className="card-divider"></div>
                <GraduateCard/>
                <div className="grad-days-display">
                    <span className="grad-days-left">{days.grad}</span>
                    <span className="grad-days-total"> / 365 Days</span>
                </div>
                <p className="time-date">2026/6/5 12:00</p>
                <div className="card-divider"></div>
                <div className="grad-bar-container">
                    <div className="grad-bar-fill" style={{width: `${(days.grad / 365) * 100}%`}}></div>
                </div>
            </div>
        </div>);
}
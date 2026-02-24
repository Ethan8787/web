import React, { useEffect, useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import RingsCard from './cards/ringsCard';
import GoalsCard from './cards/goalsCard';
import './Countdown.css';

const mottoes = ["穩住，這局必勝", "會考殺手，全線攞 A", "實力說話，拒絕 emo", "不留遺憾，全力開掛", "沉著應戰，穩如老狗", "115 會考，你是唯一的主角", "保持 Focus，你是最頂的"];

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [motto, setMotto] = useState(mottoes[0]);
    const cardRef = useRef(null);

    useEffect(() => {
        const targetDate = new Date('2026-05-16T08:30:00');
        const update = () => {
            const diff = targetDate - new Date();
            setTimeLeft(Math.ceil(diff / (1000 * 60 * 60 * 24)) > 0 ? Math.ceil(diff / (1000 * 60 * 60 * 24)) : 0);
        };
        update();
        const t1 = setInterval(update, 60000);
        const t2 = setInterval(() => setMotto(mottoes[Math.floor(Math.random() * mottoes.length)]), 5000);
        return () => { clearInterval(t1); clearInterval(t2); };
    }, []);

    const takeScreenshot = async () => {
        const inputUUID = prompt("Factor 1: Device ID");
        if (!inputUUID) return;
        const inputHash = prompt("Factor 2: Access Hash");
        if (!inputHash) return;

        try {
            const res = await fetch('/caf', { cache: 'no-store' });
            if (!res.ok) throw new Error();
            const content = (await res.text()).trim();
            const [storedUUID, storedHash] = content.split(':');

            // 直接比對你輸入的 UUID 跟 Hash，不重複計算雜湊
            if (inputUUID === storedUUID && inputHash.toUpperCase() === storedHash.toUpperCase()) {
                if (!cardRef.current) return;
                const canvas = await html2canvas(cardRef.current, {
                    scale: 3, useCORS: true,
                    onclone: (doc) => {
                        const c = doc.querySelector('.countdown-card');
                        if (c) {
                            const wm = doc.createElement('div');
                            wm.style.cssText = "position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;display:flex;flex-wrap:wrap;opacity:0.08;z-index:9999;overflow:hidden;";
                            for (let i = 0; i < 20; i++) {
                                const t = doc.createElement('div');
                                t.innerText = inputUUID.substring(0, 8);
                                t.style.cssText = "transform:rotate(-30deg);margin:40px;font-size:12px;font-family:monospace;color:white;";
                                wm.appendChild(t);
                            }
                            c.appendChild(wm);
                        }
                    }
                });
                const a = document.createElement('a');
                a.download = `115-auth-${Date.now()}.png`;
                a.href = canvas.toDataURL('image/png');
                a.click();
            } else {
                alert("2FA Authentication Failed.");
            }
        } catch (e) { alert("Security System Offline."); }
    };

    return (
        <div className="countdown-main-layout">
            <div className="side-tools">
                <button onClick={takeScreenshot} className="tool-btn screenshot">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                        <circle cx="12" cy="13" r="4"></circle>
                    </svg>
                </button>
            </div>
            <div className="countdown-card glass-card" ref={cardRef} style={{ borderRadius: '16px', position: 'relative' }}>
                <h2 className="countdown-title">115 會考</h2>
                <RingsCard />
                <div className="days-display">
                    <span className="days-left">{timeLeft}</span>
                    <span className="days-total"> / 365 Days</span>
                </div>
                <p className="motto-text">{motto}</p>
                <div className="divider"></div>
                <div className="bar-container">
                    <div className="bar-fill" style={{ width: `${(timeLeft / 365) * 100}%` }}></div>
                </div>
            </div>
            <GoalsCard />
        </div>
    );
}
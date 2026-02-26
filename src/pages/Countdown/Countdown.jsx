import React, {useEffect, useRef, useState} from 'react';
import html2canvas from 'html2canvas';
import RingsCard from './cards/ringsCard';
import GraduateCard from './cards/graduateCard';
import './Countdown.css';

/*
  單因子驗證：UUID 存在 /auth（純文字、無副檔名）
*/
const mottoes = ["趴下穩住，這局必勝 ", "殲滅會考，全科A++ ", "實力說話，拒絕放棄 ", "保留實力，全力開掛 ", "沉著應戰，穩如破狗 ", "相信自己，唯一豬角 ", "保持專注，達到頂標 ", "現在努力，未來躺平 ", "題海無涯，回頭是岸 ", "會考不難，難是早起 "];

export default function Countdown() {
    const [timeLeft, setTimeLeft] = useState(0);
    const [mottoIndex, setMottoIndex] = useState(0);
    const cardRef = useRef(null);

    useEffect(() => {
        const targetDate = new Date('2026-05-16T08:30:00');
        const update = () => {
            const diff = targetDate - new Date();
            const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
            setTimeLeft(days > 0 ? days : 0);
        };
        update();
        const t1 = setInterval(update, 60000);
        const t2 = setInterval(() => {
            setMottoIndex((prev) => (prev + 1) % mottoes.length);
        }, 8000);
        return () => {
            clearInterval(t1);
            clearInterval(t2);
        };
    }, []);

    const takeScreenshot = async () => {
        const isVerified = localStorage.getItem('verified') === 'true';

        if (!isVerified) {
            const inputUUID = prompt("Factor 1: Device ID");
            if (!inputUUID) return;

            try {
                const res = await fetch('/auth', {cache: 'no-store'});
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

        if (!cardRef.current) return;

        try {
            const canvas = await html2canvas(cardRef.current, {
                scale: 5, useCORS: true, backgroundColor: null, onclone: (clonedDoc) => {
                    if (clonedDoc.body) clonedDoc.body.style.backgroundColor = 'transparent';
                    const card = clonedDoc.querySelector('.countdown-card');
                    if (card) {
                        const wm = clonedDoc.createElement('div');
                        wm.innerText = '@Ethan';
                        wm.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0.05;
              font-size: 0.8rem;
              color: white;
              pointer-events: none;
              z-index: 9999;
              font-family: sans-serif;
            `;
                        card.appendChild(wm);
                    }
                }
            });

            const a = document.createElement('a');
            a.download = `115-${Date.now()}.png`;
            a.href = canvas.toDataURL('image/png');
            a.click();
        } catch (error) {
            console.error("Error taking screenshot:", error);
            alert("截圖失敗，請檢查瀏覽器權限或重試。");
        }
    };

    return (<div className="countdown-main-layout">
        <div className="side-tools">
            <button onClick={takeScreenshot} className="tool-btn screenshot">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" strokeWidth="2"
                     strokeLinecap="round" strokeLinejoin="round">
                    <path
                        d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path>
                    <circle cx="12" cy="13" r="4"></circle>
                </svg>
            </button>
        </div>

        <div className="countdown-card glass-card" ref={cardRef}
             style={{borderRadius: '16px', position: 'relative'}}>
            <h2 className="countdown-title">115 會考</h2>
            <RingsCard/>

            <div className="days-display">
                <span className="days-left">{timeLeft}</span>
                <span className="days-total"> / 365 Days</span>
            </div>

            <p className="motto-text" key={mottoIndex}>
                {mottoes[mottoIndex]}
            </p>

            <div className="divider"></div>
            <div className="bar-container">
                <div className="bar-fill" style={{width: `${(timeLeft / 365) * 100}%`}}></div>
            </div>
        </div>
        <div className="countdown-card glass-card grad-card-parent" style={{marginTop: '20px', borderRadius: '16px'}}>
            <h2 className="countdown-title grad-title-color">畢業倒數</h2>
            <GraduateCard />
        </div>
    </div>);
}
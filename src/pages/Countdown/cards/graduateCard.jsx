import React, {useEffect, useState, useMemo} from 'react';
import './graduateCard.css';

const GradRingUnit = ({num, maxVal, desc, theme}) => {
    const rSize = 36;
    const perimeter = 2 * Math.PI * rSize;
    const limitedNum = Math.min(num, maxVal);
    const offsetVal = perimeter - (limitedNum / maxVal) * perimeter;

    return (
        <div className="grad-ring-box">
            <div className="grad-svg-box">
                <svg width="85" height="85" viewBox="0 0 100 100">
                    <circle className="grad-ring-underlay" cx="50" cy="50" r={rSize} fill="none"/>
                    <circle
                        className={`grad-ring-overlay ${theme}`}
                        cx="50"
                        cy="50"
                        r={rSize}
                        fill="none"
                        style={{
                            strokeDasharray: perimeter,
                            strokeDashoffset: offsetVal,
                            transition: "stroke-dashoffset 0.4s ease"
                        }}
                    />
                </svg>
                <div className="grad-num-val">{num}</div>
            </div>
            <div className="grad-label-text">{desc}</div>
        </div>
    );
};

export default function GraduateCard() {
    const gradTarget = useMemo(() => new Date('2026-06-05T12:00:00+08:00'), []);
    const [remain, setRemain] = useState({dd: 0, hh: 0, mm: 0, ss: 0});

    const targetLabel = useMemo(() => {
        return gradTarget.toLocaleString('zh-TW', {
            timeZone: 'Asia/Taipei',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
    }, [gradTarget]);

    useEffect(() => {
        const syncTime = () => {
            const current = new Date();
            const msDiff = gradTarget - current;
            if (msDiff <= 0) return;

            setRemain({
                dd: Math.floor(msDiff / (1000 * 60 * 60 * 24)),
                hh: Math.floor((msDiff / (1000 * 60 * 60)) % 24),
                mm: Math.floor((msDiff / 1000 / 60) % 60),
                ss: Math.floor((msDiff / 1000) % 60)
            });
        };

        syncTime();
        const runner = setInterval(syncTime, 1000);
        return () => clearInterval(runner);
    }, [gradTarget]);

    return (
        <div className="grad-container-wrap">
            <div className="grad-ring-row">
                <GradRingUnit num={remain.dd} maxVal={365} desc="天" theme="c-grad-cherry"/>
                <GradRingUnit num={remain.hh} maxVal={24} desc="時" theme="c-grad-sunset"/>
                <GradRingUnit num={remain.mm} maxVal={60} desc="分" theme="c-grad-berry"/>
                <GradRingUnit num={remain.ss} maxVal={60} desc="秒" theme="c-grad-plum"/>
            </div>
        </div>
    );
}
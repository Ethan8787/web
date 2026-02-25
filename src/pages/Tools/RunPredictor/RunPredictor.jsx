import React, { useState, useEffect } from 'react';
import './RunPredictor.css';

export default function RunPredictor() {
    const [d100, setD100] = useState('');
    const [d200, setD200] = useState('');
    const [d400, setD400] = useState('');
    const [d800, setD800] = useState('');
    const [targetDist, setTargetDist] = useState('1500');
    const [result, setResult] = useState('00:00.00');

    const parseTime = (str) => {
        if (!str) return 0;
        const parts = str.split(':');
        if (parts.length === 2) {
            return parseFloat(parts[0]) * 60 + parseFloat(parts[1]);
        }
        return parseFloat(str);
    };

    const formatTime = (totalSeconds) => {
        if (!totalSeconds || isNaN(totalSeconds) || !isFinite(totalSeconds)) return '00:00.00';
        const m = Math.floor(totalSeconds / 60);
        const s = Math.floor(totalSeconds % 60);
        const ms = Math.floor((totalSeconds % 1) * 100);

        if (m > 0) {
            return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
        }
        return `${s}.${ms.toString().padStart(2, '0')}`;
    };

    useEffect(() => {
        const records = [
            { d: 800, t: parseTime(d800) },
            { d: 400, t: parseTime(d400) },
            { d: 200, t: parseTime(d200) },
            { d: 100, t: parseTime(d100) }
        ].filter(r => r.t > 0);

        const target = parseFloat(targetDist);

        if (records.length === 0 || isNaN(target) || target <= 0) {
            setResult('00:00.00');
            return;
        }

        let k = 1.06;

        if (records.length >= 2) {
            const r1 = records[0];
            const r2 = records[1];
            const calcK = Math.log(r1.t / r2.t) / Math.log(r1.d / r2.d);
            if (calcK > 0.8 && calcK < 1.3) {
                k = calcK;
            }
        }

        const base = records[0];
        const predictedSec = base.t * Math.pow(target / base.d, k);
        setResult(formatTime(predictedSec));
    }, [d100, d200, d400, d800, targetDist]);

    return (
        <div className="predictor-container">
            <div className="glass-card">
                <div className="card-header">
                    <h2>跑步成績預測</h2>
                    <span className="badge">運算模型</span>
                </div>

                <div className="input-group">
                    <div className="input-wrapper">
                        <label>100公尺 (秒)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="例如: 11.5"
                            value={d100}
                            onChange={(e) => setD100(e.target.value)}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label>200公尺 (秒)</label>
                        <input
                            type="number"
                            step="0.01"
                            placeholder="例如: 23.8"
                            value={d200}
                            onChange={(e) => setD200(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-group">
                    <div className="input-wrapper">
                        <label>400公尺 (秒 或 分:秒)</label>
                        <input
                            type="text"
                            placeholder="例如: 55.2"
                            value={d400}
                            onChange={(e) => setD400(e.target.value)}
                        />
                    </div>
                    <div className="input-wrapper">
                        <label>800公尺 (分:秒)</label>
                        <input
                            type="text"
                            placeholder="例如: 2:10.5"
                            value={d800}
                            onChange={(e) => setD800(e.target.value)}
                        />
                    </div>
                </div>

                <div className="input-wrapper full-width">
                    <label>目標距離 (公尺)</label>
                    <input
                        type="number"
                        placeholder="例如: 1500"
                        value={targetDist}
                        onChange={(e) => setTargetDist(e.target.value)}
                    />
                </div>

                <div className="output-section">
                    <label>預測完賽時間</label>
                    <div className="code-box predictor-result">
                        <code>{result}</code>
                    </div>
                </div>
            </div>
        </div>
    );
}
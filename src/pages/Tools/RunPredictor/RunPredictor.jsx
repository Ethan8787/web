import React, {useEffect, useState} from 'react';
import './RunPredictor.css';

export default function RunPredictor() {
    const [d100, setD100] = useState('');
    const [d200, setD200] = useState('');
    const [d400, setD400] = useState('');
    const [d800, setD800] = useState('');
    const [targetDist, setTargetDist] = useState('1500');
    const [result, setResult] = useState('00:00.00');

    const [ageGroup, setAgeGroup] = useState('adult');
    const [isAthlete, setIsAthlete] = useState('no');
    const [isDisabled, setIsDisabled] = useState('no');
    const [kFactor, setKFactor] = useState(1.08);

    useEffect(() => {
        let baseK = 1.08;

        if (ageGroup === 'child') baseK += 0.04;
        if (ageGroup === 'youth') baseK -= 0.01;
        if (ageGroup === 'elder') baseK += 0.06;

        if (isAthlete === 'yes') baseK -= 0.04;
        if (isDisabled === 'yes') baseK += 0.03;

        setKFactor(parseFloat(baseK.toFixed(2)));
    }, [ageGroup, isAthlete, isDisabled]);

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
            {d: 800, t: parseTime(d800)},
            {d: 400, t: parseTime(d400)},
            {d: 200, t: parseTime(d200)},
            {d: 100, t: parseTime(d100)}
        ].filter(r => r.t > 0);

        const target = parseFloat(targetDist);

        if (records.length === 0 || isNaN(target) || target <= 0) {
            setResult('00:00.00');
            return;
        }

        const base = records[0];
        const currentK = parseFloat(kFactor);

        if (isNaN(currentK) || currentK <= 0) {
            setResult('參數錯誤');
            return;
        }

        const predictedSec = base.t * Math.pow(target / base.d, currentK);
        setResult(formatTime(predictedSec));
    }, [d100, d200, d400, d800, targetDist, kFactor]);

    return (
        <div className="predictor-container">
            <div className="glass-card">
                <div className="card-header">
                    <h2>跑步成績預測</h2>
                    <span className="badge">Riegel 模型</span>
                </div>

                <div className="profile-section">
                    <label className="section-title">跑者生理屬性</label>
                    <div className="profile-grid">
                        <div className="input-wrapper">
                            <label>年齡層</label>
                            <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
                                <option value="child">幼年 (12歲以下)</option>
                                <option value="youth">青年 (13-25歲)</option>
                                <option value="adult">壯年 (26-50歲)</option>
                                <option value="elder">老年 (51歲以上)</option>
                            </select>
                        </div>
                        <div className="input-wrapper">
                            <label>訓練狀態</label>
                            <select value={isAthlete} onChange={(e) => setIsAthlete(e.target.value)}>
                                <option value="no">一般人</option>
                                <option value="yes">運動員</option>
                            </select>
                        </div>
                        <div className="input-wrapper">
                            <label>生理狀態</label>
                            <select value={isDisabled} onChange={(e) => setIsDisabled(e.target.value)}>
                                <option value="no">一般</option>
                                <option value="yes">身心障礙</option>
                            </select>
                        </div>
                        <div className="input-wrapper">
                            <label>衰減係數 (k)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={kFactor}
                                onChange={(e) => setKFactor(e.target.value)}
                                className="highlight-input"
                            />
                        </div>
                    </div>
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
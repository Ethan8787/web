// RandomWheel.jsx
// 目的：把每片角度丟進 CSS 變數，overlay 分隔線才知道每片幾度

import React, { useState } from 'react';
import './RandomWheel.css';

export default function RandomWheel() {
    const [items, setItems] = useState(['測試1', '測試2', '3', '4', '5']);
    const [newItem, setNewItem] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winnerIndex, setWinnerIndex] = useState(null);

    const colors = ['#5865F2', '#0098ee', '#10b981', '#f59e0b', '#ef4444'];

    const handleSpin = () => {
        if (isSpinning || items.length < 2) return;
        setIsSpinning(true);
        setWinnerIndex(null);

        const randomDeg = Math.floor(Math.random() * 360);
        const nextRotation = rotation + 1800 + randomDeg;
        setRotation(nextRotation);

        setTimeout(() => {
            setIsSpinning(false);
            const sliceDeg = 360 / items.length;
            const actualRotation = nextRotation % 360;
            const index = Math.floor(((360 - actualRotation + 180) % 360) / sliceDeg);
            setWinnerIndex(index % items.length);
        }, 4000);
    };

    const addItem = () => {
        if (newItem.trim()) {
            setItems([...items, newItem.trim()]);
            setNewItem('');
            setWinnerIndex(null);
        }
    };

    const getWheelBackground = () => {
        if (items.length === 0) return '#1a1a1a';
        const slice = 100 / items.length;
        let gradient = 'conic-gradient(';
        items.forEach((_, i) => {
            gradient += `${colors[i % colors.length]} ${i * slice}% ${(i + 1) * slice}%${i === items.length - 1 ? '' : ','}`;
        });
        return gradient + ')';
    };

    const sliceDeg = items.length ? 360 / items.length : 360;

    return (
        <div className="tool-card">
            <div className="wheel-main">
                <div
                    className="wheel"
                    style={{
                        background: getWheelBackground(),
                        transform: `rotate(${rotation}deg) translateZ(0)`,
                        '--slice-deg': `${sliceDeg}deg`
                    }}
                >
                    {items.map((item, i) => {
                        const segmentCenterDeg = i * sliceDeg + (sliceDeg / 2);
                        return (
                            <div
                                key={i}
                                className={`wheel-segment ${winnerIndex === i ? 'active' : ''}`}
                                style={{ transform: `rotate(${segmentCenterDeg}deg) translateY(-110px)` }}
                            >
                                <span style={{ transform: `rotate(${-rotation - segmentCenterDeg}deg)` }}>
                                    {item}
                                </span>
                            </div>
                        );
                    })}
                </div>

                <div className="wheel-pointer-bottom"></div>
                <button className="spin-btn" onClick={handleSpin} disabled={isSpinning}>
                    {isSpinning ? '...' : 'SPIN'}
                </button>
            </div>

            <div className="winner-display">
                {winnerIndex !== null && <span className="glow-text">{items[winnerIndex]}</span>}
            </div>

            <div className="input-group">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="Add option..."
                />
                <button className="base-btn" onClick={addItem}>+</button>
            </div>

            <div className="items-list">
                {items.map((item, i) => (
                    <div key={i} className="list-item">
                        {item}
                        <span className="delete-x" onClick={() => setItems(items.filter((_, idx) => idx !== i))}>×</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
import React, { useState, useRef } from 'react';
import './RandomWeel.css';

export default function RandomWheel() {
    const [items, setItems] = useState(['測試1', '測試2']);
    const [newItem, setNewItem] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winner, setWinner] = useState(null);

    const colors = ['#5865F2', '#0098ee', '#10b981', '#f59e0b', '#ef4444'];

    const handleSpin = () => {
        if (isSpinning || items.length < 2) return;
        setIsSpinning(true);
        setWinner(null);
        const randomDeg = Math.floor(Math.random() * 360);
        const newRotation = rotation + 1800 + randomDeg;
        setRotation(newRotation);
        setTimeout(() => {
            setIsSpinning(false);
            const actualDeg = newRotation % 360;
            const sliceDeg = 360 / items.length;
            const index = Math.floor(((360 - actualDeg + 90) % 360) / sliceDeg);
            setWinner(items[index]);
        }, 4000);
    };

    const addItem = () => {
        if (newItem.trim()) {
            setItems([...items, newItem.trim()]);
            setNewItem('');
        }
    };

    const getWheelBackground = () => {
        if (items.length === 0) return '#1a1a1a';
        const slice = 100 / items.length;
        let gradient = 'conic-gradient(';
        items.forEach((_, i) => {
            gradient += `${colors[i % colors.length]} ${i * slice}% ${(i + 1) * slice}%,`;
        });
        return gradient.slice(0, -1) + ')';
    };

    const RightArrow = () => (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M8 4 L16 12 L8 20 Z" />
        </svg>
    );
    const LeftArrow = () => (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M16 4 L8 12 L16 20 Z" />
        </svg>
    );

    return (
        <div className="tool-card">
            <div className="card-header">
                <h2>幸運輪盤</h2>
                <span className="badge">Professional</span>
            </div>

            <div className="wheel-main">
                <div className="wheel" style={{
                    background: getWheelBackground(),
                    transform: `rotate(${rotation}deg)`,
                    transition: isSpinning ? 'transform 4s cubic-bezier(0.1, 0.7, 0.1, 1)' : 'none'
                }}>
                    {items.map((item, i) => (
                        <div key={i} className="wheel-segment" style={{
                            transform: `rotate(${i * (360 / items.length) + (360 / items.length / 2)}deg) translateY(-42%)`,
                            position: 'absolute', top: '50%', left: '50%', transformOrigin: 'top center'
                        }}>
                            <span style={{writingMode: 'vertical-rl', color: 'white', fontWeight: 'bold', textShadow: '0 1px 3px rgba(0,0,0,0.5)'}}>
                                {item}
                            </span>
                        </div>
                    ))}
                </div>
                <button className="spin-btn" onClick={handleSpin} disabled={isSpinning}>
                    {isSpinning ? '...' : 'SPIN'}
                </button>
            </div>

            <div className="winner-display">
                {winner && (
                    <div className="winner-inner">
                        <LeftArrow />
                        <span className="winner-text">{winner}</span>
                        <RightArrow />
                    </div>
                )}
            </div>


            <div className="input-group" style={{display: 'flex', gap: '8px'}}>
                <div className="input-wrapper">
                    <input
                        type="text"
                        value={newItem}
                        onChange={(e) => setNewItem(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addItem()}
                        placeholder="Add option..."
                    />
                </div>
                <button className="base-btn" onClick={addItem}>+</button>
            </div>

            <div className="items-list">
                {items.map((item, i) => (
                    <div key={i} className="list-item">
                        {item}
                        <span onClick={() => setItems(items.filter((_, idx) => idx !== i))}>×</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
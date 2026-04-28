import React, { useState } from 'react';
import './RandomWheel.css';

export default function RandomWheel() {

    const [items, setItems] = useState(['1', '2', '3', '4', '5']);
    const [newItem, setNewItem] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winnerIndex, setWinnerIndex] = useState(null);

    const colors = ['#5865F2', '#0098ee', '#10b981', '#f59e0b', '#ef4444'];

    const handleSpin = () => {
        if (isSpinning || items.length < 2) return;

        setIsSpinning(true);
        setWinnerIndex(null);

        const extraDegrees = Math.floor(Math.random() * 360);
        const spinDegrees = 1800 + extraDegrees;
        const nextRotation = rotation + spinDegrees;
        setRotation(nextRotation);

        setTimeout(() => {
            setIsSpinning(false);
            const sliceDeg = 360 / items.length;
            const actualRotation = nextRotation % 360;
            const index = Math.floor(((180 - actualRotation + 360) % 360) / sliceDeg);
            setWinnerIndex(index);
        }, 4000);
    };

    const addItem = () => {
        if (newItem.trim()) {
            setItems([...items, newItem.trim()]);
            setNewItem('');
            setWinnerIndex(null);
        }
    };

    const deleteItem = (index) => {
        setItems(items.filter((_, idx) => idx !== index));
        setWinnerIndex(null);
    };

    const getWheelBackground = () => {
        if (items.length === 0) return '#1a1a1a';
        if (items.length === 1) return colors[0];
        const slice = 100 / items.length;
        const gradientParts = items.map((_, i) => {
            return `${colors[i % colors.length]} ${i * slice}% ${(i + 1) * slice}%`;
        });
        return `conic-gradient(${gradientParts.join(', ')})`;
    };

    const sliceDeg = items.length ? 360 / items.length : 360;

    return (
        <div className="tool-card">
            <div className="wheel-main">
                <div
                    className="wheel"
                    style={{
                        background: getWheelBackground(),
                        transform: `rotate(${rotation}deg)`
                    }}
                >
                    {items.map((item, i) => (
                        <div
                            key={i}
                            className="wheel-segment"
                            style={{
                                transform: `translateX(-50%) rotate(${i * sliceDeg + (sliceDeg / 2)}deg)`
                            }}
                        >
                            <span>{item}</span>
                        </div>
                    ))}
                </div>

                <div className="wheel-pointer-bottom"></div>
                <button className="spin-btn" onClick={handleSpin} disabled={isSpinning}>
                    SPIN
                </button>
            </div>

            <div className="winner-display">
                {winnerIndex !== null && <span className="glow-text">{items[winnerIndex]}</span>}
            </div>

            <div className="wheel-input-group">
                <input
                    type="text"
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                    placeholder="新增選項..."
                />
            </div>

            <div className="items-list">
                {items.map((item, i) => (
                    <div key={i} className="list-item">
                        {item}
                        <span
                            className="delete-x"
                            onClick={() => deleteItem(i)}
                        >
                            ×
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
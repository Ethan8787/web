import React, { useState } from 'react';
import './RandomWheel.css';

export default function RandomWheel() {
    const [items, setItems] = useState(['1', '2', '3', '4', '5']);
    const [newItem, setNewItem] = useState('');
    const [isSpinning, setIsSpinning] = useState(false);
    const [rotation, setRotation] = useState(0);
    const [winnerIndex, setWinnerIndex] = useState(null);

    const baseColors = [
        '#5865F2', '#0098ee', '#10b981', '#f59e0b', '#ef4444',
        '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4'
    ];

    const getItemColor = (index, totalItems) => {
        if (totalItems <= 1) return baseColors[0];

        const colorCount = baseColors.length;
        let colorIndex = index % colorCount;

        if (totalItems > 1 && (totalItems % colorCount === 1) && (index === totalItems - 1)) {
            colorIndex = (colorIndex + 1) % colorCount;
        }

        return baseColors[colorIndex];
    };

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
        if (items.length === 1) return getItemColor(0, 1);
        const slice = 100 / items.length;
        const gradientParts = items.map((_, i) => {
            const color = getItemColor(i, items.length);
            return `${color} ${i * slice}% ${(i + 1) * slice}%`;
        });
        return `conic-gradient(${gradientParts.join(', ')})`;
    };

    const sliceDeg = items.length ? 360 / items.length : 360;

    return (
        <main className="App">
            <div className="container">
                <div className="tool-card">
                    <div className="wheel-layout">
                        <div className="wheel-section">
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
                                <button className="spin-btn" onClick={handleSpin} disabled={isSpinning || items.length < 2}>
                                    SPIN
                                </button>
                            </div>

                            <div className="winner-display">
                                {winnerIndex !== null && <span className="glow-text">{items[winnerIndex]}</span>}
                            </div>
                        </div>

                        <div className="controls-section">
                            <div className="wheel-input-group">
                                <input
                                    type="text"
                                    value={newItem}
                                    onChange={(e) => setNewItem(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && addItem()}
                                    placeholder="新增選項..."
                                />
                                <button className="add-btn" onClick={addItem} disabled={!newItem.trim()}>
                                    Add
                                </button>
                            </div>

                            <div className="items-header">
                                <span className="items-count">{items.length} ITEMS</span>
                                {items.length < 2 && (
                                    <span className="items-hint">Add at least 2 to spin</span>
                                )}
                            </div>

                            <div className="items-list">
                                {items.length === 0 ? (
                                    <div className="items-empty">No items yet — add one above</div>
                                ) : (
                                    items.map((item, i) => (
                                        <div key={i} className="list-item">
                                            <div className="list-item-left">
                                                <span
                                                    className="item-color-dot"
                                                    style={{ background: getItemColor(i, items.length) }}
                                                />
                                                <span className="item-name">{item}</span>
                                            </div>
                                            <span className="delete-x" onClick={() => deleteItem(i)}>
                                                ×
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
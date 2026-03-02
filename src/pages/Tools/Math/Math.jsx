import React, { useState, useMemo, useRef } from 'react';
import './Math.css';

const ValueStepper = ({ label, valKey, value, onAdjust, onChange }) => (
    <div className="stepper-container">
        <span className="stepper-label">{label}</span>
        <div className="stepper-controls">
            <button className="step-btn" onClick={() => onAdjust(valKey, -0.1)}>-</button>
            <input
                type="number"
                className="math-input-stepper"
                value={value}
                onChange={e => onChange(valKey, e.target.value)}
            />
            <button className="step-btn" onClick={() => onAdjust(valKey, 0.1)}>+</button>
        </div>
    </div>
);

export default function MathPlotter() {
    const [funcType, setFuncType] = useState('linear');
    const [vals, setVals] = useState({ a: 1, b: 0, c: 0 });
    const [scale, setScale] = useState(100);
    const [points, setPoints] = useState([]);

    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const lastMousePos = useRef({ x: 0, y: 0 });
    const dragDistance = useRef(0);

    const viewBox = { w: 800, h: 600 };
    const gridSize = 16;
    const unit = useMemo(() => gridSize * (scale / 100), [scale]);

    const adjustVal = (key, delta) => {
        setVals(prev => ({
            ...prev,
            [key]: parseFloat((prev[key] + delta).toFixed(2))
        }));
    };

    const handleInputChange = (key, inputValue) => {
        setVals(prev => {
            const prevValue = prev[key];
            let newValue;

            if (prevValue === 0 && inputValue.length > 1) {
                const lastChar = inputValue.charAt(inputValue.length - 1);
                newValue = parseFloat(lastChar);
            } else {
                newValue = parseFloat(inputValue);
            }

            return {
                ...prev,
                [key]: isNaN(newValue) ? 0 : newValue
            };
        });
    };

    const pathData = useMemo(() => {
        let d = "";
        const step = 2;
        const logicalLeft = (-viewBox.w / 2 - offset.x) / unit - 5;
        const logicalRight = (viewBox.w / 2 - offset.x) / unit + 5;

        for (let x = logicalLeft; x <= logicalRight; x += step / unit) {
            const y = funcType === 'linear'
                ? vals.a * x + vals.b
                : vals.a * (x * x) + vals.b * x + vals.c;

            const visualX = viewBox.w / 2 + offset.x + (x * unit);
            const visualY = viewBox.h / 2 + offset.y - (y * unit);

            if (visualY < -10000 || visualY > 10000) continue;

            if (d === "") d += `M ${visualX} ${visualY}`;
            else d += ` L ${visualX} ${visualY}`;
        }
        return d;
    }, [funcType, vals, unit, offset, viewBox]);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        lastMousePos.current = { x: e.clientX, y: e.clientY };
        dragDistance.current = 0;
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const dx = e.clientX - lastMousePos.current.x;
        const dy = e.clientY - lastMousePos.current.y;

        lastMousePos.current = { x: e.clientX, y: e.clientY };
        dragDistance.current += Math.abs(dx) + Math.abs(dy);

        const rect = e.currentTarget.getBoundingClientRect();
        const scaleX = viewBox.w / rect.width;
        const scaleY = viewBox.h / rect.height;

        setOffset(prev => ({
            x: prev.x + dx * scaleX,
            y: prev.y + dy * scaleY
        }));
    };

    const handleMouseUp = (e) => {
        setIsDragging(false);
        if (dragDistance.current < 5) {
            handleSvgClick(e);
        }
    };

    const handleSvgClick = (e) => {
        const svg = e.currentTarget.closest('svg');
        const rect = svg.getBoundingClientRect();

        const mouseX = ((e.clientX - rect.left) / rect.width) * viewBox.w;
        const mouseY = ((e.clientY - rect.top) / rect.height) * viewBox.h;

        const rawX = (mouseX - viewBox.w / 2 - offset.x) / unit;
        const rawY = (viewBox.h / 2 + offset.y - mouseY) / unit;

        const snappedX = Math.round(rawX);
        const snappedY = Math.round(rawY);

        if (!points.find(p => p.x === snappedX && p.y === snappedY)) {
            setPoints([...points, { x: snappedX, y: snappedY }]);
        }
    };

    return (
        <div className="math-container">
            <div
                className="canvas-container-math"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={() => setIsDragging(false)}
            >
                <svg viewBox={`0 0 ${viewBox.w} ${viewBox.h}`} className="math-svg">
                    <defs>
                        <pattern
                            id="math-grid"
                            width={unit}
                            height={unit}
                            patternUnits="userSpaceOnUse"
                            x={viewBox.w/2 + offset.x}
                            y={viewBox.h/2 + offset.y}
                        >
                            <path d={`M ${unit} 0 L 0 0 0 ${unit}`} fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1"/>
                        </pattern>
                    </defs>

                    <rect x="-5000" y="-5000" width="10000" height="10000" fill="url(#math-grid)" />

                    <line
                        x1="-5000" y1={viewBox.h/2 + offset.y}
                        x2="5000" y2={viewBox.h/2 + offset.y}
                        stroke="rgba(255,255,255,0.3)" strokeWidth="2"
                    />
                    <line
                        x1={viewBox.w/2 + offset.x} y1="-5000"
                        x2={viewBox.w/2 + offset.x} y2="5000"
                        stroke="rgba(255,255,255,0.3)" strokeWidth="2"
                    />

                    <path
                        d={pathData}
                        fill="none"
                        stroke="#00FFFF"
                        strokeWidth="3"
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,255,0.6))' }}
                    />

                    {points.map((p, i) => (
                        <circle
                            key={i}
                            cx={viewBox.w / 2 + offset.x + (p.x * unit)}
                            cy={viewBox.h / 2 + offset.y - (p.y * unit)}
                            r="6"
                            fill="#ff3b30"
                        />
                    ))}
                </svg>
                <div className="stats-math">
                    OFFSET: {Math.round(offset.x)}, {Math.round(offset.y)} | SCALE: {scale}%
                </div>
            </div>

            <div className="controls-math">
                <div className="control-group-math">
                    <h3>函數類型</h3>
                    <select className="math-select" value={funcType} onChange={(e) => setFuncType(e.target.value)}>
                        <option value="linear">一次函數 (y = ax + b)</option>
                        <option value="quadratic">二次函數 (y = ax² + bx + c)</option>
                    </select>
                    <div className="steppers-grid">
                        <ValueStepper label="a" valKey="a" value={vals.a} onAdjust={adjustVal} onChange={handleInputChange} />
                        <ValueStepper label="b" valKey="b" value={vals.b} onAdjust={adjustVal} onChange={handleInputChange} />
                        {funcType === 'quadratic' && (
                            <ValueStepper label="c" valKey="c" value={vals.c} onAdjust={adjustVal} onChange={handleInputChange} />
                        )}
                    </div>
                </div>

                <div className="control-group-math">
                    <h3>縮放與視角</h3>
                    <input type="range" min="50" max="2000" value={scale} onChange={e => setScale(parseInt(e.target.value))}/>
                    <button className="math-btn-danger" style={{marginTop: '10px', background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)'}} onClick={() => setOffset({x:0, y:0})}>重置視角 (Center)</button>
                </div>

                <div className="control-group-math">
                    <h3>座標點 (自動對齊)</h3>
                    <div className="coords-list-math">
                        {points.length === 0 ? "點擊網格交叉點標記" : points.map((p, i) => (
                            <span key={i} className="coord-tag">({p.x}, {p.y})</span>
                        ))}
                    </div>
                    <button className="math-btn-danger" style={{marginTop: '15px'}} onClick={() => setPoints([])}>清除全部</button>
                </div>
            </div>
        </div>
    );
}
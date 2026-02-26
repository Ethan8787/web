import { useEffect, useRef, useState } from "react";
import "./Math.css";

export default function Math() {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const [scale, setScale] = useState(100);
    const gridSize = 64;

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        const width = container.clientWidth;
        const height = container.clientHeight;

        canvas.width = width;
        canvas.height = height;

        ctx.clearRect(0, 0, width, height);

        const unit = gridSize * (scale / 100);
        const centerX = width / 2;
        const centerY = height / 2;

        ctx.strokeStyle = "rgba(255,255,255,0.1)";
        ctx.beginPath();

        for (let x = centerX % unit; x < width; x += unit) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
        }

        for (let y = centerY % unit; y < height; y += unit) {
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
        }

        ctx.stroke();

    }, [scale]);

    return (
        <div className="math-wrapper">
            <div className="glass-card">
                <div className="controls">
                    <input
                        type="range"
                        min="50"
                        max="5000"
                        value={scale}
                        onChange={e => setScale(parseInt(e.target.value))}
                    />
                </div>

                <div className="canvas-container" ref={containerRef}>
                    <canvas ref={canvasRef}/>
                </div>
            </div>
        </div>
    );
}
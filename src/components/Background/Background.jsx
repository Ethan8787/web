import React, { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';
import './Background.css';

const Background = ({ isPaused }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const noise3D = createNoise3D();
        let animationFrameId;
        let time = 0;
        let lastTime = performance.now();

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const gridStep = 10;
        const levels = 7;

        const render = (now) => {
            const dt = (now - lastTime) / 1000;
            lastTime = now;

            if (!isPaused) {
                time += 0.08 * Math.min(dt, 0.1);
            }

            const width = canvas.width;
            const height = canvas.height;

            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, width, height);

            ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.lineWidth = 1.2;

            const cols = Math.floor(width / gridStep) + 1;
            const rows = Math.floor(height / gridStep) + 1;

            const grid = new Float32Array(cols * rows);

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const x = c * gridStep;
                    const y = r * gridStep;

                    const n1 = noise3D(x * 0.0012, y * 0.0012, time);
                    const n2 = noise3D(x * 0.0035 + 100, y * 0.0035 + 100, time * 1.5);

                    let combined = n1 * 0.75 + n2 * 0.25;
                    combined = Math.sin(combined * Math.PI * 1.2);

                    grid[r * cols + c] = (combined + 1) / 2;
                }
            }

            for (let level = 1; level < levels; level++) {
                const threshold = level / levels;

                for (let r = 0; r < rows - 1; r++) {
                    for (let c = 0; c < cols - 1; c++) {
                        const x = c * gridStep;
                        const y = r * gridStep;

                        const vTL = grid[r * cols + c];
                        const vTR = grid[r * cols + (c + 1)];
                        const vBR = grid[(r + 1) * cols + (c + 1)];
                        const vBL = grid[(r + 1) * cols + c];

                        const cellSquare =
                            (vTL >= threshold ? 8 : 0) |
                            (vTR >= threshold ? 4 : 0) |
                            (vBR >= threshold ? 2 : 0) |
                            (vBL >= threshold ? 1 : 0);

                        if (cellSquare === 0 || cellSquare === 15) continue;

                        const top = [x + (gridStep * (threshold - vTL)) / (vTR - vTL || 0.0001), y];
                        const right = [x + gridStep, y + (gridStep * (threshold - vTR)) / (vBR - vTR || 0.0001)];
                        const bottom = [x + (gridStep * (threshold - vBL)) / (vBR - vBL || 0.0001), y + gridStep];
                        const left = [x, y + (gridStep * (threshold - vTL)) / (vBL - vTL || 0.0001)];

                        ctx.beginPath();
                        switch (cellSquare) {
                            case 1: case 14:
                                ctx.moveTo(...left); ctx.lineTo(...bottom); break;
                            case 2: case 13:
                                ctx.moveTo(...bottom); ctx.lineTo(...right); break;
                            case 3: case 12:
                                ctx.moveTo(...left); ctx.lineTo(...right); break;
                            case 4: case 11:
                                ctx.moveTo(...top); ctx.lineTo(...right); break;
                            case 5:
                                ctx.moveTo(...left); ctx.lineTo(...top);
                                ctx.moveTo(...bottom); ctx.lineTo(...right); break;
                            case 6: case 9:
                                ctx.moveTo(...top); ctx.lineTo(...bottom); break;
                            case 7: case 8:
                                ctx.moveTo(...left); ctx.lineTo(...top); break;
                            case 10:
                                ctx.moveTo(...top); ctx.lineTo(...right);
                                ctx.moveTo(...left); ctx.lineTo(...bottom); break;
                            default: break;
                        }
                        ctx.stroke();
                    }
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPaused]);

    return (
        <div className="background">
            <canvas ref={canvasRef} className="contour-canvas" />
        </div>
    );
};

export default Background;
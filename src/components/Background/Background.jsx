import React, { useEffect, useRef } from 'react';
import { createNoise3D } from 'simplex-noise';
import './Background.css';

// 依裝置能力分級：格點越密、層級越多、更新頻率越高 = 品質越好但越吃效能
const QUALITY_TIERS = {
    high:   { gridStep: 10, levels: 7, updateHz: 60, renderScale: 1 },
    medium: { gridStep: 12, levels: 6, updateHz: 30, renderScale: 0.75 },
    low:    { gridStep: 16, levels: 5, updateHz: 20, renderScale: 0.55 },
};

function detectInitialTier() {
    if (typeof navigator === 'undefined') return 'high';
    const cores = navigator.hardwareConcurrency || 4;
    const mem = navigator.deviceMemory || 4; // Safari/iOS 不支援此 API，預設當作 4
    const isCoarsePointer = window.matchMedia?.('(pointer: coarse)').matches;
    const isNarrow = window.innerWidth < 768;

    let score = 0;
    if (cores <= 4) score += 1;
    if (mem <= 4) score += 1;
    if (isCoarsePointer) score += 1;
    if (isNarrow) score += 1;

    if (score >= 3) return 'low';
    if (score >= 1) return 'medium';
    return 'high';
}

const Background = ({ isPaused }) => {
    const canvasRef = useRef(null);
    const isPausedRef = useRef(isPaused);

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        const noise3D = createNoise3D();
        let animationFrameId;
        let time = 0;
        let lastFrameTime = performance.now();

        let tierName = detectInitialTier();
        let tier = QUALITY_TIERS[tierName];

        let cols = 0;
        let rows = 0;
        let grid = null;
        let cachedPath = null; // 只有重算網格時才重建，其餘 RAF 直接沿用

        let accumulator = 0; // 把「運算」跟「畫面」的頻率脫鉤

        // 自動降級用的耗時量測
        let sampleCount = 0;
        let sampleTotal = 0;
        const SAMPLE_WINDOW = 20;

        const resizeCanvas = () => {
            const scale = tier.renderScale;
            canvas.width = Math.floor(window.innerWidth * scale);
            canvas.height = Math.floor(window.innerHeight * scale);

            cols = Math.floor(canvas.width / tier.gridStep) + 1;
            rows = Math.floor(canvas.height / tier.gridStep) + 1;

            grid = new Float32Array(cols * rows);
            cachedPath = null;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let isTabVisible = true;
        const handleVisibility = () => {
            isTabVisible = document.visibilityState === 'visible';
            if (isTabVisible) lastFrameTime = performance.now();
        };
        document.addEventListener('visibilitychange', handleVisibility);

        const applyTier = (name) => {
            if (name === tierName) return;
            tierName = name;
            tier = QUALITY_TIERS[tierName];
            resizeCanvas();
        };

        const computeGridAndPath = () => {
            const gridStep = tier.gridStep;

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

            const path = new Path2D();

            for (let level = 1; level < tier.levels; level++) {
                const threshold = level / tier.levels;

                for (let r = 0; r < rows - 1; r++) {
                    for (let c = 0; c < cols - 1; c++) {
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

                        const x = c * gridStep;
                        const y = r * gridStep;

                        const top = [x + (gridStep * (threshold - vTL)) / (vTR - vTL || 0.0001), y];
                        const right = [x + gridStep, y + (gridStep * (threshold - vTR)) / (vBR - vTR || 0.0001)];
                        const bottom = [x + (gridStep * (threshold - vBL)) / (vBR - vBL || 0.0001), y + gridStep];
                        const left = [x, y + (gridStep * (threshold - vTL)) / (vBL - vTL || 0.0001)];

                        switch (cellSquare) {
                            case 1: case 14:
                                path.moveTo(...left); path.lineTo(...bottom); break;
                            case 2: case 13:
                                path.moveTo(...bottom); path.lineTo(...right); break;
                            case 3: case 12:
                                path.moveTo(...left); path.lineTo(...right); break;
                            case 4: case 11:
                                path.moveTo(...top); path.lineTo(...right); break;
                            case 5:
                                path.moveTo(...left); path.lineTo(...top);
                                path.moveTo(...bottom); path.lineTo(...right); break;
                            case 6: case 9:
                                path.moveTo(...top); path.lineTo(...bottom); break;
                            case 7: case 8:
                                path.moveTo(...left); path.lineTo(...top); break;
                            case 10:
                                path.moveTo(...top); path.lineTo(...right);
                                path.moveTo(...left); path.lineTo(...bottom); break;
                            default: break;
                        }
                    }
                }
            }

            cachedPath = path;
        };

        const draw = () => {
            ctx.fillStyle = '#111';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if (cachedPath) {
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
                ctx.lineWidth = 1.5;
                ctx.lineCap = 'round';
                ctx.lineJoin = 'round';
                ctx.stroke(cachedPath);
            }
        };

        const render = (now) => {
            const dt = (now - lastFrameTime) / 1000;
            lastFrameTime = now;

            if (!isPausedRef.current && isTabVisible) {
                time += 0.02 * Math.min(dt, 0.1);
                accumulator += dt;

                const updateInterval = 1 / tier.updateHz;
                if (accumulator >= updateInterval) {
                    accumulator = 0;

                    const t0 = performance.now();
                    computeGridAndPath();
                    const cost = performance.now() - t0;

                    sampleTotal += cost;
                    sampleCount += 1;
                    if (sampleCount >= SAMPLE_WINDOW) {
                        const avg = sampleTotal / sampleCount;
                        sampleTotal = 0;
                        sampleCount = 0;

                        // 平均一次運算超過該 tier 更新間隔的 70%，代表快撐不住了，降一級
                        if (avg > updateInterval * 1000 * 0.7) {
                            if (tierName === 'high') applyTier('medium');
                            else if (tierName === 'medium') applyTier('low');
                        }
                    }

                    draw();
                }
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            document.removeEventListener('visibilitychange', handleVisibility);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="background">
            <canvas ref={canvasRef} className="contour-canvas" />
        </div>
    );
};

export default Background;
import React, { useEffect, useRef } from 'react';
import './Background.css';

const Background = ({ isPaused }) => {
    const canvasRef = useRef(null);
    const isPausedRef = useRef(isPaused);

    useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        const dpr = window.devicePixelRatio || 1;

        const getW = () => window.innerWidth;
        const getH = () => window.innerHeight;
        const mouse = { x: getW() / 2, y: getH() / 2 };

        let gridAlpha = 0;
        let mouseMoving = false;
        let mouseIdleTimer = null;
        const GRID_FADE_SPEED = 0.04;
        const MOUSE_IDLE_MS = 250;

        const CELL = 48;
        // PX per second — every trace travels at exactly this speed
        const TRACE_SPEED_PX = 300;
        const TRACE_COUNT = 14;
        const TAIL_LENGTH_PX = 300; // fixed px tail length, same for every trace
        const CORNER_R = CELL * 0.6;

        // ── Occupancy grid: each cell records which traces pass through it ──
        // Key: "col,row"  Value: Set of trace ids
        const occupancy = new Map();

        const cellKey = (cx, cy) => `${cx},${cy}`;

        const markSegment = (id, x0, y0, x1, y1) => {
            // mark every grid cell the segment passes through
            const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / CELL) + 1;
            for (let i = 0; i <= steps; i++) {
                const t = steps === 0 ? 0 : i / steps;
                const cx = Math.round((x0 + (x1 - x0) * t) / CELL);
                const cy = Math.round((y0 + (y1 - y0) * t) / CELL);
                const k = cellKey(cx, cy);
                if (!occupancy.has(k)) occupancy.set(k, new Set());
                occupancy.get(k).add(id);
            }
        };

        const clearTrace = (id) => {
            for (const [k, s] of occupancy) {
                s.delete(id);
                if (s.size === 0) occupancy.delete(k);
            }
        };

        const segmentOccupied = (x0, y0, x1, y1, selfId) => {
            const steps = Math.ceil(Math.hypot(x1 - x0, y1 - y0) / CELL) + 1;
            for (let i = 0; i <= steps; i++) {
                const t = steps === 0 ? 0 : i / steps;
                const cx = Math.round((x0 + (x1 - x0) * t) / CELL);
                const cy = Math.round((y0 + (y1 - y0) * t) / CELL);
                const s = occupancy.get(cellKey(cx, cy));
                if (s && s.size > 0) {
                    // occupied by someone other than self
                    for (const id of s) if (id !== selfId) return true;
                }
            }
            return false;
        };

        const resize = () => {
            canvas.width = getW() * dpr;
            canvas.height = getH() * dpr;
            canvas.style.width = `${getW()}px`;
            canvas.style.height = `${getH()}px`;
            ctx.scale(dpr, dpr);
        };

        const NEON = {
            cyan: '#00ffe7',
            magenta: '#ff00cc',
            green: '#00ff88',
            orange: '#ff6600',
        };

        // ── Grid ─────────────────────────────────────────────────────────────
        const drawGrid = () => {
            if (gridAlpha <= 0.001) return;
            const W = getW(), H = getH();
            const cols = Math.ceil(W / CELL) + 2;
            const rows = Math.ceil(H / CELL) + 2;
            const vpX = mouse.x / W - 0.5;
            const vpY = mouse.y / H - 0.5;

            ctx.save();
            ctx.lineWidth = 0.4;
            for (let c = 0; c < cols; c++) {
                for (let r = 0; r < rows; r++) {
                    const x = c * CELL - CELL / 2;
                    const y = r * CELL - CELL / 2;
                    const wx = x - (x / W - 0.5 - vpX) * 0.06 * W;
                    const wy = y - (y / H - 0.5 - vpY) * 0.06 * H;
                    const md = Math.hypot(wx - mouse.x, wy - mouse.y);
                    const pulse = Math.max(0, 1 - md / 220);
                    ctx.strokeStyle = `rgba(0,255,231,${(0.06 + pulse * 0.30) * gridAlpha})`;
                    ctx.strokeRect(wx, wy, CELL, CELL);
                    if (pulse > 0.1) {
                        ctx.beginPath();
                        ctx.arc(wx, wy, 1 + pulse * 2.5, 0, Math.PI * 2);
                        ctx.fillStyle = `rgba(0,255,231,${pulse * 0.9 * gridAlpha})`;
                        ctx.fill();
                    }
                }
            }
            ctx.restore();
        };

        // ── Path helpers ─────────────────────────────────────────────────────
        const buildRoundedPath = (pts, radius) => {
            if (pts.length < 3) return pts;
            const out = [pts[0]];
            for (let i = 1; i < pts.length - 1; i++) {
                const p0 = pts[i - 1], p1 = pts[i], p2 = pts[i + 1];
                let dx1 = p0.x - p1.x, dy1 = p0.y - p1.y;
                const len1 = Math.hypot(dx1, dy1); dx1 /= len1; dy1 /= len1;
                let dx2 = p2.x - p1.x, dy2 = p2.y - p1.y;
                const len2 = Math.hypot(dx2, dy2); dx2 /= len2; dy2 /= len2;
                const r = Math.min(radius, len1 / 2, len2 / 2);
                const startP = { x: p1.x + dx1 * r, y: p1.y + dy1 * r };
                const endP = { x: p1.x + dx2 * r, y: p1.y + dy2 * r };
                out.push(startP);
                const STEPS = 8;
                for (let j = 1; j < STEPS; j++) {
                    const t = j / STEPS, mt = 1 - t;
                    out.push({
                        x: mt * mt * startP.x + 2 * mt * t * p1.x + t * t * endP.x,
                        y: mt * mt * startP.y + 2 * mt * t * p1.y + t * t * endP.y,
                    });
                }
                out.push(endP);
            }
            out.push(pts[pts.length - 1]);
            return out;
        };

        const polylineLen = (pts) => {
            let len = 0;
            for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
            return len;
        };

        const pointOnPoly = (pts, t) => {
            const total = polylineLen(pts);
            const target = Math.min(t, 1) * total;
            let acc = 0;
            for (let i = 1; i < pts.length; i++) {
                const dx = pts[i].x - pts[i - 1].x;
                const dy = pts[i].y - pts[i - 1].y;
                const d = Math.hypot(dx, dy);
                if (acc + d >= target) {
                    const f = d > 0 ? (target - acc) / d : 0;
                    return { x: pts[i - 1].x + dx * f, y: pts[i - 1].y + dy * f };
                }
                acc += d;
            }
            return pts[pts.length - 1];
        };

        const slicePoly = (pts, t0, t1) => {
            if (t0 >= t1) return [];
            const total = polylineLen(pts);
            const d0 = Math.min(t0, 1) * total;
            const d1 = Math.min(t1, 1) * total;
            const result = [];
            let acc = 0;
            result.push(pointOnPoly(pts, t0));
            for (let i = 1; i < pts.length; i++) {
                const dx = pts[i].x - pts[i - 1].x;
                const dy = pts[i].y - pts[i - 1].y;
                const d = Math.hypot(dx, dy);
                const nextAcc = acc + d;
                if (nextAcc > d0 && acc < d1) {
                    if (nextAcc <= d1) {
                        result.push({ x: pts[i].x, y: pts[i].y });
                    } else {
                        const f = (d1 - acc) / d;
                        result.push({ x: pts[i - 1].x + dx * f, y: pts[i - 1].y + dy * f });
                        break;
                    }
                }
                acc = nextAcc;
            }
            if (result.length === 1) result.push(pointOnPoly(pts, t1));
            return result;
        };

        // ── Path generation: grid-snapped, boundary-reaching ─────────────────
        let traceIdCounter = 0;

        const buildBoundaryPath = (selfId) => {
            const W = getW(), H = getH();
            const snap = v => Math.round(v / CELL) * CELL;

            // Pick a random interior starting cell (not the boundary itself)
            const margin = 2;
            const gridW = Math.floor(W / CELL);
            const gridH = Math.floor(H / CELL);

            let sx, sy;
            let attempts = 0;
            do {
                sx = snap((margin + Math.floor(Math.random() * (gridW - margin * 2))) * CELL);
                sy = snap((margin + Math.floor(Math.random() * (gridH - margin * 2))) * CELL);
                attempts++;
            } while (
                attempts < 20 &&
                occupancy.has(cellKey(Math.round(sx / CELL), Math.round(sy / CELL)))
                );

            const rawPts = [{ x: sx, y: sy }];
            let cx = sx, cy = sy;

            // Alternate horizontal/vertical segments, avoiding occupied cells
            // Continue until we reach or pass the boundary
            const MAX_SEGS = 20;
            let prevHoriz = Math.random() < 0.5;

            for (let i = 0; i < MAX_SEGS; i++) {
                const horiz = !prevHoriz;
                prevHoriz = horiz;

                // Determine how far we can go in each direction
                const minLen = 2 * CELL;
                const maxLen = 5 * CELL;

                // Try both positive and negative direction, pick the one that doesn't overlap
                const dirs = Math.random() < 0.5 ? [1, -1] : [-1, 1];
                let chosen = null;

                for (const dir of dirs) {
                    // Find max non-overlapping length in this direction
                    let bestLen = 0;
                    for (let l = CELL; l <= maxLen; l += CELL) {
                        const nx = horiz ? cx + l * dir : cx;
                        const ny = horiz ? cy : cy + l * dir;
                        if (segmentOccupied(cx, cy, nx, ny, selfId)) break;
                        bestLen = l;
                    }
                    if (bestLen >= minLen) {
                        // Clamp random length within non-overlapping range
                        const segs = Math.floor(minLen / CELL) + Math.floor(Math.random() * ((bestLen - minLen) / CELL + 1));
                        const len = segs * CELL;
                        chosen = { dx: horiz ? dir : 0, dy: horiz ? 0 : dir, len };
                        break;
                    }
                }

                if (!chosen) break; // no room to extend

                const nx = cx + chosen.dx * chosen.len;
                const ny = cy + chosen.dy * chosen.len;

                rawPts.push({ x: nx, y: ny });
                markSegment(selfId, cx, cy, nx, ny);
                cx = nx;
                cy = ny;

                // Stop if we've reached outside the canvas boundaries
                if (cx <= 0 || cx >= W || cy <= 0 || cy >= H) break;
            }

            // If we didn't naturally reach a boundary, add one final segment to the edge
            if (cx > 0 && cx < W && cy > 0 && cy < H) {
                // Choose the nearest boundary
                const distLeft = cx;
                const distRight = W - cx;
                const distTop = cy;
                const distBottom = H - cy;
                const minDist = Math.min(distLeft, distRight, distTop, distBottom);

                let fx = cx, fy = cy;
                if (minDist === distLeft) fx = 0;
                else if (minDist === distRight) fx = W;
                else if (minDist === distTop) fy = 0;
                else fy = H;

                // Snap to last horizontal or vertical (keep direction consistent)
                const lastSeg = rawPts.length >= 2
                    ? { dx: rawPts[rawPts.length - 1].x - rawPts[rawPts.length - 2].x, dy: rawPts[rawPts.length - 1].y - rawPts[rawPts.length - 2].y }
                    : { dx: 1, dy: 0 };

                // Force straight line to boundary in perpendicular direction
                if (lastSeg.dx !== 0) {
                    // Last was horizontal → go vertical to boundary
                    fy = distTop < distBottom ? 0 : H;
                    fx = cx;
                } else {
                    // Last was vertical → go horizontal to boundary
                    fx = distLeft < distRight ? 0 : W;
                    fy = cy;
                }

                rawPts.push({ x: fx, y: fy });
                markSegment(selfId, cx, cy, fx, fy);
            }

            return buildRoundedPath(rawPts, CORNER_R);
        };

        // ── Trace class ───────────────────────────────────────────────────────
        class Trace {
            constructor(initialProgress = 0) {
                this.id = ++traceIdCounter;
                this.pts = buildBoundaryPath(this.id);
                this.totalLen = polylineLen(this.pts);
                // traveledPx: how many pixels the head has traveled
                this.traveledPx = initialProgress * (this.totalLen + TAIL_LENGTH_PX);
                this.color = [NEON.cyan, NEON.magenta, NEON.green, NEON.orange][Math.floor(Math.random() * 4)];
                this.width = 1.5;
                this.alive = true;
            }

            // dt in seconds
            update(dt) {
                this.traveledPx += TRACE_SPEED_PX * dt;
                const fullDist = this.totalLen + TAIL_LENGTH_PX + CELL * 2;
                if (this.traveledPx > fullDist) {
                    this.alive = false;
                }
            }

            draw() {
                const progress = this.traveledPx / this.totalLen; // can exceed 1
                const headT = Math.min(progress, 1);
                const tailT = Math.max(0, this.traveledPx - TAIL_LENGTH_PX) / this.totalLen;
                const headPos = pointOnPoly(this.pts, headT);

                let fade = 1;
                if (progress > 1) {
                    const tailOvershoot = this.traveledPx - this.totalLen;
                    fade = Math.max(0, 1 - tailOvershoot / TAIL_LENGTH_PX);
                }

                ctx.save();
                ctx.lineJoin = 'round';
                ctx.lineCap = 'round';

                // Ghost full path
                ctx.lineWidth = this.width;
                ctx.strokeStyle = `${this.color}14`;
                ctx.beginPath();
                this.pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
                ctx.stroke();

                // Glowing tail
                const tailPts = slicePoly(this.pts, tailT, headT);
                if (tailPts.length >= 2) {
                    ctx.lineWidth = this.width * 6;
                    ctx.strokeStyle = `${this.color}18`;
                    ctx.beginPath();
                    tailPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
                    ctx.stroke();

                    ctx.lineWidth = this.width * 3.5;
                    ctx.strokeStyle = `${this.color}38`;
                    ctx.beginPath();
                    tailPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
                    ctx.stroke();

                    ctx.lineWidth = this.width * 1.2;
                    ctx.strokeStyle = `${this.color}cc`;
                    ctx.beginPath();
                    tailPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
                    ctx.stroke();
                }

                // Head glow orb
                if (fade > 0 && progress <= 1) {
                    ctx.globalAlpha = fade;
                    const glowR = 18;
                    const glow = ctx.createRadialGradient(headPos.x, headPos.y, 0, headPos.x, headPos.y, glowR);
                    glow.addColorStop(0, `${this.color}ee`);
                    glow.addColorStop(0.35, `${this.color}66`);
                    glow.addColorStop(1, `${this.color}00`);
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(headPos.x, headPos.y, glowR, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(headPos.x, headPos.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        // ── Scanlines ─────────────────────────────────────────────────────────
        const drawScanlines = () => {
            const W = getW(), H = getH();
            ctx.save();
            ctx.globalAlpha = 0.035;
            ctx.fillStyle = '#000';
            for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
            ctx.restore();
        };

        // ── Corner HUD ────────────────────────────────────────────────────────
        const drawHUD = (t) => {
            const W = getW(), H = getH();
            const blink = Math.sin(t * 0.004) > 0.6;
            ctx.save();
            ctx.strokeStyle = `${NEON.cyan}88`;
            ctx.lineWidth = 1;
            const corner = (x, y, sx, sy) => {
                ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy);
                ctx.beginPath(); ctx.moveTo(0, 28); ctx.lineTo(0, 0); ctx.lineTo(28, 0); ctx.stroke();
                ctx.restore();
            };
            corner(16, 16, 1, 1);
            corner(W - 16, 16, -1, 1);
            corner(16, H - 16, 1, -1);
            corner(W - 16, H - 16, -1, -1);
            if (blink) {
                ctx.fillStyle = NEON.green;
                ctx.globalAlpha = 0.8;
                ctx.beginPath();
                ctx.arc(W - 22, H - 22, 3, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        };

        // ── Init ──────────────────────────────────────────────────────────────
        let traces = Array.from({ length: TRACE_COUNT }, (_, i) => {
            return new Trace(i / TRACE_COUNT); // staggered start positions
        });

        let lastTimestamp = null;

        // ── Animate ───────────────────────────────────────────────────────────
        const animate = (timestamp) => {
            if (!isPausedRef.current) {
                const dt = lastTimestamp !== null ? Math.min((timestamp - lastTimestamp) / 1000, 0.05) : 0;
                lastTimestamp = timestamp;

                const W = getW(), H = getH();
                const gridTarget = mouseMoving ? 1 : 0;
                gridAlpha += (gridTarget - gridAlpha) * GRID_FADE_SPEED;

                ctx.clearRect(0, 0, W, H);
                ctx.fillStyle = '#050a0e';
                ctx.fillRect(0, 0, W, H);

                const cg = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.6);
                cg.addColorStop(0, 'rgba(0,40,60,0.8)');
                cg.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = cg;
                ctx.fillRect(0, 0, W, H);

                drawGrid();

                // Update and replace dead traces
                traces = traces.map(tr => {
                    tr.update(dt);
                    if (!tr.alive) {
                        clearTrace(tr.id);
                        return new Trace(0);
                    }
                    return tr;
                });
                traces.forEach(tr => tr.draw());

                drawScanlines();
                drawHUD(timestamp);
            } else {
                lastTimestamp = null; // reset so we don't jump on unpause
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        // ── Events ────────────────────────────────────────────────────────────
        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouseMoving = true;
            clearTimeout(mouseIdleTimer);
            mouseIdleTimer = setTimeout(() => { mouseMoving = false; }, MOUSE_IDLE_MS);
        };

        const handleResize = () => {
            resize();
            traces.forEach(tr => clearTrace(tr.id));
            occupancy.clear();
            traces = Array.from({ length: TRACE_COUNT }, (_, i) => new Trace(i / TRACE_COUNT));
            lastTimestamp = null;
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        resize();
        animationFrameId = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            clearTimeout(mouseIdleTimer);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="bg-canvas-wrapper">
            <canvas ref={canvasRef} />
        </div>
    );
};

export default Background;
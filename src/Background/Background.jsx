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

        let gridAlpha    = 0;
        let mouseMoving  = false;
        let mouseIdleTimer = null;
        const GRID_FADE_SPEED = 0.04;
        const MOUSE_IDLE_MS   = 250;

        const resize = () => {
            canvas.width  = getW() * dpr;
            canvas.height = getH() * dpr;
            canvas.style.width  = `${getW()}px`;
            canvas.style.height = `${getH()}px`;
            ctx.scale(dpr, dpr);
        };

        const NEON = {
            cyan:    '#00ffe7',
            magenta: '#ff00cc',
            green:   '#00ff88',
            orange:  '#ff6600',
        };

        // ── Grid ────────────────────────────────────────────────────────────
        const CELL = 48;

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
                    const x  = c * CELL - CELL / 2;
                    const y  = r * CELL - CELL / 2;
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

        // ── Helpers ──────────────────────────────────────────────────────────

        const buildRoundedPath = (pts, radius) => {
            if (pts.length < 3) return pts;
            const out = [pts[0]];
            for (let i = 1; i < pts.length - 1; i++) {
                const p0 = pts[i-1], p1 = pts[i], p2 = pts[i+1];

                let dx1 = p0.x - p1.x, dy1 = p0.y - p1.y;
                const len1 = Math.hypot(dx1, dy1);
                dx1 /= len1; dy1 /= len1;

                let dx2 = p2.x - p1.x, dy2 = p2.y - p1.y;
                const len2 = Math.hypot(dx2, dy2);
                dx2 /= len2; dy2 /= len2;

                const r = Math.min(radius, len1 / 2, len2 / 2);

                const startP = { x: p1.x + dx1 * r, y: p1.y + dy1 * r };
                const endP   = { x: p1.x + dx2 * r, y: p1.y + dy2 * r };

                out.push(startP);

                const STEPS = 8;
                for (let j = 1; j < STEPS; j++) {
                    const t = j / STEPS;
                    const mt = 1 - t;
                    out.push({
                        x: mt * mt * startP.x + 2 * mt * t * p1.x + t * t * endP.x,
                        y: mt * mt * startP.y + 2 * mt * t * p1.y + t * t * endP.y
                    });
                }
                out.push(endP);
            }
            out.push(pts[pts.length - 1]);
            return out;
        };

        const polylineLen = (pts) => {
            let len = 0;
            for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i-1].x, pts[i].y - pts[i-1].y);
            return len;
        };

        const pointOnPoly = (pts, t) => {
            const total  = polylineLen(pts);
            const target = Math.min(t, 1) * total;
            let acc = 0;
            for (let i = 1; i < pts.length; i++) {
                const dx = pts[i].x - pts[i-1].x;
                const dy = pts[i].y - pts[i-1].y;
                const d  = Math.hypot(dx, dy);
                if (acc + d >= target) {
                    const f = d > 0 ? (target - acc) / d : 0;
                    return { x: pts[i-1].x + dx * f, y: pts[i-1].y + dy * f };
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

            const startPt = pointOnPoly(pts, t0);
            result.push(startPt);

            for (let i = 1; i < pts.length; i++) {
                const dx = pts[i].x - pts[i-1].x;
                const dy = pts[i].y - pts[i-1].y;
                const d  = Math.hypot(dx, dy);
                const nextAcc = acc + d;

                if (nextAcc > d0 && acc < d1) {
                    if (nextAcc <= d1) {
                        result.push({ x: pts[i].x, y: pts[i].y });
                    } else {
                        const f = (d1 - acc) / d;
                        result.push({ x: pts[i-1].x + dx * f, y: pts[i-1].y + dy * f });
                        break;
                    }
                }
                acc = nextAcc;
            }

            if (result.length === 1) result.push(pointOnPoly(pts, t1));
            return result;
        };

        // ── Trace ────────────────────────────────────────────────────────────
        const CORNER_R = CELL * 0.6;

        class Trace {
            constructor() { this.reset(); }

            reset() {
                const W = getW(), H = getH();
                const snap = v => Math.round(v / CELL) * CELL;

                const start = { x: snap(Math.random() * W), y: snap(Math.random() * H) };
                const rawPts = [start];
                let cx = start.x, cy = start.y;

                const segs = 4 + Math.floor(Math.random() * 5);
                for (let i = 0; i < segs; i++) {
                    const horiz = i % 2 === 0;
                    const len   = (3 + Math.floor(Math.random() * 7)) * CELL;
                    const dir   = Math.random() < 0.5 ? 1 : -1;
                    if (horiz) cx += len * dir; else cy += len * dir;
                    rawPts.push({ x: cx, y: cy });
                }

                this.pts = buildRoundedPath(rawPts, CORNER_R);
                this.totalLen = polylineLen(this.pts);
                this.progress = 0;
                this.speed    = 0.001 + Math.random() * 0.0005;
                this.color    = [NEON.cyan, NEON.magenta, NEON.green, NEON.orange][Math.floor(Math.random() * 4)];
                this.width    = 1.5;
                this.alive    = true;
                this.tailFrac = 0.10 + Math.random() * 0.10;
            }

            draw() {
                this.progress += this.speed;
                if (this.progress > 1 + this.tailFrac + 0.05) { this.alive = false; return; }

                const headT = Math.min(this.progress, 1);
                const tailT = Math.max(0, this.progress - this.tailFrac);
                const headPos = pointOnPoly(this.pts, headT);

                let fade = 1;
                if (this.progress > 1) {
                    fade = Math.max(0, 1 - ((this.progress - 1) / this.tailFrac));
                }

                ctx.save();
                ctx.lineJoin = 'round';
                ctx.lineCap  = 'round';

                // ── 1. Ghost full path ──
                ctx.lineWidth   = this.width;
                ctx.strokeStyle = `${this.color}14`;
                ctx.beginPath();
                this.pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
                ctx.stroke();

                // ── 2. Glowing tail ──
                const tailPts = slicePoly(this.pts, tailT, headT);

                if (tailPts.length >= 2) {
                    ctx.lineWidth   = this.width * 6;
                    ctx.strokeStyle = `${this.color}18`;
                    ctx.beginPath();
                    tailPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
                    ctx.stroke();

                    ctx.lineWidth   = this.width * 3.5;
                    ctx.strokeStyle = `${this.color}38`;
                    ctx.beginPath();
                    tailPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
                    ctx.stroke();

                    ctx.lineWidth   = this.width * 1.2;
                    ctx.strokeStyle = `${this.color}cc`;
                    ctx.beginPath();
                    tailPts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
                    ctx.stroke();
                }

                // ── 3. Head glow orb & white core ──
                if (fade > 0) {
                    ctx.globalAlpha = fade;

                    const glowR = 18;
                    const glow  = ctx.createRadialGradient(headPos.x, headPos.y, 0, headPos.x, headPos.y, glowR);
                    glow.addColorStop(0,   `${this.color}ee`);
                    glow.addColorStop(0.35,`${this.color}66`);
                    glow.addColorStop(1,   `${this.color}00`);
                    ctx.fillStyle = glow;
                    ctx.beginPath();
                    ctx.arc(headPos.x, headPos.y, glowR, 0, Math.PI * 2);
                    ctx.fill();

                    ctx.fillStyle   = '#ffffff';
                    ctx.beginPath();
                    ctx.arc(headPos.x, headPos.y, 2, 0, Math.PI * 2);
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        // ── Scanlines ────────────────────────────────────────────────────────
        const drawScanlines = () => {
            const W = getW(), H = getH();
            ctx.save();
            ctx.globalAlpha = 0.035;
            ctx.fillStyle   = '#000';
            for (let y = 0; y < H; y += 3) ctx.fillRect(0, y, W, 1);
            ctx.restore();
        };

        // ── Corner HUD ───────────────────────────────────────────────────────
        const drawHUD = (t) => {
            const W = getW(), H = getH();
            const blink = Math.sin(t * 0.004) > 0.6;
            ctx.save();
            ctx.strokeStyle = `${NEON.cyan}88`;
            ctx.lineWidth   = 1;
            const corner = (x, y, sx, sy) => {
                ctx.save(); ctx.translate(x, y); ctx.scale(sx, sy);
                ctx.beginPath(); ctx.moveTo(0, 28); ctx.lineTo(0, 0); ctx.lineTo(28, 0); ctx.stroke();
                ctx.restore();
            };
            corner(16,     16,      1,  1);
            corner(W - 16, 16,     -1,  1);
            corner(16,     H - 16,  1, -1);
            corner(W - 16, H - 16, -1, -1);
            if (blink) {
                ctx.fillStyle = NEON.green; ctx.globalAlpha = 0.8;
                ctx.beginPath(); ctx.arc(W - 22, H - 22, 3, 0, Math.PI * 2); ctx.fill();
            }
            ctx.restore();
        };

        // ── Init ─────────────────────────────────────────────────────────────
        const TRACE_COUNT = 12;
        let traces = Array.from({ length: TRACE_COUNT }, () => {
            const tr = new Trace();
            tr.progress = Math.random();
            return tr;
        });

        // ── Animate ──────────────────────────────────────────────────────────
        const animate = (timestamp) => {
            if (!isPausedRef.current) {
                const W = getW(), H = getH();
                const gridTarget = mouseMoving ? 1 : 0;
                gridAlpha += (gridTarget - gridAlpha) * GRID_FADE_SPEED;

                ctx.clearRect(0, 0, W, H);
                ctx.fillStyle = '#050a0e';
                ctx.fillRect(0, 0, W, H);

                const cg = ctx.createRadialGradient(W/2, H/2, 0, W/2, H/2, Math.max(W,H) * 0.6);
                cg.addColorStop(0, 'rgba(0,40,60,0.8)');
                cg.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = cg;
                ctx.fillRect(0, 0, W, H);

                drawGrid();

                traces = traces.map(tr => (!tr.alive ? new Trace() : tr));
                traces.forEach(tr => tr.draw());

                drawScanlines();
                drawHUD(timestamp);
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        // ── Events ───────────────────────────────────────────────────────────
        const handleMouseMove = (e) => {
            mouse.x = e.clientX; mouse.y = e.clientY;
            mouseMoving = true;
            clearTimeout(mouseIdleTimer);
            mouseIdleTimer = setTimeout(() => { mouseMoving = false; }, MOUSE_IDLE_MS);
        };
        const handleResize = () => {
            resize();
            traces = Array.from({ length: TRACE_COUNT }, () => new Trace());
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
import React, {useEffect, useRef} from 'react';
import './Birthday.css';

export default function BirthdayBackground() {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const fireworks = [];
        let w, h, dpr;
        let animationFrameId;
        function resizeCanvas() {
            dpr = window.devicePixelRatio || 1;
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);
        class Particle {
            constructor(x, y, color, angle, speed) {
                this.x = x;
                this.y = y;
                this.color = color;
                this.angle = angle;
                this.speed = speed;
                this.alpha = 1;
                this.fadeRate = 1 / (60 * 3);
                this.size = Math.random() + 0.4;
            }
            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed + 0.05;
                this.alpha -= this.fadeRate;
                if (this.alpha < 0) this.alpha = 0;
            }
            draw() {
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }
        function createFirework() {
            const x = Math.random() * w;
            const y = h * (0.5 + Math.random() * 0.5);
            const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
            for (let i = 0; i < 120; i++) {
                const angle = (Math.PI * 2 * i) / 80;
                const speed = Math.random() * 2.5;
                fireworks.push(new Particle(x, y, color, angle, speed));
            }
        }
        let lastFireworkTime = 0;
        const fireworkInterval = 500;
        function animate(timestamp) {
            animationFrameId = requestAnimationFrame(animate);
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, w, h);
            ctx.globalCompositeOperation = "lighter";
            if (timestamp - lastFireworkTime > fireworkInterval) {
                for (let i = 0; i < 4; i++) {
                    createFirework();
                }
                lastFireworkTime = timestamp;
            }
            for (let i = fireworks.length - 1; i >= 0; i--) {
                const p = fireworks[i];
                p.update();
                p.draw();
                if (p.alpha <= 0) {
                    fireworks.splice(i, 1);
                }
            }
        }
        animate();
        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);
    return (<div className="birthday-background">
        <canvas ref={canvasRef} id="fireworks-canvas"></canvas>
    </div>);
}
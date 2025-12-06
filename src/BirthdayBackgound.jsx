import React, { useEffect, useRef } from "react";
import "./Birthday.css";

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
                const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);

                this.x = x;
                this.y = y;
                this.color = color;
                this.angle = angle;
                this.speed = speed * (w < 768 ? 0.6 : 0.7);

                this.alpha = 1;
                this.fadeRate = 1 / (60 * 5);
                this.size = 0.08 * rem;
            }

            update() {
                this.x += Math.cos(this.angle) * this.speed;
                this.y += Math.sin(this.angle) * this.speed + 0.1;
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
            const centerX = w * 0.4 + Math.random() * (w * 0.2);
            const centerY = h * 0.3 + Math.random() * (h * 0.2);

            const color = `hsl(${Math.random() * 360}, 100%, 65%)`;
            const particleCount = w < 768 ? 60 : 120;

            for (let i = 0; i < particleCount; i++) {
                const angle = (Math.PI * 2 * i) / particleCount;
                const speed = Math.random() * 3.5 + 0.5;
                fireworks.push(new Particle(centerX, centerY, color, angle, speed));
            }
        }

        let lastFireworkTime = 0;
        const fireworkInterval = 1000;

        function animate(timestamp) {
            animationFrameId = requestAnimationFrame(animate);

            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
            ctx.fillRect(0, 0, w, h);

            ctx.globalCompositeOperation = "lighter";

            if (timestamp - lastFireworkTime > fireworkInterval) {
                createFirework();
                lastFireworkTime = timestamp;
            }

            for (let i = fireworks.length - 1; i >= 0; i--) {
                const p = fireworks[i];
                p.update();
                p.draw();
                if (p.alpha <= 0.2 || p.x < 0 || p.x > w || p.y > h) {
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

    return (
        <div className="birthday-background">
            <canvas ref={canvasRef} id="fireworks-canvas"></canvas>
        </div>
    );
}

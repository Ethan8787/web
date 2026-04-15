import React, { useEffect, useRef } from 'react';
import './Background.css';

const Background = ({ isPaused }) => {
    const canvasRef = useRef(null);
    const isPausedRef = useRef(isPaused);

    useEffect(() => {
        isPausedRef.current = isPaused;
    }, [isPaused]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let clickInterval;
        let mouseDownTimestamp = 0;
        let particles = [];
        const dpr = window.devicePixelRatio || 1;

        const getWidth = () => window.innerWidth;
        const getHeight = () => window.innerHeight;

        const particleCount = getWidth() / 10;
        const connectionDistance = 120;
        const repulsionDistance = 120;
        const mouse = { x: null, y: null, radius: 100 };

        const resize = () => {
            const width = getWidth();
            const height = getHeight();
            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            ctx.scale(dpr, dpr);
        };

        class Particle {
            constructor(x, y) {
                this.x = x ?? Math.random() * getWidth();
                this.y = y ?? Math.random() * getHeight();
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = 1;
            }

            update(allParticles) {
                const currentWidth = window.innerWidth;
                const currentHeight = window.innerHeight;

                allParticles.forEach(other => {
                    if (other === this) return;
                    const dx = this.x - other.x;
                    const dy = this.y - other.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < repulsionDistance * repulsionDistance) {
                        const dist = Math.sqrt(distSq) || 1;
                        const force = (repulsionDistance - dist) / repulsionDistance;
                        this.x += (dx / dist) * force * 0.5;
                        this.y += (dy / dist) * force * 0.5;
                    }
                });

                this.x += this.vx;
                this.y += this.vy;

                const speedLimit = 1.5;
                const currentSpeed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
                if (currentSpeed > speedLimit) {
                    this.vx = (this.vx / currentSpeed) * speedLimit;
                    this.vy = (this.vy / currentSpeed) * speedLimit;
                }

                const minVelocity = 0.5;

                if (this.x <= 0) {
                    this.x = 0;
                    this.vx = Math.max(Math.abs(this.vx), minVelocity);
                } else if (this.x >= currentWidth) {
                    this.x = currentWidth;
                    this.vx = -Math.max(Math.abs(this.vx), minVelocity);
                }

                if (this.y <= 0) {
                    this.y = 0;
                    this.vy = Math.max(Math.abs(this.vy), minVelocity);
                } else if (this.y >= currentHeight) {
                    this.y = currentHeight;
                    this.vy = -Math.max(Math.abs(this.vy), minVelocity);
                }

                if (mouse.x !== null) {
                    const dx = this.x - mouse.x;
                    const dy = this.y - mouse.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < mouse.radius) {
                        const force = (mouse.radius - dist) / mouse.radius;
                        this.x += (dx / dist) * force * 2;
                        this.y += (dy / dist) * force * 2;
                    }
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = '#000';
                ctx.fill();
            }
        }

        const init = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const drawLines = () => {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < connectionDistance) {
                        const opacity = 1 - (dist / connectionDistance);
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(240, 240, 255, ${opacity * 2})`;
                        ctx.lineWidth = 0.8;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        };

        const animate = () => {
            if (!isPausedRef.current) {
                ctx.clearRect(0, 0, getWidth(), getHeight());
                particles.forEach(p => {
                    p.update(particles);
                    p.draw();
                });
                drawLines();
            }
            animationFrameId = requestAnimationFrame(animate);
        };

        const handleResize = () => {
            resize();
            init();
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };

        const handleMouseLeave = () => {
            mouse.x = null;
            mouse.y = null;
            clearInterval(clickInterval);
        };

        const triggerSpawnLogic = () => {
            if (mouse.x === null || mouse.y === null) return;
            particles.push(new Particle(mouse.x, mouse.y));
            particles.splice(0, 1);
        };

        const handleMouseDown = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            mouseDownTimestamp = Date.now();

            clearInterval(clickInterval);
            clickInterval = setInterval(() => {
                if (Date.now() - mouseDownTimestamp >= 500) {
                    triggerSpawnLogic();
                }
            }, 10);
        };

        const handleMouseUp = () => {
            clearInterval(clickInterval);
        };

        window.addEventListener('resize', handleResize);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        resize();
        init();
        animate();

        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            clearInterval(clickInterval);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="bg-canvas-wrapper">
            <canvas ref={canvasRef} />
            <div className="bg-vignette" />
        </div>
    );
};

export default Background;
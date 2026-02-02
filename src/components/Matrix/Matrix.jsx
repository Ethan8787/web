import React, {useEffect, useRef} from 'react';
import './Matrix.css';
import Navbar from "../Navbar/Navbar.jsx";

const Matrix = () => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const root = {
            color: {
                r: 0,
                g: 255,
                b: 0
            },
            rainbowSpeed: 50,
            rainbow: false,
            speed: 35
        };
        const c = canvasRef.current;
        if (!c) return;
        const ctx = c.getContext("2d");
        let hueFw = false;
        let hue = -0.01;
        let font_size = 14;
        let columns;
        let drops = [];
        const konkani = "01";//◼
        const characters = konkani.split("");
        const RESIZE_THRESHOLD = 0.5;
        let lastWidth = window.innerWidth;
        let lastHeight = window.innerHeight;
        const resizeCanvas = () => {
            c.height = window.innerHeight;
            c.width = window.innerWidth;
            columns = Math.floor(c.width / font_size);
            drops = [];
            for (let x = 0; x < columns; x++) {
                drops[x] = 1;
            }
            lastWidth = c.width;
            lastHeight = c.height;
        };
        const handleResize = () => {
            const currentWidth = window.innerWidth;
            const currentHeight = window.innerHeight;
            const widthChanged = Math.abs(currentWidth - lastWidth) / lastWidth > RESIZE_THRESHOLD;
            const heightChanged = Math.abs(currentHeight - lastHeight) / lastHeight > RESIZE_THRESHOLD;

            if (widthChanged || heightChanged) {
                resizeCanvas();
            }
        };
        resizeCanvas();
        window.addEventListener('resize', handleResize);
        const draw = () => {
            ctx.fillStyle = "rgba(10,10,10, 0.03)";
            ctx.fillRect(0, 0, c.width, c.height);
            ctx.font = font_size + "px 'JetBrains Mono', monospace";
            for (let i = 0; i < drops.length; i++) {
                ctx.fillStyle = "rgba(10,10,10, 1)";
                ctx.fillRect(i * font_size, drops[i] * font_size, font_size, font_size);
                const text = characters[Math.floor(Math.random() * characters.length)];
                ctx.shadowBlur = 18;
                if (root.rainbow) {
                    hue += (hueFw) ? 0.01 : -0.01;
                    const rr = Math.floor(127 * Math.sin(root.rainbowSpeed * hue) + 128);
                    const rg = Math.floor(127 * Math.sin(root.rainbowSpeed * hue + 2) + 128);
                    const rb = Math.floor(127 * Math.sin(root.rainbowSpeed * hue + 4) + 128);
                    ctx.fillStyle = `rgba(${rr},${rg},${rb})`;
                    ctx.shadowColor = `rgba(${rr},${rg},${rb})`;
                } else {
                    ctx.fillStyle = `rgba(${root.color.r},${root.color.g},${root.color.b})`;
                    ctx.shadowColor = `rgba(${root.color.r},${root.color.g},${root.color.b})`;
                }
                ctx.fillText(text, i * font_size, drops[i] * font_size);
                ctx.shadowBlur = 14;
                ctx.shadowColor = 'transparent';
                drops[i]++;
                if (drops[i] * font_size > c.height && Math.random() > 0.975) {
                    drops[i] = 0;
                }
            }
        };
        const intervalId = setInterval(draw, root.speed / 2);
        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    return (
        <div className={"matrix"}>
            <Navbar/>
            <canvas id="c" ref={canvasRef}></canvas>
        </div>
    );
};
export default Matrix;
import React, {useEffect, useRef} from 'react';
import './Background.css';

const VERT = `#version 300 es
void main() {
    vec2 p = vec2(float((gl_VertexID << 1) & 2), float(gl_VertexID & 2));
    gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;

uniform vec2 uSize;
uniform float uScale;
uniform float uTime;
uniform float uHalf;
out vec4 outColor;

vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}

void main() {
    vec2 p = vec2(gl_FragCoord.x, uSize.y - gl_FragCoord.y) / uScale;
    float n1 = snoise(vec3(p * 0.0012, uTime));
    float n2 = snoise(vec3(p * 0.0035 + 100.0, uTime * 1.5));
    float v = (sin((n1 * 0.75 + n2 * 0.25) * 3.14159265 * 1.2) + 1.0) * 0.5;
    float f = v * 7.0;
    float k = clamp(floor(f + 0.5), 1.0, 6.0);
    float g = max(length(vec2(dFdx(f), dFdy(f))), 0.00001);
    float d = abs(f - k) / g;
    float a = clamp(uHalf + 0.5 - d, 0.0, 1.0);
    outColor = vec4(vec3(a), 1.0);
}`;

const FRAME_MS = 1000 / 120 - 0.5
const Background = ({isPaused}) => {
    const canvasRef = useRef(null);
    const isPausedRef = useRef(isPaused);
    const wakeRef = useRef(null);

    useEffect(() => {
        isPausedRef.current = isPaused;
        if (wakeRef.current) wakeRef.current();
    }, [isPaused]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const container = canvas.parentElement;
        const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        const cap = Math.min(window.devicePixelRatio || 1, 2);
        const steps = [cap, ...[1.5, 1.25, 1].filter((s) => s < cap)];
        let stepIndex = 0;

        let gl = null;
        let program = null;
        let uSize = null;
        let uScale = null;
        let uTime = null;
        let uHalf = null;

        let width = 0;
        let height = 0;
        let time = 0;
        let lastTime = performance.now();
        let lastDraw = 0;
        let dirty = true;
        let lost = false;
        let rafId = 0;

        let lastRaf = 0;
        let samples = [];
        let baseline = 0;
        let ema = 0;
        let warm = 0;

        const compile = (type, source) => {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            return shader;
        };

        const setup = () => {
            gl = canvas.getContext('webgl2', {
                antialias: false,
                alpha: false,
                depth: false,
                stencil: false,
            });
            if (!gl) return false;
            program = gl.createProgram();
            gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
            gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
            gl.linkProgram(program);
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return false;
            gl.useProgram(program);
            uSize = gl.getUniformLocation(program, 'uSize');
            uScale = gl.getUniformLocation(program, 'uScale');
            uTime = gl.getUniformLocation(program, 'uTime');
            uHalf = gl.getUniformLocation(program, 'uHalf');
            return true;
        };

        const resize = () => {
            if (!gl || lost) return;
            const rect = container.getBoundingClientRect();
            const w = Math.round(rect.width);
            const h = Math.round(rect.height);
            if (w === 0 || h === 0) return;
            const dpr = steps[stepIndex];
            const pw = Math.max(1, Math.floor(w * dpr));
            const ph = Math.max(1, Math.floor(h * dpr));
            if (w === width && h === height && pw === canvas.width && ph === canvas.height) return;
            width = w;
            height = h;
            canvas.width = pw;
            canvas.height = ph;
            gl.viewport(0, 0, pw, ph);
            gl.uniform2f(uSize, pw, ph);
            gl.uniform1f(uScale, pw / w);
            gl.uniform1f(uHalf, (0.75 * pw) / w);
            dirty = true;
        };

        const track = (d) => {
            if (samples.length < 60) {
                samples.push(d);
                if (samples.length === 60) {
                    const sorted = [...samples].sort((a, b) => a - b);
                    baseline = sorted[12];
                }
                return;
            }
            ema = ema ? ema * 0.95 + d * 0.05 : d;
            warm++;
            if (warm > 40 && ema > baseline * 1.6 && stepIndex < steps.length - 1) {
                stepIndex++;
                ema = 0;
                warm = 0;
                resize();
            }
        };

        const render = (now) => {
            rafId = requestAnimationFrame(render);

            if (lost || !gl || document.hidden) {
                lastTime = now;
                lastRaf = 0;
                return;
            }

            const paused = isPausedRef.current || reduceMotion;

            if (paused && !dirty) {
                lastTime = now;
                lastRaf = 0;
                return;
            }

            if (lastRaf) {
                const d = now - lastRaf;
                if (d < 120) track(d);
            }
            lastRaf = now;

            if (!dirty && now - lastDraw < FRAME_MS) return;

            const dt = (now - lastTime) / 1000;
            lastTime = now;
            lastDraw = now;
            dirty = false;

            if (!paused) {
                time += 0.02 * Math.min(dt, 0.1);
            }

            gl.uniform1f(uTime, time);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
        };

        const onLost = (e) => {
            e.preventDefault();
            lost = true;
        };

        const onRestored = () => {
            lost = false;
            if (setup()) {
                width = 0;
                height = 0;
                resize();
                dirty = true;
            }
        };

        const onVisibility = () => {
            lastTime = performance.now();
            lastRaf = 0;
            dirty = true;
        };

        wakeRef.current = () => {
            lastTime = performance.now();
            lastRaf = 0;
            dirty = true;
        };

        if (!setup()) return;

        canvas.addEventListener('webglcontextlost', onLost);
        canvas.addEventListener('webglcontextrestored', onRestored);
        document.addEventListener('visibilitychange', onVisibility);

        resize();
        const observer = new ResizeObserver(resize);
        observer.observe(container);

        rafId = requestAnimationFrame(render);

        return () => {
            wakeRef.current = null;
            cancelAnimationFrame(rafId);
            observer.disconnect();
            canvas.removeEventListener('webglcontextlost', onLost);
            canvas.removeEventListener('webglcontextrestored', onRestored);
            document.removeEventListener('visibilitychange', onVisibility);
            if (gl && program) gl.deleteProgram(program);
        };
    }, []);

    return (
        <div className="background">
            <canvas ref={canvasRef} className="contour-canvas"/>
        </div>
    );
};

export default Background;
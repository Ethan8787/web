import { useEffect, useRef } from "react";
import "./Clock.css";

export default function Clock() {
    const digitRefs = useRef({});
    const timerRef = useRef(null);

    const clearDigit = digit => {
        while (digit.firstChild) digit.removeChild(digit.firstChild);
    };

    const setInstant = (id, value) => {
        const digit = digitRefs.current[id];
        if (!digit) return;

        clearDigit(digit);

        const span = document.createElement("span");
        span.textContent = value;
        span.style.transform = "translate3d(0,0,0)";
        digit.appendChild(span);
        digit.dataset.value = value;
    };

    const animateDigit = (id, value) => {
        const digit = digitRefs.current[id];
        if (!digit) return;

        if (digit.dataset.value == value) return;

        const oldSpan = digit.querySelector("span");
        const newSpan = document.createElement("span");

        newSpan.textContent = value;
        newSpan.style.transform = "translate3d(0,100%,0)";
        digit.appendChild(newSpan);

        newSpan.offsetHeight;
        newSpan.style.transform = "translate3d(0,0,0)";
        if (oldSpan) oldSpan.style.transform = "translate3d(0,-100%,0)";

        newSpan.addEventListener(
            "transitionend",
            () => {
                clearDigit(digit);
                digit.appendChild(newSpan);
                digit.dataset.value = value;
            },
            { once: true }
        );
    };

    const render = instant => {
        const d = new Date();
        const h = d.getHours();
        const m = d.getMinutes();
        const s = d.getSeconds();

        const values = [
            Math.floor(h / 10), h % 10,
            Math.floor(m / 10), m % 10,
            Math.floor(s / 10), s % 10
        ];

        const ids = [
            "hourTens",
            "hourOnes",
            "minTens",
            "minOnes",
            "secTens",
            "secOnes"
        ];

        ids.forEach((id, i) =>
            instant ? setInstant(id, values[i]) : animateDigit(id, values[i])
        );
    };

    const tick = () => {
        render(false);
        const now = Date.now();
        const delay = 1000 - (now % 1000);
        timerRef.current = setTimeout(tick, delay);
    };

    useEffect(() => {
        render(true);
        tick();

        const onVisibilityChange = () => {
            clearTimeout(timerRef.current);
            if (!document.hidden) {
                render(true);
                tick();
            }
        };

        document.addEventListener("visibilitychange", onVisibilityChange);

        return () => {
            clearTimeout(timerRef.current);
            document.removeEventListener("visibilitychange", onVisibilityChange);
        };
    }, []);

    const bind = id => el => (digitRefs.current[id] = el);

    return (
        <div className="clock-shell">
            <div className="clock-layer">
                <div className="scroll-timer">
                    <div className="digit" ref={bind("hourTens")} />
                    <div className="digit" ref={bind("hourOnes")} />
                    <div className="colon">:</div>

                    <div className="digit" ref={bind("minTens")} />
                    <div className="digit" ref={bind("minOnes")} />
                    <div className="colon">:</div>

                    <div className="digit" ref={bind("secTens")} />
                    <div className="digit" ref={bind("secOnes")} />
                </div>
            </div>
        </div>
    );
}

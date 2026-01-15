import { useEffect, useRef } from "react";
import "./Clock.css";
import Navbar from "./Navbar.jsx";

export default function Clock() {
    const digitRefs = useRef({});

    const updateDigit = (id, newNumber) => {
        const digitDiv = digitRefs.current[id];
        if (!digitDiv) return;

        const current = digitDiv.dataset.value;
        if (current == newNumber) return;

        while (digitDiv.childElementCount > 1) {
            digitDiv.removeChild(digitDiv.firstChild);
        }

        const oldSpan = digitDiv.querySelector("span");
        const newSpan = document.createElement("span");

        newSpan.textContent = newNumber;
        newSpan.style.transform = "translateY(100%)";
        digitDiv.appendChild(newSpan);

        newSpan.offsetHeight;
        newSpan.style.transform = "translateY(0)";
        if (oldSpan) oldSpan.style.transform = "translateY(-100%)";

        newSpan.addEventListener(
            "transitionend",
            () => {
                if (oldSpan && oldSpan.parentNode === digitDiv) oldSpan.remove();
                digitDiv.dataset.value = newNumber;
            },
            { once: true }
        );
    };

    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const h = now.getHours();
            const m = now.getMinutes();
            const s = now.getSeconds();

            const nums = [
                Math.floor(h / 10), h % 10,
                Math.floor(m / 10), m % 10,
                Math.floor(s / 10), s % 10
            ];

            [
                "hourTens",
                "hourOnes",
                "minTens",
                "minOnes",
                "secTens",
                "secOnes"
            ].forEach((id, i) => updateDigit(id, nums[i]));
        };

        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
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

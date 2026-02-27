import React, {useEffect, useRef, useState} from 'react';
import "./Skills.css";

const skillsData = [{
    name: 'GEPT 初級', level: 100, details: 'Test-Time: 2024-09-21 / 聽-108, 讀-100, 寫-95, 說-90.', img: '/gept.png'
}, {name: 'Java', level: 19, details: 'Minecraft Plugins.'}, {
    name: 'Python', level: 14, details: 'Discord Bots & Scripting'
}, {name: 'React', level: 16, details: 'Personal Portfolio Project'}, {
    name: 'C++', level: 12, details: 'Qt Music Player (MP3/M3U)'
}, {name: 'C', level: 10, details: 'Brute-force & Image Processing'}, {
    name: 'Markdown', level: 9, details: 'Documentation & Notes'
}, {name: 'CSS', level: 11, details: 'Web Styling & Animations'}];

function SkillItem({name, level, details, img}) {
    const [isOpen, setIsOpen] = useState(false);

    return (<div className="skill-item-container">
        <div className="skill-item-grid">
            <span className="skill-name" onClick={() => setIsOpen(v => !v)}>{name}</span>

            <div className="skill-bar-container">
                <div className="skill-bar" style={{'--level': `${level}%`}}></div>
            </div>

            <button
                className={`arrow-btn ${isOpen ? 'is-open' : ''}`}
                onClick={() => setIsOpen(v => !v)}
                type="button"
                aria-label="toggle details"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"
                     strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            </button>

            <div className={`skill-details ${isOpen ? 'is-open' : ''}`}>
                <div className="detail-content">
                    <p>{details || "Loading project details..."}</p>
                    {img && <img src={img} alt="cert" className="achievement-img"/>}
                </div>
            </div>
        </div>
    </div>);
}

export default function Skills() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        const obs = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                obs.disconnect();
            }
        }, {threshold: 0.25});

        obs.observe(el);
        return () => obs.disconnect();
    }, []);

    return (<div ref={ref} className={`section reveal ${visible ? 'is-visible' : ''}`} id="skills">
        <h2 style={{color: '#00ffff', marginBottom: '30px'}}>Skills</h2>
        <div className="skills-list">
            {skillsData.map(skill => (<SkillItem key={skill.name} {...skill} />))}
        </div>
    </div>);
}
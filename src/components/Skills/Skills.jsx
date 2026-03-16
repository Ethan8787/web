import React, {useEffect, useRef, useState} from 'react';
import "./Skills.css";

const skillsData = [
    {name: 'Java', level: 30},
    {name: 'React', level: 25},
    {name: 'Python', level: 20},
    {name: 'Markdown', level: 20},
    {name: 'CSS', level: 20},
    {name: 'C++', level: 15},
    {name: 'C', level: 10}
];

function SkillItem({name, level}) {
    return (
        <div className="skill-item-container">
            <div className="skill-item-grid">
                <span className="skill-name">{name}</span>
                <div className="skill-bar-container">
                    <div className="skill-bar" style={{'--level': `${level}%`}}></div>
                </div>
            </div>
        </div>
    );
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

    return (
        <div ref={ref} className={`section reveal ${visible ? 'is-visible' : ''}`} id="skills">
            <h2 style={{marginBottom: '30px'}}>Skills</h2>
            <div className="skills-list">
                {skillsData.map(skill => (
                    <SkillItem key={skill.name} {...skill} />
                ))}
            </div>
        </div>
    );
}
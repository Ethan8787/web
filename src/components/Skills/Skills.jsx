import React, { useEffect, useRef, useState } from 'react';
import "./Skills.css";

const skillsData = [
    {
        category: "Programming Languages",
        items: [
            { name: 'Java', level: 30 },
            { name: 'Python', level: 20 },
            { name: 'C++', level: 15 },
            { name: 'C', level: 10 }
        ]
    },
    {
        category: "Web Development & Tools",
        items: [
            { name: 'React', level: 25 },
            { name: 'CSS', level: 20 },
            { name: 'Markdown', level: 20 }
        ]
    }
];

function SkillItem({ name, level }) {
    return (
        <div className="skill-item-container">
            <div className="skill-info">
                <span className="skill-name">{name}</span>
                <span className="skill-percentage">{level}%</span>
            </div>
            <div className="skill-bar-container">
                <div className="skill-bar" style={{ '--level': `${level}%` }}></div>
            </div>
        </div>
    );
}

export default function Skills() {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                setVisible(true);
                observer.disconnect();
            }
        }, { threshold: 0.1 });

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return (
        <section ref={ref} className={`section ${visible ? 'is-visible' : ''}`} id="skills">
            <h2 className="section-title">Skills</h2>
            <div className="skills-container">
                {skillsData.map((group) => (
                    <div key={group.category} className="skills-group">
                        <h3>{group.category}</h3>
                        <div className="skills-list">
                            {group.items.map(skill => (
                                <SkillItem key={skill.name} {...skill} />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
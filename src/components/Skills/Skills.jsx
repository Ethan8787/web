import "./Skills.css"
const skillsData = [{name: 'Java', level: 90}, {name: 'Python', level: 80}, {name: 'C/C++', level: 65}, {
    name: 'React', level: 60
},];

function SkillItem({name, level}) {
    return (<div className="skill-item">
        <span className="skill-name">{name}</span>
        <div className="skill-bar-container">
            <div className="skill-bar" style={{width: `${level}%`}}></div>
        </div>
    </div>);
}

export default function Skills() {
    return (<div className="section" id="skills">
        <h2>我的能力 Skills</h2>
        <div className="skills-list">
            {skillsData.map(skill => (<SkillItem key={skill.name} {...skill} />))}
        </div>
    </div>);
}

import './App.css';
import MatrixBackground from './MatrixBackground';
import {useEffect, useState} from "react";

const Navbar = () => {
    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({behavior: 'smooth'});
        }
    };
    return (<nav className="navbar">
        <div className="nav-links">
            <a href="#intro" className="nav-link" onClick={(e) => {
                e.preventDefault();
                scrollToSection('intro');
            }}>
                關於我
            </a>
            <a href="#skills" className="nav-link" onClick={(e) => {
                e.preventDefault();
                scrollToSection('skills');
            }}>
                我的能力
            </a>
            <a href="#projects" className="nav-link" onClick={(e) => {
                e.preventDefault();
                scrollToSection('projects');
            }}>
                我的專案
            </a>
            <a href="#answers" className="nav-link" onClick={(e) => {
                e.preventDefault();
                scrollToSection('answers');
            }}>
                答案專區
            </a>
        </div>
    </nav>);
};
const skillsData = [{name: 'Java', level: 90}, {name: 'Python', level: 80}, {name: 'C++', level: 65}, {
    name: 'React', level: 60
},];
const projectsData = [{
    title: 'Useful',
    tag: 'Java',
    description: 'Minecraft Java 多功能指令與實用管理套件。專注於伺服器營運效率。',
    githubLink: 'https://github.com/Ethan8787/Useful',
}, {
    title: 'Discord 機器人',
    tag: 'Python',
    description: '利用 Python/mcstatus 實現 Minecraft 伺服器網路診斷功能 (DNS, GeoIP, Tracert)。',
    githubLink: 'https://github.com/Ethan8787/VeloBot',
}, {
    title: 'Brute-Force',
    tag: 'C',
    description: '一個高效能的 C 語言暴力破解模擬器，具備進度條和速率計算功能。',
    githubLink: 'https://github.com/Ethan8787/Brute-Force',
}, {
    title: 'MusicPlayer',
    tag: 'C++',
    description: '使用 C++ 建構，支援播放清單、音樂檔案管理與音訊輸出的現代音樂播放器。',
    githubLink: 'https://github.com/Ethan8787/MusicPlayer',
},];
const SkillItem = ({name, level}) => (<div className="skill-item">
    <span className="skill-name">{name}</span>
    <div className="skill-bar-container">
        <div className="skill-bar" style={{width: `${level}%`}}></div>
    </div>
</div>);
const ProjectCard = ({title, tag, description, githubLink}) => (<div className="project-card">
    <div>
        <div className="project-info">
            <h3>{title}</h3>
            <span className={`tag ${tag.toLowerCase()}-tag`}>{tag}</span>
        </div>
        <p className="description">
            {description}
        </p>
    </div>
    <div className="links">
        <a href={githubLink} target="_blank" className="project-link github-link" rel="noopener noreferrer">
            » View on GitHub
        </a>
    </div>
</div>);
const DataSamples = () => {
    const [zhContent, setZhContent] = useState('載入中...');
    const [enContent, setEnContent] = useState('載入中...');
    useEffect(() => {
        fetch('/zh_pagamo.txt')
            .then(res => res.text())
            .then(text => setZhContent(text))
            .catch(err => setZhContent(`載入失敗: ${err.message}`));

        fetch('/en_pagamo.txt')
            .then(res => res.text())
            .then(text => setEnContent(text))
            .catch(err => setEnContent(`載入失敗: ${err.message}`));
    }, []);
    return (<div className="section" id="answers">
        <h2>Pagamo 答案</h2>
        <p>上次更新時間: 2025/12/01 23:46:51</p>
        <h3 style={{color: 'var(--accent-color)', marginTop: '20px'}}>中文丨閱讀素養</h3>
        <pre style={{
            background: 'rgba(30, 30, 30, 0.9)',
            padding: '15px',
            borderRadius: '24px',
            whiteSpace: 'pre-wrap',
            marginTop: '20px',
            fontSize: '0.8rem',
        }}>
                {zhContent}
            </pre>
        <h3 style={{color: 'var(--accent-color)', marginTop: '20px'}}>英文丨閱讀素養</h3>
        <pre style={{
            background: 'rgba(30, 30, 30, 0.9)',
            padding: '15px',
            borderRadius: '24px',
            whiteSpace: 'pre-wrap',
            marginTop: '20px',
            fontSize: '0.8rem',
        }}>
                {enContent}
            </pre>
    </div>);
};

function App() {
    return (<>
        <MatrixBackground/>
        <div id="blur-overlay"></div>
        <Navbar/>

        <div className="container">
            <div className="intro-card" id="intro">
                <div className="header-group">
                    <img id="avatar" src="512.png" alt="Avatar"/>
                    <h1>Ethan</h1>
                </div>
                <p>
                    嗨，我是Ethan，目前就讀國中三年級，來自台灣。我是一位 Minecraft 插件開發者，也是 LeetCode
                    初學者，目前正在學習演算法。
                </p>
                <p>
                    此外，我還擅長 Minecraft 伺服器的安裝與配置。以下是我的社群媒體：
                </p>
                <div className="button-group">
                    <a className="btn" href="https://discord.gg/AyucpYarpa" target="_blank"
                       rel="noopener noreferrer">Discord</a>
                    <a className="btn" href="https://www.youtube.com/channel/UCDiFgkr0I6uAgRlBBPnflNw"
                       target="_blank" rel="noopener noreferrer">YouTube</a>
                    <a className="btn" href="https://www.instagram.com/ethan._.0430/" target="_blank"
                       rel="noopener noreferrer">Instagram</a>
                    <a className="btn" href="https://github.com/Ethan8787/" target="_blank"
                       rel="noopener noreferrer">GitHub</a>
                </div>
            </div>
            <div className="section" id="skills">
                <h2>我的能力</h2>
                <div className="skills-list">
                    {skillsData.map((skill) => (<SkillItem key={skill.name} name={skill.name} level={skill.level}/>))}
                </div>
            </div>
            <div className="section" id="projects">
                <h2>我的專案</h2>
                <div className="project-grid">
                    {projectsData.map((project) => (<ProjectCard
                        key={project.title}
                        title={project.title}
                        tag={project.tag}
                        description={project.description}
                        githubLink={project.githubLink}
                    />))}
                </div>
            </div>
            <DataSamples/>
        </div>
    </>);
}

export default App;
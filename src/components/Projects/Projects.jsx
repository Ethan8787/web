import React from 'react';
import "./Projects.css";

const projectsData = [
    {
        name: "Useful",
        tag: "Java",
        description: "Null Network 用的 Java Minecraft 插件。",
        link: "https://github.com/Ethan8787/Useful",
        isPrivate: false
    },
    {
        name: "VeloBot",
        tag: "Python",
        description: "查 MC 伺服器狀態的 Python Discord 機器人。",
        link: "https://github.com/Ethan8787/VeloBot",
        isPrivate: false
    },
    {
        name: "MusicPlayer",
        tag: "C++",
        description: "C++ (Qt) 離線音樂播放器，支援 MP3/m3u。",
        link: "https://github.com/Ethan8787/MusicPlayer",
        isPrivate: false
    },
    {
        name: "Brute-Force",
        tag: "C",
        description: "純 C 寫的暴力破解與影像處理專案。",
        link: "https://github.com/Ethan8787/Brute-Force",
        isPrivate: false
    },
    {
        name: "web",
        tag: "React",
        description: "用 React 與 CSS 寫的個人網站。",
        link: "https://github.com/Ethan8787/web",
        isPrivate: false
    },
    {
        name: "Ethan8787",
        tag: "Markdown",
        description: "你的 GitHub 個人介紹 README。",
        link: "https://github.com/Ethan8787/Ethan8787",
        isPrivate: false
    },
    {
        name: "Canny",
        tag: "C",
        description: "Pure C 圖像處理項目由--我的老師提出。",
        link: "#",
        isPrivate: true
    }
];

const ProjectCard = ({ project }) => {
    return (
        <div className="project-card">
            <div className="project-info">
                <h3>{project.name}</h3>
                <span className="tag">{project.tag}</span>
            </div>
            <p className="description">{project.description}</p>
            {project.isPrivate ? (
                <span className="project-link private-link">Private Repository</span>
            ) : (
                <a href={project.link} className="project-link" target="_blank" rel="noreferrer">
                    <svg
                        className="icon-arrow-go"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{marginRight: '6px', verticalAlign: 'text-top'}}
                    >
                        <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                    View Project
                </a>
            )}
        </div>
    );
};

export default function Projects() {
    return (
        <div className="project-grid">
            {projectsData.map((project, index) => (
                <ProjectCard key={index} project={project} />
            ))}
        </div>
    );
}
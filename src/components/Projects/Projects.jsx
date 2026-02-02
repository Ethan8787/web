import './Projects.css'

const projectsData = [
    {
        title: 'Useful',
        tag: 'Java',
        description: 'Minecraft Java 多功能指令與實用管理套件。專注於伺服器營運效率。',
        githubLink: 'https://github.com/Ethan8787/Useful',
    },
    {
        title: 'Discord 機器人',
        tag: 'Python',
        description: '利用 Python/mcstatus 實現 Minecraft 伺服器網路診斷功能。',
        githubLink: 'https://github.com/Ethan8787/VeloBot',
    },
    {
        title: 'Brute-Force',
        tag: 'C',
        description: '一個高效能的 C 語言暴力破解模擬器，具備進度條和速率計算功能。',
        githubLink: 'https://github.com/Ethan8787/Brute-Force',
    },
    {
        title: 'MusicPlayer',
        tag: 'C++',
        description: '使用 C++ 建構、支援播放清單與音訊輸出的現代音樂播放器。',
        githubLink: 'https://github.com/Ethan8787/MusicPlayer',
    },
];

function ProjectCard({title, tag, description, githubLink}) {
    return (
        <div className="project-card">
            <div className="project-info">
                <h3>{title}</h3>
                <span className="tag">{tag}</span>
            </div>
            <p className="description">{description}</p>
            <a className="project-link" href={githubLink} target="_blank">» View on GitHub</a>
        </div>
    );
}

export default function Projects() {
    return (
        <div className="section" id="projects">
            <h2>我的專案 Projects</h2>
            <div className="project-grid">
                {projectsData.map(project => (
                    <ProjectCard key={project.title} {...project} />
                ))}
            </div>
        </div>
    );
}

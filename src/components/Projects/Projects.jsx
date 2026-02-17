import './Projects.css';

const projectsData = [
    {
        title: 'This Website',
        tag: 'React',
        description: '這是你現在看到的網站。整合注音密碼、計時器與多語言介面，具備高容錯響應式設計。',
        githubLink: 'https://github.com/Ethan8787/web',
        isPrivate: false
    },
    {
        title: 'Useful',
        tag: 'Java',
        description: 'Minecraft Java 多功能指令與實用管理套件。專注於伺服器營運效率。',
        githubLink: 'https://github.com/Ethan8787/Useful',
        isPrivate: false
    },
    {
        title: 'Canny Edge Detection',
        tag: 'C',
        description: '閉源實作。不使用 OpenCV，純 C 手刻 Gaussian Blur、Sobel 與 NMS 演算法。我懶得丟gh',
        githubLink: '#',
        isPrivate: false
    },
    {
        title: 'VeloBot',
        tag: 'Python',
        description: '利用 Python/mcstatus 實現 Minecraft 伺服器網路診斷功能。',
        githubLink: 'https://github.com/Ethan8787/VeloBot',
        isPrivate: false
    },
    {
        title: 'Brute-Force',
        tag: 'C',
        description: '一個高效能的 C 語言暴力破解模擬器，具備進度條和速率計算功能。',
        githubLink: 'https://github.com/Ethan8787/Brute-Force',
        isPrivate: false
    },
    {
        title: 'MusicPlayer',
        tag: 'C++',
        description: '使用 C++ 建構、支援播放清單與音訊輸出的現代音樂播放器。',
        githubLink: 'https://github.com/Ethan8787/MusicPlayer',
        isPrivate: false
    },
];

function ProjectCard({title, tag, description, githubLink, isPrivate}) {
    return (
        <div className="project-card">
            <div className="project-info">
                <h3>{title}</h3>
                <span className="tag">{tag}</span>
            </div>
            <p className="description">{description}</p>
            {isPrivate ? (
                <span className="project-link private-link">
                    <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        style={{marginRight: '6px', verticalAlign: 'middle'}}
                    >
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    Private Project
                </span>
            ) : (
                <a className="project-link" href={githubLink} target="_blank" rel="noreferrer">
                    » View on GitHub
                </a>
            )}
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
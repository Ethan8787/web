import { NavLink } from 'react-router-dom';
import "./Tools.css";

export default function Tools() {
    const tools = [
        { name: "Discord Timestamp", desc: "動態時間代碼生成", path: "/timestamp", icon: "💬" },
        { name: "Stopwatch", desc: "毫秒級精準計時", path: "/clock", icon: "⏱️" },
        { name: "Countdown", desc: "高效倒數計時器", path: "/clock", icon: "⌛" },
        { name: "Clock", desc: "全螢幕極簡時鐘", path: "/clock", icon: "🕒" }
    ];

    return (
        <div className="tools-container">
            <div className="tools-content">
                <div className="section-title">
                    <h2>實用工具 Useful Tools</h2>
                    <div className="title-underline"></div>
                </div>

                <div className="tools-grid">
                    {tools.map((tool, index) => (
                        <NavLink to={tool.path} key={index} className="tool-card">
                            <div className="tool-card-icon">{tool.icon}</div>
                            <div className="tool-card-text">
                                <h3>{tool.name}</h3>
                                <p>{tool.desc}</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}
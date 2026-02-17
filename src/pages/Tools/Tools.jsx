import { NavLink } from 'react-router-dom';
import { MessageSquare, Timer, Hourglass, Clock, ShieldCheck } from 'lucide-react';
import "./Tools.css";

export default function Tools() {
    const tools = [
        { name: "Discord Timestamp", desc: "動態時間代碼生成", path: "/timestamp", icon: <MessageSquare size={32} /> },
        { name: "Stopwatch", desc: "毫秒正數計時器", path: "/stopwatch", icon: <Timer size={32} /> },
        { name: "Countdown", desc: "高效倒數計時器", path: "/timer", icon: <Hourglass size={32} /> },
        { name: "Clock", desc: "全螢幕極簡時鐘", path: "/clock", icon: <Clock size={32} /> },
        { name: "Zhuyin Secret", desc: "注音轉換", path: "/zhu-yin-convert", icon: <ShieldCheck size={32} /> }
    ];

    return (
        <div className="tools-container">
            <div className="tools-content">
                <div className="section-title">
                    <h2>Useful Tools</h2>
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
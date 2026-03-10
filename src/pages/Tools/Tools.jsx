import React, {useEffect, useRef, useState} from 'react';
import './Tools.css';

import ZhuyinSecret from './ZhuyinSecret/ZhuyinSecret.jsx';
import DiscordTool from './Discord/DiscordTool.jsx';
import Clock from './Clock/Clock.jsx';
import Stopwatch from '../Tools/Stopwatch/Stopwatch.jsx';
import Timer from '../Tools/Timer/Timer.jsx';
import RandomWheel from './RandomWheel/RandomWheel.jsx';
import RunPredictor from './RunPredictor/RunPredictor.jsx';

export default function Tools() {
    const [activeTool, setActiveTool] = useState(() => {
        return localStorage.getItem('lastActiveTool') || 'timer';
    });
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        localStorage.setItem('lastActiveTool', activeTool);
    }, [activeTool]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toolItems = [
        {label: "倒數計時", id: "timer"},
        {label: "極簡時鐘", id: "time-display"},
        {label: "碼表計時", id: "stopwatch"},
        {label: "注音轉換", id: "zhu-yin-convert"},
        {label: "時間戳記", id: "discord-tool"},
        {label: "幸運輪盤", id: "lottery"},
    ];

    const currentToolLabel = toolItems.find(item => item.id === activeTool)?.label;

    const renderTool = () => {
        switch (activeTool) {
            case 'timer':
                return <Timer/>;
            case 'time-display':
                return <Clock/>;
            case 'stopwatch':
                return <Stopwatch/>;
            case 'zhu-yin-convert':
                return <ZhuyinSecret/>;
            case 'discord-tool':
                return <DiscordTool/>;
            case 'lottery':
                return <RandomWheel/>;
            default:
                return <Timer/>;
        }
    };

    return (
        <div className="tools-page-wrapper">
            <div className="tools-header">
                <h2 className="tools-title">工具箱</h2>

                <div className="custom-dropdown" ref={dropdownRef}>
                    <button
                        className={`dropdown-trigger ${isOpen ? 'active' : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span>{currentToolLabel}</span>
                        <svg className={`arrow-icon ${isOpen ? 'rotate' : ''}`} viewBox="0 0 24 24" width="20"
                             height="20">
                            <path fill="currentColor" d="M7 10l5 5 5-5H7z"/>
                        </svg>
                    </button>

                    {isOpen && (
                        <ul className="dropdown-menu">
                            {toolItems.map((item) => (
                                <li
                                    key={item.id}
                                    className={activeTool === item.id ? 'selected' : ''}
                                    onClick={() => {
                                        setActiveTool(item.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    {item.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            <div className="tool-content-area" key={activeTool}>
                {renderTool()}
            </div>
        </div>
    );
}
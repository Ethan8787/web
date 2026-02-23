import React, { useState, useEffect } from 'react';
import './Tools.css';

import ZhuyinSecret from './ZhuyinSecret/ZhuyinSecret';
import DiscordTool from './Discord/DiscordTool';
import Clock from '../Tools/Clock/Clcok.jsx';
import Stopwatch from '../Tools/Stopwatch/Stopwatch.jsx';
import Timer from '../Tools/Timer/Timer';
import RandomWheel from './RandomWheel/RandomWheel';

export default function Tools() {
    const [activeTool, setActiveTool] = useState(() => {
        return localStorage.getItem('lastActiveTool') || 'timer';
    });

    useEffect(() => {
        localStorage.setItem('lastActiveTool', activeTool);
    }, [activeTool]);

    const DownArrow = () => (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M4 8 L12 16 L20 8 Z" />
        </svg>
    );
    ``


    const renderTool = () => {
        switch (activeTool) {
            case 'timer': return <Timer />;
            case 'time-display': return <Clock />;
            case 'stopwatch': return <Stopwatch />;
            case 'zhu-yin-convert': return <ZhuyinSecret />;
            case 'discord-tool': return <DiscordTool />;
            case 'lottery': return <RandomWheel />;
            default: return <Timer />;
        }
    };

    return (
        <div className="tools-page-wrapper">
            <div className="tools-header">
                <h2 className="tools-title">TOOLBOX</h2>
                <div className="custom-select-wrapper">
                    <select
                        className="custom-select"
                        value={activeTool}
                        onChange={(e) => setActiveTool(e.target.value)}
                    >
                        <option value="timer">倒數計時</option>
                        <option value="time-display">極簡時鐘</option>
                        <option value="stopwatch">碼表計時</option>
                        <option value="zhu-yin-convert">注音轉換</option>
                        <option value="discord-tool">Discord 工具</option>
                        <option value="lottery">幸運輪盤</option>
                    </select>
                    <div className="select-arrow">
                        <DownArrow/>
                    </div>
                </div>
            </div>

            <div className="tool-content-area">
                {renderTool()}
            </div>
        </div>
    );
}
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
    const [open, setOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('lastActiveTool', activeTool);
    }, [activeTool]);

    const DownArrow = () => (
        <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M4 8 L12 16 L20 8 Z" />
        </svg>
    );

    const activeToolName = {
        'timer': '倒數計時',
        'time-display': '極簡時鐘',
        'stopwatch': '碼表計時',
        'zhu-yin-convert': '注音轉換',
        'discord-tool': 'Discord工具',
        'lottery': '幸運輪盤',
    }[activeTool];

    const selectTool = (tool) => {
        setActiveTool(tool);
        setOpen(false);
    };

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
                <div className="custom-dropdown">
                    <button className="dropdown-btn" onClick={() => setOpen(!open)}>
                        {activeToolName} <DownArrow />
                    </button>
                    <div className={`dropdown-menu ${open ? 'open' : ''}`}>
                        <div className="dropdown-item" onClick={() => selectTool('timer')}>倒數計時</div>
                        <div className="dropdown-item" onClick={() => selectTool('time-display')}>極簡時鐘</div>
                        <div className="dropdown-item" onClick={() => selectTool('stopwatch')}>碼表計時</div>
                        <div className="dropdown-item" onClick={() => selectTool('zhu-yin-convert')}>注音轉換</div>
                        <div className="dropdown-item" onClick={() => selectTool('discord-tool')}>Discord工具</div>
                        <div className="dropdown-item" onClick={() => selectTool('lottery')}>幸運輪盤</div>
                    </div>
                </div>
            </div>

            <div className="tool-content-area">
                {renderTool()}
            </div>
        </div>
    );
}
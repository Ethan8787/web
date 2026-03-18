import React, {useEffect, useRef, useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import './Tools.css';

import DiscordTool from './Discord/DiscordTool.jsx';
import Clock from './Clock/Clock.jsx';
import Stopwatch from '../Tools/Stopwatch/Stopwatch.jsx';
import Timer from '../Tools/Timer/Timer.jsx';
import RandomWheel from './RandomWheel/RandomWheel.jsx';

export default function Tools() {
    const location = useLocation();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toolItems = [
        {label: "倒數計時", id: "timer", path: "/timer"},
        {label: "極簡時鐘", id: "clock", path: "/clock"},
        {label: "碼表計時", id: "stopwatch", path: "/stopwatch"},
        {label: "時間戳記", id: "timestamp", path: "/timestamp"},
        {label: "幸運輪盤", id: "wheel", path: "/wheel"},
    ];

    const currentTool = toolItems.find(item => item.path === location.pathname) || toolItems[0];

    useEffect(() => {
        document.title = `Ethan's Web - ${currentTool.label}`;

        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [currentTool]);

    const renderTool = () => {
        switch (location.pathname) {
            case '/timer':
                return <Timer/>;
            case '/clock':
                return <Clock/>;
            case '/stopwatch':
                return <Stopwatch/>;
            case '/timestamp':
                return <DiscordTool/>;
            case '/wheel':
                return <RandomWheel/>;
            default:
                return <Timer/>;
        }
    };

    return (
        <div className="tools-page-wrapper">
            <div className="tools-header">
                <h2 className="tools-title">Tools</h2>

                <div className="custom-dropdown" ref={dropdownRef}>
                    <button
                        className={`dropdown-trigger ${isOpen ? 'active' : ''}`}
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        <span>{currentTool.label}</span>
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
                                    className={location.pathname === item.path ? 'selected' : ''}
                                    onClick={() => {
                                        navigate(item.path);
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

            <div className="tool-content-area" key={location.pathname}>
                {renderTool()}
            </div>
        </div>
    );
}
import React, {useEffect, useState} from 'react';
import avatarImg from '../../assets/avatar/512.png';
import discordIcon from '../../assets/icons/discord.svg';
import youtubeIcon from '../../assets/icons/youtube.svg';
import instagramIcon from '../../assets/icons/instagram.svg';
import githubIcon from '../../assets/icons/github.svg';
import Skills from '../../components/Skills/Skills.jsx';
import Projects from '../../components/Projects/Projects.jsx';
import "./Home.css";

export default function Home() {
    const [loaded, setLoaded] = useState(false);
    const [age, setAge] = useState(0);

    const calculateAge = (birthDate) => {
        const today = new Date();
        const birth = new Date(birthDate);
        let years = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            years--;
        }
        return years;
    };

    useEffect(() => {
        const id = requestAnimationFrame(() => setLoaded(true));
        setAge(calculateAge("2011-04-30"));
        return () => cancelAnimationFrame(id);
    }, []);

    return (<div className="App">
        <div className="container">
            <div className={`header-group reveal delay-0 ${loaded ? 'is-visible' : ''}`}>
                <div className="avatar-wrapper">
                    <div className="cont1">
                        <div className="status-bubble">好了!</div>
                        <div className="thought-dot dot-1"></div>
                    </div>
                    <div className="thought-dot dot-2"></div>
                    <img id="avatar" src={avatarImg} alt="Avatar"/>
                </div>
                <h1>Ethan</h1>
            </div>

            <div className={`intro-card reveal delay-1 ${loaded ? 'is-visible' : ''}`} id="intro">
                <h2>About Me</h2>
                <p>
                    我是 <span style={{color: 'var(--accent-color)', fontWeight: '2000'}}>Ethan</span>，
                    一名喜愛技術開發 的 <strong>{age} 歲</strong> 程式愛好者。
                    <br/>
                    <strong>10 歲</strong>時， <strong>Python</strong> 入門，深入 <strong>Java</strong> Minecraft
                    插件與 <strong>網頁開發</strong>。
                    <br/>
                    目前做過 <strong>C/C++</strong> 領域，開發音樂播放器與基礎影像處理。
                    <br/>
                    我追求效能與純淨邏輯，目前正衝刺「大安高工」，目標是 技術突破。
                </p>
                <div className="button-group">
                    <a className="btn btn-discord" href="https://discord.gg/AyucpYarpa" target="_blank"
                       rel="noreferrer">
                        <img src={discordIcon} className="btn-icon" alt="icon"/>
                        Discord
                    </a>
                    <a className="btn btn-youtube" href="https://www.youtube.com/channel/UCDiFgkr0I6uAgRlBBPnflNw"
                       target="_blank" rel="noreferrer">
                        <img src={youtubeIcon} className="btn-icon" alt="icon"/>
                        YouTube
                    </a>
                    <a className="btn btn-instagram" href="https://www.instagram.com/ethantw.dev/" target="_blank"
                       rel="noreferrer">
                        <img src={instagramIcon} className="btn-icon" alt="icon"/>
                        Instagram
                    </a>
                    <a className="btn btn-github" href="https://github.com/Ethan8787/" target="_blank"
                       rel="noreferrer">
                        <img src={githubIcon} className="btn-icon" alt="icon"/>
                        GitHub
                    </a>
                </div>
            </div>

            <Skills/>
            <Projects/>
        </div>
    </div>);
}
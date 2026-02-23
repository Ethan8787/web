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

    useEffect(() => {
        const id = requestAnimationFrame(() => setLoaded(true));
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
                    你好，我是 <span style={{color: 'var(--accent-color)', fontWeight: 'bold'}}>Ethan</span>。
                    一名在底層 <code className="tech-tag">C/C++</code> 影像處理與現代
                    <code className="tech-tag">React</code> 網頁開發的 14 歲開發者。<br/>
                    另外也有 Java（Bukkit 插件） 的實戰經驗，熟悉事件驅動與模組化設計。
                    <br/>我喜歡把複雜的邏輯轉化為乾淨的代碼，無論是編寫高性能的 <strong>Canny</strong>，
                    <br/>還是捏出質感 React UI。目前正全力往「大安高工」衝刺，目標是在技術的上有實際突破。
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
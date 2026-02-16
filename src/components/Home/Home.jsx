import React from 'react';
import avatarImg from '../../assets/avatar/512.png';
import discordIcon from '../../assets/icons/discord.svg';
import youtubeIcon from '../../assets/icons/youtube.svg';
import instagramIcon from '../../assets/icons/instagram.svg';
import githubIcon from '../../assets/icons/github.svg';

import Background from '../Background/Background.jsx';
import Navbar from '../Navbar/Navbar.jsx';
import Skills from '../Skills/Skills.jsx';
import Projects from '../Projects/Projects.jsx';
import Footer from '../Footer/Footer.jsx';
import "./Home.css";

export default function Home() {
    return (
        <>
            <Background />
            <Navbar />
            <div className="App">
                <div className="container">
                    <div className="header-group">
                        <div className="avatar-wrapper">
                            <div className="cont1">
                                <div className="status-bubble">我想買域名ㄚㄚㄚ</div>
                                <div className="thought-dot dot-1"></div>
                            </div>
                            <div className="thought-dot dot-2"></div>
                            {/* 2. 這裡改成變數 avatarImg */}
                            <img id="avatar" src={avatarImg} alt="Avatar" />
                        </div>
                        <h1>Ethan</h1>
                    </div>
                    <div className="intro-card" id="intro">
                        <h2>關於我 About Me</h2>
                        <p>
                            你好，我是 Ethan，來自台灣的國三程式設計愛好者。
                        </p>
                        <div className="button-group">
                            {/* 3. 這裡也都改成變數 */}
                            <a className="btn btn-discord" href="https://discord.gg/AyucpYarpa" target="_blank" rel="noreferrer">
                                <img src={discordIcon} className="btn-icon" alt="icon" />
                                Discord
                            </a>
                            <a className="btn btn-youtube" href="https://www.youtube.com/channel/UCDiFgkr0I6uAgRlBBPnflNw" target="_blank" rel="noreferrer">
                                <img src={youtubeIcon} className="btn-icon" alt="icon" />
                                YouTube
                            </a>
                            <a className="btn btn-instagram" href="https://www.instagram.com/ethantw.dev/" target="_blank" rel="noreferrer">
                                <img src={instagramIcon} className="btn-icon" alt="icon" />
                                Instagram
                            </a>
                            <a className="btn btn-github" href="https://github.com/Ethan8787/" target="_blank" rel="noreferrer">
                                <img src={githubIcon} className="btn-icon" alt="icon" />
                                GitHub
                            </a>
                        </div>
                    </div>
                    <Skills />
                    <Projects />
                </div>
                <Footer />
            </div>
        </>
    );
}
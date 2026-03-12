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
            <div className="header-group">
                <div className="avatar-wrapper">
                    <img id="avatar" src={avatarImg} alt="Avatar"/>
                </div>
                <h1>Ethan</h1>
            </div>

            <div className="intro-card">
                <h2>About Me</h2>
                <p>
                    我是 <span style={{color: 'var(--accent-color)', fontWeight: '2000'}}>Ethan</span>，
                    一名 <strong>{age} 歲</strong> 學生，
                    學習程式設計已達 <strong>{age - 10}</strong> 年。
                    <br/>
                    以下是我的社群連結。
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
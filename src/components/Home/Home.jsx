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
                        <img id="avatar" src="/512.png" alt="Avatar" />
                        <h1>Ethan</h1>
                    </div>
                    <div className="intro-card" id="intro">
                        <h2>關於我 About Me</h2>
                        <p>
                            你好，我是 Ethan，來自台灣的國三程式設計愛好者。
                        </p>
                        <div className="button-group">
                            <a className="btn btn-discord" href="https://discord.gg/AyucpYarpa" target="_blank">
                                <img src="/discord.svg" className="btn-icon" />
                                Discord
                            </a>
                            <a className="btn btn-youtube" href="https://www.youtube.com/channel/UCDiFgkr0I6uAgRlBBPnflNw" target="_blank">
                                <img src="/youtube.svg" className="btn-icon" />
                                YouTube
                            </a>
                            <a className="btn btn-instagram" href="https://www.instagram.com/ethantw.dev/" target="_blank">
                                <img src="/instagram.svg" className="btn-icon" />
                                Instagram
                            </a>
                            <a className="btn btn-github" href="https://github.com/Ethan8787/" target="_blank">
                                <img src="/github.svg" className="btn-icon" />
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

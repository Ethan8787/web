import MatrixBackground from './MatrixBackground';
import Navbar from './components/Navbar';
import Skills from './components/Skills';
import Projects from './components/Projects';
import "./App.css"

export default function Home() {
    return (
        <>
            <MatrixBackground />
            <div id="blur-overlay"></div>

            <Navbar />

            <div className="container">
                <div className="intro-card" id="intro">
                    <div className="header-group">
                        <img id="avatar" src="512.png" alt="Avatar" />
                        <h1>Ethan</h1>
                    </div>

                    <p>
                        嗨，我是Ethan，目前就讀國中三年級，來自台灣……
                    </p>

                    <div className="button-group">
                        <a className="btn" href="https://discord.gg/AyucpYarpa" target="_blank">Discord</a>
                        <a className="btn" href="https://www.youtube.com/channel/UCDiFgkr0I6uAgRlBBPnflNw" target="_blank">YouTube</a>
                        <a className="btn" href="https://www.instagram.com/ethan._.0430/" target="_blank">Instagram</a>
                        <a className="btn" href="https://github.com/Ethan8787/" target="_blank">GitHub</a>
                    </div>
                </div>

                <Skills />
                <Projects />
            </div>
        </>
    );
}

import Background from './components/Background.jsx';
import Navbar from './components/Navbar';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Footer from './components/Footer.jsx'
import "./Home.css"

export default function Home() {
    return (<>
        <Background/>
        <Navbar/>
        <div className="App">
        <div className="container">
            <div className="header-group">
                <img id="avatar" src="/512.png" alt="Avatar"/>
                <h1>Ethan</h1>
            </div>
            <div className="intro-card" id="intro">
                <h2>關於我 About Me</h2>
                <p>
                    你好，我是 Ethan，來自台灣的國三程式宅。<br/>
                    比起「能跑」，我更在意「為什麼能跑」。<br/>
                    Debug 是日常，搞懂原理是信仰。
                </p>
                <div className="button-group">
                    <a className="btn" href="https://discord.gg/AyucpYarpa" target="_blank">Discord</a>
                    <a className="btn" href="https://www.youtube.com/channel/UCDiFgkr0I6uAgRlBBPnflNw"
                       target="_blank">YouTube</a>
                    <a className="btn" href="https://www.instagram.com/ethantw.dev/" target="_blank">Instagram</a>
                    <a className="btn" href="https://github.com/Ethan8787/" target="_blank">GitHub</a>
                </div>
            </div>
            <Skills/>
            <Projects/>
        </div>
        <Footer/>
        </div>
    </>);
}

import MatrixBackground from './MatrixBackground';
import Navbar from './components/Navbar';
import Skills from './components/Skills';
import Projects from './components/Projects';
import "./App.css"

export default function Home() {
    return (<>
        <MatrixBackground/>
        <div id="blur-overlay"></div>
        <Navbar/>
        <div className="container">
            <div className="intro-card" id="intro">
                <div className="header-group">
                    <img id="avatar" src="512.png" alt="Avatar"/>
                    <h1>Ethan</h1>
                </div>
                <p>
                    嗨，我是Ethan，一位來自台灣的國三學生，熱愛程式設計與技術探索。
                    我自學程式設計，最早從 Java入門，之後一路擴展到 Python、C、C++、JavaScript、HTML、CSS 等語言。
                    除了後端與底層技術，我也會使用 React + Vite 開發前端專案，並部署在 Cloudflare Pages。
                    我目前正在做一些 Side Projects 並且練習 LeetCode。
                    我相信，「搞懂它為什麼能動」，比「讓它動起來」更重要。
                    所以我會持續學、持續拆解，也持續打造屬於自己的作品。
                </p>
                <div className="button-group">
                    <a className="btn" href="https://discord.gg/AyucpYarpa" target="_blank">Discord</a>
                    <a className="btn" href="https://www.youtube.com/channel/UCDiFgkr0I6uAgRlBBPnflNw"
                       target="_blank">YouTube</a>
                    <a className="btn" href="https://www.instagram.com/ethan._.0430/" target="_blank">Instagram</a>
                    <a className="btn" href="https://github.com/Ethan8787/" target="_blank">GitHub</a>
                </div>
            </div>
            <Skills/>
            <Projects/>
        </div>
    </>);
}

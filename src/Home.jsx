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
            <div className="intro-card" id="intro">
                <h2>關於我</h2>

                <p>
                    我是 Ethan，一位熱愛程式設計的台灣國三生。
                    我自學 Java、Python、C/C++ 等後端及底層語言，並運用 React + Vite 實現前端開發與 Cloudflare Pages 部署。
                    我透過 Side Projects 和 LeetCode 磨練自己。我相信「搞懂它為什麼能動」比「讓它動起來」更重要。我將持續實作，打造更好的作品。
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
        <Footer/>
        </div>
    </>);
}

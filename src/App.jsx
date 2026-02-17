import {Routes, Route} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';
import Background from './Background/Background.jsx';
import Footer from './components/Footer/Footer.jsx';

import Home from './pages/Home/Home.jsx';
import Code from './pages/Code/Code.jsx';
import GameId from './pages/GameId/GameId.jsx';
import Tools from './pages/Tools/Tools.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';

import Stopwatch from './pages/Tools/Clock/Stopwatch/Stopwatch.jsx';
import Time from './pages/Tools/Clock/Time/Time.jsx';
import Timer from './pages/Tools/Clock/Timer/Timer.jsx';
import DiscordTool from './pages/Tools/Discord/DiscordTool.jsx';
import ZhuyinSecret from "./pages/Tools/ZhuyinSecret/ZhuyinSecret.jsx";

import './App.css';

export default function App() {
    return (
        <>
            <Background/>
            <Navbar/>

            <div className="page-wrapper">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/code" element={<Code/>}/>
                    <Route path="/gameid" element={<GameId/>}/>
                    <Route path="/tools" element={<Tools/>}/>

                    <Route path="/timestamp" element={<DiscordTool/>}/>
                    <Route path="/stopwatch" element={<Stopwatch/>}/>
                    <Route path="/clock" element={<Time/>}/>
                    <Route path="/zhu-yin-convert" element={<ZhuyinSecret />} />
                    <Route path="/timer" element={<Timer/>}/>

                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>

            <Footer/>
        </>
    );
}
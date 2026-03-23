import {useState} from 'react';
import {Route, Routes, useLocation, Navigate} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';
import Background from './Background/Background.jsx';
import Footer from './components/Footer/Footer.jsx';

import Home from './pages/Home/Home.jsx';
import Code from './pages/Code/Code.jsx';
import Link from './pages/Link/Link.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import ExamCountdown from "./pages/Countdown/Countdown.jsx";
import Clock from "./pages/Clock/Clock.jsx";
import RandomWheel from "./pages/RandomWheel/RandomWheel.jsx";
import StopWatch from "./pages/StopWatch/StopWatch.jsx";
import Timer from "./pages/Timer/Timer.jsx";
import DiscordTool from "./pages/DiscordTool/DiscordTool.jsx";
import './App.css';

export default function App() {
    const location = useLocation();
    const isBackgroundOnly = location.pathname === '/background';
    const [isPaused, setIsPaused] = useState(false);

    return (
        <>
            {!isBackgroundOnly && <Background isPaused={isPaused}/>}
            {!isBackgroundOnly && <Navbar isPaused={isPaused} setIsPaused={setIsPaused}/>}
            <div className="page-wrapper">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/code" element={<Code/>}/>
                    <Route path="/gameid" element={<Link/>}/>

                    <Route path="/link" element={<Link/>}/>
                    <Route path="/timer" element={<Timer/>}/>
                    <Route path="/clock" element={<Clock/>}/>
                    <Route path="/stopwatch" element={<StopWatch/>}/>
                    <Route path="/timestamp" element={<DiscordTool/>}/>
                    <Route path="/wheel" element={<RandomWheel/>}/>

                    <Route path="/115" element={<ExamCountdown/>}/>
                    <Route path="/background" element={<Background isPaused={isPaused}/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>
            {!isBackgroundOnly && <Footer/>}
        </>
    );
}
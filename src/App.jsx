import {Routes, Route} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar';
import Background from './Background/Background';
import Footer from './components/Footer/Footer';

import Home from './pages/Home/Home';
import Code from './pages/Code/Code';
import GameId from './pages/GameId/GameId';
import Tools from './pages/Tools/Tools';
import NotFound from './pages/NotFound/NotFound';

import Stopwatch from './pages/Tools/Clock/Stopwatch/Stopwatch';
import Time from './pages/Tools/Clock/Time/Time';
import Timer from './pages/Tools/Clock/Timer/Timer';
import DiscordTool from './pages/Tools/Discord/DiscordTool';
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
                    <Route path="/ehconverter" element={<ZhuyinSecret />} />
                    <Route path="/timer" element={<Timer/>}/>

                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>

            <Footer/>
        </>
    );
}
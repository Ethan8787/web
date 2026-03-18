import {useState} from 'react';
import {Route, Routes, useLocation, Navigate} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';
import Background from './Background/Background.jsx';
import Footer from './components/Footer/Footer.jsx';

import Home from './pages/Home/Home.jsx';
import Code from './pages/Code/Code.jsx';
import GameId from './pages/GameId/GameId.jsx';
import Tools from './pages/Tools/Tools.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import ExamCountdown from "./pages/Countdown/Countdown.jsx";

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
                    <Route path="/gameid" element={<GameId/>}/>

                    <Route path="/tools" element={<Navigate to="/timer" replace />}/>
                    <Route path="/timer" element={<Tools/>}/>
                    <Route path="/clock" element={<Tools/>}/>
                    <Route path="/stopwatch" element={<Tools/>}/>
                    <Route path="/timestamp" element={<Tools/>}/>
                    <Route path="/wheel" element={<Tools/>}/>

                    <Route path="/115" element={<ExamCountdown/>}/>
                    <Route path="/background" element={<Background isPaused={isPaused}/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>
            {!isBackgroundOnly && <Footer/>}
        </>
    );
}
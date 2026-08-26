import {useState} from 'react';
import {Route, Routes, useLocation} from 'react-router-dom';

import Navbar from './components/Navbar/Navbar.jsx';
import Background from './components/Background/Background.jsx';
import Footer from './components/Footer/Footer.jsx';

import Home from './pages/Home/Home.jsx';
import Link from './pages/Link/Link.jsx';
import NotFound from './pages/NotFound/NotFound.jsx';
import RandomWheel from "./pages/RandomWheel/RandomWheel.jsx";
import './App.css';

export default function App() {
    const location = useLocation();
    const isBackgroundOnly = location.pathname === '/background' || location.pathname === '/tutorial-amethyst';
    const [isPaused, setIsPaused] = useState(false);

    return (
        <div className="App">
            {!isBackgroundOnly && <Background isPaused={isPaused}/>}
            {!isBackgroundOnly && <Navbar isPaused={isPaused} setIsPaused={setIsPaused}/>}
            <div className="page-wrapper">
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/link" element={<Link/>}/>
                    <Route path="/wheel" element={<RandomWheel/>}/>
                    <Route path="/background" element={<Background isPaused={isPaused}/>}/>
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </div>
            {!isBackgroundOnly && <Footer/>}
        </div>
    );
}
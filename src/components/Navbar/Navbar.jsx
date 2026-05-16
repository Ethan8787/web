import {useEffect, useState} from 'react';
import {Link, NavLink} from 'react-router-dom';
import './Navbar.css';
import {CodeIcon, DataIcon, ExamIcon, HomeIcon, LogoIcon, LinkIcon} from './icons.jsx';

export default function Navbar({isPaused, setIsPaused}) {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY;
                setLastScrollY(prev => {
                    if (currentScrollY > 50 && currentScrollY > prev) {
                        setIsVisible(false);
                    } else {
                        setIsVisible(true);
                    }
                    return currentScrollY;
                });
            }
        };
        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, []);

    return (
        <nav className={`navbar ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="navbar-container">
                <div className="nav-left">
                    <Link to="/" className="brand-logo">
                        <LogoIcon/>
                    </Link>
                </div>

                <div className="nav-center">
                    <div className="nav-dock glass-panel">
                        <NavLink to="/" end className={({isActive}) => (isActive ? 'nav-item active' : 'nav-item')}>
                            <HomeIcon/>
                            <span>首頁</span>
                        </NavLink>
                        <NavLink to="/server" className={({isActive}) => (isActive ? 'nav-item active' : 'nav-item')}>
                            <DataIcon/>
                            <span>伺服器</span>
                        </NavLink>
                        <NavLink to="/answer" className={({isActive}) => (isActive ? 'nav-item active' : 'nav-item')}>
                            <CodeIcon/>
                            <span>答案</span>
                        </NavLink>
                        <NavLink to="/link"
                                 className={({isActive}) => (isActive ? 'nav-item active' : 'nav-item')}>
                            <LinkIcon/>
                            <span>連結</span>
                        </NavLink>
                        <NavLink to="/115" className={({isActive}) => (isActive ? 'nav-item active' : 'nav-item')}>
                            <ExamIcon/>
                            <span>倒數</span>
                        </NavLink>
                    </div>
                </div>

                <div className="nav-right">
                    <button
                        className="nav-control-btn"
                        onClick={() => setIsPaused(!isPaused)}
                        title={isPaused ? "播放背景" : "暫停背景"}
                    >
                        {isPaused ? (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M8 5v14l11-7z"/>
                            </svg>
                        ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                            </svg>
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
}
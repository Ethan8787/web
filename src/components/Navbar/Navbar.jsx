import {useEffect, useState} from 'react';
import {NavLink} from 'react-router-dom';
import './Navbar.css';
import {CodeIcon, DataIcon, ExamIcon, HomeIcon, ToolIcon, LogoIcon, GithubIcon, MailIcon} from './icons';

export default function Navbar() {
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    useEffect(() => {
        const controlNavbar = () => {
            if (typeof window !== 'undefined') {
                const currentScrollY = window.scrollY;
                if (currentScrollY > 50 && currentScrollY > lastScrollY) {
                    setIsVisible(false);
                } else {
                    setIsVisible(true);
                }
                setLastScrollY(currentScrollY);
            }
        };

        window.addEventListener('scroll', controlNavbar);
        return () => window.removeEventListener('scroll', controlNavbar);
    }, [lastScrollY]);

    return (
        <nav className={`navbar ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="navbar-container">
                <div className="nav-left">
                    <div className="brand-logo">
                        <LogoIcon />
                    </div>
                    <div className="social-links">
                        <a href="https://github.com/Nul1-Network" target="_blank" rel="noreferrer"><GithubIcon /></a>
                    </div>
                </div>

                <div className="nav-center">
                    <div className="nav-dock glass-panel">
                        <NavLink to="/" end className={({isActive}) => (isActive ? 'nav-item active' : 'nav-item')}>
                            <HomeIcon/>
                            <span>首頁</span>
                        </NavLink>
                        <NavLink to="/gameid" className={({isActive}) => (isActive ? 'nav-item active' : 'nav-item')}>
                            <DataIcon/>
                            <span>資料</span>
                        </NavLink>
                        <NavLink to="/code" className={({isActive}) => (isActive ? 'nav-item active' : 'nav-item')}>
                            <CodeIcon/>
                            <span>程式</span>
                        </NavLink>
                        <NavLink to="/tools" className={({isActive}) => (isActive ? 'nav-item active tool-highlight' : 'nav-item tool-highlight')}>
                            <ToolIcon/>
                            <span>工具</span>
                        </NavLink>
                        <NavLink to="/115" className={({isActive}) => (isActive ? 'nav-item active' : 'nav-item')}>
                            <ExamIcon/>
                            <span>會考</span>
                        </NavLink>
                    </div>
                </div>

                <div className="nav-right">
                    <a
                        href="https://youtu.be/xMHJGd3wwZk?si=1QacjJGSXzeo1kpb"
                        target="_blank"
                        rel="noreferrer"
                        className="contact-btn"
                    >
                        Get in touch
                    </a>
                </div>
            </div>
        </nav>
    );
}
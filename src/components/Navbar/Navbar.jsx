import { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

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
        return () => {
            window.removeEventListener('scroll', controlNavbar);
        };
    }, [lastScrollY]);

    return (
        <nav className={`navbar ${isVisible ? 'visible' : 'hidden'}`}>
            <div className="nav-dock glass-panel">
                <NavLink to="/" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <span>首頁</span>
                </NavLink>

                <NavLink to="/gameid" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <span>資料</span>
                </NavLink>

                <NavLink to="/code" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <span>程式</span>
                </NavLink>

                <NavLink to="/clock" className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}>
                    <span>時鐘</span>
                </NavLink>

                <NavLink to="/timestamp" className={({ isActive }) => isActive ? "nav-item active tool-highlight" : "nav-item tool-highlight"}>
                    <span>工具</span>
                </NavLink>
            </div>
        </nav>
    );
}
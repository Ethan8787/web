import { Link } from "react-router-dom";

export default function Navbar() {
    return (
        <nav className="navbar">
            <div className="nav-links">
                <a href="#intro" className="nav-link">關於我</a>
                <a href="#skills" className="nav-link">我的能力</a>
                <a href="#projects" className="nav-link">我的專案</a>

                <Link to="/answer" className="nav-link">
                    答案專區
                </Link>
            </div>
        </nav>
    );
}

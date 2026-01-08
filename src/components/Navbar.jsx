import './Navbar.css'

export default function Navbar() {
    return (<nav className="navbar">
        <div className="nav-links">
            <a
                href="/"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/";
                }}
            >
                首頁
            </a>
            <a
                href="/matrix"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/matrix";
                }}
            >
                矩陣
            </a>
            <a
                href="/firework"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/firework";
                }}
            >
                煙火
            </a>
            <a
                href="/answer"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/answer";
                }}
            >
                答案
            </a>
        </div>
    </nav>);
}

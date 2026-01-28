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
                href="/clock"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/clock";
                }}
            >
                時鐘
            </a>
            <a
                href="/code"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/code";
                }}
            >
                程式
            </a>
        </div>
    </nav>);
}

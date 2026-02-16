import './Navbar.css'

export default function Navbar() {
    return (<nav className="navbar">
        <div className="nav-links">
            <a
                href="/public"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/";
                }}
            >
                首頁
            </a>
            <a
                href="/GameId/GameId"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/gameid";
                }}
            >
                遊戲
            </a>
            <a
                href="/Clock/Clock"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/clock";
                }}
            >
                時鐘
            </a>
            <a
                href="/Code/Code"
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

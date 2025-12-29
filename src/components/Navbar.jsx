import './Navbar.css'
export default function Navbar() {
    return (<nav className="navbar">
        <div className="nav-links">
            <div className="header-group">
                <img id="avatar" src="/512.png" alt="Avatar"/>
            </div>
            <a
                href="/#intro"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/#intro";
                }}
            >
                關於我
            </a>
            <a
                href="/#skills"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/#skills";
                }}
            >
                我的能力
            </a>
            <a
                href="/#projects"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/#projects";
                }}
            >
                我的專案
            </a>
            <a
                href="/answer"
                className="nav-link"
                onClick={(e) => {
                    e.preventDefault();
                    window.location.href = "/answer";
                }}
            >
                答案專區
            </a>
        </div>
    </nav>);
}

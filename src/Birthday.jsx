import BirthdayBackground from './BirthdayBackgound.jsx';
import Navbar from './components/Navbar';
import "./Birthday.css"

export default function BirthdayPage() {
    const friendName = "黃靖恆";
    return (<>
        <BirthdayBackground/>
        <div id="blur-overlay"></div>
        <Navbar/>
        <div className="container">
            <div className="intro-card birthday-card" id="intro">
                <div className="header-group">
                    <img id="avatar" src="friend-photo.jpg" alt={`avatar`}/>
                    <h1 className="birthday-headline">{friendName} 生日快樂!</h1>
                </div>
                <div className="personal-message-section">
                    <h2>給你的特別祝福</h2>
                    <p>
                        黃靖恆，祝你生日快樂！感謝你一直以來都是這麼棒的朋友。希望你今天能擁有所有你喜歡的東西。
                    </p>
                    <p className="signature">Ethan 敬上</p>
                </div>
            </div>
        </div>
    </>);
}
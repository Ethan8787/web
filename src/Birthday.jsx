import BirthdayBackground from './BirthdayBackgound.jsx';
import Navbar from './components/Navbar';
import { useEffect, useRef } from "react";
import "./Birthday.css";

export default function BirthdayPage() {
    const friendName = "黃靖恆";

    const audioRef = useRef(null);

    useEffect(() => {
        const audio = audioRef.current;

        audio.volume = 1.0;
        audio.muted = true;
        audio.play().catch(() => {});

        const enableSound = () => {
            audio.muted = false;
            audio.currentTime = 0;
            audio.play().catch(() => {});
            window.removeEventListener("click", enableSound);
            window.removeEventListener("touchstart", enableSound);
        };

        window.addEventListener("click", enableSound);
        window.addEventListener("touchstart", enableSound);

        return () => {
            window.removeEventListener("click", enableSound);
            window.removeEventListener("touchstart", enableSound);
        };
    }, []);

    return (
        <>
            <audio
                ref={audioRef}
                src="/one-spark.mp3"
                loop
                playsInline
                preload="auto"
                style={{ display: "none" }}
            ></audio>

            <BirthdayBackground />
            <div id="blur-overlay"></div>
            <Navbar />

            <div className="container">
                <div className="intro-card birthday-card" id="intro">
                    <div className="header-group">
                        <img id="avatar" src="friend-photo.jpg" alt="avatar" />
                        <h1 className="birthday-headline">
                            {friendName}<br/>生日快樂!
                        </h1>
                    </div>

                    <div className="personal-message-section">
                        <h2>給你的特別祝福</h2>
                        <p>
                            ㊗️ 學業進步<br/>
                            ㊗️ 跳舞越跳越好<br/>
                            ㊗️ 心想事成<br/>
                            ㊗️ 天天開心
                        </p>
                        <p className="signature">Ethan 敬上</p>
                    </div>
                    <h2>點一下播放</h2>
                    <p>TWICE - ONE SPARK</p>

                </div>
            </div>
        </>
    );
}

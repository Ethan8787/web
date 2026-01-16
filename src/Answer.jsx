import { useEffect, useState } from "react";
import Background from "./components/Background.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./Answer.css";

export default function Answer() {
    const [zhContent, setZh] = useState("載入中...");
    const [enContent, setEn] = useState("載入中...");
    const [lang, setLang] = useState("zh");

    useEffect(() => {
        fetch("/zh.txt")
            .then(r => r.text())
            .then(text => setZh(text))
            .catch(err => setZh("載入失敗: " + err.message));

        fetch("/en.txt")
            .then(r => r.text())
            .then(text => setEn(text))
            .catch(err => setEn("載入失敗: " + err.message));
    }, []);

    return (
        <>
            <Background />
            <Navbar />
            <div className="answer">
                <div className="answer-container">
                    <div className="answer-section">
                        <h2>Pagamo 答案 (中英各40篇)</h2>
                        <p>上次更新時間: 2026/01/16 19:57:07</p>

                        <div className="answer-lang-switch">
                            <button
                                className={`answer-btn ${lang === "zh" ? "active" : ""}`}
                                onClick={() => setLang("zh")}
                            >
                                中文｜閱讀素養
                            </button>
                            <button
                                className={`answer-btn ${lang === "en" ? "active" : ""}`}
                                onClick={() => setLang("en")}
                            >
                                英文｜閱讀素養
                            </button>
                        </div>

                        <pre className="answer-pagamo-block">
                            {lang === "zh" ? zhContent : enContent}
                        </pre>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}

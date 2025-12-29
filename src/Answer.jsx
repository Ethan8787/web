import {useEffect, useState} from "react";
import Background from "./components/Background.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./Answer.css"

export default function Answer() {
    const [zhContent, setZh] = useState("載入中...");
    const [enContent, setEn] = useState("載入中...");
    useEffect(() => {
        fetch("/zh_pagamo.txt")
            .then(r => r.text())
            .then(text => setZh(text))
            .catch(err => setZh("載入失敗: " + err.message));

        fetch("/en_pagamo.txt")
            .then(r => r.text())
            .then(text => setEn(text))
            .catch(err => setEn("載入失敗: " + err.message));
    }, []);
    return (<>
        <Background/>
        <Navbar/>
        <div className="answer">
        <div className="container">
            <div className="section">
                <h2>Pagamo 答案</h2>
                <p>上次更新時間: 2025/12/28 22:22:05</p>

                <h3 style={{color: 'var(--accent-color)', marginTop: '20px'}}>
                    中文丨閱讀素養
                </h3>
                <pre className="pagamo-block">
                        {zhContent}
                    </pre>

                <h3 style={{color: 'var(--accent-color)', marginTop: '20px'}}>
                    英文丨閱讀素養
                </h3>
                <pre className="pagamo-block">
                        {enContent}
                    </pre>
            </div>
        </div>
        <Footer/>
        </div>
    </>);
}

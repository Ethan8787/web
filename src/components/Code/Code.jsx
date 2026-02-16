import {useEffect, useState} from "react";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import Background from "../Background/Background.jsx";
import Navbar from "../Navbar/Navbar.jsx";
import Footer from "../Footer/Footer.jsx";
import "./Code.css";

export default function Code() {
    const [activeTab, setActiveTab] = useState("code1"); // "code1" or "code2"
    const [codeContent, setCodeContent] = useState("// 載入中...");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        setCodeContent("// 載入中...");
        fetch(`/${activeTab}.txt`)
            .then(r => {
                if (!r.ok) throw new Error(`找不到 ${activeTab}.txt`);
                return r.text();
            })
            .then(text => setCodeContent(text))
            .catch(err => setCodeContent(`// 載入失敗: ${err.message}`));
    }, [activeTab]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(codeContent).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (<>
        <Background/>
        <Navbar/>
        <div className="code-page">
            <div className="code-container">
                <div className="code-section">
                    <h2>程式碼 Code</h2>
                    <div className="tab-container">
                        <button
                            className={`tab-btn ${activeTab === "code1" ? "active" : ""}`}
                            onClick={() => setActiveTab("code1")}
                        >
                            比賽題目
                        </button>
                        <button
                            className={`tab-btn ${activeTab === "code2" ? "active" : ""}`}
                            onClick={() => setActiveTab("code2")}
                        >
                            可變電阻
                        </button>
                    </div>

                    <div className="code-block-wrapper">
                        <div className="copy-btn-sticky-wrapper">
                            <button className="copy-btn" onClick={copyToClipboard}>
                                {copied ? "已複製！" : (<>
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path
                                            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                    <p>複製</p>
                                </>)}
                            </button>
                        </div>

                        <SyntaxHighlighter
                            language="arduino"
                            style={atomDark}
                            customStyle={{
                                background: 'transparent',
                                padding: '0',
                                margin: '0',
                                fontSize: '0.95em',
                                lineHeight: '1.6',
                                fontFamily: "'JetBrains Mono', monospace",
                            }}
                        >
                            {codeContent}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>
        </div>
        <Footer/>
    </>);
}
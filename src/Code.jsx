import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import Background from "./components/Background.jsx";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import "./Code.css";

export default function Code() {
    const [codeContent, setCodeContent] = useState("// 載入中...");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        fetch("/code.txt")
            .then(r => {
                if (!r.ok) throw new Error("找不到 code.txt");
                return r.text();
            })
            .then(text => setCodeContent(text))
            .catch(err => setCodeContent(`// 載入失敗: ${err.message}`));
    }, []);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(codeContent).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    useEffect(() => {
        fetch("/code.txt")
            .then(r => {
                if (!r.ok) throw new Error("找不到 code.txt");
                return r.text();
            })
            .then(text => setCodeContent(text))
            .catch(err => setCodeContent(`// 載入失敗: ${err.message}`));
    }, []);

    return (
        <>
            <Background />
            <Navbar />
            <div className="code-page">
                <div className="code-container">
                    <div className="code-section">
                        <h2>Arduino 程式碼</h2>

                        <div className="code-block-wrapper">
                            <div className="copy-btn-sticky-wrapper">
                                <button className="copy-btn" onClick={copyToClipboard}>
                                    {copied ? "已複製！" : (
                                        <>
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                            </svg>
                                            <span>複製</span>
                                        </>
                                    )}
                                </button>
                            </div>

                            <SyntaxHighlighter
                                language="arduino"
                                style={atomDark}
                                customStyle={{
                                    background: 'transparent',
                                    padding: '0',
                                    margin: '0',
                                    fontSize: '1rem',
                                    lineHeight: '1.6',
                                }}
                            >
                                {codeContent}
                            </SyntaxHighlighter>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    );
}
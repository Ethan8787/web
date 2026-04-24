import {useEffect, useState} from "react";
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter';
import {atomDark} from 'react-syntax-highlighter/dist/esm/styles/prism';
import "./Code.css";

export default function Code() {
    const [activeTab, setActiveTab] = useState("code1");
    const [codeContent, setCodeContent] = useState("載入中...");
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        document.title = "Ethan's Web - Code & Answer";
        setCodeContent("正在讀取原始碼...");

        fetch(`/${activeTab}.txt`)
            .then(r => {
                if (!r.ok) throw new Error(`找不到伺服器上的 ${activeTab}.txt`);
                return r.text();
            })
            .then(text => setCodeContent(text))
            .catch(err => {
                console.error(err);
                setCodeContent(`// 載入失敗\n// 原因: ${err.message}\n// 請檢查 public 資料夾下是否有 ${activeTab}.txt`);
            });
    }, [activeTab]);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(codeContent).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    return (
        <div className="code-page">
            <div className="code-container">
                <div className="code-section">
                    <h2>Code</h2>
                    <div className="card-divider"></div>

                    <div className="tab-container">
                        <button
                            className={`tab-btn ${activeTab === "code1" ? "active" : ""}`}
                            onClick={() => setActiveTab("code1")}
                        >
                            中文素養
                        </button>
                        <button
                            className={`tab-btn ${activeTab === "code2" ? "active" : ""}`}
                            onClick={() => setActiveTab("code2")}
                        >
                            英語素養
                        </button>
                    </div>

                    <div className="code-block-wrapper">
                        <div className="copy-btn-sticky-wrapper">
                            <button className={`o-copy-btn ${copied ? "copied" : ""}`} onClick={copyToClipboard}>
                                {copied ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                         stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                         strokeLinejoin="round">
                                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                                    </svg>
                                )}
                            </button>
                        </div>
                        <SyntaxHighlighter
                            language="python"
                            style={atomDark}
                            showLineNumbers={true}
                            lineNumberStyle={{textAlign: 'center', minWidth: '2.5em'}}
                            customStyle={{
                                margin: 0,
                                padding: '20px',
                                fontSize: '0.9rem',
                                borderRadius: '8px'
                            }}
                        >
                            {codeContent}
                        </SyntaxHighlighter>
                    </div>
                </div>
            </div>
        </div>
    );
}
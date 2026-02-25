import React, {useState} from 'react';
import './ConsentForm.css';

export default function ConsentForm() {
    const [checkedItems, setCheckedItems] = useState({});

    const handleCheck = (id) => {
        setCheckedItems(prev => ({...prev, [id]: !prev[id]}));
    };

    const promises = [
        {id: 1, text: "保證在未來商業往來中，絕對誠實、絕不說謊。"},
        {id: 2, text: "保證全力衝刺「大安高工」，並在技術與學業間取得平衡。"},
        {id: 3, text: "保證精進 C / Java / React，絕不將代碼用於非法用途。"},
        {id: 4, text: "保證如期提交 Canny 邊緣偵測專案報告。"}
    ];

    return (
        <div className="consent-page-wrapper">
            <div className="minimal-doc-card">
                <h2 className="doc-title">COMMITMENT & HONOR</h2>
                <div className="divider"></div>

                <div className="promise-list">
                    {promises.map(p => (
                        <div key={p.id} className="promise-row" onClick={() => handleCheck(p.id)}>
                            <div className={`custom-icon ${checkedItems[p.id] ? 'checked' : ''}`}>
                                {checkedItems[p.id] ? (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                         strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
                                         className="draw-check">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                ) : (
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                                    </svg>
                                )}
                            </div>
                            <span className={`promise-text ${checkedItems[p.id] ? 'strikethrough' : ''}`}>
                                {p.text}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="doc-footer">
                    <div className="sig-item">
                        <span className="label">DEVELOPER</span>
                        <span className="val">Ethan8787</span>
                    </div>
                    <div className="sig-item">
                        <span className="label">DATE</span>
                        <span className="val">2026 / 02 / 22</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
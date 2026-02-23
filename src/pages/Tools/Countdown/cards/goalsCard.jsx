import React, {useState} from "react";
import './goalsCard.css';

const PromiseItem = ({text}) => {
    const [checked, setChecked] = useState(false);
    return (<div className="promise-row" onClick={() => setChecked(!checked)}>
        <div className={`custom-icon ${checked ? 'checked' : ''}`}>
            {checked && (<svg className="draw-check" width="12" height="12" viewBox="0 0 12 12">
                <polyline points="2 6 5 9 10 3" fill="none" stroke="black" strokeWidth="2"/>
            </svg>)}
        </div>
        <span className={`promise-text ${checked ? 'strikethrough' : ''}`}>
                {text}
            </span>
    </div>);
};

export default function GoalsCard() {
    return (<div className="consent-page-wrapper">
        <div className="minimal-doc-card">
            <h3 className="doc-title">會考承諾書</h3>
            <div className="divider"></div>

            <PromiseItem text="每日完成進度，不拖延至隔日"/>
            <PromiseItem text="手機使用時間限制在 1 小時內"/>
            <PromiseItem text="複習錯題本，確保完全理解"/>
            <PromiseItem text="保持專注，不被社交媒體干擾"/>

            <div className="doc-footer">
                <div className="sig-item">
                    <span className="label">DATE</span>
                    <span className="val">{new Date().toLocaleDateString()}</span>
                </div>

                <div className="sig-item">
                    <span className="label">CANDIDATE</span>
                    <input
                        className="val sig-input"
                        placeholder="ENTER NAME"
                        spellCheck="false"
                    />
                </div>
            </div>
        </div>
    </div>);
}
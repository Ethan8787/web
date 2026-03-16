import React, {useEffect, useState} from 'react';
import './DiscordTool.css';

export default function DiscordTool() {
    const now = new Date();
    const defaultDate = now.toISOString().split('T')[0];
    const defaultTime = now.toTimeString().slice(0, 5);

    const [date, setDate] = useState(defaultDate);
    const [time, setTime] = useState(defaultTime);
    const [type, setType] = useState('R');
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);

    const formats = [{code: 'R', label: '相對時間 (例如：2 年前)'}, {
        code: 't', label: '短時間 (例如：16:20)'
    }, {code: 'T', label: '長時間 (例如：16:20:30)'}, {code: 'd', label: '短日期 (例如：2021/04/20)'}, {
        code: 'D', label: '長日期 (例如：2021年4月20日)'
    }, {code: 'f', label: '短日期與時間 (例如：2021年4月20日 16:20)'}, {
        code: 'F', label: '星期、日期與時間 (例如：2021年4月20日星期二 16:20)'
    },];

    useEffect(() => {
        const dateTimeStr = `${date}T${time}`;
        const targetDate = new Date(dateTimeStr);
        const unixTimestamp = Math.floor(targetDate.getTime() / 1000);

        if (isNaN(unixTimestamp)) {
            setResult('無效的日期');
        } else {
            setResult(`<t:${unixTimestamp}:${type}>`);
        }
    }, [date, time, type]);

    const handleCopy = () => {
        if (result && result !== '無效的日期') {
            navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (<div className="discord-tool-container">
        <div className="dc-glass-card">
            <div className="input-wrapper">
                <label>日期</label>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
            </div>
            <div className="input-wrapper">
                <label>時間</label>
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                />
            </div>

            <div className="input-wrapper full-width">
                <label>格式類型</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    {formats.map(f => (<option key={f.code} value={f.code}>
                        {f.label}
                    </option>))}
                </select>
            </div>

            <div className="output-section">
                <label>輸出代碼</label>
                <div className="code-box">
                    <code>{result}</code>
                    <button
                        className={`copy-btn ${copied ? 'copied' : ''}`}
                        onClick={handleCopy}
                    >
                        {copied ? (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                                        strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>) : (<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                                        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                                        strokeLinejoin="round">
                            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                        </svg>)}
                    </button>
                </div>
            </div>

            <div className="preview-section">
                <label>輸出代碼</label>
                <div className="preview-box">
                    <span className="discord-preview">
                        {type === 'R' ? '2 分鐘後' : type === 't' ? time : type === 'd' ? date : '動態預覽'}
                    </span>
                </div>
            </div>
        </div>
    </div>);
}
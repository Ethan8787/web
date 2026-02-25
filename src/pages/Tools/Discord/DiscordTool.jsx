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

    const formats = [{code: 'R', label: 'Relative (e.g., 2 years ago)'}, {
        code: 't', label: 'Short Time (e.g., 16:20)'
    }, {code: 'T', label: 'Long Time (e.g., 16:20:30)'}, {
        code: 'd', label: 'Short Date (e.g., 20/04/2021)'
    }, {code: 'D', label: 'Long Date (e.g., 20 April 2021)'}, {
        code: 'f', label: 'Short Date/Time (e.g., 20 April 2021 16:20)'
    }, {code: 'F', label: 'Long Date/Time (e.g., Tuesday, 20 April 2021 16:20)'},];

    useEffect(() => {
        const dateTimeStr = `${date}T${time}`;
        const targetDate = new Date(dateTimeStr);
        const unixTimestamp = Math.floor(targetDate.getTime() / 1000);

        if (isNaN(unixTimestamp)) {
            setResult('Invalid Date');
        } else {
            setResult(`<t:${unixTimestamp}:${type}>`);
        }
    }, [date, time, type]);

    const handleCopy = () => {
        if (result && result !== 'Invalid Date') {
            navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (<div className="discord-tool-container">
        <div className="glass-card">
            <div className="card-header">
                <h2>Discord Timestamp</h2>
                <span className="badge">Generator</span>
            </div>

            <div className="input-group">
                <div className="input-wrapper">
                    <label>Date</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <div className="input-wrapper">
                    <label>Time</label>
                    <input
                        type="time"
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                    />
                </div>
            </div>

            <div className="input-wrapper full-width">
                <label>Format Type</label>
                <select value={type} onChange={(e) => setType(e.target.value)}>
                    {formats.map(f => (<option key={f.code} value={f.code}>
                        {f.label}
                    </option>))}
                </select>
            </div>

            <div className="output-section">
                <label>Output Code</label>
                <div className="code-box">
                    <code>{result}</code>
                    <button
                        className={`copy-btn ${copied ? 'copied' : ''}`}
                        onClick={typeof copyToClipboard !== 'undefined' ? copyToClipboard : handleCopy}
                    >
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
            </div>

            <div className="preview-section">
                <span>Preview: </span>
                <span className="discord-preview">
                       {type === 'R' ? 'In 2 minutes' : type === 't' ? time : type === 'd' ? date : 'Dynamic Preview'}
                    </span>
            </div>
        </div>
    </div>);
}
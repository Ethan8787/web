import React, { useState } from 'react';
import { ShieldCheck, Keyboard } from 'lucide-react';
import './ZhuyinSecret.css';

const ZhuyinSecret = () => {
    const [raw, setRaw] = useState('');
    const keyboardMap = {
        '1':'ㄅ','q':'ㄆ','a':'ㄇ','z':'ㄈ',
        '2':'ㄉ','w':'ㄊ','s':'ㄋ','x':'ㄌ',
        '3':'ˇ','e':'ㄍ','d':'ㄎ','c':'ㄏ',
        '4':'ˋ','r':'ㄐ','f':'ㄑ','v':'ㄒ',
        '5':'ㄓ','t':'ㄔ','g':'ㄕ','b':'ㄖ',
        '6':'ˊ','y':'ㄗ','h':'ㄘ','n':'ㄙ',
        '7':'˙','u':'ㄧ','j':'ㄨ','m':'ㄩ',
        '8':'ㄚ','i':'ㄛ','k':'ㄜ','9':'ㄞ',
        'o':'ㄟ','l':'ㄠ','0':'ㄢ','p':'ㄣ',
        ';':'ㄤ','/':'ㄥ','-':'ㄦ',
        '.':'ㄡ'
    };
    const tones = ['ˇ', 'ˋ', 'ˊ', '˙', 'ˉ'];

    const convert = (t) => {
        const chars = t.toLowerCase().split('');
        let result = [];
        chars.forEach((char) => {
            if (char === ' ') {
                const prev = result[result.length - 1];
                if (Object.values(keyboardMap).includes(prev) && !tones.includes(prev)) result.push('ˉ');
                else result.push(' ');
            } else { result.push(keyboardMap[char] || char); }
        });
        return result.join('');
    };

    return (
        <div className="tool-page-container">
            <div className="secret-section-card">
                <ShieldCheck size={80} className="top-icon" />
                <h2 className="tool-title">注音密碼轉換器</h2>
                <div className="input-group">
                    <label>Input</label>
                    <input type="text" value={raw} onChange={(e) => setRaw(e.target.value)} placeholder="su3g4e.3..." />
                </div>
                <div className="output-group">
                    <label>Result</label>
                    <div className="output-display">{convert(raw) || <span className="cursor">_</span>}</div>
                </div>
            </div>
        </div>
    );
};
export default ZhuyinSecret;
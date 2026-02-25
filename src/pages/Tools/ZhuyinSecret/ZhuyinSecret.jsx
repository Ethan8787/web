import React, {useState} from 'react';
import {ShieldCheck} from 'lucide-react';
import './ZhuyinSecret.css';

const ZhuyinSecret = () => {
    const [raw, setRaw] = useState('');

    const keyboardMap = {
        '1': 'ㄅ', 'q': 'ㄆ', 'a': 'ㄇ', 'z': 'ㄈ', '2': 'ㄉ', 'w': 'ㄊ', 's': 'ㄋ', 'x': 'ㄌ',
        '3': 'ˇ', 'e': 'ㄍ', 'd': 'ㄎ', 'c': 'ㄏ', '4': 'ˋ', 'r': 'ㄐ', 'f': 'ㄑ', 'v': 'ㄒ',
        '5': 'ㄓ', 't': 'ㄔ', 'g': 'ㄕ', 'b': 'ㄖ', '6': 'ˊ', 'y': 'ㄗ', 'h': 'ㄘ', 'n': 'ㄙ',
        '7': '˙', 'u': 'ㄧ', 'j': 'ㄨ', 'm': 'ㄩ', '8': 'ㄚ', 'i': 'ㄛ', 'k': 'ㄜ', '9': 'ㄞ',
        'o': 'ㄟ', 'l': 'ㄠ', '0': 'ㄢ', 'p': 'ㄣ', ';': 'ㄤ', '/': 'ㄥ', '-': 'ㄦ', '.': 'ㄡ'
    };

    const convert = (t) => {
        return t.toLowerCase().split('').map(char => {
            if (char === ' ') return 'ˉ';
            return keyboardMap[char] || char;
        }).join('');
    };

    return (
        <div className="tool-page-container">
            <div className="secret-section-card">
                <ShieldCheck size={50} className="top-icon"/>
                <h2 className="tool-title">注音轉換</h2>

                <div className="input-group">
                    <label>INPUT</label>
                    <input
                        type="text"
                        value={raw}
                        onChange={(e) => setRaw(e.target.value)}
                        placeholder="試著不切換輸入法.."
                        autoFocus
                    />
                </div>

                <div className="output-group">
                    <label>SECRET</label>
                    <div className="output-display">
                        {convert(raw)}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ZhuyinSecret;
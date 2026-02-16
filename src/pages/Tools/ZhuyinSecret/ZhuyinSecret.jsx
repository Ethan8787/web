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
                const isPrevZhuyin = Object.values(keyboardMap).includes(prev);
                const isPrevTone = tones.includes(prev);
                if (isPrevZhuyin && !isPrevTone) result.push('ˉ');
                else result.push(' ');
            } else {
                result.push(keyboardMap[char] || char);
            }
        });
        return result.join('');
    };

    return (
        <div className="container">
            <div className="secret-section">
                <div className="icon-header">
                    <ShieldCheck size={80} strokeWidth={1.5} />
                </div>

                <h2>注音密碼轉換器</h2>

                <div className="secret-card-content">
                    <div className="input-field">
                        <label>INPUT / 原始輸入</label>
                        <input
                            type="text"
                            value={raw}
                            onChange={(e) => setRaw(e.target.value)}
                            placeholder="su3g4e.3 187..."
                        />
                    </div>

                    <div className="output-field">
                        <label>RESULT / 轉換結果</label>
                        <div className="output-box">
                            {convert(raw) || <span className="cursor">_</span>}
                        </div>
                    </div>
                </div>

                <div className="tool-info">
                    <Keyboard size={16} />
                    <span>SMART QWERTY MAPPING ACTIVE</span>
                </div>
            </div>
        </div>
    );
};

export default ZhuyinSecret;
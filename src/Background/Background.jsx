import React from 'react';
import bgDark from '../assets/background/dark.jpg';
import './Background.css';

const Background = ({mode = 'dark'}) => {
    return (
        <div
            className="background-container"
            style={{'--bg-url': `url(${bgDark})`}}
        />
    );
};

export default Background;

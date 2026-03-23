import React from 'react';
import Ring from '../Ring/Ring';
import './GraduateCard.css';

export default function GraduateCard() {
    const target = new Date('2026-06-05T12:00:00');

    return (
        <div className="rings-container">
            <Ring targetDate={target} type="d" max={365} label="天" colorClass="c-grad-cherry"/>
            <Ring targetDate={target} type="h" max={24} label="時" colorClass="c-grad-sunset"/>
            <Ring targetDate={target} type="m" max={60} label="分" colorClass="c-grad-berry"/>
            <Ring targetDate={target} type="s" max={60} label="秒" colorClass="c-grad-plum"/>
        </div>
    );
}
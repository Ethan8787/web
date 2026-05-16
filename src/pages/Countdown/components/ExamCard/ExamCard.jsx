import React from 'react';
import Ring from '../Ring/Ring';
import './ExamCard.css';

export default function ExamCard() {
    const target = new Date('2027-05-22T08:20:00');

    return (
        <div className="rings-container">
            <Ring targetDate={target} type="d" max={365} label="天" colorClass="c-red"/>
            <Ring targetDate={target} type="h" max={24} label="時" colorClass="c-yellow"/>
            <Ring targetDate={target} type="m" max={60} label="分" colorClass="c-cyan"/>
            <Ring targetDate={target} type="s" max={60} label="秒" colorClass="c-blue"/>
        </div>
    );
}
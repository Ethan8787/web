import React from 'react';
import './NotFound.css';

export default function NotFound() {
    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-heading">404 Page Not Found</h1>
                <p className="not-found-message">
                    Sorry, but the page you were trying to view does not exist.
                </p>
                <a href="/public" className="not-found-home-link">
                    Go Home
                </a>
            </div>
        </div>
    );
}
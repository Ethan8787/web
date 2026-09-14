import React from 'react';
import avatarImg from '../../assets/avatar/512.png';
import discordIcon from '../../assets/icons/discord.svg';
import youtubeIcon from '../../assets/icons/youtube.svg';
import instagramIcon from '../../assets/icons/instagram.svg';
import githubIcon from '../../assets/icons/github.svg';
import "./Home.css";

const SOCIAL_LINKS = [


    {
        name: 'GitHub',
        url: 'https://github.com/Ethan8787/',
        icon: githubIcon,
        className: 'btn-github',
    },
    {
        name: 'Discord',
        url: 'https://discord.com/users/840394442275815455',
        icon: discordIcon,
        className: 'btn-discord',
    },
    {
        name: 'YouTube',
        url: 'https://www.youtube.com/channel/UCDiFgkr0I6uAgRlBBPnflNw',
        icon: youtubeIcon,
        className: 'btn-youtube',
    },
    {
        name: 'Instagram',
        url: 'https://www.instagram.com/ethantw.dev/',
        icon: instagramIcon,
        className: 'btn-instagram',
    },
];

export default function Home() {
    return (
        <main className="App">
            <div className="container">
                <section className="intro">
                    <header className="header-group">
                        <img id="avatar" src={avatarImg} alt="Ethan Profile Avatar" />
                        <div className="intro-text">
                            <h1>Ethan</h1>
                        </div>
                    </header>

                    <p className="intro-desc">
                        A <strong>programmer</strong> from Taiwan.
                    </p>

                    <nav className="button-group" aria-label="Social Links">
                        {SOCIAL_LINKS.map(({ name, url, icon, className }) => (
                            <a
                                key={name}
                                className={`btn ${className}`}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <img src={icon} className="btn-icon" alt={`${name} icon`} />
                                {name}
                            </a>
                        ))}
                    </nav>
                </section>
            </div>
        </main>
    );
}
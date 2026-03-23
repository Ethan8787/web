export function LogoIcon(props) {
    return (<svg className="logo-icon" width="135" height="48" viewBox="0 0 135 48" fill="none"
                 xmlns="http://www.w3.org/2000/svg" {...props}>
        <rect x="8" y="10" width="28" height="28" rx="4" stroke="white" strokeWidth="2.5"/>
        <rect x="16" y="18" width="12" height="12" rx="3" fill="#888888"/>
        <text x="48" y="21" style={{fontWeight: 'bold', fontSize: '18px'}}>
            <tspan x="48" dy="0" fill="white">NULL</tspan>
            <tspan x="48" dy="18" fill="#888888">NETWORK</tspan>
        </text>
    </svg>);
}

export function LinkIcon(props) {
    return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <g id="Interface / Link">
            <path id="Vector"
                  d="M9.1718 14.8288L14.8287 9.17192M7.05086 11.293L5.63664 12.7072C4.07455 14.2693 4.07409 16.8022 5.63619 18.3643C7.19829 19.9264 9.7317 19.9259 11.2938 18.3638L12.7065 16.9498M11.2929 7.05L12.7071 5.63579C14.2692 4.07369 16.8016 4.07397 18.3637 5.63607C19.9258 7.19816 19.9257 9.73085 18.3636 11.2929L16.9501 12.7071"
                  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </g>
    </svg>);
}

export function HomeIcon(props) {
    return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M4 10.5 12 4l8 6.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6.5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V21.5H5.5A1.5 1.5 0 0 1 4 20v-9.5Z"
            stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>);
}

export function DataIcon(props) {
    return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none"
                 aria-hidden="true" {...props}>
        <path d="M6 7.5C6 6.1 8.7 5 12 5s6 1.1 6 2.5S15.3 10 12 10 6 8.9 6 7.5Z" stroke="currentColor"
              strokeWidth="1.5"/>
        <path d="M6 7.5V12c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V7.5" stroke="currentColor" strokeWidth="1.5"
              strokeLinejoin="round"/>
        <path d="M6 12v4.5C6 17.9 8.7 19 12 19s6-1.1 6-2.5V12" stroke="currentColor" strokeWidth="1.5"
              strokeLinejoin="round"/>
    </svg>);
}

export function CodeIcon(props) {
    return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none"
                 xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13.9868 5L10.0132 19.8297" stroke="currentColor" strokeWidth="1.5"
              strokeLinecap="round"/>
        <path
            d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
            stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>);
}

export function ExamIcon(props) {
    return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path d="M4.5 7.5 12 4l7.5 3.5L12 11 4.5 7.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
        <path d="M19.5 7.5V12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        <path d="M6.5 10.2V14c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-3.8" stroke="currentColor" strokeWidth="1.8"
              strokeLinejoin="round"/>
    </svg>);
}
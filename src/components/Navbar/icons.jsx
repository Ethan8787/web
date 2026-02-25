// src/components/Navbar/NavbarIcons.jsx
// 目的：Navbar 用的 SVG icon（統一用 currentColor，跟著文字顏色走）
export function HomeIcon(props) {
    return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M4 10.5 12 4l8 6.5V20a1.5 1.5 0 0 1-1.5 1.5H15v-6.5a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1V21.5H5.5A1.5 1.5 0 0 1 4 20v-9.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
        />
    </svg>);
}

export function DataIcon(props) {
    return (<svg className="nav-icon" width="28px" height="28px" viewBox="0 0 24 24" fill="none"
                 aria-hidden="true" {...props}>
        <path
            d="M6 7.5C6 6.1 8.7 5 12 5s6 1.1 6 2.5S15.3 10 12 10 6 8.9 6 7.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
        />
        <path
            d="M6 7.5V12c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5V7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
        />
        <path
            d="M6 12v4.5C6 17.9 8.7 19 12 19s6-1.1 6-2.5V12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
        />
    </svg>);
}

export function CodeIcon(props) {
    return (<svg width="20px" height="20px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M17 7.82959L18.6965 9.35641C20.239 10.7447 21.0103 11.4389 21.0103 12.3296C21.0103 13.2203 20.239 13.9145 18.6965 15.3028L17 16.8296"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <path opacity="0.5" d="M13.9868 5L10.0132 19.8297" stroke="currentColor" stroke-width="1.5"
              stroke-linecap="round"/>
        <path
            d="M7.00005 7.82959L5.30358 9.35641C3.76102 10.7447 2.98975 11.4389 2.98975 12.3296C2.98975 13.2203 3.76102 13.9145 5.30358 15.3028L7.00005 16.8296"
            stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    </svg>);
}

export function ToolIcon(props) {
    return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M14.5 6.2a4.8 4.8 0 0 0-5.8 6.9L4.7 17.1a1.6 1.6 0 0 0 0 2.2l0 0a1.6 1.6 0 0 0 2.2 0l4-4a4.8 4.8 0 0 0 6.9-5.8l-2.2 2.2-2.3-2.3 2.2-2.2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
        />
    </svg>);
}

export function ExamIcon(props) {
    return (<svg className="nav-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
        <path
            d="M4.5 7.5 12 4l7.5 3.5L12 11 4.5 7.5Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
        />
        <path
            d="M19.5 7.5V12"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
        />
        <path
            d="M6.5 10.2V14c0 1.7 2.5 3 5.5 3s5.5-1.3 5.5-3v-3.8"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
        />
    </svg>);
}
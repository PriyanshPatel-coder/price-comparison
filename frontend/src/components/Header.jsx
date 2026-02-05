import React from 'react';

const Header = ({ onHomeClick }) => {
    const handleHomeClick = (e) => {
        e.preventDefault();
        if (onHomeClick) {
            onHomeClick();
        }
    };

    return (
        <header className="py-5 shadow-xl relative" style={{ backgroundColor: '#364F6B' }}>
            <div className="container mx-auto px-6 flex justify-between items-center text-white relative z-10">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={handleHomeClick}>
                    {/* Logo Icon */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center border-2" style={{ backgroundColor: '#3FC1C9', borderColor: '#3FC1C9' }}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-wide">
                        <span className="text-white">Smart</span>
                        <span style={{ color: '#3FC1C9' }}>Price</span>
                        <span style={{ color: '#FC5185' }}>Finder</span>
                    </h1>
                </div>

                <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    <a href="#" onClick={handleHomeClick} className="text-white hover:opacity-80 transition-opacity duration-300 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        Home
                    </a>
                    <a href="#" className="text-white hover:opacity-80 transition-opacity duration-300 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        About
                    </a>
                </nav>
            </div>
        </header>
    );
};

export default Header;

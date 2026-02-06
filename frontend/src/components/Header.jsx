import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Header = ({ onHomeClick }) => {
    const { theme, toggleTheme, isDark } = useTheme();

    const handleHomeClick = (e) => {
        e.preventDefault();
        if (onHomeClick) {
            onHomeClick();
        }
    };

    return (
        <header
            className="py-5 shadow-xl relative transition-colors duration-300"
            style={{ backgroundColor: 'var(--header-bg)' }}
        >
            <div className="container mx-auto px-6 flex justify-between items-center text-white relative z-10">
                <div className="flex items-center space-x-3 cursor-pointer" onClick={handleHomeClick}>
                    {/* Logo Icon */}
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center border-2" style={{ backgroundColor: 'var(--accent-teal)', borderColor: 'var(--accent-teal)' }}>
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold tracking-wide">
                        <span className="text-white">Smart</span>
                        <span style={{ color: 'var(--accent-teal)' }}>Price</span>
                        <span style={{ color: 'var(--accent-coral)' }}>Finder</span>
                    </h1>
                </div>

                <nav className="flex items-center space-x-6 text-sm font-medium">
                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-6">
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
                    </div>

                    {/* Dark Mode Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="theme-toggle w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300"
                        style={{
                            backgroundColor: isDark ? '#fbbf24' : '#1e293b',
                        }}
                        title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                    >
                        {isDark ? (
                            // Sun icon for dark mode (click to go light)
                            <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        ) : (
                            // Moon icon for light mode (click to go dark)
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                        )}
                    </button>
                </nav>
            </div>
        </header>
    );
};

export default Header;

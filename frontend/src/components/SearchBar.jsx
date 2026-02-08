import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const SearchBar = ({ onSearch, query, setQuery }) => {
    const [isFocused, setIsFocused] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const wrapperRef = useRef(null);

    // Load recent searches from localStorage on mount
    useEffect(() => {
        const saved = localStorage.getItem('recentSearches');
        if (saved) {
            setRecentSearches(JSON.parse(saved));
        }
    }, []);

    // Save a search to recent searches
    const saveToRecent = (searchTerm) => {
        const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
        setRecentSearches(updated);
        localStorage.setItem('recentSearches', JSON.stringify(updated));
    };

    // Clear recent searches
    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');
    };

    // Fetch suggestions when query changes (debounced)
    useEffect(() => {
        const fetchSuggestions = async () => {
            if (query.length < 2) {
                setSuggestions([]);
                return;
            }

            try {
                const response = await axios.get(`http://localhost:5000/api/compare/suggestions?q=${encodeURIComponent(query)}`);
                setSuggestions(response.data);
                setSelectedIndex(-1);
            } catch (error) {
                console.error("Failed to fetch suggestions", error);
                setSuggestions([]);
            }
        };

        const timeoutId = setTimeout(fetchSuggestions, 200);
        return () => clearTimeout(timeoutId);
    }, [query]);

    // Hide dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Get items to display in dropdown
    const getDropdownItems = () => {
        if (query.length >= 2 && suggestions.length > 0) {
            return { type: 'suggestions', items: suggestions };
        }
        if (query.length < 2 && recentSearches.length > 0) {
            return { type: 'recent', items: recentSearches };
        }
        return { type: 'none', items: [] };
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        const { items } = getDropdownItems();
        if (!showDropdown || items.length === 0) return;

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev < items.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
            e.preventDefault();
            handleItemClick(items[selectedIndex]);
        } else if (e.key === 'Escape') {
            setShowDropdown(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setShowDropdown(false);
        if (query.trim()) {
            saveToRecent(query.trim());
            onSearch(query);
        }
    };

    const handleItemClick = (item) => {
        setQuery(item);
        setShowDropdown(false);
        saveToRecent(item);
        onSearch(item);
    };

    const { type, items } = getDropdownItems();

    return (
        <div className="w-full max-w-lg mx-auto" ref={wrapperRef}>
            {/* Title Section */}
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                    Find the Best Deals
                </h2>
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
                    Compare prices across multiple stores instantly
                </p>
            </div>

            <div className="relative">
                <form
                    onSubmit={handleSubmit}
                    className={`flex items-center rounded-full overflow-hidden transition-all duration-300 shadow-md hover:shadow-lg w-full ${isFocused ? 'ring-2 ring-opacity-50' : 'border border-opacity-20'}`}
                    style={{
                        backgroundColor: 'var(--bg-card)',
                        borderColor: isFocused ? 'var(--accent-teal)' : 'var(--border-color)',
                        '--tw-ring-color': 'var(--accent-teal)'
                    }}
                >
                    {/* Search Icon (Left) */}
                    <div
                        className="flex items-center justify-center pl-6 pr-4 transition-colors duration-300 flex-shrink-0"
                        style={{ color: isFocused ? 'var(--accent-teal)' : 'var(--text-muted)' }}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>

                    {/* Input Field */}
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => {
                            setIsFocused(true);
                            setShowDropdown(true);
                        }}
                        onBlur={() => setIsFocused(false)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search..."
                        className="flex-1 w-full py-3 text-base font-medium focus:outline-none bg-transparent min-w-0"
                        style={{ color: 'var(--text-primary)' }}
                        autoComplete="off"
                    />

                    {/* Gradient Search Button (Right) */}
                    <button
                        type="submit"
                        className="p-3 m-1 rounded-full transition-all duration-300 transform hover:scale-110 active:scale-95 shadow-md flex-shrink-0 flex items-center justify-center group"
                        style={{
                            background: 'linear-gradient(135deg, #2dd4bf 0%, #3b82f6 100%)', // Teal to Blue gradient
                            color: '#ffffff',
                            minWidth: '42px',
                            minHeight: '42px'
                        }}
                        aria-label="Search"
                    >
                        <svg className="w-5 h-5 transform group-hover:rotate-90 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </button>
                </form>

                {/* Dropdown (Suggestions or Recent Searches) */}
                {showDropdown && items.length > 0 && (
                    <div
                        className="absolute top-full left-0 right-0 mt-2 rounded-xl shadow-2xl overflow-hidden z-50 border transition-colors duration-300"
                        style={{ backgroundColor: 'var(--dropdown-bg)', borderColor: 'var(--border-color)' }}
                    >
                        {/* Header for Recent Searches */}
                        {type === 'recent' && (
                            <div className="flex items-center justify-between px-5 py-2 border-b" style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}>
                                <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
                                    Recent Searches
                                </span>
                                <button
                                    onClick={clearRecentSearches}
                                    className="text-xs font-medium hover:underline"
                                    style={{ color: 'var(--accent-coral)' }}
                                >
                                    Clear All
                                </button>
                            </div>
                        )}

                        {items.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleItemClick(item)}
                                className="px-5 py-3 cursor-pointer transition-all duration-150 flex items-center gap-3"
                                style={{
                                    backgroundColor: selectedIndex === index ? 'var(--dropdown-hover)' : 'transparent',
                                    color: 'var(--text-primary)',
                                    borderBottom: index < items.length - 1 ? '1px solid var(--border-color)' : 'none'
                                }}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                {type === 'recent' ? (
                                    <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                ) : (
                                    <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--accent-teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                )}
                                <span className="text-base">{item}</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Quick search suggestions */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Popular:</span>
                {['Nike Shoes', 'iPhone 15', 'Sony Headphones', 'Samsung TV'].map((item) => (
                    <button
                        key={item}
                        onClick={() => {
                            setQuery(item);
                            saveToRecent(item);
                            onSearch(item);
                        }}
                        className="px-4 py-1.5 text-sm rounded-full border transition-all duration-300 hover:text-white"
                        style={{
                            color: 'var(--text-primary)',
                            borderColor: 'var(--border-color)',
                            backgroundColor: 'var(--bg-card)'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = 'var(--accent-teal)';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = 'var(--accent-teal)';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'var(--bg-card)';
                            e.target.style.color = 'var(--text-primary)';
                            e.target.style.borderColor = 'var(--border-color)';
                        }}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div >
    );
};

export default SearchBar;
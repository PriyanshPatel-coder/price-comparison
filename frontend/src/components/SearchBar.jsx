import React, { useState } from 'react';

const SearchBar = ({ onSearch, query, setQuery }) => {
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto">
            {/* Title Section */}
            <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-3" style={{ color: '#364F6B' }}>
                    Find the Best Deals
                </h2>
                <p className="text-lg" style={{ color: '#364F6B', opacity: 0.7 }}>
                    Compare prices across multiple stores instantly
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className={`flex items-center rounded-2xl overflow-hidden transition-all duration-300 border ${isFocused ? 'ring-2' : ''
                    }`}
                style={{
                    borderColor: '#e5e7eb',
                    '--tw-ring-color': '#3FC1C9'
                }}
            >
                <div className="relative flex-1 bg-white">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2" style={{ color: '#364F6B', opacity: 0.5 }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search for any product (e.g., Nike Air Max, iPhone 15...)"
                        className="w-full pl-14 pr-6 py-5 text-lg focus:outline-none bg-transparent"
                        style={{ color: '#364F6B' }}
                    />
                </div>
                <button
                    type="submit"
                    className="text-white px-10 py-5 font-semibold text-lg flex items-center gap-2 transition-all duration-300 hover:opacity-90"
                    style={{ backgroundColor: '#3FC1C9' }}
                >
                    <span>Search</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </button>
            </form>

            {/* Quick search suggestions */}
            <div className="flex flex-wrap justify-center gap-2 mt-6">
                <span className="text-sm" style={{ color: '#364F6B', opacity: 0.5 }}>Popular:</span>
                {['Nike Shoes', 'iPhone 15', 'Sony Headphones', 'Samsung TV'].map((item) => (
                    <button
                        key={item}
                        onClick={() => {
                            setQuery(item);
                            onSearch(item);
                        }}
                        className="px-4 py-1.5 text-sm bg-white rounded-full border transition-all duration-300"
                        style={{
                            color: '#364F6B',
                            borderColor: '#e5e7eb'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.backgroundColor = '#3FC1C9';
                            e.target.style.color = 'white';
                            e.target.style.borderColor = '#3FC1C9';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.backgroundColor = 'white';
                            e.target.style.color = '#364F6B';
                            e.target.style.borderColor = '#e5e7eb';
                        }}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default SearchBar;

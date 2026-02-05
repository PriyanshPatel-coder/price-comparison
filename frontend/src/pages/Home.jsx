import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import PriceTable from '../components/PriceTable';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = async (query) => {
        setLoading(true);
        setError(null);
        setProducts([]);
        setHasSearched(true);

        try {
            const response = await axios.get(`http://localhost:5001/api/compare?q=${encodeURIComponent(query)}`);
            setProducts(response.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to fetch prices.');
        } finally {
            setLoading(false);
        }
    };

    const handleHomeClick = () => {
        setProducts([]);
        setError(null);
        setHasSearched(false);
        setSearchQuery('');
    };

    return (
        <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F5F5' }}>
            <Header onHomeClick={handleHomeClick} />

            <main className="flex-grow container mx-auto px-4 py-10">
                {/* Hero Search Section */}
                <div className="mb-16">
                    <SearchBar onSearch={handleSearch} query={searchQuery} setQuery={setSearchQuery} />
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="text-center py-16">
                        <div className="inline-flex flex-col items-center gap-4">
                            <div className="relative">
                                <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: '#e6f7f8' }}></div>
                                <div
                                    className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
                                    style={{ borderColor: '#3FC1C9', borderTopColor: 'transparent' }}
                                ></div>
                            </div>
                            <div>
                                <p className="text-lg font-semibold" style={{ color: '#364F6B' }}>Searching for the best deals...</p>
                                <p className="text-sm mt-1" style={{ color: '#364F6B', opacity: 0.6 }}>Comparing prices across multiple stores</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-xl mx-auto mb-8">
                        <div
                            className="border-l-4 p-6 rounded-xl shadow-sm"
                            style={{ backgroundColor: '#fff0f4', borderColor: '#FC5185' }}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: '#ffe0e9' }}
                                >
                                    <svg className="w-5 h-5" style={{ color: '#FC5185' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold" style={{ color: '#FC5185' }}>Something went wrong</h3>
                                    <p style={{ color: '#FC5185', opacity: 0.8 }} className="mt-1">{error}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* No Results State */}
                {!loading && hasSearched && products.length === 0 && !error && (
                    <div className="text-center py-16">
                        <div className="inline-flex flex-col items-center gap-4">
                            <div
                                className="w-20 h-20 rounded-full flex items-center justify-center"
                                style={{ backgroundColor: '#e5e7eb' }}
                            >
                                <svg className="w-10 h-10" style={{ color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-lg font-semibold" style={{ color: '#364F6B' }}>No results found</p>
                                <p className="text-sm mt-1" style={{ color: '#364F6B', opacity: 0.6 }}>Try a different product name or brand</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {products.length > 0 && (
                    <div className="mt-8 space-y-12 max-w-7xl mx-auto">
                        {/* Product Image Card - Separate Container */}
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
                            <div className="flex flex-col lg:flex-row items-center gap-8">
                                {/* Product Image */}
                                <div className="lg:w-1/3 flex items-center justify-center">
                                    <div className="relative p-4">
                                        <img
                                            src={products[0].image}
                                            alt={products[0].title}
                                            className="relative max-h-64 w-auto object-contain hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                </div>

                                {/* Product Info */}
                                <div className="lg:w-2/3 text-center lg:text-left">
                                    <h2 className="text-3xl font-bold mb-3 leading-tight" style={{ color: '#364F6B' }}>
                                        {products[0].title}
                                    </h2>
                                    <p className="text-base flex items-center justify-center lg:justify-start gap-2 mb-4" style={{ color: '#364F6B', opacity: 0.6 }}>
                                        <svg className="w-5 h-5" style={{ color: '#3FC1C9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Comparing prices from {products.length} stores
                                    </p>

                                    {/* Best Price Highlight - Inline */}
                                    {products.length > 0 && products[0].price && (
                                        <div
                                            className="inline-flex items-center gap-4 border-2 rounded-2xl px-6 py-4"
                                            style={{ backgroundColor: '#ecfdf5', borderColor: '#10b981' }}
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xl">🎉</span>
                                                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: '#10b981' }}>
                                                        Best Deal
                                                    </p>
                                                </div>
                                                <p className="text-2xl font-bold" style={{ color: '#059669' }}>
                                                    {products[0].price}
                                                </p>
                                                <p className="text-sm" style={{ color: '#10b981', opacity: 0.8 }}>
                                                    at <span className="font-semibold">{products[0].source}</span>
                                                </p>
                                            </div>
                                            <a
                                                href={products[0].link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all duration-300 hover:opacity-90"
                                                style={{ backgroundColor: '#10b981' }}
                                            >
                                                <span>Buy Now</span>
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Price Comparison Card - Separate Container */}
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden p-8">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: '#364F6B' }}>
                                    <svg className="w-6 h-6" style={{ color: '#3FC1C9' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Price Comparison
                                </h3>
                                <p className="text-sm mt-1" style={{ color: '#364F6B', opacity: 0.6 }}>All prices from verified stores, sorted by lowest first</p>
                            </div>

                            <PriceTable products={products} />

                            <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: '#364F6B', opacity: 0.5 }}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Prices last updated: Just now
                            </div>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer */}
            <footer className="py-10 mt-16" style={{ backgroundColor: '#364F6B' }}>
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center"
                                style={{ backgroundColor: '#3FC1C9' }}
                            >
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-white">
                                Smart<span style={{ color: '#3FC1C9' }}>Price</span><span style={{ color: '#FC5185' }}>Finder</span>
                            </span>
                        </div>
                        <p className="text-sm" style={{ color: '#F5F5F5', opacity: 0.7 }}>
                            &copy; {new Date().getFullYear()} SmartPriceFinder. All rights reserved.
                        </p>
                        <div className="flex items-center gap-4">
                            <a href="#" className="transition-opacity hover:opacity-80" style={{ color: '#F5F5F5', opacity: 0.7 }}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                </svg>
                            </a>
                            <a href="#" className="transition-opacity hover:opacity-80" style={{ color: '#F5F5F5', opacity: 0.7 }}>
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                                </svg>
                            </a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

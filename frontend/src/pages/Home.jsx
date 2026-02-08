import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';
import Header from '../components/Header';
import PriceTable from '../components/PriceTable';
import { API_ENDPOINTS } from '../config/api';

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
            const response = await axios.get(`${API_ENDPOINTS.COMPARE}?q=${encodeURIComponent(query)}`);
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
        <div className="min-h-screen flex flex-col transition-colors duration-300" style={{ backgroundColor: 'var(--bg-primary)' }}>
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
                                <div className="w-16 h-16 border-4 rounded-full" style={{ borderColor: 'var(--border-color)' }}></div>
                                <div
                                    className="absolute top-0 left-0 w-16 h-16 border-4 border-t-transparent rounded-full animate-spin"
                                    style={{ borderColor: 'var(--accent-teal)', borderTopColor: 'transparent' }}
                                ></div>
                            </div>
                            <div>
                                <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Searching for the best deals...</p>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Comparing prices across multiple stores</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="max-w-xl mx-auto mb-8">
                        <div
                            className="border-l-4 p-6 rounded-xl shadow-sm"
                            style={{ backgroundColor: 'var(--error-bg)', borderColor: 'var(--accent-coral)' }}
                        >
                            <div className="flex items-start gap-3">
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                                    style={{ backgroundColor: 'var(--accent-coral)', opacity: 0.2 }}
                                >
                                    <svg className="w-5 h-5" style={{ color: 'var(--accent-coral)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold" style={{ color: 'var(--accent-coral)' }}>Something went wrong</h3>
                                    <p style={{ color: 'var(--accent-coral)', opacity: 0.8 }} className="mt-1">{error}</p>
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
                                style={{ backgroundColor: 'var(--border-color)' }}
                            >
                                <svg className="w-10 h-10" style={{ color: 'var(--text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>No results found</p>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>Try a different product name or brand</p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Results Section */}
                {products.length > 0 && (
                    <div className="mt-8 space-y-12 max-w-7xl mx-auto">
                        {/* Product Image Card - Separate Container */}
                        <div className="rounded-3xl shadow-xl overflow-hidden p-8 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-card)' }}>
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
                                    <h2 className="text-3xl font-bold mb-3 leading-tight" style={{ color: 'var(--text-primary)' }}>
                                        {products[0].title}
                                    </h2>
                                    <p className="text-base flex items-center justify-center lg:justify-start gap-2 mb-4" style={{ color: 'var(--text-secondary)' }}>
                                        <svg className="w-5 h-5" style={{ color: 'var(--accent-teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Comparing prices from {products.length} stores
                                    </p>

                                    {/* Best Price Highlight - Inline */}
                                    {products.length > 0 && products[0].price && (
                                        <div
                                            className="inline-flex items-center gap-4 border-2 rounded-2xl px-6 py-4"
                                            style={{ backgroundColor: 'var(--success-bg)', borderColor: 'var(--success)' }}
                                        >
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-xl"></span>
                                                    <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--success)' }}>
                                                        Best Deal
                                                    </p>
                                                </div>
                                                <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>
                                                    {products[0].price}
                                                </p>
                                                <p className="text-sm" style={{ color: 'var(--success)', opacity: 0.8 }}>
                                                    at <span className="font-semibold">{products[0].source}</span>
                                                </p>
                                            </div>
                                            <a
                                                href={products[0].link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-white font-bold px-6 py-3 rounded-xl flex items-center gap-2 shadow-lg transition-all duration-300 hover:opacity-90"
                                                style={{ backgroundColor: 'var(--success)' }}
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
                        <div className="rounded-3xl shadow-xl overflow-hidden p-8 transition-colors duration-300" style={{ backgroundColor: 'var(--bg-card)' }}>
                            <div className="mb-6">
                                <h3 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                                    <svg className="w-6 h-6" style={{ color: 'var(--accent-teal)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                    Price Comparison
                                </h3>
                                <p className="text-sm mt-1" style={{ color: 'var(--text-secondary)' }}>All prices from verified stores, sorted by lowest first</p>
                            </div>

                            <PriceTable products={products} />

                            <div className="mt-4 flex items-center gap-2 text-sm" style={{ color: 'var(--text-muted)' }}>
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
            <footer className="py-10 mt-16 transition-colors duration-300" style={{ backgroundColor: 'var(--footer-bg)' }}>
                <div className="container mx-auto px-4">
                    <div className="text-center">
                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                            &copy; {new Date().getFullYear()} SmartPriceFinder. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;

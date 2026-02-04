import React, { useState } from 'react';
import axios from 'axios';
import SearchBar from '../components/SearchBar';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (query) => {
        setLoading(true);
        setError(null);
        setProducts([]);
        setHasSearched(true);

        try {
            // Note: Ensure your backend is running on port 5000
            // Note: Ensure your backend is running on port 5001
            const response = await axios.get(`http://localhost:5001/api/compare?q=${encodeURIComponent(query)}`);
            setProducts(response.data);
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || err.response?.data?.details || err.message || 'Failed to fetch prices.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <header className="bg-white shadow-sm py-6">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-3xl font-extrabold text-blue-900 tracking-tight">
                        💰 PriceCompare
                    </h1>
                    <p className="text-gray-500 mt-2">Find the best deals across the web</p>
                </div>
            </header>

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="mb-12">
                    <SearchBar onSearch={handleSearch} />
                </div>

                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent"></div>
                        <p className="mt-4 text-gray-600">Searching specifically for the best prices...</p>
                    </div>
                )}

                {error && (
                    <div className="max-w-xl mx-auto bg-red-50 border-l-4 border-red-500 p-4 rounded mb-8">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {!loading && hasSearched && products.length === 0 && !error && (
                    <div className="text-center text-gray-500 py-12">
                        No results found. Try a different product name.
                    </div>
                )}

                {products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product, index) => (
                            <ProductCard
                                key={index}
                                product={product}
                                isCheapest={index === 0}
                            />
                        ))}
                    </div>
                )}
            </main>

            <footer className="bg-white border-t py-6 mt-12 text-center text-gray-400 text-sm">
                &copy; {new Date().getFullYear()} PriceCompare. All rights reserved.
            </footer>
        </div>
    );
};

export default Home;

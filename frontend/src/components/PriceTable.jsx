import React from 'react';

// Store logo URLs - US retailers (using local files for reliability)
const STORE_LOGOS = {
    'amazon': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    'walmart': '/walmart_logo.svg',
    'ebay': '/ebay_logo.svg',
    'bestbuy': 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg',
    'best buy': 'https://upload.wikimedia.org/wikipedia/commons/f/f5/Best_Buy_Logo.svg',
    'target': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Target_logo.svg',
    'costco': 'https://upload.wikimedia.org/wikipedia/commons/5/59/Costco_Wholesale_logo_2010-10-26.svg',
};

const getStoreLogo = (source, productLogo) => {
    const lowerSource = source.toLowerCase();

    // First check our local mapping
    for (const [key, url] of Object.entries(STORE_LOGOS)) {
        if (lowerSource.includes(key)) {
            return url;
        }
    }

    // If no match, use the logo from the API if available
    if (productLogo && productLogo.startsWith('http')) {
        return productLogo;
    }

    return null;
};

const PriceTable = ({ products }) => {
    const lowestPrice = products.length > 0 ? products[0].extracted_price : 0;

    const calculateSavings = (price) => {
        const savings = price - lowestPrice;
        return savings > 0 ? `+₹${Math.round(savings)}` : null;
    };

    return (
        <div className="space-y-3">
            {/* Mobile/Tablet Card Layout */}
            <div className="block lg:hidden space-y-3">
                {products.map((product, index) => {
                    const isBestDeal = index === 0;
                    const savings = calculateSavings(product.extracted_price);
                    const storeLogo = getStoreLogo(product.source, product.logo);

                    return (
                        <div
                            key={index}
                            className="rounded-xl border-2 p-4 transition-all duration-300"
                            style={{
                                backgroundColor: isBestDeal ? 'var(--success-bg)' : 'var(--bg-card)',
                                borderColor: isBestDeal ? 'var(--success)' : 'var(--border-color)'
                            }}
                        >
                            {/* Store Header */}
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    {/* Store Logo */}
                                    <div className="w-10 h-10 flex items-center justify-center flex-shrink-0">
                                        {storeLogo ? (
                                            <img
                                                src={storeLogo}
                                                alt={product.source}
                                                className="max-w-full max-h-full object-contain"
                                                onError={(e) => { e.target.style.display = 'none'; }}
                                            />
                                        ) : (
                                            <div
                                                className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm text-white"
                                                style={{ backgroundColor: 'var(--accent-teal)' }}
                                            >
                                                {product.source.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                                            {product.source}
                                        </span>
                                        {isBestDeal && (
                                            <span
                                                className="ml-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                                                style={{ backgroundColor: 'var(--success)' }}
                                            >
                                                Best
                                            </span>
                                        )}
                                    </div>
                                </div>
                                {/* Savings Badge */}
                                {savings ? (
                                    <span
                                        className="text-xs font-semibold px-2 py-1 rounded-full"
                                        style={{ backgroundColor: 'var(--error-bg)', color: 'var(--accent-coral)' }}
                                    >
                                        {savings}
                                    </span>
                                ) : (
                                    <span
                                        className="text-xs font-bold px-2 py-1 rounded-full"
                                        style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}
                                    >
                                        Lowest!
                                    </span>
                                )}
                            </div>

                            {/* Price and Action Row */}
                            <div className="flex items-center justify-between">
                                <span
                                    className="text-2xl font-bold"
                                    style={{ color: isBestDeal ? 'var(--success)' : 'var(--text-primary)' }}
                                >
                                    {product.price}
                                </span>
                                <a
                                    href={product.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:opacity-90"
                                    style={{ backgroundColor: isBestDeal ? 'var(--success)' : 'var(--accent-teal)' }}
                                >
                                    <span>Buy</span>
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Desktop Table Layout */}
            <div
                className="hidden lg:block overflow-hidden rounded-2xl border shadow-lg transition-colors duration-300"
                style={{ backgroundColor: 'var(--bg-card)', borderColor: 'var(--border-color)' }}
            >
                <table className="min-w-full">
                    <thead>
                        <tr style={{ backgroundColor: 'var(--bg-secondary)' }}>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Store</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Price</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Savings</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-primary)' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y" style={{ '--tw-divide-color': 'var(--border-color)' }}>
                        {products.map((product, index) => {
                            const isBestDeal = index === 0;
                            const savings = calculateSavings(product.extracted_price);
                            const storeLogo = getStoreLogo(product.source, product.logo);

                            return (
                                <tr
                                    key={index}
                                    className="transition-all duration-200 group"
                                    style={{ backgroundColor: isBestDeal ? 'var(--success-bg)' : 'var(--bg-card)' }}
                                >
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex items-center justify-center">
                                                {storeLogo ? (
                                                    <img
                                                        src={storeLogo}
                                                        alt={product.source}
                                                        className="max-w-full max-h-full object-contain"
                                                        onError={(e) => { e.target.style.display = 'none'; }}
                                                    />
                                                ) : (
                                                    <div
                                                        className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                                                        style={{ backgroundColor: 'var(--accent-teal)' }}
                                                    >
                                                        {product.source.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                                                    {product.source}
                                                </span>
                                                {isBestDeal && (
                                                    <span
                                                        className="text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm flex items-center gap-1"
                                                        style={{ backgroundColor: 'var(--success)' }}
                                                    >
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        Best
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <span
                                            className="text-xl font-bold"
                                            style={{ color: isBestDeal ? 'var(--success)' : 'var(--text-primary)' }}
                                        >
                                            {product.price}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        {savings ? (
                                            <span
                                                className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full"
                                                style={{ backgroundColor: 'var(--error-bg)', color: 'var(--accent-coral)' }}
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                </svg>
                                                {savings}
                                            </span>
                                        ) : (
                                            <span
                                                className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full"
                                                style={{ backgroundColor: 'var(--success-bg)', color: 'var(--success)' }}
                                            >
                                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                </svg>
                                                Lowest!
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        <a
                                            href={product.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg hover:opacity-90"
                                            style={{ backgroundColor: isBestDeal ? 'var(--success)' : 'var(--accent-teal)' }}
                                        >
                                            <span>Buy Now</span>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                            </svg>
                                        </a>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default PriceTable;

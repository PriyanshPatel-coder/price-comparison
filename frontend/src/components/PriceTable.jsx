import React from 'react';

// Store logo URLs
const STORE_LOGOS = {
    'amazon': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    'flipkart': 'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png',
    'myntra': 'https://aartisto.com/wp-content/uploads/2020/11/myntra.png',
    'ajio': 'https://assets.ajio.com/static/img/Ajio-Logo.svg',
    'reliance': 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg',
    'tata': 'https://www.tatacliq.com/src/general/components/img/cliq-logo.svg',
    'nykaa': 'https://images-static.nykaa.com/uploads/18f5ca9e-f0db-46a7-9245-2436cd7da886.jpg',
    'snapdeal': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Snapdeal_logo.png',
};

const getStoreLogo = (source) => {
    const lowerSource = source.toLowerCase();
    for (const [key, url] of Object.entries(STORE_LOGOS)) {
        if (lowerSource.includes(key)) {
            return url;
        }
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
                    const storeLogo = getStoreLogo(product.source);

                    return (
                        <div
                            key={index}
                            className="rounded-xl border-2 p-4 transition-all duration-200"
                            style={{
                                backgroundColor: isBestDeal ? '#ecfdf5' : 'white',
                                borderColor: isBestDeal ? '#10b981' : '#e5e7eb'
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
                                                style={{ backgroundColor: '#3FC1C9' }}
                                            >
                                                {product.source.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <span className="text-base font-semibold" style={{ color: '#364F6B' }}>
                                            {product.source}
                                        </span>
                                        {isBestDeal && (
                                            <span
                                                className="ml-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase"
                                                style={{ backgroundColor: '#10b981' }}
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
                                        style={{ backgroundColor: '#fff0f4', color: '#FC5185' }}
                                    >
                                        {savings}
                                    </span>
                                ) : (
                                    <span
                                        className="text-xs font-bold px-2 py-1 rounded-full"
                                        style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}
                                    >
                                        Lowest!
                                    </span>
                                )}
                            </div>

                            {/* Price and Action Row */}
                            <div className="flex items-center justify-between">
                                <span
                                    className="text-2xl font-bold"
                                    style={{ color: isBestDeal ? '#10b981' : '#364F6B' }}
                                >
                                    {product.price}
                                </span>
                                <a
                                    href={product.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-300 hover:opacity-90"
                                    style={{ backgroundColor: isBestDeal ? '#10b981' : '#3FC1C9' }}
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
            <div className="hidden lg:block overflow-hidden rounded-2xl border shadow-lg bg-white" style={{ borderColor: '#e5e7eb' }}>
                <table className="min-w-full">
                    <thead>
                        <tr style={{ backgroundColor: '#F5F5F5' }}>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#364F6B' }}>Store</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#364F6B' }}>Price</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#364F6B' }}>Savings</th>
                            <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-wider" style={{ color: '#364F6B' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y" style={{ '--tw-divide-opacity': 1, '--tw-divide-color': '#f3f4f6' }}>
                        {products.map((product, index) => {
                            const isBestDeal = index === 0;
                            const savings = calculateSavings(product.extracted_price);
                            const storeLogo = getStoreLogo(product.source);

                            return (
                                <tr
                                    key={index}
                                    className="transition-all duration-200 group hover:bg-gray-50"
                                    style={{ backgroundColor: isBestDeal ? '#ecfdf5' : 'white' }}
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
                                                        style={{ backgroundColor: '#3FC1C9' }}
                                                    >
                                                        {product.source.charAt(0).toUpperCase()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-base font-semibold" style={{ color: '#364F6B' }}>
                                                    {product.source}
                                                </span>
                                                {isBestDeal && (
                                                    <span
                                                        className="text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide shadow-sm flex items-center gap-1"
                                                        style={{ backgroundColor: '#10b981' }}
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
                                            style={{ color: isBestDeal ? '#10b981' : '#364F6B' }}
                                        >
                                            {product.price}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 whitespace-nowrap">
                                        {savings ? (
                                            <span
                                                className="inline-flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full"
                                                style={{ backgroundColor: '#fff0f4', color: '#FC5185' }}
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                </svg>
                                                {savings}
                                            </span>
                                        ) : (
                                            <span
                                                className="inline-flex items-center gap-1 text-sm font-bold px-3 py-1 rounded-full"
                                                style={{ backgroundColor: '#ecfdf5', color: '#10b981' }}
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
                                            style={{ backgroundColor: isBestDeal ? '#10b981' : '#3FC1C9' }}
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

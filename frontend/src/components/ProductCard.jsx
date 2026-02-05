import React from 'react';

// Store logo URLs - using reliable CDN sources
const STORE_LOGOS = {
    'amazon': 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg',
    'flipkart': 'https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/flipkart-plus_8d85f4.png',
    'myntra': 'https://aartisto.com/wp-content/uploads/2020/11/myntra.png',
    'ajio': 'https://assets.ajio.com/static/img/Ajio-Logo.svg',
    'reliance': 'https://www.reliancedigital.in/build/client/images/loaders/rd_logo.svg',
    'tata': 'https://www.tatacliq.com/src/general/components/img/cliq-logo.svg',
    'nykaa': 'https://images-static.nykaa.com/uploads/18f5ca9e-f0db-46a7-9245-2436cd7da886.jpg',
    'snapdeal': 'https://upload.wikimedia.org/wikipedia/commons/9/9a/Snapdeal_logo.png',
    'meesho': 'https://images.meesho.com/images/pow/meesho_logo.svg',
    'jiomart': 'https://www.jiomart.com/assets/ds2web/jds-icons/jiomart-logo.svg',
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

const getStoreColor = (source) => {
    const lowerSource = source.toLowerCase();
    if (lowerSource.includes('amazon')) return { bg: 'from-orange-50 to-yellow-50', border: 'border-orange-200', text: 'text-orange-600' };
    if (lowerSource.includes('flipkart')) return { bg: 'from-blue-50 to-indigo-50', border: 'border-blue-200', text: 'text-blue-600' };
    if (lowerSource.includes('myntra')) return { bg: 'from-pink-50 to-rose-50', border: 'border-pink-200', text: 'text-pink-600' };
    if (lowerSource.includes('ajio')) return { bg: 'from-purple-50 to-violet-50', border: 'border-purple-200', text: 'text-purple-600' };
    if (lowerSource.includes('reliance')) return { bg: 'from-red-50 to-rose-50', border: 'border-red-200', text: 'text-red-600' };
    if (lowerSource.includes('tata')) return { bg: 'from-indigo-50 to-blue-50', border: 'border-indigo-200', text: 'text-indigo-600' };
    if (lowerSource.includes('nykaa')) return { bg: 'from-fuchsia-50 to-pink-50', border: 'border-fuchsia-200', text: 'text-fuchsia-600' };
    return { bg: 'from-gray-50 to-slate-50', border: 'border-gray-200', text: 'text-gray-700' };
};

const ProductCard = ({ product, isBestDeal = false }) => {
    const storeLogo = getStoreLogo(product.source);
    const storeColors = getStoreColor(product.source);

    return (
        <div className={`
            relative bg-gradient-to-br ${storeColors.bg} rounded-2xl border-2 ${storeColors.border}
            p-6 flex flex-col items-center justify-between 
            hover:shadow-xl hover:scale-[1.02] transition-all duration-300 h-full
            ${isBestDeal ? 'ring-2 ring-success shadow-glow-success' : ''}
        `}>
            {/* Best Deal Badge */}
            {isBestDeal && (
                <div className="absolute -top-3 -right-3 bg-gradient-to-r from-success to-accent-teal text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Best Deal
                </div>
            )}

            {/* Store Logo */}
            <div className="h-16 w-full flex items-center justify-center mb-5">
                {storeLogo ? (
                    <img
                        src={storeLogo}
                        alt={product.source}
                        className="max-h-full max-w-[140px] object-contain"
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                    />
                ) : null}
                <span
                    className={`text-xl font-bold ${storeColors.text} ${storeLogo ? 'hidden' : 'flex'}`}
                >
                    {product.source}
                </span>
            </div>

            {/* Product Info */}
            <div className="text-center w-full space-y-4">
                <div>
                    <p className={`text-3xl font-bold ${isBestDeal ? 'text-success' : 'text-gray-900'}`}>
                        {product.price}
                    </p>
                    {isBestDeal && (
                        <p className="text-success text-sm font-medium mt-1">Lowest Price!</p>
                    )}
                </div>
                <a
                    href={product.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                        block w-full py-3 rounded-xl font-semibold transition-all duration-300 
                        shadow-sm hover:shadow-md
                        ${isBestDeal
                            ? 'btn-success-gradient text-white'
                            : 'btn-gradient text-white'
                        }
                    `}
                >
                    Buy Now
                    <span className="ml-1">→</span>
                </a>
            </div>
        </div>
    );
};

export default ProductCard;

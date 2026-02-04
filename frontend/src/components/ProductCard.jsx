import React from 'react';

const ProductCard = ({ product, isCheapest }) => {
    return (
        <div className={`relative bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border ${isCheapest ? 'border-green-500 ring-2 ring-green-100' : 'border-gray-100'}`}>
            {isCheapest && (
                <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg z-10">
                    Best Price
                </div>
            )}

            <div className="h-48 overflow-hidden p-4 flex items-center justify-center bg-gray-50">
                <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full object-contain mix-blend-multiply"
                />
            </div>

            <div className="p-4">
                <p className="text-sm text-gray-500 mb-1">{product.source}</p>
                <h3 className="font-semibold text-gray-800 line-clamp-2 mb-2 h-12" title={product.title}>
                    {product.title}
                </h3>

                <div className="flex items-end justify-between mt-4">
                    <span className={`text-xl font-bold ${isCheapest ? 'text-green-600' : 'text-gray-900'}`}>
                        {product.price}
                    </span>
                    <a
                        href={product.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                        View Deal &rarr;
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

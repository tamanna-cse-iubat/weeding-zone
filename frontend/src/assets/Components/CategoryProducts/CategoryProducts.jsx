import React from 'react';
import { useLoaderData, useParams } from 'react-router';
import ProductsCard from '../ProductCard/ProductsCard';

const CategoryProducts = () => {
    const products = useLoaderData();
    const { categoryName } = useParams();
    
    // Filter by category, type, or occasion (case-insensitive)
    const filteredProducts = products.filter(product => 
        product.category.toLowerCase() === categoryName.toLowerCase() ||
        product.type.toLowerCase() === categoryName.toLowerCase() ||
        product.occasion.toLowerCase() === categoryName.toLowerCase()
    );

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-extrabold text-accent capitalize mb-4 tracking-tight">
                        {categoryName} <span className="text-gray-400 font-light text-3xl">Collection</span>
                    </h1>
                    <div className="h-1 w-24 bg-accent mx-auto rounded-full opacity-50"></div>
                </div>

                {filteredProducts.length > 0 ? (
                    <ProductsCard productsData={filteredProducts} />
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="bg-gray-100 p-6 rounded-full mb-6">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Products Found</h3>
                        <p className="text-gray-500 max-w-md text-center">
                            We couldn't find any products in the <span className="font-bold text-accent">"{categoryName}"</span> category at the moment.
                        </p>
                        <button 
                            onClick={() => window.history.back()}
                            className="mt-8 px-6 py-2 bg-accent text-white rounded-lg hover:brightness-110 transition-all shadow-md"
                        >
                            Go Back
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CategoryProducts;

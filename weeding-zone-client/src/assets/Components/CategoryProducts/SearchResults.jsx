import React from 'react';
import { useLoaderData, useParams } from 'react-router';
import ProductsCard from '../ProductCard/ProductsCard';
import { Search } from 'lucide-react';

const SearchResults = () => {
    const products = useLoaderData();
    const { query } = useParams();
    
    // Filter by name, category, type, or occasion (case-insensitive)
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.category.toLowerCase().includes(query.toLowerCase()) ||
        product.type.toLowerCase().includes(query.toLowerCase()) ||
        product.occasion.toLowerCase().includes(query.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50">
            <div className="container mx-auto px-4 py-12">
                <div className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <Search className="size-8 text-accent" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 tracking-tight">
                            Search Results
                        </h1>
                    </div>
                    <p className="text-gray-500 text-lg">
                        Showing results for <span className="text-accent font-bold italic">"{query}"</span>
                    </p>
                    <div className="h-1 w-24 bg-accent mx-auto mt-6 rounded-full opacity-50"></div>
                </div>

                {filteredProducts.length > 0 ? (
                    <div>
                        <p className="mb-8 text-gray-400 font-medium">{filteredProducts.length} items found</p>
                        <ProductsCard productsData={filteredProducts} />
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="bg-gray-100 p-8 rounded-full mb-6">
                            <Search className="h-12 w-12 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-700 mb-2">No Match Found</h3>
                        <p className="text-gray-500 max-w-md text-center">
                            We couldn't find anything matching <span className="font-bold text-accent">"{query}"</span>. 
                            Try checking your spelling or using more general terms.
                        </p>
                        <button 
                            onClick={() => window.history.back()}
                            className="mt-8 px-8 py-3 bg-accent text-white rounded-full font-bold hover:brightness-110 transition-all shadow-lg active:scale-95"
                        >
                            Try Another Search
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;

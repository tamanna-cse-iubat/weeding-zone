import React from 'react';
import ProductCard from './ProductCard';

const ProductsCard = ({ productsData }) => {
    
    return (
        
        <div className='my-10'>
            <h1 className='font-bold text-4xl text-accent my-5'>Our Best Collection</h1>
            <div className='grid md:grid-cols-3 gap-4 '>
                {
                    productsData.map(product => <ProductCard product={product} key={product.id}></ProductCard>)
                }
           </div>
        </div>
    );
};

export default ProductsCard;
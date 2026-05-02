import React from 'react';

const ProductCard = ({ product }) => {
    const { name, photoURL, category, type, occasion, rent_for_days, rent, size, stock } = product;
    
    return (
        
        <div>
            <div className="card bg-base-100 w-96 shadow-xl ">
                <figure className='h-96 shadow-sm'>
                    <img
                        src={photoURL}
                        alt="Shoes" />
                    
                    
                </figure>
                <div className="card-body">
                    <h2 className="card-title">
                        {name}
                        <div className="badge badge-secondary">NEW</div>
                    </h2>
                    <p>{occasion}</p>
                    <div className="card-actions justify-end">
                        <div className="badge badge-outline">Fashion</div>
                        <div className="badge badge-outline">Products</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
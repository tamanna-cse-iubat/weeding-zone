import React from 'react';

const ProductCard = () => {
    return (
        <div className='my-10'>
            <h1 className='font-bold text-4xl text-accent my-5'>Our Best Collection</h1>
            <div>
                <div className="card bg-base-100 w-96 shadow-sm">
                    <figure>
                        <img
                            src="https://i.ibb.co.com/wZbJ4z08/Traditional-Mojari-Shoes.jpg"
                            alt="Shoes" />
                    </figure>
                    <div className="card-body">
                        <h2 className="card-title">
                            Mojari Shoes
                            <div className="badge badge-secondary">NEW</div>
                        </h2>
                        <p>A card component has a figure, a body part, and inside body there are title and actions parts</p>
                        <div className="card-actions justify-end">
                            <div className="badge badge-outline">Fashion</div>
                            <div className="badge badge-outline">Products</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
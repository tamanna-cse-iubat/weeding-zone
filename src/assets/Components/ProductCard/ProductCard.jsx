import React from 'react';
import { Link } from 'react-router';

const ProductCard = ({ product }) => {
    const { name, photoURL, category, type, occasion, rent_for_days, rent, size, stock } = product;
    
    return (
        
        <div>
            <div className="card bg-base-100 w-96 shadow-xl ">
                <figure className='h-80 shadow-sm'>
                    <img
                        src={photoURL}
                        alt="Shoes" />
                    
                    
                </figure>
                <div className="card-body  ">
                    <h2 className="card-title justify-center bg-accent text-white py-1">
                        {name}
                     
                    </h2>
                    <div className='text-left'>
                        <p > Catagory: {occasion}</p>
                        <p> Rent: BDT-{rent}/{rent_for_days} Days.</p>
                        <p> Size: {size} </p>
                    </div>

                    <div className="card-actions justify-end">
                        <Link to={'/buy'}><button className='btn bg-accent md:btn-sm text-white skeleton'>Rent Now</button></Link>
                        <Link to={'/cart'}><button className='btn bg-accent md:btn-sm text-white skeleton'>Add to Cart</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
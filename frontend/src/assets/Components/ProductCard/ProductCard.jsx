import React, { useContext } from 'react';

import { AuthContext } from '../../../Provider/AuthProvider';
import { Link, useNavigate } from 'react-router';

const ProductCard = ({ product }) => {
    const { id, name, photoURL, category, type, occasion, rent_for_days, rent, size, stock } = product;
    const { cart, setCart } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleCart = (cartProduct) => {
        const exists = cart.find(item => item.id === cartProduct.id);

        if (exists) {
            alert("Already added to cart");
            return;
        }

        setCart(prev => [...prev, cartProduct]);
        navigate('/cart');
    };
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
                        <p > Catagory: {category}</p>
                        <p > Type: {type}</p>
                        <p > Occassion: {occasion}</p>
                        
                        <p> Size: {size} </p>
                        <h3 className='my-2 font-semibold text-sm text-accent'> Rent: BDT-{rent}/{rent_for_days} Days.</h3>
                    </div>

                    <div className="card-actions justify-end">
                        <button onClick={() => handleCart(product)} className='btn bg-accent md:btn-sm text-white skeleton'>Rent Now</button>
                        <Link to={`/product/${id}`}><button className='btn bg-accent md:btn-sm text-white skeleton'>View Details</button></Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
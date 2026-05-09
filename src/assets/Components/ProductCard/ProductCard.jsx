import React, { useContext } from 'react';

import { AuthContext } from '../../../Provider/AuthProvider';
import { Link, useNavigate } from 'react-router';
import { Heart } from 'lucide-react';
import Swal from 'sweetalert2';

const ProductCard = ({ product }) => {
    const { id, name, photoURL, category, type, occasion, rent_for_days, rent, size, stock } = product;
    const { cart, setCart, wishlist, setWishlist } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const isWishlisted = wishlist.some(item => item.id === id);

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (isWishlisted) {
            setWishlist(prev => prev.filter(item => item.id !== id));
        } else {
            setWishlist(prev => [...prev, product]);
        }
    };

    const handleCart = (cartProduct) => {
        const exists = cart.find(item => item.id === cartProduct.id);

        if (exists) {
            Swal.fire({
                title: "Already in Cart",
                text: "You have already added this item to your cart.",
                icon: "info",
                confirmButtonColor: "#6A0D25"
            });
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
                        alt={name} />
                    
                    <button 
                        onClick={handleWishlist}
                        className="absolute top-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-all group z-10"
                    >
                        <Heart 
                            className={`size-5 transition-colors ${isWishlisted ? 'fill-accent text-accent' : 'text-gray-600 group-hover:text-accent'}`} 
                        />
                    </button>
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
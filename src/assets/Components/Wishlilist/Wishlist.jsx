import React, { useContext } from 'react';
import { AuthContext } from '../../../Provider/AuthProvider';
import { Link, useNavigate } from 'react-router';
import { Heart, ShoppingBag, Trash2, ArrowLeft, Info } from 'lucide-react';
import Swal from 'sweetalert2';

const Wishlist = () => {
    const { wishlist, setWishlist, cart, setCart } = useContext(AuthContext);
    const navigate = useNavigate();

    const removeFromWishlist = (id) => {
        setWishlist(prev => prev.filter(item => item.id !== id));
    };

    const addToCart = (product) => {
        const exists = cart.find(item => item.id === product.id);
        if (exists) {
            Swal.fire({
                title: "Already in Cart",
                text: "This item is already in your shopping cart.",
                icon: "info",
                confirmButtonColor: "#6A0D25"
            });
            return;
        }
        setCart(prev => [...prev, product]);
        Swal.fire({
            title: "Added to Cart!",
            text: "The item has been added successfully.",
            icon: "success",
            timer: 2000,
            showConfirmButton: false
        });
    };

    if (wishlist.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 bg-gray-50">
                <div className="bg-white p-10 rounded-2xl shadow-sm text-center max-w-md w-full border border-gray-100">
                    <div className="bg-rose-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Heart className="size-10 text-accent opacity-20" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-2 font-serif">Your Wishlist is Empty</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        It seems you haven't added any premium outfits to your favorites yet. Start exploring our collections!
                    </p>
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 bg-accent text-white px-8 py-3 rounded-full font-semibold hover:bg-[#5E0B15] transition-all shadow-md hover:shadow-lg active:scale-95"
                    >
                        <ShoppingBag className="size-5" />
                        Explore Products
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 border-b border-gray-200 pb-8">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-accent mb-2">My Favorites</h1>
                        <p className="text-gray-500">You have {wishlist.length} item{wishlist.length > 1 ? 's' : ''} saved in your wishlist</p>
                    </div>
                    <Link 
                        to="/" 
                        className="inline-flex items-center gap-2 text-accent font-semibold hover:underline"
                    >
                        <ArrowLeft className="size-4" />
                        Continue Shopping
                    </Link>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {wishlist.map((item) => (
                        <div 
                            key={item.id} 
                            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 group hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                        >
                            {/* Image Container */}
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img 
                                    src={item.photoURL} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <button 
                                    onClick={() => removeFromWishlist(item.id)}
                                    className="absolute top-4 right-4 p-2 bg-white/90 hover:bg-white text-gray-500 hover:text-red-500 rounded-full shadow-md backdrop-blur-sm transition-all"
                                    title="Remove from favorites"
                                >
                                    <Trash2 className="size-5" />
                                </button>
                                <div className="absolute bottom-4 left-4">
                                    <span className="bg-accent/90 text-white text-[10px] font-bold px-3 py-1 rounded-full backdrop-blur-sm uppercase tracking-wider">
                                        {item.category}
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="mb-4">
                                    <h3 className="text-xl font-serif font-bold text-gray-800 mb-1 group-hover:text-accent transition-colors line-clamp-1">
                                        {item.name}
                                    </h3>
                                    <p className="text-sm text-gray-500 flex items-center gap-1">
                                        <Info className="size-3" />
                                        {item.type} • {item.occasion}
                                    </p>
                                </div>

                                <div className="mt-auto">
                                    <div className="flex items-baseline gap-1 mb-6">
                                        <span className="text-2xl font-bold text-accent">৳ {item.rent.toLocaleString()}</span>
                                        <span className="text-xs text-gray-400">/ {item.rent_for_days} Days</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => addToCart(item)}
                                            className="flex items-center justify-center gap-2 bg-accent text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-[#5E0B15] transition-colors shadow-sm"
                                        >
                                            <ShoppingBag className="size-4" />
                                            Rent Now
                                        </button>
                                        <Link 
                                            to={`/product/${item.id}`}
                                            className="flex items-center justify-center gap-2 bg-gray-50 text-gray-700 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-100 transition-colors border border-gray-200"
                                        >
                                            Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Promotion Section */}
                
            </div>
        </div>
    );
};

export default Wishlist;
import React, { useContext, useState } from 'react';
import Swal from 'sweetalert2';
import { Link, useLoaderData, useNavigate } from 'react-router';
import { 
    HomeIcon, 
    ChevronRightIcon, 
    ChevronLeftIcon,
    ShoppingCartIcon,
    HeartIcon
} from '@heroicons/react/24/outline';
import {
    StarIcon as StarIconSolid,
    CheckCircleIcon,
    CalendarIcon,
    TruckIcon,
    ArrowPathIcon,
    ShieldCheckIcon,
    StarIcon as StarBadgeIcon
} from '@heroicons/react/24/solid';
import { AuthContext } from '../../../Provider/AuthProvider';

const ProductDetails = () => {
    const productDetails = useLoaderData();
    const { id, name, photoURL, category, type, occasion, rent_for_days, rent, size } = productDetails;
    
    // Default selected size to the first available size
    const [selectedSize, setSelectedSize] = useState(size && size.length > 0 ? size[0] : "");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [activeImage, setActiveImage] = useState(photoURL);

    // Mocking thumbnails with the same image since data only has one
    const thumbnails = [photoURL, photoURL, photoURL, photoURL];

    const { cart, setCart, wishlist, setWishlist } = useContext(AuthContext);
    const navigate = useNavigate();

    const isWishlisted = wishlist.some(item => item.id === id);

    const handleWishlist = () => {
        if (isWishlisted) {
            setWishlist(prev => prev.filter(item => item.id !== id));
        } else {
            setWishlist(prev => [...prev, productDetails]);
        }
    };

    const handleCart = (cartProduct) => {
        const exists = cart.find(item => item.id === cartProduct.id);

        if (exists) {
            Swal.fire({
                title: "Already in Cart",
                text: "This item is already waiting for you in the cart.",
                icon: "info",
                confirmButtonColor: "#6A0D25"
            });
            return;
        }

        setCart(prev => [...prev, cartProduct]);
        navigate('/cart');
    };

    // calculate end date (3 days)
    const handleDateChange = (date) => {
        setStartDate(date);

        if (date) {
            const start = new Date(date);
            const end = new Date(start);
            end.setDate(start.getDate() + 3);
            
            // Format to DD MMM YYYY for display
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            setEndDate(end.toLocaleDateString('en-GB', options));
        } else {
            setEndDate("");
        }
    };

    const totalPrice = rent * 3; // The design shows Total Amount as price * days. The label says Total Amount 7,500 (2500 * 3)

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans">
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <nav className="flex items-center text-sm text-gray-500 space-x-2">
                    <Link to="/" className="hover:text-gray-900">
                        <HomeIcon className="h-4 w-4" />
                    </Link>
                    <ChevronRightIcon className="h-4 w-4" />
                    <Link to={`/${category.toLowerCase()}`} className="hover:text-gray-900">{category}</Link>
                    <ChevronRightIcon className="h-4 w-4" />
                    <span className="hover:text-gray-900 cursor-pointer">{type}</span>
                    <ChevronRightIcon className="h-4 w-4" />
                    <span className="text-accent font-medium">{name}</span>
                </nav>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 lg:p-10 flex flex-col lg:flex-row gap-10">
                    
                    {/* LEFT: Image Gallery */}
                    <div className="w-full lg:w-1/2 flex flex-col gap-4">
                        {/* Main Image */}
                        <div className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden bg-gray-100 group">
                            <img
                                src={activeImage}
                                alt={name}
                                className="w-full h-full object-cover object-top"
                            />
                            {/* Navigation Arrows */}
                            <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-800 transition opacity-0 group-hover:opacity-100">
                                <ChevronLeftIcon className="h-6 w-6" />
                            </button>
                            <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-800 transition opacity-0 group-hover:opacity-100">
                                <ChevronRightIcon className="h-6 w-6" />
                            </button>
                        </div>
                        {/* Thumbnails */}
                        <div className="flex gap-4 overflow-x-auto pb-2">
                            {thumbnails.map((thumb, index) => (
                                <button 
                                    key={index}
                                    onClick={() => setActiveImage(thumb)}
                                    className={`relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition ${activeImage === thumb ? 'border-[#6A0D25]' : 'border-transparent hover:border-gray-200'}`}
                                >
                                    <img src={thumb} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover object-top" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT: Product Details */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        
                        {/* Collection Badge */}
                        <div className="mb-3">
                            <span className="inline-block bg-[#FDF8E7] text-[#B88E2F] text-xs font-bold px-3 py-1 rounded uppercase tracking-wide">
                                {category.toUpperCase()} COLLECTION
                            </span>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl md:text-4xl font-serif text-accent font-bold mb-3">
                            {name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-4">
                            <div className="flex text-[#F5C518]">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <StarIconSolid key={star} className="h-5 w-5" />
                                ))}
                            </div>
                            <span className="text-sm text-gray-600 font-medium">4.8 (128 reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-3xl font-bold text-accent">৳ {rent.toLocaleString()}</span>
                            <span className="text-gray-500">/ day</span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-600 mb-6 text-sm md:text-base leading-relaxed">
                            Elegant {name.toLowerCase()} with exquisite detailing. 
                            Perfect for your special {occasion ? occasion.toLowerCase() : 'day'}. 
                            Made with premium quality fabric to ensure comfort and style.
                        </p>

                        <hr className="border-gray-200 mb-6" />

                        {/* Size Selection */}
                        <div className="mb-6">
                            <p className="text-gray-800 font-medium mb-3">Select Size</p>
                            <div className="flex flex-wrap gap-3">
                                {size.map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setSelectedSize(s)}
                                        className={`min-w-[3rem] px-4 py-2 rounded-lg border font-medium transition ${
                                            selectedSize === s
                                            ? "bg-accent text-white border-accent"
                                                : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
                                        }`}
                                    >
                                        {s}
                                    </button>
                                ))}
                                <button className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 font-medium hover:border-gray-400 transition">
                                    Custom
                                </button>
                            </div>
                        </div>

                        {/* Rental Duration */}
                        <div className="mb-6">
                            <p className="text-accent font-bold mb-3">Rental Duration ({rent_for_days} Days)</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                                    <div className="relative">
                                        <input
                                            type="date"
                                            className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-[#6A0D25] focus:ring-1 focus:ring-[#6A0D25] appearance-none"
                                            onChange={(e) => handleDateChange(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-600 mb-1">Return Date (After {rent_for_days} Days)</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            readOnly
                                            value={endDate}
                                            placeholder="DD MMM YYYY"
                                            className="w-full border border-transparent bg-[#F9F5F0] rounded-lg py-2.5 px-4 text-gray-500 cursor-not-allowed focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            {/* Alert */}
                            <div className="bg-[#EAF5ED] text-[#2D7A46] px-4 py-3 rounded-lg flex items-center gap-2 text-sm font-medium">
                                <CheckCircleIcon className="h-5 w-5 flex-shrink-0" />
                                <p>You will get this outfit for {rent_for_days} days.</p>
                            </div>
                        </div>

                        {/* Price Summary */}
                        <div className="bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl p-5 flex justify-between items-center mb-8">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-1">Price (Per Day)</p>
                                <p className="font-semibold text-gray-800">৳ {rent.toLocaleString()}</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200"></div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-1">Rental Days</p>
                                <p className="font-semibold text-gray-800">{rent_for_days} Days</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200"></div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 mb-1">Total Amount</p>
                                <p className="text-xl font-bold text-accent">৳ {totalPrice.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                            <button onClick={()=>{handleCart(productDetails)}} className="flex items-center justify-center gap-2 bg-accent skeleton hover:bg-[#5E0B15] text-white py-3.5 px-6 rounded-lg font-semibold transition shadow-sm">
                                <ShoppingCartIcon className="h-5 w-5" />
                                Add to Cart
                            </button>
                            <button 
                                onClick={handleWishlist}
                                className={`flex items-center justify-center gap-2 border py-3.5 px-6 rounded-lg font-semibold transition shadow-sm ${
                                    isWishlisted 
                                    ? "bg-accent text-white border-accent" 
                                    : "bg-white border-accent text-accent hover:bg-[#FDFBF7]"
                                }`}
                            >
                                <HeartIcon className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                                {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                            </button>
                        </div>

                        {/* Features List */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto border-t border-gray-100 pt-6">
                            <div className="flex flex-col items-center justify-center text-center gap-2 p-2 rounded-lg bg-gray-50">
                                <div className="bg-orange-100 text-accent p-2 rounded-full">
                                    <TruckIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Free Delivery</p>
                                    <p className="text-[10px] text-gray-500">On all orders</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center gap-2 p-2 rounded-lg bg-gray-50">
                                <div className="bg-orange-100 text-accent p-2 rounded-full">
                                    <ArrowPathIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Easy Returns</p>
                                    <p className="text-[10px] text-gray-500">Within 7 days</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center gap-2 p-2 rounded-lg bg-gray-50">
                                <div className="bg-orange-100 text-accent p-2 rounded-full">
                                    <ShieldCheckIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Secure Payment</p>
                                    <p className="text-[10px] text-gray-500">100% secure</p>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center text-center gap-2 p-2 rounded-lg bg-gray-50">
                                <div className="bg-orange-100 text-accent p-2 rounded-full">
                                    <StarBadgeIcon className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-xs font-semibold text-gray-800">Best Quality</p>
                                    <p className="text-[10px] text-gray-500">Premium outfits</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
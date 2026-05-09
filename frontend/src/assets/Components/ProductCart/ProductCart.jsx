import React, { useContext, useState } from "react";
import Swal from 'sweetalert2';
import { useNavigate, Link } from "react-router";
import { AuthContext } from "../../../Provider/AuthProvider";
import { 
    HomeIcon, 
    ChevronRightIcon, 
    ChevronLeftIcon,
    TrashIcon,
} from '@heroicons/react/24/outline';
import {
    UserIcon,
    SparklesIcon,
    HeartIcon,
    RectangleGroupIcon,
    CalendarIcon,
    LockClosedIcon,
    TagIcon,
    TruckIcon,
    ArrowPathIcon,
    ShieldCheckIcon,
    StarIcon as StarBadgeIcon
} from '@heroicons/react/24/solid';

const CartItem = ({ item, handleRemove, onDurationSelect }) => {
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [isSelected, setIsSelected] = useState(false);

    // exact code from product details page
    const handleDateChange = (date) => {
        setStartDate(date);

        if (date) {
            const start = new Date(date);
            const end = new Date(start);
            end.setDate(start.getDate() + (item.rent_for_days || 3));
            
            // Format to DD MMM YYYY for display
            const options = { day: 'numeric', month: 'short', year: 'numeric' };
            setEndDate(end.toLocaleDateString('en-GB', options));
        } else {
            setEndDate("");
            if (isSelected) {
                setIsSelected(false);
                onDurationSelect(item.id, false);
            }
        }
    };

    const toggleSelection = () => {
        if (!startDate) {
            Swal.fire({
                title: "Date Required",
                text: "Please select a start date before selecting the duration.",
                icon: "warning",
                confirmButtonColor: "#6A0D25"
            });
            return;
        }
        const nextState = !isSelected;
        setIsSelected(nextState);
        onDurationSelect(item.id, nextState);
    };

    return (
        <div className="flex flex-col md:flex-row gap-6 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 relative">
            {/* Image */}
            <div className="w-full md:w-48 h-48 flex-shrink-0">
                <img
                    src={item.photoURL}
                    alt={item.name}
                    className="w-full h-full object-cover rounded-xl"
                />
            </div>

            {/* Details */}
            <div className="flex-1 flex flex-col justify-between">
                
                <div>
                    <div className="flex justify-between items-start mb-3">
                        <h2 className="text-2xl font-serif font-bold text-accent">{item.name}</h2>
                        <div className="text-right">
                            <span className="text-xl font-bold text-accent">
                                ৳ {(item.rent * (item.rent_for_days || 3)).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    {/* Info Badges */}
                    <div className="flex flex-wrap gap-x-6 gap-y-3 mb-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1.5">
                            <UserIcon className="h-4 w-4 text-[#B88E2F]" />
                            <span>Category: {item.category}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <SparklesIcon className="h-4 w-4 text-[#B88E2F]" />
                            <span>Type: {item.type}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <HeartIcon className="h-4 w-4 text-[#B88E2F]" />
                            <span>Occasion: {item.occasion}</span>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 w-full sm:w-auto">
                            <RectangleGroupIcon className="h-4 w-4 text-[#B88E2F]" />
                            <span>Size: {item.size && item.size.length > 0 ? item.size[0] : 'Free Size'}</span>
                        </div>
                    </div>
                </div>

                {/* Rental Duration (exact code from ProductDetails.jsx) */}
                <div className="mb-4 bg-[#FDFBF7] p-4 rounded-xl border border-[#F2ECE4]">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-accent font-bold">Rental Duration ({item.rent_for_days || 3} Days)</p>
                        <button 
                            onClick={toggleSelection}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ${
                                isSelected 
                                ? "bg-accent text-white shadow-md scale-105" 
                                : "bg-white border border-accent text-accent hover:bg-rose-50"
                            }`}
                        >
                            {isSelected ? "Selected ✓" : "Select Duration"}
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                            <div className="relative">
                                <input
                                    type="date"
                                    className="w-full border border-gray-300 bg-white rounded-lg py-2 px-3 text-sm text-gray-700 focus:outline-none focus:border-[#6A0D25] focus:ring-1 focus:ring-[#6A0D25] appearance-none"
                                    onChange={(e) => handleDateChange(e.target.value)}
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-600 mb-1">Return Date (After {item.rent_for_days || 3} Days)</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    readOnly
                                    value={endDate}
                                    placeholder="DD MMM YYYY"
                                    className="w-full border border-transparent bg-[#F9F5F0] rounded-lg py-2 px-3 text-sm text-gray-500 cursor-not-allowed focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Remove */}
                <div className="flex justify-end">
                    {/* Remove Button */}
                    <button
                        onClick={() => handleRemove(item.id)}
                        className="flex items-center gap-1.5 text-[#C93B3B] bg-[#FFF5F5] hover:bg-[#FFEBEB] px-4 py-2 rounded-lg text-sm font-semibold transition"
                    >
                        <TrashIcon className="h-4 w-4" />
                        Remove
                    </button>
                </div>

            </div>
        </div>
    );
};


const Cart = () => {
    const { cart, setCart } = useContext(AuthContext);
    const navigate = useNavigate();
    const [selectedDurations, setSelectedDurations] = useState({});

    const handleDurationSelect = (id, isSelected) => {
        setSelectedDurations(prev => ({
            ...prev,
            [id]: isSelected
        }));
    };

    // remove item
    const handleRemove = (id) => {
        const updated = cart.filter((item) => item.id !== id);
        setCart(updated);
        // Also remove from selectedDurations
        const newSelected = { ...selectedDurations };
        delete newSelected[id];
        setSelectedDurations(newSelected);
    };

    // total price
    const total = cart.reduce((sum, item) => {
        return sum + item.rent * (item.rent_for_days || 3);
    }, 0);

    // total days
    const totalDays = cart.reduce((sum, item) => {
        return sum + (item.rent_for_days || 3);
    }, 0);

    const isAllSelected = cart.length > 0 && cart.every(item => selectedDurations[item.id]);

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans pb-16">
            
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <nav className="flex items-center text-sm text-gray-500 space-x-2">
                    <Link to="/" className="hover:text-gray-900 flex items-center gap-1">
                        Home
                    </Link>
                    <ChevronRightIcon className="h-4 w-4" />
                    <span className="text-accent font-medium">Cart</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-accent">
                    Your Rental Cart ({cart.length})
                </h1>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                        <p className="text-gray-500 text-lg mb-6">Your cart is empty.</p>
                        <button 
                            onClick={() => navigate("/")}
                            className="bg-accent skeleton hover:bg-[#5E0B15] text-white py-3 px-8 rounded-lg font-semibold transition"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* LEFT: Cart Items */}
                        <div className="w-full lg:w-2/3 space-y-6">
                            {cart.map((item) => (
                                <CartItem 
                                    key={item.id} 
                                    item={item} 
                                    handleRemove={handleRemove} 
                                    onDurationSelect={handleDurationSelect}
                                />
                            ))}

                            {/* Continue Shopping */}
                            <div className="pt-4">
                                <button 
                                    onClick={() => navigate("/")}
                                        className="flex items-center gap-2 border border-accent text-accent hover:bg-[#FDFBF7] py-2.5 px-6 rounded-lg font-semibold transition bg-white"
                                >
                                    <ChevronLeftIcon className="h-4 w-4" />
                                    Continue Shopping
                                </button>
                            </div>
                        </div>

                        {/* RIGHT: Summary */}
                        <div className="w-full lg:w-1/3">
                                <div className="bg-accent text-white p-8 rounded-2xl shadow-md sticky top-6">
                                
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-serif font-bold text-white mb-2">Order Summary</h2>
                                    {/* Decorative divider */}
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-px w-8 bg-[#F5C518]/40"></div>
                                        <div className="w-1.5 h-1.5 rotate-45 bg-[#F5C518]"></div>
                                        <div className="h-px w-8 bg-[#F5C518]/40"></div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6 text-[#E5D5D9]">
                                    <div className="flex justify-between">
                                        <span>Total Items</span>
                                        <span className="font-medium text-white">{cart.length}</span>
                                    </div>
                                    
                                    <div className="flex justify-between">
                                        <span>Total Days</span>
                                        <span className="font-medium text-white">{totalDays} Days</span>
                                    </div>

                                    <div className="flex justify-between pt-2">
                                        <span>Subtotal</span>
                                        <span className="font-bold text-white text-lg">
                                            ৳ {total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="border-t border-dashed border-[#8A2B3B] my-6"></div>

                                <div className="mb-8">
                                    <p className="text-[#E5D5D9] mb-2">Total Amount</p>
                                    <div className="text-center">
                                        <span className="text-4xl font-bold text-white">
                                            ৳ {total.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <button
                                        onClick={() => isAllSelected && navigate("/checkout")}
                                        disabled={!isAllSelected}
                                        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-lg font-bold transition ${
                                            isAllSelected 
                                            ? "bg-white text-accent hover:bg-secondary hover:text-white cursor-pointer shadow-lg" 
                                            : "bg-white/20 text-white/50 cursor-not-allowed border border-white/10"
                                        }`}
                                    >
                                        <LockClosedIcon className="h-5 w-5" />
                                        Proceed to Checkout
                                    </button>
                                    
                                    {!isAllSelected && cart.length > 0 && (
                                        <p className="text-[10px] text-center text-[#F5C518] animate-pulse">
                                            Please select rental duration for all items to proceed.
                                        </p>
                                    )}
                                    
                                    <button
                                        className="w-full flex items-center justify-center gap-2 bg-transparent border border-white text-white hover:bg-secondary py-3.5 rounded-lg font-semibold transition"
                                    >
                                        <TagIcon className="h-5 w-5" />
                                        Have a Coupon?
                                    </button>
                                </div>

                                {/* Features */}
                                    <div className="grid grid-cols-4 gap-2 mt-10 pt-6 border-t border-accent">
                                    <div className="flex flex-col items-center text-center gap-1.5">
                                        <TruckIcon className="h-5 w-5 text-[#F5C518]" />
                                        <p className="text-[9px] font-semibold text-white leading-tight">Free Delivery</p>
                                        <p className="text-[8px] text-[#C2A3A9]">On all orders</p>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-1.5">
                                        <ArrowPathIcon className="h-5 w-5 text-[#F5C518]" />
                                        <p className="text-[9px] font-semibold text-white leading-tight">Easy Returns</p>
                                        <p className="text-[8px] text-[#C2A3A9]">Within 7 days</p>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-1.5">
                                        <ShieldCheckIcon className="h-5 w-5 text-[#F5C518]" />
                                        <p className="text-[9px] font-semibold text-white leading-tight">Secure Payment</p>
                                        <p className="text-[8px] text-[#C2A3A9]">100% secure</p>
                                    </div>
                                    <div className="flex flex-col items-center text-center gap-1.5">
                                        <StarBadgeIcon className="h-5 w-5 text-[#F5C518]" />
                                        <p className="text-[9px] font-semibold text-white leading-tight">Best Quality</p>
                                        <p className="text-[8px] text-[#C2A3A9]">Premium outfits</p>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;
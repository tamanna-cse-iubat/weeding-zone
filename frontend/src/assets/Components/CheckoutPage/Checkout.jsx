import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { AuthContext } from '../../../Provider/AuthProvider';
import { 
    ChevronRightIcon, 
    ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import {
    LockClosedIcon,
    TruckIcon,
    ArrowPathIcon,
    ShieldCheckIcon,
    StarIcon as StarBadgeIcon,
    CreditCardIcon,
    BanknotesIcon,
    DevicePhoneMobileIcon
} from '@heroicons/react/24/solid';

const Checkout = () => {
    const { cart, setCart } = useContext(AuthContext);
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('card');

    // total price
    const total = cart.reduce((sum, item) => {
        return sum + item.rent * (item.rent_for_days || 3);
    }, 0);

    // total days
    const totalDays = cart.reduce((sum, item) => {
        return sum + (item.rent_for_days || 3);
    }, 0);

    const handlePlaceOrder = (e) => {
        e.preventDefault();
        // Here you would integrate with your backend to place the order
        alert("Order placed successfully!");
        setCart([]);
        navigate("/dashboard");

    };

    return (
        <div className="min-h-screen bg-[#fafafa] font-sans pb-16">
            
            {/* Breadcrumbs */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <nav className="flex items-center text-sm text-gray-500 space-x-2">
                    <Link to="/" className="hover:text-gray-900 flex items-center gap-1">
                        Home
                    </Link>
                    <ChevronRightIcon className="h-4 w-4" />
                    <Link to="/cart" className="hover:text-gray-900 flex items-center gap-1">
                        Cart
                    </Link>
                    <ChevronRightIcon className="h-4 w-4" />
                    <span className="text-accent font-medium">Checkout</span>
                </nav>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header */}
                <h1 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-accent">
                    Checkout
                </h1>

                {cart.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-10 text-center">
                        <p className="text-gray-500 text-lg mb-6">Your cart is empty. Please add items to proceed.</p>
                        <button 
                            onClick={() => navigate("/")}
                            className="bg-accent hover:bg-[#5E0B15] text-white py-3 px-8 rounded-lg font-semibold transition"
                        >
                            Return to Shop
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* LEFT: Checkout Form */}
                        <div className="w-full lg:w-2/3 space-y-6">
                            <form onSubmit={handlePlaceOrder} id="checkout-form" className="space-y-6">
                                
                                {/* Billing & Shipping Details */}
                                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <h2 className="text-2xl font-serif font-bold text-accent mb-6">Billing Details</h2>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                            <input required type="text" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="First Name" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                            <input required type="text" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="Last Name" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input required type="email" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="example@gmail.com" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input required type="tel" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="+880 1XXX XXXXXX" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                            <input required type="text" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="House No, Street Area" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Town / City</label>
                                            <input required type="text" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="Dhaka" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Postcode / ZIP</label>
                                            <input required type="text" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="1200" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                                            <textarea className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent h-24 resize-none" placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <h2 className="text-2xl font-serif font-bold text-[#4A0E1B] mb-6">Payment Method</h2>
                                    
                                    <div className="space-y-4">
                                        <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'card' ? 'border-accent bg-[#FDFBF7]' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value="card" 
                                                checked={paymentMethod === 'card'} 
                                                onChange={() => setPaymentMethod('card')}
                                                className="w-5 h-5 text-accent focus:ring-accent" 
                                            />
                                            <div className="flex items-center gap-3">
                                                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                                                    <CreditCardIcon className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Credit / Debit Card</p>
                                                    <p className="text-sm text-gray-500">Pay securely with your card.</p>
                                                </div>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'mobile' ? 'border-accent bg-[#FDFBF7]' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value="mobile" 
                                                checked={paymentMethod === 'mobile'} 
                                                onChange={() => setPaymentMethod('mobile')}
                                                className="w-5 h-5 text-accent focus:ring-accent" 
                                            />
                                            <div className="flex items-center gap-3">
                                                <div className="bg-pink-50 text-pink-600 p-2 rounded-lg">
                                                    <DevicePhoneMobileIcon className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Mobile Banking</p>
                                                    <p className="text-sm text-gray-500">Pay via bKash, Nagad, or Rocket.</p>
                                                </div>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition ${paymentMethod === 'cod' ? 'border-accent bg-[#FDFBF7]' : 'border-gray-200 hover:border-gray-300'}`}>
                                            <input 
                                                type="radio" 
                                                name="payment" 
                                                value="cod" 
                                                checked={paymentMethod === 'cod'} 
                                                onChange={() => setPaymentMethod('cod')}
                                                className="w-5 h-5 text-accent focus:ring-accent" 
                                            />
                                            <div className="flex items-center gap-3">
                                                <div className="bg-green-50 text-green-600 p-2 rounded-lg">
                                                    <BanknotesIcon className="h-6 w-6" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-800">Cash on Delivery</p>
                                                    <p className="text-sm text-gray-500">Pay when you receive your order.</p>
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                </div>
                                
                                <div className="pt-2">
                                    <button 
                                        type="button"
                                        onClick={() => navigate("/cart")}
                                        className="flex items-center gap-2 border border-accent text-accent hover:bg-[#FDFBF7] py-2.5 px-6 rounded-lg font-semibold transition bg-white"
                                    >
                                        <ChevronLeftIcon className="h-4 w-4" />
                                        Return to Cart
                                    </button>
                                </div>
                            </form>
                        </div>

                        {/* RIGHT: Summary */}
                        <div className="w-full lg:w-1/3">
                                <div className="bg-accent text-white p-8 rounded-2xl shadow-md sticky top-6">
                                
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-serif font-bold text-white mb-2">Order Summary</h2>
                                    {/* Decorative divider */}
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="h-px w-8 bg-[#F5C518]/40"></div>
                                        <div className="w-1.5 h-1.5 rotate-45 bg-secondary"></div>
                                        <div className="h-px w-8 bg-[#F5C518]/40"></div>
                                    </div>
                                </div>

                                {/* Minimal Item List */}
                                <div className="space-y-4 mb-6">
                                    {cart.slice(0, 3).map(item => (
                                        <div key={item.id} className="flex gap-3 items-center">
                                            <img src={item.photoURL} alt={item.name} className="w-12 h-12 rounded object-cover border border-[#8A2B3B]" />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium line-clamp-1">{item.name}</p>
                                                <p className="text-xs text-[#C2A3A9]">৳ {item.rent.toLocaleString()} x {item.rent_for_days || 3} Days</p>
                                            </div>
                                            <div className="text-sm font-bold text-[#F5C518]">
                                                ৳ {(item.rent * (item.rent_for_days || 3)).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                    {cart.length > 3 && (
                                        <p className="text-xs text-center text-[#C2A3A9] italic">+ {cart.length - 3} more items</p>
                                    )}
                                </div>

                                <div className="border-t border-[#6A1A2A] my-4"></div>

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
                                    {/* Place Order Button - triggers form submit */}
                                    <button
                                        type="submit"
                                        form="checkout-form"
                                        className="w-full flex items-center justify-center gap-2 skeleton bg-white hover:bg-secondary hover:text-white text-accent py-4 rounded-lg font-bold text-lg transition"
                                    >
                                        <LockClosedIcon className="h-6 w-6" />
                                        Place Order
                                    </button>
                                    <p className="text-center text-xs text-[#C2A3A9] mt-2">
                                        By placing your order, you agree to our Terms and Conditions.
                                    </p>
                                </div>

                                {/* Features */}
                                <div className="grid grid-cols-4 gap-2 mt-8 pt-6 border-t border-[#6A1A2A]">
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

export default Checkout;
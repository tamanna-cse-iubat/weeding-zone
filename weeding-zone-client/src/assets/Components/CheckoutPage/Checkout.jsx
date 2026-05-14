import React, { useContext, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router';
import { AuthContext } from '../../../Provider/AuthProvider';
import axios from 'axios';
import Swal from 'sweetalert2';
import {
    ChevronRightIcon,
    ChevronLeftIcon,
} from '@heroicons/react/24/outline';
import { addNotification } from '../../../utils/notificationService';
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
    const { cart, setCart, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [paymentMethod, setPaymentMethod] = useState('card');
    const appliedCoupon = location.state?.appliedCoupon;

    // Card payment state
    const [cardForm, setCardForm] = useState({
        cardNumber: '',
        cardHolder: '',
        expiryMonth: '',
        expiryYear: '',
        cvv: ''
    });

    // Mobile banking state
    const [mobileForm, setMobileForm] = useState({
        provider: 'bkash',
        mobileNumber: '',
        pin: ''
    });

    // total price
    const subtotal = cart.reduce((sum, item) => {
        return sum + item.rent * (item.rent_for_days || 3);
    }, 0);

    // Calculate discount
    let discount = 0;
    if (appliedCoupon) {
        if (appliedCoupon.type === 'percent') {
            discount = Math.round(subtotal * (appliedCoupon.discount / 100));
        } else {
            discount = appliedCoupon.discount;
        }
    }

    const total = Math.max(0, subtotal - discount);

    // total days
    const totalDays = cart.reduce((sum, item) => {
        return sum + (item.rent_for_days || 3);
    }, 0);

    const handlePlaceOrder = async (e) => {
        e.preventDefault();

        // Validate payment details
        if (paymentMethod === 'card') {
            if (!cardForm.cardNumber || !cardForm.cardHolder || !cardForm.expiryMonth || !cardForm.expiryYear || !cardForm.cvv) {
                Swal.fire({
                    icon: 'error',
                    title: 'Incomplete Payment',
                    text: 'Please fill in all card details',
                    confirmButtonColor: '#4A0E1B'
                });
                return;
            }
            // Basic card validation
            if (cardForm.cardNumber.replace(/\s/g, '').length !== 16) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Card',
                    text: 'Card number must be 16 digits',
                    confirmButtonColor: '#4A0E1B'
                });
                return;
            }
        } else if (paymentMethod === 'mobile') {
            if (!mobileForm.provider || !mobileForm.mobileNumber || !mobileForm.pin) {
                Swal.fire({
                    icon: 'error',
                    title: 'Incomplete Payment',
                    text: 'Please fill in all mobile banking details',
                    confirmButtonColor: '#4A0E1B'
                });
                return;
            }
            if (mobileForm.mobileNumber.length !== 11) {
                Swal.fire({
                    icon: 'error',
                    title: 'Invalid Number',
                    text: 'Mobile number must be 11 digits',
                    confirmButtonColor: '#4A0E1B'
                });
                return;
            }
        }

        const formData = new FormData(e.target);
        const shippingDetails = {
            firstName: formData.get('firstName'),
            lastName: formData.get('lastName'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            address: formData.get('address'),
            city: formData.get('city'),
            postcode: formData.get('postcode'),
            notes: formData.get('notes')
        };

        // Prepare order data
        const orderData = {
            orderId: `WZ-${Math.floor(10000 + Math.random() * 90000)}`,
            customerEmail: formData.get('email') || user.email,
            customerName: `${formData.get('firstName')} ${formData.get('lastName')}`,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            items: cart,
            subtotal: subtotal,
            discount: discount,
            appliedCoupon: appliedCoupon || null,
            totalAmount: total,
            paymentMethod: paymentMethod,
            paymentDetails: paymentMethod === 'card' ? {
                type: 'card',
                lastFourDigits: cardForm.cardNumber.slice(-4),
                cardHolder: cardForm.cardHolder
            } : {
                type: 'mobile',
                provider: mobileForm.provider.toUpperCase(),
                mobileNumber: mobileForm.mobileNumber
            },
            shipping: shippingDetails,
            status: 'Pending',
            timestamp: new Date().getTime()
        };

        try {
            await axios.post('/api/orders', orderData);
            
            // Notify Admin
            addNotification({
                role: 'admin',
                title: 'New Order Received',
                message: `Order ${orderData.orderId} placed by ${orderData.customerName}.`,
                fullMessage: `Order ID: ${orderData.orderId}\nTotal: ৳${orderData.totalAmount}\nPayment: ${orderData.paymentMethod}\n\nShipping Details:\nName: ${shippingDetails.firstName} ${shippingDetails.lastName}\nEmail: ${shippingDetails.email}\nPhone: ${shippingDetails.phone}\nAddress: ${shippingDetails.address}, ${shippingDetails.city} - ${shippingDetails.postcode}${shippingDetails.notes ? '\nNotes: ' + shippingDetails.notes : ''}`,
                senderName: `${shippingDetails.firstName} ${shippingDetails.lastName}`,
                senderEmail: shippingDetails.email,
                type: 'new_order'
            });

            setCart([]);
            navigate("/thank-you", { state: { order: orderData } });
        } catch (error) {
            console.error('Order submission failed:', error);
            Swal.fire({
                icon: 'error',
                title: 'Order Failed',
                text: 'Could not submit your order. Please try again.',
                confirmButtonColor: '#4A0E1B'
            });
        }
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
                                            <input
                                                required
                                                type="text"
                                                name="firstName"
                                                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                                defaultValue={user?.displayName ? user.displayName.split(' ')[0] : ''}
                                                placeholder="First Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                            <input
                                                required
                                                type="text"
                                                name="lastName"
                                                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                                                defaultValue={user?.displayName && user.displayName.split(' ').length > 1 ? user.displayName.split(' ').slice(1).join(' ') : ''}
                                                placeholder="Last Name"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                            <input
                                                required
                                                type="email"
                                                name="email"
                                                className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent bg-gray-50"
                                                defaultValue={user?.email}
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                            <input required type="tel" name="phone" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="+880 1XXX XXXXXX" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                                            <input required type="text" name="address" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="House No, Street Area" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Town / City</label>
                                            <input required type="text" name="city" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="Dhaka" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Postcode / ZIP</label>
                                            <input required type="text" name="postcode" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent" placeholder="1200" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Order Notes (Optional)</label>
                                            <textarea name="notes" className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent h-24 resize-none" placeholder="Notes about your order, e.g. special notes for delivery."></textarea>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Method */}
                                <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100">
                                    <h2 className="text-2xl font-serif font-bold text-[accent] mb-6">Payment Method</h2>

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

                                    {/* Card Payment Form */}
                                    {paymentMethod === 'card' && (
                                        <div className="mt-6 p-6 bg-blue-50 rounded-xl border border-blue-200">
                                            <h3 className="font-semibold text-gray-800 mb-4">Card Details</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
                                                    <input
                                                        type="text"
                                                        placeholder="1234 5678 9012 3456"
                                                        value={cardForm.cardNumber}
                                                        onChange={(e) => {
                                                            let val = e.target.value.replace(/\s/g, '');
                                                            if (val.length <= 16) {
                                                                val = val.replace(/(\d{4})/g, '$1 ').trim();
                                                                setCardForm({...cardForm, cardNumber: val});
                                                            }
                                                        }}
                                                        className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                                                        maxLength="19"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">16 digits required</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Card Holder Name</label>
                                                    <input
                                                        type="text"
                                                        placeholder="John Doe"
                                                        value={cardForm.cardHolder}
                                                        onChange={(e) => setCardForm({...cardForm, cardHolder: e.target.value.toUpperCase()})}
                                                        className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-3 gap-3">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                                                        <select
                                                            value={cardForm.expiryMonth}
                                                            onChange={(e) => setCardForm({...cardForm, expiryMonth: e.target.value})}
                                                            className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                        >
                                                            <option value="">MM</option>
                                                            {Array.from({length: 12}, (_, i) => (
                                                                <option key={i+1} value={String(i+1).padStart(2, '0')}>{String(i+1).padStart(2, '0')}</option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                                                        <select
                                                            value={cardForm.expiryYear}
                                                            onChange={(e) => setCardForm({...cardForm, expiryYear: e.target.value})}
                                                            className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                                        >
                                                            <option value="">YY</option>
                                                            {Array.from({length: 10}, (_, i) => {
                                                                const year = new Date().getFullYear() + i;
                                                                return <option key={year} value={String(year).slice(-2)}>{String(year).slice(-2)}</option>
                                                            })}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
                                                        <input
                                                            type="text"
                                                            placeholder="123"
                                                            value={cardForm.cvv}
                                                            onChange={(e) => {
                                                                if (/^\d{0,4}$/.test(e.target.value)) {
                                                                    setCardForm({...cardForm, cvv: e.target.value});
                                                                }
                                                            }}
                                                            className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-mono"
                                                            maxLength="4"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* Mobile Banking Form */}
                                    {paymentMethod === 'mobile' && (
                                        <div className="mt-6 p-6 bg-pink-50 rounded-xl border border-pink-200">
                                            <h3 className="font-semibold text-gray-800 mb-4">Mobile Banking Details</h3>
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Select Provider</label>
                                                    <select
                                                        value={mobileForm.provider}
                                                        onChange={(e) => setMobileForm({...mobileForm, provider: e.target.value})}
                                                        className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                                                    >
                                                        <option value="bkash">bKash</option>
                                                        <option value="nagad">Nagad</option>
                                                        <option value="rocket">Rocket</option>
                                                    </select>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                                    <input
                                                        type="tel"
                                                        placeholder="01XXX XXXXXX"
                                                        value={mobileForm.mobileNumber}
                                                        onChange={(e) => {
                                                            if (/^\d{0,11}$/.test(e.target.value)) {
                                                                setMobileForm({...mobileForm, mobileNumber: e.target.value});
                                                            }
                                                        }}
                                                        className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                                                        maxLength="11"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">11 digits required (e.g., 01712345678)</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">PIN/Reference</label>
                                                    <input
                                                        type="password"
                                                        placeholder="Enter your transaction PIN"
                                                        value={mobileForm.pin}
                                                        onChange={(e) => setMobileForm({...mobileForm, pin: e.target.value})}
                                                        className="w-full border border-gray-300 rounded-lg py-2.5 px-4 text-gray-700 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500"
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">Enter your {mobileForm.provider.toUpperCase()} PIN</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
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
                                                <p className="text-[10px] text-white/70">Size: {item.selectedSize || 'Standard'}</p>
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
                                            ৳ {subtotal.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                {appliedCoupon && (
                                    <div className="bg-green-50/20 border border-green-400/30 rounded-xl p-4 mb-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-semibold text-green-300">Coupon Applied ✓</span>
                                        </div>
                                        <p className="text-xs text-green-200 mb-2">{appliedCoupon.code}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm text-green-300">Discount ({appliedCoupon.type === 'percent' ? appliedCoupon.discount + '%' : 'Flat'})</span>
                                            <span className="font-bold text-green-300">- ৳ {discount.toLocaleString()}</span>
                                        </div>
                                    </div>
                                )}

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
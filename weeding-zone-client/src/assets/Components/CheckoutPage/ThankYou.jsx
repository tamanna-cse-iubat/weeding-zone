import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import {
    CheckCircle,
    ShoppingBag,
    Mail,
    ArrowRight,
    Home,
    LayoutDashboard,
    Download,
    Star
} from 'lucide-react';
import generateInvoicePDF from '../../../utils/invoiceGenerator';

const ThankYou = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const order = location.state?.order;
    const [emailSent, setEmailSent] = useState(false);

    useEffect(() => {
        if (!order) {
            navigate('/');
            return;
        }

        // Simulate sending email
        const timer = setTimeout(() => {
            setEmailSent(true);
        }, 3000);

        return () => clearTimeout(timer);
    }, [order, navigate]);

    const handleDownloadInvoice = () => {
        generateInvoicePDF(order);
    };

    if (!order) return null;

    return (
        <div className="min-h-screen bg-[#FDFBF9] py-12 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl mx-auto">
                {/* Success Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-rose-100/50 overflow-hidden border border-rose-50">
                    {/* Top Decorative Banner */}
                    <div className="bg-[#4A0E1B] h-2 py-0"></div>

                    <div className="p-8 md:p-12 text-center">
                        {/* Success Icon */}
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 rounded-full mb-6 relative">
                            <CheckCircle className="w-10 h-10 text-green-500 relative z-10" />
                            <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-20"></div>
                        </div>

                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-[#4A0E1B] mb-3">
                            Thank You for Your Order!
                        </h1>
                        <p className="text-gray-500 text-lg mb-8">
                            Your rental order has been placed successfully.
                        </p>

                        {/* Order Info Bar */}
                        <div className="bg-gray-50 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-center gap-6 mb-10 border border-gray-100">
                            <div className="text-center md:text-left">
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Order ID</p>
                                <p className="text-[#4A0E1B] font-bold text-lg">{order.orderId}</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
                            <div className="text-center md:text-left">
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Date</p>
                                <p className="text-[#4A0E1B] font-bold text-lg">{order.date}</p>
                            </div>
                            <div className="w-px h-10 bg-gray-200 hidden md:block"></div>
                            <div className="text-center md:text-left">
                                <p className="text-gray-400 text-xs uppercase tracking-widest font-bold mb-1">Total Amount</p>
                                <div className="flex items-center gap-2">
                                    {order.discount > 0 && (
                                        <p className="text-gray-400 line-through text-sm">BDT {order.subtotal?.toLocaleString()}</p>
                                    )}
                                    <p className="text-[#D4AF37] font-bold text-lg">BDT {order.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        {/* Email Status */}
                        <div className={`transition-all duration-700 flex items-center justify-center gap-3 p-4 rounded-xl mb-10 ${emailSent ? 'bg-blue-50 text-blue-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                            {emailSent ? (
                                <>
                                    <Mail className="w-5 h-5" />
                                    <span className="text-sm font-semibold text-blue-700">A confirmation email has been sent to {order.customerEmail}</span>
                                </>
                            ) : (
                                <>
                                    <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                                    <span className="text-sm font-semibold">Sending confirmation email to your inbox...</span>
                                </>
                            )}
                        </div>

                        {/* Order Items Preview */}
                        <div className="text-left mb-10">
                            <h3 className="text-gray-800 font-bold flex items-center gap-2 mb-4">
                                <ShoppingBag className="w-5 h-5 text-[#D4AF37]" /> Order Summary
                            </h3>
                            <div className="space-y-4">
                                {order.items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition">
                                        <div className="w-16 h-20 bg-rose-50 rounded-xl overflow-hidden shrink-0">
                                            <img src={item.photoURL} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="text-sm font-bold text-gray-800">{item.name}</h4>
                                            <p className="text-xs text-gray-400">Size: {item.size[0]} | Duration: {item.rent_for_days || 3} Days</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-[#4A0E1B]">৳ {item.rent.toLocaleString()}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <button
                                onClick={() => navigate('/customer-dashboard')}
                                className="flex items-center justify-center gap-2 bg-[#4A0E1B] text-white py-4 rounded-2xl font-bold hover:bg-[#5E0B15] transition shadow-lg shadow-rose-900/10"
                            >
                                <LayoutDashboard className="w-5 h-5" />
                                View Dashboard
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center justify-center gap-2 bg-white border-2 border-gray-100 text-gray-700 py-4 rounded-2xl font-bold hover:bg-gray-50 transition"
                            >
                                <Home className="w-5 h-5" />
                                Continue Shopping
                            </button>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Wedding Zone Premium</span>
                        </div>
                        <button
                            onClick={handleDownloadInvoice}
                            className="flex items-center gap-2 text-rose-600 text-sm font-bold hover:underline hover:text-rose-700 transition"
                        >
                            <Download className="w-4 h-4" />
                            Download Invoice (PDF)
                        </button>
                    </div>
                </div>

                {/* Support Card */}
                <div className="mt-8 text-center text-gray-400 text-sm">
                    <p>Having trouble? Contact our support at <span className="text-rose-600 font-bold">support@weddingzone.com</span></p>
                    <p className="mt-2">© 2024 Wedding Zone. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
};

export default ThankYou;
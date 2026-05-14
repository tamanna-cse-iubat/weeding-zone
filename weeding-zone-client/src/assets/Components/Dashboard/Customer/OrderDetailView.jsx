import React, { useContext, useEffect, useState } from 'react';
import { useParams, Link, useLocation } from 'react-router';
import { AuthContext } from '../../../../Provider/AuthProvider';
import axios from 'axios';
import { 
    ChevronLeft, 
    Package, 
    Truck, 
    CheckCircle, 
    CreditCard, 
    MapPin, 
    Calendar,
    ShoppingBag,
    Phone,
    Mail,
    FileText
} from 'lucide-react';

const OrderDetailView = () => {
    const params = useParams();
    const location = useLocation();
    const { user } = useContext(AuthContext);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                // Determine the ID from params or URL hash fallback
                let orderId = params.id;
                if (!orderId && window.location.hash) {
                    orderId = window.location.hash;
                }

                if (!orderId) {
                    setOrder(null);
                    setLoading(false);
                    return;
                }

                // Try fetching specific order
                const encodedId = encodeURIComponent(orderId);
                const res = await axios.get(`/api/orders/${encodedId}`);
                
                if (res.data && res.data.customerEmail === user?.email) {
                    setOrder(res.data);
                } else {
                    // Fallback: search all orders if specific fetch fails or email mismatch
                    const allRes = await axios.get('/api/orders');
                    const orders = Array.isArray(allRes.data) ? allRes.data : [];
                    const found = orders.find(o => 
                        (o.orderId === orderId || o.orderId === decodeURIComponent(orderId) || o.orderId.replace('#', '') === orderId.replace('#', '').replace('%23', '')) && 
                        o.customerEmail === user?.email
                    );
                    setOrder(found);
                }
            } catch (error) {
                console.error('Order fetch error:', error);
                // Last ditch effort: try search all even if specific fails
                try {
                    const allRes = await axios.get('/api/orders');
                    const orders = Array.isArray(allRes.data) ? allRes.data : [];
                    const orderId = params.id || window.location.hash;
                    const found = orders.find(o => 
                        o.orderId.replace('#', '') === (orderId || '').replace('#', '').replace('%23', '') && 
                        o.customerEmail === user?.email
                    );
                    setOrder(found);
                } catch (e) {
                    setOrder(null);
                }
            } finally {
                setLoading(false);
            }
        };
        
        if (user?.email) {
            fetchOrder();
        }
    }, [params.id, location.hash, user?.email]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-[#FDFBF9]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A0E1B]"></div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFBF9] p-4 text-center">
            <div className="bg-white p-10 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full">
                <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShoppingBag className="w-10 h-10 text-rose-300" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
                <p className="text-gray-500 mt-2">
                    We couldn't find order <span className="font-mono font-bold text-[#4A0E1B]">{params.id || window.location.hash || 'unknown'}</span> under your account.
                </p>
                <Link to="/customer/orders" className="mt-8 inline-block bg-[#4A0E1B] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#6A1A2A] transition shadow-lg">
                    Back to My Orders
                </Link>
            </div>
        </div>
    );

    const getStatusStep = () => {
        const statuses = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];
        return statuses.indexOf(order.status);
    };

    return (
        <div className="min-h-screen bg-[#FDFBF9] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <Link to="/customer/orders" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#4A0E1B] transition mb-8 group">
                    <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    <span className="font-medium">Back to Orders</span>
                </Link>

                <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-[#4A0E1B] text-white p-8 md:p-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div>
                                <p className="text-rose-200 text-xs font-bold uppercase tracking-widest mb-1">Order Details</p>
                                <h1 className="text-3xl font-bold font-mono">{order.orderId}</h1>
                            </div>
                            <div className="text-right">
                                <p className="text-rose-200 text-xs font-bold uppercase tracking-widest mb-1">Order Placed</p>
                                <p className="text-xl font-bold">{order.date}</p>
                            </div>
                        </div>

                        {/* Progress Tracker */}
                        <div className="mt-12 relative">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2"></div>
                            <div 
                                className="absolute top-1/2 left-0 h-1 bg-[#D4AF37] -translate-y-1/2 transition-all duration-1000"
                                style={{ width: `${(getStatusStep() / 3) * 100}%` }}
                            ></div>
                            <div className="relative flex justify-between">
                                {['Pending', 'Confirmed', 'Shipped', 'Delivered'].map((s, i) => (
                                    <div key={s} className="flex flex-col items-center">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 ${
                                            i <= getStatusStep() ? 'bg-[#D4AF37] border-white text-[#4A0E1B]' : 'bg-[#4A0E1B] border-white/20 text-white/50'
                                        } z-10 transition-colors duration-500`}>
                                            {i === 0 && <Clock className="w-4 h-4" />}
                                            {i === 1 && <CheckCircle className="w-4 h-4" />}
                                            {i === 2 && <Truck className="w-4 h-4" />}
                                            {i === 3 && <Package className="w-4 h-4" />}
                                        </div>
                                        <span className={`text-[10px] font-bold mt-2 uppercase tracking-wider ${i <= getStatusStep() ? 'text-white' : 'text-white/40'}`}>{s}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="p-8 md:p-10 space-y-10">
                        {/* Summary Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <h3 className="flex items-center gap-2 text-gray-800 font-bold mb-4">
                                        <MapPin className="w-5 h-5 text-[#4A0E1B]" /> Shipping Address
                                    </h3>
                                    <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F2ECE4] space-y-1">
                                        <p className="font-bold text-gray-800">{order.shipping?.firstName} {order.shipping?.lastName}</p>
                                        <p className="text-sm text-gray-600">{order.shipping?.address}</p>
                                        <p className="text-sm text-gray-600">{order.shipping?.city}, {order.shipping?.postcode}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-3">
                                            <Phone className="w-3.5 h-3.5" /> {order.shipping?.phone}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Mail className="w-3.5 h-3.5" /> {order.shipping?.email}
                                        </div>
                                    </div>
                                </div>
                                {order.shipping?.notes && (
                                    <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
                                        <FileText className="w-5 h-5 text-blue-500 shrink-0" />
                                        <div>
                                            <p className="text-xs font-bold text-blue-700 uppercase tracking-widest mb-1">Order Notes</p>
                                            <p className="text-sm text-blue-600 italic">"{order.shipping.notes}"</p>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="flex items-center gap-2 text-gray-800 font-bold mb-4">
                                        <CreditCard className="w-5 h-5 text-[#4A0E1B]" /> Payment Details
                                    </h3>
                                    <div className="bg-[#FDFBF7] p-5 rounded-2xl border border-[#F2ECE4]">
                                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#F2ECE4]">
                                            <p className="text-sm text-gray-500 uppercase tracking-widest font-bold">Method</p>
                                            <p className="font-bold text-gray-800 capitalize">{order.paymentMethod}</p>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Subtotal</span>
                                                <span className="font-bold text-gray-800">৳ {(order.subtotal || 0).toLocaleString()}</span>
                                            </div>
                                            {(order.discount || 0) > 0 && (
                                                <div className="flex justify-between text-sm text-green-600">
                                                    <span>Discount {order.appliedCoupon && `(${order.appliedCoupon})`}</span>
                                                    <span>-৳ {(order.discount || 0).toLocaleString()}</span>
                                                </div>
                                            )}
                                            <div className="pt-3 border-t border-[#F2ECE4] flex justify-between items-center">
                                                <span className="font-bold text-gray-800">Total Amount</span>
                                                <span className="text-xl font-bold text-[#4A0E1B]">৳ {(order.totalAmount || 0).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Items Table */}
                        <div>
                            <h3 className="flex items-center gap-2 text-gray-800 font-bold mb-6">
                                <ShoppingBag className="w-5 h-5 text-[#4A0E1B]" /> Ordered Items
                            </h3>
                            <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm">
                                <div className="divide-y divide-gray-50">
                                    {(order.items || []).map((item, idx) => (
                                        <div key={idx} className="p-6 flex items-center gap-6">
                                            <div className="w-20 h-28 bg-gray-100 rounded-2xl overflow-hidden shadow-sm shrink-0">
                                                {item.photoURL ? (
                                                    <img src={item.photoURL} alt={item.name} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ShoppingBag className="w-8 h-8" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-xs font-bold text-rose-500 uppercase tracking-widest mb-1">{item.occasion || 'Wedding Outfit'}</p>
                                                <h4 className="text-lg font-bold text-gray-800">{item.name}</h4>
                                                <div className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
                                                    <p className="text-sm text-gray-500">Size: <span className="font-bold text-gray-700">{item.size || 'N/A'}</span></p>
                                                    <p className="text-sm text-gray-500">Rent for: <span className="font-bold text-gray-700">{item.rent_for_days || 3} Days</span></p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-lg font-bold text-gray-800">৳ {(item.price || 0).toLocaleString()}</p>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Unit Price</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer Help */}
                        <div className="bg-rose-50 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                    <Calendar className="w-6 h-6 text-[#4A0E1B]" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-[#4A0E1B]">Need to modify your booking?</h4>
                                    <p className="text-sm text-rose-600/70">Contact our concierge for help with sizes or dates.</p>
                                </div>
                            </div>
                            <Link to="/contact" className="px-8 py-3 bg-[#4A0E1B] text-white rounded-xl font-bold hover:bg-[#6A1A2A] transition shadow-lg shadow-rose-900/10">
                                Contact Support
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailView;

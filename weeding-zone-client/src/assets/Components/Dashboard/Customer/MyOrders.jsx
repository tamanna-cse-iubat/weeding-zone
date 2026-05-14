import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../../Provider/AuthProvider';
import axios from 'axios';
import { Link, useLocation } from 'react-router';
import { 
    ShoppingBag, 
    ChevronLeft, 
    ChevronRight, 
    Clock, 
    CheckCircle, 
    XCircle,
    Calendar,
    Package
} from 'lucide-react';

const MyOrders = () => {
    const { user } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    
    // Filter based on query param or location state
    const filterType = new URLSearchParams(location.search).get('filter') || 'all';

    const loadOrders = async () => {
        if (!user?.email) return;
        try {
            const res = await axios.get('/api/orders', {
                params: { email: user.email }
            });
            const ordersList = Array.isArray(res.data) ? res.data : [];
            let data = [...ordersList];
            
            if (filterType === 'rentals') {
                data = data.filter(o => ['Confirmed', 'Shipped'].includes(o.status));
            }
            
            setOrders(data.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)));
        } catch (error) {
            console.error('Failed to load orders:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadOrders();
    }, [user?.email, filterType]);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Pending': return 'bg-yellow-100 text-yellow-700';
            case 'Confirmed': return 'bg-blue-100 text-blue-700';
            case 'Shipped': return 'bg-purple-100 text-purple-700';
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Cancelled': return 'bg-red-100 text-red-600';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF9] py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                    <Link to="/customer-dashboard" className="p-2 bg-white rounded-full border border-gray-100 shadow-sm hover:text-rose-600 transition">
                        <ChevronLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">
                            {filterType === 'rentals' ? 'My Active Rentals' : 'Order History'}
                        </h1>
                        <p className="text-gray-500">Track and manage your wedding outfits</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4A0E1B]"></div>
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                        <h3 className="text-xl font-bold text-gray-800">No orders found</h3>
                        <p className="text-gray-500 mt-2">You haven't placed any orders yet.</p>
                        <Link to="/" className="mt-6 inline-block bg-[#4A0E1B] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#6A1A2A] transition">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order) => (
                            <div key={order.orderId} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition">
                                <div className="p-6">
                                    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6 pb-6 border-b border-gray-50">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-rose-50 rounded-xl text-[#4A0E1B]">
                                                <Package className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Order ID</p>
                                                <p className="text-lg font-bold text-gray-800">{order.orderId}</p>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-4 items-center">
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Date</p>
                                                <p className="text-sm font-medium text-gray-600">{order.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Status</p>
                                                <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                                                    {order.status}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Total</p>
                                                <p className="text-lg font-bold text-[#4A0E1B]">৳ {(order.totalAmount || 0).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {(order.items || []).map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                                                <div className="w-16 h-20 bg-gray-200 rounded-lg overflow-hidden shrink-0">
                                                    {item.photoURL ? (
                                                        <img src={item.photoURL} alt={item.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                            <ShoppingBag className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-800">{item.name}</h4>
                                                    <p className="text-xs text-gray-500">Size: {item.size || 'N/A'} | Price: ৳ {(item.price || 0).toLocaleString()}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="mt-6 flex justify-end gap-3">
                                        <Link 
                                            to={`/customer/order/${encodeURIComponent(order.orderId)}`}
                                            className="px-6 py-2.5 bg-white border border-rose-100 text-[#4A0E1B] rounded-xl text-sm font-bold hover:bg-rose-50 transition shadow-sm"
                                        >
                                            View Details
                                        </Link>
                                        <Link 
                                            to="/contact"
                                            className="px-6 py-2.5 bg-[#4A0E1B] text-white rounded-xl text-sm font-bold hover:bg-[#6A1A2A] transition shadow-md shadow-rose-900/10"
                                        >
                                            Get Help
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;

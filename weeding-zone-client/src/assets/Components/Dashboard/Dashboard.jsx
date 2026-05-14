import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import axios from 'axios';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Provider/AuthProvider';
import {
    ShoppingBag,
    Heart,
    Banknote,
    Star,
    TrendingUp,
    TrendingDown,
    Bell,
    Settings,
    LogOut,
    UserCircle,
    Home,
    ClipboardList,
    ShoppingCart,
    Sparkles,
    ChevronRight,
    Eye,
    ArrowUp,
    X,
    Check,
} from 'lucide-react';
import { getNotifications, markAsRead, markAllAsRead } from '../../../utils/notificationService';


// Real data will be calculated in the component


const StatCard = ({ icon: Icon, label, value, change, changeType, color }) => (
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex justify-between items-start">
            <div className={`p-2 md:p-3 rounded-xl ${color}`}>
                <Icon className="h-5 md:h-6 w-5 md:w-6 text-white" />
            </div>
            <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${changeType === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {changeType === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {change}
            </span>
        </div>
        <div>
            <p className="text-lg md:text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-xs md:text-sm text-gray-500 mt-1">{label}</p>
        </div>
    </div>
);


const statusBadge = (status) => {
    const map = {
        Delivered: 'bg-green-50 text-green-600',
        Processing: 'bg-yellow-50 text-yellow-600',
        Cancelled: 'bg-red-50 text-red-500',
    };
    return <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${map[status] || ''}`}>{status}</span>;
};


const Dashboard = () => {
    const { user, logOut, cart } = useContext(AuthContext);
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editProfileOpen, setEditProfileOpen] = useState(false);
    const [profileData, setProfileData] = useState({ displayName: user?.displayName || '', photoURL: user?.photoURL || '' });
    
    // Notifications State
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);

    useEffect(() => {
        const loadOrders = async () => {
            try {
                const res = await axios.get('/api/orders');
                setAllOrders(res.data);
            } catch (error) {
                console.error('Failed to load orders:', error);
                setAllOrders([]);
            } finally {
                setLoading(false);
            }
        };
        loadOrders();
        setProfileData({ displayName: user?.displayName || '', photoURL: user?.photoURL || '' });

        if (user?.email) {
            setNotifications(getNotifications(user.email));
            const notifInterval = setInterval(() => {
                setNotifications(getNotifications(user.email));
            }, 5000);
            return () => clearInterval(notifInterval);
        }
    }, [user]);

    const handleMarkAsRead = (id) => {
        markAsRead(id);
        setNotifications(getNotifications(user.email));
    };

    const handleMarkAllAsRead = () => {
        markAllAsRead(user.email);
        setNotifications(getNotifications(user.email));
    };

    const handleNotificationClick = (notif, e) => {
        if (e.target.closest('.mark-read-btn')) return; // ignore if clicking the mark as read button
        if (!notif.read) handleMarkAsRead(notif.id);
        
        setShowNotifications(false);

        if (notif.fullMessage) {
            Swal.fire({
                title: notif.title,
                html: `<div style="text-align: left; font-size: 14px; margin-top: 10px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
                        <p style="margin-bottom: 5px;"><strong>From:</strong> ${notif.senderName || 'Unknown'} &lt;${notif.senderEmail || 'N/A'}&gt;</p>
                        <hr style="margin: 10px 0;" />
                        <p style="white-space: pre-wrap; color: #444; line-height: 1.5;">${notif.fullMessage}</p>
                       </div>`,
                confirmButtonColor: '#4A0E1B',
                confirmButtonText: 'Close'
            });
        } else {
            Swal.fire({
                title: notif.title,
                html: `<div style="text-align: left; font-size: 14px; margin-top: 10px; padding: 15px; background: #f9f9f9; border-radius: 8px;">
                        <p style="white-space: pre-wrap; color: #444; line-height: 1.5;">${notif.message}</p>
                       </div>`,
                confirmButtonColor: '#4A0E1B',
                confirmButtonText: 'Close'
            });
        }
    };

    const handleLogout = () => {
        logOut().then(() => navigate('/signin'));
    };

    const handleProfileUpdate = () => {
        // In a real app, update user profile in Firebase or backend
        Swal.fire({ icon: 'success', title: 'Profile Updated!', timer: 1500, showConfirmButton: false });
        setEditProfileOpen(false);
    };

    // Calculate Real Stats
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalRentals = allOrders.length;
    const activeCustomers = new Set(allOrders.map(o => o.customerEmail)).size;

    // Calculate REAL Monthly Revenue from Orders
    const monthlyRevenueData = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    months.forEach(m => monthlyRevenueData[m] = 0);

    allOrders.forEach(order => {
        if (order.date) {
            const monthName = order.date.split(' ')[0];
            if (monthlyRevenueData.hasOwnProperty(monthName)) {
                monthlyRevenueData[monthName] += order.totalAmount || 0;
            }
        }
    });

    const monthlyRevenue = months.map(month => ({
        month,
        revenue: monthlyRevenueData[month] || 0
    }));
    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue), 1);

    // Get Top Products
    const productStats = {};
    allOrders.forEach(order => {
        order.items.forEach(item => {
            if (!productStats[item.name]) {
                productStats[item.name] = { rented: 0, revenue: 0 };
            }
            productStats[item.name].rented += 1;
            productStats[item.name].revenue += item.rent * (item.rent_for_days || 3);
        });
    });

    const topProducts = Object.entries(productStats)
        .map(([name, stat]) => ({ name, ...stat, trend: 'up' }))
        .sort((a, b) => b.rented - a.rented)
        .slice(0, 5);

    
    if (loading || !user) {
        return <div className="flex justify-center items-center h-screen bg-[#F4F6F9]">
            <span className="loading loading-spinner loading-lg text-[#4A0E1B]"></span>
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#F4F6F9] font-sans flex flex-col md:flex-row">


            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#4A0E1B] text-white flex flex-col transition-all duration-300 shrink-0 sticky top-0 h-screen hidden md:flex`}>
                {/* Logo */}
                <div className="p-6 border-b border-[#6A1A2A]">
                    {sidebarOpen ? (
                        <div>
                            <p className="text-xl font-bold text-[#F5C518]">Wedding Zone</p>
                            {user?.email === 'tamanna.cse.iubat@gmail.com' ? <p className="text-xs text-[#C2A3A9] mt-0.5">Admin Dashboard</p> :
                                <p className="text-xs text-[#C2A3A9] mt-0.5">Customer Dashboard</p>
                            }


                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <Sparkles className="h-7 w-7 text-[#F5C518]" />
                        </div>
                    )}
                </div>


                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {[
                        { icon: Home, label: 'Overview', active: true, to: '/dashboard' },
                        { icon: ShoppingCart, label: 'Cart', active: false, to: '/cart' },
                        { icon: ClipboardList, label: 'Orders', active: false, to: '/admin/orders' },
                        { icon: ShoppingBag, label: 'Products', active: false, to: '/admin/inventory' },
                        { icon: Heart, label: 'Wishlist', active: false, to: '/wishlist' },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${item.active ? 'bg-[#F5C518] text-[#4A0E1B] font-semibold' : 'text-[#C2A3A9] hover:bg-[#6A1A2A] hover:text-white'}`}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            {sidebarOpen && <span className="text-sm">{item.label}</span>}
                        </Link>
                    ))}
                </nav>


                {/* User Info */}
                <div className="p-4 border-t border-[#6A1A2A]">
                    {sidebarOpen ? (
                        <div className="flex items-center gap-3">
                            <UserCircle className="h-9 w-9 text-[#F5C518]" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user?.email === 'tamanna.cse.iubat@gmail.com' ? user?.displayName || 'Admin' : user?.displayName || 'Customer'}</p>
                                <p className="text-[10px] text-[#C2A3A9] truncate">{user?.email}</p>
                            </div>
                            <button onClick={handleLogout} title="Logout">
                                <LogOut className="h-5 w-5 text-[#C2A3A9] hover:text-white" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleLogout} className="flex justify-center w-full" title="Logout">
                            <LogOut className="h-5 w-5 text-[#C2A3A9] hover:text-white" />
                        </button>
                    )}
                </div>
            </aside>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setSidebarOpen(false)}></div>
            )}

            {/* Mobile Sidebar */}
            <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} fixed left-0 top-0 w-64 h-screen bg-[#4A0E1B] text-white flex flex-col transition-transform duration-300 z-40 md:hidden`}>
                <div className="p-6 border-b border-[#6A1A2A]">
                    <p className="text-xl font-bold text-[#F5C518]">Wedding Zone</p>
                    <p className="text-xs text-[#C2A3A9] mt-0.5">Dashboard</p>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {[
                        { icon: Home, label: 'Overview', active: true, to: '/dashboard' },
                        { icon: ShoppingCart, label: 'Cart', active: false, to: '/cart' },
                        { icon: ClipboardList, label: 'Orders', active: false, to: '/admin/orders' },
                        { icon: ShoppingBag, label: 'Products', active: false, to: '/admin/inventory' },
                        { icon: Heart, label: 'Wishlist', active: false, to: '/wishlist' },
                    ].map((item) => (
                        <Link
                            key={item.label}
                            to={item.to}
                            onClick={() => setSidebarOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${item.active ? 'bg-[#F5C518] text-[#4A0E1B] font-semibold' : 'text-[#C2A3A9] hover:bg-[#6A1A2A] hover:text-white'}`}
                        >
                            <item.icon className="h-5 w-5 shrink-0" />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="p-4 border-t border-[#6A1A2A]">
                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2">
                        <LogOut className="h-5 w-5" />
                        <span className="text-sm">Logout</span>
                    </button>
                </div>
            </aside>


            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">


                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-2 md:gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 rounded-lg hover:bg-gray-100 transition"
                        >
                            <div className="space-y-1.5">
                                <span className="block w-5 h-0.5 bg-gray-600"></span>
                                <span className="block w-5 h-0.5 bg-gray-600"></span>
                                <span className="block w-5 h-0.5 bg-gray-600"></span>
                            </div>
                        </button>
                        <nav className="hidden sm:flex items-center text-sm text-gray-500 space-x-2">
                            <Link to="/" className="hover:text-gray-800">Home</Link>
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-[#6A0D25] font-medium">Dashboard</span>
                        </nav>
                    </div>


                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="relative">
                            <button onClick={() => setShowNotifications(!showNotifications)} className="hidden sm:block p-2 rounded-lg hover:bg-gray-100 transition relative">
                                <Bell className="h-5 w-5 text-gray-600" />
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white"></span>
                                )}
                            </button>
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                                        <h3 className="font-bold text-gray-800 text-sm">Notifications</h3>
                                        <button onClick={handleMarkAllAsRead} className="text-xs text-[#6A0D25] hover:underline font-medium">Mark all as read</button>
                                    </div>
                                    <div className="max-h-80 overflow-y-auto">
                                        {notifications.length === 0 ? (
                                            <div className="p-6 text-center text-gray-400 text-sm">No notifications yet.</div>
                                        ) : (
                                            <div className="divide-y divide-gray-50">
                                                {notifications.map(notif => (
                                                    <div 
                                                        key={notif.id} 
                                                        onClick={(e) => handleNotificationClick(notif, e)}
                                                        className={`p-4 transition hover:bg-gray-50 cursor-pointer ${!notif.read ? 'bg-rose-50/30' : ''}`}
                                                    >
                                                        <div className="flex items-start justify-between gap-3">
                                                            <div className="flex-1 min-w-0">
                                                                <p className={`text-sm font-semibold ${!notif.read ? 'text-gray-800' : 'text-gray-600'}`}>{notif.title}</p>
                                                                <p className="text-xs text-gray-700 mt-1 whitespace-pre-wrap">{notif.message}</p>
                                                                {notif.fullMessage && (
                                                                    <div className="mt-2 p-2 bg-white rounded border border-gray-100 text-xs text-gray-600 whitespace-pre-wrap">
                                                                        {notif.fullMessage}
                                                                    </div>
                                                                )}
                                                                <p className="text-[10px] text-gray-400 mt-2">{notif.date}</p>
                                                            </div>
                                                            {!notif.read && (
                                                                <button onClick={(e) => { e.stopPropagation(); handleMarkAsRead(notif.id); }} className="mark-read-btn p-1.5 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg shrink-0" title="Mark as read">
                                                                    <Check className="w-3.5 h-3.5" />
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                        <button onClick={() => setEditProfileOpen(true)} className="p-2 rounded-lg hover:bg-gray-100 transition" title="Edit Profile">
                            <Settings className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-2 pl-2 md:pl-3 border-l border-gray-200">
                            <UserCircle className="h-7 md:h-8 w-7 md:w-8 text-[#6A0D25]" />
                            <div className="hidden sm:block">
                                <p className="text-xs md:text-sm font-medium text-gray-800 leading-none">{user?.email === 'tamanna.cse.iubat@gmail.com' ? user?.displayName || 'Admin' : user?.displayName || 'Customer'}</p>
                                <p className="text-[10px] text-gray-400 mt-0.5">{user?.email === 'tamanna.cse.iubat@gmail.com' ? user?.displayName || 'Administration' : user?.displayName || 'Customer Panel'}</p>
                            </div>
                        </div>
                    </div>
                </header>


                <main className="flex-1 p-4 md:p-6 space-y-6 overflow-y-auto">


                    {/* Page Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h1>
                            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.email === 'tamanna.cse.iubat@gmail.com' ? user?.displayName || 'Admin' : user?.displayName || 'Customer'}!</p>
                        </div>
                        <div className="flex gap-2 items-center text-sm bg-white border border-gray-200 rounded-xl px-3 md:px-4 py-2 text-gray-600 w-fit">
                            <span>Date: {new Date().toLocaleDateString()}</span>
                        </div>
                    </div>


                    {/* Stat Cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
                        <StatCard
                            icon={Banknote}
                            label="Total Revenue"
                            value={`৳ ${totalRevenue.toLocaleString()}`}
                            change="+12.5%"
                            changeType="up"
                            color="bg-[#4A0E1B]"
                        />
                        <StatCard
                            icon={ShoppingBag}
                            label="Total Orders"
                            value={totalRentals.toString()}
                            change="+8.1%"
                            changeType="up"
                            color="bg-[#B88E2F]"
                        />
                        <StatCard
                            icon={UserCircle}
                            label="Total Customers"
                            value={activeCustomers.toString()}
                            change="+4.2%"
                            changeType="up"
                            color="bg-indigo-500"
                        />
                    </div>


                    {/* Middle Row: Chart + Top Products */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">


                        {/* Revenue Chart */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                                <div>
                                    <h2 className="font-bold text-gray-800">Monthly Revenue</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Jan – Jun 2026</p>
                                </div>
                                <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 font-semibold px-2.5 py-1 rounded-full w-fit">
                                    <ArrowUp className="h-3 w-3" /> +23% vs last period
                                </span>
                            </div>


                            {/* Bar Chart */}
                            <div className="flex items-end gap-2 md:gap-4 h-40 md:h-44 overflow-x-auto pb-2">
                                {monthlyRevenue.map((m) => (
                                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2 min-w-12">
                                        <span className="text-[8px] md:text-[10px] text-gray-400 font-medium truncate">৳{(m.revenue / 1000).toFixed(0)}k</span>
                                        <div
                                            className="w-full rounded-t-lg bg-[#4A0E1B] hover:bg-[#F5C518] transition-colors duration-200 cursor-pointer"
                                            style={{ height: `${(m.revenue / maxRevenue) * 140}px`, minWidth: '8px' }}
                                            title={`৳${m.revenue.toLocaleString()}`}
                                        ></div>
                                        <span className="text-xs text-gray-500">{m.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Top Products */}
                        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold text-gray-800 text-sm md:text-base">Top Products</h2>
                                <Link to="/admin/orders" className="text-xs text-[#6A0D25] font-semibold hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="h-3 w-3" />
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {topProducts.map((p, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <span className="w-6 h-6 rounded-full bg-[#FDFBF7] border border-[#F2ECE4] text-[#6A0D25] text-xs font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                                            <p className="text-xs text-gray-400">{p.rented} rentals</p>
                                        </div>
                                        <span className={`flex items-center gap-0.5 text-xs font-semibold ${p.trend === 'up' ? 'text-green-500' : 'text-red-400'}`}>
                                            {p.trend === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                            ৳{(p.revenue / 1000).toFixed(0)}k
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Bottom Row: Recent Orders + Cart Summary */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">


                        {/* Recent Orders Table */}
                        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-4 md:px-6 py-4 md:py-5 border-b border-gray-100">
                                <h2 className="font-bold text-gray-800 text-sm md:text-base">Recent Orders</h2>
                                <Link to="/admin/orders" className="text-xs text-[#6A0D25] font-semibold hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="h-3 w-3" />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-xs md:text-sm">
                                    <thead className="bg-[#FDFBF7]">
                                        <tr>
                                            <th className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                                            <th className="hidden sm:table-cell text-left px-4 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Item</th>
                                            <th className="hidden md:table-cell text-left px-4 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                                            <th className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                            <th className="text-right px-4 md:px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {allOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-4 md:px-6 py-10 text-center text-gray-400 italic">No orders found in the system yet.</td>
                                            </tr>
                                        ) : (
                                            allOrders.slice(0, 10).map((order) => (
                                                <tr key={order.orderId} className="hover:bg-gray-50 transition">
                                                    <td className="px-4 md:px-6 py-4 text-[#6A0D25] font-medium text-xs md:text-sm">{order.orderId}</td>
                                                    <td className="hidden sm:table-cell px-4 md:px-6 py-4">
                                                        <p className="font-medium text-gray-800 text-xs md:text-sm truncate">{order.items[0]?.name || 'N/A'}</p>
                                                        <p className="text-xs text-gray-400 truncate">{order.customerEmail}</p>
                                                    </td>
                                                    <td className="hidden md:table-cell px-4 md:px-6 py-4 text-gray-500 text-xs md:text-sm">{order.date}</td>
                                                    <td className="px-4 md:px-6 py-4">{statusBadge(order.status)}</td>
                                                    <td className="px-4 md:px-6 py-4 text-right font-bold text-gray-800 text-xs md:text-sm">৳{order.totalAmount.toLocaleString()}</td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                        {/* Cart & Quick Actions */}
                        <div className="space-y-5">
                            {/* Current Cart */}
                            <div className="bg-[#4A0E1B] text-white rounded-2xl p-4 md:p-6 shadow-md">
                                <div className="flex items-center justify-between mb-5">
                                    <h2 className="font-bold">Current Cart</h2>
                                    <span className="bg-[#F5C518] text-[#4A0E1B] text-xs font-bold px-2.5 py-1 rounded-full">{cart.length} items</span>
                                </div>
                                {cart.length === 0 ? (
                                    <p className="text-sm text-[#C2A3A9]">Your cart is empty.</p>
                                ) : (
                                    <div className="space-y-3 mb-5">
                                        {cart.slice(0, 3).map((item) => (
                                            <div key={item.id} className="flex gap-3 items-center">
                                                <img src={item.photoURL} alt={item.name} className="w-10 h-10 rounded-lg object-cover border border-[#8A2B3B]" />
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-xs font-semibold truncate">{item.name}</p>
                                                    <p className="text-[10px] text-[#C2A3A9]">৳{item.rent.toLocaleString()} / day</p>
                                                </div>
                                            </div>
                                        ))}
                                        {cart.length > 3 && <p className="text-xs text-[#C2A3A9] italic">+{cart.length - 3} more</p>}
                                    </div>
                                )}
                                <Link
                                    to="/cart"
                                    className="w-full flex items-center justify-center gap-2 bg-[#F5C518] hover:bg-[#E5B508] text-[#4A0E1B] py-2.5 rounded-xl font-bold text-sm transition"
                                >
                                    <Eye className="h-4 w-4" />
                                    View Cart
                                </Link>
                            </div>


                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
                                <h2 className="font-bold text-gray-800 mb-4 text-sm md:text-base">Quick Actions</h2>
                                <div className="space-y-2 md:space-y-3">
                                    <Link to="/admin/inventory" className="flex items-center gap-3 p-2 md:p-3 rounded-xl hover:bg-[#FDFBF7] border border-gray-100 transition text-sm">
                                        <ShoppingBag className="h-5 w-5 text-[#6A0D25] shrink-0" />
                                        <span className="font-medium text-gray-700 truncate">Browse Products</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400 ml-auto shrink-0" />
                                    </Link>
                                    <Link to="/cart" className="flex items-center gap-3 p-2 md:p-3 rounded-xl hover:bg-[#FDFBF7] border border-gray-100 transition text-sm">
                                        <ShoppingCart className="h-5 w-5 text-[#6A0D25] shrink-0" />
                                        <span className="font-medium text-gray-700 truncate">Go to Cart</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400 ml-auto shrink-0" />
                                    </Link>
                                    <Link to="/checkout" className="flex items-center gap-3 p-2 md:p-3 rounded-xl hover:bg-[#FDFBF7] border border-gray-100 transition text-sm">
                                        <ClipboardList className="h-5 w-5 text-[#6A0D25] shrink-0" />
                                        <span className="font-medium text-gray-700 truncate">Checkout</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400 ml-auto shrink-0" />
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-2 md:p-3 rounded-xl hover:bg-red-50 border border-gray-100 transition text-sm">
                                        <LogOut className="h-5 w-5 text-red-500 shrink-0" />
                                        <span className="font-medium text-red-500 truncate">Sign Out</span>
                                        <ChevronRight className="h-4 w-4 text-red-300 ml-auto shrink-0" />
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>
                </main>
            </div>

            {/* Edit Profile Modal */}
            {editProfileOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                        <div className="bg-[#4A0E1B] text-white px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold">Edit Profile</h2>
                            <button onClick={() => setEditProfileOpen(false)} className="p-1 hover:bg-white/20 rounded-full transition">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Display Name</label>
                                <input
                                    type="text"
                                    value={profileData.displayName}
                                    onChange={(e) => setProfileData({ ...profileData, displayName: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A0E1B]/20"
                                    placeholder="Your name"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                                />
                                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Photo URL</label>
                                <input
                                    type="text"
                                    value={profileData.photoURL}
                                    onChange={(e) => setProfileData({ ...profileData, photoURL: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#4A0E1B]/20"
                                    placeholder="https://example.com/photo.jpg"
                                />
                            </div>

                            {profileData.photoURL && (
                                <div className="flex justify-center pt-2">
                                    <img src={profileData.photoURL} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex gap-3">
                            <button
                                onClick={() => setEditProfileOpen(false)}
                                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleProfileUpdate}
                                className="flex-1 px-4 py-2.5 bg-[#4A0E1B] text-white rounded-lg font-medium hover:bg-[#6A1A2A] transition"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};


export default Dashboard;


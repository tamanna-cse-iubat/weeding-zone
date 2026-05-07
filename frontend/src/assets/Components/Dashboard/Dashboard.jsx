import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../../Provider/AuthProvider';
import {
    ShoppingBagIcon,
    HeartIcon,
    CurrencyBangladeshiIcon,
    StarIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon,
    BellIcon,
    Cog6ToothIcon,
    ArrowRightOnRectangleIcon,
    UserCircleIcon,
    HomeIcon,
    ClipboardDocumentListIcon,
    ShoppingCartIcon,
    SparklesIcon,
    ChevronRightIcon,
    EyeIcon,
    ArrowUpIcon,
} from '@heroicons/react/24/outline';
import { CheckCircleIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';


// --- Mock Data ---
const recentOrders = [
    { id: '#ORD-001', item: 'Red Bridal Lehenga', category: 'Bride', date: '24 Feb 2026', status: 'Delivered', price: 36000 },
    { id: '#ORD-002', item: 'Royal Sherwani', category: 'Groom', date: '22 March 2026', status: 'Processing', price: 28500 },
    { id: '#ORD-003', item: 'Golden Zari Lehenga', category: 'Bride', date: '20 April 2026', status: 'Delivered', price: 39000 },
    { id: '#ORD-004', item: 'Formal Suit', category: 'Groom', date: '18 Jan 2026', status: 'Cancelled', price: 24000 },
    { id: '#ORD-005', item: 'Banarasi Bridal Saree', category: 'Bride', date: '15 Feb 2026', status: 'Delivered', price: 30000 },
];


const topProducts = [
    { name: 'Red Bridal Lehenga', rented: 48, revenue: 576000, trend: 'up' },
    { name: 'Royal Sherwani', rented: 35, revenue: 332500, trend: 'up' },
    { name: 'Golden Zari Lehenga', rented: 29, revenue: 377000, trend: 'down' },
    { name: 'Banarasi Bridal Saree', rented: 26, revenue: 260000, trend: 'up' },
    { name: 'Reception Designer Gown', rented: 22, revenue: 308000, trend: 'down' },
];


const monthlyRevenue = [
    { month: 'Jan', revenue: 125000 },
    { month: 'Feb', revenue: 198000 },
    { month: 'Mar', revenue: 275000 },
    { month: 'Apr', revenue: 312000 },
    { month: 'May', revenue: 489000 },
    { month: 'Jun', revenue: 420000 },
];


const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue));


const StatCard = ({ icon: Icon, label, value, change, changeType, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${changeType === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {changeType === 'up' ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                {change}
            </span>
        </div>
        <div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500 mt-1">{label}</p>
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


    const handleLogout = () => {
        logOut().then(() => navigate('/signin'));
    };


    return (
        <div className="min-h-screen bg-[#F4F6F9] font-sans flex">


            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#4A0E1B] text-white flex flex-col transition-all duration-300 shrink-0 sticky top-0 h-screen`}>
                {/* Logo */}
                <div className="p-6 border-b border-[#6A1A2A]">
                    {sidebarOpen ? (
                        <div>
                            <p className="text-xl font-bold text-[#F5C518]">Wedding Zone</p>
                            {user.email === 'tamanna.cse.iubat@gmail.com' ? <p className="text-xs text-[#C2A3A9] mt-0.5">Admin Dashboard</p> :
                                <p className="text-xs text-[#C2A3A9] mt-0.5">Customer Dashboard</p>
                            }


                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <SparklesIcon className="h-7 w-7 text-[#F5C518]" />
                        </div>
                    )}
                </div>


                {/* Nav Links */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {[
                        { icon: HomeIcon, label: 'Overview', active: true, to: '/dashboard' },
                        { icon: ShoppingCartIcon, label: 'Cart', active: false, to: '/cart' },
                        { icon: ClipboardDocumentListIcon, label: 'Orders', active: false, to: '/dashboard' },
                        { icon: ShoppingBagIcon, label: 'Products', active: false, to: '/' },
                        { icon: HeartIcon, label: 'Wishlist', active: false, to: '/' },
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
                            <UserCircleIcon className="h-9 w-9 text-[#F5C518]" />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold truncate">{user.email === 'tamanna.cse.iubat@gmail.com' ? user?.displayName || 'Admin' : user?.displayName || 'Customer'}</p>
                                <p className="text-[10px] text-[#C2A3A9] truncate">{user?.email}</p>
                            </div>
                            <button onClick={handleLogout} title="Logout">
                                <ArrowRightOnRectangleIcon className="h-5 w-5 text-[#C2A3A9] hover:text-white" />
                            </button>
                        </div>
                    ) : (
                        <button onClick={handleLogout} className="flex justify-center w-full" title="Logout">
                            <ArrowRightOnRectangleIcon className="h-5 w-5 text-[#C2A3A9] hover:text-white" />
                        </button>
                    )}
                </div>
            </aside>


            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0">


                {/* Top Bar */}
                <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                    <div className="flex items-center gap-4">
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
                        <nav className="flex items-center text-sm text-gray-500 space-x-2">
                            <Link to="/" className="hover:text-gray-800">Home</Link>
                            <ChevronRightIcon className="h-4 w-4" />
                            <span className="text-[#6A0D25] font-medium">Dashboard</span>
                        </nav>
                    </div>


                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
                            <BellIcon className="h-5 w-5 text-gray-600" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                            <Cog6ToothIcon className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                            <UserCircleIcon className="h-8 w-8 text-[#6A0D25]" />
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-800 leading-none">{user.email === 'tamanna.cse.iubat@gmail.com' ? user?.displayName || 'Admin' : user?.displayName || 'Customer'}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{user.email === 'tamanna.cse.iubat@gmail.com' ? user?.displayName || 'Administration' : user?.displayName || 'Customer Panel'}</p>
                            </div>
                        </div>
                    </div>
                </header>


                <main className="flex-1 p-6 space-y-6">


                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                            <p className="text-sm text-gray-500 mt-1">Welcome back, {user.email === 'tamanna.cse.iubat@gmail.com' ? user?.displayName || 'Admin' : user?.displayName || 'Customer'}! Here's what's happening.</p>
                        </div>
                        <div className="flex gap-2 items-center text-sm bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-600">
                            <span>May 2026</span>
                        </div>
                    </div>


                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                        <StatCard
                            icon={CurrencyBangladeshiIcon}
                            label="Total Revenue"
                            value="৳ 18,19,000"
                            change="+12.5%"
                            changeType="up"
                            color="bg-[#4A0E1B]"
                        />
                        <StatCard
                            icon={ShoppingBagIcon}
                            label="Total Rentals"
                            value="1,284"
                            change="+8.1%"
                            changeType="up"
                            color="bg-[#B88E2F]"
                        />
                        <StatCard
                            icon={UserCircleIcon}
                            label="Active Customers"
                            value="432"
                            change="-2.4%"
                            changeType="down"
                            color="bg-indigo-500"
                        />
                        <StatCard
                            icon={StarIcon}
                            label="Avg. Rating"
                            value="4.8 / 5"
                            change="+0.3"
                            changeType="up"
                            color="bg-emerald-500"
                        />
                    </div>


                    {/* Middle Row: Chart + Top Products */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">


                        {/* Revenue Chart */}
                        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="font-bold text-gray-800">Monthly Revenue</h2>
                                    <p className="text-xs text-gray-400 mt-0.5">Jan – Jun 2024</p>
                                </div>
                                <span className="flex items-center gap-1 text-xs bg-green-50 text-green-600 font-semibold px-2.5 py-1 rounded-full">
                                    <ArrowUpIcon className="h-3 w-3" /> +23% vs last period
                                </span>
                            </div>


                            {/* Bar Chart */}
                            <div className="flex items-end gap-4 h-44">
                                {monthlyRevenue.map((m) => (
                                    <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                                        <span className="text-[10px] text-gray-400 font-medium">৳{(m.revenue / 1000).toFixed(0)}k</span>
                                        <div
                                            className="w-full rounded-t-lg bg-[#4A0E1B] hover:bg-[#F5C518] transition-colors duration-200 cursor-pointer"
                                            style={{ height: `${(m.revenue / maxRevenue) * 140}px` }}
                                            title={`৳${m.revenue.toLocaleString()}`}
                                        ></div>
                                        <span className="text-xs text-gray-500">{m.month}</span>
                                    </div>
                                ))}
                            </div>
                        </div>


                        {/* Top Products */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="font-bold text-gray-800">Top Products</h2>
                                <Link to="/" className="text-xs text-[#6A0D25] font-semibold hover:underline flex items-center gap-1">
                                    View All <ChevronRightIcon className="h-3 w-3" />
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
                                            {p.trend === 'up' ? <ArrowTrendingUpIcon className="h-3 w-3" /> : <ArrowTrendingDownIcon className="h-3 w-3" />}
                                            ৳{(p.revenue / 1000).toFixed(0)}k
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>


                    {/* Bottom Row: Recent Orders + Cart Summary */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">


                        {/* Recent Orders Table */}
                        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                <h2 className="font-bold text-gray-800">Recent Orders</h2>
                                <Link to="/" className="text-xs text-[#6A0D25] font-semibold hover:underline flex items-center gap-1">
                                    View All <ChevronRightIcon className="h-3 w-3" />
                                </Link>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm">
                                    <thead className="bg-[#FDFBF7]">
                                        <tr>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Item</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
                                            <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                                            <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {recentOrders.map((order) => (
                                            <tr key={order.id} className="hover:bg-gray-50 transition">
                                                <td className="px-6 py-4 text-[#6A0D25] font-medium">{order.id}</td>
                                                <td className="px-6 py-4">
                                                    <p className="font-medium text-gray-800">{order.item}</p>
                                                    <p className="text-xs text-gray-400">{order.category}</p>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                                <td className="px-6 py-4">{statusBadge(order.status)}</td>
                                                <td className="px-6 py-4 text-right font-bold text-gray-800">৳{order.price.toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>


                        {/* Cart & Quick Actions */}
                        <div className="space-y-5">
                            {/* Current Cart */}
                            <div className="bg-[#4A0E1B] text-white rounded-2xl p-6 shadow-md">
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
                                    <EyeIcon className="h-4 w-4" />
                                    View Cart
                                </Link>
                            </div>


                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <Link to="/" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FDFBF7] border border-gray-100 transition">
                                        <ShoppingBagIcon className="h-5 w-5 text-[#6A0D25]" />
                                        <span className="text-sm font-medium text-gray-700">Browse Products</span>
                                        <ChevronRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
                                    </Link>
                                    <Link to="/cart" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FDFBF7] border border-gray-100 transition">
                                        <ShoppingCartIcon className="h-5 w-5 text-[#6A0D25]" />
                                        <span className="text-sm font-medium text-gray-700">Go to Cart</span>
                                        <ChevronRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
                                    </Link>
                                    <Link to="/checkout" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FDFBF7] border border-gray-100 transition">
                                        <ClipboardDocumentListIcon className="h-5 w-5 text-[#6A0D25]" />
                                        <span className="text-sm font-medium text-gray-700">Checkout</span>
                                        <ChevronRightIcon className="h-4 w-4 text-gray-400 ml-auto" />
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 border border-gray-100 transition">
                                        <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-500" />
                                        <span className="text-sm font-medium text-red-500">Sign Out</span>
                                        <ChevronRightIcon className="h-4 w-4 text-red-300 ml-auto" />
                                    </button>
                                </div>
                            </div>
                        </div>


                    </div>
                </main>
            </div>
        </div>
    );
};


export default Dashboard;


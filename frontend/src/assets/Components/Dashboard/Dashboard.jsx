import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
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
} from 'lucide-react';


// Real data will be calculated in the component


const StatCard = ({ icon: Icon, label, value, change, changeType, color }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-4">
        <div className="flex justify-between items-start">
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="h-6 w-6 text-white" />
            </div>
            <span className={`flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-full ${changeType === 'up' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                {changeType === 'up' ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
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
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch ALL orders for Admin view
        const orders = JSON.parse(localStorage.getItem('wedding_orders') || '[]');
        setAllOrders(orders);
        setLoading(false);
    }, []);

    const handleLogout = () => {
        logOut().then(() => navigate('/signin'));
    };

    // Calculate Real Stats
    const totalRevenue = allOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    const totalRentals = allOrders.length;
    const activeCustomers = new Set(allOrders.map(o => o.customerEmail)).size;
    // const avgRating = "4.9 / 5"; // Placeholder for now

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

    // Mock Monthly Revenue based on real data (distributing it for visualization)
    const monthlyRevenue = [
        { month: 'Jan', revenue: totalRevenue * 0.1 },
        { month: 'Feb', revenue: totalRevenue * 0.15 },
        { month: 'Mar', revenue: totalRevenue * 0.2 },
        { month: 'Apr', revenue: totalRevenue * 0.25 },
        { month: 'May', revenue: totalRevenue * 0.3 },
    ];
    const maxRevenue = Math.max(...monthlyRevenue.map(m => m.revenue)) || 1;


    if (loading || !user) {
        return <div className="flex justify-center items-center h-screen bg-[#F4F6F9]">
            <span className="loading loading-spinner loading-lg text-accent"></span>
        </div>;
    }

    return (
        <div className="min-h-screen bg-[#F4F6F9] font-sans flex">


            {/* Sidebar */}
            <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-[#4A0E1B] text-white flex flex-col transition-all duration-300 shrink-0 sticky top-0 h-screen`}>
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
                            <SparklesIcon className="h-7 w-7 text-[#F5C518]" />
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
                            <ChevronRight className="h-4 w-4" />
                            <span className="text-[#6A0D25] font-medium">Dashboard</span>
                        </nav>
                    </div>


                    <div className="flex items-center gap-3">
                        <button className="relative p-2 rounded-lg hover:bg-gray-100 transition">
                            <Bell className="h-5 w-5 text-gray-600" />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
                        </button>
                        <button className="p-2 rounded-lg hover:bg-gray-100 transition">
                            <Settings className="h-5 w-5 text-gray-600" />
                        </button>
                        <div className="flex items-center gap-2 pl-3 border-l border-gray-200">
                            <UserCircle className="h-8 w-8 text-[#6A0D25]" />
                            <div className="hidden sm:block">
                                <p className="text-sm font-medium text-gray-800 leading-none">{user?.email === 'tamanna.cse.iubat@gmail.com' ? user?.displayName || 'Admin' : user?.displayName || 'Customer'}</p>
                                <p className="text-xs text-gray-400 mt-0.5">{user?.email === 'tamanna.cse.iubat@gmail.com' ? user?.displayName || 'Administration' : user?.displayName || 'Customer Panel'}</p>
                            </div>
                        </div>
                    </div>
                </header>


                <main className="flex-1 p-6 space-y-6">


                    {/* Page Header */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
                            <p className="text-sm text-gray-500 mt-1">Welcome back, {user?.email === 'tamanna.cse.iubat@gmail.com' ? user?.displayName || 'Admin' : user?.displayName || 'Customer'}! Here's what's happening.</p>
                        </div>
                        <div className="flex gap-2 items-center text-sm bg-white border border-gray-200 rounded-xl px-4 py-2 text-gray-600">
                            <span>May 2026</span>
                        </div>
                    </div>


                    {/* Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
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
                        {/* <StatCard
                            icon={Star}
                            label="Avg. Rating"
                            value={avgRating}
                            change="+0.3"
                            changeType="up"
                            color="bg-emerald-500"
                        /> */}
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
                                    <ArrowUp className="h-3 w-3" /> +23% vs last period
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
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">


                        {/* Recent Orders Table */}
                        <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
                                <h2 className="font-bold text-gray-800">Recent Orders</h2>
                                <Link to="/" className="text-xs text-[#6A0D25] font-semibold hover:underline flex items-center gap-1">
                                    View All <ChevronRight className="h-3 w-3" />
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
                                        {allOrders.length === 0 ? (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-10 text-center text-gray-400 italic">No orders found in the system yet.</td>
                                            </tr>
                                        ) : (
                                            allOrders.slice(0, 10).map((order) => (
                                                <tr key={order.orderId} className="hover:bg-gray-50 transition">
                                                    <td className="px-6 py-4 text-[#6A0D25] font-medium">{order.orderId}</td>
                                                    <td className="px-6 py-4">
                                                        <p className="font-medium text-gray-800">{order.items[0]?.name || 'N/A'}</p>
                                                        <p className="text-xs text-gray-400">{order.customerEmail}</p>
                                                    </td>
                                                    <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                                    <td className="px-6 py-4">{statusBadge(order.status)}</td>
                                                    <td className="px-6 py-4 text-right font-bold text-gray-800">৳{order.totalAmount.toLocaleString()}</td>
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
                                    <Eye className="h-4 w-4" />
                                    View Cart
                                </Link>
                            </div>


                            {/* Quick Actions */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                <h2 className="font-bold text-gray-800 mb-4">Quick Actions</h2>
                                <div className="space-y-3">
                                    <Link to="/admin/inventory" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FDFBF7] border border-gray-100 transition">
                                        <ShoppingBag className="h-5 w-5 text-[#6A0D25]" />
                                        <span className="text-sm font-medium text-gray-700">Browse Products</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                                    </Link>
                                    <Link to="/cart" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FDFBF7] border border-gray-100 transition">
                                        <ShoppingCart className="h-5 w-5 text-[#6A0D25]" />
                                        <span className="text-sm font-medium text-gray-700">Go to Cart</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                                    </Link>
                                    <Link to="/checkout" className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#FDFBF7] border border-gray-100 transition">
                                        <ClipboardList className="h-5 w-5 text-[#6A0D25]" />
                                        <span className="text-sm font-medium text-gray-700">Checkout</span>
                                        <ChevronRight className="h-4 w-4 text-gray-400 ml-auto" />
                                    </Link>
                                    <button onClick={handleLogout} className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-50 border border-gray-100 transition">
                                        <LogOut className="h-5 w-5 text-red-500" />
                                        <span className="text-sm font-medium text-red-500">Sign Out</span>
                                        <ChevronRight className="h-4 w-4 text-red-300 ml-auto" />
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


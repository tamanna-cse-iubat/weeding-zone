import React, { useContext, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Provider/AuthProvider';
import {
    LayoutDashboard,
    ShoppingBag,
    History,
    Heart,
    User,
    MapPin,
    CreditCard,
    Bell,
    LifeBuoy,
    LogOut,
    ChevronRight,
    Search,
    Star,
    Award,
    TrendingUp,
    CheckCircle,
    Clock,
} from 'lucide-react'; 
import { Link } from 'react-router';

const CustomerDashboard = () => {
    const { user, logOut, manageUserProfile, wishlist } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Profile Editing State
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.displayName || '',
        phone: '+880 1712 345678' // Mock phone for now
    });
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        // Fetch orders from localStorage
        const allOrders = JSON.parse(localStorage.getItem('wedding_orders') || '[]');
        // Filter orders for the current user
        const userOrders = allOrders.filter(order => order.customerEmail === user?.email);
        setOrders(userOrders);
        setLoading(false);
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setUpdating(true);
        try {
            await manageUserProfile(formData.name, user?.photoURL);
            setIsEditing(false);
            // In a real app, user object would auto-update via AuthProvider's listener
        } catch (error) {
            console.error("Failed to update profile:", error);
            Swal.fire({
                title: 'Update Failed',
                text: 'There was an error updating your profile. Please try again.',
                icon: 'error',
                confirmButtonColor: '#4A0E0E'
            });
        } finally {
            setUpdating(false);
        }
    };

    // Calculate real stats
    const stats = [
        { 
            label: 'Total Orders', 
            value: orders.length.toString(), 
            icon: ShoppingBag, 
            color: 'bg-rose-50 text-rose-600' 
        },
        { 
            label: 'Active Rentals', 
            value: orders.filter(o => o.status === 'Active Rental').length.toString(), 
            icon: Clock, 
            color: 'bg-blue-50 text-blue-600' 
        },
        { 
            label: 'Wishlist Items', 
            value: wishlist.length.toString(), 
            icon: Heart, 
            color: 'bg-purple-50 text-purple-600' 
        },
        { 
            label: 'Reward Points', 
            value: (orders.length * 50).toString(), 
            icon: Award, 
            color: 'bg-amber-50 text-amber-600' 
        },
    ];

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Delivered': return 'bg-green-100 text-green-700';
            case 'Active Rental': return 'bg-amber-100 text-amber-700';
            case 'Pending': return 'bg-blue-100 text-blue-700';
            default: return 'bg-gray-100 text-gray-700';
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFBF9] flex flex-col md:flex-row font-sans">
            {/* Sidebar */}
            <aside className="w-full md:w-72 bg-white border-r border-gray-100 flex flex-col shrink-0">
                <div className="p-6">
                    <div className="bg-[#4A0E0E] rounded-2xl p-6 text-white relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-8 -mt-8 blur-2xl"></div>
                        <div className="relative flex flex-col items-center text-center">
                            <div className="w-16 h-16 rounded-full bg-gray-200 border-2 border-white/20 mb-3 flex items-center justify-center overflow-hidden">
                                <User className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="font-bold text-lg">{user?.displayName || 'Guest User'}</h3>
                            <p className="text-white/70 text-xs truncate w-full">{user?.email || 'guest@example.com'}</p>
                            <div className="mt-3 flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full border border-white/10">
                                <Award className="w-3.5 h-3.5 text-[#D4AF37]" />
                                <span className="text-[10px] font-semibold text-[#D4AF37] uppercase tracking-wider">Premium Member</span>
                            </div>
                        </div>
                    </div>
                </div>

                <nav className="flex-1 px-4 pb-6 space-y-1">
                    {[
                        { icon: LayoutDashboard, label: 'Dashboard', active: true, to: '/customer-dashboard' },
                        { icon: ShoppingBag, label: 'My Orders', to: '/customer-dashboard' },
                        { icon: History, label: 'My Rentals', to: '/customer-dashboard' },
                        { icon: Heart, label: 'Wishlist', to: '/wishlist' },
                        { icon: User, label: 'My Profile', to: '/customer-dashboard' },
                        { icon: MapPin, label: 'Address Book', to: '/customer-dashboard' },
                        { icon: CreditCard, label: 'Payment Methods', to: '/customer-dashboard' },
                        { icon: Bell, label: 'Notifications', to: '/customer-dashboard' },
                        { icon: LifeBuoy, label: 'Support', to: 'https://wa.me/+8801816697212' },
                    ].map((item, idx) => (
                        <Link
                            key={idx}
                            to={item.to}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                                item.active 
                                ? 'bg-rose-50 text-[#4A0E0E] font-semibold' 
                                : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                            }`}
                        >
                            <item.icon className={`w-5 h-5 ${item.active ? 'text-[#4A0E0E]' : 'text-gray-400'}`} />
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    ))}
                    
                    <button 
                        onClick={logOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-all mt-4"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="text-sm font-medium">Logout</span>
                    </button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                {/* Header */}
                <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
                    <div>
                        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">Welcome back,</p>
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                            {user?.displayName?.split(' ')[0] || 'User'} 
                            <span className="text-[#D4AF37]">✨</span>
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-full px-4 py-2">
                            <Search className="w-4 h-4 text-gray-400" />
                            <input 
                                type="text" 
                                placeholder="Search outfits..." 
                                className="bg-transparent border-none focus:ring-0 text-sm w-48"
                            />
                        </div>
                        <button className="p-2.5 bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 transition relative">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                        </button>
                    </div>
                </header>

                <div className="p-6 space-y-8 max-w-7xl mx-auto">
                    {/* Special Offer Banner */}
                    <div className="bg-[#4A0E0E] rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_50%_50%,#fff,transparent)]"></div>
                        <div className="relative z-1 space-y-4 max-w-md">
                            <h2 className="text-[#D4AF37] font-serif text-3xl font-bold italic">Special Offer!</h2>
                            <p className="text-white/80 text-lg">Get 15% OFF on your next rental</p>
                            <div className="flex items-center gap-3">
                                <span className="text-xs text-white/60 uppercase tracking-widest">Use Code:</span>
                                <span className="bg-white/10 border border-white/20 px-4 py-1.5 rounded-lg font-mono font-bold tracking-wider">WZ15OFF</span>
                            </div>
                        </div>
                        <div className="relative z-1">
                            <button className="bg-[#D4AF37] hover:bg-[#C19B2E] text-[#4A0E0E] p-4 rounded-2xl transition-transform hover:scale-110">
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                        {/* Decorative Shape */}
                        <div className="absolute right-0 bottom-0 w-64 h-64 bg-white/5 rounded-full -mb-32 -mr-16 blur-3xl"></div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex items-start justify-between">
                                    <div className={`p-3 rounded-xl ${stat.color}`}>
                                        <stat.icon className="w-6 h-6" />
                                    </div>
                                    <button className="text-gray-400 hover:text-rose-600 transition">
                                        <ChevronRight className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="mt-4">
                                    <h4 className="text-3xl font-bold text-gray-800">{stat.value}</h4>
                                    <p className="text-gray-400 text-sm mt-1">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Recent Orders */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xl font-bold text-gray-800">Recent Orders</h3>
                                <button className="text-rose-600 text-sm font-semibold hover:underline flex items-center gap-1">
                                    View All Orders <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                {orders.length === 0 ? (
                                    <div className="p-12 text-center text-gray-400">
                                        <ShoppingBag className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                        <p>No orders found yet.</p>
                                        <p className="text-xs">Once you place an order, it will appear here.</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-50">
                                        {orders.map((order, idx) => (
                                            <div key={idx} className="p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50/50 transition">
                                                <div className={`w-20 h-24 bg-rose-50 rounded-xl shrink-0 flex items-center justify-center text-rose-200 overflow-hidden`}>
                                                    {order.items[0]?.photoURL ? (
                                                        <img src={order.items[0].photoURL} alt={order.items[0].name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <ShoppingBag className="w-8 h-8" />
                                                    )}
                                                </div>
                                                <div className="flex-1 space-y-1 text-center sm:text-left">
                                                    <h4 className="font-bold text-gray-800 text-lg">
                                                        {order.items[0]?.name || 'Unknown Item'}
                                                        {order.items.length > 1 && <span className="text-xs text-rose-500 ml-2">+{order.items.length - 1} more</span>}
                                                    </h4>
                                                    <p className="text-gray-400 text-sm">Order ID: {order.orderId}</p>
                                                    <p className="text-gray-400 text-xs">{order.date}</p>
                                                </div>
                                                <div className="flex flex-col items-center sm:items-end gap-3">
                                                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusStyle(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                    <span className="font-bold text-gray-800">৳ {order.totalAmount.toLocaleString()}</span>
                                                    <button className="px-4 py-2 border border-rose-200 text-rose-600 rounded-xl text-sm font-bold hover:bg-rose-50 transition">
                                                        View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Profile Summary & Sidebar Cards */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 relative overflow-hidden">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-bold text-gray-800">Profile Summary</h3>
                                    {!isEditing && (
                                        <button 
                                            onClick={() => setIsEditing(true)}
                                            className="text-rose-600 text-xs font-bold hover:underline flex items-center gap-1"
                                        >
                                            <TrendingUp className="w-3 h-3" /> Edit Profile
                                        </button>
                                    )}
                                </div>
                                
                                <form onSubmit={handleUpdateProfile} className="space-y-4">
                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">Name</p>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-300"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                required
                                            />
                                        ) : (
                                            <p className="text-gray-800 text-sm font-medium">{user?.displayName || 'N/A'}</p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">Email</p>
                                        <p className="text-gray-500 text-sm font-medium">{user?.email || 'N/A'}</p>
                                        {isEditing && <p className="text-[10px] text-gray-400 italic mt-1">Email cannot be changed.</p>}
                                    </div>

                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">Phone</p>
                                        {isEditing ? (
                                            <input 
                                                type="text" 
                                                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-rose-300"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                            />
                                        ) : (
                                            <p className="text-gray-800 text-sm font-medium">{formData.phone}</p>
                                        )}
                                    </div>

                                    <div>
                                        <p className="text-gray-400 text-[10px] uppercase tracking-wider font-bold mb-1">Member Since</p>
                                        <p className="text-gray-800 text-sm font-medium">May 10, 2024</p>
                                    </div>

                                    {isEditing && (
                                        <div className="flex gap-2 pt-2">
                                            <button 
                                                type="submit"
                                                disabled={updating}
                                                className="flex-1 bg-rose-600 text-white text-xs font-bold py-2 rounded-lg hover:bg-rose-700 transition disabled:opacity-50"
                                            >
                                                {updating ? 'Saving...' : 'Save Changes'}
                                            </button>
                                            <button 
                                                type="button"
                                                onClick={() => {
                                                    setIsEditing(false);
                                                    setFormData({ name: user?.displayName || '', phone: '+880 1712 345678' });
                                                }}
                                                className="flex-1 bg-gray-100 text-gray-600 text-xs font-bold py-2 rounded-lg hover:bg-gray-200 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </form>
                                
                                {/* Decorative floral pattern placeholder */}
                                <div className="absolute bottom-0 right-0 w-24 h-24 opacity-5 pointer-events-none">
                                    <div className="w-full h-full border-4 border-[#4A0E0E] rounded-full -mr-12 -mb-12"></div>
                                </div>
                            </div>

                            <div className="bg-[#4A0E0E] rounded-2xl p-6 text-white text-center space-y-4">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mx-auto">
                                    <LifeBuoy className="w-6 h-6 text-[#D4AF37]" />
                                </div>
                                <div>
                                    <h3 className="font-bold">Need Help?</h3>
                                    <p className="text-white/60 text-xs mt-1">Our support team is here to help</p>
                                </div>
                                <Link to={'https://wa.me/+8801816697212'}>
                                    <button className="w-full bg-[#D4AF37] text-[#4A0E0E] py-3 rounded-xl font-bold text-sm hover:bg-[#C19B2E] transition flex items-center justify-center gap-2">
                                        Contact Support  <ChevronRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Footer Badges */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
                        {[
                            { label: 'Free Delivery', sub: 'On all orders', color: 'bg-orange-50 text-orange-600' },
                            { label: 'Easy Returns', sub: 'Within 7 days', color: 'bg-amber-50 text-amber-600' },
                            { label: 'Secure Payment', sub: '100% secure', color: 'bg-blue-50 text-blue-600' },
                            { label: 'Best Quality', sub: 'Premium outfits', color: 'bg-rose-50 text-rose-600' },
                        ].map((badge, idx) => (
                            <div key={idx} className="flex flex-col items-center p-4 bg-white rounded-2xl border border-gray-50 shadow-sm">
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${badge.color}`}>
                                    <CheckCircle className="w-5 h-5" />
                                </div>
                                <h5 className="text-xs font-bold text-gray-800">{badge.label}</h5>
                                <p className="text-[10px] text-gray-400">{badge.sub}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default CustomerDashboard;
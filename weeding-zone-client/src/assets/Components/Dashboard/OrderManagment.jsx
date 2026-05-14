import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Search, Package, Truck, CheckCircle, Clock, X, Plus, Trash2,
    Tag, ChevronDown, Eye, TicketPercent, FileDown
} from 'lucide-react';
import Swal from 'sweetalert2';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ── helpers ──────────────────────────────────────────────────────────────────
const STATUS_FLOW = ['Pending', 'Confirmed', 'Shipped', 'Delivered'];

const STATUS_STYLES = {
    Pending:   { bg: 'bg-yellow-50',  text: 'text-yellow-700', border: 'border-yellow-200', icon: Clock },
    Confirmed: { bg: 'bg-blue-50',    text: 'text-blue-700',   border: 'border-blue-200',   icon: Package },
    Shipped:   { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200', icon: Truck },
    Delivered: { bg: 'bg-green-50',   text: 'text-green-700',  border: 'border-green-200',  icon: CheckCircle },
    Cancelled: { bg: 'bg-red-50',     text: 'text-red-600',    border: 'border-red-200',    icon: X },
};

const StatusBadge = ({ status }) => {
    const s = STATUS_STYLES[status] || STATUS_STYLES.Pending;
    const Icon = s.icon;
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${s.bg} ${s.text} ${s.border}`}>
            <Icon className="w-3.5 h-3.5" /> {status}
        </span>
    );
};

// ── main component ────────────────────────────────────────────────────────────
const OrderManagment = () => {
    const [orders, setOrders]           = useState([]);
    const [filtered, setFiltered]       = useState([]);
    const [search, setSearch]           = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCouponPanel, setShowCouponPanel] = useState(false);

    // Coupon state
    const [coupons, setCoupons] = useState(() => {
        const saved = localStorage.getItem('wz_coupons');
        return saved ? JSON.parse(saved) : [
            { id: 1, code: 'WEDDING10', discount: 10, type: 'percent', active: true },
            { id: 2, code: 'FLAT500',   discount: 500, type: 'flat',   active: true },
        ];
    });
    const [couponForm, setCouponForm] = useState({ code: '', discount: '', type: 'percent', active: true });

    // Load orders from localStorage
    useEffect(() => {
        const loadOrders = async () => {
            try {
                const res = await axios.get('/api/orders');
                const normalised = res.data.map(o => ({ ...o, status: o.status || 'Pending' }));
                setOrders(normalised);
                setFiltered(normalised);
            } catch (error) {
                console.error('Failed to load orders:', error);
                setOrders([]);
                setFiltered([]);
            }
        };
        loadOrders();
    }, []);

    // Filter orders
    useEffect(() => {
        let result = [...orders];
        if (statusFilter !== 'All') result = result.filter(o => o.status === statusFilter);
        if (search.trim()) {
            const q = search.toLowerCase();
            result = result.filter(o =>
                o.orderId?.toLowerCase().includes(q) ||
                o.customerEmail?.toLowerCase().includes(q) ||
                o.customerName?.toLowerCase().includes(q)
            );
        }
        setFiltered(result);
    }, [search, statusFilter, orders]);

    // ── PDF Report ──────────────────────────────────────────────────────────
    const generateReport = () => {
        // Calculate stats locally
        const reportStats = {
            total: orders.length,
            pending: orders.filter(o => o.status === 'Pending').length,
            confirmed: orders.filter(o => o.status === 'Confirmed').length,
            shipped: orders.filter(o => o.status === 'Shipped').length,
            delivered: orders.filter(o => o.status === 'Delivered').length,
            revenue: orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.totalAmount || 0), 0),
        };

        const doc = new jsPDF();
        const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        const brandColor = [74, 14, 27]; // accent
        const goldColor  = [245, 197, 24]; // #F5C518

        // ── Background header band
        doc.setFillColor(...brandColor);
        doc.rect(0, 0, 210, 38, 'F');

        // ── Title
        doc.setTextColor(245, 197, 24);
        doc.setFontSize(22);
        doc.setFont('helvetica', 'bold');
        doc.text('Wedding Zone', 14, 16);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'normal');
        doc.text('Order Management Report', 14, 25);
        doc.text(`Generated: ${date}`, 14, 32);

        // ── Stats summary boxes
        let y = 48;
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...brandColor);
        doc.text('Summary', 14, y);
        y += 6;

        const summaryData = [
            ['Total Orders', reportStats.total],
            ['Pending',      reportStats.pending],
            ['Confirmed',    reportStats.confirmed],
            ['Shipped',      reportStats.shipped],
            ['Delivered',    reportStats.delivered],
            ['Total Revenue', 'BDT ' + reportStats.revenue.toLocaleString()],
        ];

        autoTable(doc, {
            startY: y,
            head: [['Metric', 'Value']],
            body: summaryData,
            theme: 'grid',
            headStyles: { fillColor: brandColor, textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [253, 251, 247] },
            styles: { fontSize: 10 },
            columnStyles: { 1: { fontStyle: 'bold', halign: 'right' } },
            margin: { left: 14, right: 14 },
        });

        // ── Orders table
        y = doc.lastAutoTable.finalY + 12;
        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...brandColor);
        doc.text('All Orders', 14, y);

        const orderRows = orders.map(o => [
            o.orderId,
            o.customerName || o.customerEmail,
            o.date,
            `${o.items?.length ?? 0} item(s)`,
            'BDT ' + (o.totalAmount || 0).toLocaleString(),
            o.status,
        ]);

        autoTable(doc, {
            startY: y + 4,
            head: [['Order ID', 'Customer', 'Date', 'Items', 'Amount', 'Status']],
            body: orderRows.length ? orderRows : [['—', 'No orders yet', '', '', '', '']],
            theme: 'striped',
            headStyles: { fillColor: brandColor, textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [253, 251, 247] },
            styles: { fontSize: 9 },
            columnStyles: {
                0: { fontStyle: 'bold', textColor: brandColor },
                5: { fontStyle: 'bold' },
            },
            margin: { left: 14, right: 14 },
            didDrawCell: (data) => {
                if (data.section === 'body' && data.column.index === 5) {
                    const status = data.cell.raw;
                    const colorMap = {
                        Pending:   [254,240,138],
                        Confirmed: [219,234,254],
                        Shipped:   [233,213,255],
                        Delivered: [220,252,231],
                        Cancelled: [254,202,202],
                    };
                    if (colorMap[status]) {
                        doc.setFillColor(...colorMap[status]);
                        doc.rect(data.cell.x, data.cell.y, data.cell.width, data.cell.height, 'F');
                        doc.setTextColor(50, 50, 50);
                        doc.setFontSize(8);
                        doc.text(status, data.cell.x + 2, data.cell.y + data.cell.height / 2 + 1);
                    }
                }
            },
        });

        // ── Coupons table
        y = doc.lastAutoTable.finalY + 12;
        if (y > 260) { doc.addPage(); y = 20; }

        doc.setFontSize(13);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(...brandColor);
        doc.text('Active Coupons', 14, y);

        autoTable(doc, {
            startY: y + 4,
            head: [['Code', 'Discount', 'Type', 'Status']],
            body: coupons.length
                ? coupons.map(c => [c.code, c.type === 'percent' ? `${c.discount}%` : `BDT ${c.discount}`, c.type, c.active ? 'Active' : 'Inactive'])
                : [['—', 'No coupons', '', '']],
            theme: 'grid',
            headStyles: { fillColor: brandColor, textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [253, 251, 247] },
            styles: { fontSize: 9 },
            columnStyles: { 0: { fontStyle: 'bold', textColor: brandColor } },
            margin: { left: 14, right: 14 },
        });

        // ── Footer
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.setTextColor(160, 160, 160);
            doc.text(`Wedding Zone — Confidential | Page ${i} of ${pageCount}`, 14, 290);
        }

        doc.save(`WeddingZone_Report_${new Date().toISOString().slice(0,10)}.pdf`);
        Swal.fire({ icon: 'success', title: 'Report Downloaded!', text: 'Your PDF report has been saved.', timer: 1800, showConfirmButton: false });
    };

    const saveOrders = (updated) => {
        setOrders(updated);
    };

    // Persist coupons
    const saveCoupons = (updated) => {
        setCoupons(updated);
        localStorage.setItem('wz_coupons', JSON.stringify(updated));
    };

    // Update single order status
    const updateStatus = async (orderId, newStatus) => {
        // Optimistic update: update local state first
        const previousOrders = [...orders];
        const previousSelected = selectedOrder;
        const updated = orders.map(o => o.orderId === orderId ? { ...o, status: newStatus } : o);
        saveOrders(updated);
        if (selectedOrder?.orderId === orderId) setSelectedOrder(prev => ({ ...prev, status: newStatus }));
        Swal.fire({ icon: 'success', title: 'Status Updated', text: `Order ${orderId} → ${newStatus}`, timer: 1500, showConfirmButton: false });

        try {
            await axios.put(`/api/orders/${encodeURIComponent(orderId)}`, { status: newStatus });
        } catch (error) {
            console.error('Failed to update order status:', error);
            // Revert on failure
            saveOrders(previousOrders);
            if (previousSelected?.orderId === orderId) setSelectedOrder(previousSelected);
            Swal.fire({ icon: 'error', title: 'Update Failed', text: 'Unable to update order status. Changes reverted.', timer: 3000, showConfirmButton: false });
        }
    };

    const cancelOrder = (orderId) => {
        Swal.fire({ title: 'Cancel Order?', text: 'This will mark the order as Cancelled.', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Yes, cancel it' })
            .then(res => { if (res.isConfirmed) updateStatus(orderId, 'Cancelled'); });
    };

    // Coupon CRUD
    const addCoupon = () => {
        if (!couponForm.code || !couponForm.discount) return Swal.fire({ title: 'Error', text: 'Fill in all fields.', icon: 'error' });
        const newC = { ...couponForm, id: Date.now(), discount: Number(couponForm.discount) };
        saveCoupons([...coupons, newC]);
        setCouponForm({ code: '', discount: '', type: 'percent', active: true });
        Swal.fire({ icon: 'success', title: 'Coupon Added!', timer: 1200, showConfirmButton: false });
    };

    const toggleCoupon = (id) => saveCoupons(coupons.map(c => c.id === id ? { ...c, active: !c.active } : c));

    const deleteCoupon = (id) => {
        Swal.fire({ title: 'Delete Coupon?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33', confirmButtonText: 'Delete' })
            .then(res => { if (res.isConfirmed) saveCoupons(coupons.filter(c => c.id !== id)); });
    };

    // Stats
    const stats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        confirmed: orders.filter(o => o.status === 'Confirmed').length,
        shipped: orders.filter(o => o.status === 'Shipped').length,
        delivered: orders.filter(o => o.status === 'Delivered').length,
        revenue: orders.filter(o => o.status !== 'Cancelled').reduce((s, o) => s + (o.totalAmount || 0), 0),
    };

    return (
        <div className="min-h-screen bg-[#F4F6F9] p-6 font-sans">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* ── Header ── */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-[#4A0E1B]">Order Management</h1>
                        <p className="text-sm text-gray-500 mt-1">Manage all customer orders and delivery statuses.</p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={generateReport}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm bg-[#F5C518] text-[#4A0E1B] hover:bg-[#e6b800] transition shadow-sm"
                            title="Download PDF Report"
                        >
                            <FileDown className="w-4 h-4" /> Export Report
                        </button>
                        <button
                            onClick={() => setShowCouponPanel(p => !p)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition ${showCouponPanel ? 'bg-[#4A0E1B] text-white' : 'bg-white border border-gray-200 text-[#4A0E1B] hover:bg-[#4A0E1B] hover:text-white'}`}
                        >
                            <TicketPercent className="w-4 h-4" /> Manage Coupons
                        </button>
                    </div>
                </div>

                {/* ── Stat Cards ── */}
                <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-4">
                    {[
                        { label: 'Total Orders', value: stats.total,     color: 'bg-[#4A0E1B] text-white' },
                        { label: 'Pending',       value: stats.pending,   color: 'bg-yellow-50 text-yellow-700 border border-yellow-200' },
                        { label: 'Confirmed',     value: stats.confirmed, color: 'bg-blue-50 text-blue-700 border border-blue-200' },
                        { label: 'Shipped',       value: stats.shipped,   color: 'bg-purple-50 text-purple-700 border border-purple-200' },
                        { label: 'Delivered',     value: stats.delivered, color: 'bg-green-50 text-green-700 border border-green-200' },
                        { label: 'Revenue (৳)',   value: `৳${stats.revenue.toLocaleString()}`, color: 'bg-[#F5C518] text-[#4A0E1B] font-bold' },
                    ].map(c => (
                        <div key={c.label} className={`rounded-2xl p-4 shadow-sm text-center ${c.color}`}>
                            <p className="text-2xl font-bold">{c.value}</p>
                            <p className="text-xs mt-1 opacity-80">{c.label}</p>
                        </div>
                    ))}
                </div>

                {/* ── Coupon Panel ── */}
                {showCouponPanel && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h2 className="text-xl font-bold text-[#4A0E1B] flex items-center gap-2"><Tag className="w-5 h-5" /> Coupon Management</h2>
                        </div>

                        {/* Add Coupon Form */}
                        <div className="bg-[#FDFBF7] border border-[#F2ECE4] rounded-xl p-5 mb-6">
                            <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Create New Coupon</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                <input
                                    type="text"
                                    placeholder="Coupon Code (e.g. SAVE20)"
                                    value={couponForm.code}
                                    onChange={e => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                                    className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A0E1B]/20 text-sm"
                                />
                                <input
                                    type="number"
                                    placeholder="Discount Value"
                                    value={couponForm.discount}
                                    onChange={e => setCouponForm(p => ({ ...p, discount: e.target.value }))}
                                    className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A0E1B]/20 text-sm"
                                />
                                <select
                                    value={couponForm.type}
                                    onChange={e => setCouponForm(p => ({ ...p, type: e.target.value }))}
                                    className="px-4 py-2.5 rounded-xl bg-white border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4A0E1B]/20 text-sm"
                                >
                                    <option value="percent">Percentage (%)</option>
                                    <option value="flat">Flat Amount (৳)</option>
                                </select>
                                <button
                                    onClick={addCoupon}
                                    className="flex items-center justify-center gap-2 bg-[#4A0E1B] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#6A1A2A] transition"
                                >
                                    <Plus className="w-4 h-4" /> Add Coupon
                                </button>
                            </div>
                        </div>

                        {/* Coupon List */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        {['Code', 'Discount', 'Type', 'Status', 'Actions'].map(h => (
                                            <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-50">
                                    {coupons.length === 0 ? (
                                        <tr><td colSpan="5" className="text-center py-8 text-gray-400 italic">No coupons created yet.</td></tr>
                                    ) : coupons.map(c => (
                                        <tr key={c.id} className="hover:bg-gray-50 transition">
                                            <td className="px-5 py-3">
                                                <span className="font-mono bg-[#4A0E1B]/10 text-[#4A0E1B] px-3 py-1 rounded-lg font-bold tracking-wider text-xs">{c.code}</span>
                                            </td>
                                            <td className="px-5 py-3 font-bold text-gray-800">
                                                {c.type === 'percent' ? `${c.discount}%` : `৳${c.discount}`}
                                            </td>
                                            <td className="px-5 py-3 text-gray-500 capitalize">{c.type}</td>
                                            <td className="px-5 py-3">
                                                <button
                                                    onClick={() => toggleCoupon(c.id)}
                                                    className={`text-xs font-semibold px-3 py-1 rounded-full border transition ${c.active ? 'bg-green-50 text-green-700 border-green-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200' : 'bg-red-50 text-red-600 border-red-200 hover:bg-green-50 hover:text-green-700 hover:border-green-200'}`}
                                                >
                                                    {c.active ? 'Active' : 'Inactive'}
                                                </button>
                                            </td>
                                            <td className="px-5 py-3">
                                                <button onClick={() => deleteCoupon(c.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* ── Filters ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search by Order ID, customer name or email..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#4A0E1B]/20"
                        />
                    </div>
                    <div className="flex gap-2 flex-wrap">
                        {['All', ...STATUS_FLOW, 'Cancelled'].map(s => (
                            <button
                                key={s}
                                onClick={() => setStatusFilter(s)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${statusFilter === s ? 'bg-[#4A0E1B] text-white border-[#4A0E1B]' : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-[#4A0E1B] hover:text-[#4A0E1B]'}`}
                            >
                                {s}
                            </button>
                        ))}
                    </div>
                </div>

                {/* ── Orders Table ── */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-[#FDFBF7] border-b border-gray-100">
                                <tr>
                                    {['Order ID', 'Customer', 'Items', 'Date', 'Amount', 'Status', 'Actions'].map(h => (
                                        <th key={h} className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filtered.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-14 text-gray-400 italic">
                                            <Package className="w-10 h-10 mx-auto mb-2 opacity-30" />
                                            No orders found.
                                        </td>
                                    </tr>
                                ) : filtered.map(order => (
                                    <tr key={order.orderId} className="hover:bg-gray-50 transition">
                                        <td className="px-5 py-4 font-mono font-bold text-[#6A0D25] whitespace-nowrap">{order.orderId}</td>
                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-800">{order.customerName || '—'}</p>
                                            <p className="text-xs text-gray-400">{order.customerEmail}</p>
                                        </td>
                                        <td className="px-5 py-4 text-gray-600">{order.items?.length ?? 0} item(s)</td>
                                        <td className="px-5 py-4 text-gray-500 whitespace-nowrap">{order.date}</td>
                                        <td className="px-5 py-4 font-bold text-gray-800 whitespace-nowrap">৳{order.totalAmount?.toLocaleString()}</td>
                                        <td className="px-5 py-4"><StatusBadge status={order.status} /></td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => setSelectedOrder(order)}
                                                    className="p-2 text-[#4A0E1B] hover:bg-[#4A0E1B]/10 rounded-lg transition"
                                                    title="View Details"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                {order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                                                    <>
                                                        <div className="relative group">
                                                            <button className="flex items-center gap-1 px-3 py-1.5 bg-[#4A0E1B] text-white rounded-lg text-xs font-semibold hover:bg-[#6A1A2A] transition">
                                                                Update <ChevronDown className="w-3 h-3" />
                                                            </button>
                                                            <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lg border border-gray-100 z-20 hidden group-hover:block min-w-[130px]">
                                                                {STATUS_FLOW.filter(s => STATUS_FLOW.indexOf(s) > STATUS_FLOW.indexOf(order.status)).map(s => (
                                                                    <button
                                                                        key={s}
                                                                        onClick={() => updateStatus(order.orderId, s)}
                                                                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-[#FDFBF7] text-gray-700 hover:text-[#4A0E1B] font-medium flex items-center gap-2 transition"
                                                                    >
                                                                        {React.createElement(STATUS_STYLES[s].icon, { className: 'w-3.5 h-3.5' })}
                                                                        {s}
                                                                    </button>
                                                                ))}
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => cancelOrder(order.orderId)}
                                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                                                            title="Cancel Order"
                                                        >
                                                            <X className="w-4 h-4" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="px-5 py-3 border-t border-gray-100 text-xs text-gray-400">
                        Showing {filtered.length} of {orders.length} orders
                    </div>
                </div>
            </div>

            {/* ── Order Detail Modal ── */}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}>
                    <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
                        {/* Modal Header */}
                        <div className="bg-[#4A0E1B] text-white px-7 py-5 flex items-center justify-between">
                            <div>
                                <p className="text-xs text-[#C2A3A9] mb-0.5">Order Details</p>
                                <h2 className="text-xl font-bold font-mono">{selectedOrder.orderId}</h2>
                            </div>
                            <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/20 rounded-full transition">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-7 space-y-5 max-h-[70vh] overflow-y-auto">
                            {/* Customer */}
                            <div className="bg-[#FDFBF7] border border-[#F2ECE4] rounded-2xl p-4">
                                <p className="text-xs font-semibold text-gray-400 uppercase mb-2">Customer Info</p>
                                <p className="font-bold text-gray-800">{selectedOrder.customerName}</p>
                                <p className="text-sm text-gray-500">{selectedOrder.customerEmail}</p>
                                <p className="text-sm text-gray-500 mt-1">Date: {selectedOrder.date}</p>
                                <p className="text-sm text-gray-500">Payment: <span className="capitalize font-medium">{selectedOrder.paymentMethod}</span></p>
                            </div>

                            {/* Status Timeline */}
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Update Status</p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {STATUS_FLOW.map((s, i) => {
                                        const current = STATUS_FLOW.indexOf(selectedOrder.status);
                                        const done = i < current;
                                        const active = i === current;
                                        return (
                                            <React.Fragment key={s}>
                                                <button
                                                    onClick={() => selectedOrder.status !== 'Cancelled' && updateStatus(selectedOrder.orderId, s)}
                                                    disabled={selectedOrder.status === 'Cancelled'}
                                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition
                                                        ${active ? 'bg-[#4A0E1B] text-white border-[#4A0E1B]' : done ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200 hover:border-[#4A0E1B] hover:text-[#4A0E1B]'}`}
                                                >
                                                    {React.createElement(STATUS_STYLES[s].icon, { className: 'w-3.5 h-3.5' })}
                                                    {s}
                                                </button>
                                                {i < STATUS_FLOW.length - 1 && <div className="flex-1 h-px bg-gray-200 min-w-[12px]" />}
                                            </React.Fragment>
                                        );
                                    })}
                                </div>
                                <div className="mt-3 flex items-center gap-2">
                                    <StatusBadge status={selectedOrder.status} />
                                    {selectedOrder.status !== 'Cancelled' && selectedOrder.status !== 'Delivered' && (
                                        <button onClick={() => cancelOrder(selectedOrder.orderId)} className="text-xs text-red-500 hover:underline flex items-center gap-1">
                                            <X className="w-3 h-3" /> Cancel Order
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Items */}
                            <div>
                                <p className="text-xs font-semibold text-gray-400 uppercase mb-3">Items Ordered</p>
                                <div className="space-y-3">
                                    {selectedOrder.items?.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                                            <img src={item.photoURL} alt={item.name} className="w-12 h-12 rounded-lg object-cover border border-gray-200" />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-800 truncate text-sm">{item.name}</p>
                                                <p className="text-xs text-gray-500">৳{item.rent?.toLocaleString()} × {item.rent_for_days || 3} days</p>
                                                {item.selectedSize && <p className="text-xs text-gray-400">Size: {item.selectedSize}</p>}
                                            </div>
                                            <p className="font-bold text-[#4A0E1B] whitespace-nowrap">৳{(item.rent * (item.rent_for_days || 3)).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Total */}
                            <div className="bg-[#4A0E1B] text-white rounded-2xl p-4 flex items-center justify-between">
                                <span className="font-semibold">Total Amount</span>
                                <span className="text-2xl font-bold text-[#F5C518]">৳{selectedOrder.totalAmount?.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderManagment;
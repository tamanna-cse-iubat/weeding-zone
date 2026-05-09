import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Edit, Trash2, Search, X, Package, Tag, Layers, Calendar, DollarSign, Boxes, Ruler } from 'lucide-react';
import Swal from 'sweetalert2';

const InventoryManagement = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        type: '',
        occasion: '',
        rent_for_days: 3,
        rent: 0,
        size: [],
        stock: 0,
        photoURL: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            // In a real app, we would fetch from a database API.
            // For this project, we check localStorage first, then fallback to product.json
            const savedProducts = localStorage.getItem('managed_products');
            if (savedProducts) {
                setProducts(JSON.parse(savedProducts));
            } else {
                const res = await axios.get('/product.json');
                setProducts(res.data);
                localStorage.setItem('managed_products', JSON.stringify(res.data));
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            Swal.fire('Error', 'Failed to load products', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'rent' || name === 'stock' || name === 'rent_for_days' ? Number(value) : value
        }));
    };

    const handleSizeChange = (e) => {
        const sizes = e.target.value.split(',').map(s => s.trim());
        setFormData(prev => ({ ...prev, size: sizes }));
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setFormData({
            name: '',
            category: '',
            type: '',
            occasion: '',
            rent_for_days: 3,
            rent: 0,
            size: [],
            stock: 0,
            photoURL: ''
        });
        setIsModalOpen(true);
    };

    const openEditModal = (product) => {
        setEditingProduct(product);
        setFormData({ ...product });
        setIsModalOpen(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let updatedProducts;
        if (editingProduct) {
            updatedProducts = products.map(p => p.id === editingProduct.id ? { ...formData, id: p.id } : p);
            Swal.fire('Updated!', 'Product has been updated successfully.', 'success');
        } else {
            const newProduct = {
                ...formData,
                id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1
            };
            updatedProducts = [...products, newProduct];
            Swal.fire('Added!', 'New product has been added to inventory.', 'success');
        }
        setProducts(updatedProducts);
        localStorage.setItem('managed_products', JSON.stringify(updatedProducts));
        setIsModalOpen(false);
    };

    const handleDelete = (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedProducts = products.filter(p => p.id !== id);
                setProducts(updatedProducts);
                localStorage.setItem('managed_products', JSON.stringify(updatedProducts));
                Swal.fire('Deleted!', 'Product has been removed.', 'success');
            }
        });
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-10 text-center">Loading Inventory...</div>;

    return (
        <div className="p-6 md:p-10 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
                    <div>
                        <h1 className="text-4xl font-serif font-bold text-accent mb-2">Inventory Management</h1>
                        <p className="text-gray-500">Manage your product collection, stock, and pricing.</p>
                    </div>
                    <button 
                        onClick={openAddModal}
                        className="flex items-center justify-center gap-2 bg-accent text-white px-6 py-3 rounded-xl font-bold hover:brightness-110 transition shadow-lg shadow-rose-200"
                    >
                        <Plus className="size-5" />
                        Add New Product
                    </button>
                </div>

                {/* Filters and Search */}
                <div className="bg-white p-4 rounded-2xl shadow-sm mb-8 flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 size-5" />
                        <input 
                            type="text" 
                            placeholder="Search by name or category..." 
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 border-none text-gray-700"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <span className="bg-rose-50 text-accent px-4 py-2 rounded-lg text-sm font-semibold border border-rose-100">
                            Total: {products.length} Products
                        </span>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Product</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Category</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Pricing</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600">Stock</th>
                                    <th className="px-6 py-4 font-semibold text-gray-600 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50/50 transition">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-4">
                                                <img 
                                                    src={product.photoURL || "https://i.ibb.co/SzZr84Z/logo.png"} 
                                                    alt="" 
                                                    className="size-12 rounded-lg object-cover bg-gray-100"
                                                />
                                                <div>
                                                    <p className="font-bold text-gray-800">{product.name}</p>
                                                    <p className="text-xs text-gray-400">ID: #{product.id}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-xs font-bold capitalize">
                                                {product.category}
                                            </span>
                                            <p className="text-xs text-gray-400 mt-1">{product.type}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-gray-900">৳ {product.rent.toLocaleString()}</p>
                                            <p className="text-xs text-gray-400">/{product.rent_for_days} Days</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className={`size-2 rounded-full ${product.stock > 5 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                <span className="font-medium text-gray-700">{product.stock} in stock</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">
                                                <button 
                                                    onClick={() => openEditModal(product)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                                                >
                                                    <Edit className="size-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(product.id)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                                                >
                                                    <Trash2 className="size-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Form Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-100">
                            <h2 className="text-2xl font-serif font-bold text-accent">
                                {editingProduct ? 'Edit Product' : 'Add New Product'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition">
                                <X className="size-6 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="md:col-span-2">
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Package className="size-4" /> Product Name
                                    </label>
                                    <input 
                                        required name="name" type="text" value={formData.name} onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 border-none"
                                    />
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Layers className="size-4" /> Category
                                    </label>
                                    <select 
                                        required name="category" value={formData.category} onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 border-none"
                                    >
                                        <option value="">Select Category</option>
                                        <option value="Bride">Bride</option>
                                        <option value="Groom">Groom</option>
                                    </select>
                                </div>

                                {/* Type */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Tag className="size-4" /> Type
                                    </label>
                                    <input 
                                        required name="type" type="text" value={formData.type} onChange={handleInputChange} placeholder="e.g., Lehenga, Sherwani"
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 border-none"
                                    />
                                </div>

                                {/* Rent */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <DollarSign className="size-4" /> Rent Price (৳)
                                    </label>
                                    <input 
                                        required name="rent" type="number" value={formData.rent} onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 border-none"
                                    />
                                </div>

                                {/* Days */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Calendar className="size-4" /> Rental Days
                                    </label>
                                    <input 
                                        required name="rent_for_days" type="number" value={formData.rent_for_days} onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 border-none"
                                    />
                                </div>

                                {/* Photo URL */}
                                <div className="md:col-span-2">
                                    <label className="text-sm font-semibold text-gray-700 mb-2 block">Photo URL</label>
                                    <input 
                                        required name="photoURL" type="url" value={formData.photoURL} onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 border-none"
                                    />
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Boxes className="size-4" /> Stock Quantity
                                    </label>
                                    <input 
                                        required name="stock" type="number" value={formData.stock} onChange={handleInputChange}
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 border-none"
                                    />
                                </div>

                                {/* Sizes */}
                                <div>
                                    <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                        <Ruler className="size-4" /> Available Sizes
                                    </label>
                                    <input 
                                        name="size" type="text" value={formData.size.join(', ')} onChange={handleSizeChange} placeholder="e.g., S, M, L, XL"
                                        className="w-full px-4 py-3 bg-gray-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/20 border-none"
                                    />
                                    <p className="text-[10px] text-gray-400 mt-1">Separate sizes with commas</p>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button 
                                    type="button" onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-6 py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-gray-200 transition"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-6 py-4 bg-accent text-white rounded-2xl font-bold hover:brightness-110 transition shadow-lg shadow-rose-100"
                                >
                                    {editingProduct ? 'Update Product' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryManagement;
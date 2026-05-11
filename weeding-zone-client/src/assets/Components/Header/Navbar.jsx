import React, { use, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router';
import './Navbar.css'
import { Search, ShoppingBag, User2Icon, Heart, LogOutIcon, LogInIcon } from 'lucide-react';
import Swal from 'sweetalert2';
import { AuthContext } from '../../../Provider/AuthProvider';

const links = <>
    <li><NavLink to={'/'}>Home</NavLink></li>
    <li>
        <details>
            <summary><Link to={'/category/bride'}>Bride</Link></summary>
            <ul className="p-2 bg-base-100 w-40 z-1">
                <li><NavLink to={'/category/lehenga'}>Lehenga</NavLink></li>
                <li><NavLink to={'/category/saree'}>Saree </NavLink></li>
                <li><NavLink to={'/category/gown'}>Gown </NavLink></li>
            </ul>
        </details>
    </li>
    <li>
        <details>
            <summary><Link to={'/category/groom'}>Groom</Link></summary>
            <ul className="p-2 bg-base-100 w-40 z-1">
                <li><NavLink to={'/category/sherwani'}>Sherwani</NavLink></li>
                <li><NavLink to={'/category/pagri'}>Pagri</NavLink></li>
                <li><NavLink to={'/category/panjabi'}>Panjabi</NavLink></li>
            </ul>
        </details>
    </li>
    <li><NavLink to={'contact'}>Contact Us</NavLink></li>
</>
const Navbar = () => {
    const { user, logOut, cart, wishlist } = use(AuthContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/search/${searchTerm.trim()}`);
            setSearchTerm('');
            setMobileMenuOpen(false);
        }
    };
    //console.log(user);

    const handlelogOut=()=> {
        Swal.fire({
            title: 'Logged Out',
            text: 'You have been logged out successfully.',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false
        });
        logOut().then(() => {
            // Sign-out successful.
        }).catch((error) => {
            console.log(error);
        });
    }
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start ">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden p-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 z-50 mt-3 w-56 p-2 shadow rounded-lg">
                        {links}
                        <div className="divider my-2"></div>
                        <li>
                            <Link to="/wishlist" className="flex items-center gap-2 p-2">
                                <Heart className="size-5 text-red-500" />
                                <span>Wishlist</span>
                                {wishlist && wishlist.length > 0 && (
                                    <span className="badge badge-accent badge-sm ml-auto">{wishlist.length}</span>
                                )}
                            </Link>
                        </li>
                        <li>
                            <div className="p-2">
                                <div className="flex items-center bg-zinc-100 border border-zinc-300 rounded-full overflow-hidden w-full">
                                    <span className="flex-shrink-0 pl-2.5 pr-1 text-zinc-500">
                                        <Search className="size-4" />
                                    </span>
                                    <input
                                        className="bg-transparent text-zinc-700 font-mono outline-none placeholder:text-zinc-400 placeholder:text-xs w-full pr-3 py-1.5 text-sm"
                                        autoComplete="off"
                                        placeholder="Search..."
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={handleSearch}
                                    />
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
                <Link to={'/'}><img src="https://i.ibb.co.com/SzZr84Z/logo.png" alt="logo" className='md:h-16 h-8' /></Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="navbar-end gap-2">
                {/* Expandable Search Box - Hidden on Mobile */}
                <div className="group hidden md:flex items-center relative">
                    <div className="flex items-center bg-zinc-100 border border-zinc-300 rounded-full overflow-hidden
                        w-9 hover:w-52 focus-within:w-52
                        transition-all duration-400 ease-in-out
                        shadow-sm hover:shadow-md hover:shadow-rose-200 focus-within:shadow-md focus-within:shadow-rose-200">
                        <span className="flex-shrink-0 pl-2.5 pr-1 text-zinc-500">
                            <Search className="size-4" />
                        </span>
                        <input
                            className="bg-transparent text-zinc-700 font-mono outline-none placeholder:text-zinc-400 placeholder:text-xs
                                w-0 group-hover:w-full focus:w-full
                                transition-all duration-400 ease-in-out
                                pr-3 py-1.5 text-sm"
                            autoComplete="off"
                            placeholder="Search outfits..."
                            name="text"
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onKeyDown={handleSearch}
                        />
                    </div>
                </div>

                {/* Wishlist - Hidden on Mobile */}
                <Link to="/wishlist" className="hidden md:flex relative group p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <Heart className="size-6 text-gray-700 group-hover:text-accent transition-colors" />
                    {wishlist && wishlist.length > 0 && (
                        <div className="badge badge-accent absolute -top-1 -right-1 size-5 p-0 text-[10px] flex items-center justify-center border-2 border-white">
                            {wishlist.length}
                        </div>
                    )}
                </Link>

                <Link to="/cart" className="relative group p-2 rounded-full hover:bg-gray-100 transition-colors">
                    <ShoppingBag className="size-6 text-gray-700 group-hover:text-accent transition-colors" />
                    {cart.length > 0 && (
                        <div className="badge badge-neutral absolute -top-1 -right-1 size-5 p-0 text-[10px] flex items-center justify-center border-2 border-white">
                            {cart.length}
                        </div>
                    )}
                </Link>
                    
                
                {
                    user && user?.email === 'tamanna.cse.iubat@gmail.com' ? <Link to={'/dashboard'}><h1>{user && <User2Icon></User2Icon>}</h1></Link>
                        : <Link to={'/customer-dashboard'}><h1>{user && <User2Icon></User2Icon>}</h1></Link>
                }
                
                {user ?  
                    <Link to={'/'}><button onClick={handlelogOut} className="bg-red-950 text-red-400 border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                        <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                        <LogOutIcon/>
                    </button>
                    </Link>
                :
                    <Link to={'signin'}><button className="bg-red-950 text-red-400 border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                    <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    <LogInIcon />
                </button>
            </Link>}
               
                
            </div>
        </div>
    );
};

export default Navbar;
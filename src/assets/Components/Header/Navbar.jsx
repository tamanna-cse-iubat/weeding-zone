import React from 'react';
import { NavLink } from 'react-router';
import './Navbar.css'
import { ShoppingBag } from 'lucide-react';

const links = <>
    <li><NavLink to={'/'}>Home</NavLink></li>
    <li>
        <details>
            <summary>Bride</summary>
            <ul className="p-2 bg-base-100 w-40 z-1">
                <li><NavLink to={'lahenga'}>Lahenga</NavLink></li>
                <li><NavLink to={'shari'}>Shari </NavLink></li>
                <li><NavLink to={'holud'}>Holud Dress </NavLink></li>
            </ul>
        </details>
    </li>
    <li>
        <details>
            <summary>Groom</summary>
            <ul className="p-2 bg-base-100 w-40 z-1">
                <li><NavLink to={'sherwani'}>Sherwani</NavLink></li>
                <li><NavLink to={'pagri'}>Pagri</NavLink></li>
                <li><NavLink to={'nagra'}>Nagra</NavLink></li>
            </ul>
        </details>
    </li>
    <li><NavLink to={'contact'}>Contact Us</NavLink></li>
</>
const Navbar = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                       {links}
                    </ul>
                </div>
                <img src="/public/logo.png" alt="" className='md:h-16 h-8' />
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                   {links}
                </ul>
            </div>
            <div className="navbar-end gap-2">
                <ShoppingBag/>
                <button className="bg-red-950 text-red-400 border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                    <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Sign Up
                </button>
            </div>
        </div>
    );
};

export default Navbar;
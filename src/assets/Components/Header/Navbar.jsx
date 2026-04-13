import React from 'react';

const links = <>
    <li><a>Home</a></li>
    <li>
        <details>
            <summary>Bride</summary>
            <ul className="p-2 bg-base-100 w-40 z-1">
                <li><a>Lahenga</a></li>
                <li><a>Shari </a></li>
                <li><a>Holud Dress </a></li>
            </ul>
        </details>
    </li>
    <li>
        <details>
            <summary>Groom</summary>
            <ul className="p-2 bg-base-100 w-40 z-1">
                <li><a>Sherwani</a></li>
                <li><a>Pagri</a></li>
                <li><a>Nagra</a></li>
            </ul>
        </details>
    </li>
    <li><a>Contact Us</a></li>
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
                <a className="btn btn-ghost text-xl">Weeding Zone</a>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                   {links}
                </ul>
            </div>
            <div className="navbar-end">
                <a className="btn">Sign Up</a>
            </div>
        </div>
    );
};

export default Navbar;
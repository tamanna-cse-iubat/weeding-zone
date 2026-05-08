import React, { use } from 'react';
import { Link, NavLink } from 'react-router';
import './Navbar.css'
import { Search, ShoppingBag, User2Icon } from 'lucide-react';
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
    const { user, logOut, cart } = use(AuthContext);
    //console.log(user);

    const handlelogOut=()=> {
        alert('You Logged out Successfully')
        logOut().then(() => {
            // Sign-out successful.
        }).catch((error) => {
            console.log(error);
        });
    }
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
                <Link to={'/'}><img src="https://i.ibb.co.com/SzZr84Z/logo.png" alt="" className='md:h-16 h-8' /></Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    {links}
                </ul>
            </div>
            <div className="navbar-end gap-2">
                
                
                
                <label className=" w-1/2">
                    
                    
                   
                    <input
                        class="bg-zinc-200 text-zinc-600 font-mono ring-1 ring-zinc-400 focus:ring-2 focus:accent outline-none duration-300 placeholder:text-zinc-600 placeholder:opacity-50 rounded-full px-4 py-1 shadow-md focus:shadow-lg focus:shadow-rose-400"
                        autocomplete="off"
                        placeholder="Search"
                        name="text"
                        type="text"
                    />

                </label>
                
                    <Link to="/cart" class="relative " ><ShoppingBag />
                    <div class="badge badge-neutral absolute -top-4 left-2 size-6">{ cart.length}</div>
                    </Link>
                    
                
                {
                    user && user?.email === 'tamanna.cse.iubat@gmail.com' ? <Link to={'/dashboard'}><h1>{user && <User2Icon></User2Icon>}</h1></Link>
                        : <Link to={'/customer-dashboard'}><h1>{user && <User2Icon></User2Icon>}</h1></Link>
                }
                
                {user ?  
                    <Link to={'/'}><button onClick={handlelogOut} className="bg-red-950 text-red-400 border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                        <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                        Log Out
                    </button>
                    </Link>
                :
                    <Link to={'signin'}><button className="bg-red-950 text-red-400 border border-red-400 border-b-4 font-medium overflow-hidden relative px-4 py-2 rounded-md hover:brightness-150 hover:border-t-4 hover:border-b active:opacity-75 outline-none duration-300 group">
                    <span className="bg-red-400 shadow-red-400 absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(0,0,0,0.3)]"></span>
                    Login
                </button>
            </Link>}
               
                
            </div>
        </div>
    );
};

export default Navbar;
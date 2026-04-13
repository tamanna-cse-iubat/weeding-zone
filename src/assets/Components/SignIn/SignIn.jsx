import React from 'react';
import { Link } from 'react-router';

const SignIn = () => {
    return (
        <div className='m-auto w-11/12 flex justify-center my-10 '>

            <div
                className="form w-[300px] rounded-md shadow-xl overflow-hidden z-[100] relative cursor-pointer snap-start shrink-0 py-5 px-6 bg-[#DFA16A] r flex flex-col items-center justify-center gap-3 transition-all duration-300"
            >
                <p
                    className="text-[#A15A3E] translate-x-[46%] -rotate-90 tracking-[8px] transition-all hover:translate-x-[50%] -translate-y-1/2 font-semibold text-lg absolute right-0"
                >
                    Welcome Back
                </p>

                <div className="capitalize">
                    <p className="text-2xl text-[#7F3D27] pb-5">Sign In Your Account</p>
                    <form action="" className="flex flex-col gap-3">
                       

                        <div className="flex flex-col items-start w-full">
                            <label for="email" className="text-sm text-[#7F3D27] font-semibold"
                            >Email</label
                            >
                            <input
                                type="email"
                                placeholder="Enter Your Email"
                                className="w-full py-px pl-0 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-[#7F3D27] placeholder:text-[#A15A3E] focus:outline-none text-[#7F3D27] placeholder:text-xs"
                            />
                        </div>

                        <div className="flex flex-col items-start w-full">
                            <label for="password" className="text-sm text-[#7F3D27] font-semibold"
                            >Password</label
                            >
                            <input
                                type="password"
                                placeholder="Enter Your Password"
                                className="w-full py-px pl-0 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-[#7F3D27] placeholder:text-[#A15A3E] focus:outline-none text-[#7F3D27] placeholder:text-xs"
                            />
                        </div>

                        

                        <div className="inline-flex gap-5">
                            <Link to={'/register'}>
                                <button
                                    className="px-6 focus:outline-none focus:scale-110 font-semibold text-xs py-2 rounded-[5px] hover:scale-110 transition-all hover:transiton text-[#D9D9D9] bg-[#7F3D27] shadow-[#7F3D27] shadow-lg"
                                >
                                    Sign Up
                                </button>
                            </Link>
                            <button
                                className="px-6 focus:outline-none focus:scale-110 font-semibold text-xs py-2 rounded-[5px] hover:scale-110 transition-all hover:transiton text-[#7F3D27] bg-[#D9D9D9] shadow-[#7F3D27] shadow-lg"
                            >
                                Sign In
                            </button>
                        </div>
                    </form>
                </div>
            </div>

        </div>
    );
};

export default SignIn;
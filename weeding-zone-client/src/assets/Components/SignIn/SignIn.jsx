import React, { use, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../../Provider/AuthProvider';
import Swal from 'sweetalert2';

const SignIn = () => {
    const { signInUser, user, resetPassword, sendVerificationEmail } = use(AuthContext);
    const [error, seterror] = useState('');
    const [success, setSuccess] = useState('');
    const [showForgotForm, setShowForgotForm] = useState(false);
    const [forgotEmail, setForgotEmail] = useState('');
    const navigate = useNavigate();
    const emailRef = useRef();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleReset = (e) => {
        e.preventDefault();
        const email = forgotEmail || emailRef.current.value;
        if (!email) {
            seterror('Please enter your email address first.');
            return;
        }
        seterror('');
        resetPassword(email)
            .then(() => {
                Swal.fire({
                    title: 'Email Sent',
                    text: 'Password reset email sent! Check your inbox.',
                    icon: 'success',
                    confirmButtonColor: '#7F3D27'
                });
                setForgotEmail('');
                setShowForgotForm(false);
                seterror('');
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Reset Failed',
                    text: error.message,
                    icon: 'error',
                    confirmButtonColor: '#7F3D27'
                });
            });
    }

    const handleLogin = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        signInUser(email, password)
            .then((result) => {
                Swal.fire({
                    title: 'Login Successful',
                    text: 'Welcome back to Wedding Zone!',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                });
                navigate('/');
            })
            .catch((error) => {
                Swal.fire({
                    title: 'Login Failed',
                    text: 'Invalid email or password. Please try again.',
                    icon: 'error',
                    confirmButtonColor: '#7F3D27'
                });
            });
        console.log({email, password});
    
    }
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
                    <form onSubmit={handleLogin} action="" className="flex flex-col gap-3">


                        <div className="flex flex-col items-start w-full">
                            <label htmlFor="email" className="text-sm text-[#7F3D27] font-semibold"
                            >Email</label
                            >
                            <input
                                type="email"
                                name='email'
                                ref={emailRef}
                                placeholder="Enter Your Email"
                                className="w-full py-px pl-0 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-[#7F3D27] placeholder:text-[#A15A3E] focus:outline-none text-[#7F3D27] placeholder:text-xs"
                                onChange={(e) => setForgotEmail(e.target.value)}
                            />
                        </div>

                        {!showForgotForm ? (
                            <>
                                <div className="flex flex-col items-start w-full">
                                    <label htmlFor="password" className="text-sm text-[#7F3D27] font-semibold"
                                    >Password</label
                                    >
                                    <input
                                        type="password"
                                        name='password'
                                        placeholder="Enter Your Password"
                                        className="w-full py-px pl-0 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-[#7F3D27] placeholder:text-[#A15A3E] focus:outline-none text-[#7F3D27] placeholder:text-xs"
                                    />
                                    <button 
                                        type="button"
                                        onClick={() => setShowForgotForm(true)} 
                                        className='text-[#7F3D27] my-2 hover:text-white text-xs text-left underline decoration-[#7F3D27]'
                                    >
                                        Forgot Password?
                                    </button>
                                    {error && <p className='text-red-600 text-xs my-1'>{error}</p>}
                                    {success && <p className='text-green-700 text-xs my-1'>{success}</p>}
                                </div>

                                <div className="inline-flex gap-5">
                                    <Link to={'/register'}>
                                        <button
                                            type="button"
                                            className="px-6 focus:outline-none focus:scale-110 font-semibold text-xs py-2 rounded-[5px] hover:scale-110 transition-all hover:transiton text-[#D9D9D9] bg-[#7F3D27] shadow-[#7F3D27] shadow-lg"
                                        >
                                            Register
                                        </button>
                                    </Link>
                                    <button type='submit'
                                        className="px-6 focus:outline-none focus:scale-110 font-semibold text-xs py-2 rounded-[5px] hover:scale-110 transition-all hover:transiton text-[#7F3D27] bg-[#D9D9D9] shadow-[#7F3D27] shadow-lg"
                                    >
                                        Log In
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="w-full space-y-4">
                                <p className="text-xs text-[#7F3D27] italic">Enter your email above and click reset.</p>
                                <div className="flex gap-3">
                                    <button 
                                        type="button"
                                        onClick={handleReset}
                                        className="flex-1 px-4 focus:outline-none focus:scale-105 font-semibold text-xs py-2 rounded-[5px] hover:scale-105 transition-all text-[#D9D9D9] bg-[#7F3D27] shadow-lg"
                                    >
                                        Send Reset Email
                                    </button>
                                    <button 
                                        type="button"
                                        onClick={() => setShowForgotForm(false)}
                                        className="px-4 focus:outline-none focus:scale-105 font-semibold text-xs py-2 rounded-[5px] hover:scale-105 transition-all text-[#7F3D27] bg-[#D9D9D9] shadow-lg"
                                    >
                                        Cancel
                                    </button>
                                </div>
                                {error && <p className='text-red-600 text-xs my-1'>{error}</p>}
                            </div>
                        )}
                    </form>
                </div>
            </div>

        </div>
    );
};

export default SignIn;
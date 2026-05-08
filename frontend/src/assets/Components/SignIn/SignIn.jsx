import React, { use, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router';
import { AuthContext } from '../../../Provider/AuthProvider';

const SignIn = () => {
    const { signInUser, user, resetPassword } = use(AuthContext);
    const [error, seterror] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const emailRef = useRef();

    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleReset = (e) => {
        e.preventDefault();
        const email = emailRef.current.value;
        if (!email) {
            seterror('Please enter your email address first.');
            return;
        }
        seterror('');
        resetPassword(email)
            .then(() => {
                setSuccess('Password reset email sent! Check your inbox.');
                seterror('');
            })
            .catch((error) => {
                seterror(error.message);
                setSuccess('');
            });
    }

    const handleLogin = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;
        signInUser(email, password)
            .then((result) => {
            const user = result.user;
            console.log(user);
            navigate('/');
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                seterror(errorMessage);
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
                            <label for="email" className="text-sm text-[#7F3D27] font-semibold"
                            >Email</label
                            >
                            <input
                                type="email"
                                name='email'
                                ref={emailRef}
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
                                name='password'
                                placeholder="Enter Your Password"
                                className="w-full py-px pl-0 bg-transparent outline-none focus:ring-0 border-0 border-b-2 border-[#7F3D27] placeholder:text-[#A15A3E] focus:outline-none text-[#7F3D27] placeholder:text-xs"
                            />
                            <button onClick={handleReset} className='text-accent my-2 hover:text-white text-xs text-left'>Forgot Password?</button>
                            {error && <p className='text-red-600 text-xs my-1'>{error}</p>}
                            {success && <p className='text-green-700 text-xs my-1'>{success}</p>}
                        </div>

                        <div className="inline-flex gap-5">
                            <Link to={'/register'}>
                                <button
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
                    </form>
                </div>
            </div>

        </div>
    );
};

export default SignIn;
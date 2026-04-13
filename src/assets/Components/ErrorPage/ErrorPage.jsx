import React from 'react';
import { Link } from 'react-router';

const ErrorPage = () => {
    return (
        <div className="hero bg-base-200 min-h-screen">
            <div className="hero-content flex-col lg:flex-row-reverse">
                <img
                    src="https://i.ibb.co.com/B5yr6H7X/404-error.gif"
                    className="md:max-w-lg rounded-lg shadow-2xl"
                />
                <div>
                    <h1 className="text-2xl  md:text-5xl font-bold">Page Not Found</h1>
                    <p className="py-6">
                        Please check Your Internet Connection or Reload
                    </p>
                  
                    <Link to={'/'}> <button
                        className="relative group border-none bg-transparent p-0 outline-none cursor-pointer font-mono font-light uppercase text-base"
                    >
                        <span
                            className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-25 rounded-lg transform translate-y-0.5 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:translate-y-1 group-hover:duration-[250ms] group-active:translate-y-px"
                        ></span>

                        <span
                            className="absolute top-0 left-0 w-full h-full rounded-lg bg-gradient-to-l from-[hsl(217,33%,16%)] via-[hsl(217,33%,32%)] to-[hsl(217,33%,16%)]"
                        ></span>

                        <div
                            className="relative flex items-center justify-between py-3 px-6 text-lg text-white rounded-lg transform -translate-y-1 bg-gradient-to-r from-[#f27121] via-[#e94057] to-[#8a2387] gap-3 transition duration-[600ms] ease-[cubic-bezier(0.3,0.7,0.4,1)] group-hover:-translate-y-1.5 group-hover:duration-[250ms] group-active:-translate-y-0.5 brightness-100 group-hover:brightness-110"
                        >
                            <span className="select-none">Go Back</span>

                            <svg
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                className="w-5 h-5 ml-2 -mr-1 transition duration-250 group-hover:translate-x-1"
                            >
                                <path
                                    clip-rule="evenodd"
                                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                                    fill-rule="evenodd"
                                ></path>
                            </svg>
                        </div>
                    </button>
                </Link>

                    
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;
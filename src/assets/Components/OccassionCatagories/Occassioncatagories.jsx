import React from 'react';
import { Link } from 'react-router';

const Occassioncatagories = () => {
    return (
        <div className=' my-8  '>
            <h1 className='font-bold text-4xl text-accent mb-4'>Occasion Categories</h1>
            <div className='grid md:grid-cols-4 gap-4 my-8 w-11/12 mx-auto'>
                <Link to="/category/mehendi">
                    <div className="card bg-base-100 w-60 shadow-xl hover:scale-105 transition-transform duration-300">
                        <div className="card-body ">
                            <h2 className="card-title flex justify-center">Mehendi</h2>
                        </div>
                        <figure className='h-48'>
                            <img
                                src="https://i.ibb.co.com/Kjrgv6sM/mehendi-froral-saree.png"
                                alt="Mehendi" />
                        </figure>
                    </div>
                </Link>
                <Link to="/category/haldi">
                    <div className="card bg-base-100 w-60 shadow-xl hover:scale-105 transition-transform duration-300">
                        <div className="card-body">
                            <h2 className="card-title flex justify-center">Haldi</h2>
                        </div>
                        <figure className='h-48'>
                            <img
                                src="https://i.ibb.co.com/LhJWrBH8/Haldi-Flora-l-Lehenga.png"
                                alt="Haldi" />
                        </figure>
                    </div>
                </Link>
                <Link to="/category/wedding">
                    <div className="card bg-base-100 w-60 shadow-xl hover:scale-105 transition-transform duration-300">
                        <div className="card-body">
                            <h2 className="card-title flex justify-center">Wedding</h2>
                        </div>
                        <figure className='h-48'>
                            <img
                                src="https://i.ibb.co.com/HfJgtD0Z/red-weeding-lahenga.png"
                                alt="Wedding" />
                        </figure>
                    </div>
                </Link>
                <Link to="/category/reception">
                    <div className="card bg-base-100 w-60 shadow-xl hover:scale-105 transition-transform duration-300">
                        <div className="card-body">
                            <h2 className="card-title flex justify-center">Reception</h2>
                        </div>
                        <figure className='h-48'>
                            <img
                                src="https://i.ibb.co.com/hRjhKjkQ/formal-suits.jpg"
                                alt="Reception" />
                        </figure>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Occassioncatagories;
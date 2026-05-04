import React from 'react';

const Occassioncatagories = () => {
    return (
        <div className=' my-8  '>
            <h1 className='font-bold text-4xl text-accent mb-4'>Occassion Catagories</h1>
            <div className='grid md:grid-cols-4 gap-4 my-8 w-11/12 mx-auto'>
                <div>
                    <div className="card bg-base-100 w-60 shadow-xl">
                        <div className="card-body ">
                            <h2 className="card-title flex justify-center">Mehendi</h2>

                        </div>
                        <figure className='h-48'>
                            <img
                                src="https://i.ibb.co.com/Kjrgv6sM/mehendi-froral-saree.png"
                                 />
                        </figure>
                    </div>
                </div>
                <div>
                    <div className="card bg-base-100 w-60 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title flex justify-center">Haldi</h2>

                        </div>
                        <figure className='h-48'>
                            <img
                                src="https://i.ibb.co.com/LhJWrBH8/Haldi-Flora-l-Lehenga.png"
                                 />
                        </figure>
                    </div>
                </div>
                <div>
                    <div className="card bg-base-100 w-60 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title flex justify-center">Weeding</h2>
                        </div>
                        <figure className='h-48'>
                            <img
                                src="https://i.ibb.co.com/HfJgtD0Z/red-weeding-lahenga.png"
                                 />
                        </figure>
                    </div>
                </div>
                <div>
                    <div className="card bg-base-100 w-60 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title flex justify-center">Receiption</h2>

                        </div>
                        <figure className='h-48'>
                            <img
                                src="https://i.ibb.co.com/hRjhKjkQ/formal-suits.jpg"
                                 />
                        </figure>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Occassioncatagories;
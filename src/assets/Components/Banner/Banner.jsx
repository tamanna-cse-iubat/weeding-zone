import React from 'react';

const Banner = () => {
    return (
        <div
            className="hero min-h-screen"
            style={{
                backgroundImage:
                    "url(https://i.ibb.co.com/9mqnc3f7/Banner.png)",
            }}
        >
            <div className="hero-overlay"></div>
            <div className="hero-content text-neutral-content text-left md:w-120 md:mr-120 md:mb-20 ">
                <div className=''>
                    <h1 className="text-5xl font-bold">Rent your Dream Wedding Outfit</h1>
                    <p className="py-6">
                        Sherwani-Panjabi, Shari-Lehenga
                    </p>
                    <div className='flex justify-center gap-3'>
                        {/* <button className="btn btn-accent">Explore Bride</button> */}
                        <button className="btn bg-accent md:btn-lg text-white skeleton">Explore Bride</button>
                        <button className="btn bg-accent md:btn-lg text-white skeleton">Explore Groom</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Banner;
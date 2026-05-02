import React from 'react';
import Banner from '../Banner/Banner';

import ProductsCard from '../ProductCard/ProductsCard';
import { useLoaderData } from 'react-router';

const Home = () => {
    const productsData = useLoaderData();
    console.log(productsData);
  
    return (
        <>
            <div>
                <Banner></Banner>
                <ProductsCard productsData={productsData}></ProductsCard>
            </div>
            <div>
                
            </div>
        </>
    );
};

export default Home;
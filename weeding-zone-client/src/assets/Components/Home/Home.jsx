import React from 'react';
import Banner from '../Banner/Banner';

import ProductsCard from '../ProductCard/ProductsCard';
import { useLoaderData } from 'react-router';
import Occassioncatagories from '../OccassionCatagories/Occassioncatagories';

const Home = () => {
    const productsData = useLoaderData();
   // console.log(productsData);
  
    return (
        <>
            <div>
                <Banner></Banner>
                <Occassioncatagories></Occassioncatagories>
                <ProductsCard productsData={productsData}></ProductsCard>
            </div>
            <div>
                
            </div>
        </>
    );
};

export default Home;
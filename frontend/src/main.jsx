import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Root from './assets/Layout/Root.jsx'
import ErrorPage from './assets/Components/ErrorPage/ErrorPage.jsx'
import Home from './assets/Components/Home/Home.jsx'
import SignUp from './assets/Components/SignUp/SignUp.jsx'
import SignIn from './assets/Components/SignIn/SignIn.jsx'
import Bride from './assets/Components/Bride/Bride.jsx'
import axios from 'axios'
import AuthProvider from './Provider/AuthProvider.jsx'
import Dashboard from './assets/Components/Dashboard/Dashboard.jsx'
import PrivateRoute from './Provider/PrivateRoute.jsx'

import ProductsCard from './assets/Components/ProductCard/ProductsCard.jsx'
import ProductCart from './assets/Components/ProductCart/ProductCart.jsx'
import ProductDetails from './assets/Components/ProductDetails/ProductDetails.jsx'
import Checkout from './assets/Components/CheckoutPage/Checkout.jsx'

const router = createBrowserRouter([{
  path: '/',
  Component: Root,
  errorElement: <ErrorPage></ErrorPage>,
  children: [
    {
      index: true,
      Component: Home,
      loader: async () => {
        const res = await axios.get('/product.json');
        return res.data;
      },
      
    },
    {
      path: '/register',
      Component: SignUp
    },
    {
      path: '/signin',
      Component: SignIn
    },
    {
      path: '/bride',
      Component: Bride
    },
    {
      path: '/dashboard',
      element: <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>,
    },
    {
      path: '/cart',
      element: <ProductCart></ProductCart>,
      loader: async ({ params }) => {
        const res = await axios.get('/product.json');
        return res.data.find(
          (p) => p.id === parseInt(params.id));

      }
    },
    {
      path: '/product/:id',
      element: <ProductDetails></ProductDetails>,
      loader: async ({ params }) => {
        const res = await axios.get('/product.json');
        return res.data.find(
          (p) => p.id === parseInt(params.id));
        
      }
    },
    {
      path: '/checkout',
      Component: Checkout,
      
    },

  ]
}])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)

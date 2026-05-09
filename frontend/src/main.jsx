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

import CategoryProducts from './assets/Components/CategoryProducts/CategoryProducts.jsx'
import CustomerDashboard from './assets/Components/Dashboard/CustomerDashboard.jsx'
import ThankYou from './assets/Components/CheckoutPage/ThankYou.jsx'
import Wishlist from './assets/Components/Wishlilist/Wishlist.jsx'
import SearchResults from './assets/Components/CategoryProducts/SearchResults.jsx'
import InventoryManagement from './assets/Components/Dashboard/InventoryManagement.jsx'
import AdminRoute from './Provider/AdminRoute.jsx'
import OrderManagment from './assets/Components/Dashboard/OrderManagment.jsx'

const productLoader = async () => {
  const savedProducts = localStorage.getItem('managed_products');
  if (savedProducts) {
    return JSON.parse(savedProducts);
  }
  const res = await axios.get('/product.json');
  localStorage.setItem('managed_products', JSON.stringify(res.data));
  return res.data;
};

const router = createBrowserRouter([{
  path: '/',
  Component: Root,
  errorElement: <ErrorPage></ErrorPage>,
  children: [
    {
      index: true,
      Component: Home,
      loader: productLoader,
      
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
      path: '/category/:categoryName',
      Component: CategoryProducts,
      loader: productLoader,
    },
    {
      path: '/dashboard',
      element: <PrivateRoute>
        <Dashboard></Dashboard>
      </PrivateRoute>,
    },
    {
      path: '/customer-dashboard',
      element: <PrivateRoute>
        <CustomerDashboard></CustomerDashboard>
      </PrivateRoute>
    },
    {
      path: '/cart',
      element: <ProductCart></ProductCart>,
      loader: async ({ params }) => {
        const data = await productLoader();
        return data.find((p) => p.id === parseInt(params.id));
      }
    },
    {
      path: '/product/:id',
      element: <ProductDetails></ProductDetails>,
      loader: async ({ params }) => {
        const data = await productLoader();
        return data.find((p) => p.id === parseInt(params.id));
      }
    },
    {
      path: '/checkout',
      element: <PrivateRoute>
        <Checkout></Checkout>
      </PrivateRoute>
    },
    {
      path: '/thank-you',
      element: <ThankYou></ThankYou>
    },
    {
      path: '/wishlist',
      element: <Wishlist></Wishlist>
    },
    {
      path: '/search/:query',
      Component: SearchResults,
      loader: productLoader,
    },
    {
      path: '/admin/inventory',
      element: <AdminRoute><InventoryManagement /></AdminRoute>
    },
    {
      path: '/admin/orders',
      element: <AdminRoute><OrderManagment /></AdminRoute>
    }
    

  ]
}])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)

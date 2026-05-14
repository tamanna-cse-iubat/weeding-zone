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
import Contact from './assets/Components/Contact/Contact.jsx'
import MyOrders from './assets/Components/Dashboard/Customer/MyOrders.jsx'
import OrderDetailView from './assets/Components/Dashboard/Customer/OrderDetailView.jsx'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

const productLoader = async () => {
  try {
    const res = await axios.get('/api/products');
    return res.data;
  } catch (error) {
    console.error('Unable to fetch products from backend, falling back to product.json', error);
    const res = await axios.get('/product.json');
    return res.data;
  }
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
      path: '/contact',
      Component: Contact
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
      path: '/customer/orders',
      element: <PrivateRoute><MyOrders /></PrivateRoute>
    },
    {
      path: '/customer/order/:id?',
      element: <PrivateRoute><OrderDetailView /></PrivateRoute>
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

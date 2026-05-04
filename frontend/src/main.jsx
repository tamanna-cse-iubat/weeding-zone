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
  }
  ]
}])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

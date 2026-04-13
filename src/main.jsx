import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router'
import Root from './assets/Layout/Root.jsx'
import ErrorPage from './assets/Components/ErrorPage/ErrorPage.jsx'
import Home from './assets/Components/Home/Home.jsx'

const router = createBrowserRouter([{
  path: '/',
  Component: Root,
  errorElement: <ErrorPage></ErrorPage>,
  children: [{
    index: true,
    Component:Home,
  }]
}])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router}/>
  </StrictMode>,
)

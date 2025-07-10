import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {RouterProvider, createBrowserRouter } from 'react-router-dom';
import Main from './components/main/mian';
import Navbar from './components/nnavbarr/navbar';
import Creat from './components/create/creat';
import Dasjboard from './components/dashboard/dasjboard';
import Accptance from './components/dashboard/acceptance/accptance';
import Login from './components/login/login';
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login/>,
  },
  {
    path: '/create',
    element: <Creat/>,
  },
  {
    path: '/dashboard',
    element: <Dasjboard/>,
  },
  {
    path: '/acceptance',
    element: <Accptance/>,
  },
  {
    path: '/home',
    element: <Main/>,
  },
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
   <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

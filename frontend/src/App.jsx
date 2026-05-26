import React, { useContext } from 'react'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import Login from './pages/Login/Login'
import Verify from './pages/Verify/Verify'
import MyOrders from './pages/MyOrders/MyOrders'
import Menu from './pages/Menu/Menu'
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy'
import ContactUs from './pages/ContactUs/ContactUs'
import Profile from './pages/Profile/Profile'
import Success from './pages/Success/Success'
import { StoreContext } from './context/StoreContext'

// Admin Components
import Add from './pages/Admin/Add/Add'
import List from './pages/Admin/List/List'
import Order from './pages/Admin/Orders/Order'
import Users from './pages/Admin/Users/Users'
import Dashboard from './pages/Admin/Dashboard/Dashboard'
import Inventory from './pages/Admin/Inventory/Inventory'
import Recipes from './pages/Admin/Recipes/Recipes'
import POS from './pages/Admin/POS/POS'
import Sidebar from './components/AdminSidebar/Sidebar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const { userRole, url, token, loading } = useContext(StoreContext);
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Wait for context to finish loading from localStorage
  if (loading) {
    return (
      <div style={{display:'flex',justifyContent:'center',alignItems:'center',height:'100vh'}}>
        <p style={{color:'#94a3b8',fontSize:'16px'}}>Loading...</p>
      </div>
    );
  }

  // Basic Protection for admin routes
  if (isAdminRoute && userRole !== 'admin') {
      return <Navigate to="/login" />
  }

  return (
    <>
      <ToastContainer />
      <div className={`app-wrapper ${isAdminRoute ? 'admin-layout' : ''}`}>
        <div className={`app ${isAdminRoute ? 'admin-app' : ''}`}>
          <Navbar />
          {isAdminRoute && <hr style={{ border: 'none', height: '1px', backgroundColor: '#a9a9a9' }} />}
          
          <div className={isAdminRoute ? "app-content" : "main-content"}>
            {isAdminRoute && <Sidebar />}
            
            <Routes>
              {/* Customer Routes */}
              <Route path='/' element={<Home />} />
              <Route path='/menu' element={<Menu />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/order' element={<PlaceOrder />} />
              <Route path='/login' element={<Login />} />
              <Route path='/verify' element={<Verify/>} />
              <Route path='/myorders' element={<MyOrders />} />
              <Route path='/privacy-policy' element={<PrivacyPolicy />} />
              <Route path='/contact' element={<ContactUs />} />
              <Route path='/profile' element={<Profile />} />
              <Route path='/success' element={<Success />} />

              {/* Admin Routes */}
              <Route path='/admin/dashboard' element={<Dashboard url={url} token={token} />} />
              <Route path='/admin/add' element={<Add url={url} token={token} />} />
              <Route path='/admin/list' element={<List url={url} token={token} />} />
              <Route path='/admin/orders' element={<Order url={url} token={token} />} />
              <Route path='/admin/users' element={<Users url={url} token={token} />} />
              <Route path='/admin/inventory' element={<Inventory url={url} token={token} />} />
              <Route path='/admin/recipes' element={<Recipes url={url} token={token} />} />
              <Route path='/admin/pos' element={<POS url={url} token={token} />} />
            </Routes>
          </div>
        </div>
        {!isAdminRoute && <Footer />}
      </div>
    </>
  )
}

export default App

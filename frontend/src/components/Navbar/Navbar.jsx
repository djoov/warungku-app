import React, { useContext, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const [menu, setMenu] = useState("home");
  const { getTotalCartAmmount, token, setToken, userRole, setUserRole, setCartItems, userProfile, setUserProfile, isSidebarCollapsed, setIsSidebarCollapsed } = useContext(StoreContext);
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    setToken("");
    setUserRole("");
    setCartItems({}); // Clear the cart!
    setUserProfile({}); // Clear profile
    toast.success("Successfully logged out");
    navigate("/")
  }

  return (
    <div className={`navbar ${isAdminRoute ? 'admin-navbar' : ''}`}>
      {!isAdminRoute ? (
        <Link to='/'> <h1 className="logo-text">WarungKu.</h1></Link>
      ) : (
        <div className="admin-navbar-left">
          <Link to='/admin/dashboard'> <h1 className="logo-text" style={{fontSize: '20px'}}>WarungKu.</h1></Link>
          <button className="sidebar-toggle-btn" onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          </button>
        </div>
      )}
      
      {/* Show customer menu if not currently on an admin route */}
      {!isAdminRoute ? (
        <ul className="navbar-menu">
          <Link to='/' onClick={() => setMenu("home")} className={menu === "home" ? "active" : ""}>Home</Link>
          <Link to='/menu' onClick={() => setMenu("menu")} className={menu === "menu" ? "active" : ""}>Our Menu</Link>
          <a href='/#app-download' onClick={() => setMenu("mobile-app")} className={menu === "mobile-app" ? "active" : ""}>Get App</a>
          <Link to='/contact' onClick={() => setMenu("contact-us")} className={menu === "contact-us" ? "active" : ""}>Contact Us</Link>
        </ul>
      ) : (
        <div className="admin-navbar-title">Admin Command Center</div>
      )}

      <div className="navbar-right">
        {!isAdminRoute && (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <div className="navbar-search-icon">
              <Link to='/cart'>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
              </Link>
              <div className={getTotalCartAmmount() === 0 ? "" : "dot"}></div>
            </div>
          </>
        )}
        
        {!token ? (
          <button onClick={() => navigate('/login')}>Sign In</button>
        ) : (
          <div className='navbar-profile'>
            {userProfile?.avatarUrl ? (
                <img 
                src={userProfile.avatarUrl} 
                alt="Profile" 
                className="custom-avatar"
                style={{width: '28px', height: '28px', borderRadius: '50%', objectFit: 'cover'}}
                />
            ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="nav-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            )}
            
            <ul className="nav-profile-dropdown">
              {userRole === 'admin' && (
                <>
                  <li onClick={() => navigate("/admin/dashboard")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="9" x2="9" y1="21" y2="9"/></svg>
                    <p>Admin Panel</p>
                  </li>
                  <hr />
                </>
              )}
              {userRole !== 'admin' && (
                <>
                  <li onClick={() => navigate("/profile")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    <p>My Profile</p>
                  </li>
                  <hr />
                  <li onClick={() => navigate("/myorders")}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                    <p>Orders</p>
                  </li>
                  <hr />
                </>
              )}
              <li onClick={logout}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="dropdown-icon"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                <p>Logout</p>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Navbar
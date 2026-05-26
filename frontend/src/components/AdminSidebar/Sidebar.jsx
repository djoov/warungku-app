import React, { useContext } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { NavLink } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'

const Sidebar = () => {
  const { isSidebarCollapsed } = useContext(StoreContext);

  return (
    <div className={`sidebar saas-sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-section">
            <h4 className="sidebar-title">Analytics</h4>
            <div className="sidebar-options">
                <NavLink to='/admin/dashboard' className="sidebar-option">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>
                    <p>Dashboard</p>
                </NavLink>
            </div>
        </div>

        <div className="sidebar-section">
            <h4 className="sidebar-title">Menu Management</h4>
            <div className="sidebar-options">
                <NavLink to='/admin/add' className="sidebar-option">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                    <p>Add Product</p>
                </NavLink>
                <NavLink to='/admin/list' className="sidebar-option">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
                    <p>List Items</p>
                </NavLink>
                <NavLink to='/admin/recipes' className="sidebar-option">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                    <p>Recipes</p>
                </NavLink>
            </div>
        </div>

        <div className="sidebar-section">
            <h4 className="sidebar-title">Operations</h4>
            <div className="sidebar-options">
                <NavLink to='/admin/orders' className="sidebar-option">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    <p>Orders</p>
                </NavLink>
                <NavLink to='/admin/inventory' className="sidebar-option">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>
                    <p>Inventory</p>
                </NavLink>
                <NavLink to='/admin/pos' className="sidebar-option">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 10h20"/><path d="M6 14h.01"/><path d="M10 14h.01"/><path d="M14 14h.01"/><path d="M6 18h.01"/><path d="M10 18h.01"/><path d="M14 18h4"/></svg>
                    <p>POS / Kasir</p>
                </NavLink>
            </div>
        </div>

        <div className="sidebar-section">
            <h4 className="sidebar-title">Administration</h4>
            <div className="sidebar-options">
                <NavLink to='/admin/users' className="sidebar-option">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                    <p>Users</p>
                </NavLink>
            </div>
        </div>

        <div className="sidebar-footer">
            <NavLink to='/' className="sidebar-option storefront-link">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                <p>View Storefront</p>
            </NavLink>
        </div>

    </div>
  )
}

export default Sidebar
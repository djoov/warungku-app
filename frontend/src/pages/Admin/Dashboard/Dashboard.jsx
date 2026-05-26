import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../../assets/assets';

const Dashboard = ({ url, token }) => {
    const [orders, setOrders] = useState([]);
    const [stats, setStats] = useState({
        revenue: 0,
        totalOrders: 0,
        itemsSold: 0,
        recentOrders: []
    });

    const [lowStock, setLowStock] = useState([]);

    const fetchDashboardData = async () => {
        try {
            const [ordersRes, stockRes] = await Promise.all([
                axios.get(url + "/api/order/list", { headers: { token } }),
                axios.get(url + "/api/ingredient/low-stock", { headers: { token } }).catch(() => ({ data: { success: false } }))
            ]);

            if (ordersRes.data.success) {
                const fetchedOrders = ordersRes.data.data;
                setOrders(fetchedOrders);
                calculateStats(fetchedOrders);
            } else {
                toast.error("Error fetching orders for dashboard");
            }

            if (stockRes?.data?.success) {
                setLowStock(stockRes.data.data);
            }
        } catch (error) {
            console.error("Dashboard error:", error);
            toast.error("Failed to load dashboard data");
        }
    }

    const calculateStats = (data) => {
        let revenue = 0;
        let itemsSold = 0;
        
        data.forEach(order => {
            if (order.payment === true && order.status !== 'Cancelled') {
                revenue += order.amount;
                order.items.forEach(item => { itemsSold += item.quantity; });
            }
        });

        const recent = [...data].reverse().slice(0, 5);

        setStats({
            revenue,
            totalOrders: data.length,
            itemsSold,
            recentOrders: recent
        });
    }

    useEffect(() => {
        if (token) {
            fetchDashboardData();
        }
    }, [token]);

    return (
        <div className='dashboard saas-dashboard'>
            <div className="dashboard-header">
                <div className="header-title">
                    <h2>Overview</h2>
                    <p>Live metrics and recent activity for WarungKu</p>
                </div>
                <div className="header-actions">
                    <button className="saas-btn secondary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                        Export
                    </button>
                </div>
            </div>

            {/* ERP Alert Banner (SaaS Style) */}
            {lowStock.length > 0 && (
                <div className="saas-alert warning">
                    <div className="alert-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
                    </div>
                    <div className="alert-content">
                        <span className="alert-title">Low Stock Alert</span>
                        <span className="alert-message">{lowStock.length} ingredients require your attention for restocking.</span>
                    </div>
                    <button className="alert-action" onClick={() => window.location.href='/admin/inventory'}>View Inventory &rarr;</button>
                </div>
            )}

            {/* KPI Metrics */}
            <div className="metric-cards">
                <div className="metric-card">
                    <div className="metric-header">
                        <h3>Total Revenue</h3>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    </div>
                    <div className="metric-value">Rp {stats.revenue.toLocaleString('id-ID')}</div>
                    <div className="metric-trend positive">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
                        <span>Updated just now</span>
                    </div>
                </div>
                
                <div className="metric-card">
                    <div className="metric-header">
                        <h3>Orders Completed</h3>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <div className="metric-value">{stats.totalOrders}</div>
                    <div className="metric-trend neutral">
                        <span>All time total</span>
                    </div>
                </div>

                <div className="metric-card">
                    <div className="metric-header">
                        <h3>Items Sold</h3>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                    </div>
                    <div className="metric-value">{stats.itemsSold}</div>
                    <div className="metric-trend neutral">
                        <span>Units processed</span>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="saas-grid">
                <div className="saas-panel">
                    <div className="panel-header">
                        <h3>Recent Transactions</h3>
                        <button className="panel-action">View All</button>
                    </div>
                    <div className="data-table-container">
                        <table className="saas-table">
                            <thead>
                                <tr>
                                    <th>Order ID</th>
                                    <th>Customer Address</th>
                                    <th>Items</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.length === 0 ? (
                                    <tr><td colSpan="5" className="empty-state">No recent transactions</td></tr>
                                ) : (
                                    stats.recentOrders.map((order, index) => (
                                        <tr key={index}>
                                            <td className="font-mono text-muted">#{order._id.substring(0,8)}</td>
                                            <td className="truncate-cell">{order.address.street || "Online Order"}</td>
                                            <td>{order.items.length} items</td>
                                            <td className="font-medium">Rp {order.amount.toLocaleString('id-ID')}</td>
                                            <td>
                                                <span className={`saas-badge ${order.status.replace(/\s+/g, '-').toLowerCase()}`}>
                                                    {order.status}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard;

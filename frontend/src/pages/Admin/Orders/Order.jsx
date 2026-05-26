import React, { useEffect, useState } from 'react'
import './Order.css'
import axios from 'axios';
import {toast} from 'react-toastify';
import { assets } from '../../../assets/assets';

const Order = ({url, token}) => {

  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () =>{
    try {
        const response = await axios.get(url+"/api/order/list", { headers: { token } });
        if (response.data.success) {
          setOrders(response.data.data);
        } else{
          toast.error("error");
        }
    } catch(e) {
        toast.error("Error fetching orders (Unauthorized?)")
    }
  }

  const statusHandler = async (event,orderId) =>{
    try {
        const response = await axios.post(url+"/api/order/status", {
          orderId,
          status:event.target.value
        }, { headers: { token } })
        if (response.data.success) {
          await fetchAllOrders();
        } 
    } catch(e) {
        toast.error("Error updating status (Unauthorized?)")
    }
  }

  useEffect(()=>{
    fetchAllOrders();
  },[])

  const getStatusClass = (status) => {
    switch (status) {
      case 'Cancelled': return 'status-cancelled';
      case 'Delivered': return 'status-delivered';
      case 'Out for delivery': return 'status-out';
      case 'Food Processing': return 'status-processing';
      case 'Waiting Payment': return 'status-waiting';
      default: return '';
    }
  }

  return (
    <div className='order saas-dashboard'>
      <div className="dashboard-header">
          <div className="header-title">
              <h2>Orders Management</h2>
              <p>Track, process, and manage incoming customer orders</p>
          </div>
          <div className="header-actions">
              <button className="saas-btn secondary" onClick={fetchAllOrders}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
                  Refresh
              </button>
          </div>
      </div>
      
      <div className="saas-panel">
        <div className="data-table-container">
          {orders.length === 0 ? (
            <div className="empty-state">
                <h3>No Orders Yet</h3>
                <p>Customer orders will appear here once they are placed.</p>
            </div>
          ) : (
            <table className="saas-table order-table">
                <thead>
                    <tr>
                        <th>Order Details</th>
                        <th>Customer</th>
                        <th>Amount</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                  {orders.map((order,index)=>(
                    <tr key={index}>
                      <td>
                        <div className="order-summary-cell">
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#64748b" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
                          <div className="order-summary-content">
                            <span className="font-mono text-muted">#{order._id.substring(0,8)}</span>
                            <p className='order-item-food'>
                              {order.items.map((item,idx)=>{
                                  if (idx===order.items.length-1) return item.name + " x "+item.quantity;
                                  return item.name + " x "+ item.quantity + ", ";
                              })}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="customer-cell">
                          <p className="order-item-name font-medium">{order.address.firstName+" "+order.address.lastName}</p>
                          <p className="text-muted">{order.address.street}</p>
                          <p className="text-muted">{order.address.phone}</p>
                        </div>
                      </td>
                      <td>
                        <div className="amount-cell">
                          <span className="font-medium">Rp {order.amount.toLocaleString('id-ID')}</span>
                          <span className="text-muted">{order.items.length} items</span>
                        </div>
                      </td>
                      <td>
                        <select className={`saas-select status-select ${getStatusClass(order.status)}`} onChange={(event)=>statusHandler(event,order._id)} value={order.status}>
                          <option value="Waiting Payment">Waiting Payment</option>
                          <option value="Food Processing">Food Processing</option>
                          <option value="Out for delivery">Out for delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

export default Order
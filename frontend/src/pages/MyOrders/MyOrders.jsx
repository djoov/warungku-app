import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const MyOrders = () => {

    const {url,token,setCartItems} = useContext(StoreContext);
    const [data,setData] = useState([]);
    const [trackingId, setTrackingId] = useState(null);
    const [payingId, setPayingId] = useState(null);
    const navigate = useNavigate();

    const fetchOrders = async () => {
        const response = await axios.post(url+'/api/order/userorders',{},{headers:{token}})
        setData(response.data.data);
    }

    const trackOrder = async (orderId) => {
        setTrackingId(orderId);
        try {
            const response = await axios.post(url+'/api/order/userorders',{},{headers:{token}});
            setData(response.data.data);
            const order = response.data.data.find(o => o._id === orderId);
            if (order) {
                toast.info(`Status: ${order.status}`, { autoClose: 3000 });
            }
        } catch (err) {
            toast.error("Failed to track order");
        }
        setTimeout(() => setTrackingId(null), 1000);
    }

    const [isDevBypass, setIsDevBypass] = useState(false);

    const retryPayment = async (orderId) => {
        setPayingId(orderId);

        if (isDevBypass) {
            try {
                await axios.post(url+"/api/order/verify", { orderId, success: true }, {headers:{token}});
                toast.success("Dev Mode: Payment bypassed & successful!");
                navigate('/success');
            } catch (err) {
                toast.error("Bypass failed");
            }
            setPayingId(null);
            return;
        }

        try {
            const response = await axios.post(url+'/api/order/retry-payment', { orderId }, {headers:{token}});
            if (response.data.success) {
                const snapToken = response.data.token;
                window.snap.pay(snapToken, {
                    onSuccess: async function (result) {
                        await axios.post(url+"/api/order/verify", { orderId, success: true }, {headers:{token}});
                        setCartItems({});
                        navigate('/success');
                    },
                    onPending: function (result) {
                        toast.info("Payment pending.");
                        fetchOrders();
                    },
                    onError: function (result) {
                        toast.error("Payment failed. Try again later.");
                        fetchOrders();
                    },
                    onClose: function () {
                        toast.warn("Payment belum selesai.");
                        fetchOrders();
                    }
                });
            } else {
                toast.error(response.data.message);
            }
        } catch (err) {
            toast.error("Failed to create payment");
        }
        setPayingId(null);
    }

    const getStatusColor = (status) => {
        switch(status) {
            case 'Delivered': return '#22c55e';
            case 'Out for delivery': return '#3b82f6';
            case 'Food Processing': return '#eab308';
            case 'Waiting Payment': return '#f97316';
            case 'Cancelled': return '#ef4444';
            default: return 'tomato';
        }
    }

    useEffect(()=>{
        if (token) {
            fetchOrders();
        }
    },[token])

    const getStepIndex = (status) => {
        if (status === 'Delivered') return 3;
        if (status === 'Out for delivery') return 2;
        if (status === 'Food Processing') return 1;
        return 0; // Waiting Payment or Cancelled
    }

  return (
    <div className='my-orders'>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h2>Pesanan Saya</h2>
            <div className="dev-bypass-toggle" style={{padding: '6px 12px', background: '#fff5f5', border: '1px dashed tomato', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <input 
                    type="checkbox" 
                    id="dev-bypass" 
                    checked={isDevBypass} 
                    onChange={(e) => setIsDevBypass(e.target.checked)} 
                />
                <label htmlFor="dev-bypass" style={{color: 'tomato', fontWeight: 600, cursor: 'pointer', margin: 0}}>Dev Mode: Bypass Payment</label>
            </div>
        </div>
        <div className="container">
            {data.length === 0 ? (
                <div className="empty-state-container">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-state-svg">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                    </svg>
                    <h3>Belum Ada Pesanan</h3>
                    <p>Anda belum pernah melakukan pemesanan. Yuk, lihat menu kami!</p>
                    <button onClick={() => navigate('/menu')} className="empty-state-btn">Lihat Menu</button>
                </div>
            ) : (
                data.map((order,index)=>{
                    const isUnpaid = order.payment === false;
                    const step = getStepIndex(order.status);
                    
                    return(
                        <div key={index} className={`my-orders-order ${isUnpaid ? 'unpaid' : ''}`}>
                            <div className="order-main-info">
                                <img src={assets.parcel_icon} alt="" />
                                <div className="order-details-text">
                                    <p className="order-items-list">{order.items.map((item,idx)=>{
                                        return idx === order.items.length-1 ? item.name+" x "+item.quantity : item.name+" x "+item.quantity+", "
                                    })}</p>
                                    <p className="order-price">Rp {order.amount.toLocaleString('id-ID')}</p>
                                    <p className="order-count">Items: {order.items.length}</p>
                                </div>
                                <div className="order-status-badge">
                                    <p><span style={{color: getStatusColor(order.status)}}>&#x25cf;</span> <b style={{color: getStatusColor(order.status)}}>{order.status}</b></p>
                                </div>
                            </div>
                            
                            {/* Stepper Visualization */}
                            {!isUnpaid && order.status !== 'Cancelled' && (
                                <div className="order-stepper">
                                    <div className={`step ${step >= 1 ? 'active' : ''}`}>
                                        <div className="step-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '20px', height: '20px'}}>
                                                <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>
                                            </svg>
                                        </div>
                                        <p>Dimasak</p>
                                    </div>
                                    <div className={`step-line ${step >= 2 ? 'active' : ''}`}></div>
                                    <div className={`step ${step >= 2 ? 'active' : ''}`}>
                                        <div className="step-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '20px', height: '20px'}}>
                                                <rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/>
                                            </svg>
                                        </div>
                                        <p>Diantar</p>
                                    </div>
                                    <div className={`step-line ${step >= 3 ? 'active' : ''}`}></div>
                                    <div className={`step ${step >= 3 ? 'active' : ''}`}>
                                        <div className="step-icon">
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{width: '20px', height: '20px'}}>
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                                            </svg>
                                        </div>
                                        <p>Sampai</p>
                                    </div>
                                </div>
                            )}

                            <div className="order-actions">
                                {isUnpaid ? (
                                    <button 
                                        className="pay-now-btn"
                                        onClick={() => retryPayment(order._id)}
                                        disabled={payingId === order._id}
                                    >
                                        {payingId === order._id ? '⏳ Loading...' : '💳 Bayar Sekarang'}
                                    </button>
                                ) : (
                                    <button 
                                        className={`track-btn ${trackingId === order._id ? 'tracking' : ''}`} 
                                        onClick={() => trackOrder(order._id)}
                                        disabled={trackingId === order._id}
                                    >
                                        {trackingId === order._id ? '⏳ Tracking...' : '🔄 Refresh Status'}
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })
            )}
        </div>
        
    </div>
  )
}

export default MyOrders
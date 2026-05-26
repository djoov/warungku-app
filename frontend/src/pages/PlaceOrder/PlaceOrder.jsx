import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'

const PlaceOrder = () => {

  const {getTotalCartAmmount,token,food_list,cartItems,url,setCartItems} = useContext(StoreContext)
  const navigate = useNavigate();

  const [data,setData] = useState({
    firstName:"",
    lastName:"",
    email:"",
    street:"",
    city:"",
    state:"",
    zipcode:"",
    country:"",
    phone:""
  })

  const onChangeHandler = (event) =>{
    const name = event.target.name;
    const value = event.target.value;
    setData(data=>({...data,[name]:value}))
  }

  const [isDevBypass, setIsDevBypass] = useState(false);

  const placeOrder = async (event) => {
    event.preventDefault();
    let orderItems = [];
    food_list.map((item)=>{
      if (cartItems[item._id] > 0) {
        let itemInfo = item;
        itemInfo["quantity"] = cartItems[item._id]
        orderItems.push(itemInfo)
      }
    }) 
    let orderData = {
      address:data,
      items:orderItems,
      amount:getTotalCartAmmount()+5000,
    }
    try {
      let response = await axios.post(url+"/api/order/place", orderData, {headers:{token}});
      if (response.data.success) {
        const snapToken = response.data.token;
        const orderId = response.data.orderId;

        if (isDevBypass) {
            // DEV BYPASS: Skip Midtrans completely and force success
            await axios.post(url+"/api/order/verify", { orderId, success: true }, {headers:{token}});
            setCartItems({});
            toast.success("Dev Mode: Payment bypassed & successful!");
            navigate("/success");
            return;
        }

        window.snap.pay(snapToken, {
            onSuccess: async function (result) {
                await axios.post(url+"/api/order/verify", { orderId, success: true }, {headers:{token}});
                setCartItems({});
                navigate("/success");
            },
            onPending: function (result) {
                toast.info("Payment pending. You can complete it from My Orders.");
                navigate("/myorders");
            },
            onError: async function (result) {
                toast.error("Payment failed. You can retry from My Orders.");
                navigate("/myorders");
            },
            onClose: function () {
                toast.warn("Payment belum selesai. Anda bisa bayar lagi dari halaman My Orders.");
                navigate("/myorders");
            }
        });
      }
      else {
        toast.error(response.data.message || "Error placing order");
      }
    } catch (error) {
      toast.error("Failed to connect to payment gateway. Check API Keys.");
    }
  }

  useEffect(()=>{
    if (!token) {
      navigate('/cart');
    }
    else if(getTotalCartAmmount()===0){
      navigate('/cart');
    }
  },[token])

  return (
    <div className='place-order-wrapper'>
      <form onSubmit={placeOrder} className='place-order'>
        <div className="place-order-left">
          <div className="checkout-form-card">
            <h2>Informasi Pengiriman</h2>
            <p className="form-subtitle">Silakan isi alamat lengkap untuk pengiriman pesanan Anda.</p>
            
            <div className="form-grid">
              <div className="input-group">
                <label>Nama Depan</label>
                <input required name='firstName' onChange={onChangeHandler} value={data.firstName} type="text" placeholder='Cth: Budi' />
              </div>
              <div className="input-group">
                <label>Nama Belakang</label>
                <input required name='lastName' onChange={onChangeHandler} value={data.lastName} type="text" placeholder='Cth: Santoso' />
              </div>
            </div>

            <div className="input-group full-width">
              <label>Email Address</label>
              <input required name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='budi@example.com' />
            </div>

            <div className="input-group full-width">
              <label>Alamat Lengkap (Jalan, RT/RW, Patokan)</label>
              <input required name='street' onChange={onChangeHandler} value={data.street} type="text" placeholder='Jl. Margonda Raya No.10, Samping Indomaret' />
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>Kota / Kecamatan</label>
                <input required name='city' onChange={onChangeHandler} value={data.city} type="text" placeholder='Depok' />
              </div>
              <div className="input-group">
                <label>Provinsi</label>
                <input required name='state' onChange={onChangeHandler} value={data.state} type="text" placeholder='Jawa Barat' />
              </div>
            </div>

            <div className="form-grid">
              <div className="input-group">
                <label>Kode Pos</label>
                <input required name='zipcode' onChange={onChangeHandler} value={data.zipcode} type="text" placeholder='16424' />
              </div>
              <div className="input-group">
                <label>Negara</label>
                <input required name='country' onChange={onChangeHandler} value={data.country} type="text" placeholder='Indonesia' />
              </div>
            </div>

            <div className="input-group full-width">
              <label>No. Telepon / WhatsApp</label>
              <input required name='phone' onChange={onChangeHandler} value={data.phone} type="tel" placeholder='081234567890' />
            </div>
          </div>
        </div>

        <div className="place-order-right">
          <div className="cart-summary-card">
            <h3>Ringkasan Pesanan</h3>
            <div className="summary-details">
              <div className="summary-row">
                <p>Subtotal</p>
                <p>Rp {getTotalCartAmmount().toLocaleString('id-ID')}</p>
              </div>
              <div className="summary-row">
                <p>Ongkos Kirim</p>
                <p>Rp {getTotalCartAmmount() === 0 ? 0 : '5.000'}</p>
              </div>
              <div className="summary-divider"></div>
              <div className="summary-row total">
                <b>Total Tagihan</b>
                <b>Rp {(getTotalCartAmmount() === 0 ? 0 : getTotalCartAmmount() + 5000).toLocaleString('id-ID')}</b>
              </div>
            </div>
            <button type='submit' className="checkout-btn">BAYAR SEKARANG</button>
            <p className="checkout-note">Pembayaran aman didukung oleh Midtrans. Pastikan alamat Anda sudah benar sebelum membayar.</p>
            <div className="dev-bypass-toggle" style={{marginTop: '15px', padding: '10px', background: '#fff5f5', border: '1px dashed tomato', borderRadius: '8px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px'}}>
              <input 
                type="checkbox" 
                id="dev-bypass" 
                checked={isDevBypass} 
                onChange={(e) => setIsDevBypass(e.target.checked)} 
              />
              <label htmlFor="dev-bypass" style={{color: 'tomato', fontWeight: 600, cursor: 'pointer'}}>Dev Mode: Bypass Midtrans Payment</label>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default PlaceOrder
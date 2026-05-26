import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, addToCart, getTotalCartAmmount, token } = useContext(StoreContext);
  const navigate = useNavigate()

  const hasItems = food_list.some(item => cartItems[item._id] > 0);

  const handleCheckout = () => {
    if (!token) {
      toast.info("Silakan Sign In terlebih dahulu untuk memesan");
      navigate('/login');
    } else {
      navigate('/order');
    }
  }

  return (
    <div className='cart'>
      <h2>Keranjang Belanja</h2>
      
      {!hasItems ? (
        <div className="empty-state-container">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="empty-state-svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
          </svg>
          <h3>Keranjang Masih Kosong</h3>
          <p>Sepertinya Anda belum menambahkan menu apapun.</p>
          <button onClick={() => navigate('/menu')} className="empty-state-btn">Lihat Menu</button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items-list">
            {food_list.map((item, index) => {
              if (cartItems[item._id] > 0) {
                return (
                  <div key={index} className="cart-item-card">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-details">
                      <h4>{item.name}</h4>
                      <p className="cart-item-price">Rp {item.price.toLocaleString('id-ID')}</p>
                    </div>
                    
                    <div className="cart-item-controls">
                      <img 
                        onClick={() => removeFromCart(item._id)} 
                        src={assets.remove_icon_red} 
                        alt="Remove" 
                        className="control-icon"
                      />
                      <span className="cart-item-quantity">{cartItems[item._id]}</span>
                      <img 
                        onClick={() => addToCart(item._id)} 
                        src={assets.add_icon_green} 
                        alt="Add" 
                        className="control-icon"
                      />
                    </div>
                    
                    <div className="cart-item-total">
                      <p>Rp {(item.price * cartItems[item._id]).toLocaleString('id-ID')}</p>
                    </div>
                  </div>
                )
              }
              return null;
            })}
          </div>

          <div className="cart-summary-card">
            <h3>Ringkasan Belanja</h3>
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
            <button onClick={handleCheckout} className="checkout-btn">LANJUT PEMBAYARAN</button>
            <p className="checkout-note">Pembayaran didukung oleh QRIS, GoPay, dan Bank Transfer (Midtrans).</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart
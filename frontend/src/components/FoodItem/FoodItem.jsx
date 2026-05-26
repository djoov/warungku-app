import React, { useContext, useRef } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../context/StoreContext';

const FoodItem = ({id,name,price,description,image}) => {

  const {cartItems,addToCart,removeFromCart} = useContext(StoreContext);
  const imgRef = useRef(null);

  const handleAddToCart = (e) => {
    // Trigger the actual cart add
    addToCart(id);

    // --- Fly-to-cart animation ---
    const cartIcon = document.getElementById('cart-icon');
    if (!cartIcon || !imgRef.current) return;

    const imgRect = imgRef.current.getBoundingClientRect();
    const cartRect = cartIcon.getBoundingClientRect();

    // Create flying element
    const flyEl = document.createElement('div');
    flyEl.className = 'fly-to-cart';
    flyEl.style.backgroundImage = `url(${image})`;
    flyEl.style.left = `${imgRect.left + imgRect.width / 2 - 25}px`;
    flyEl.style.top = `${imgRect.top + imgRect.height / 2 - 25}px`;

    // Calculate deltas for CSS custom properties
    const deltaX = cartRect.left + cartRect.width / 2 - (imgRect.left + imgRect.width / 2);
    const deltaY = cartRect.top + cartRect.height / 2 - (imgRect.top + imgRect.height / 2);
    flyEl.style.setProperty('--fly-x', `${deltaX}px`);
    flyEl.style.setProperty('--fly-y', `${deltaY}px`);

    document.body.appendChild(flyEl);

    // Bounce effect on cart icon
    flyEl.addEventListener('animationend', () => {
      flyEl.remove();
      cartIcon.classList.add('cart-bounce');
      setTimeout(() => cartIcon.classList.remove('cart-bounce'), 400);
    });
  }

  return (
    <div className='food-item'>
      <div className="food-item-img-container">
        <img ref={imgRef} className='food-item-image' src={image} alt="" />
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
        </div>
        <p className="food-item-desc">
          {description}
        </p>
        <div className="food-item-price-cart">
          <p className="food-item-price">Rp {price.toLocaleString('id-ID')}</p>
          {!cartItems[id] 
            ? <button className='btn-add-cart' onClick={handleAddToCart}>+ Tambah</button>
            : <div className='food-item-counter-modern'>
                <button className='btn-counter minus' onClick={()=>removeFromCart(id)}>-</button>
                <p>{cartItems[id]}</p>
                <button className='btn-counter plus' onClick={handleAddToCart}>+</button>
              </div>
          }
        </div>
      </div>
    </div>
  )
}

export default FoodItem
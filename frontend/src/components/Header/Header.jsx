import React from 'react'
import './Header.css'
import { useNavigate } from 'react-router-dom'

const Header = () => {
  const navigate = useNavigate();
  return (
    <div className='header'>
        <div className="header-contents">
            <h2>Pesan Mudah, Warung Maju 🍛</h2>
            <p>Pesan makanan dari warung remesan favoritmu tanpa perlu antre panjang. Dengan WarungKu, nikmati kemudahan memesan makanan dan bayar praktis via QRIS. Pesan Mudah, Warung Maju!</p>
            <button onClick={() => navigate('/menu')}>Pesan Sekarang</button>
        </div>
    </div>
  )
}

export default Header
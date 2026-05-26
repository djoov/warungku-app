import React, { useEffect } from 'react';
import './Success.css';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Success = () => {
    const navigate = useNavigate();

    // Auto redirect after a few seconds or just let user click
    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/myorders');
        }, 5000);
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className='success-page'>
            <div className="success-container">
                <div className="success-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle cx="12" cy="12" r="10" stroke="tomato" strokeWidth="2" fill="#fff5f5"/>
                        <path d="M8 12.5L10.5 15L16 9" stroke="tomato" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </div>
                <h2>Pembayaran Berhasil!</h2>
                <p>Terima kasih atas pesanan Anda. Makanan Anda sedang disiapkan dan akan segera diantar.</p>
                
                <div className="success-actions">
                    <button className="track-btn" onClick={() => navigate('/myorders')}>Lacak Pesanan</button>
                    <button className="home-btn" onClick={() => navigate('/')}>Kembali ke Beranda</button>
                </div>
                <p className="auto-redirect-text">Anda akan diarahkan ke halaman pesanan dalam 5 detik...</p>
            </div>
        </div>
    )
}

export default Success;

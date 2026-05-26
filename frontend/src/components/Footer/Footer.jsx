import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className="footer-content-left">
                <h1 className="logo-text">WarungKu<span className="dot">.</span></h1>
                <p>Mitra andalan warung remesan Anda. Kami menghubungkan Anda dengan warung lokal favorit di Depok. Pesan mudah tanpa antre, dukung UMKM lokal untuk terus maju.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="Facebook" />
                    <img src={assets.twitter_icon} alt="Twitter" />
                    <img src={assets.linkedin_icon} alt="LinkedIn" />
                </div>
            </div>
            <div className="footer-content-center">
                <h2>Perusahaan</h2>
                <ul>
                    <li><Link to="/">Beranda</Link></li>
                    <li><Link to="/menu">Menu Kami</Link></li>
                    <li><Link to="/contact">Hubungi Kami</Link></li>
                    <li><Link to="/privacy-policy">Kebijakan Privasi</Link></li>
                </ul>
            </div>
            <div className="footer-content-right">
                <h2>Kontak</h2>
                <ul>
                    <li>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                        +62 812-3456-7890
                    </li>
                    <li>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                        support@warungku.id
                    </li>
                </ul>
            </div>
        </div>
        <div className="footer-newsletter">
            <h3>Berlangganan Promo</h3>
            <div className="newsletter-input">
                <input type="email" placeholder="Masukkan email Anda" />
                <button>Kirim</button>
            </div>
        </div>
        <hr />
        <p className="footer-copyright">Copyright 2026 &copy; WarungKu. All Rights Reserved.</p>
    </div>
  )
}

export default Footer
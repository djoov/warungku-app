import React from 'react'
import './AppDownload.css'
import { assets } from '../../assets/assets'

const AppDownload = () => {
  return (
    <div className='app-download-section' id='app-download'>
        <div className='why-warungku'>
            <h2>Kenapa WarungKu?</h2>
            <div className="why-grid">
                <div className="why-card">
                    <span className="why-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </span>
                    <h3>Pesan Mudah</h3>
                    <p>Cukup pilih menu, isi alamat, dan bayar. Cepat!</p>
                </div>
                <div className="why-card">
                    <span className="why-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
                        </svg>
                    </span>
                    <h3>Bayar Digital</h3>
                    <p>Praktis via QRIS, GoPay, ShopeePay, Midtrans.</p>
                </div>
                <div className="why-card">
                    <span className="why-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
                        </svg>
                    </span>
                    <h3>Dukung UMKM</h3>
                    <p>Setiap pesanan mendukung warung lokal.</p>
                </div>
                <div className="why-card">
                    <span className="why-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="why-svg">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                        </svg>
                    </span>
                    <h3>Antar Cepat</h3>
                    <p>Diantarkan langsung ke lokasi Anda.</p>
                </div>
            </div>
        </div>
        
        <div className="app-coming-soon">
            <div className="app-coming-soon-content">
                <h2>Mobile App <br/><span className="text-highlight">Coming Soon!</span></h2>
                <p>Aplikasi mobile WarungKu akan segera hadir di Play Store & App Store. Makin mempermudah pesanan makanan favoritmu kapan saja dan di mana saja!</p>
                <div className="app-store-badges">
                    <img src={assets.play_store} alt="Play Store" className="grayscale" />
                    <img src={assets.app_store} alt="App Store" className="grayscale" />
                </div>
            </div>
            <div className="app-coming-soon-img">
                <img src={assets.app_hero} alt="WarungKu Mobile App" />
            </div>
        </div>
    </div>
  )
}

export default AppDownload
import React, { useState } from 'react';
import './ContactUs.css';
import { toast } from 'react-toastify';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    // Simulate API call
    setTimeout(() => {
      toast.success("Pesan Anda telah berhasil dikirim. Kami akan segera menghubungi Anda!");
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 500);
  };

  return (
    <div className='contact-page'>
      <div className="contact-header">
        <h1>Hubungi Kami</h1>
        <p>Punya pertanyaan, saran, atau kendala? Jangan ragu untuk menghubungi tim WarungKu.</p>
      </div>

      <div className="contact-container">
        <div className="contact-info-section">
          <h2>Informasi Kontak</h2>
          <p className="contact-subtitle">Kami siap membantu Anda setiap hari dari pukul 08:00 - 22:00 WIB.</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <h4>Alamat</h4>
                <p>Jl. Margonda Raya No. 100<br/>Depok, Jawa Barat, 16424</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h4>Telepon / WhatsApp</h4>
                <p>+62 812-3456-7890</p>
              </div>
            </div>
            
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <h4>Email Support</h4>
                <p>support@warungku.id</p>
              </div>
            </div>
          </div>
          
          <div className="contact-social">
            <h4>Ikuti Kami</h4>
            <div className="social-links">
              <span className="social-badge">Instagram</span>
              <span className="social-badge">Twitter</span>
              <span className="social-badge">Facebook</span>
            </div>
          </div>
        </div>

        <div className="contact-form-section">
          <h2>Kirim Pesan</h2>
          <form onSubmit={onSubmitHandler} className="contact-form">
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={onChangeHandler} 
                placeholder="Masukkan nama Anda" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Alamat Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={onChangeHandler} 
                placeholder="email@contoh.com" 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Subjek</label>
              <select name="subject" value={formData.subject} onChange={onChangeHandler} required>
                <option value="" disabled>Pilih topik...</option>
                <option value="Tanya Menu/Warung">Pertanyaan seputar Menu/Warung</option>
                <option value="Kendala Pesanan">Kendala Pesanan</option>
                <option value="Saran & Masukan">Saran & Masukan</option>
                <option value="Kemitraan">Kemitraan (Daftar Warung)</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Pesan</label>
              <textarea 
                name="message" 
                value={formData.message} 
                onChange={onChangeHandler} 
                rows="5" 
                placeholder="Tuliskan pesan Anda di sini..." 
                required 
              ></textarea>
            </div>
            
            <button type="submit" className="contact-submit-btn">Kirim Pesan</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;

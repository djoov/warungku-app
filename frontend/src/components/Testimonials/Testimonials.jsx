import React from 'react';
import './Testimonials.css';

const testimonialsData = [
  {
    id: 1,
    name: "Budi Santoso",
    role: "Mahasiswa UI",
    text: "Sangat membantu buat mahasiswa yang mager antre! Pesan dari kosan, sampai warung tinggal ambil. Mantap WarungKu!",
    avatar: "https://ui-avatars.com/api/?name=Budi+Santoso&background=random&color=fff&size=100"
  },
  {
    id: 2,
    name: "Siti Rahma",
    role: "Karyawan Swasta",
    text: "Makan siang kantor jadi lebih praktis. Harganya juga harga asli warung, nggak di-markup gila-gilaan seperti aplikasi lain.",
    avatar: "https://ui-avatars.com/api/?name=Siti+Rahma&background=random&color=fff&size=100"
  },
  {
    id: 3,
    name: "Ahmad Fauzi",
    role: "Pekerja Lepas",
    text: "UI/UX-nya sangat mulus dan enak dilihat. Bayar pakai Midtrans juga cepat. Sukses terus untuk developer WarungKu!",
    avatar: "https://ui-avatars.com/api/?name=Ahmad+Fauzi&background=random&color=fff&size=100"
  }
];

const Testimonials = () => {
  return (
    <div className="testimonials-section">
      <div className="testimonials-header">
        <h2>Apa Kata Mereka?</h2>
        <p>Ribuan pelanggan telah menikmati kemudahan pesan makan tanpa antre bersama WarungKu.</p>
      </div>
      
      <div className="testimonials-grid">
        {testimonialsData.map((review) => (
          <div className="testimonial-card" key={review.id}>
            <div className="testimonial-stars">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              ))}
            </div>
            <p className="testimonial-text">"{review.text}"</p>
            <div className="testimonial-user">
              <img src={review.avatar} alt={review.name} className="testimonial-avatar" />
              <div className="testimonial-user-info">
                <h4>{review.name}</h4>
                <span>{review.role}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;

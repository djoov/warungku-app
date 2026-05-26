import React from 'react'
import './PrivacyPolicy.css'

const PrivacyPolicy = () => {
  return (
    <div className='privacy-policy'>
        <h1>Kebijakan Privasi</h1>
        <p className="last-updated">Terakhir diperbarui: 21 Mei 2026</p>

        <section>
            <h2>1. Pendahuluan</h2>
            <p>
                Selamat datang di <strong>WarungKu</strong>. Kami menghargai dan melindungi privasi Anda. 
                Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menyimpan, dan 
                melindungi informasi pribadi Anda saat menggunakan platform WarungKu.
            </p>
        </section>

        <section>
            <h2>2. Informasi yang Kami Kumpulkan</h2>
            <p>Kami mengumpulkan informasi berikut saat Anda menggunakan layanan kami:</p>
            <ul>
                <li><strong>Data Akun:</strong> Nama, alamat email, dan password terenkripsi saat Anda mendaftar.</li>
                <li><strong>Data Pengiriman:</strong> Alamat lengkap, nomor telepon/WhatsApp, dan nama penerima yang Anda masukkan saat checkout.</li>
                <li><strong>Data Transaksi:</strong> Riwayat pesanan, jumlah pembayaran, dan status transaksi yang diproses melalui payment gateway Midtrans.</li>
                <li><strong>Data Autentikasi Google:</strong> Jika Anda menggunakan fitur "Masuk dengan Google", kami menerima nama dan email dari akun Google Anda.</li>
            </ul>
        </section>

        <section>
            <h2>3. Penggunaan Informasi</h2>
            <p>Informasi yang kami kumpulkan digunakan untuk:</p>
            <ul>
                <li>Memproses dan mengirimkan pesanan Anda ke warung mitra.</li>
                <li>Memproses pembayaran secara aman melalui gateway Midtrans.</li>
                <li>Menghubungi Anda terkait status pesanan melalui email atau WhatsApp.</li>
                <li>Meningkatkan kualitas layanan dan pengalaman pengguna platform.</li>
                <li>Menampilkan riwayat pesanan di halaman "My Orders".</li>
            </ul>
        </section>

        <section>
            <h2>4. Keamanan Data</h2>
            <p>
                Kami menerapkan langkah-langkah keamanan berikut untuk melindungi data Anda:
            </p>
            <ul>
                <li>Password pengguna di-enkripsi menggunakan algoritma <strong>bcrypt</strong> sebelum disimpan.</li>
                <li>Autentikasi menggunakan <strong>JSON Web Token (JWT)</strong> yang berlaku selama 7 hari.</li>
                <li>Data pembayaran <strong>tidak pernah disimpan</strong> di server kami — seluruh transaksi diproses langsung oleh Midtrans yang telah bersertifikat PCI-DSS.</li>
                <li>Komunikasi antara browser dan server dilindungi menggunakan protokol <strong>HTTPS</strong>.</li>
            </ul>
        </section>

        <section>
            <h2>5. Berbagi Data dengan Pihak Ketiga</h2>
            <p>Kami <strong>tidak menjual</strong> data pribadi Anda. Data hanya dibagikan kepada:</p>
            <ul>
                <li><strong>Midtrans (PT Midtrans):</strong> Untuk memproses pembayaran digital (QRIS, Virtual Account, dll).</li>
                <li><strong>Firebase (Google Cloud):</strong> Sebagai infrastruktur penyimpanan database dan autentikasi.</li>
                <li><strong>Warung Mitra:</strong> Informasi pengiriman (nama, alamat, telepon) untuk memenuhi pesanan Anda.</li>
            </ul>
        </section>

        <section>
            <h2>6. Hak Pengguna</h2>
            <p>Sebagai pengguna WarungKu, Anda berhak untuk:</p>
            <ul>
                <li>Mengakses dan melihat data pesanan Anda melalui halaman "My Orders".</li>
                <li>Meminta penghapusan akun dan data pribadi Anda dengan menghubungi kami.</li>
                <li>Memilih untuk tidak menggunakan fitur autentikasi pihak ketiga (Google).</li>
            </ul>
        </section>

        <section>
            <h2>7. Cookies</h2>
            <p>
                WarungKu menggunakan <strong>localStorage</strong> browser untuk menyimpan token autentikasi 
                dan preferensi keranjang belanja. Ini diperlukan agar Anda tetap login saat berpindah halaman. 
                Anda dapat menghapus data ini kapan saja melalui pengaturan browser.
            </p>
        </section>

        <section>
            <h2>8. Perubahan Kebijakan</h2>
            <p>
                Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan akan diumumkan melalui 
                halaman ini dengan tanggal pembaruan terbaru. Penggunaan platform setelah perubahan berarti 
                Anda menyetujui kebijakan yang diperbarui.
            </p>
        </section>

        <section>
            <h2>9. Hubungi Kami</h2>
            <p>Jika Anda memiliki pertanyaan tentang Kebijakan Privasi ini, silakan hubungi:</p>
            <div className="contact-info">
                <p>📧 <strong>Email:</strong> support@warungku.id</p>
                <p>📱 <strong>WhatsApp:</strong> +62 812-3456-7890</p>
                <p>📍 <strong>Alamat:</strong> Depok, Jawa Barat, Indonesia</p>
            </div>
        </section>
    </div>
  )
}

export default PrivacyPolicy

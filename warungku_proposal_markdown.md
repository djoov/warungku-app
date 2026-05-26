# Proposal Bisnis Digital — WarungKu | Engineering Innovation & Technopreneurship

IKPIA Perbanas Jakarta — Teknik Informatika / Semester 6 / 2025-2026  
Halaman 1

# PROPOSAL BISNIS DIGITAL

## WarungKu.

### Platform Digitalisasi Warung Remesan Lokal Berbasis Teknologi

> "Pesan Mudah, Warung Maju"

- **Mata Kuliah** : Engineering Innovation & Technopreneurship  
- **Kode / SKS** : TII1499-0R0A / 3 SKS  
- **Program Studi** : Teknik Informatika  
- **Semester** : 6 (Genap 2025/2026)  
- **Dosen** : Winny Purbaratri, S.Kom., M.Kom  
- **Tanggal** : 14 April 2026  

### Disusun oleh:

1. Nur Akhmad Van Jouvi — 2314000024  
2. Judika Marpaung — 2314000021  
3. Joshua Reynold Tampubolon — 2314000018  
4. Rachel Desica Patricia — 2314000013  
5. Paulus Firal Ohoiwutun — 2314000004  
6. Surya Kusuma — 2314000023  
7. Gamaliel Lamindo Manurung — 2313000020  

**IKPIA PERBANAS JAKARTA**  
Fakultas Teknologi Informasi  
2026

---

# A. Latar Belakang

## A.1 Permasalahan yang Diangkat

Warung remesan merupakan salah satu tulang punggung kuliner rakyat di Indonesia, khususnya di kota-kota padat seperti Depok. Namun, di balik perannya yang vital, mayoritas warung remesan masih beroperasi secara konvensional tanpa memanfaatkan teknologi digital sama sekali.

Berdasarkan observasi lapangan dan riset awal yang dilakukan tim, ditemukan beberapa permasalahan kritis yang dihadapi baik oleh pelanggan maupun pemilik warung:

| No. | Permasalahan | Dampak |
|---|---|---|
| 1 | 73% warung di area Depok belum menggunakan sistem pemesanan digital | Proses transaksi lambat dan tidak efisien |
| 2 | Antrean panjang 2–3x lebih padat di jam makan siang (11.00–13.00) | Pelanggan kehilangan waktu produktif |
| 3 | Sulitnya melacak ketersediaan stok bahan baku (inventori) | Sering terjadi kehabisan bahan saat pelanggan sudah memesan |
| 4 | Tidak ada sistem pembayaran digital yang terintegrasi, mayoritas tunai | Risiko kesalahan transaksi dan ketidakamanan |
| 5 | Warung tidak memiliki data penjualan dan resep (HPP) yang terstruktur | Pengambilan keputusan bisnis tidak berbasis data dan rawan rugi |

Permasalahan-permasalahan di atas menciptakan kesenjangan yang jelas antara kebutuhan masyarakat modern yang menginginkan kemudahan dan kecepatan, dengan kondisi operasional warung yang masih berjalan secara manual. 

## A.2 Urgensi Solusi Berbasis Teknologi

Dengan kondisi ini, solusi teknologi yang ringan, terjangkau, dan terpadu menjadi sangat mendesak. Solusi tersebut tidak hanya untuk pemesanan pelanggan (Customer App), tetapi juga harus mencakup **Sistem Point of Sale (POS)** untuk kasir offline, serta **Dashboard Admin (SaaS)** untuk manajemen inventori bahan baku dan pemetaan resep makanan.

---

# B. Konsep Bisnis

## B.1 Nama Produk / Startup

- **Nama Startup** : WarungKu  
- **Tagline** : "Pesan Mudah, Warung Maju"  
- **Platform** : Web Application (React.js Frontend & Node.js Backend)  
- **Domisili Awal** : Kota Depok, Jawa Barat  

## B.2 Deskripsi Produk / Jasa

WarungKu adalah ekosistem digital terpadu (berbasis SaaS) yang menghubungkan pelanggan dengan warung remesan lokal, sekaligus menyediakan sistem manajemen operasional yang komprehensif bagi pemilik warung.

Sistem WarungKu terdiri dari tiga modul utama:
1. **Public/Customer App:** Platform bagi pelanggan untuk melihat menu, membaca testimoni, memesan makanan (pre-order/takeaway), dan melakukan pembayaran digital (terintegrasi dengan Midtrans).
2. **Point of Sale (POS) Kasir:** Modul khusus bagi kasir warung untuk melayani pelanggan yang datang langsung (walk-in). Terintegrasi langsung dengan database untuk memotong stok bahan baku secara real-time.
3. **Admin & Inventory Dashboard:** Panel manajemen untuk pemilik warung. Dilengkapi fitur manajemen inventori bahan baku, pemetaan resep (recipe mapping) untuk menghitung HPP otomatis, serta pelacakan pesanan dan status pengiriman.

## B.3 Nilai Inovasi (Innovation Value)

| Dimensi Inovasi | Deskripsi Nilai |
|---|---|
| **Ekosistem Terpadu (All-in-One)** | Menggabungkan pemesanan online, POS offline, dan manajemen inventori dalam satu platform. Tidak perlu banyak aplikasi. |
| **Recipe Mapping & Auto-Deduction** | Setiap menu makanan dipetakan dengan bahan bakunya. Saat makanan terjual (online maupun offline via POS), stok bahan baku di gudang otomatis berkurang. |
| **Integrasi Pembayaran Otomatis** | Mendukung pembayaran cashless terverifikasi via Midtrans (QRIS, GoPay, Bank Transfer). |
| **SaaS-Grade UI/UX & Social Proof** | Antarmuka pengguna kelas premium (animasi interaktif, desain modern, footer elegan) dan dilengkapi fitur Testimoni untuk membangun kepercayaan pelanggan. |

---

# C. Analisis Peluang

## C.1 Target Market

### C.1.1 Sisi Pelanggan (Customer Side)

- **Mahasiswa & Pelajar (40%)**: Membutuhkan makanan cepat saji, murah, tanpa antre. (Sekitar UI, Gunadarma, dll).
- **Pekerja WFH / Karyawan (40%)**: Butuh makan siang instan tanpa meninggalkan meja kerja.
- **Masyarakat Umum (20%)**: Konsumen sekitar yang mencari kemudahan.

### C.1.2 Sisi Mitra Warung (Merchant/B2B Side)

- Pemilik warung makan, warteg, atau restoran skala kecil-menengah di Depok yang ingin mendigitalisasi kasir (POS), mengatur inventori secara profesional, dan membuka jalur pesanan online tanpa komisi besar (seperti GoFood/GrabFood).

## C.2 Tren Pasar

- **Adopsi Cashless:** Penggunaan QRIS meningkat tajam di berbagai lapisan masyarakat.
- **Manajemen Berbasis Data:** UMKM mulai sadar pentingnya melacak stok bahan baku dan pengeluaran.
- **Efisiensi Operasional:** Tingginya minat UMKM terhadap aplikasi kasir/POS yang murah namun fungsional.

---

# D. Analisis Kelayakan (Feasibility Study)

## D.1 Technical Feasibility (Kesiapan Teknologi)

Aplikasi WarungKu telah berhasil dibangun dan disesuaikan dengan arsitektur teknologi modern yang aman:

| Komponen Teknologi | Spesifikasi / Stack |
|---|---|
| **Frontend Framework** | React.js (Vite), React Router DOM |
| **Backend Framework** | Node.js dengan Express.js |
| **Database & Storage** | **Firebase (Firestore & Firebase Storage)** via Firebase Admin SDK |
| **Payment Gateway** | Midtrans API (Snap) |
| **Security & Auth** | JSON Web Token (JWT), bcrypt, CORS Policy terpadu, dan sistem bebas kebocoran credential (Sanitized Logs) |
| **UI/UX & Styling** | Vanilla CSS modern, Flexbox/Grid, animasi SaaS-grade, layout responsif |

Sistem telah memiliki fungsionalitas CRUD untuk inventori, sinkronisasi stok real-time, cart system untuk POS, dan portal pelanggan yang interaktif.

## D.2 Financial Feasibility (Model Bisnis Pendapatan)

WarungKu menggunakan pendekatan hybrid untuk monetisasi:
1. **Model SaaS (Software as a Service):** Biaya langganan bulanan bagi warung untuk mengakses Dashboard Admin, sistem POS, dan fitur Recipe Mapping.
2. **Transaction Fee:** Potongan biaya admin yang sangat kecil (misal: Rp 1.000 - Rp 2.000) per transaksi online untuk menutupi biaya payment gateway Midtrans.

---

# E. Business Model Canvas (BMC)

## 1. Customer Segments
- **B2C:** Mahasiswa, karyawan, dan warga Depok yang sibuk.
- **B2B:** Pemilik warung remesan lokal yang butuh sistem POS dan inventori terjangkau.

## 2. Value Proposition
- **B2C:** Pesan makan tanpa antre, bayar online mudah, antarmuka elegan.
- **B2B:** Dashboard SaaS premium, pengurangan stok otomatis (recipe mapping), kasir POS terintegrasi, bebas komisi 20-30% ala platform raksasa.

## 3. Channels
- Web App responsif (akses dari HP atau Laptop).
- Promosi via Instagram, TikTok, dan komunitas Paguyuban Warung.

## 4. Customer Relationships
- Layanan mandiri (Self-service) via portal pemesanan yang mudah.
- Dukungan B2B via WhatsApp untuk pemilik warung.

## 5. Revenue Streams
- Biaya langganan sistem POS/SaaS per bulan.
- Biaya layanan per transaksi online (Platform Fee).

## 6. Key Resources
- Platform Web (Frontend & Backend).
- Infrastruktur Cloud Firebase.
- Akun Midtrans Payment Gateway.

## 7. Key Activities
- Maintenance server dan sistem keamanan.
- Pengembangan fitur POS dan inventory lanjutan.
- Pemasaran dan onboarding warung mitra.

## 8. Key Partners
- **Midtrans:** Partner pemrosesan pembayaran (QRIS/Bank).
- **Google (Firebase):** Infrastruktur database dan hosting cloud.

## 9. Cost Structure
- Biaya operasional server/cloud (Firebase).
- Biaya API gateway pembayaran.
- Biaya pemasaran dan tim operasional/developer.

---

# Penutup

WarungKu lebih dari sekadar aplikasi pesan antar makanan; ini adalah sistem operasi **(OS) lengkap untuk UMKM kuliner**. Dengan mengintegrasikan sistem pemesanan online, Point of Sale (POS) offline, serta manajemen inventori & resep berbasis Firebase, WarungKu menawarkan solusi holistik agar warung remesan lokal bisa naik kelas, beroperasi secara efisien, dan siap menghadapi era digital.

> "Kami tidak menggantikan warung. Kami membuat warung lebih pintar dan lebih kuat."

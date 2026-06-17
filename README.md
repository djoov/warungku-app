# WarungKu App 🍔

WarungKu adalah aplikasi layanan pesan antar makanan dengan dua antarmuka utama:

1. **Frontend Customer:** Aplikasi React + Vite untuk pemesanan makanan pelanggan.
2. **Backend API:** Server Node.js + Express yang terhubung ke Firebase Firestore dan Firebase Storage.
3. **Admin Panel:** Dashboard React + Vite untuk manajemen menu, stok, pesanan, pengguna, dan POS.

---

## 📌 Fitur Utama

- Daftar menu dan pencarian makanan
- Keranjang belanja dan proses pemesanan
- Login pengguna dengan peran admin dan pelanggan
- Dashboard admin untuk menambah, mengelola, dan menghapus menu
- Manajemen pesanan, resep, inventori, dan pengguna
- Upload gambar makanan melalui Firebase Storage
- Autentikasi akses halaman admin dasar

---

## ⚙️ Persiapan Lingkungan

1. Pastikan sudah terpasang:
   - Node.js
   - npm atau pnpm

2. Jika menggunakan npm, jalankan dari root folder:

   ```bash
   npm install
   npm install concurrently
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. Jika menggunakan pnpm, jalankan di root folder:

   ```bash
   pnpm install
   pnpm --dir frontend install
   pnpm --dir backend install
   ```

4. Siapkan proyek Firebase dengan:
   - Firestore
   - Firebase Storage
   - Konfigurasi kredensial Firebase di frontend
   - Konfigurasi Firebase Admin di backend

---

## 📁 Struktur Proyek

- `frontend/` - aplikasi React untuk pelanggan dan admin panel
- `backend/` - API Express dan koneksi Firebase
- `Screenshots/` - gambar tampilan aplikasi

---

## 🚀 Menjalankan Aplikasi

Dari root folder proyek, jalankan:

```bash
npm run dev
```

Perintah ini akan menjalankan:

- Backend pada `http://localhost:4000`
- Frontend customer pada `http://localhost:5173`

> Catatan: Admin Panel berada dalam aplikasi frontend yang sama, diakses dengan login admin dan route `/admin`.

---

## 🔐 Rute & Akses

- `http://localhost:5173/` - Halaman utama pelanggan
- `http://localhost:5173/menu` - Menu makanan
- `http://localhost:5173/cart` - Keranjang belanja
- `http://localhost:5173/login` - Halaman login
- `http://localhost:5173/admin/dashboard` - Dashboard admin setelah login

---

## 🔧 Konfigurasi Firebase

Pastikan rule Firebase Storage dan Firestore sudah dikonfigurasi untuk pengembangan. Contoh rule minimal:

### Firebase Storage

```js
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

### Firestore

```js
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ Rule ini hanya untuk pengembangan. Untuk produksi, gunakan aturan keamanan Firebase yang sesuai.

---

## 🛠️ Teknologi

- Frontend: React, Vite, React Router DOM, React Toastify
- Backend: Node.js, Express, Firebase Admin, Multer, JWT, Midtrans
- Database: Firebase Firestore
- Storage: Firebase Storage

---

## 📌 Catatan

- Pastikan `backend/server.js` terhubung ke Firebase dengan benar.
- Pada `backend/server.js`, CORS mengizinkan `http://localhost:5173` dan `http://localhost:5174`.
- Halaman admin membutuhkan login sebagai pengguna dengan peran `admin`.

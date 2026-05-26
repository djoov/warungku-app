# Project UAS Remesan 🍔

This is a complete food delivery application consisting of three parts:
1. **Backend:** Node.js & Express API connected to **Firebase Firestore & Storage**.
2. **Frontend:** React + Vite customer-facing application.
3. **Admin Panel:** React + Vite dashboard for managing orders/food.

---

## 📋 Prerequisites (Requirements)

* **Node.js & npm:**
    * Download and install from: [nodejs.org](https://nodejs.org/)
    * Check if installed by running: `node -v` and `npm -v` in your terminal.

* **Firebase Project:**
    * This project uses Firebase Firestore (database) and Firebase Storage (image uploads).
    * Make sure Firebase Storage rules allow read/write (see below).

---

## 🔥 Firebase Storage Rules

Go to [Firebase Console](https://console.firebase.google.com/) → Storage → Rules, and set:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read, write: if true;
    }
  }
}
```

Also set Firestore rules (Firestore Database → Rules):
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

> ⚠️ These rules allow public access. For production, add proper authentication rules.

---

## 🚀 Quick Start (Single Command!)

1. **Install all dependencies** (first time only):
    ```bash
    npm run install-all
    ```

2. **Run everything with one command:**
    ```bash
    npm run dev
    ```

This will start:
- 🔵 **Backend** at `http://localhost:4000`
- 🟢 **Frontend** at `http://localhost:5173`
- 🟡 **Admin Panel** at `http://localhost:5174`

---

## ✨ Project Screenshots

### Customer Dashboard (Frontend)
![Customer Dashboard View 1](./Screenshots/dashboard1.png)
<br>
![Customer Dashboard View 2](./Screenshots/dashboard2.png)

### Admin Panel
![Admin Panel View 1](./Screenshots/admin1.png)
<br>
![Admin Panel View 2](./Screenshots/admin2.png)

## 🛠️ Built With

* **Frontend & Admin:** React, Vite, CSS
* **Backend:** Node.js, Express.js
* **Database:** Firebase Firestore
* **Storage:** Firebase Storage

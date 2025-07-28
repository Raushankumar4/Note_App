# 📝 Note Taking Application (MERN + Google & OTP Auth)

A full-stack note-taking app built using the **MERN stack** with dual authentication: **Google Login (OAuth2)** and **OTP via Email**. Users can securely create, view, update, and delete their personal notes.

---

## 🚀 Features

- 🔐 Dual Authentication:
  - ✅ Google Login via OAuth2.0
  - ✅ OTP-based login without password
- 🧑‍💻 Personal Note Management (CRUD)
- 🔐 JWT-based Protected Routes (Frontend + Backend)
- 🌐 RESTful API using Express.js
- 📬 OTP Email delivery via NodeMailer
- 💅 Modern UI with Tailwind CSS
- ⚡ Responsive design
- 🌍 Deployed-ready structure

---

## 🧠 Tech Stack

### 📌 Frontend

- React.js (w/ TypeScript)
- React Router DOM
- Axios
- Tailwind CSS
- Vite

### 📌 Backend

- Node.js + Express.js
- TypeScript
- MongoDB + Mongoose
- Passport.js (Google OAuth Strategy)
- JWT (jsonwebtoken)
- Express-session
- NodeMailer
- Dotenv

---

---

## 🔧 Setup & Installation

### 📦 1. Backend Setup

```bash
cd backend
npm install

PORT="3000"
JWT_SECRET="supersecretkey"
MONGO_URI="mongodb://localhost:27017/noteapp"
CLIENT_URL="http://localhost:5173"
JWT_EXPIRES="1d"
EMAIL_USER=""
EMAIL_PASS=""
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
BASE_URL="http://localhost:3000"
SESSION_SECRET="hjedgjgheytwye"


```

```bash
npm run dev
```

```bash
VITE_API_URL = ""
cd frontend
npm install
npm run dev
```

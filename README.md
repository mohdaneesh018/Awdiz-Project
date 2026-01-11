# 🎵 Spotify Clone – Frontend

This is the frontend of a Spotify-like music streaming application built using **React.js** and **Vite**.  
It supports **role-based access** for Users, Sellers, and Admins with a modern UI inspired by Spotify.

---

## 🚀 Tech Stack

- React.js
- Vite
- React Router DOM
- Axios
- Context API
- CSS (Custom styling)
- JWT Authentication (via cookies)

---

## ✨ Features

### 👤 User
- Browse songs & artists
- Play music with global audio player
- View artist pages
- Search songs & playlists
- Responsive UI (Mobile + Desktop)

### 🧑‍🎤 Seller
- Seller Dashboard
- Upload songs
- View own uploaded songs
- Edit / Delete songs
- Edit profile
- Protected seller routes

### 🛡️ Admin
- Admin Dashboard
- View all songs
- Delete songs
- View all artists
- View all sellers
- Role-based protected admin routes

---

## 🔐 Authentication & Authorization

- JWT based authentication
- Cookies used for session handling
- Protected routes for:
  - Seller Dashboard
  - Admin Dashboard
- Manual URL access blocked for unauthorized users

---
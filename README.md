# 🏨 Hotelio Backend - Hotel Booking Platform

This is the backend API for **Hotelio**, a modern hotel booking platform. Built using **Node.js**, **Express.js**, and **MongoDB**, this server handles room listings, bookings, user authentication (with Firebase or JWT), and admin operations.

---

## 🚀 Features

- ✅ RESTful API with Express
- ✅ MongoDB with Mongoose ODM
- ✅ JWT Authentication (optional Firebase Auth supported)
- ✅ Room management (CRUD)
- ✅ Booking system
- ✅ CORS support for frontend integration
- ✅ Data validation & error handling
- ✅ Environment-based configuration

---

## 🧱 Tech Stack

- **Backend Framework**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Authentication**: JWT / Firebase Auth
- **HTTP Client**: Axios (for testing, optionally)
- **Environment**: dotenv

---

## 🛠️ Installation

### 1. Clone the repository:

```bash
git clone https://github.com/kawsarkabir/grand-royel.git
cd grand-royel
```

````

### 2. Install dependencies:

```bash
npm install
```

### 3. Create `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:5173
```

> ✅ Replace values with actual credentials

---

## ▶️ Run Server

### Development Mode

```bash
npm run dev
```

### Production Mode

```bash
npm start
```

---

## 🔗 API Endpoints

### Auth

| Method | Endpoint       | Description                |
| ------ | -------------- | -------------------------- |
| POST   | `/auth/signup` | Register new user          |
| POST   | `/auth/signin` | Login user (returns token) |
| GET    | `/auth/me`     | Get current user info      |

### Rooms

| Method | Endpoint     | Description          |
| ------ | ------------ | -------------------- |
| GET    | `/rooms`     | Get all rooms        |
| POST   | `/rooms`     | Add new room (Admin) |
| GET    | `/rooms/:id` | Get single room      |
| PATCH  | `/rooms/:id` | Update room (Admin)  |
| DELETE | `/rooms/:id` | Delete room (Admin)  |

### Bookings

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| POST   | `/bookings`      | Book a room       |
| GET    | `/bookings`      | List all bookings |
| GET    | `/bookings/user` | Get user bookings |

---

## 🛡️ JWT Authentication

- Include the token in your headers:

```http
Authorization: Bearer your_token_here
```

---

## 📂 Folder Structure

```
src/
│
├── controllers/
├── models/
├── routes/
├── middleware/
├── utils/
└── index.js
```

---

## ✅ Todo (optional)

- [ ] Admin dashboard APIs
- [ ] Review system
- [ ] Payment integration
- [ ] Booking cancellation support

---
````

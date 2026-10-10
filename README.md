# 🌍 TripPicker — Smart Travel Booking Platform

> **Live Demo:** [https://frontend-wn2p.onrender.com](https://frontend-wn2p.onrender.com)

TripPicker is a full-stack MERN travel booking platform that lets users discover, explore, and book tour packages across India and beyond. It combines an interactive UI with an AI-powered recommendation engine, Razorpay payment integration, Google OAuth, and real-time interactive maps — all in one seamless experience.

---

## 🏠 Home Page

<img width="2836" height="1446" alt="Screenshot 2026-10-10 103039" src="https://github.com/user-attachments/assets/7372ca26-9c1d-436d-bef9-1a4996a306c8" />
<img width="2840" height="1464" alt="Screenshot 2026-10-10 103029" src="https://github.com/user-attachments/assets/d9250d87-024b-44ca-9978-731be74ef8df" />



> *The home page features a cinematic video carousel, animated package category cards, highlights reel, and a smart packages section with smooth scroll navigation.*

---

## ✨ Features

### 🗺️ Tour Package Categories
- **Indian Tour Packages** — Curated tours across India's states and regions
- **International Packages** — Exotic destinations worldwide
- **Devotional Packages** — Spiritual and pilgrimage tours to sacred sites
- **Educational Packages** — Learning-focused real-world travel experiences
- **Weekend Getaways** — Short, refreshing escapes from the daily routine

### 🤖 AI-Powered Smart Recommendations (`/explore`)
- Enter travel preferences (place type, budget, best travel time, tour type, number of days)
- TF-IDF cosine similarity engine recommends the top 10 matching destinations from a curated dataset
- Each result shows Google Maps links, star ratings, best season, and budget breakdown

### 💳 Razorpay Payment Integration (`/payment/:title`)
- Secure checkout with guest count, names, contact details, and address
- Razorpay payment gateway loads dynamically
- PDF receipt generation on successful booking
- Booking stored with full transaction metadata (order ID, transaction ID, payment date/time)

### 📅 Bookings Dashboard (`/bookings`)
- View all past and upcoming bookings
- Each booking shows tour name, date, guests, amount, and payment status
- Refund request support

### ⭐ Reviews System (`/reviews/:listingTitle`)
- Authenticated users can post star ratings, comments, and photo uploads
- Edit and delete own reviews
- Reply to other users' reviews
- Lightbox photo viewer

### 👤 User Authentication
- **JWT-based login & registration**
- **Google OAuth 2.0** (sign in with Google + Google Calendar sync for bookings)
- **Forgot Password** flow — OTP emailed via Resend, verified, then password reset
- Rate-limited endpoints (10 login attempts / 5 OTP attempts per 15-minute window)
- Persistent auth state via React AuthContext

### 🎨 Dark / Light Theme
- System-wide dark mode toggle persisted via `localStorage`
- Implemented with a global ThemeContext and CSS design tokens

### 🗺️ Interactive Map (`/packages`)
- Leaflet.js map embedded on the Packages page
- Detects user's current location to surface nearby packages
- Click-to-explore map pins for each listing

### 📦 Packages Explorer (`/packages`)
- Browse all listings with search, filter by category, and sort (recommended, price, duration)
- Search history persisted via `localStorage`
- Animated card transitions powered by Framer Motion

### 🇮🇳 India State Map (`/listings/indian`)
- Interactive SVG map of India — click any state to see its available packages

### 👨‍💼 User Profile (`/profile`)
- Update name and upload a profile photo
- Profile image stored server-side via Multer

---

## 🛠️ Technologies Used

### Frontend
| Technology | Purpose |
|---|---|
| **React 18** | Component-based UI |
| **React Router v7** | Client-side routing |
| **Framer Motion** | Page & card animations |
| **Leaflet / React Leaflet** | Interactive map |
| **Lucide React** | Icon library |
| **JWT Decode** | Client-side token inspection |
| **Axios** | HTTP requests |
| **Vite** | Development server & build tool |
| **CSS Modules / Custom CSS** | Styling with design tokens |

### Backend
| Technology | Purpose |
|---|---|
| **Node.js + Express.js** | REST API server |
| **MongoDB + Mongoose** | Database & ODM |
| **JSON Web Tokens (JWT)** | Stateless auth |
| **Passport.js** | Auth strategies (local + Google OAuth 2.0) |
| **Bcryptjs** | Password hashing |
| **Razorpay** | Payment gateway |
| **Nodemailer + Resend** | Transactional email (OTP / receipts) |
| **Multer** | File uploads (profile images, review photos) |
| **PDFKit** | PDF receipt generation |
| **Natural (NLP)** | TF-IDF vectorisation for recommendations |
| **Express Rate Limit** | Brute-force protection |
| **Google APIs** | Google Calendar event creation |

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js ≥ 18
- npm ≥ 9
- MongoDB Atlas account (or local MongoDB instance)
- Razorpay account (for payments)
- Google Cloud project with OAuth credentials (for Google login + Calendar)
- Resend account (for email OTP delivery)

---

### 1. Clone the Repository

```bash
git clone https://github.com/NiteshVarman/trip-picker.git
cd trip-picker
```

---

### 2. Backend Setup

```bash
cd Backend
npm install
```

Create a `.env` file in the `Backend/` directory using the provided example:

```bash
cp .env.example .env
```

Fill in the values:

```env
JWT_SECRET=your_jwt_secret
SESSION_SECRET=your_session_secret
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>?retryWrites=true&w=majority
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password
RESEND_API_KEY=re_your_resend_api_key
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
REDIRECT_URI=http://localhost:8080/auth/google/callback
FRONTEND_URL=http://localhost:5174
SEED_DB=true   # Set to true on first run to seed the database, then set to false
```

---

### 3. Frontend Setup

```bash
cd ../Frontend
npm install
```

Create a `.env` file in the `Frontend/` directory:

```env
VITE_API_URL=http://localhost:8080
```

---

## 🚀 How to Run

### Run Backend (from `Backend/` directory)
```bash
npm run dev
```
> Server starts on `http://localhost:8080`

### Run Frontend (from `Frontend/` directory)
```bash
npm run dev
```
> App opens at `http://localhost:5174`

### Run Both Concurrently (from root directory)
```bash
npm install
npm start
```

---

## 🤖 AI Development — Built with Kiro

This project was built using **Kiro** as the primary AI development assistant throughout the development lifecycle.

### How AI Was Used

Kiro was used as an intelligent pair-programmer at every stage — from scaffolding initial components to debugging complex async flows and refactoring the entire authentication architecture.

---

### Specific Tasks Where Kiro Was Used

#### 1. 🧩 Component Development
Kiro generated the full skeleton for complex pages like the **Packages Explorer** (`packages.jsx`) and the **Explore / AI Recommendation** page (`explore.jsx`), including animated card layouts, filter logic, search history via `localStorage`, and Framer Motion transitions. It also helped design reusable components like `BackButton` and wired up the `ThemeContext` provider pattern.

#### 2. 🔌 API Creation & Route Architecture
All six Express route files (`auth`, `bookings`, `listings`, `reviews`, `users`, `recommendations`) were structured with Kiro's guidance. Kiro set up the Passport.js Google OAuth 2.0 strategy, generated JWT middleware, and built the Razorpay order-creation and payment-verification endpoints with proper error handling.

#### 3. 🔍 Debugging
Kiro was essential in resolving a critical production issue where OTP emails were timing out on Render (ETIMEDOUT) due to SMTP being blocked — Kiro identified the cause and migrated the email transport to **Resend's API**. It also resolved a double-render issue in `AuthContext` and fixed booking page crashes caused by pre-migration string-based listing references.

#### 4. 🗄️ Database Integration
Kiro designed the Mongoose schemas for `Booking`, `User`, `Listing`, and `Review` models with proper population references and index hints. It also wrote the seed script for bulk-populating the listings collection from structured data, and added a `SEED_DB` environment flag to prevent accidental overwrites in production.

#### 5. ♻️ Refactoring
Kiro led a major refactoring effort to migrate the entire app from scattered inline styles to a **global CSS design token system**, added a dark-mode `ThemeContext`, replaced a sliding-overlay login UI with a cleaner tab-based architecture, and namespaced all login styles under the `lp-*` prefix to prevent global leakage. It also converted the India map from a fixed-layout component to a fully responsive SVG.

---

## 📁 Project Structure

```
trip-picker/
├── Backend/
│   ├── config/          # DB connection & Passport strategies
│   ├── controllers/     # Route handler logic
│   ├── data/            # CSV dataset for AI recommendations
│   ├── middlewares/     # Error handler, auth middleware
│   ├── models/          # Mongoose schemas (User, Listing, Booking, Review)
│   ├── routes/          # Express route definitions
│   ├── utils/           # Email sender, PDF generator
│   ├── app.js           # Express app config
│   └── server.js        # Entry point
│
├── Frontend/
│   └── src/
│       ├── components/  # Reusable UI (BackButton)
│       ├── context/     # AuthContext, ThemeContext
│       ├── pages/       # All page components
│       ├── App.jsx      # Router & route definitions
│       └── Home.jsx     # Landing page
│
└── README.md
```

---

## 📄 License

MIT

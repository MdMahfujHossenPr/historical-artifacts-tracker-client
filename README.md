# 🏺 Historical Artifacts Tracker

A full-stack web application to explore, track, like, and manage ancient historical artifacts. Users can register/login, add their own artifacts, like others', and manage their own submissions — all with secure authentication and a clean, responsive UI.

---

## 🌐 Live Website

🔗 [Live Site](https://artifact-tracker.netlify.app/liked-artifacts)

## 💻 GitHub Repositories

- 🔗 [Client Side Repository](https://github.com/Programming-Hero-Web-Course4/b11a11-client-side-MdMahfujHossenPr)
- 🔗 [Server Side Repository](https://github.com/Programming-Hero-Web-Course4/b11a10-server-side-MdMahfujHossenPr)

---

## 🚀 Key Features

- ✅ User Authentication (Email/Password & Google Sign In)
- 🔐 JWT-secured Protected Routes
- ➕ Add Artifacts with full details
- ❤️ Like/unlike artifacts (toggle) and update DB
- ⭐ View Liked Artifacts (Private route)
- 📦 My Artifacts – Update/Delete own items securely
- 🔍 Search Artifacts by name
- 🎨 Responsive Design for Mobile, Tablet, Desktop
- 🎭 Framer Motion Animation on Home
- 📊 Dynamic Route-based Document Titles
- 🚫 404 Not Found Page
- 🔄 Loading Spinners
- 🔔 SweetAlert2/Toast notifications

---

## 🏗️ Project Structure
historical-artifacts-tracker-client/
│
├── public/
│ └── index.html
│
├── src/
│ ├── assets/ # Images, logos
│ ├── components/ # Reusable components (Navbar, Footer, Cards)
│ ├── layout/ # MainLayout with Navbar/Footer
│ ├── pages/ # All main pages (Home, Login, Add, etc.)
│ ├── routes/ # All route definitions
│ ├── contexts/ # AuthContext using Firebase
│ ├── hooks/ # Custom hooks (useTitle, useAuth)
│ ├── utils/ # JWT utils, password validators
│ ├── firebase/ # Firebase configuration
│ ├── App.jsx # App entry with route provider
│ ├── main.jsx # React DOM root
│ └── index.css # Tailwind base styles
├── .env # Environment variables (not pushed to GitHub)
├── .gitignore
├── package.json
├── tailwind.config.js
├── postcss.config.js
└── README.md

---

## 🔐 Authentication System

- Firebase Authentication (Email/Password + Google)
- Password Validation: 1 Uppercase, 1 Lowercase, min 6 chars
- JWT token creation on login and secured API access
- Token stored in localStorage and sent via headers
- User dashboard and data protected with Private Routes

---

## 🧾 Form Validations & Toasts

- ✅ Register form: validation with custom errors
- ✅ Login form: wrong credential feedback
- ✅ Add/Update: toast or SweetAlert on success/failure
- ✅ Delete confirmation alert

---

## 🧠 Technologies Used

| Frontend                 | Backend                     |
|--------------------------|-----------------------------|
| React.js                 | Node.js, Express.js         |
| Tailwind CSS + DaisyUI   | MongoDB Atlas               |
| React Router DOM         | JWT Authentication          |
| Firebase Authentication  | CORS, dotenv                |
| Axios / Fetch API        | Hosted on Vercel            |
| Framer Motion            |                             |
| SweetAlert2 / Toast      |                             |

---

## 💡 Bonus Features Implemented

- 🔍 Search functionality in All Artifacts page
- 🔁 Toggle like/dislike with live DB sync
- 🎯 Framer Motion animation on homepage sections
- 🪄 Responsive UI using Tailwind & DaisyUI
- 📄 Dynamic title based on route
- 🔒 JWT for both email/password and Google auth
- 🧪 Password strength validation
- 🧹 404 Not Found Page & route fallback
- ⚙️ Deployed client on Firebase, server on Vercel

---

## 🧪 Environment Variables (`.env`)

```env
VITE_FIREBASE_API_KEY=xxxxxxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxxxxxx
VITE_FIREBASE_PROJECT_ID=xxxxxxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxxxxxx
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxxxxxx
VITE_FIREBASE_APP_ID=xxxxxxxx
VITE_API_BASE_URL=https://your-server-url.vercel.app

# Install dependencies
npm install

# Start the dev server
npm run dev



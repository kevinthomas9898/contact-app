# Contact App

A full-stack web application designed to help you easily manage, store, and edit your contacts in an intuitive user interface. 

The project structure is split into two primary environments: a **Node.js/Express API** backend and a **React/Vite** frontend.

## 🛠️ Technology Stack

**Frontend**
* React 19 + TypeScript
* Vite (Build Tool & Dev Server)
* Tailwind CSS v4 (Styling)
* Axios (HTTP Client)

**Backend**
* Node.js & Express.js
* MongoDB & Mongoose (Database)
* Formidable & Bcrypt (Authentication/Security)
* JSON Web Tokens (JWT Auth)

---

## 🚀 Getting Started

To run this project locally, you will need to open **two separate terminal windows**: one for the backend, and one for the frontend.

### 1. Backend Setup

Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```

Make sure you create a `.env` file in the `backend` folder with your credentials:
```env
PORT=5000
CONNECTION_STRING=your_mongo_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
# Optional: comma-separated list for CORS (defaults to allow all if not set)
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
NODE_ENV=development (development or production)
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup

Open a **second** terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Your React app will now be running on `http://localhost:5173` and interacting with your backend located on `http://localhost:5000`.

---

## 📡 API Endpoints Overview

### Users
* `POST /api/users/register` - Register a new user
* `POST /api/users/login` - Authenticate an existing user (receives JWT)

### Contacts (Requires JWT Auth)
* `GET /api/contacts` - Fetch all saved contacts
* `POST /api/contacts` - Create a new contact
* `PUT /api/contacts/:id` - Update a specific contact
* `DELETE /api/contacts/:id` - Delete a specific contact

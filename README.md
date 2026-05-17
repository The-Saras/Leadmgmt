# Smart Leads Dashboard

A full-stack Lead Management Dashboard built with the MERN stack and TypeScript.

## Live Demo

- **Frontend:** https://leadmgmt.vercel.app
- **Backend API:** https://leadmgmt-9rx3.onrender.com
- **GitHub:** https://github.com/The-Saras/Leadmgmt

---

## Tech Stack

**Frontend**
- React.js + TypeScript
- TailwindCSS
- React Router DOM
- Axios

**Backend**
- Node.js + Express.js + TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs

**DevOps**
- Docker + Docker Compose
- Vercel (Frontend)
- Render (Backend)
- MongoDB Atlas (Database)

---

## Features

- JWT-based Authentication (Register/Login)
- Role-Based Access Control (Admin / Sales)
- Leads CRUD (Create, Read, Update, Delete)
- Advanced Filtering by Status and Source
- Debounced Search by Name or Email
- Sort by Latest or Oldest
- Backend Pagination (10 records per page)
- CSV Export (Admin only)
- Dark Mode
- Fully Responsive UI
- Loading, Empty and Error States
- Form Validation

---

## Project Structure

```
smart-leads-dashboard/
├── client/                  # React + TypeScript + Tailwind
│   └── src/
│       ├── api/             # Axios instance and API calls
│       ├── components/      # Reusable UI components
│       ├── context/         # Auth context
│       ├── hooks/           # Custom hooks
│       ├── pages/           # Page components
│       ├── types/           # TypeScript interfaces
│       └── utils/           # Utility functions
├── server/                  # Node + Express + TypeScript
│   └── src/
│       ├── config/          # Database connection
│       ├── controllers/     # Route controllers
│       ├── middleware/      # Auth and role middleware
│       ├── models/          # Mongoose models
│       ├── routes/          # Express routes
│       ├── types/           # TypeScript interfaces
│       └── utils/           # CSV export utility
└── docker-compose.yml
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/The-Saras/Leadmgmt.git
cd Leadmgmt
```

### 2. Setup Backend

```bash
cd server
npm install
cp .env.example .env
```

Fill in your `.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
NODE_ENV=development
```

```bash
npm run dev
```

### 3. Setup Frontend

```bash
cd client
npm install
```

Create `.env` in the client folder:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Frontend runs on `http://localhost:5173`
Backend runs on `http://localhost:5000`

---

## Docker Setup

From the project root:

```bash
docker-compose up --build
```

---

## Roles

| Feature | Admin | Sales |
|---------|-------|-------|
| Create Lead | ✅ | ✅ |
| Update Lead | ✅ | Own leads only |
| Delete Lead | ✅ | ❌ |
| Export CSV | ✅ | ❌ |
| View Leads | ✅ | ✅ |
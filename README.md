# English Learning System (Bilingual English-Khmer Web Platform)

A full-stack English-learning web platform modeled directly after the architecture, design patterns, and standards of `chinese-learning-system`.

---

## 🏗️ Architecture Overview

The system is organized into three clean sub-projects:

```text
english-learning-system/
├── server/          # Node.js + Express REST API + MongoDB (Port 5001)
├── client-admin/    # React 19 + Vite + Ant Design Admin Panel (Port 5174)
├── client-user/     # React 19 + Vite + Responsive Learner Portal (Port 5173)
├── package.json     # Root runner scripts
└── README.md
```

---

## 🎯 Target Scope & Modules

### 1. `/programs` — Curriculum & Learning Pathways
- **Admin:** Full CRUD for Programs (icon, title, slug, status, order) and interactive Drawer to manage nested Curriculum Levels (A1, A2, B1, B2, C1, IELTS bands).
- **User:** Modern card grid of tracks (General English, IELTS Academic Mastery, Business English) and level milestone roadmap.

### 2. `/dictionary` — English-Khmer Lexicon
- **Exact Schema:** Features the comprehensive bilingual schema with nested Meanings (part of speech, Khmer definitions, structures, sentence examples, collocations), Synonyms/Antonyms with Khmer difference notes, Phrasal Verbs, and Idioms.
- **Admin:** Rich AntD Table with search, difficulty filter, verification filter, and a comprehensive 4-tab Drawer for nested editing.
- **User:** Fast search by English word or Khmer translation, difficulty filter chips, part of speech pills, pronunciation audio player (HTML5 + Web Speech API fallback), and modal/page word inspector.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js:** v18+ or v20+
- **MongoDB:** Local MongoDB instance (`mongodb://127.0.0.1:27017/english_learning_db`) or MongoDB Atlas URI

### 2. Environment Variables

Each sub-project contains its own `.env` file (with `.env.example` reference):

- `server/.env`:
  ```env
  PORT=5001
  NODE_ENV=development
  MONGO_URI=mongodb://127.0.0.1:27017/english_learning_db
  JWT_SECRET=english_learning_jwt_secret_key_2026_very_secure
  JWT_EXPIRES_IN=7d
  CLIENT_ADMIN_URL=http://localhost:5174
  CLIENT_USER_URL=http://localhost:5173
  ```

- `client-admin/.env`:
  ```env
  VITE_API_URL=http://localhost:5001/api
  ```

- `client-user/.env`:
  ```env
  VITE_API_URL=http://localhost:5001/api
  ```

### 3. Database Seeding

Run the seed script to populate sample admin/learner accounts, default programs (General English, IELTS, Business), curriculum levels, and rich English-Khmer vocabulary entries:

```bash
cd server
npm run seed
```

#### Default Credentials:
- **Admin Account:** `admin@english.com` / `admin123`
- **Learner Account:** `user@english.com` / `user123`

---

## 💻 Running the Applications

### Option A: From Root Directory
```bash
# Start backend API (http://localhost:5001)
npm run server

# Start Admin Portal (http://localhost:5174)
npm run admin

# Start User Portal (http://localhost:5173)
npm run user
```

### Option B: Individually
```bash
# 1. Backend Server
cd server
npm run dev

# 2. Admin Portal
cd client-admin
npm run dev

# 3. User Portal
cd client-user
npm run dev
```

---

## 📡 REST API Endpoints Summary

### Auth (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new learner account |
| POST | `/api/auth/login` | Public | Authenticate user or admin |
| GET | `/api/auth/me` | Protected | Get authenticated profile |

### Programs & Levels (`/api/programs`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/programs` | Public | List active programs with level count |
| GET | `/api/programs/:id` | Public | Get program details |
| GET | `/api/programs/:id/levels` | Public | Get levels belonging to a program |
| POST | `/api/programs` | Admin only | Create new program |
| PUT | `/api/programs/:id` | Admin only | Update program |
| DELETE | `/api/programs/:id` | Admin only | Delete program and its levels |
| POST | `/api/programs/:id/levels` | Admin only | Add level to program |
| PUT | `/api/programs/:id/levels/:levelId` | Admin only | Update level |
| DELETE | `/api/programs/:id/levels/:levelId` | Admin only | Delete level |

### Vocabulary Dictionary (`/api/vocabulary`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/vocabulary` | Public | Search, paginate, and filter words |
| GET | `/api/vocabulary/stats` | Public | Aggregate counts by difficulty & verification |
| GET | `/api/vocabulary/:id` | Public | Full word details with all nested sub-documents |
| POST | `/api/vocabulary` | Admin only | Create new word with nested meanings & idioms |
| PUT | `/api/vocabulary/:id` | Admin only | Update vocabulary word |
| DELETE | `/api/vocabulary/:id` | Admin only | Delete vocabulary entry |

# MarketNest - Mini Fashion Marketplace

MarketNest is a premium MERN-stack marketplace designed for fashion brands to showcase their products and customers to explore collections.

## 🏗️ Architecture Overview

MarketNest follows a modern decoupled architecture:

- **Frontend**: React.js with Vite, styled using Tailwind CSS v4. State management is handled via React Context API, and API communication uses Axios with interceptors for token management.
- **Backend**: Node.js and Express.js with a modular structure (Controllers, Routes, Middlewares, Models).
- **Database**: MongoDB (Atlas) for persistent storage with Mongoose ODM.
- **Storage**: Cloudinary for high-performance image hosting and transformations.

## 🔐 Authentication & Security Flow

MarketNest implements a secure JWT-based authentication system:

1.  **Signup/Login**: Users choose their role (Brand or Customer) during signup. Passwords are hashed using `bcryptjs` before storage.
2.  **Tokens**: Upon login, the server issues:
    -   **Access Token**: Short-lived (15m), sent in the response body for API authorization.
    -   **Refresh Token**: Long-lived (7d), stored in an `httpOnly`, `secure` cookie to prevent XSS attacks.
3.  **Automatic Refresh**: The frontend Axios interceptor detects 401 Unauthorized errors and automatically attempts to refresh the access token using the refresh token cookie.
4.  **Authorization**: Middleware on the backend enforces Role-Based Access Control (RBAC). Only Brands can access dashboard APIs and product management routes.

## 📁 Folder Structure Overview

### Backend
- `/config`: Database and Cloudinary configurations.
- `/controllers`: Business logic for authentication and products.
- `/middlewares`: JWT verification, role-based authorization, and Multer upload handling.
- `/models`: Mongoose schemas for User and Product.
- `/routes`: Express route definitions.
- `/utils`: Helper functions (token generation, etc.).

### Frontend
- `/src/components`: Reusable UI components (Navbar, Product Cards, Protected Routes).
- `/src/context`: Authentication state provider.
- `/src/pages`: Main application views (Marketplace, Dashboard, Auth pages).
- `/src/utils`: Axios instance and common utility functions.
- `/src/index.css`: Tailwind CSS v4 theme and global styles.

## 🛡️ Security Decisions

- **Password Hashing**: Salted and hashed using `bcrypt` (10 rounds).
- **JWT Security**: Secrets stored in environment variables; tokens use different secrets for access vs refresh.
- **HTTP-Only Cookies**: Refresh tokens are not accessible via JavaScript, mitigating XSS risks.
- **CORS Protection**: Restricted to the frontend URL with credentials enabled.
- **Soft Deletes**: Products are "archived" instead of being hard-deleted to preserve historical data integrity.
- **Ownership Enforcement**: Brands can only edit or delete products they created.

## 🤖 AI Tools Usage

- **Antigravity (Google DeepMind)**: Used for architecture planning, boilerplate generation, UI design implementation using Tailwind CSS, and logic orchestration across the full stack.
- **Image Placeholders**: Initial design used generated assets for demonstration purposes.

---

## 🚀 Getting Started

1.  Clone the repository.
2.  Follow setup instructions in `backend/.env.template` and rename to `.env`.
3.  Install dependencies: `npm install` in both `backend` and `frontend`.
4.  Run development servers: `npm run dev`.

# Saumya Stores Management System

A production-ready MERN stack grocery store system inspired by Cargills Food City.

## Features
- **Admin Role**: Dashboard with sales charts, inventory management, barcode support, category management.
- **Customer Role**: Modern shopping experience, responsive design, search, shopping cart, Stripe payments.
- **Security**: JWT Authentication, protected routes, role-based access.
- **Tech Stack**: React, Node.js, Express, MongoDB, Tailwind CSS, Chart.js.

## Installation

### Prerequisites
- Node.js & npm
- MongoDB Atlas account
- Stripe account (for payments)

### 1. Clone & Install Dependencies
```bash
# Install backend dependencies
cd server
npm install

# Install frontend dependencies
cd ../client
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
STRIPE_SECRET_KEY=your_stripe_key
```

### 3. Seed Initial Data (Optional)
```bash
cd server
npm run data:import
```

### 4. Run the Application
```bash
# Run backend (from server folder)
npm run dev

# Run frontend (from client folder)
npm run dev
```

## Admin Credentials (if seeded)
- **Email**: admin@example.com
- **Password**: password123

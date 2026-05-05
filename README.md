# 🛒 Premium eCommerce Platform

A full-stack, enterprise-grade eCommerce platform built with Next.js 16, Tailwind CSS, MongoDB, and NextAuth. Features a Brutalist-Minimalist design language, a highly performant shopping cart using Redux Toolkit, and a fully functional Admin Dashboard.

## 🚀 Key Features

- **Modern Architecture**: Built on Next.js App Router with Server Actions for highly secure, fast data mutations.
- **State Management**: Global shopping cart state managed via `Redux Toolkit`.
- **Secure Authentication**: Credentials-based login and Role-Based Access Control (RBAC) managed by `NextAuth.js v5`.
- **Admin Dashboard**: Protect routes and comprehensive interfaces to manage Orders, Users, Products, Categories, and Real-Time Alerts.
- **Advanced Filtering**: Server-side product searching and filtering by category, name, and price.
- **Real-Time Notifications**: Smart, resource-efficient background polling for system alerts.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (Credentials Provider + bcryptjs)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons**: SVG / Tailwind primitives

---

## 💻 Getting Started (Local Development)

### 1. Prerequisites
Ensure you have Node.js and npm installed. You will also need a MongoDB URI.

### 2. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add the following:
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_super_secret_string
```

### 4. Seeding the Database
To quickly populate your database with dummy data (products, categories, and test accounts), simply start the development server and visit the seed endpoint in your browser:
```bash
npm run dev
```
👉 Open your browser and go to: **[http://localhost:3000/api/seed](http://localhost:3000/api/seed)**
*Note: This will clear your existing Products, Categories, and Users before inserting the new ones.*

---

## 🔑 Test Accounts

After running the seed script above, you can log in and test the platform using the following accounts:

### 🛡️ Admin Account (Access to Dashboard)
- **Email:** `admin@admin.com`
- **Password:** `adminpassword`
- *Use this account to access the Admin Dashboard, add/edit products, manage orders, and send global alerts.*

### 👤 Customer Account (Standard User)
- **Email:** `user@user.com`
- **Password:** `userpassword`
- *Use this account to experience the standard checkout flow, view order history, and test the cart.*

---

## 📐 Project Structure Highlights
- `app/(customer)/` - Public facing store pages.
- `app/(admin)/` - Protected dashboard layout and pages.
- `src/actions/` - Next.js Server Actions for secure DB mutations without traditional API endpoints.
- `src/models/` - Mongoose Schemas (User, Product, Order, Category, Notification).
- `src/store/` - Redux Toolkit global state definitions (slices and store).

---

*Designed and developed as a Masterclass Showcase for Next.js eCommerce capabilities.*

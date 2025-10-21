<div align="center">
  <h3 align="center">Scatch: Shop Trendy Bags</h3>
  
  <h4>Check Preview here: https://scatch-app-nz4a.onrender.com</h4>
</div>

## 📋 <a name="table">Table of Contents</a>

1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)

## <a name="introduction">🤖 Introduction</a>

Built with Node.js and Express for backend logic, MongoDB for database management, and EJS templating with TailwindCSS for the frontend, Scatch is a full-stack e-commerce platform designed for single-admin product management and seamless customer shopping experience. The platform offers real-time payment integration with Razorpay and a modern, intuitive interface for both administrators and customers.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT (JSON Web Tokens)
- bcrypt
- Razorpay
- EJS Templates
- TailwindCSS
- express-session
- connect-flash
- Multer
- cookie-parser
- crypto

## <a name="features">🔋 Features</a>

👉 Authentication System

- Secure user registration and login with JWT token-based authentication
- Password hashing using bcrypt for enhanced security
- Persistent sessions with cookie management
- Auto-redirect for logged-in users

👉 Product Management (Admin)

- Dedicated admin panel with separate navigation
- Create new products with image upload support
- View all products in a clean table format with product details
- Real-time product filtering and sorting capabilities
- Color customization for product display (background, panel, text)
- Edit and delete product functionality

👉 Shopping Experience (Customer)

- Browse products with dynamic filtering options:
  - New Collection (10 most recent products)
  - All Products
  - Discounted Products

- Real-time sorting by:
  - Popular (price-based)
  - Newest (creation date)

- Add products to cart with one click
- Visual product cards with custom color schemes

👉 Shopping Cart

- Modern two-column cart layout
- Real-time price calculations:
- Total MRP
- Discount calculations
- Platform fees
- Shipping status

- Quantity management for each product
- Product removal functionality
- Sticky price summary sidebar

👉 Payment Integration

- Seamless Razorpay payment gateway integration
- Real-time payment processing with card/UPI/net banking
- Secure payment verification using cryptographic signatures
- Test mode support for development
- Automatic cart clearing after successful payment

👉 Order Management

- Complete order history tracking
- Detailed order information:
 - Order ID and Payment ID
 - Product details with images
 - Total amount and date
 - Order status tracking

- Order confirmation with flash messages

👉 User Profile

- Personalized profile page with user details
- Shopping statistics dashboard:
  - Items in cart count
  - Total orders count
  - Account status

- Quick action buttons for shop and cart navigation
- User avatar with initials

👉 Modern UI/UX

- Clean and intuitive interface with TailwindCSS
- Responsive design that works seamlessly across devices
- Consistent color schemes and typography
- Flash messages for user feedback
- Smooth transitions and hover effects

👉 Security Features

- Protected routes with authentication middleware
- Secure password storage with bcrypt hashing
- JWT token validation
- CSRF protection with secure cookies
- Environment variable management for sensitive data

and many more, including code architecture and reusability

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/RahiPatel07/SCATCH.git
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
JWT_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
NODE_ENV=
MONGODB_URI=
SESSION_SECRET=
```

Replace the placeholder values with your actual **[RazorPay]**, **[MongoDB]** credentials.

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

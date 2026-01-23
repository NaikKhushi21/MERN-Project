# MERN Product Store

A full-stack e-commerce application built with MongoDB, Express, React, and Node.js. This project demonstrates modern web development practices with authentication, product management, shopping cart, reviews, and more.

## Website Link

Visit the live project at [https://mern-project-wxdb.onrender.com/](https://mern-project-wxdb.onrender.com/)

## Demo

🎥 [Watch Demo Video](https://drive.google.com/file/d/1Fd1EEid0MB9mf09lsmSoheNaIrCYLceT/view?usp=sharing)

## Features

### 🔐 Authentication & Authorization
- User registration and login with JWT
- Protected routes
- User-specific product ownership
- Password hashing with bcrypt

### 🛍️ Product Management
- Create, read, update, delete products
- Image upload support
- Product categories
- Stock management
- Product descriptions
- Search and filter functionality
- Pagination
- Sorting (price, rating, date)

### ⭐ Reviews & Ratings
- Product reviews with ratings (1-5 stars)
- User can only review once per product
- Average rating calculation
- Review management (edit/delete own reviews)

### 🛒 Shopping Cart
- Add products to cart
- Update quantities
- Remove items
- Cart persistence
- Stock validation

### 🎨 User Interface
- Modern, responsive design with Chakra UI
- Dark mode support
- Loading states and skeletons
- Toast notifications
- Image previews
- Smooth animations

## Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Multer** - File uploads
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** - UI library
- **React Router** - Routing
- **Zustand** - State management
- **Chakra UI** - Component library
- **Vite** - Build tool

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```env
PORT=5001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

4. Create an `uploads` directory in the backend folder:
```bash
mkdir uploads
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
MERN Project/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── product.controller.js
│   │   ├── category.controller.js
│   │   ├── review.controller.js
│   │   └── cart.controller.js
│   ├── middleware/
│   │   ├── auth.middleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── product.model.js
│   │   ├── category.model.js
│   │   ├── review.model.js
│   │   └── cart.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── product.route.js
│   │   ├── category.route.js
│   │   ├── review.route.js
│   │   ├── cart.route.js
│   │   └── upload.route.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── uploads/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── CreatePage.jsx
│   │   │   ├── ProductDetailsPage.jsx
│   │   │   └── CartPage.jsx
│   │   ├── store/
│   │   │   ├── auth.js
│   │   │   ├── product.js
│   │   │   ├── cart.js
│   │   │   └── review.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products (with search, filter, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Protected)
- `PUT /api/products/:id` - Update product (Protected, Owner only)
- `DELETE /api/products/:id` - Delete product (Protected, Owner only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Protected)

### Reviews
- `GET /api/reviews/products/:productId/reviews` - Get product reviews
- `POST /api/reviews/products/:productId/reviews` - Create review (Protected)
- `PUT /api/reviews/:id` - Update review (Protected, Owner only)
- `DELETE /api/reviews/:id` - Delete review (Protected, Owner only)

### Cart
- `GET /api/cart` - Get user's cart (Protected)
- `POST /api/cart` - Add item to cart (Protected)
- `PUT /api/cart/:itemId` - Update cart item (Protected)
- `DELETE /api/cart/:itemId` - Remove item from cart (Protected)
- `DELETE /api/cart` - Clear cart (Protected)

### Upload
- `POST /api/products/upload` - Upload image (Protected)

## Usage

1. **Register/Login**: Create an account or login to access protected features
2. **Browse Products**: View all products on the home page
3. **Search & Filter**: Use search bar and filters to find specific products
4. **View Details**: Click on any product to see full details
5. **Create Products**: Logged-in users can create their own products
6. **Add to Cart**: Add products to your shopping cart
7. **Leave Reviews**: Rate and review products you've purchased

## Future Enhancements

- [ ] Order management system
- [ ] Payment integration
- [ ] Email notifications
- [ ] Admin dashboard
- [ ] Product image optimization
- [ ] Advanced analytics
- [ ] Wishlist functionality
- [ ] Social sharing

## License

This project is open source and available under the MIT License.

## Contributing

Contributions, issues, and feature requests are welcome!

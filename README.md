🛍️ E-Commerce Checkout & Review Web Application
A full-stack MERN (MongoDB, Express.js, React, Node.js) based shopping cart application with features including product management, user authentication, cart and checkout functionality, order tracking, PDF generation, coupon validation, and product reviews.

📌 Features
✅ User Functionality
Register/Login with JWT-based authentication

Browse available products

Add to cart and view real-time cart updates

Apply coupon codes at checkout

Secure checkout and payment simulation

View recent orders with PDF download option

Submit and browse product reviews

🛠️ Admin Functionality
Add new products

Manage orders

View user details

🧾 Extra Features
Dynamic and static notification system

PDF invoice generation using jsPDF

Responsive and modular React UI

Reorder functionality

Role-based access control

🧰 Tech Stack
🔹 Frontend
React.js (with Hooks and Context API)

React Router

Vanilla JavaScript (ES6)

HTML5, CSS3

🔹 Backend
Node.js

Express.js

MongoDB (with Mongoose)

RESTful APIs

JWT Authentication

🔹 Libraries & Tools
jsPDF (for PDF generation)

bcrypt (for password hashing)

nodemon, dotenv, cors

React Icons, ESLint

⚙️ Installation & Setup
Prerequisites
Node.js & npm

MongoDB running locally or via Atlas

Steps
Clone the repository

bash
复制
编辑
git clone https://github.com/yourusername/shopping-cart-app.git
cd shopping-cart-app
Install backend dependencies

bash
复制
编辑
cd server
npm install
Install frontend dependencies

bash
复制
编辑
cd client
npm install
Create .env file in /server

ini
复制
编辑
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
Start the backend

bash
复制
编辑
cd server
npm run dev
Start the frontend

bash
复制
编辑
cd client
npm start
📷 Screenshots
Product Page	Cart Page	Checkout Page

✍️ Author
Your Name
LinkedIn • GitHub • Email

📃 License
This project is licensed under the MIT License - see the LICENSE file for details.

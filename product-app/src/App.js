import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import UserPage from './pages/UserPage';
import CouponComponent from './components/CouponComponent';
import LoginPage from './pages/LoginPage';
import RecentOrdersPage from './pages/RecentOrdersPage';
import ReorderPage from './pages/ReorderPage';
import ReviewsPage from './pages/ReviewsPage';
import SubmitReviewPage from './pages/SubmitReviewPage';
import ProductReviewPage from './pages/ProductReviewPage';
//import Notification from './components/Notification';
import { NotificationProvider } from './components/NotificationContext';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      console.log('Loaded user from localStorage:', parsedUser);
      setUser(parsedUser);
    } else {
      console.log('No user found in localStorage');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
  };



  return (
    <NotificationProvider>
    <Router>
      <Navbar user={user} setUser={setUser} handleLogout={handleLogout} />
    
      <div style={{ padding: '20px' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage setUser={setUser} />} />
          
          {/* Protected Routes */}
          <Route path="/"element={<ProductPage user={user} />}/>
          <Route path="/cart"element={user ? <CartPage userId={user.userId} /> : <LoginPage />}/>
          <Route path="/checkout" element={user ? <CheckoutPage userId={user.userId} /> : <LoginPage setUser={setUser} />} />
          <Route path="/user" element={user ? <UserPage user={user} /> : <LoginPage setUser={setUser} />} />
          <Route path="/coupon"element={user ? <CouponComponent /> : <Navigate to="/login" />}/>
          <Route path="/recent-orders" element={user ? <RecentOrdersPage userId={user.userId} /> : <LoginPage setUser={setUser} />}/>
          <Route path="/reorder" element={user ? <ReorderPage userId={user.userId} /> : <LoginPage setUser={setUser} />}/>
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/submit-review/:orderId/:productId" element={<SubmitReviewPage user={user} />} />
          <Route path="/reviews/:productId" element={<ProductReviewPage />} />
          
        
        </Routes>
      </div>
    </Router>
    </NotificationProvider>
  );
};

export default App;





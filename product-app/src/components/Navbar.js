import React, { useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useNotification } from '../components/NotificationContext';
import Notifications from './Notifications';
import '../css/Navbar.css';

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const { fetchNotifications } = useNotification();
  const [isLoading, setIsLoading] = useState(true); //  Fix State Initialization

  useEffect(() => {
    const loadNotifications = async () => {
      if (user?._id) {
        try {
          await fetchNotifications(user._id);
        } catch (error) {
          console.error('Notification load error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    };

    loadNotifications();
  }, [user, fetchNotifications]);

  const handleLogout = () => {
    localStorage.removeItem('user'); //  Remove user from localStorage
    setUser(null); //  Clear user state
    navigate('/login'); //  Redirect to login page
  };

  return (
    <nav className="navbar">
      <ul className="nav-list">
        <li className="nav-item">
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
          >
            Product Page
          </NavLink>
        </li>

        {user && (
          <>
            <li className="nav-item">
              <NavLink
                to="/cart"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Cart Page
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/checkout"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Checkout Page
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/user"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                User Page
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/coupon"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Coupon Page
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/recent-orders"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Recent Orders
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/reorder"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Reorder
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="/reviews"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                Reviews
              </NavLink>
            </li>

            <li className="nav-item">
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </li>
          </>
        )}

        {!user && (
          <li className="nav-item">
            <NavLink
              to="/login"
              className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
            >
              Login
            </NavLink>
          </li>
        )}

        {/*  Notification Icon - Only Show If Notifications Exist */}
        <li className="nav-item notification-icon">
          {!isLoading && <Notifications />}
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;

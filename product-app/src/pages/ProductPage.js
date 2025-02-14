import React, { useEffect, useState } from 'react';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import { useNotification } from '../components/NotificationContext';
import '../css/ProductPage.css';

const ProductPage = ({ user }) => {
  const [products, setProducts] = useState([]);
  const { addNotification } = useNotification();


  useEffect(() => {
    if (user) {
      // ✅ Check if the notification was already sent
      const hasNotified = localStorage.getItem(`notified_product_${user._id}`);
      
      if (!hasNotified) {
        addNotification({
          userId: user._id,
          message: 'Add products from the product screen',
          type: 'static',
          link: '/products'
        });

        // ✅ Mark as sent to prevent duplicate notifications
        localStorage.setItem(`notified_product_${user._id}`, 'true');
      }
    }
  }, [user, addNotification]);

  // ✅ Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          console.error('Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error.message);
      }
    };

    fetchProducts();
  }, []);

  // ✅ Add Product (Admin Only)
  const addProduct = async (newProduct) => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newProduct),
      });
      if (response.ok) {
        const savedProduct = await response.json();
        setProducts((prev) => [...prev, savedProduct]);

        // Notify Admin about successful product addition
        addNotification({
          message: `Product "${savedProduct.name}" added successfully!`,
          type: 'dynamic',
          link: '/products'
        });

      } else {
        console.error('Failed to add product');
      }
    } catch (error) {
      console.error('Error adding product:', error.message);
    }
  };

  // ✅ Add to Cart
  const addToCart = async (product) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const userId = storedUser?.userId || 'guest';  // ✅ Use correct userId

    console.log(`🛒 Adding to cart for userId: ${userId}`);
    try {
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: product._id,
          name: product.name,
          price: product.price,
          quantity: 1,
        }),
      });

      if (response.ok) {
        // Notify user that product is added to cart
        addNotification({
          message: `Added "${product.name}" to cart`,
          type: 'dynamic',
          link: '/cart'
        });
        alert(' Product added to cart successfully!');
      } else {
        console.error('Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error.message);
    }
  };

  return (
    <div className="product-page">
      <h1>Product Management</h1>

      {/* Show Product Form for Admins Only */}
      {user?.role === 'admin' && <ProductForm addProduct={addProduct} />}

      {/* Product List */}
      <ProductList products={products} addToCart={addToCart} user={user} />
    </div>
  );
};

export default ProductPage;

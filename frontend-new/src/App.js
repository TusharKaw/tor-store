import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import BitcoinPayment from './pages/BitcoinPayment';
import ProductDetail from './pages/ProductDetail';
import HomePage from './pages/HomePage';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderTracking from './pages/OrderTracking';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [order, setOrder] = useState(null);
  const [bitcoinPayment, setBitcoinPayment] = useState(null);
  const [checkoutMode, setCheckoutMode] = useState(false);

  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      // Check if product is already in cart
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        // Increment quantity if already in cart
        return prevItems.map(item => 
          item._id === product._id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      } else {
        // Add new item with quantity 1
        return [...prevItems, { ...product, quantity: 1 }];
      }
    });
  };

  const handleRemoveFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const handleUpdateQuantity = (productId, newQuantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => 
        item._id === productId 
          ? { ...item, quantity: newQuantity } 
          : item
      )
    );
  };

  const handleCheckout = () => {
    setCheckoutMode(true);
  };

  const handleCancelCheckout = () => {
    setCheckoutMode(false);
  };

  const handlePlaceOrder = async (orderData) => {
    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        throw new Error('Failed to place order');
      }

      const data = await response.json();
      setOrder(data.order);
      setBitcoinPayment(data.bitcoinPayment);
      
      // Clear cart after successful order
      setCartItems([]);
      setCheckoutMode(false);
      
      // Store order ID and customer identifier in localStorage for order tracking
      localStorage.setItem('lastOrder', JSON.stringify({
        orderId: data.order._id,
        customerIdentifier: data.order.customerIdentifier,
      }));
      
      // Redirect to payment page
      window.location.href = `/payment/${data.order._id}`;
    } catch (error) {
      console.error('Error placing order:', error);
      throw error;
    }
  };

  return (
    <Router>
      <div className="App">
        <Header cartItemCount={cartItems.reduce((total, item) => total + item.quantity, 0)} />
        <main className="App-main">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route 
              path="/products" 
              element={<ProductList onAddToCart={handleAddToCart} />} 
            />
            <Route 
              path="/products/category/:category" 
              element={<ProductList onAddToCart={handleAddToCart} />} 
            />
            <Route 
              path="/product/:id" 
              element={<ProductDetail onAddToCart={handleAddToCart} />} 
            />
            <Route 
              path="/cart" 
              element={
                checkoutMode ? (
                  <Checkout 
                    cartItems={cartItems} 
                    onPlaceOrder={handlePlaceOrder}
                    onCancel={handleCancelCheckout}
                  />
                ) : (
                  <Cart 
                    cartItems={cartItems} 
                    onRemoveFromCart={handleRemoveFromCart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onCheckout={handleCheckout}
                  />
                )
              } 
            />
            <Route 
              path="/payment/:orderId" 
              element={<BitcoinPayment />} 
            />
            <Route 
              path="/order/confirmation/:orderId" 
              element={<OrderConfirmation />} 
            />
            <Route 
              path="/order/track" 
              element={<OrderTracking />} 
            />
          </Routes>
        </main>
        <footer className="App-footer">
          <p>© {new Date().getFullYear()} Tor Store - Secure Printing Services</p>
          <p>All transactions are processed via Bitcoin for your privacy</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        setLoading(true);
        
        // Get the customer identifier from localStorage
        const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || '{}');
        const customerIdentifier = lastOrder.customerIdentifier;
        
        if (!customerIdentifier) {
          throw new Error('Unable to authenticate order access');
        }
        
        const response = await fetch(
          `http://localhost:5000/api/orders/${orderId}?customerIdentifier=${customerIdentifier}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        
        const data = await response.json();
        setOrder(data.order);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  if (loading) {
    return <div className="loading">Loading order details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!order) {
    return <div className="not-found">Order information not found</div>;
  }

  return (
    <div className="order-confirmation">
      <div className="confirmation-header">
        <h1>Order Confirmed!</h1>
        <div className="order-id">
          Order ID: <span>{order._id}</span>
        </div>
      </div>
      
      <div className="confirmation-message">
        <p>Thank you for your order. Your payment has been received and your order is being processed.</p>
        <p>You will receive your items within approximately {order.products[0]?.product?.shippingInfo?.estimatedDeliveryDays || 14} days.</p>
      </div>
      
      <div className="order-summary">
        <h2>Order Summary</h2>
        
        <div className="order-items">
          <h3>Items</h3>
          <div className="items-list">
            {order.products.map((item, index) => (
              <div key={index} className="order-item">
                <div className="item-name">{item.name}</div>
                <div className="item-quantity">x{item.quantity}</div>
                <div className="item-price">${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="shipping-details">
          <h3>Shipping Details</h3>
          <div className="address">
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
          </div>
        </div>
        
        <div className="payment-details">
          <h3>Payment Details</h3>
          <div className="payment-method">
            <span>Method:</span>
            <span>Bitcoin</span>
          </div>
          <div className="payment-amount">
            <span>Amount:</span>
            <span>{order.bitcoinAmount} BTC</span>
          </div>
          <div className="payment-status">
            <span>Status:</span>
            <span className="status-paid">Paid</span>
          </div>
        </div>
      </div>
      
      <div className="tracking-info">
        <h2>Track Your Order</h2>
        <p>You can track the status of your order using your Order ID and the button below.</p>
        <div className="tracking-id">
          <span>Tracking ID:</span>
          <span>{order.trackingNumber || 'Will be assigned when shipped'}</span>
        </div>
        <Link to="/order/track" className="track-order-btn">
          Track Order
        </Link>
      </div>
      
      <div className="confirmation-footer">
        <p>
          If you have any questions about your order, please contact our support team with your Order ID.
        </p>
        <Link to="/" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
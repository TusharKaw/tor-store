import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OrderTracking = () => {
  const [trackingInput, setTrackingInput] = useState('');
  const [orderStatus, setOrderStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [trackingType, setTrackingType] = useState('tracking'); // 'tracking' or 'order'

  // Try to get last order from localStorage
  const lastOrder = JSON.parse(localStorage.getItem('lastOrder') || '{}');

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    
    if (!trackingInput.trim()) {
      setError('Please enter a tracking or order number');
      return;
    }
    
    setLoading(true);
    setError(null);
    setOrderStatus(null);
    
    try {
      let response;
      
      if (trackingType === 'tracking') {
        // Track by tracking number
        response = await fetch(`http://localhost:5000/api/orders/track/${trackingInput}`);
      } else {
        // Track by order ID (requires customer identifier)
        if (!lastOrder.customerIdentifier) {
          throw new Error('Customer identifier not found for this order');
        }
        
        response = await fetch(
          `http://localhost:5000/api/orders/${trackingInput}?customerIdentifier=${lastOrder.customerIdentifier}`
        );
      }
      
      if (!response.ok) {
        throw new Error('Failed to retrieve order status');
      }
      
      const data = await response.json();
      setOrderStatus(data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Function to determine the current step in the order process
  const getCurrentStep = () => {
    if (!orderStatus) return 0;
    
    if (trackingType === 'tracking') {
      // For tracking number lookup
      if (!orderStatus.status.isPaid) return 1;
      if (!orderStatus.status.isShipped) return 2;
      if (!orderStatus.status.isDelivered) return 3;
      return 4;
    } else {
      // For order ID lookup
      if (!orderStatus.order.isPaid) return 1;
      if (!orderStatus.order.isShipped) return 2;
      if (!orderStatus.order.isDelivered) return 3;
      return 4;
    }
  };

  return (
    <div className="order-tracking">
      <h1>Track Your Order</h1>
      
      <div className="tracking-form-container">
        <form onSubmit={handleTrackOrder} className="tracking-form">
          <div className="tracking-type-selector">
            <label>
              <input
                type="radio"
                name="trackingType"
                value="tracking"
                checked={trackingType === 'tracking'}
                onChange={() => setTrackingType('tracking')}
              />
              Track by Tracking Number
            </label>
            <label>
              <input
                type="radio"
                name="trackingType"
                value="order"
                checked={trackingType === 'order'}
                onChange={() => setTrackingType('order')}
              />
              Track by Order ID
            </label>
          </div>
          
          <div className="input-group">
            <input
              type="text"
              value={trackingInput}
              onChange={(e) => setTrackingInput(e.target.value)}
              placeholder={trackingType === 'tracking' ? "Enter tracking number" : "Enter order ID"}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Tracking...' : 'Track'}
            </button>
          </div>
          
          {error && <div className="error-message">{error}</div>}
          
          {lastOrder.orderId && (
            <div className="last-order">
              <p>Your last order: <strong>{lastOrder.orderId}</strong></p>
              <button
                type="button"
                className="use-last-order"
                onClick={() => {
                  setTrackingInput(lastOrder.orderId);
                  setTrackingType('order');
                }}
              >
                Track Last Order
              </button>
            </div>
          )}
        </form>
      </div>
      
      {orderStatus && (
        <div className="tracking-results">
          <h2>Order Status</h2>
          
          <div className="order-progress">
            <div className="progress-steps">
              <div className={`step ${getCurrentStep() >= 1 ? 'active' : ''}`}>
                <div className="step-icon">1</div>
                <div className="step-label">Order Placed</div>
              </div>
              <div className={`step ${getCurrentStep() >= 2 ? 'active' : ''}`}>
                <div className="step-icon">2</div>
                <div className="step-label">Payment Confirmed</div>
              </div>
              <div className={`step ${getCurrentStep() >= 3 ? 'active' : ''}`}>
                <div className="step-icon">3</div>
                <div className="step-label">Shipped</div>
              </div>
              <div className={`step ${getCurrentStep() >= 4 ? 'active' : ''}`}>
                <div className="step-icon">4</div>
                <div className="step-label">Delivered</div>
              </div>
            </div>
            
            <div className="progress-bar">
              <div 
                className="progress-fill" 
                style={{ width: `${(getCurrentStep() / 4) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="status-details">
            {trackingType === 'tracking' ? (
              <>
                <div className="status-item">
                  <span>Order ID:</span>
                  <span>{orderStatus.orderId}</span>
                </div>
                <div className="status-item">
                  <span>Tracking Number:</span>
                  <span>{trackingInput}</span>
                </div>
                <div className="status-item">
                  <span>Status:</span>
                  <span className="status-value">
                    {!orderStatus.status.isPaid ? 'Awaiting Payment' :
                     !orderStatus.status.isShipped ? 'Processing' :
                     !orderStatus.status.isDelivered ? 'In Transit' : 'Delivered'}
                  </span>
                </div>
                {orderStatus.status.isShipped && (
                  <>
                    <div className="status-item">
                      <span>Shipped Date:</span>
                      <span>{new Date(orderStatus.shippedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="status-item">
                      <span>Estimated Delivery:</span>
                      <span>{orderStatus.estimatedDelivery ? new Date(orderStatus.estimatedDelivery).toLocaleDateString() : 'Not available'}</span>
                    </div>
                  </>
                )}
              </>
            ) : (
              <>
                <div className="status-item">
                  <span>Order ID:</span>
                  <span>{orderStatus.order._id}</span>
                </div>
                <div className="status-item">
                  <span>Order Date:</span>
                  <span>{new Date(orderStatus.order.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="status-item">
                  <span>Status:</span>
                  <span className="status-value">
                    {!orderStatus.order.isPaid ? 'Awaiting Payment' :
                     !orderStatus.order.isShipped ? 'Processing' :
                     !orderStatus.order.isDelivered ? 'In Transit' : 'Delivered'}
                  </span>
                </div>
                {orderStatus.order.isPaid && (
                  <div className="status-item">
                    <span>Payment Date:</span>
                    <span>{new Date(orderStatus.order.paidAt).toLocaleDateString()}</span>
                  </div>
                )}
                {orderStatus.order.isShipped && (
                  <>
                    <div className="status-item">
                      <span>Shipped Date:</span>
                      <span>{new Date(orderStatus.order.shippedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="status-item">
                      <span>Tracking Number:</span>
                      <span>{orderStatus.order.trackingNumber || 'Not available'}</span>
                    </div>
                  </>
                )}
                {orderStatus.order.isDelivered && (
                  <div className="status-item">
                    <span>Delivered Date:</span>
                    <span>{new Date(orderStatus.order.deliveredAt).toLocaleDateString()}</span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
      
      <div className="tracking-footer">
        <Link to="/" className="back-to-store">
          Back to Store
        </Link>
      </div>
    </div>
  );
};

export default OrderTracking;
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const BitcoinPayment = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [bitcoinPayment, setBitcoinPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState('pending');

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
        setBitcoinPayment(data.bitcoinPayment);
        setLoading(false);
        
        // Calculate time left for payment
        if (data.bitcoinPayment && data.bitcoinPayment.expiresAt) {
          const expiryTime = new Date(data.bitcoinPayment.expiresAt).getTime();
          const now = new Date().getTime();
          setTimeLeft(Math.max(0, Math.floor((expiryTime - now) / 1000)));
        }
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || paymentStatus !== 'pending') return;
    
    const timerId = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timerId);
  }, [timeLeft, paymentStatus]);

  // Format time left as hours:minutes:seconds
  const formatTimeLeft = () => {
    if (timeLeft === null) return '--:--:--';
    
    const hours = Math.floor(timeLeft / 3600);
    const minutes = Math.floor((timeLeft % 3600) / 60);
    const seconds = timeLeft % 60;
    
    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':');
  };

  // Simulate payment confirmation (in a real app, this would be handled by a webhook)
  const simulatePaymentConfirmation = async () => {
    try {
      setPaymentStatus('processing');
      
      // Simulate API call to update payment status
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transactionId: 'tx_' + Math.random().toString(36).substr(2, 9),
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to confirm payment');
      }
      
      setPaymentStatus('confirmed');
      
      // Redirect to confirmation page after 2 seconds
      setTimeout(() => {
        window.location.href = `/order/confirmation/${orderId}`;
      }, 2000);
    } catch (error) {
      setError('Payment confirmation failed: ' + error.message);
      setPaymentStatus('failed');
    }
  };

  if (loading) {
    return <div className="loading">Loading payment details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!order || !bitcoinPayment) {
    return <div className="not-found">Order information not found</div>;
  }

  return (
    <div className="bitcoin-payment">
      <h1>Bitcoin Payment</h1>
      
      <div className="payment-status">
        <div className={`status-indicator ${paymentStatus}`}>
          {paymentStatus === 'pending' && 'Waiting for Payment'}
          {paymentStatus === 'processing' && 'Processing Payment'}
          {paymentStatus === 'confirmed' && 'Payment Confirmed!'}
          {paymentStatus === 'failed' && 'Payment Failed'}
        </div>
      </div>
      
      <div className="payment-details">
        <div className="qr-code">
          {/* In a real implementation, this would be a QR code for the Bitcoin address */}
          <div className="qr-placeholder">
            Bitcoin QR Code
          </div>
        </div>
        
        <div className="payment-info">
          <div className="info-row">
            <span>Amount:</span>
            <span className="bitcoin-amount">{bitcoinPayment.amount} BTC</span>
          </div>
          
          <div className="info-row">
            <span>Address:</span>
            <div className="bitcoin-address">
              <code>{bitcoinPayment.address}</code>
              <button 
                className="copy-btn"
                onClick={() => {
                  navigator.clipboard.writeText(bitcoinPayment.address);
                  alert('Bitcoin address copied to clipboard');
                }}
              >
                Copy
              </button>
            </div>
          </div>
          
          <div className="info-row">
            <span>Time Remaining:</span>
            <span className="time-remaining">{formatTimeLeft()}</span>
          </div>
        </div>
      </div>
      
      <div className="payment-instructions">
        <h3>Instructions</h3>
        <ol>
          <li>Send exactly <strong>{bitcoinPayment.amount} BTC</strong> to the address above</li>
          <li>Payment must be completed within the time remaining</li>
          <li>After sending payment, wait for blockchain confirmation</li>
          <li>Once confirmed, your order will be processed</li>
        </ol>
      </div>
      
      {/* For demo purposes only - in a real app, payment would be detected automatically */}
      <div className="demo-controls">
        <p><strong>Demo Mode:</strong> Click the button below to simulate payment confirmation</p>
        <button 
          className="simulate-payment-btn"
          onClick={simulatePaymentConfirmation}
          disabled={paymentStatus !== 'pending' || timeLeft === 0}
        >
          Simulate Payment
        </button>
      </div>
      
      <div className="payment-footer">
        <p>
          Having issues? Contact support with your Order ID: <strong>{orderId}</strong>
        </p>
        <Link to="/" className="cancel-link">Cancel and return to store</Link>
      </div>
    </div>
  );
};

export default BitcoinPayment;
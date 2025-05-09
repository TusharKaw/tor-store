import React from 'react';
import { Link } from 'react-router-dom';

const Cart = ({ cartItems, onRemoveFromCart, onUpdateQuantity, onCheckout }) => {
  // Calculate subtotal
  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Calculate Bitcoin total
  const bitcoinTotal = cartItems.reduce(
    (total, item) => total + parseFloat(item.bitcoinPrice) * item.quantity,
    0
  ).toFixed(8);

  if (cartItems.length === 0) {
    return (
      <div className="cart empty-cart">
        <h2>Your Cart</h2>
        <p>Your cart is empty.</p>
        <Link to="/products" className="continue-shopping-btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item._id} className="cart-item">
            <div className="cart-item-image">
              {item.image ? (
                <img src={item.image} alt={item.name} />
              ) : (
                <div className="no-image">No Image</div>
              )}
            </div>
            
            <div className="cart-item-details">
              <h3>{item.name}</h3>
              <p className="item-price">${item.price.toFixed(2)} / {item.bitcoinPrice} BTC</p>
              
              {item.customizations && Object.keys(item.customizations).length > 0 && (
                <div className="item-customizations">
                  <p>Customizations:</p>
                  <ul>
                    {Object.entries(item.customizations).map(([key, value]) => (
                      <li key={key}>
                        <strong>{key}:</strong> {value}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            
            <div className="cart-item-actions">
              <div className="quantity-control">
                <button 
                  onClick={() => onUpdateQuantity(item._id, Math.max(1, item.quantity - 1))}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button 
                  onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <button 
                className="remove-btn"
                onClick={() => onRemoveFromCart(item._id)}
              >
                Remove
              </button>
            </div>
            
            <div className="cart-item-total">
              <p>${(item.price * item.quantity).toFixed(2)}</p>
              <p className="bitcoin-price">
                {(parseFloat(item.bitcoinPrice) * item.quantity).toFixed(8)} BTC
              </p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="cart-summary">
        <div className="cart-total">
          <span>Total:</span>
          <div>
            <div>${subtotal.toFixed(2)}</div>
            <div className="bitcoin-price">{bitcoinTotal} BTC</div>
          </div>
        </div>
        
        <button 
          className="checkout-btn"
          onClick={onCheckout}
        >
          Proceed to Checkout
        </button>
        
        <Link to="/products" className="continue-shopping">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
};

export default Cart;
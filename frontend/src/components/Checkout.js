import React, { useState } from 'react';

const Checkout = ({ cartItems, onPlaceOrder, onCancel }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Postal code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email address is invalid';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Generate a random customer identifier for anonymous orders
      const customerIdentifier = Math.random().toString(36).substring(2, 15) + 
                                Math.random().toString(36).substring(2, 15);
      
      // Prepare order data
      const orderData = {
        customerIdentifier,
        products: cartItems.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          customizations: item.customizations || {},
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        totalPrice: subtotal,
        bitcoinAmount: bitcoinTotal,
        notes: formData.notes,
      };
      
      await onPlaceOrder(orderData);
    } catch (error) {
      setErrors({
        submit: 'Failed to place order. Please try again.',
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="checkout">
      <h2>Checkout</h2>
      
      <div className="order-summary">
        <h3>Order Summary</h3>
        
        {cartItems.map(item => (
          <div key={item._id} className="summary-item">
            <span>
              {item.name} x {item.quantity}
              {item.customizations && Object.keys(item.customizations).length > 0 && (
                <span className="item-options">
                  {' '}({Object.values(item.customizations).join(', ')})
                </span>
              )}
            </span>
            <span>${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        
        <div className="total">
          <span>Total:</span>
          <span>
            <div>${subtotal.toFixed(2)}</div>
            <div className="bitcoin-price">{bitcoinTotal} BTC</div>
          </span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <h3>Shipping Information</h3>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="firstName">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={errors.firstName ? 'error' : ''}
            />
            {errors.firstName && <div className="error-message">{errors.firstName}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="lastName">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={errors.lastName ? 'error' : ''}
            />
            {errors.lastName && <div className="error-message">{errors.lastName}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'error' : ''}
          />
          {errors.email && <div className="error-message">{errors.email}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={errors.address ? 'error' : ''}
          />
          {errors.address && <div className="error-message">{errors.address}</div>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="city">City</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className={errors.city ? 'error' : ''}
            />
            {errors.city && <div className="error-message">{errors.city}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="postalCode">Postal Code</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className={errors.postalCode ? 'error' : ''}
            />
            {errors.postalCode && <div className="error-message">{errors.postalCode}</div>}
          </div>
        </div>
        
        <div className="form-group">
          <label htmlFor="country">Country</label>
          <input
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className={errors.country ? 'error' : ''}
          />
          {errors.country && <div className="error-message">{errors.country}</div>}
        </div>
        
        <div className="form-group order-notes">
          <label htmlFor="notes">Order Notes (Optional)</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Special instructions for your order"
          ></textarea>
        </div>
        
        <div className="payment-method">
          <h3>Payment Method</h3>
          <div className="payment-option">
            <input
              type="radio"
              id="bitcoin"
              name="paymentMethod"
              value="bitcoin"
              checked
              readOnly
            />
            <label htmlFor="bitcoin">Bitcoin</label>
          </div>
          <p className="payment-note">
            You will be redirected to the Bitcoin payment page after placing your order.
          </p>
        </div>
        
        {errors.submit && <div className="error-message">{errors.submit}</div>}
        
        <div className="checkout-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={onCancel}
          >
            Back to Cart
          </button>
          
          <button
            type="submit"
            className="place-order-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Processing...' : 'Place Order'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
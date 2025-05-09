import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const ProductDetail = ({ onAddToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState({});

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch product details');
        }
        
        const data = await response.json();
        setProduct(data);
        
        // Initialize selected options
        if (data.customizationOptions && data.customizationOptions.length > 0) {
          const initialOptions = {};
          data.customizationOptions.forEach(option => {
            if (option.options && option.options.length > 0) {
              initialOptions[option.name] = option.options[0];
            }
          });
          setSelectedOptions(initialOptions);
        }
        
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleOptionChange = (optionName, value) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionName]: value,
    }));
  };

  const handleAddToCart = () => {
    if (product) {
      const productWithOptions = {
        ...product,
        quantity,
        customizations: selectedOptions,
      };
      onAddToCart(productWithOptions);
    }
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!product) {
    return <div className="not-found">Product not found</div>;
  }

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <div className="product-image-container">
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-detail-image" 
            />
          ) : (
            <div className="no-image-large">No Image Available</div>
          )}
        </div>
        
        <div className="product-info-container">
          <h1 className="product-title">{product.name}</h1>
          <div className="product-category">
            Category: {product.category.replace('_', ' ')}
          </div>
          
          <div className="product-price-container">
            <div className="product-price">
              <span className="fiat-price">${product.price.toFixed(2)}</span>
              <span className="bitcoin-price">{product.bitcoinPrice} BTC</span>
            </div>
          </div>
          
          <div className="product-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="product-specifications">
              <h3>Specifications</h3>
              <ul>
                {Object.entries(product.specifications).map(([key, value]) => (
                  <li key={key}>
                    <strong>{key}:</strong> {value}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {product.customizationOptions && product.customizationOptions.length > 0 && (
            <div className="product-customization">
              <h3>Customization Options</h3>
              {product.customizationOptions.map((option) => (
                <div key={option.name} className="customization-option">
                  <label htmlFor={option.name}>{option.name}:</label>
                  <select
                    id={option.name}
                    value={selectedOptions[option.name] || ''}
                    onChange={(e) => handleOptionChange(option.name, e.target.value)}
                  >
                    {option.options.map((choice) => (
                      <option key={choice} value={choice}>
                        {choice}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          )}
          
          <div className="product-actions">
            <div className="quantity-selector">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                />
                <button onClick={() => setQuantity(quantity + 1)}>
                  +
                </button>
              </div>
            </div>
            
            <button 
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={product.stockQuantity < 1}
            >
              {product.stockQuantity < 1 ? 'Out of Stock' : 'Add to Cart'}
            </button>
          </div>
          
          <div className="shipping-info">
            <h3>Shipping Information</h3>
            <p>
              Estimated delivery: {product.shippingInfo?.estimatedDeliveryDays || 14} days
            </p>
          </div>
        </div>
      </div>
      
      <div className="back-to-products">
        <Link to="/products">← Back to Products</Link>
      </div>
    </div>
  );
};

export default ProductDetail;
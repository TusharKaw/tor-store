import React from 'react';

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="product-card">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </div>
      <div className="product-info">
        <h3>{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <div className="product-price">
          <span className="fiat-price">${product.price.toFixed(2)}</span>
          <span className="bitcoin-price">{product.bitcoinPrice} BTC</span>
        </div>
        <div className="product-category">
          Category: {product.category.replace('_', ' ')}
        </div>
        <button 
          className="add-to-cart-btn" 
          onClick={() => onAddToCart(product)}
        >
          Add to Cart
        </button>
        <a href={`/product/${product._id}`} className="view-details-btn">
          View Details
        </a>
      </div>
    </div>
  );
};

export default ProductCard;
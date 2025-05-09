import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';

const ProductList = ({ onAddToCart }) => {
  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const url = category 
          ? `http://localhost:5000/api/products/category/${category}`
          : 'http://localhost:5000/api/products';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const getCategoryTitle = () => {
    if (!category) return 'All Products';
    
    // Convert category_name to Category Name format
    return category
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (products.length === 0) {
    return (
      <div className="no-products">
        <h2>{getCategoryTitle()}</h2>
        <p>No products found in this category.</p>
        <Link to="/products">View all products</Link>
      </div>
    );
  }

  return (
    <div className="products-container">
      <h2>{getCategoryTitle()}</h2>
      <div className="product-list">
        {products.map(product => (
          <div key={product._id} className="product-card">
            <div className="product-image">
              {product.image ? (
                <img src={product.image} alt={product.name} />
              ) : (
                <div className="no-image">No Image Available</div>
              )}
            </div>
            <div className="product-info">
              <h3>{product.name}</h3>
              <div className="product-category">
                {product.category.replace('_', ' ')}
              </div>
              <p className="product-description">
                {product.description.length > 100
                  ? `${product.description.substring(0, 100)}...`
                  : product.description}
              </p>
              <div className="product-price">
                <span className="fiat-price">${product.price.toFixed(2)}</span>
                <span className="bitcoin-price">{product.bitcoinPrice} BTC</span>
              </div>
              <div className="product-actions">
                <Link to={`/product/${product._id}`} className="view-details-btn">
                  View Details
                </Link>
                <button 
                  className="add-to-cart-btn"
                  onClick={() => onAddToCart(product)}
                  disabled={product.stockQuantity < 1}
                >
                  {product.stockQuantity < 1 ? 'Out of Stock' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Tor Store</h1>
          <p>Your secure destination for high-quality printing services</p>
          <p>All transactions are processed via Bitcoin for enhanced privacy</p>
          <Link to="/products" className="cta-button">
            Browse Products
          </Link>
        </div>
      </section>

      <section className="featured-categories">
        <h2>Our Products</h2>
        <div className="category-grid">
          <div className="category-card">
            <h3>Business Cards</h3>
            <p>Professional business cards with premium quality paper and printing</p>
            <Link to="/products/category/business_cards">View Business Cards</Link>
          </div>
          <div className="category-card">
            <h3>Flyers</h3>
            <p>Vibrant flyers for promotions, events, and announcements</p>
            <Link to="/products/category/flyers">View Flyers</Link>
          </div>
          <div className="category-card">
            <h3>Brochures</h3>
            <p>Informative brochures with various folding options</p>
            <Link to="/products/category/brochures">View Brochures</Link>
          </div>
          <div className="category-card">
            <h3>Posters</h3>
            <p>Eye-catching posters in various sizes and finishes</p>
            <Link to="/products/category/posters">View Posters</Link>
          </div>
        </div>
      </section>

      <section className="privacy-features">
        <h2>Privacy Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <h3>Anonymous Browsing</h3>
            <p>Browse our products without tracking or surveillance</p>
          </div>
          <div className="feature-card">
            <h3>Bitcoin Payments</h3>
            <p>Secure transactions using Bitcoin cryptocurrency</p>
          </div>
          <div className="feature-card">
            <h3>Discreet Shipping</h3>
            <p>Plain packaging with no company branding</p>
          </div>
          <div className="feature-card">
            <h3>No Account Required</h3>
            <p>Order without creating an account or sharing personal details</p>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Browse Products</h3>
            <p>Explore our range of high-quality printing products</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Add to Cart</h3>
            <p>Select products and customize as needed</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Checkout</h3>
            <p>Provide shipping details and review your order</p>
          </div>
          <div className="step">
            <div className="step-number">4</div>
            <h3>Pay with Bitcoin</h3>
            <p>Complete your purchase securely with Bitcoin</p>
          </div>
          <div className="step">
            <div className="step-number">5</div>
            <h3>Track & Receive</h3>
            <p>Track your order and receive your products</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
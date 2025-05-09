import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Header = ({ cartItemCount = 0 }) => {
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);

  const toggleCategoryMenu = () => {
    setShowCategoryMenu(!showCategoryMenu);
  };

  return (
    <header style={headerStyle}>
      <div className="header-top">
        <Link to="/" style={logoStyle}>
          <h1>Tor Store</h1>
        </Link>
        <div className="header-actions">
          <Link to="/order/track" style={linkStyle}>
            Track Order
          </Link>
          <Link to="/cart" style={cartStyle}>
            <span className="cart-icon">🛒</span>
            {cartItemCount > 0 && (
              <span className="cart-count">{cartItemCount}</span>
            )}
          </Link>
        </div>
      </div>
      <nav>
        <ul style={navStyle}>
          <li><Link to="/" style={linkStyle}>Home</Link></li>
          <li className="dropdown">
            <button 
              onClick={toggleCategoryMenu} 
              style={dropdownButtonStyle}
            >
              Products ▼
            </button>
            {showCategoryMenu && (
              <div className="dropdown-menu" style={dropdownMenuStyle}>
                <Link to="/products" style={dropdownItemStyle}>All Products</Link>
                <Link to="/products/category/business_cards" style={dropdownItemStyle}>Business Cards</Link>
                <Link to="/products/category/flyers" style={dropdownItemStyle}>Flyers</Link>
                <Link to="/products/category/brochures" style={dropdownItemStyle}>Brochures</Link>
                <Link to="/products/category/posters" style={dropdownItemStyle}>Posters</Link>
                <Link to="/products/category/stickers" style={dropdownItemStyle}>Stickers</Link>
                <Link to="/products/category/other" style={dropdownItemStyle}>Other Products</Link>
              </div>
            )}
          </li>
          <li><Link to="/about" style={linkStyle}>About</Link></li>
        </ul>
      </nav>
    </header>
  );
};

const headerStyle = {
  background: '#333',
  color: '#fff',
  padding: '1rem',
};

const logoStyle = {
  color: '#fff',
  textDecoration: 'none',
};

const navStyle = {
  display: 'flex',
  justifyContent: 'center',
  listStyle: 'none',
  padding: 0,
  position: 'relative',
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: '0 1rem',
};

const cartStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: '0 1rem',
  position: 'relative',
};

const dropdownButtonStyle = {
  background: 'none',
  border: 'none',
  color: '#fff',
  cursor: 'pointer',
  fontSize: '1rem',
  padding: '0 1rem',
};

const dropdownMenuStyle = {
  position: 'absolute',
  backgroundColor: '#444',
  minWidth: '160px',
  boxShadow: '0px 8px 16px 0px rgba(0,0,0,0.2)',
  zIndex: 1,
  display: 'flex',
  flexDirection: 'column',
  top: '100%',
};

const dropdownItemStyle = {
  color: '#fff',
  padding: '12px 16px',
  textDecoration: 'none',
  display: 'block',
  textAlign: 'left',
  ':hover': {
    backgroundColor: '#555',
  },
};

export default Header;
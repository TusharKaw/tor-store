import React from 'react';

const Header = () => {
  return (
    <header style={headerStyle}>
      <h1>Tor Store</h1>
      <nav>
        <ul style={navStyle}>
          <li><a href="/" style={linkStyle}>Home</a></li>
          <li><a href="/products" style={linkStyle}>Products</a></li>
          <li><a href="/about" style={linkStyle}>About</a></li>
        </ul>
      </nav>
    </header>
  );
};

const headerStyle = {
  background: '#333',
  color: '#fff',
  textAlign: 'center',
  padding: '1rem',
};

const navStyle = {
  display: 'flex',
  justifyContent: 'center',
  listStyle: 'none',
  padding: 0,
};

const linkStyle = {
  color: '#fff',
  textDecoration: 'none',
  padding: '0 1rem',
};

export default Header;
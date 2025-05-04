import React from 'react';
import './App.css';
import Header from './components/Header';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="App-main">
        <h2>Welcome to Tor Store</h2>
        <p>A secure online marketplace</p>
      </main>
    </div>
  );
}

export default App;
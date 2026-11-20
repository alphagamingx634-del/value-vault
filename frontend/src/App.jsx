
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useState } from "react";
import "./App.css";

import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import Register from "./components/Register";
import Login from "./components/Login";
import VerifyOTP from "./components/VerifyOTP";

function Home() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const categories = [
    { icon: "💻", name: "Electronics" },
    { icon: "📚", name: "Books" },
    { icon: "🔧", name: "Tools" },
    { icon: "⚽", name: "Sports" },
    { icon: "🪑", name: "Furniture" },
    { icon: "🎸", name: "Music" },
    { icon: "🚲", name: "Vehicles" },
    
  ];

  return (
    <div className="app">

      {/* Navbar */}
      <nav className="navbar">
        <Link to="/" className="logo">
          <span className="logo-icon">V</span>
          ValueVault
        </Link>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#products">Browse</a>
          <Link to="/dashboard">Dashboard</Link>
        </div>

        <div className="nav-buttons">
          <Link to="/login">
            <button className="login-btn">Login</button>
          </Link>

          <Link to="/register">
            <button className="register-btn">Sign Up</button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero" id="home">
        <div className="hero-content">
          <h1>
            Unlock the Value of{" "}
            <span>Shared Resources</span>
          </h1>

          <p className="hero-text">
            Rent products from your community or earn by lending
            what you own. Affordable, easy, and trusted.
          </p>

          <div className="hero-buttons">
            <a href="#products">
              <button className="explore-btn">
                Browse Products
              </button>
            </a>

            <Link to="/dashboard">
              <button className="list-btn">
                List Your Item
              </button>
            </Link>
          </div>

          <div className="hero-highlights">
            <div>🔒 <strong>Secure</strong><p>User Authentication</p></div>
            <div>⚡ <strong>Fast</strong><p>Easy Product Listing</p></div>
            <div>🤝 <strong>Trusted</strong><p>Community Sharing</p></div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="features" id="about">
        <h2>How <span>ValueVault</span> Works</h2>

        <div className="feature-container">
          <div className="feature-card">
            <div className="feature-icon">📦</div>
            <h3>List Your Items</h3>
            <p>Upload products you don't use daily and set your rental price.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔍</div>
            <h3>Browse & Borrow</h3>
            <p>Find what you need from a wide variety of categories at affordable rates.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">💰</div>
            <h3>Save & Earn</h3>
            <p>Save money by renting and earn passive income by lending items.</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">🔒</div>
            <h3>Safe & Secure</h3>
            <p>Verified users and a secure transaction system protect everyone.</p>
          </div>
        </div>
      </section>

      {/* Available Products */}
      

      {/* Popular Categories */}
      <section className="categories-section">
        <h2>Popular <span>Categories</span></h2>

        <div className="categories-container">
          {categories.map((category) => (
            <button
  className="category-card"
  key={category.name}
  onClick={() => setSelectedCategory(category.name)}
            >
              <span>{category.icon}</span>
              <p>{category.name}</p>
            </button>
          ))}
        </div>
      </section>
      {selectedCategory && (
  <Products category={selectedCategory} />
)}

      {/* Call to Action */}
      <section className="cta-section">
        <h2>Ready to start saving and earning?</h2>
        <p>
          Join the ValueVault community and start sharing resources today.
        </p>

        <Link to="/register">
          <button className="explore-btn">Get Started Free</button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="main-footer">
        <div className="footer-container">
          <div>
            <h3>ValueVault</h3>
            <p>Your trusted platform for borrowing and lending products.</p>
          </div>

          <div>
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#products">Browse</a>
            <Link to="/dashboard">Dashboard</Link>
          </div>

          <div>
            <h3>Contact</h3>
            <p>📧 support@valuevault.com</p>
            <p>📞 +91 98765 43210</p>
          </div>
        </div>

        <div className="footer-bottom">
          © 2026 ValueVault. All rights reserved. | Major Project
        </div>
      </footer>

    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

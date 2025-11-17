// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="relative h-16 flex items-center justify-between px-6 bg-black shadow">
    {/* Logo */}
    <Link to="/" className="flex items-center">
      <p className="h-12 w-12 text-white flex items-center justify-center"> ATLAS </p>
    </Link>

    {/* Centered Nav */}
    <nav className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6 text-white">
      <Link to="/about">About</Link>
      <Link to="/pricing">Pricing</Link>
      <Link to="/contact">Contact</Link>
    </nav>

    {/* Login + Signup buttons */}
    <div className="flex space-x-4">
      <button 
        onClick={() => navigate("/signin")}
        className="h-8 w-20 bg-white rounded text-black font-bold"
      >
        Login
      </button>
      <button 
        onClick={() => navigate("/signup")}
        className="h-8 w-20 bg-white rounded text-black font-bold"
      >
        Sign Up
      </button>
    </div>
  </header>

  );
}

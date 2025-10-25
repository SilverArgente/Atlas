// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

export default function Header() {
  const navigate = useNavigate();

  return (
    <header className="h-16 flex items-center justify-between px-6 bg-white shadow">
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <img src={logo} alt="Logo" className="h-10 w-10" />
      </Link>

      {/* Nav */}
      <nav className="flex space-x-6">
        <Link to="/about">About</Link>
        <Link to="/pricing">Pricing</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      {/* Login button */}
      <button 
        onClick={() => navigate("/signin")}
        className="h-8 w-20 bg-gray-400 rounded text-white font-bold"
      >
        Login
      </button>
    </header>
  );
}

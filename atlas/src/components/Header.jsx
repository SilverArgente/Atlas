// src/components/Header.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../services/supabaseClient.js"; // adjust path if needed

export default function Header() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get current user on initial load
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });

    // Listen for login/logout in real-time
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return (
    <header className="relative h-16 flex items-center justify-between px-6 bg-black shadow">
      
      {/* Logo */}
      <Link to="/" className="flex items-center">
        <p className="h-12 w-12 text-white flex items-center justify-center font-bold tracking-wide">
          ATLAS
        </p>
      </Link>

    {/* Centered Nav */}
    <nav className="absolute left-1/2 transform -translate-x-1/2 flex space-x-6 text-white">
      <Link to={user ? "/dashboard" : "/"}>Home</Link>
      <Link to="/about">About</Link>
      <Link to="/pricing">Pricing</Link>
      <Link to="/contact">Contact</Link>
    </nav>

      {/* Right side buttons */}
      <div className="flex items-center space-x-4 text-white">

        {!user && (
          <>
            <button
              onClick={() => navigate("/signin")}
              className="h-8 w-20 bg-white rounded text-black font-bold hover:bg-gray-200 transition"
            >
              Login
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="h-8 w-20 bg-white rounded text-black font-bold hover:bg-gray-200 transition"
            >
              Sign Up
            </button>
          </>
        )}

        {user && (
          <>
            <span className="text-gray-300 text-sm">
              {user.email}
            </span>

            <button
              onClick={async () => {
                await supabase.auth.signOut();
                navigate("/"); // optional redirect
              }}
              className="h-8 px-4 bg-white rounded text-black font-bold hover:bg-gray-200 transition"
            >
              Logout
            </button>
          </>
        )}

      </div>
    </header>
  );
}

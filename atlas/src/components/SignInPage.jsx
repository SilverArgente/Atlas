import React, { useState } from 'react';
import { LayoutBox } from "./LayoutBox.jsx";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';

function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      
      const { data, error } = await signIn(email, password);
      if (error) throw error;

      if (data?.user) {
        console.log("Logged in user:", data.user);
        sessionStorage.setItem("user", JSON.stringify(data.user));
        navigate("/create");
      }

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Right Side - Login Form */}
      <div className="flex items-center justify-center">
        <LayoutBox className="w-full max-w-md bg-white">
          <div className="space-y-6">
            
            {/* Form Header */}
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold text-gray-800">Login</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="your@email.com"
                  className="w-full h-10 bg-gray-100 rounded border-2 border-dashed border-gray-300 px-3 outline-none disabled:opacity-50"
                />
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="••••••••"
                  className="w-full h-10 bg-gray-100 rounded border-2 border-dashed border-gray-300 px-3 outline-none disabled:opacity-50"
                />
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-center text-sm mt-2">{error}</p>
              )}

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="h-10 w-full bg-gray-400 rounded text-black font-bold flex items-center justify-center hover:bg-gray-500 transition disabled:opacity-50"
              >
                {loading ? "Signing In..." : "Submit"}
              </button>

              {/* Forgot Password */}
              <div className="flex justify-end text-sm mt-2">
                <button
                  type="button"
                  className="text-blue-600 hover:underline"
                  onClick={() => navigate("/forgot-password")}
                >
                  Forgot Password?
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center space-x-3 my-4">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-400 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Sign Up Link */}
              <div className="text-center">
                <p>
                  Don’t have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </LayoutBox>
      </div>

      <Footer />
    </div>
  );
}

export default SignInPage;

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LayoutBox } from "./LayoutBox.jsx";
import Header from "./Header";
import Footer from "./Footer.jsx";

function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    try {
      setError('');
      setMessage('');
      setLoading(true);
      
      const { data, error } = await signUp(email, password);
      
      if (error) throw error;
      
      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        setMessage('Check your email to confirm your account!');
      } else {
        setMessage('Account created! Redirecting to login...');
        setTimeout(() => navigate('/singin'), 2000);
      }
    } catch (error) {
      setError(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="flex items-center justify-center py-12">
        <LayoutBox className="w-full max-w-md bg-white">
          <div className="space-y-6">
            {/* Form Header */}
            <div className="text-center space-y-2">
              <h1 className="text-2xl font-bold text-gray-900">Create Account</h1>
              <p className="text-gray-600">Sign up to get started</p>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            {message && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                {message}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
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

              {/* Password Field */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="At least 6 characters"
                  className="w-full h-10 bg-gray-100 rounded border-2 border-dashed border-gray-300 px-3 outline-none disabled:opacity-50"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-2">
                <label className="block font-semibold text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={loading}
                  placeholder="Repeat your password"
                  className="w-full h-10 bg-gray-100 rounded border-2 border-dashed border-gray-300 px-3 outline-none disabled:opacity-50"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="h-10 w-full bg-gray-400 rounded text-black font-bold flex items-center justify-center hover:bg-gray-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>

              {/* Divider */}
              <div className="flex items-center space-x-3">
                <div className="flex-1 h-px bg-gray-300"></div>
                <span className="text-gray-500 text-sm">or</span>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{' '}
                  <Link to="/signin" className="text-blue-600 hover:text-blue-800 font-semibold">
                    Log in
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

export default SignupPage;
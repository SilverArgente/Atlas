import { LayoutBox } from "./LayoutBox.jsx";
import Header from "./Header";
import Footer from "./Footer.jsx";
import { Link } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
        {/* Right Side - Login Form */}
        <div className="flex items-center justify-center">
          <LayoutBox className="w-full max-w-md bg-white">
            <div className="space-y-6">
              {/* Form Header */}
              <div className="text-center space-y-2">
                <div className="h-6 w-32 bg-gray-400 rounded mx-auto"><strong>Login</strong></div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <strong>Username</strong>
                  <div className="h-10 w-full bg-gray-100 rounded border-2 border-dashed border-gray-300"><input type="text" className="w-full h-full bg-transparent px-3 rounded outline-none" placeholder="Enter your username"></input></div>
                </div>
                
                <div className="space-y-2">
                  <strong>Password</strong>
                  <div className="h-10 w-full bg-gray-100 rounded border-2 border-dashed border-gray-300"><input type="password" className="w-full h-full bg-transparent px-3 rounded outline-none" placeholder="Enter your password"></input></div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded border-2 border-dashed border-gray-400"></div>
                    <p style={{marginLeft: 5 + 'px'}}>Remember Me</p>
                  </div>
                </div>

                {/* Login Button */}
                <button onClick={() => {}} className="h-10 w-full bg-gray-400 rounded text-black font-bold flex items-center justify-center"><strong>Submit</strong></button>


                {/* Divider */}
                <div className="flex items-center space-x-3">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="h-3 w-6 bg-gray-300 rounded"></div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Alternative Login Options */}
                <div className="space-y-3">
                  <button onClick={() => {}} className="h-10 w-full bg-gray-200 rounded text-gray-700 font-medium flex items-center justify-center hover:bg-gray-300 transition">Forgot Username</button>
                  <button onClick={() => {}} className="h-10 w-full bg-gray-200 rounded text-gray-700 font-medium flex items-center justify-center hover:bg-gray-300 transition">Forgot Password</button>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <div className="h-3 w-48 bg-gray-300 rounded mx-auto"></div>
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-semibold">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </LayoutBox>
        </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
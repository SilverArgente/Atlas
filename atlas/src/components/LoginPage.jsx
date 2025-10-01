import { LayoutBox } from "./LayoutBox.jsx";
import Header from "./Header";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
          <LayoutBox label="Login Form" className="w-full max-w-md bg-white">
            <div className="space-y-6">
              {/* Form Header */}
              <div className="text-center space-y-2">
                <div className="h-6 w-32 bg-gray-400 rounded mx-auto"></div>
                <div className="h-4 w-48 bg-gray-300 rounded mx-auto"></div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="h-4 w-20 bg-gray-400 rounded"></div>
                  <div className="h-10 w-full bg-gray-100 rounded border-2 border-dashed border-gray-300"></div>
                </div>
                
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-gray-400 rounded"></div>
                  <div className="h-10 w-full bg-gray-100 rounded border-2 border-dashed border-gray-300"></div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-gray-300 rounded border-2 border-dashed border-gray-400"></div>
                    <div className="h-3 w-20 bg-gray-300 rounded"></div>
                  </div>
                  <div className="h-3 w-28 bg-gray-300 rounded"></div>
                </div>

                {/* Login Button */}
                <div className="h-10 w-full bg-gray-400 rounded"></div>

                {/* Divider */}
                <div className="flex items-center space-x-3">
                  <div className="flex-1 h-px bg-gray-300"></div>
                  <div className="h-3 w-6 bg-gray-300 rounded"></div>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Alternative Login Options */}
                <div className="space-y-3">
                  <div className="h-10 w-full bg-gray-200 rounded border-2 border-dashed border-gray-300"></div>
                  <div className="h-10 w-full bg-gray-200 rounded border-2 border-dashed border-gray-300"></div>
                </div>

                {/* Sign Up Link */}
                <div className="text-center">
                  <div className="h-3 w-48 bg-gray-300 rounded mx-auto"></div>
                </div>
              </div>
            </div>
          </LayoutBox>
        </div>

      {/* Footer */}
      <LayoutBox label="Footer" className="h-16 bg-white mt-auto">
        <div className="flex items-center justify-between h-full">
          <div className="flex space-x-6">
            <div className="h-3 w-16 bg-gray-300 rounded"></div>
            <div className="h-3 w-20 bg-gray-300 rounded"></div>
            <div className="h-3 w-14 bg-gray-300 rounded"></div>
          </div>
          <div className="h-3 w-24 bg-gray-300 rounded"></div>
        </div>
      </LayoutBox>
    </div>
  );
}
import { LayoutBox } from "./LayoutBox";
import Header from "./Header";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
        <Header />
      {/* Hero Section */}
      <LayoutBox label="About Hero" className="h-64 flex items-center justify-center bg-gray-200">
        <h1 className="text-3xl font-bold">About Us</h1>
      </LayoutBox>

      {/* Content Section */}
      <LayoutBox label="About Content" className="p-8">
        <div className="space-y-4 text-gray-700">
          <p>
            Atlas is a platform dedicated to making things easier for students and professionals.
          </p>
          <p>
            Our mission is to provide powerful yet simple tools to organize, learn, and grow.
          </p>
        </div>
      </LayoutBox>

      {/* Footer */}
      <LayoutBox label="Footer" className="h-32 mt-8">
        <p className="text-center text-gray-500">© 2025 Atlas. All rights reserved.</p>
      </LayoutBox>
    </div>
  );
}

import { LayoutBox } from "./LayoutBox";
import Header from "./Header";
import classroom from "../assets/classroom.png"
import Footer from "./Footer";

export default function About() {
  return (
    <div className="min-h-screen bg-white">
        <Header />
      {/* Hero Section */}
      <LayoutBox label="About Hero" className="h-64 flex items-center justify-center bg-gray-200">
        <img src={classroom} alt="About Us" className="absolute inset-0 w-full h-full object-cover"/>
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
      <Footer />
    </div>
  );
}

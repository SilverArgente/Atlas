import { LayoutBox } from "./LayoutBox";
import Header from "./Header";
import Footer from "./Footer.jsx";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
        <Header />
      <LayoutBox label="Contact Hero" className="h-64 flex items-center justify-center bg-gray-200">
        <h1 className="text-3xl font-bold">Contact Us</h1>
      </LayoutBox>

      {/* Contact Form Section */}
      <LayoutBox label="Contact Form" className="p-8">
        <form className="max-w-md mx-auto space-y-4">
          <input 
            type="text" 
            placeholder="Your Name" 
            className="w-full border rounded px-3 py-2"
          />
          <input 
            type="email" 
            placeholder="Your Email" 
            className="w-full border rounded px-3 py-2"
          />
          <textarea 
            placeholder="Your Message" 
            className="w-full border rounded px-3 py-2 h-32"
          />
          <button 
            type="submit" 
            className="w-full bg-gray-600 text-white py-2 rounded"
          >
            Send
          </button>
        </form>
      </LayoutBox>

      {/* Footer */}
      <Footer />
    </div>
  );
}

import Header from "./Header";
import Footer from "./Footer.jsx";

export default function Contact() {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      {/* Page Title */}
      <div className="text-center mt-12 mb-10">
        <h1 className="text-4xl font-extrabold tracking-wide text-white">
          Contact Us
        </h1>
        <p className="text-gray-300 mt-3 text-lg">
          Have questions? We're here to help.
        </p>
      </div>

      {/* Contact Form */}
      <div className="flex justify-center px-6 mb-16">
        <form className="max-w-lg w-full space-y-6 bg-black p-8 border border-gray-700 rounded-xl shadow-lg">

          <input
            type="email"
            placeholder="Your Email"
            className="w-full bg-black border border-gray-600 text-white rounded px-4 py-2 focus:outline-none focus:border-white transition"
          />

          <textarea
            placeholder="Your Message"
            className="w-full bg-black border border-gray-600 text-white rounded px-4 py-3 h-32 resize-none focus:outline-none focus:border-white transition"
          />

          <button
            type="submit"
            className="w-full bg-white text-black font-bold py-3 rounded-md shadow-md hover:bg-gray-200 transition"
          >
            Send Message
          </button>

        </form>
      </div>

      <Footer />
    </div>
  );
}

import Header from "./Header";
import Footer from "./Footer";
import { useNavigate } from 'react-router-dom';

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      {/* Content Section */}
      <div className="flex flex-col items-center justify-center px-6 py-16 text-white">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-4xl font-extrabold tracking-wide">About Atlas</h1>

          <p className="text-lg leading-relaxed">
            Atlas is a cutting-edge platform designed to make sharing concept maps easier between individuals.
          </p>

          <p className="text-lg leading-relaxed">
            Concept maps are essential tools for students to consolidate learning. They help organize information, identify key ideas, and strengthen understanding.
          </p>

          <p className="text-lg leading-relaxed">
            We found it difficult to share concept maps for specific classes or topics, so we built Atlas to solve that problem.
          </p>

          <p className="text-lg leading-relaxed">
            Our mission is to empower students with a centralized hub for high-quality materials—fostering collaboration and academic success.
          </p>

          {/* Centered button */}
          <button
            onClick={() => navigate("/signup")}
            className="mt-6 px-8 py-3 bg-white text-black font-bold rounded-md shadow-md hover:bg-gray-200 transition self-center"
          >
            Try Now
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

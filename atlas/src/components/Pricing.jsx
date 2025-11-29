import Header from "./Header";
import Footer from "./Footer.jsx";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      {/* Page Title */}
      <div className="text-center mt-12 mb-10">
        <h1 className="text-4xl font-extrabold tracking-wide text-white">
          Pricing
        </h1>
        <p className="text-gray-300 mt-3 text-lg">
          Simple, transparent pricing for everyone.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="flex justify-center px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full">

          {["Free", "Premium"].map((plan, idx) => (
            <div
              key={idx}
              className="border border-gray-700 rounded-xl p-8 text-center space-y-6 bg-black shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-bold text-white">{plan}</h2>

              <p className="text-4xl font-extrabold text-white">
                {idx === 0 ? "$0" : "$10"}
                <span className="text-lg font-medium text-gray-400">/mo</span>
              </p>

              <ul className="space-y-2 text-gray-300">
                <li>✔ Feature 1</li>
                <li>✔ Feature 2</li>
                <li>✔ Feature 3</li>
              </ul>

              <button
                onClick={() => navigate("/contact")}
                className="mt-4 w-full py-3 bg-white text-black font-bold rounded-md hover:bg-gray-200 transition"
              >
                Choose {plan}
              </button>
            </div>
          ))}

        </div>
      </div>

      <Footer />
    </div>
  );
}

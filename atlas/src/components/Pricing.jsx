import Header from "./Header";
import Footer from "./Footer.jsx";
import { useNavigate } from "react-router-dom";

export default function Pricing() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: [
        "✔ Up to 5 Mind Maps Saved",
        "✔ Up to 1GB Map Size",
        "✔ Basic Export Options",
      ],
      buttonLabel: "Get Started",
      buttonColor: "bg-gray-700 text-white hover:bg-gray-600",
    },
    {
      name: "Premium",
      price: "$10",
      features: [
        "✔ Unlimited Mind Maps",
        "✔ Unlimited Map Size",
        "✔ Priority Support",
      ],
      buttonLabel: "Upgrade Now",
      buttonColor: "bg-white text-black hover:bg-gray-200",
    },
  ];

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

          {plans.map((plan, idx) => (
            <div
              key={idx}
              className="border border-gray-700 rounded-xl p-8 text-center space-y-6 bg-black shadow-lg hover:shadow-xl transition-shadow"
            >
              <h2 className="text-2xl font-bold text-white">{plan.name}</h2>

              <p className="text-4xl font-extrabold text-white">
                {plan.price}
                <span className="text-lg font-medium text-gray-400">/mo</span>
              </p>

              <ul className="space-y-2 text-gray-300">
                {plan.features.map((f, i) => (
                  <li key={i}>{f}</li>
                ))}
              </ul>

              <button
                onClick={() => navigate("/contact")}
                className={`mt-4 w-full py-3 font-bold rounded-md transition ${plan.buttonColor}`}
              >
                {plan.buttonLabel}
              </button>
            </div>
          ))}

        </div>
      </div>

      <Footer />
    </div>
  );
}

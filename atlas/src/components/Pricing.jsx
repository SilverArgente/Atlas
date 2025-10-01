import { LayoutBox } from "./LayoutBox";
import Header from "./Header";
import Footer from "./Footer.jsx";

export default function Pricing() {
  return (
    <div className="min-h-screen bg-white">
        <Header />
      {/* Hero Section */}
      <LayoutBox label="Pricing Hero" className="h-64 flex items-center justify-center bg-gray-200">
        <h1 className="text-3xl font-bold">Pricing</h1>
      </LayoutBox>

      {/* Pricing Options Section */}
      <LayoutBox label="Pricing Options" className="p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {["Basic", "Pro", "Enterprise"].map((plan, idx) => (
            <div key={idx} className="border rounded p-6 text-center space-y-4">
              <h2 className="text-xl font-bold">{plan}</h2>
              <p className="text-2xl font-semibold">$ {idx * 20 + 10}/mo</p>
              <ul className="space-y-2 text-gray-600">
                <li>✔ Feature 1</li>
                <li>✔ Feature 2</li>
                <li>✔ Feature 3</li>
              </ul>
              <button className="w-full bg-gray-600 text-white py-2 rounded">
                Choose {plan}
              </button>
            </div>
          ))}
        </div>
      </LayoutBox>

      {/* Footer */}
      <Footer />
    </div>
  );
}

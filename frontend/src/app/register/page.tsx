"use client";

import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* LEFT BRAND SECTION */}
        <div className="hidden md:flex flex-col justify-center bg-black text-white p-10">
          <h1 className="text-4xl font-bold mb-4">VAAS ID</h1>
          <p className="text-gray-300 text-sm leading-relaxed">
            A secure identity verification platform for gig workers.
            Verified once. Trusted everywhere.
          </p>

          <ul className="mt-8 space-y-3 text-sm">
            <li>✔ One-time identity verification</li>
            <li>✔ Reusable across platforms</li>
            <li>✔ Secure & privacy-first</li>
          </ul>
        </div>

        {/* RIGHT FORM SECTION */}
        <div className="p-8 md:p-12">
          <RegisterForm />
        </div>

      </div>
    </main>
  );
}

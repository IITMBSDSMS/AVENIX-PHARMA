import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "Privacy Policy — Patient Data Security Standards",
  description: "Read Avenix Pharmaceuticals' privacy policy. Learn about patient data confidentiality, secure 256-bit encryption for prescriptions, and compliance with Indian digital health guidelines.",
  keywords: ["Avenix privacy policy", "medical data privacy", "prescription security standards"],
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-white py-12 sm:py-16 md:py-20 text-left">
        <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="border-b border-gray-150 pb-6 space-y-2">
            <span className="text-[10px] font-black text-[#FF6B00] uppercase tracking-widest">Security Compliance</span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#0F2C59] tracking-tight">Privacy Policy</h1>
            <p className="text-xs text-gray-400 font-bold">Last Updated: May 26, 2026</p>
          </div>

          <div className="space-y-8 text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
            <div className="space-y-3">
              <h2 className="text-lg font-black text-gray-900">1. Information Collection</h2>
              <p>
                Avenix Pharmaceuticals Private Limited collects patient email addresses, delivery coordinates, billing details, and submitted prescription files to complete order fulfillment. We do not inspect or catalog any personal medical files beyond the requirements of clinical verification by our panel of registered pharmacists.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-black text-gray-900">2. Secure Prescription & Telemetry Data Handling</h2>
              <p>
                All uploaded prescriptions and clinical triage data are stored in verified database vaults encrypted with AES-256 standard. Triage telemetry metrics simulated or recorded during teleconsultation video calls are protected by secure peer-to-peer (P2P) transport channels, preventing unauthorized access by third parties.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-black text-gray-900">3. Sharing Protocols</h2>
              <p>
                We do not sell, rent, or trade patient identifiers with external advertisers. Patient data is only shared with NABL-accredited diagnostic labs and NMC-certified consulting doctors specifically authorized to carry out requested lab tests or video teleconsultations.
              </p>
            </div>

            <div className="space-y-3">
              <h2 className="text-lg font-black text-gray-900">4. Cookies and Session Controls</h2>
              <p>
                Our platform uses secure HTTP-only cookies (`avx_auth_token`) to manage portal authentication sessions. These session identifiers are encrypted dynamically using HS256 signatures, preventing client-side script interception and cross-site scripting (XSS) risks.
              </p>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

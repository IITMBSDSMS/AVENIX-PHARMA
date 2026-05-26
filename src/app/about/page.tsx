import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ShieldCheck, Target, Award, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us — India's Intelligent Online Pharmacy",
  description: "Learn about Avenix Pharmaceuticals, India's leading digital healthcare platform with AI-driven prescription verification, NABL-certified lab services, and CDSCO-compliant inventory.",
  keywords: ["about Avenix", "Avenix pharmaceuticals", "clinical intelligence pharmacy", "NABL certified labs"],
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow bg-white py-12 md:py-20">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-10 space-y-16">
          
          {/* Hero Header Banner */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-[#0F2C59] tracking-tight">
              Leading the <span className="text-[#FF6B00]">Healthcare</span> Revolution
            </h1>
            <p className="text-base sm:text-lg text-gray-500 font-bold leading-relaxed">
              At Avenix Pharmaceuticals, we bridge the gap between advanced clinical intelligence, certified authentication, and immediate patient care.
            </p>
          </div>

          {/* Grids showing values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { title: "NABL Laboratories", desc: "All medical checkups are processed via NABL-accredited diagnostic labs to guarantee clinical report precision.", icon: Award, color: "bg-blue-50 text-blue-600 border-blue-100" },
              { title: "CDSCO Compliant", desc: "Our warehousing and distribution operations comply fully with the Drugs and Cosmetics Act directives.", icon: ShieldCheck, color: "bg-emerald-50 text-emerald-600 border-emerald-100" },
              { title: "Clinical AI Integrity", desc: "From handwritten prescription scanning to symptom screening, our neural models provide instant guidance.", icon: Target, color: "bg-purple-50 text-purple-600 border-purple-100" },
              { title: "Expert Care Teams", desc: "Our verified panel of NMC-certified doctors and registered pharmacists provide 24/7 teleconsulting support.", icon: Users, color: "bg-orange-50 text-[#FF6B00] border-orange-100" }
            ].map((value) => (
              <div key={value.title} className={`p-6 border rounded-2xl ${value.color} flex flex-col space-y-4 shadow-sm hover:scale-[1.02] transition-transform`}>
                <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center shadow-xs">
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-black text-gray-900 leading-tight">{value.title}</h3>
                <p className="text-xs leading-relaxed text-gray-500 font-semibold">{value.desc}</p>
              </div>
            ))}
          </div>

          {/* Rich content section */}
          <div className="bg-[#FFF8F5] border border-[#FFE6DE] rounded-3xl p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6 text-left">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F2C59]">Our Mission & Vision</h2>
              <div className="space-y-4 text-xs sm:text-sm text-gray-500 font-semibold leading-relaxed">
                <p>
                  Launched in 2026, Avenix Pharmaceuticals set out to solve the critical challenges of counterfeit drug circulation, delayed diagnostics, and inaccessible specialist guidance across India. By utilizing secure ledger tracing and state-of-the-art vision models, we verify every single medicine batch code from source to consumer.
                </p>
                <p>
                  We believe that modern technology should simplify healthcare without sacrificing compliance. Every order on our platform is scrutinized by a registered pharmacist, and every video call connects directly to a verified medical practitioner.
                </p>
              </div>
            </div>
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[400px] h-[300px] rounded-2xl overflow-hidden border border-gray-100 shadow-md">
                <img 
                  src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=800" 
                  alt="Avenix clinical diagnostics laboratory" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F2C59]/65 to-transparent" />
                <span className="absolute bottom-4 left-4 text-white text-xs font-black uppercase tracking-wider">Avenix Apex Laboratory</span>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

"use client";


import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState } from "@/context/AppState";
import { 
  ShieldCheck, AlertTriangle, Cpu, Layers, HelpCircle, 
  Check, QrCode, Search, Award, CheckCircle2 
} from "lucide-react";

export default function VerifyPageClient() {
  const { verifyAuthenticity } = useAppState();
  
  const [batchCode, setBatchCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [validatedData, setValidatedData] = useState<any>(null);

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!batchCode.trim()) return;

    setIsValidating(true);
    setValidatedData(null);

    // Simulate cryptographic validation handshake
    setTimeout(() => {
      setIsValidating(false);
      const res = verifyAuthenticity(batchCode);
      setValidatedData(res);
    }, 1500);
  };

  const loadDemoCode = (code: string) => {
    setBatchCode(code);
    setValidatedData(null);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow medical-grid py-10">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-brand-orange">
              Cryptographic Trust
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
              Authenticity Verification
            </h1>
            <p className="text-xs text-gray-500">
              Query Avenix blockchain supply-chain registries to verify pharmaceutical authenticity, manufacturer compliance, and expiration safety.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Code Input & Instructions (Col-Span 5) */}
            <div className="lg:col-span-5 space-y-5">
              
              <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-lg glass-card relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-orange" />
                
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <QrCode className="h-4 w-4 text-brand-orange" />
                  Verifiable Supply Ledger
                </h3>

                <form onSubmit={handleVerify} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Enter Barcode / Batch Code
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search className="h-4 w-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={batchCode}
                        onChange={(e) => setBatchCode(e.target.value)}
                        placeholder="e.g. AVX-90812-GEN"
                        className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 focus:border-brand-orange focus:outline-none rounded-xl text-xs text-brand-dark"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isValidating || !batchCode}
                    className="w-full py-3 bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-orange/15 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {isValidating ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Verify Cryptographic Hash
                        <Cpu className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Demo Codes List */}
                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                  <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block">
                    Verify Demo Batches
                  </span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => loadDemoCode("AVX-90812-GEN")}
                      className="px-2.5 py-1 text-[9px] font-bold rounded-lg bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 transition-all cursor-pointer"
                    >
                      AVX-90812-GEN (Verified Cipla)
                    </button>
                    <button
                      onClick={() => loadDemoCode("AVX-80122-MCR")}
                      className="px-2.5 py-1 text-[9px] font-bold rounded-lg bg-brand-orange/10 text-brand-orange hover:bg-brand-orange/20 transition-all cursor-pointer"
                    >
                      AVX-80122-MCR (Verified MicroLabs)
                    </button>
                    <button
                      onClick={() => loadDemoCode("AVX-BAD-CODE")}
                      className="px-2.5 py-1 text-[9px] font-bold rounded-lg bg-red-50 text-red-500 hover:bg-red-100/55 transition-all cursor-pointer"
                    >
                      AVX-BAD-CODE (Suspicious)
                    </button>
                  </div>
                </div>

              </div>

              {/* Trust badges explanations */}
              <div className="bg-gray-50 border border-gray-200/80 p-4.5 rounded-2xl space-y-3">
                <h4 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                  <HelpCircle className="h-3.5 w-3.5 text-gray-400" />
                  What is Avenix Authenticity?
                </h4>
                <p className="text-[10px] text-gray-400 leading-relaxed font-medium">
                  We assign every pharmaceutical box a cryptographic ledger tag at partner warehouses. Any mismatch flags security systems, ensuring 100% safety.
                </p>
              </div>

            </div>

            {/* Right Column: Scan results with animated verification seal (Col-Span 7) */}
            <div className="lg:col-span-7">
              {isValidating ? (
                <div className="h-80 bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 shadow-lg glass-card">
                  <div className="relative flex items-center justify-center">
                    <div className="h-16 w-16 rounded-full border-4 border-brand-orange/20 border-t-brand-orange animate-spin" />
                    <ShieldCheck className="h-6 w-6 text-brand-orange absolute animate-pulse" />
                  </div>
                  <p className="text-xs font-bold text-gray-600 mt-4">Connecting to Blockchain Nodes...</p>
                  <p className="text-[9px] text-gray-400">Verifying secure supply certificates and manufacturing records.</p>
                </div>
              ) : validatedData ? (
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xl glass-card space-y-6 relative overflow-hidden">
                  
                  {/* Glowing orange check icon in corner */}
                  <div className="absolute -top-12 -right-12 h-28 w-28 bg-brand-orange/5 rounded-full flex items-center justify-center">
                    <ShieldCheck className="h-10 w-10 text-brand-orange/20" />
                  </div>

                  {/* Verification Shield Animation */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 pb-4 border-b border-gray-100">
                    <div className="relative">
                      {validatedData.valid ? (
                        <div className="h-14 w-14 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center text-green-600 animate-glow">
                          <Award className="h-7 w-7" />
                        </div>
                      ) : (
                        <div className="h-14 w-14 rounded-full bg-red-500/10 border-2 border-red-500 flex items-center justify-center text-red-500">
                          <AlertTriangle className="h-7 w-7" />
                        </div>
                      )}
                    </div>

                    <div className="text-center sm:text-left space-y-0.5">
                      <span className={`text-[8.5px] font-extrabold uppercase tracking-widest ${
                        validatedData.valid ? "text-green-600" : "text-red-500"
                      }`}>
                        {validatedData.valid ? "Verified Authentic Batch" : "Authenticity Warning"}
                      </span>
                      <h2 className="text-md font-extrabold text-brand-dark">
                        {validatedData.valid ? "Avenix Certified Pharmaceutical" : "Suspicious Batch Identifier"}
                      </h2>
                    </div>
                  </div>

                  {/* Batch details dashboard */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <span className="text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider block mb-0.5">
                        Manufacturer
                      </span>
                      <span className="text-xs font-bold text-gray-700">{validatedData.manufacturer}</span>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <span className="text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider block mb-0.5">
                        Expiry Date Status
                      </span>
                      <span className="text-xs font-bold text-gray-700">{validatedData.expiryDate}</span>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <span className="text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider block mb-0.5">
                        Batch Identifier
                      </span>
                      <span className="text-xs font-mono font-bold text-brand-orange">{validatedData.batchNo}</span>
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-100 rounded-xl">
                      <span className="text-[8.5px] text-gray-400 font-extrabold uppercase tracking-wider block mb-0.5">
                        Authenticity Index
                      </span>
                      <span className={`text-xs font-black ${validatedData.valid ? "text-green-600" : "text-red-500"}`}>
                        {validatedData.safetyScore}%
                      </span>
                    </div>
                  </div>

                  {/* Notes & ledger signatures */}
                  <div className={`p-4 rounded-xl border text-[10px] leading-relaxed font-semibold ${
                    validatedData.valid 
                      ? "bg-green-50/20 border-green-200 text-green-700" 
                      : "bg-red-50/20 border-red-200 text-red-600"
                  }`}>
                    {validatedData.notes}
                  </div>

                  {validatedData.valid && (
                    <div className="flex items-center gap-1.5 justify-center pt-2 text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />
                      Supply Chain Log Encrypted
                    </div>
                  )}

                </div>
              ) : (
                <div className="h-80 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-white glass-card">
                  <ShieldCheck className="h-12 w-12 text-gray-300 mb-2 animate-pulse" />
                  <p className="text-xs font-bold text-gray-600">Verification Engine Offline</p>
                  <p className="text-[10px] text-gray-400 max-w-sm">
                    Submit a pharmaceutical batch identifier from your packet to query national medical ledger ledgers and safety indicators.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

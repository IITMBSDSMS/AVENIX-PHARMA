"use client";

import React, { useState, useEffect } from "react";
import HealixSOSOverlay from "./HealixSOSOverlay";
import { Activity } from "lucide-react";

export default function HealixSOSWrapper() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Listen for custom trigger event to open the SOS system globally
    const handleOpenSos = () => setIsOpen(true);
    window.addEventListener("open-healix-sos", handleOpenSos);
    return () => {
      window.removeEventListener("open-healix-sos", handleOpenSos);
    };
  }, []);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Circular SOS Button - Bottom Right */}
      <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
        
        {/* Subtext tooltip appearing above/adjacent on hover */}
        <div className="mb-2 bg-black/90 border border-red-500/30 text-white text-[9.5px] font-black uppercase px-3 py-1.5 rounded-lg shadow-xl tracking-wider opacity-0 hover:opacity-100 focus-within:opacity-100 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap text-center max-w-[200px] leading-relaxed hidden sm:block">
          <span className="text-red-500 font-extrabold block">Immediate Life Support</span>
          <span className="text-gray-400 font-semibold">Guidance + Smart Dispatch</span>
        </div>

        <button
          onClick={() => setIsOpen(true)}
          className="relative h-16 w-16 rounded-full flex flex-col items-center justify-center text-white cursor-pointer select-none active:scale-95 transition-all duration-300 bg-red-700/80 backdrop-blur-md border border-red-500/70 shadow-lg group"
          style={{
            boxShadow: "0 0 20px rgba(220, 38, 38, 0.4)",
            animation: "heartbeat-glow 1.5s ease-in-out infinite"
          }}
          aria-label="Open Emergency SOS Panel"
        >
          {/* Biometric Rippling Rings expanding outwards */}
          <span className="absolute inset-0 rounded-full border border-red-500/40 animate-biometric-ripple -z-10" />
          <span className="absolute inset-0 rounded-full border border-red-500/20 animate-biometric-ripple -z-10" style={{ animationDelay: "0.6s" }} />
          <span className="absolute inset-0 rounded-full border border-red-500/10 animate-biometric-ripple -z-10" style={{ animationDelay: "1.2s" }} />

          {/* ECG/Pulse Icon in Center */}
          <Activity className="h-5 w-5 text-white animate-pulse" />
          
          <span className="text-[7.5px] font-black uppercase tracking-widest mt-1 text-white font-poppins">
            SOS
          </span>

          {/* Subtle Orange branding line */}
          <span className="absolute bottom-1 h-0.5 w-4 bg-orange-500 rounded" />
        </button>

        {/* Small label for mobile responsiveness */}
        <span className="text-[7.5px] font-black uppercase text-red-500 tracking-wider mt-1 bg-black/80 px-2 py-0.5 rounded border border-white/5 sm:hidden">
          Emergency SOS
        </span>
      </div>

      {/* Screen Overlay Modal */}
      <HealixSOSOverlay isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function SplashScreen() {
  const [isVisible, setIsVisible] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    // Check if splash screen has already been shown in this session
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setIsVisible(false);
      return;
    }

    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      sessionStorage.setItem("hasSeenSplash", "true");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(15px)", scale: 1.03 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-[#070A13] text-white overflow-hidden"
        >
          {/* Ambient Glowing Orbs */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.15, 0.25, 0.15] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute rounded-full bg-[#FF6B00] w-[500px] h-[500px] blur-[120px] pointer-events-none -top-40 -left-40 z-0"
          />
          <motion.div 
            initial={{ scale: 1, opacity: 0 }}
            animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute rounded-full bg-blue-600/30 w-[600px] h-[600px] blur-[140px] pointer-events-none -bottom-40 -right-40 z-0"
          />
          
          <div className="relative z-10 flex flex-col items-center">
            {/* Typography Logo Animation */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.8, ease: "easeOut" }}
              className="text-center flex flex-col items-center"
            >
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight font-poppins flex items-center leading-none select-none">
                <span className="text-white">AVENIX</span>
                <span className="text-[#FF6B00] ml-1 drop-shadow-[0_0_12px_rgba(255,107,0,0.5)]">X</span>
              </h1>
              <p className="text-[9px] sm:text-[10.5px] font-black tracking-[0.38em] sm:tracking-[0.44em] uppercase text-gray-400 font-mono mt-2 select-none">
                PHARMACEUTICALS
              </p>
            </motion.div>

            {/* Loading Progress Bar */}
            <motion.div 
              className="w-48 h-1 bg-white/10 mt-10 rounded-full overflow-hidden border border-white/5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-[#FF8533] to-[#FF6B00] rounded-full shadow-[0_0_10px_rgba(255,107,0,0.6)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

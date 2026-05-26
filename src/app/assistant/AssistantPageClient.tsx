"use client";


import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState } from "@/context/AppState";
import { 
  Send, Sparkles, User, AlertTriangle, ShieldCheck, 
  HelpCircle, ChevronRight, Activity, Calendar, Zap 
} from "lucide-react";

export default function AssistantPageClient() {
  const { chatHistory, sendChatMessage } = useAppState();
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const presets = [
    "I have fever and weakness",
    "I feel acute chest pain and breathlessness",
    "Acidity and stomach gas issues",
    "What are Metformin side effects?"
  ];

  // Scroll chat window to bottom
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory, isTyping]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userText = input;
    setInput("");
    setIsTyping(true);

    sendChatMessage(userText);
    
    // Simulate AI thinking delay
    setTimeout(() => {
      setIsTyping(false);
    }, 1200);
  };

  const handlePresetClick = (text: string) => {
    setIsTyping(true);
    sendChatMessage(text);
    setTimeout(() => {
      setIsTyping(false);
    }, 1200);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "High": return "bg-red-50 text-red-600 border border-red-200";
      case "Moderate": return "bg-amber-50 text-amber-600 border border-amber-200";
      case "Low": return "bg-green-50 text-green-600 border border-green-200";
      default: return "bg-gray-50 text-gray-500";
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow medical-grid py-8 flex flex-col justify-between">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col">
          
          {/* Header Info */}
          <div className="text-center max-w-xl mx-auto space-y-2 mb-6">
            <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-brand-orange">
              Clinical Intelligence
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
              AI Health Assistant
            </h1>
            <p className="text-xs text-gray-500">
              Instant medical triage. Type symptoms or drug names. Get immediate safety scores, generic recommendations, and referral bookings.
            </p>
          </div>

          {/* Chat Panel */}
          <div className="bg-white border border-gray-200 rounded-3xl shadow-xl glass-card flex-grow flex flex-col overflow-hidden h-[500px] relative">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-orange" />
            
            {/* Active AI Status header */}
            <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center space-x-2">
                <div className="relative flex h-3 w-3 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </div>
                <span className="text-[10px] font-bold text-gray-600 uppercase tracking-wider">
                  Avenix Bio-AI Doctor Active
                </span>
              </div>
              <span className="text-[9px] font-bold text-gray-400 bg-white border border-gray-200 px-2.5 py-0.5 rounded-full">
                Disclaimer: AI advice is informational
              </span>
            </div>

            {/* Message Area */}
            <div className="flex-grow overflow-y-auto p-5 space-y-4">
              {chatHistory.map((msg) => {
                const isAI = msg.sender === "ai";
                return (
                  <div
                    key={msg.id}
                    className={`flex items-start gap-3 ${isAI ? "justify-start" : "justify-end"}`}
                  >
                    {isAI && (
                      <div className="h-7 w-7 rounded-lg bg-brand-orange/10 border border-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <Sparkles className="h-4 w-4" />
                      </div>
                    )}

                    <div className="space-y-2 max-w-[80%]">
                      {/* Text Bubble */}
                      <div className={`p-3.5 rounded-2xl text-xs leading-relaxed ${
                        isAI 
                          ? "bg-gray-50 border border-gray-150 text-gray-700 rounded-tl-sm" 
                          : "bg-brand-orange text-white rounded-tr-sm shadow-md shadow-brand-orange/10"
                      }`}>
                        {msg.text}
                      </div>

                      {/* AI Diagnostic Triage Details (Urgency score & Safe medicines) */}
                      {isAI && (msg.urgencyScore || msg.recommendations) && (
                        <div className="bg-white border border-gray-100 rounded-xl p-3.5 shadow-sm space-y-3">
                          
                          {/* Urgency Score */}
                          {msg.urgencyScore && (
                            <div className="flex items-center justify-between">
                              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide">
                                Clinical Triage Level
                              </span>
                              <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                                getUrgencyColor(msg.urgencyScore)
                              }`}>
                                {msg.urgencyScore} Urgency
                              </span>
                            </div>
                          )}

                          {/* Safe Recommendations */}
                          {msg.recommendations && msg.recommendations.length > 0 && (
                            <div className="space-y-1.5">
                              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide block">
                                Safe Generic Guidelines
                              </span>
                              <div className="space-y-1">
                                {msg.recommendations.map((rec, i) => (
                                  <div key={i} className="text-[10px] text-gray-600 font-semibold flex items-start gap-1">
                                    <ShieldCheck className="h-3.5 w-3.5 text-green-500 shrink-0 mt-0.5" />
                                    {rec}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Emergency Actions or Referrals */}
                          <div className="flex gap-2 pt-1 border-t border-gray-50">
                            {msg.urgencyScore === "High" ? (
                              <Link
                                href="/emergency"
                                className="flex-1 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-center text-[9px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Zap className="h-3 w-3 animate-bounce" />
                                Dispatch Ambulance Now
                              </Link>
                            ) : msg.referralNeeded ? (
                              <Link
                                href="/doctors"
                                className="flex-1 py-1.5 bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange text-center text-[9px] font-bold rounded-lg transition-all flex items-center justify-center gap-1 cursor-pointer"
                              >
                                <Calendar className="h-3 w-3" />
                                Consult Doctor Panel
                              </Link>
                            ) : null}
                          </div>

                        </div>
                      )}
                    </div>

                    {!isAI && (
                      <div className="h-7 w-7 rounded-lg bg-brand-dark text-white flex items-center justify-center shrink-0 mt-0.5">
                        <User className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex items-start gap-3 justify-start">
                  <div className="h-7 w-7 rounded-lg bg-brand-orange/10 border border-brand-orange/15 text-brand-orange flex items-center justify-center shrink-0 mt-0.5">
                    <Sparkles className="h-4 w-4 animate-spin" />
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-150 rounded-2xl rounded-tl-sm text-xs text-gray-400 flex items-center space-x-1">
                    <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1 h-1 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              
              <div ref={scrollRef} />
            </div>

            {/* Preset Toggles */}
            <div className="p-3 border-t border-gray-150 bg-gray-50/50 flex flex-wrap gap-2 items-center">
              <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide">
                Presets:
              </span>
              {presets.map((p, i) => (
                <button
                  key={i}
                  disabled={isTyping}
                  onClick={() => handlePresetClick(p)}
                  className="px-2.5 py-1 text-[9px] font-bold rounded-full bg-white hover:bg-brand-orange/10 hover:text-brand-orange border border-gray-200 hover:border-brand-orange/20 transition-all text-gray-600 cursor-pointer disabled:opacity-50 truncate max-w-[200px]"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSend} className="p-3 border-t border-gray-150 bg-white flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms (e.g. 'I have a high fever since morning')..."
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-orange focus:outline-none px-4 py-2.5 rounded-xl text-xs text-brand-dark"
              />
              <button
                type="submit"
                disabled={isTyping || !input.trim()}
                className="p-2.5 rounded-xl bg-brand-orange hover:bg-brand-orange-light text-white transition-all shadow-md shadow-brand-orange/10 cursor-pointer disabled:opacity-50 shrink-0"
              >
                <Send className="h-4.5 w-4.5" />
              </button>
            </form>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

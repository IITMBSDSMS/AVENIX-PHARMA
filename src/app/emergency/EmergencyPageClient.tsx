"use client";


import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState } from "@/context/AppState";
import { 
  Flame, MapPin, Truck, ShieldCheck, PhoneCall, 
  Map, Navigation, Clock, AlertTriangle, AlertCircle, XCircle 
} from "lucide-react";

export default function EmergencyPageClient() {
  const { 
    emergencyActive, emergencyETA, emergencyStep, 
    emergencyCourierGPS, triggerEmergencyDelivery, cancelEmergency 
  } = useAppState();

  const [address, setAddress] = useState("");
  const [addressSaved, setAddressSaved] = useState("");

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const getStepText = (step: number) => {
    switch (step) {
      case 1: return "Priority Dispatching...";
      case 2: return "Couriers Assigned (Rider Rahul Kumar)";
      case 3: return "Courier on the Way (Thermal Secured Box)";
      case 4: return "Courier Arrived (At your Gate)";
      default: return "Idle";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) return;
    setAddressSaved(address);
    triggerEmergencyDelivery(address);
  };

  // Coordinates mapping to draw a mock route on an SVG
  // Delhi coordinates are roughly Lat: 28.61, Lng: 77.20.
  // We can calculate offset of courier relative to base coordinates to draw a moving dot.
  const routePoints = [
    { x: 30, y: 70 },  // Assigned Pharmacy
    { x: 80, y: 30 },  // Customer Home
  ];

  // Calculate percentage progress of rider along the line
  const timeElapsed = 600 - emergencyETA; // 600 seconds total
  const progressPercent = Math.min((timeElapsed / 600) * 100, 100);

  // Linear interpolation for courier position on SVG
  const courierX = routePoints[0].x + (routePoints[1].x - routePoints[0].x) * (progressPercent / 100);
  const courierY = routePoints[0].y + (routePoints[1].y - routePoints[0].y) * (progressPercent / 100);

  return (
    <>
      <Navbar />

      <main className="flex-grow medical-grid py-10">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-red-500">
              Critical Response
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
              Emergency Delivery Mode
            </h1>
            <p className="text-xs text-gray-500">
              Immediate life-saving medicine routing. Our dispatch network bypasses standard queues, offering guaranteed 10-minute home courier arrival.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Action Control Column (Col-Span 5) */}
            <div className="lg:col-span-5 space-y-5">
              
              {!emergencyActive ? (
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xl glass-card space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-600" />
                  
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-red-600 animate-pulse" />
                    Emergency Dispatch Controller
                  </h3>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                        Delivery GPS Address Location
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. Flat 302, Palm Heights, Sector 45, Noida"
                          className="w-full pl-9 pr-4 py-3 bg-gray-50 border border-gray-200 focus:border-red-500 focus:outline-none rounded-xl text-xs text-brand-dark"
                        />
                      </div>
                    </div>

                    {/* Massive Pulse Button */}
                    <button
                      type="submit"
                      className="w-full relative py-6 bg-red-600 hover:bg-red-700 text-white font-extrabold rounded-2xl transition-all duration-300 shadow-xl shadow-red-600/30 flex flex-col items-center justify-center cursor-pointer group overflow-hidden"
                    >
                      {/* Pulsing ring background */}
                      <span className="absolute inset-0 w-full h-full rounded-2xl bg-red-500/25 animate-ping opacity-70 group-hover:scale-105 transition-transform" />
                      
                      <div className="relative flex items-center gap-2">
                        <Flame className="h-6 w-6 text-white fill-white animate-bounce" />
                        <span className="text-sm tracking-widest uppercase">DELIVER NOW</span>
                      </div>
                      <span className="relative text-[8.5px] font-semibold text-red-200 mt-1 uppercase tracking-wider">
                        Triggers Instant Pharmacy Courier Allocation
                      </span>
                    </button>
                  </form>

                  <div className="p-3.5 bg-amber-50/50 border border-amber-200 text-amber-800 rounded-xl flex items-start gap-2">
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 text-amber-600 mt-0.5" />
                    <p className="text-[9.5px] leading-relaxed font-semibold">
                      This service is dedicated to critical clinical needs (e.g. Asthma inhalers, insulin kits, heart pills). False triggers may result in platform penalties.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-xl glass-card space-y-5 relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-600 animate-pulse" />

                  {/* Dispatching state details */}
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[9px] font-bold text-red-500 uppercase tracking-widest animate-pulse">
                        Priority Dispatch Active
                      </span>
                      <h4 className="text-xs font-black text-gray-900">
                        {getStepText(emergencyStep)}
                      </h4>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                      <Truck className="h-4.5 w-4.5 animate-bounce" />
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  <div className="p-5 bg-red-500 text-white rounded-2xl text-center shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1.5 bg-black/15 overflow-hidden">
                      <div 
                        className="bg-white h-full transition-all duration-1000" 
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                    
                    <span className="text-[9px] font-extrabold uppercase tracking-widest text-red-100 block mb-1">
                      Guaranteed Arrival In
                    </span>
                    <span className="text-4xl font-mono font-black tracking-tight block">
                      {formatTime(emergencyETA)}
                    </span>
                    <span className="text-[8px] font-bold text-red-200 uppercase tracking-wider block mt-1">
                      Target Time Limit: 10:00 mins
                    </span>
                  </div>

                  {/* Details Card */}
                  <div className="space-y-2.5 border-t border-gray-100 pt-4 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Assigned Partner</span>
                      <span className="text-brand-dark font-bold">Avenix Hub Alpha (Sector 12)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Target Address</span>
                      <span className="text-brand-dark font-bold truncate max-w-[200px]">{addressSaved}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-[9px]">Rider Contact</span>
                      <span className="text-brand-orange font-bold">+91 90812-70891</span>
                    </div>
                  </div>

                  <button
                    onClick={cancelEmergency}
                    className="w-full py-2.5 text-center text-xs font-bold text-red-500 hover:text-red-600 transition-colors border border-red-200 rounded-xl hover:bg-red-50 cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <XCircle className="h-4.5 w-4.5" />
                    Cancel Dispatch Request
                  </button>
                </div>
              )}

            </div>

            {/* Right: GPS Maps Tracker Visual (Col-Span 7) */}
            <div className="lg:col-span-7">
              <div className="bg-white border border-gray-200 rounded-2xl shadow-xl glass-card relative overflow-hidden h-[420px] flex flex-col justify-between p-4">
                
                {/* Map Header */}
                <div className="flex items-center justify-between pb-3 border-b border-gray-100 bg-white/70 backdrop-blur-sm z-10">
                  <div className="flex items-center space-x-2">
                    <Navigation className="h-4.5 w-4.5 text-brand-orange animate-spin" />
                    <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
                      Live Courier GPS Tracker
                    </span>
                  </div>
                  {emergencyActive && (
                    <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 text-green-600 text-[9px] font-bold border border-green-150">
                      <Clock className="h-3 w-3" />
                      <span>Live Location (Ping 3ms)</span>
                    </div>
                  )}
                </div>

                {/* Simulated GPS SVG Map */}
                <div className="relative flex-grow bg-gray-50 rounded-xl border border-gray-100 overflow-hidden flex items-center justify-center p-4">
                  {/* Grid Lines Pattern */}
                  <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none medical-grid" />
                  
                  {/* Vector Map Path drawing */}
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {/* Simulated Roads Network */}
                    <path d="M 0,20 L 100,20 M 0,50 L 100,50 M 0,80 L 100,80" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="2,2" />
                    <path d="M 20,0 L 20,100 M 50,0 L 50,100 M 80,0 L 80,100" stroke="#E5E7EB" strokeWidth="1.5" strokeDasharray="2,2" />
                    
                    {/* Main Delivery Route Highway */}
                    <path 
                      d={`M ${routePoints[0].x},${routePoints[0].y} Q 55,45 80,30`} 
                      fill="none" 
                      stroke={emergencyActive ? "#FF6B00" : "#D1D5DB"} 
                      strokeWidth="2.5" 
                      strokeLinecap="round" 
                      strokeDasharray="4,4"
                      className={emergencyActive ? "animate-pulse" : ""}
                    />
                  </svg>

                  {/* Marker 1: Pharmacy Hub */}
                  <div 
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ left: `${routePoints[0].x}%`, top: `${routePoints[0].y}%` }}
                  >
                    <div className="h-7 w-7 rounded-full bg-brand-dark border-2 border-white text-white flex items-center justify-center shadow-md">
                      <Truck className="h-3.5 w-3.5" />
                    </div>
                    <span className="bg-brand-dark text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded mt-1 shadow-sm uppercase whitespace-nowrap">
                      Pharmacy Hub
                    </span>
                  </div>

                  {/* Marker 2: Customer House */}
                  <div 
                    className="absolute z-10 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ left: `${routePoints[1].x}%`, top: `${routePoints[1].y}%` }}
                  >
                    <div className="h-7 w-7 rounded-full bg-red-600 border-2 border-white text-white flex items-center justify-center shadow-md relative">
                      {emergencyActive && <span className="absolute -inset-1 rounded-full bg-red-500/35 animate-ping -z-10" />}
                      <MapPin className="h-3.5 w-3.5" />
                    </div>
                    <span className="bg-red-600 text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded mt-1 shadow-sm uppercase whitespace-nowrap">
                      Target Home
                    </span>
                  </div>

                  {/* Marker 3: Courier Rider moving */}
                  {emergencyActive && (
                    <div 
                      className="absolute z-20 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center transition-all duration-1000"
                      style={{ left: `${courierX}%`, top: `${courierY}%` }}
                    >
                      <div className="h-8 w-8 rounded-full bg-brand-orange border-2 border-white text-white flex items-center justify-center shadow-xl glow-orange">
                        <Navigation className="h-4 w-4 rotate-45 animate-pulse" />
                      </div>
                      <span className="bg-brand-orange text-white text-[7.5px] font-bold px-1.5 py-0.5 rounded mt-1 shadow-sm uppercase whitespace-nowrap">
                        Rider Rahul
                      </span>
                    </div>
                  )}

                  {!emergencyActive && (
                    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-30">
                      <Map className="h-10 w-10 text-gray-300 mb-2" />
                      <p className="text-xs font-bold text-gray-500">GPS Monitor Inactive</p>
                      <p className="text-[9.5px] text-gray-400 max-w-xs">Map tracking starts immediately after triggering the priority emergency dispatch button.</p>
                    </div>
                  )}
                </div>

                {/* Map Footer status */}
                <div className="pt-3 border-t border-gray-100 flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-wider bg-white">
                  <span>GPS: {emergencyActive ? `${emergencyCourierGPS.lat.toFixed(5)}, ${emergencyCourierGPS.lng.toFixed(5)}` : "0.00000, 0.00000"}</span>
                  <span>Avenix Mesh Network 1.8.4</span>
                </div>

              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

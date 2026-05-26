"use client";


import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState, DiagnosticPackage } from "@/context/AppState";
import { 
  Calendar, Clock, MapPin, ShieldCheck, ClipboardList, 
  Search, Star, CheckCircle2, FlaskConical, Award, HelpCircle, X 
} from "lucide-react";

export default function DiagnosticsPageClient() {
  const { diagnostics, bookAppointment } = useAppState();

  const [selectedPack, setSelectedPack] = useState<DiagnosticPackage | null>(null);
  const [patientName, setPatientName] = useState("");
  const [address, setAddress] = useState("");
  const [date, setDate] = useState("");
  const [timeslot, setTimeslot] = useState("08:00 AM - 10:00 AM"); // standard morning slots for empty stomach blood tests
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPack || !patientName || !date || !address) return;

    bookAppointment("diagnostics", selectedPack.name, patientName, date, timeslot);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedPack(null);
    }, 2000);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow medical-grid py-10">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-brand-orange">
              NABL Certified Pathology
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
              Diagnostics Booking
            </h1>
            <p className="text-xs text-gray-500">
              Schedule home sample collections. Certified phlebotomists collect blood samples safely, and digital NABL lab reports compile in under 6 hours.
            </p>
          </div>

          {/* Diagnostics packages list */}
          <div className="space-y-6 max-w-4xl mx-auto">
            {diagnostics.map((pack) => {
              const coverImg = pack.image || "/images/lab_fullbody.png";
              return (
                <div 
                  key={pack.id}
                  className="bg-white border border-gray-200 p-5 rounded-2xl shadow-md hover:shadow-xl hover:border-brand-orange/35 transition-all flex flex-col md:flex-row gap-6 justify-between items-stretch md:items-center relative overflow-hidden group"
                >
                  {/* Left Column: Image */}
                  <div className="w-full md:w-44 h-40 md:h-32 rounded-xl overflow-hidden bg-gray-50 shrink-0 relative">
                    <img src={coverImg} alt={pack.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  </div>

                  {/* Middle Column: Details */}
                  <div className="space-y-3.5 flex-grow">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#00B894] text-white text-[9px] font-bold uppercase tracking-wider">
                        {pack.testsCount} Tests Included
                      </span>
                      <span className="px-2 py-0.5 rounded bg-green-50 text-green-600 text-[8px] font-extrabold uppercase tracking-wide">
                        Free Home Collection
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-extrabold text-gray-900 group-hover:text-brand-orange transition-colors">
                        {pack.name}
                      </h3>
                      <p className="text-[11.5px] leading-relaxed text-gray-500 font-medium max-w-xl">
                        {pack.description}
                      </p>
                    </div>

                    {/* Core tests highlight */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      {pack.tests.map((test, i) => (
                        <span key={i} className="px-2 py-0.5 bg-gray-50 border border-gray-150 rounded text-[9.5px] text-gray-500 font-semibold">
                          {test}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right Column: Checkout Info */}
                  <div className="shrink-0 flex flex-row md:flex-col items-baseline md:items-end justify-between w-full md:w-auto gap-4 border-t border-gray-100 md:border-0 pt-4 md:pt-0">
                    <div className="space-y-0.5">
                      <div className="flex items-baseline space-x-1.5">
                        <span className="text-base font-black text-gray-900">₹{pack.price}</span>
                        <span className="text-xs text-gray-400 line-through font-semibold">₹{pack.originalPrice}</span>
                      </div>
                      <span className="text-[9px] text-green-600 font-bold block uppercase tracking-wide">
                        Save {Math.round(((pack.originalPrice - pack.price) / pack.originalPrice) * 100)}% Today
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedPack(pack)}
                      className="bg-[#FFF0EB] hover:bg-[#FFE5DC] text-[#FF6B00] font-black text-[10px] tracking-wide rounded-xl px-5 py-2.5 transition-colors cursor-pointer"
                    >
                      Book Home Collection
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Booking Modal Drawer */}
          {selectedPack && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-2xl glass-card max-w-md w-full relative">
                
                <button 
                  onClick={() => setSelectedPack(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <FlaskConical className="h-7 w-7 text-brand-orange mx-auto" />
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest font-mono">Laboratory Dispatch Schedule</h3>
                    <h2 className="text-md font-black text-brand-dark">{selectedPack.name}</h2>
                    <p className="text-[10px] text-gray-400">{selectedPack.testsCount} Parameters &middot; ₹{selectedPack.price} Package Price</p>
                  </div>

                  {bookingSuccess ? (
                    <div className="py-6 text-center space-y-2 bg-green-50 border border-green-200 rounded-2xl text-green-700">
                      <ShieldCheck className="h-8 w-8 mx-auto text-green-600 animate-bounce" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">LAB SCHEDULED SUCCESSFULLY</h4>
                      <p className="text-[10px] leading-relaxed">Phlebotomist route assigned. Details updated in your Customer portal.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBookTest} className="space-y-4">
                      {/* Patient Name */}
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-extrabold text-gray-400 uppercase tracking-wider block">
                          Patient Name
                        </label>
                        <input
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="e.g. Avnish Kumar"
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                        />
                      </div>

                      {/* Collection Address */}
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-extrabold text-gray-400 uppercase tracking-wider block">
                          Sample Collection Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <MapPin className="h-3.5 w-3.5" />
                          </div>
                          <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Flat / Street / Area details"
                            className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                          />
                        </div>
                      </div>

                      {/* Date Selection */}
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-extrabold text-gray-400 uppercase tracking-wider block">
                          Preferred Date
                        </label>
                        <input
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                        />
                      </div>

                      {/* Time Slot (Standard empty stomach slots are early morning) */}
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-extrabold text-gray-400 uppercase tracking-wider block">
                          Phlebotomist Collection Slot (Empty Stomach recommended)
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {["06:00 AM - 08:00 AM", "08:00 AM - 10:00 AM", "10:00 AM - 12:00 PM", "12:00 PM - 02:00 PM"].map((slot) => (
                            <button
                              key={slot}
                              type="button"
                              onClick={() => setTimeslot(slot)}
                              className={`py-2 text-[10px] font-bold rounded-lg border transition-all ${
                                timeslot === slot
                                  ? "bg-brand-orange/10 border-brand-orange text-brand-orange"
                                  : "bg-gray-50 border-gray-150 text-gray-600 hover:bg-gray-100"
                              }`}
                            >
                              {slot}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-orange/15 cursor-pointer"
                      >
                        Confirm Lab Collection Schedule
                      </button>
                    </form>
                  )}

                </div>

              </div>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

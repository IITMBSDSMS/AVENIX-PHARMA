"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState, Doctor } from "@/context/AppState";
import { 
  HeartHandshake, Star, Video, Calendar, ShieldCheck, 
  Search, Stethoscope, ChevronRight, Activity, X,
  Award, FileText, CheckCircle2, Clock, Sparkles, Shield, Heart, Info, ArrowLeft
} from "lucide-react";

interface DoctorAd {
  id: string;
  badge: string;
  title: string;
  desc: string;
  cta: string;
  btnText: string;
  bgGradient: string;
  doctors: string[]; // IDs of doctors highlighted in this ad
}

interface Institution {
  abbreviation: string;
  name: string;
  color: string;
  domain: string;
  logoUrl: string;
}

const institutions: Institution[] = [
  { 
    abbreviation: "AIIMS", 
    name: "AIIMS New Delhi", 
    color: "bg-amber-600", 
    domain: "aiims.edu",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/ee/AIIMS_New_Delhi.png"
  },
  { 
    abbreviation: "VMMC", 
    name: "Vardhman Mahavir Medical College", 
    color: "bg-blue-600", 
    domain: "vmmc-sjh.nic.in",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/a/a2/Vardhman_Mahavir_Medical_College_logo.svg"
  },
  { 
    abbreviation: "AFMC", 
    name: "AFMC Pune", 
    color: "bg-red-700", 
    domain: "afmc.nic.in",
    logoUrl: "https://s2.googleusercontent.com/s2/favicons?domain=afmc.nic.in&sz=128"
  },
  { 
    abbreviation: "MAMC", 
    name: "Maulana Azad Medical College", 
    color: "bg-emerald-700", 
    domain: "mamc.ac.in",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Maulana_Azad_Medical_College_logo.svg"
  },
  { 
    abbreviation: "KGMU", 
    name: "KGMU Lucknow", 
    color: "bg-indigo-700", 
    domain: "kgmu.org",
    logoUrl: "https://upload.wikimedia.org/wikipedia/commons/e/e0/King_George%27s_Medical_University_Logo.png"
  },
  { 
    abbreviation: "MMC", 
    name: "MMC Chennai", 
    color: "bg-teal-700", 
    domain: "mmc.tn.gov.in",
    logoUrl: "https://upload.wikimedia.org/wikipedia/en/5/52/Madras_Medical_College_Logo.png"
  }
];

function InstitutionLogo({ name, color, abbreviation, logoUrl }: Institution) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center gap-3.5 bg-white/80 backdrop-blur-md border border-gray-150 rounded-2xl pl-3 pr-5 py-2.5 shadow-xs shrink-0 select-none hover:border-brand-orange/40 hover:bg-white transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-gray-100 shadow-sm overflow-hidden bg-white relative">
        {imageError ? (
          <div className={`w-full h-full rounded-full flex flex-col items-center justify-center ${color} text-white font-black text-[9px] tracking-tight leading-none uppercase p-1 text-center shadow-inner`}>
            <span>{abbreviation}</span>
          </div>
        ) : (
          <img 
            src={logoUrl}
            alt={`${abbreviation} logo`}
            className="w-full h-full object-contain rounded-full p-0.5 bg-white"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="text-left leading-tight">
        <div className="text-xs font-black text-brand-dark tracking-wider">{abbreviation}</div>
        <div className="text-[9px] font-bold text-gray-400 max-w-[120px] uppercase truncate">{name}</div>
      </div>
    </div>
  );
}


export default function DoctorsPageClient() {
  const { doctors, bookAppointment, bookings, user } = useAppState();
  
  const [selectedDoc, setSelectedDoc] = useState<Doctor | null>(null);
  const [activeProfileDoc, setActiveProfileDoc] = useState<Doctor | null>(null);
  const [patientName, setPatientName] = useState("");
  const [date, setDate] = useState("");
  const [timeslot, setTimeslot] = useState("10:00 AM - 10:30 AM");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [activeConsultation, setActiveConsultation] = useState<Doctor | null>(null);

  // Carousel State
  const [activeAd, setActiveAd] = useState(0);

  // Vitals states for simulated telemetry
  const [heartRate, setHeartRate] = useState(72);
  const [oxygenLevel, setOxygenLevel] = useState(98);
  const [temp, setTemp] = useState(98.6);
  const [callDuration, setCallDuration] = useState(0);
  const [simulationAlert, setSimulationAlert] = useState<string | null>(null);

  // Doctor Team Ads configurations
  const doctorAds: DoctorAd[] = [
    {
      id: "ad-1",
      badge: "AVENIX CARDIOLOGY COUNCIL",
      title: "India's Elite Heart & Vascular Team",
      desc: "Connect with board-certified MD Cardiologists for 24/7 emergency consults, lipid reviews, and blood pressure screening logs.",
      cta: "Heart Care Consultation",
      btnText: "Consult Cardiologist",
      bgGradient: "from-slate-950 via-indigo-950/80 to-slate-950",
      doctors: ["doc-1"]
    },
    {
      id: "ad-2",
      badge: "AVENIX PEDIATRIC COUNCIL",
      title: "24/7 Expert Child Wellness Panel",
      desc: "Instant video consultations with verified pediatric specialists. Gentle child care, digital prescription logs, and immunization charts.",
      cta: "Child Care Consultation",
      btnText: "Consult Pediatrician",
      bgGradient: "from-slate-950 via-emerald-950/80 to-slate-950",
      doctors: ["doc-2"]
    },
    {
      id: "ad-3",
      badge: "AVENIX DERMATOLOGY HUB",
      title: "Global Skin & Hair Aesthetics Team",
      desc: "Consult leading dermatologists for acne therapy, hair loss diagnostics, and NABL-accredited skin health guidelines.",
      cta: "Aesthetic Skin Consultation",
      btnText: "Consult Dermatologist",
      bgGradient: "from-slate-950 via-teal-950/80 to-slate-950",
      doctors: ["doc-4"]
    },
    {
      id: "ad-4",
      badge: "AVENIX TELEHEALTH NODE",
      title: "Immediate General Medicine Panel",
      desc: "Consultations start at just ₹400. Talk to MBBS General Physicians immediately for fever, cold, or gastro issues. Available 24/7.",
      cta: "General Health Care Consultation",
      btnText: "Talk to Physician Now",
      bgGradient: "from-slate-950 via-rose-950/80 to-slate-950",
      doctors: ["doc-3"]
    }
  ];

  const [isCallConnected, setIsCallConnected] = useState(false);
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const remoteVideoRef = React.useRef<HTMLVideoElement>(null);
  const peerConnRef = React.useRef<RTCPeerConnection | null>(null);
  const localStreamRef = React.useRef<MediaStream | null>(null);
  const signalIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const candidateIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const endCallSession = () => {
    if (signalIntervalRef.current) clearInterval(signalIntervalRef.current);
    if (candidateIntervalRef.current) clearInterval(candidateIntervalRef.current);
    
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnRef.current) {
      peerConnRef.current.close();
      peerConnRef.current = null;
    }
    
    if (activeConsultation) {
      fetch("/api/video-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "end",
          bookingId: `call-${activeConsultation.id}`
        })
      }).catch(console.error);
    }
    
    setIsCallConnected(false);
    setActiveConsultation(null);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeConsultation) {
      setCallDuration(0);
      setIsCallConnected(false);
      
      const bookingId = `call-${activeConsultation.id}`;

      // Start WebRTC initialization
      const initWebRTC = async () => {
        try {
          let stream: MediaStream;
          try {
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
          } catch (e) {
            console.warn("Webcam access denied or unavailable, using canvas placeholder stream:", e);
            const canvas = document.createElement("canvas");
            canvas.width = 320;
            canvas.height = 240;
            const ctx = canvas.getContext("2d");
            if (ctx) {
              ctx.fillStyle = "#0F172A";
              ctx.fillRect(0, 0, 320, 240);
              ctx.fillStyle = "#94A3B8";
              ctx.font = "14px Poppins, sans-serif";
              ctx.fillText("Camera Denied / Offline", 60, 120);
            }
            stream = (canvas as any).captureStream ? (canvas as any).captureStream(10) : new MediaStream();
          }
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }

          const pc = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
          });
          peerConnRef.current = pc;

          stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream);
          });

          pc.ontrack = (event) => {
            if (remoteVideoRef.current && event.streams[0]) {
              remoteVideoRef.current.srcObject = event.streams[0];
            }
          };

          pc.onicecandidate = async (event) => {
            if (event.candidate) {
              await fetch("/api/video-calls", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  action: "addCandidate",
                  bookingId,
                  role: "patient",
                  candidate: event.candidate
                })
              });
            }
          };

          const offer = await pc.createOffer();
          await pc.setLocalDescription(offer);

          await fetch("/api/video-calls", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "create",
              bookingId,
              patientName: user?.name || "Patient",
              doctorName: activeConsultation.name,
              offer
            })
          });

          const signalInterval = setInterval(async () => {
            try {
              const res = await fetch(`/api/video-calls?bookingId=${bookingId}`);
              const data = await res.json();
              if (data.call) {
                if (data.call.status === "connected" && !pc.remoteDescription) {
                  setIsCallConnected(true);
                  if (data.call.answer) {
                    await pc.setRemoteDescription(new RTCSessionDescription(data.call.answer));
                  }
                  
                  const candidateInterval = setInterval(async () => {
                    try {
                      const candRes = await fetch(`/api/video-calls`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "getCandidates", bookingId })
                      });
                      const candData = await candRes.json();
                      if (candData.doctorCandidates) {
                        for (const cand of candData.doctorCandidates) {
                          try {
                            await pc.addIceCandidate(new RTCIceCandidate(cand));
                          } catch (e) {}
                        }
                      }
                    } catch (e) {}
                  }, 1500);
                  candidateIntervalRef.current = candidateInterval;
                } else if (data.call.status === "ended") {
                  endCallSession();
                }
              }
            } catch (e) {}
          }, 1500);
          signalIntervalRef.current = signalInterval;

        } catch (err) {
          console.error("WebRTC Init error:", err);
        }
      };

      initWebRTC();

      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
        setHeartRate((prev) => {
          const delta = Math.floor(Math.random() * 3) - 1;
          const next = prev + delta;
          return next > 90 ? 89 : next < 65 ? 66 : next;
        });
        setOxygenLevel((prev) => {
          if (Math.random() > 0.8) {
            const next = prev + (Math.random() > 0.5 ? 1 : -1);
            return next > 100 ? 100 : next < 95 ? 96 : next;
          }
          return prev;
        });
      }, 1000);
    }
    return () => {
      clearInterval(interval);
      if (signalIntervalRef.current) clearInterval(signalIntervalRef.current);
      if (candidateIntervalRef.current) clearInterval(candidateIntervalRef.current);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnRef.current) {
        peerConnRef.current.close();
      }
    };
  }, [activeConsultation]);

  // Rotator for doctor team ads
  useEffect(() => {
    const adTimer = setInterval(() => {
      setActiveAd((prev) => (prev + 1) % doctorAds.length);
    }, 6000);
    return () => clearInterval(adTimer);
  }, []);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const docToBook = selectedDoc || activeProfileDoc;
    if (!docToBook || !patientName || !date) return;

    bookAppointment("doctor", docToBook.name, patientName, date, timeslot);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedDoc(null);
      setActiveProfileDoc(null);
    }, 2000);
  };

  const formatDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Predefined custom certificates and council IDs for professional profiles
  const doctorMetadata: Record<string, { mci: string; college: string; hospital: string; languages: string[]; reviews: { name: string; date: string; rating: number; text: string }[] }> = {
    "doc-1": {
      mci: "MCI-12904-A",
      college: "All India Institute of Medical Sciences (AIIMS), New Delhi",
      hospital: "Avenix Apex Hospital, Bangalore",
      languages: ["English", "Hindi", "Punjabi"],
      reviews: [
        { name: "Amit Khanna", date: "2026-05-18", rating: 5, text: "Excellent cardiologist. Very patiently listened to my chest tightness symptoms and guided me." },
        { name: "Pooja Hegde", date: "2026-05-12", rating: 5, text: "My father has been in her treatment. Her suggestions are highly scientific and effective." }
      ]
    },
    "doc-2": {
      mci: "MCI-30812-B",
      college: "Armed Forces Medical College (AFMC), Pune",
      hospital: "Avenix Clinical Center, New Delhi",
      languages: ["English", "Hindi", "Marathi"],
      reviews: [
        { name: "Sarah Joseph", date: "2026-05-22", rating: 5, text: "Extremely kind with children! My daughter felt very comfortable during the online session." },
        { name: "Rahul Deshmukh", date: "2026-05-15", rating: 4, text: "Very friendly and prescribed generics which saved me money. Recommended!" }
      ]
    },
    "doc-3": {
      mci: "MCI-90412-C",
      college: "Madras Medical College (MMC), Chennai",
      hospital: "Metro Avenix Health Labs, Mumbai",
      languages: ["English", "Hindi", "Tamil"],
      reviews: [
        { name: "Venkatesh Prasad", date: "2026-05-20", rating: 5, text: "Highly experienced doctor. Diagnosed my gastro issues accurately in one consult." },
        { name: "Deepa Sen", date: "2026-05-10", rating: 4, text: "Professional advice. Clear instructions about dosage and precautions." }
      ]
    },
    "doc-4": {
      mci: "MCI-70231-D",
      college: "King George's Medical University (KGMU), Lucknow",
      hospital: "Skin & Aesthetic Avenix Clinic, Hyderabad",
      languages: ["English", "Hindi", "Telugu"],
      reviews: [
        { name: "Megha Sharma", date: "2026-05-24", rating: 5, text: "The acne treatment prescribed worked wonders in just 2 weeks. Thank you Dr. Priya!" },
        { name: "Arjun Verma", date: "2026-05-19", rating: 5, text: "Very professional skin consult. Explained the root cause and diet controls." }
      ]
    }
  };

  const activeAdData = doctorAds[activeAd];

  return (
    <>
      <Navbar />

      {/* Embedded CSS Animations */}
      <style jsx global>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -40;
          }
        }
        .animate-dash {
          animation: dash 2.5s linear infinite;
        }
        @keyframes ecg-line {
          0% {
            stroke-dashoffset: 800;
          }
          100% {
            stroke-dashoffset: 0;
          }
        }
        .animate-ecg {
          stroke-dasharray: 800;
          animation: ecg-line 4s linear infinite;
        }
        .custom-glow {
          box-shadow: 0 0 15px rgba(255, 107, 0, 0.15);
        }
        .custom-glow:hover {
          box-shadow: 0 0 25px rgba(255, 107, 0, 0.35);
        }
        @keyframes border-glow-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-border-glow:hover {
          background-size: 200% 250%;
          animation: border-glow-shift 3s ease infinite;
        }
        @keyframes marquee-l2r {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee-l2r {
          display: flex;
          width: max-content;
          animation: marquee-l2r 28s linear infinite;
        }
      `}</style>

      {/* Full-Width Doctor Team Ads Carousel */}
      <div className="w-full border-b border-gray-200 bg-gray-950 relative h-64 sm:h-80 md:h-[350px] lg:h-[400px] flex flex-col justify-between p-6 sm:p-10 md:p-12 overflow-hidden select-none">
        
        {/* Animated Banner background gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${activeAdData.bgGradient} transition-all duration-1000 z-0`} />
        <div className="absolute inset-0 bg-radial-gradient from-transparent to-black/30 z-10" />

        {/* Telehealth grid outline decorations */}
        <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-10" />

        <div className="mx-auto max-w-[1800px] w-full h-full flex items-center grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
          
          {/* Ad texts column */}
          <div className="lg:col-span-7 space-y-4 text-left my-auto">
            
            {/* Ad Badge */}
            <div className="flex items-center">
              <span className="text-[9px] sm:text-[10px] font-bold text-brand-orange uppercase tracking-[0.20em] bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3 h-3 text-brand-orange animate-pulse" />
                {activeAdData.badge}
              </span>
            </div>

            {/* Ad Title */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-poppins transition-all duration-500">
              {activeAdData.title}
            </h2>

            {/* Ad Desc */}
            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed max-w-xl transition-all duration-500">
              {activeAdData.desc}
            </p>

            {/* Ad Action Buttons */}
            <div className="flex items-center gap-4 pt-1">
              <span className="hidden sm:inline-block text-[10px] font-black text-brand-orange uppercase tracking-wider">{activeAdData.cta}</span>
              <button 
                onClick={() => {
                  const targetDoc = doctors.find(d => d.id === activeAdData.doctors[0]);
                  if (targetDoc) {
                    setActiveProfileDoc(targetDoc);
                  }
                }}
                className="px-5 py-2.5 bg-brand-orange hover:bg-orange-600 text-white text-xs font-black uppercase rounded-full shadow-lg shadow-brand-orange/25 transition-all hover:scale-105 hover:shadow-brand-orange/40 cursor-pointer"
              >
                {activeAdData.btnText}
              </button>
            </div>

          </div>

          {/* Interactive Doctor Team layout column */}
          <div className="hidden lg:col-span-5 lg:flex items-center justify-end">
            <div className="flex -space-x-6 overflow-hidden items-center justify-center pr-4">
              {doctors.map((d) => {
                const isHighlighted = activeAdData.doctors.includes(d.id);
                return (
                  <div 
                    key={d.id} 
                    onClick={() => setActiveProfileDoc(d)}
                    className={`relative transition-all duration-500 cursor-pointer ${
                      isHighlighted 
                        ? "scale-115 z-20 ring-4 ring-brand-orange shadow-[0_0_25px_rgba(255,107,0,0.5)]" 
                        : "scale-90 opacity-40 hover:opacity-100 hover:scale-100 hover:z-10 ring-2 ring-white/10"
                    }`}
                  >
                    <img
                      className="inline-block h-28 w-28 rounded-full bg-slate-900 object-cover border-2 border-white/5 shadow-2xl"
                      src={d.image}
                      alt={d.name}
                    />
                    
                    {/* Tiny name tag */}
                    <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 bg-brand-dark border text-[8px] px-2 py-0.5 rounded-full font-black truncate max-w-[90px] whitespace-nowrap shadow-md transition-colors ${
                      isHighlighted ? "text-brand-orange border-brand-orange" : "text-white border-white/10"
                    }`}>
                      {d.name.replace("Dr. ", "")}
                    </div>

                    {/* Active pulse for highlighted physician */}
                    {isHighlighted && (
                      <span className="absolute top-2 right-2 flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-orange opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-brand-orange"></span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Carousel indicators dots */}
        <div className="mx-auto max-w-[1800px] w-full flex items-center justify-between z-20 pt-2 border-t border-white/5 mt-auto">
          <div className="flex items-center space-x-2">
            {doctorAds.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveAd(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  activeAd === idx ? "w-8 bg-brand-orange" : "w-1.5 bg-gray-600 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
          <div className="flex items-center space-x-2 text-white/40 text-[9px] font-bold font-mono">
            <span>0{activeAd + 1}</span>
            <span>/</span>
            <span>0{doctorAds.length}</span>
          </div>
        </div>

      </div>

      <main className="flex-grow bg-[#FCFCFD] py-10 relative overflow-hidden">
        {/* Background Subtle Doctor/Medical SVGs */}
        <div className="absolute top-12 right-0 w-[500px] h-[500px] text-brand-orange/[0.015] pointer-events-none select-none z-0 translate-x-1/4">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.75" className="w-full h-full">
            <circle cx="100" cy="65" r="25" />
            <path d="M40 160 C 40 120, 70 110, 100 110 C 130 110, 160 120, 160 160" />
            <path d="M90 110 L 100 135 L 110 110" />
            <path d="M100 135 L 100 155" />
            <path d="M80 75 C 80 100, 120 100, 120 75" />
            <path d="M100 95 C 100 125, 135 125, 135 150" />
            <circle cx="135" cy="153" r="6" />
          </svg>
        </div>

        <div className="absolute bottom-20 left-0 w-[450px] h-[450px] text-brand-orange/[0.012] pointer-events-none select-none z-0 -translate-x-1/4">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.6" className="w-full h-full">
            <path d="M 10 100 L 50 100 L 60 70 L 70 130 L 80 30 L 95 170 L 110 90 L 120 110 L 130 100 L 190 100" />
            <path d="M 100 35 C 80 10, 30 20, 30 75 C 30 120, 75 155, 100 180 C 125 155, 170 120, 170 75 C 170 20, 120 10, 100 35 Z" strokeDasharray="4 4" />
          </svg>
        </div>

        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Stepper Header Title */}
          <div className="text-center max-w-xl mx-auto space-y-3 mb-10 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-brand-orange block">
              SECURE TELEHEALTH SYSTEM
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
              Digital Medical Consultation
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              Connect instantly with board-certified Indian specialists. Direct video consultations, digital prescription logs, and clinic-standard diagnostics.
            </p>
          </div>

          {/* SVG Steps Workflow Section */}
          <div className="max-w-5xl mx-auto mb-16 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-center text-xs font-black uppercase tracking-widest text-brand-dark mb-8 flex items-center justify-center gap-2">
              <Activity className="h-4 w-4 text-brand-orange animate-pulse" />
              Four-Step Secure Telehealth Pipeline
            </h2>
            
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
              
              {/* Animated Connecting SVG Line for Desktop */}
              <div className="absolute top-[32px] left-[10%] right-[10%] h-1 hidden md:block -z-10">
                <svg className="w-full h-2" fill="none" viewBox="0 0 800 8">
                  <path 
                    d="M 0 4 H 800" 
                    stroke="url(#stepper-gradient)" 
                    strokeWidth="3" 
                    strokeDasharray="8 6" 
                    className="animate-dash" 
                  />
                  <defs>
                    <linearGradient id="stepper-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.4" />
                      <stop offset="50%" stopColor="#FF8533" />
                      <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.4" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Step 1: Select */}
              <div className="flex-1 flex flex-col items-center text-center group">
                <div className="relative h-16 w-16 rounded-2xl bg-[#FFF5F0] border border-brand-orange/20 flex items-center justify-center text-brand-orange transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white shadow-sm">
                  <Stethoscope className="h-8 w-8" />
                  <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-brand-dark text-white rounded-full flex items-center justify-center text-[9px] font-black font-mono">1</span>
                </div>
                <h3 className="text-xs font-extrabold text-brand-dark mt-3 uppercase tracking-wider">Choose Specialist</h3>
                <p className="text-[10px] text-gray-400 mt-1 max-w-[180px]">Select from vetted super-specialists</p>
              </div>

              {/* Step 2: Book */}
              <div className="flex-1 flex flex-col items-center text-center group">
                <div className="relative h-16 w-16 rounded-2xl bg-[#FFF5F0] border border-brand-orange/20 flex items-center justify-center text-brand-orange transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white shadow-sm">
                  <Calendar className="h-8 w-8" />
                  <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-brand-dark text-white rounded-full flex items-center justify-center text-[9px] font-black font-mono">2</span>
                </div>
                <h3 className="text-xs font-extrabold text-brand-dark mt-3 uppercase tracking-wider">Reserve Slot</h3>
                <p className="text-[10px] text-gray-400 mt-1 max-w-[180px]">Pick immediate consult or calendar slot</p>
              </div>

              {/* Step 3: Consult */}
              <div className="flex-1 flex flex-col items-center text-center group">
                <div className="relative h-16 w-16 rounded-2xl bg-[#FFF5F0] border border-brand-orange/20 flex items-center justify-center text-brand-orange transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white shadow-sm">
                  <Video className="h-8 w-8" />
                  <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-brand-dark text-white rounded-full flex items-center justify-center text-[9px] font-black font-mono">3</span>
                </div>
                <h3 className="text-xs font-extrabold text-brand-dark mt-3 uppercase tracking-wider">Video Call</h3>
                <p className="text-[10px] text-gray-400 mt-1 max-w-[180px]">HD call with telemetry vital simulation</p>
              </div>

              {/* Step 4: Digital Prescription */}
              <div className="flex-1 flex flex-col items-center text-center group">
                <div className="relative h-16 w-16 rounded-2xl bg-[#FFF5F0] border border-brand-orange/20 flex items-center justify-center text-brand-orange transition-all duration-300 group-hover:scale-110 group-hover:bg-brand-orange group-hover:text-white shadow-sm">
                  <FileText className="h-8 w-8" />
                  <span className="absolute -bottom-1 -right-1 h-5 w-5 bg-brand-dark text-white rounded-full flex items-center justify-center text-[9px] font-black font-mono">4</span>
                </div>
                <h3 className="text-xs font-extrabold text-brand-dark mt-3 uppercase tracking-wider">Get E-Rx</h3>
                <p className="text-[10px] text-gray-400 mt-1 max-w-[180px]">Secure PDF receipt logged automatically</p>
              </div>

            </div>
          </div>

          {activeConsultation ? (
            /* Premium Video Consultation Live Interface */
            <div className="bg-[#0B0F19] text-white p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden max-w-5xl mx-auto border border-gray-800">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                
                {/* Video Window */}
                <div className="lg:col-span-3 bg-gray-950 border border-gray-800 rounded-2xl aspect-video relative flex items-center justify-center overflow-hidden">
                  
                  {/* Doctor remote video element */}
                  <video 
                    ref={remoteVideoRef} 
                    autoPlay 
                    playsInline 
                    className="w-full h-full object-cover absolute inset-0 z-10"
                    style={{ display: isCallConnected ? "block" : "none" }}
                  />
                  {!isCallConnected && (
                    <>
                      <img
                        src={activeConsultation.image}
                        alt={activeConsultation.name}
                        className="w-full h-full object-cover opacity-60"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
                        <div className="h-12 w-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin mb-4" />
                        <p className="text-sm font-bold text-gray-300">Calling Attending Physician...</p>
                        <p className="text-[10px] text-gray-500 mt-1">Please wait for {activeConsultation.name} to pick up the call from their dashboard</p>
                      </div>
                    </>
                  )}

                  {/* Doctor Info overlay */}
                  <div className="absolute top-4 left-4 flex items-center gap-2.5 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-xl text-[10px] font-bold border border-white/10 shadow-lg">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-ping" />
                    <span>Live Video Link: {activeConsultation.name}</span>
                  </div>

                  {/* Encryption Badge overlay */}
                  <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-500/10 backdrop-blur-md px-3 py-1.5 rounded-xl text-[9px] font-bold text-green-400 border border-green-500/20">
                    <Shield className="h-3 w-3" />
                    <span>HIPAA Compliant</span>
                  </div>

                  {/* Telemetry Dashboard Stats Overlay */}
                  <div className="absolute bottom-16 left-4 bg-black/75 backdrop-blur-md p-4 rounded-xl border border-white/10 text-[9.5px] space-y-2 text-gray-300 font-mono min-w-[160px] shadow-2xl">
                    <span className="text-[8px] font-extrabold text-brand-orange uppercase block tracking-wider mb-1">Telemetry Metrics</span>
                    <div className="flex justify-between items-center gap-4">
                      <span>Heart Rate:</span>
                      <span className={`font-bold transition-colors ${heartRate > 80 ? "text-amber-400 animate-pulse" : "text-green-400"}`}>
                        {heartRate} bpm
                      </span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span>SpO2 Level:</span>
                      <span className="text-emerald-400 font-bold">{oxygenLevel}%</span>
                    </div>
                    <div className="flex justify-between items-center gap-4">
                      <span>Body Temp:</span>
                      <span className="text-green-400 font-bold">{temp.toFixed(1)}°F</span>
                    </div>
                    <div className="flex justify-between items-center gap-4 border-t border-white/10 pt-1 text-[8.5px]">
                      <span>Link Latency:</span>
                      <span className="text-gray-400 font-bold">14ms (NABL Node)</span>
                    </div>
                  </div>

                  {/* ECG Heartbeat line overlay */}
                  <div className="absolute bottom-16 right-4 w-32 h-16 opacity-70 pointer-events-none">
                    <svg className="w-full h-full" fill="none" viewBox="0 0 100 50">
                      <path 
                        d="M 0 25 L 30 25 L 35 15 L 40 35 L 45 5 L 50 45 L 55 25 L 60 25 L 63 20 L 66 30 L 70 25 L 100 25" 
                        stroke="#FF6B00" 
                        strokeWidth="2.5" 
                        className="animate-ecg" 
                      />
                    </svg>
                  </div>

                  {/* Customer preview window with webcam stream */}
                  <div className="absolute bottom-16 right-4 hidden sm:flex w-32 h-24 bg-gray-900 border border-white/25 rounded-xl overflow-hidden shadow-lg items-center justify-center z-30 relative">
                    <video 
                      ref={localVideoRef} 
                      autoPlay 
                      playsInline 
                      muted 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1.5 left-1.5 bg-black/60 px-1.5 py-0.5 rounded text-[8px] text-white font-bold uppercase">
                      Avnish (You)
                    </div>
                  </div>

                  {/* Call Controls bar */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/80 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 shadow-2xl">
                    <button className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 text-white transition-colors cursor-pointer text-[10px] font-bold border border-white/5 px-3">Mute</button>
                    <button className="p-2 rounded-full bg-gray-900 hover:bg-gray-800 text-white transition-colors cursor-pointer text-[10px] font-bold border border-white/5 px-3">Video Off</button>
                    <button 
                      onClick={() => endCallSession()}
                      className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white transition-all cursor-pointer text-[10px] font-extrabold uppercase tracking-wider"
                    >
                      End Call
                    </button>
                  </div>
                </div>

                {/* Consultation Details & Vitals Simulator Sidebar */}
                <div className="lg:col-span-1 flex flex-col justify-between space-y-6">
                  
                  <div className="space-y-4">
                    <div className="border-b border-gray-800 pb-3">
                      <span className="text-[8px] font-extrabold text-brand-orange uppercase tracking-wider block">Attending Consultant</span>
                      <h3 className="text-md font-bold">{activeConsultation.name}</h3>
                      <p className="text-xs text-gray-400">{activeConsultation.specialty}</p>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <Info className="h-3 w-3 text-brand-orange" />
                        Session Telemetry logs
                      </h4>
                      <div className="p-3 bg-gray-950 rounded-xl border border-gray-900 text-[10px] text-gray-400 leading-relaxed font-mono space-y-1">
                        <div>&gt; Video Call Time: <span className="text-white font-bold">{formatDuration(callDuration)}</span></div>
                        <div>&gt; Frame rate: 60 fps</div>
                        <div>&gt; Encryption: AES-256-GCM</div>
                        {simulationAlert && <div className="text-amber-500 animate-pulse font-bold">&gt; Alert: {simulationAlert}</div>}
                      </div>
                    </div>
                  </div>

                  {/* Vitals Simulator Interactive Panel */}
                  <div className="bg-gray-950 p-4 rounded-2xl border border-gray-900 space-y-3">
                    <span className="text-[8px] font-extrabold text-gray-400 uppercase tracking-wider block">Simulator Vitals Tuner</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => {
                          setHeartRate(110);
                          setSimulationAlert("Tachycardia detected");
                          setTimeout(() => setSimulationAlert(null), 3000);
                        }}
                        className="py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-[9px] font-bold border border-white/5 transition-colors cursor-pointer"
                      >
                        Spike Heart Rate
                      </button>
                      <button 
                        onClick={() => {
                          setHeartRate(55);
                          setSimulationAlert("Bradycardia detected");
                          setTimeout(() => setSimulationAlert(null), 3000);
                        }}
                        className="py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-[9px] font-bold border border-white/5 transition-colors cursor-pointer"
                      >
                        Drop Heart Rate
                      </button>
                      <button 
                        onClick={() => {
                          setTemp(102.5);
                          setSimulationAlert("Hyperpyrexia alert");
                          setTimeout(() => setSimulationAlert(null), 3000);
                        }}
                        className="py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-[9px] font-bold border border-white/5 transition-colors cursor-pointer"
                      >
                        Spike Temp
                      </button>
                      <button 
                        onClick={() => {
                          setHeartRate(72);
                          setTemp(98.6);
                          setSimulationAlert(null);
                        }}
                        className="py-2 bg-brand-orange/20 hover:bg-brand-orange/30 text-brand-orange rounded-lg text-[9px] font-bold border border-brand-orange/20 transition-colors cursor-pointer"
                      >
                        Reset Vitals
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 bg-brand-orange/10 border border-brand-orange/20 rounded-xl text-[10.5px] text-brand-orange text-center leading-normal">
                    Secure clinical prescription receipt will sync automatically to your dashboard on call completion.
                  </div>
                </div>

              </div>
            </div>
          ) : (
            /* Consultation Grid with 2 Sections */
            <div className="space-y-12">
              
              {/* Section 1: Doctors from Top Institutions */}
              <div className="space-y-6">
                
                {/* Section Header */}
                <div className="max-w-5xl mx-auto text-left px-4 md:px-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-brand-dark font-poppins">Doctors from Top Institutions</h2>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Connect with consultants graduated from premier medical centers like AIIMS, AFMC, and MMC.
                  </p>
                </div>

                {/* Institutions Marquee Ticker - Moving Left to Right */}
                <div className="w-full overflow-hidden bg-gray-50/50 border-y border-gray-150 py-3 relative mb-6">
                  <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FCFCFD] to-transparent z-10 pointer-events-none" />
                  <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FCFCFD] to-transparent z-10 pointer-events-none" />
                  
                  <div className="animate-marquee-l2r flex gap-6">
                    {/* First Set */}
                    {institutions.map((inst, i) => (
                      <InstitutionLogo key={`inst-1-${i}`} {...inst} />
                    ))}
                    {/* Duplicate Set for Loop */}
                    {institutions.map((inst, i) => (
                      <InstitutionLogo key={`inst-2-${i}`} {...inst} />
                    ))}
                  </div>
                </div>

                {/* Cards for Top Institutions */}
                <div className="space-y-6 max-w-5xl mx-auto px-4 md:px-0">
                  {doctors.filter(d => d.id === "doc-1" || d.id === "doc-2").map((doc, index) => (
                    <div 
                      key={doc.id}
                      onClick={() => setActiveProfileDoc(doc)}
                      className="relative p-[1.5px] rounded-[28px] bg-gradient-to-r from-gray-200 to-gray-200 hover:from-brand-orange hover:via-amber-500 hover:to-brand-orange hover:shadow-[0_15px_30px_-10px_rgba(255,107,0,0.2)] transition-all duration-500 ease-out group animate-border-glow shadow-sm cursor-pointer"
                      style={{
                        animationDelay: `${index * 150}ms`
                      }}
                    >
                      <div className="bg-white rounded-[26px] p-6 flex flex-col md:flex-row gap-6 items-center w-full transition-all duration-300 relative z-10 overflow-hidden">
                        
                        {/* Subtle Stethoscope Watermark in Card Background */}
                        <div className="absolute right-6 bottom-2 w-36 h-36 text-gray-50 group-hover:text-brand-orange/[0.025] transition-all duration-700 pointer-events-none -z-10 translate-y-6 translate-x-6 scale-95 group-hover:scale-105 group-hover:rotate-6">
                          <Stethoscope className="w-full h-full stroke-[0.3]" />
                        </div>

                        {/* Profile Pic Container */}
                        <div className="relative shrink-0 overflow-hidden rounded-2xl border border-gray-150 h-28 w-28 md:h-36 md:w-36 shadow-sm bg-gray-50 flex items-center justify-center">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          
                          {/* Availability status tag over image */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-extrabold text-white flex items-center gap-1 border border-white/10 shadow-sm">
                            <span className="relative flex h-1.5 w-1.5 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            <span className="uppercase tracking-wider truncate">{doc.availability}</span>
                          </div>
                        </div>

                        {/* Details Column */}
                        <div className="flex-grow space-y-3.5 w-full text-left">
                          
                          {/* Rating Badge */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-amber-500 text-[10.5px] font-bold gap-1 bg-amber-500/5 px-2.5 py-1 rounded-full border border-amber-500/10 w-fit">
                              <Star className="h-3.5 w-3.5 fill-amber-400 stroke-none" />
                              <span>{doc.rating}</span>
                              <span className="text-gray-400 font-normal">| 150+ Consultations</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-brand-orange/10 text-brand-orange text-[7.5px] font-black tracking-widest uppercase">Top Alumni</span>
                          </div>

                          {/* Name & Specialty */}
                          <div className="space-y-1">
                            <h3 className="text-lg font-black text-brand-dark group-hover:text-brand-orange transition-colors duration-300 flex items-center gap-2">
                              {doc.name}
                              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                            </h3>
                            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">{doc.specialty}</p>
                          </div>

                          {/* Clinical Stats */}
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Award className="h-4 w-4 text-brand-orange/80 shrink-0" />
                              <span>{doc.experience} Years Experience</span>
                            </div>
                            <div className="h-3 w-[1px] bg-gray-200 hidden sm:block" />
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-brand-orange/80 shrink-0" />
                              <span>Consultation Fee: <span className="font-extrabold text-brand-dark">₹{doc.fees}</span></span>
                            </div>
                          </div>

                          {/* Badges/Credentials */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-150 text-gray-500 text-[8.5px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Shield className="h-3 w-3 text-brand-orange/80 shrink-0" />
                              NMC Reg ID: {doctorMetadata[doc.id]?.mci || "Verified"}
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-150 text-gray-500 text-[8.5px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Stethoscope className="h-3 w-3 text-brand-orange/80 shrink-0" />
                              {doctorMetadata[doc.id]?.college.split(",")[0] || "Top Medical College"}
                            </span>
                          </div>

                        </div>

                        {/* Booking/Actions Column */}
                        <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-56 md:border-l md:border-gray-100 md:pl-6 justify-center pt-4 md:pt-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedDoc(doc)}
                            className="flex-grow py-3 text-center bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm hover:shadow"
                          >
                            Book Appointment
                          </button>
                          <button
                            onClick={() => setActiveConsultation(doc)}
                            className="py-3 px-5 bg-brand-orange hover:bg-orange-600 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-brand-orange/20 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-103"
                          >
                            <Video className="h-4 w-4" />
                            Consult Now
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

              </div>

              {/* Section 2: Doctors Certified by NMC */}
              <div className="space-y-6">
                
                {/* Section Header */}
                <div className="max-w-5xl mx-auto text-left px-4 md:px-0 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-sm font-black uppercase tracking-widest text-brand-dark font-poppins">NMC Certified Specialists</h2>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Verified clinical practitioners licensed under the National Medical Commission (NMC) code.
                  </p>
                </div>

                {/* Cards for NMC Certified Doctors */}
                <div className="space-y-6 max-w-5xl mx-auto px-4 md:px-0">
                  {doctors.filter(d => d.id === "doc-3" || d.id === "doc-4").map((doc, index) => (
                    <div 
                      key={doc.id}
                      onClick={() => setActiveProfileDoc(doc)}
                      className="relative p-[1.5px] rounded-[28px] bg-gradient-to-r from-gray-200 to-gray-200 hover:from-brand-orange hover:via-amber-500 hover:to-brand-orange hover:shadow-[0_15px_30px_-10px_rgba(255,107,0,0.2)] transition-all duration-500 ease-out group animate-border-glow shadow-sm cursor-pointer"
                      style={{
                        animationDelay: `${index * 150}ms`
                      }}
                    >
                      <div className="bg-white rounded-[26px] p-6 flex flex-col md:flex-row gap-6 items-center w-full transition-all duration-300 relative z-10 overflow-hidden">
                        
                        {/* Subtle Stethoscope Watermark in Card Background */}
                        <div className="absolute right-6 bottom-2 w-36 h-36 text-gray-50 group-hover:text-brand-orange/[0.025] transition-all duration-700 pointer-events-none -z-10 translate-y-6 translate-x-6 scale-95 group-hover:scale-105 group-hover:rotate-6">
                          <Stethoscope className="w-full h-full stroke-[0.3]" />
                        </div>

                        {/* Profile Pic Container */}
                        <div className="relative shrink-0 overflow-hidden rounded-2xl border border-gray-150 h-28 w-28 md:h-36 md:w-36 shadow-sm bg-gray-50 flex items-center justify-center">
                          <img
                            src={doc.image}
                            alt={doc.name}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                          
                          {/* Availability status tag over image */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-[8px] font-extrabold text-white flex items-center gap-1 border border-white/10 shadow-sm">
                            <span className="relative flex h-1.5 w-1.5 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                            </span>
                            <span className="uppercase tracking-wider truncate">{doc.availability}</span>
                          </div>
                        </div>

                        {/* Details Column */}
                        <div className="flex-grow space-y-3.5 w-full text-left">
                          
                          {/* Rating & NMC stamp */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center text-amber-500 text-[10.5px] font-bold gap-1 bg-amber-500/5 px-2.5 py-1 rounded-full border border-amber-500/10 w-fit">
                              <Star className="h-3.5 w-3.5 fill-amber-400 stroke-none" />
                              <span>{doc.rating}</span>
                              <span className="text-gray-400 font-normal">| 150+ Consultations</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 text-[7.5px] font-black tracking-widest uppercase flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                              NMC Certified
                            </span>
                          </div>

                          {/* Name & Specialty */}
                          <div className="space-y-1">
                            <h3 className="text-lg font-black text-brand-dark group-hover:text-brand-orange transition-colors duration-300 flex items-center gap-2">
                              {doc.name}
                              <CheckCircle2 className="h-4.5 w-4.5 text-emerald-500 shrink-0" />
                            </h3>
                            <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">{doc.specialty}</p>
                          </div>

                          {/* Clinical Stats */}
                          <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-semibold text-gray-600">
                            <div className="flex items-center gap-1.5">
                              <Award className="h-4 w-4 text-brand-orange/80 shrink-0" />
                              <span>{doc.experience} Years Experience</span>
                            </div>
                            <div className="h-3 w-[1px] bg-gray-200 hidden sm:block" />
                            <div className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4 text-brand-orange/80 shrink-0" />
                              <span>Consultation Fee: <span className="font-extrabold text-brand-dark">₹{doc.fees}</span></span>
                            </div>
                          </div>

                          {/* Badges/Credentials */}
                          <div className="flex flex-wrap gap-2 pt-1">
                            <span className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-150 text-gray-500 text-[8.5px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Shield className="h-3 w-3 text-brand-orange/80 shrink-0" />
                              NMC Reg ID: {doctorMetadata[doc.id]?.mci || "Verified"}
                            </span>
                            <span className="px-2.5 py-1 rounded-full bg-gray-50 border border-gray-150 text-gray-500 text-[8.5px] font-bold uppercase tracking-wider flex items-center gap-1">
                              <Stethoscope className="h-3 w-3 text-brand-orange/80 shrink-0" />
                              {doctorMetadata[doc.id]?.college.split(",")[0] || "Top Medical College"}
                            </span>
                          </div>

                        </div>

                        {/* Booking/Actions Column */}
                        <div className="flex flex-row md:flex-col gap-3 shrink-0 w-full md:w-56 md:border-l md:border-gray-100 md:pl-6 justify-center pt-4 md:pt-0" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => setSelectedDoc(doc)}
                            className="flex-grow py-3 text-center bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-[11px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-sm hover:shadow"
                          >
                            Book Appointment
                          </button>
                          <button
                            onClick={() => setActiveConsultation(doc)}
                            className="py-3 px-5 bg-brand-orange hover:bg-orange-600 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-brand-orange/20 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-103"
                          >
                            <Video className="h-4 w-4" />
                            Consult Now
                          </button>
                        </div>

                      </div>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          )}

          {/* Interactive Doctor Profile Side-Drawer */}
          {activeProfileDoc && (
            <div 
              className="fixed inset-0 bg-black/40 backdrop-blur-xs flex justify-end z-50 p-0"
              onClick={() => setActiveProfileDoc(null)}
            >
              <div 
                className="bg-white w-full max-w-xl h-full shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 translate-x-0 relative border-l border-gray-100"
                onClick={(e) => e.stopPropagation()}
              >
                
                {/* Close Button */}
                <button 
                  onClick={() => setActiveProfileDoc(null)}
                  className="absolute top-5 right-5 text-gray-400 hover:text-gray-600 cursor-pointer h-8 w-8 rounded-full border border-gray-100 flex items-center justify-center bg-gray-50"
                >
                  <X className="h-4 w-4" />
                </button>

                <div className="space-y-6">
                  
                  {/* Doctor Profile Banner */}
                  <div className="flex gap-4 items-center border-b border-gray-100 pb-5">
                    <img 
                      src={activeProfileDoc.image} 
                      alt={activeProfileDoc.name}
                      className="h-20 w-20 rounded-2xl object-cover border border-gray-200 shrink-0"
                    />
                    <div>
                      <span className="px-2 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-[8px] font-extrabold uppercase tracking-widest inline-block mb-1">
                        {activeProfileDoc.availability}
                      </span>
                      <h2 className="text-lg font-black text-brand-dark flex items-center gap-1.5">
                        {activeProfileDoc.name}
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      </h2>
                      <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">{activeProfileDoc.specialty}</p>
                    </div>
                  </div>

                  {/* Certifications and credentials list */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-[#FFFBF9] border border-brand-orange/10 rounded-xl flex items-center gap-2">
                      <Award className="h-5 w-5 text-brand-orange shrink-0" />
                      <div>
                        <span className="text-[8px] text-gray-400 uppercase font-bold block">Council Reg ID</span>
                        <span className="text-[10px] text-gray-700 font-extrabold">{doctorMetadata[activeProfileDoc.id]?.mci || "MCI-PENDING"}</span>
                      </div>
                    </div>
                    <div className="p-3 bg-[#FFFBF9] border border-brand-orange/10 rounded-xl flex items-center gap-2">
                      <Shield className="h-5 w-5 text-brand-orange shrink-0" />
                      <div>
                        <span className="text-[8px] text-gray-400 uppercase font-bold block">Accreditation</span>
                        <span className="text-[10px] text-gray-700 font-extrabold">NABL Certified</span>
                      </div>
                    </div>
                  </div>

                  {/* Academic Details */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Medical Affiliation</h3>
                    <div className="space-y-2 text-xs">
                      <div className="flex items-start gap-2.5">
                        <Award className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-gray-700 block">Alumnus Medical College</span>
                          <span className="text-gray-500 text-[10.5px]">{doctorMetadata[activeProfileDoc.id]?.college || "Madras Medical College"}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Activity className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-gray-700 block">Associated Clinical Node</span>
                          <span className="text-gray-500 text-[10.5px]">{doctorMetadata[activeProfileDoc.id]?.hospital || "Avenix Apex Hospital Node"}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2.5">
                        <Clock className="h-4 w-4 text-brand-orange shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-gray-700 block">Consultation Fee</span>
                          <span className="text-brand-dark text-[10.5px] font-extrabold">₹{activeProfileDoc.fees} per session slot</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Reviews List */}
                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Patient Success Reviews</h3>
                    <div className="space-y-3">
                      {(doctorMetadata[activeProfileDoc.id]?.reviews || []).map((rev, index) => (
                        <div key={index} className="p-3 bg-gray-50 border border-gray-100 rounded-2xl text-[10.5px] space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="font-extrabold text-gray-700">{rev.name}</span>
                            <span className="text-[8px] text-gray-400">{rev.date}</span>
                          </div>
                          <div className="flex items-center text-amber-500 gap-0.5">
                            {[...Array(rev.rating)].map((_, i) => (
                              <Star key={i} className="h-3 w-3 fill-amber-400 stroke-none" />
                            ))}
                          </div>
                          <p className="text-gray-500 leading-normal">{rev.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Booking Trigger directly inside Drawer */}
                <div className="pt-6 border-t border-gray-100 mt-6 space-y-3">
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedDoc(activeProfileDoc)}
                      className="flex-1 py-3 bg-brand-dark hover:bg-brand-dark/90 text-white text-xs font-bold rounded-xl transition-all cursor-pointer text-center"
                    >
                      Book Telehealth Calendar
                    </button>
                    <button 
                      onClick={() => {
                        const doc = activeProfileDoc;
                        setActiveProfileDoc(null);
                        setActiveConsultation(doc);
                      }}
                      className="py-3 px-5 bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md shadow-brand-orange/15"
                    >
                      <Video className="h-4 w-4" />
                      Consult Now
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Booking Modal Drawer */}
          {selectedDoc && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-2xl glass-card max-w-md w-full relative">
                
                <button 
                  onClick={() => setSelectedDoc(null)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>

                <div className="space-y-4">
                  <div className="text-center space-y-1">
                    <HeartHandshake className="h-7 w-7 text-brand-orange mx-auto" />
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Schedule Consultation</h3>
                    <h2 className="text-md font-black text-brand-dark">{selectedDoc.name}</h2>
                    <p className="text-[10px] text-gray-400">{selectedDoc.specialty} &middot; ₹{selectedDoc.fees} Session Fee</p>
                  </div>

                  {bookingSuccess ? (
                    <div className="py-6 text-center space-y-2 bg-green-50 border border-green-200 rounded-2xl text-green-700">
                      <ShieldCheck className="h-8 w-8 mx-auto text-green-600 animate-bounce" />
                      <h4 className="text-xs font-bold uppercase tracking-wider">APPOINTMENT SECURED</h4>
                      <p className="text-[10px] leading-relaxed">Slot registered. Consultation links have been dispatched to your Customer portal.</p>
                    </div>
                  ) : (
                    <form onSubmit={handleBook} className="space-y-4">
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

                      {/* Date selection */}
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-extrabold text-gray-400 uppercase tracking-wider block">
                          Appointment Date
                        </label>
                        <input
                          type="date"
                          required
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                        />
                      </div>

                      {/* Time slot picker */}
                      <div className="space-y-1">
                        <label className="text-[9.5px] font-extrabold text-gray-400 uppercase tracking-wider block">
                          Available Timeslot
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                          {["10:00 AM - 10:30 AM", "02:00 PM - 02:30 PM", "04:30 PM - 05:00 PM", "07:00 PM - 07:30 PM"].map((slot) => (
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
                        Secured Appointment Booking
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

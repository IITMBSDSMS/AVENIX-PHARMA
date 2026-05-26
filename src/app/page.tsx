"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState, Medicine } from "@/context/AppState";
import { 
  ArrowRight, ShieldCheck, Zap, Sparkles, PhoneCall, 
  Search, UploadCloud, HeartHandshake, CheckCircle2,
  Calendar, FileText, ChevronRight, Activity, Bell,
  Star, Plus, Check, ChevronLeft, Heart, TrendingUp, Share2, Play,
  Mail, Globe, Phone
} from "lucide-react";

// Real clinical/pharmacy product images from Unsplash
const MEDICINE_IMAGES: Record<string, string> = {
  "1": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=600",
  "2": "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=600",
  "3": "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600",
  "4": "https://images.unsplash.com/photo-1576671081837-49000212a370?auto=format&fit=crop&q=80&w=600",
  "5": "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=600",
  "6": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=600",
};

// Health concern category images
const CONCERN_IMAGES: Record<string, string> = {
  pain: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200",
  diabetes: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=200",
  cardiac: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=200",
  stomach: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=200",
  allergy: "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=200",
  antibiotics: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=200",
};



// Floating pill SVG animation component
function FloatingPill({ className, delay = 0 }: { className?: string; delay?: number }) {
  return (
    <svg
      className={`absolute pointer-events-none select-none opacity-20 ${className}`}
      style={{ animationDelay: `${delay}s` }}
      viewBox="0 0 40 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" y="0.5" width="39" height="17" rx="8.5" fill="#FF6B00" stroke="#FF6B00" strokeOpacity="0.3" />
      <line x1="20" y1="0" x2="20" y2="18" stroke="white" strokeOpacity="0.5" strokeWidth="1" />
    </svg>
  );
}

// Animated heartbeat SVG
function HeartbeatLine({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 60" className={`${className}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <polyline
        points="0,30 30,30 40,10 50,50 60,5 70,55 80,30 110,30 120,20 130,40 140,30 200,30"
        stroke="#FF6B00"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse"
      />
    </svg>
  );
}

// Animated DNA helix SVG badge
function DNABadge() {
  return (
    <svg viewBox="0 0 60 80" className="h-16 w-10 text-brand-orange" fill="none" xmlns="http://www.w3.org/2000/svg">
      {[0, 10, 20, 30, 40, 50, 60, 70].map((y, i) => (
        <React.Fragment key={y}>
          <ellipse cx={i % 2 === 0 ? 15 : 45} cy={y + 5} rx="10" ry="4" fill="#FF6B00" fillOpacity={0.2 + i * 0.05} />
          <ellipse cx={i % 2 === 0 ? 45 : 15} cy={y + 5} rx="10" ry="4" fill="#FF6B00" fillOpacity={0.1 + i * 0.04} />
          {i < 7 && (
            <line x1={i % 2 === 0 ? 15 : 45} y1={y + 5} x2={i % 2 === 0 ? 45 : 15} y2={y + 5} stroke="#FF6B00" strokeOpacity="0.3" strokeWidth="1.5" />
          )}
        </React.Fragment>
      ))}
    </svg>
  );
}

// Pulsing Shield SVG
function ShieldSVG({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 6V12C3 17.5 7 22.5 12 24C17 22.5 21 17.5 21 12V6L12 2Z" fill="#FF6B00" fillOpacity="0.15" stroke="#FF6B00" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9 12L11 14L15 10" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MockMedicineItem({ med, onAdd }: { med: any; onAdd: () => void }) {
  const [added, setAdded] = useState(false);
  return (
    <div className="p-1.5 bg-white border border-gray-100 rounded-lg flex items-center justify-between shadow-xs">
      <div className="space-y-0.5 text-left">
        <h4 className="text-[7.5px] font-black text-gray-800 leading-tight">{med.name}</h4>
        <p className="text-[5px] text-gray-400 font-semibold">{med.strength} &bull; {med.desc}</p>
        <p className="text-[6.5px] font-black text-[#FF6B00]">₹{med.price}</p>
      </div>
      <button
        onClick={() => {
          onAdd();
          setAdded(true);
          setTimeout(() => setAdded(false), 1000);
        }}
        className={`h-5 px-2 text-[6px] font-black rounded-md transition-all cursor-pointer ${
          added ? "bg-emerald-500 text-white" : "bg-[#FFF0EB] hover:bg-[#FFE5DC] text-[#FF6B00]"
        }`}
      >
        {added ? "Added ✓" : "+ Add"}
      </button>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const { 
    medicines, cart, addToCart, uploadPrescriptionScan, 
    diagnostics, login, role,
    banners, testimonials, categories
  } = useAppState();

  const [activeBanner, setActiveBanner] = useState(0);
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [rxFileName, setRxFileName] = useState("");

  // Mobile app interactive simulation states
  const [leftScreen, setLeftScreen] = useState<"home" | "medicines" | "consult" | "scanner" | "success">("home");
  const [leftCartCount, setLeftCartCount] = useState(0);
  const [leftScanState, setLeftScanState] = useState<"idle" | "scanning" | "result">("idle");
  const [leftConsultState, setLeftConsultState] = useState<"idle" | "calling">("idle");
  const [leftSelectedDoctor, setLeftSelectedDoctor] = useState<string | null>(null);

  const [rightScreen, setRightScreen] = useState<"labs" | "details" | "chat" | "profile">("labs");
  const [rightSelectedLab, setRightSelectedLab] = useState<{title: string; desc: string; color: string; img: string} | null>(null);
  const [rightSelectedSlot, setRightSelectedSlot] = useState<string>("8:00 AM");
  const [rightBookingStep, setRightBookingStep] = useState<"idle" | "success">("idle");
  const [chatMessages, setChatMessages] = useState<Array<{sender: "user" | "ai"; text: string}>>([
    { sender: "ai", text: "Hello! I am your Avenix AI Health Assistant. Ask me anything about symptoms, medicines, or orders." }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const spotlightIds = ["7", "6", "1", "2", "3", "4", "5"];
  const spotlightMedicines = spotlightIds
    .map(id => medicines.find(m => m.id === id))
    .filter(Boolean) as Medicine[];

  const blogList = [
    { 
      title: "5 Tips to Manage Blood Sugar Levels", tag: "DIABETES", time: "4 mins read", 
      desc: "Simple dietary amendments and activity regimes to maintain glycemic index wellness.",
      img: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&q=80&w=600"
    },
    { 
      title: "Understanding Hypertension & Arterial Health", tag: "CARDIAC CARE", time: "5 mins read", 
      desc: "Exploring cardiac markers, lifestyle triggers, and screenings for vascular safety.",
      img: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&q=80&w=600"
    },
    { 
      title: "Managing Acidity: Antacids vs. Diet Control", tag: "STOMACH HEALTH", time: "3 mins read", 
      desc: "How proton pump inhibitors operate and how triggers can be managed via nutrition.",
      img: "https://images.unsplash.com/photo-1607619056574-7b8d3ee536b2?auto=format&fit=crop&q=80&w=600"
    }
  ];

  const brandLogos = [
    {
      name: "Cipla Pharmaceuticals",
      logo: (
        <svg viewBox="0 0 160 50" className="h-8 w-auto text-brand-dark transition-all duration-300">
          <text x="15" y="32" fill="#0F3B84" fontSize="24" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5">Cipla</text>
          <path d="M14 38 C 45 43, 85 42, 120 35" stroke="#D32F2F" strokeWidth="3" strokeLinecap="round" fill="none" />
          <polygon points="105,10 111,18 101,18" fill="#D32F2F" />
        </svg>
      )
    },
    {
      name: "Micro Labs Limited",
      logo: (
        <svg viewBox="0 0 180 50" className="h-8 w-auto text-brand-dark transition-all duration-300">
          <g transform="translate(5, 5)">
            <circle cx="20" cy="20" r="14" stroke="#005691" strokeWidth="2.5" fill="none" />
            <ellipse cx="20" cy="20" rx="14" ry="5" stroke="#005691" strokeWidth="2" fill="none" transform="rotate(45 20 20)" />
            <ellipse cx="20" cy="20" rx="14" ry="5" stroke="#0088CC" strokeWidth="2" fill="none" transform="rotate(-45 20 20)" />
            <circle cx="20" cy="20" r="3.5" fill="#0088CC" />
          </g>
          <text x="50" y="24" fill="#005691" fontSize="15" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="0.5">MICRO LABS</text>
          <text x="50" y="36" fill="#777777" fontSize="8" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1">LIMITED</text>
        </svg>
      )
    },
    {
      name: "Sun Pharma Industries",
      logo: (
        <svg viewBox="0 0 190 50" className="h-8 w-auto text-brand-dark transition-all duration-300">
          <g transform="translate(10, 8)">
            <circle cx="17" cy="17" r="14" stroke="#F39C12" strokeWidth="1" fill="none" opacity="0.2" />
            <path d="M17,17 A5,5 0 0,0 22,12 A10,10 0 0,0 12,12 A15,15 0 0,0 17,32" stroke="#E67E22" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M17,17 A3,3 0 0,1 14,20 A7,7 0 0,1 24,20 A12,12 0 0,1 17,29" stroke="#F39C12" strokeWidth="2" fill="none" strokeLinecap="round" />
            <circle cx="17" cy="17" r="2.5" fill="#E67E22" />
          </g>
          <text x="52" y="24" fill="#1C2833" fontSize="16" fontWeight="800" fontFamily="serif, system-ui, -apple-system" letterSpacing="0.5">SUN</text>
          <text x="52" y="37" fill="#E67E22" fontSize="11" fontWeight="700" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1">PHARMA</text>
        </svg>
      )
    },
    {
      name: "USV Private Limited",
      logo: (
        <svg viewBox="0 0 160 50" className="h-8 w-auto text-brand-dark transition-all duration-300">
          <g transform="translate(10, 8)">
            <path d="M4,0 L20,0 C20,0 24,12 20,20 C16,25 12,28 12,28 C12,28 8,25 4,20 C0,12 4,0 4,0 Z" fill="#0A3B5C" />
            <path d="M6,2 L18,2 C18,2 21,11 18,18 C15,22 12,24 12,24 C12,24 9,22 6,18 C3,11 6,2 6,2 Z" fill="#00A896" />
            <circle cx="12" cy="10" r="3.5" fill="white" />
          </g>
          <text x="46" y="33" fill="#0A3B5C" fontSize="24" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1">USV</text>
        </svg>
      )
    },
    {
      name: "GlaxoSmithKline",
      logo: (
        <svg viewBox="0 0 160 50" className="h-8 w-auto text-brand-dark transition-all duration-300">
          <g transform="translate(10, 4)">
            <path d="M6,21 C6,9 18,2 29,11 C40,20 42,32 30,38 C18,44 6,33 6,21 Z" fill="#F36C21" />
            <text x="13" y="27" fill="white" fontSize="14" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="-0.5">gsk</text>
          </g>
          <text x="56" y="31" fill="#F36C21" fontSize="18" fontWeight="900" fontFamily="system-ui, -apple-system, sans-serif" letterSpacing="1">GSK</text>
        </svg>
      )
    }
  ];

  useEffect(() => {
    if (banners.length === 0) return;
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRxFileName(file.name);
      setPrescriptionUploaded(true);
      uploadPrescriptionScan(file.name);
      setTimeout(() => {
        router.push("/prescription-ai");
      }, 1000);
    }
  };

  const [activeFilter, setActiveFilter] = useState("All Wellness");

  const categoryFilterMap: Record<string, string> = {
    "Pain Relief": "ANALGESICS",
    "Allergy Care": "ANTIHISTAMINES",
    "Antibiotics": "ANTIBIOTICS",
    "Heart Health": "CARDIOVASCULAR",
    "Diabetes Care": "GASTROINTESTINAL"
  };

  const filteredTrending = medicines.filter(med => {
    if (activeFilter === "All Wellness") return true;
    const targetSub = categoryFilterMap[activeFilter];
    return med.subCategory === targetSub;
  }).slice(0, 6);

  return (
    <>
      <Navbar />
      
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-brand-orange/4 blur-[140px] pointer-events-none" />
      <div className="fixed top-[500px] right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-brand-orange/3 blur-[160px] pointer-events-none" />

      {/* Floating pills — hidden on mobile for performance */}
      <FloatingPill className="top-32 right-[5%] w-10 animate-bounce hidden lg:block" delay={0} />
      <FloatingPill className="top-64 left-[3%] w-8 rotate-45 animate-bounce hidden lg:block" delay={1.5} />
      <FloatingPill className="top-96 right-[10%] w-6 -rotate-12 animate-bounce hidden xl:block" delay={3} />

      <main className="flex-grow pb-16 font-sans selection:bg-brand-orange selection:text-white">

        {/* Full-Width Banner + Prescription Upload Row */}
        <div className="w-full border-y border-gray-200 bg-white grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch overflow-hidden mt-0">
          
          {/* Banner Carousel (col-span-9) */}
          <div className="lg:col-span-9 relative h-64 sm:h-80 md:h-[400px] lg:h-[480px] bg-gray-900 flex flex-col justify-between p-6 sm:p-10 md:p-12 overflow-hidden">
            {/* Banner BG image */}
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-35 z-0 transition-all duration-1000" 
              style={{ backgroundImage: `url(${banners[activeBanner].img})` }} 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10" />

            {/* SVG Heartbeat decoration */}
            <div className="absolute bottom-16 right-20 opacity-30 z-10 w-48">
              <HeartbeatLine />
            </div>

            {/* DNA decoration */}
            <div className="absolute top-6 right-10 opacity-20 z-10">
              <DNABadge />
            </div>

            <div className="relative z-20 space-y-5 max-w-3xl my-auto text-left">
              {/* Animated badge */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-brand-orange uppercase tracking-[0.20em] bg-brand-orange/10 border border-brand-orange/25 px-3.5 py-1.5 rounded-full flex items-center gap-1.5">
                  <svg className="w-2.5 h-2.5 animate-spin" viewBox="0 0 10 10" fill="none">
                    <path d="M5 1 L5 2.5 M5 9 L5 7.5 M1 5 L2.5 5 M9 5 L7.5 5" stroke="#FF6B00" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="5" cy="5" r="2" fill="#FF6B00" fillOpacity="0.4" />
                  </svg>
                  {banners[activeBanner].badge}
                </span>
              </div>

              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight font-poppins">
                {banners[activeBanner].title}
              </h2>
              <p className="text-sm sm:text-base md:text-lg text-gray-300 font-medium leading-relaxed max-w-2xl">
                {banners[activeBanner].desc}
              </p>
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-black text-brand-orange uppercase tracking-wider">{banners[activeBanner].cta}</span>
                <Link 
                  href={banners[activeBanner].link} 
                  className="px-6 py-2.5 bg-brand-orange hover:bg-orange-600 text-white text-xs font-black uppercase rounded-full shadow-lg shadow-brand-orange/25 transition-all hover:scale-105 hover:shadow-brand-orange/40"
                >
                  {banners[activeBanner].btnText}
                </Link>
              </div>
            </div>

            {/* Nav dots */}
            <div className="relative z-20 flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <div className="flex items-center space-x-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveBanner(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeBanner === idx ? "w-8 bg-brand-orange" : "w-1.5 bg-gray-600 hover:bg-gray-400"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2 text-white/40 text-[10px] font-bold font-mono">
                <span>0{activeBanner + 1}</span>
                <span>/</span>
                <span>0{banners.length}</span>
              </div>
            </div>
          </div>

          {/* Prescription Quick-Order Card (col-span-3) */}
          <div className="lg:col-span-3 p-7 sm:p-8 flex flex-col justify-between bg-white border-t lg:border-t-0 lg:border-l border-gray-200 relative overflow-hidden h-[400px] sm:h-[480px]">
            {/* Background pattern */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.03]" viewBox="0 0 200 200">
              {Array.from({length: 5}).map((_, i) => (
                <React.Fragment key={i}>
                  <circle cx={40 * i} cy={50} r="15" fill="#FF6B00" />
                  <circle cx={40 * i + 20} cy={130} r="10" fill="#FF6B00" />
                </React.Fragment>
              ))}
            </svg>

            <div className="space-y-4 relative z-10 text-left">
              <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center">
                  <FileText className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-wide">Quick Order with Rx</h3>
                  <p className="text-[9px] text-gray-500 font-semibold">Upload prescription & let us handle it</p>
                </div>
              </div>

              <ul className="space-y-2 text-[10px] font-medium text-gray-500">
                <li className="flex items-center gap-1.5">
                  <ShieldSVG size={14} />
                  AI parses medicines instantly
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldSVG size={14} />
                  R.Ph Pharmacists verify safety
                </li>
                <li className="flex items-center gap-1.5">
                  <ShieldSVG size={14} />
                  Priority same-day rider dispatch
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100 relative z-10">
              {prescriptionUploaded ? (
                <div className="py-2.5 bg-green-50 border border-green-200 text-green-700 text-xs font-bold rounded-xl text-center flex items-center justify-center gap-1.5 animate-pulse">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span>Rx Attached: {rxFileName.slice(0, 15)}...</span>
                </div>
              ) : (
                <label className="w-full py-2.5 bg-brand-orange hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-orange/15 flex items-center justify-center gap-1.5 cursor-pointer hover:scale-[1.01]">
                  <UploadCloud className="h-4 w-4" />
                  <span>UPLOAD PRESCRIPTION</span>
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handlePrescriptionUpload}
                    className="hidden"
                  />
                </label>
              )}
              
              <div className="flex items-center justify-between text-[9px] font-bold">
                <span className="text-gray-400">No prescription?</span>
                <Link href="/doctors" className="text-brand-orange hover:underline flex items-center gap-0.5">
                  Consult Online Doctor <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Platform branding strip */}
        <div className="w-full bg-white border-b border-gray-200 py-3 text-center select-none">
          <h1 className="text-xs sm:text-sm font-extrabold text-brand-dark tracking-wide font-poppins">
            Avenix Pharmaceuticals: India's Leading Online Pharmacy & Healthcare Platform
          </h1>
        </div>

        {/* Care Plan Banner */}
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-10 mt-6">
          <div className="bg-[#FFEEDA] border border-orange-200/50 rounded-3xl p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm overflow-hidden relative">
            {/* Animated wave pattern */}
            <svg className="absolute right-0 top-0 bottom-0 h-full opacity-10" viewBox="0 0 200 100" preserveAspectRatio="none">
              <path d="M0,50 C30,20 70,80 100,50 C130,20 170,80 200,50 L200,100 L0,100 Z" fill="#FF6B00" />
            </svg>

            <div className="flex items-center gap-5 w-full md:w-auto">
              <div className="relative shrink-0 hidden sm:block">
                <div className="absolute inset-0 bg-brand-orange/10 rounded-full blur-md" />
                <svg viewBox="0 0 120 120" className="h-20 w-20 relative z-10 select-none">
                  <circle cx="60" cy="60" r="50" fill="#FFE5D9" />
                  <circle cx="60" cy="45" r="18" fill="#FAD2E1" />
                  <path d="M42 45c0-12 8-18 18-18s18 6 18 18c0 1-.5 2-1 3-2-8-8-12-17-12s-15 4-17 12c-.5-1-1-2-1-3z" fill="#B0B0B0" />
                  <rect x="47" y="41" width="10" height="6" rx="2.5" fill="none" stroke="#121212" strokeWidth="1.5" />
                  <rect x="63" y="41" width="10" height="6" rx="2.5" fill="none" stroke="#121212" strokeWidth="1.5" />
                  <line x1="57" y1="44" x2="63" y2="44" stroke="#121212" strokeWidth="1.5" />
                  <path d="M55 52c2 1.5 8 1.5 10 0" fill="none" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" />
                  <path d="M30 92c0-15 12-25 30-25s30 10 30 25v10H30V92z" fill="#FF6B00" />
                  <path d="M48 68l12 10 12-10" fill="none" stroke="#FFE5D9" strokeWidth="2.5" />
                </svg>
              </div>

              <div className="space-y-1 text-left">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 bg-[#8A252C] text-white text-[9px] font-black uppercase rounded-md tracking-wider">
                    Care Plan
                  </span>
                  <span className="text-[10px] sm:text-xs font-bold text-gray-600">
                    now starting at <strong className="text-gray-900 font-extrabold">₹165</strong> for 3 months
                  </span>
                </div>
                <h2 className="text-xs sm:text-sm font-black text-gray-900 leading-snug">
                  Get extra 5% savings on your orders. Free shipping, same-day delivery and more.
                </h2>
                <p className="text-[10px] text-gray-500 font-semibold">
                  Become a member today!
                </p>
              </div>
            </div>

            <div className="shrink-0 w-full md:w-auto relative z-10">
              <Link 
                href="/delivery" 
                className="w-full md:w-auto px-7 py-2.5 bg-[#8A252C] hover:bg-[#721F25] text-white text-xs font-black uppercase tracking-wide rounded-xl shadow-sm transition-colors block text-center cursor-pointer"
              >
                Know More
              </Link>
            </div>
          </div>
        </div>

        {/* Main Content Container */}
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-10 space-y-12 pt-8">
          
          {/* Quick Service Circles */}
          {/* 2-cols on phone, 4 on small tablet, 7 on desktop */}
          <div className="grid grid-cols-4 sm:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-5 md:gap-8">
            {[
              { name: "Medicines", icon: Search, href: "/delivery", color: "bg-orange-50 border-orange-200 text-brand-orange" },
              { name: "Lab Tests", icon: Calendar, href: "/diagnostics", color: "bg-blue-50 border-blue-200 text-blue-600" },
              { name: "Ask Doctor", icon: HeartHandshake, href: "/doctors", color: "bg-green-50 border-green-200 text-green-600" },
              { name: "AI Assistant", icon: Activity, href: "/assistant", color: "bg-purple-50 border-purple-200 text-purple-600" },
              { name: "AI Scanner", icon: FileText, href: "/prescription-ai", color: "bg-yellow-50 border-yellow-200 text-yellow-600" },
              { name: "Emergency", icon: Zap, href: "/emergency", color: "bg-red-50 border-red-200 text-red-600" },
              { name: "Verify", icon: ShieldCheck, href: "/verify", color: "bg-teal-50 border-teal-200 text-teal-600" },
            ].map((service) => (
              <Link 
                key={service.name} 
                href={service.href}
                className="group flex flex-col items-center gap-1.5 sm:gap-2 text-center"
              >
                <div className={`h-12 w-12 sm:h-14 sm:w-14 lg:h-16 lg:w-16 rounded-full border-2 ${service.color} flex items-center justify-center shadow-sm group-hover:scale-110 transition-all group-hover:shadow-md cursor-pointer`}>
                  <service.icon className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 group-hover:rotate-6 transition-transform" />
                </div>
                <span className="text-[9px] sm:text-[10px] font-bold text-gray-700 leading-tight max-w-[56px] sm:max-w-full text-center">
                  {service.name}
                </span>
              </Link>
            ))}
          </div>

          {/* Shop by Health Concerns */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                {/* Animated sparkle SVG */}
                <svg className="h-5 w-5 text-brand-orange" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.5 9.5L21 11L13.5 12.5L12 20L10.5 12.5L3 11L10.5 9.5L12 2Z" fill="#FF6B00" fillOpacity="0.8">
                    <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="8s" repeatCount="indefinite" />
                  </path>
                </svg>
                Shop by Health Concerns
              </h3>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 sm:gap-8 justify-items-center py-4">
              {categories.map(concern => (
                <Link
                  key={concern.id}
                  href={`/delivery?concern=${concern.id}`}
                  className="group flex flex-col items-center gap-3 cursor-pointer max-w-[120px]"
                >
                  {/* Large Circle Logo */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-white border-2 border-gray-100/80 shadow-[0_4px_12px_rgba(0,0,0,0.03)] group-hover:border-[#FF6B00]/60 group-hover:shadow-[0_6px_20px_rgba(255,107,0,0.15)] flex items-center justify-center shrink-0 transition-all duration-300 transform group-hover:-translate-y-1">
                    <img src={concern.img} alt={concern.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <span className="text-[11.5px] sm:text-[12px] font-black text-gray-700 tracking-tight group-hover:text-[#FF6B00] transition-colors text-center leading-snug">
                    {concern.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Trending Medicines - HIGH-END CLINICAL CATALOG */}
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-100 pb-5">
              <div>
                <span className="text-[10px] font-black text-brand-orange uppercase tracking-[0.2em] block mb-1">
                  ONLINE MEDICINE HOUSE
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-gray-900 font-poppins">
                  Trending Pharmacy & Wellness Catalog
                </h3>
              </div>
              <Link href="/delivery" className="text-xs text-brand-orange hover:underline font-bold flex items-center gap-0.5 self-start md:self-auto">
                Explore Store <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            {/* Filter pills bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {["All Wellness", "Pain Relief", "Allergy Care", "Antibiotics", "Heart Health", "Diabetes Care"].map((filterName) => (
                <button
                  key={filterName}
                  onClick={() => setActiveFilter(filterName)}
                  className={`px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer whitespace-nowrap ${
                    activeFilter === filterName
                      ? "bg-brand-orange text-white border-brand-orange shadow-md shadow-brand-orange/15"
                      : "bg-white text-gray-600 border-gray-200 hover:border-brand-orange/30"
                  }`}
                >
                  {filterName}
                </button>
              ))}
            </div>
            
            {/* Catalog Grid: 3-cols on desktop like the screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTrending.map((med) => {
                const medImg = med.image || "/images/med_paracetamol.jpg";
                const discount = med.originalPrice 
                  ? Math.round(((med.originalPrice - med.price) / med.originalPrice) * 100)
                  : 20;

                return (
                  <div 
                    key={med.id}
                    className="bg-white border border-gray-100 rounded-[24px] flex flex-col justify-between relative overflow-hidden group hover:scale-[1.015] hover:shadow-xl transition-all duration-300 shadow-sm p-4 sm:p-5"
                  >
                    {/* Top tags row */}
                    <div className="flex justify-between items-center w-full mb-3 z-10">
                      <span className="px-2 py-0.5 bg-orange-100 text-brand-orange text-[9px] font-extrabold rounded-md">
                        {discount}% OFF
                      </span>
                      {med.requiresPrescription && (
                        <span className="px-2 py-0.5 bg-purple-50 text-[#8E44AD] text-[9px] font-black rounded-md flex items-center gap-1">
                          <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                            <polyline points="10 9 9 9 8 9" />
                          </svg>
                          Rx
                        </span>
                      )}
                    </div>

                    {/* Isolated packshot image */}
                    <div className="w-full h-40 bg-white flex items-center justify-center overflow-hidden mb-4 rounded-xl">
                      <img 
                        src={medImg} 
                        alt={med.name} 
                        className="w-auto h-full max-h-36 object-contain group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>

                    {/* Meta descriptions */}
                    <div className="space-y-1 text-left flex-grow">
                      <span className="text-[9px] font-black text-[#8E44AD]/80 uppercase tracking-widest block">
                        {med.subCategory || "WELLNESS"}
                      </span>
                      <h4 className="text-sm font-extrabold text-gray-900 leading-snug group-hover:text-brand-orange transition-colors">
                        {med.name}
                      </h4>
                      <span className="text-[10px] font-semibold text-gray-400 italic block">
                        {med.scientificName || med.tagline}
                      </span>
                      <p className="text-[10px] text-gray-500 font-medium leading-relaxed line-clamp-2 pt-1">
                        {med.description || med.tagline}
                      </p>
                      <span className="text-[9px] text-gray-400 font-bold block pt-1">
                        {med.manufacturer}
                      </span>
                    </div>

                    {/* Footer price & Add to cart button */}
                    <div className="flex items-end justify-between pt-4 mt-3 border-t border-gray-50">
                      <div className="space-y-0.5 text-left">
                        <span className="text-[8px] text-gray-400 font-bold block leading-none">
                          Inclusive of taxes
                        </span>
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-base font-black text-brand-dark">₹{med.price.toFixed(2)}</span>
                          {med.originalPrice && (
                            <span className="text-xs text-gray-400 line-through">₹{med.originalPrice}</span>
                          )}
                        </div>
                      </div>

                      <button
                        onClick={() => addToCart(med, 1)}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-brand-orange hover:bg-orange-600 text-white text-[10px] font-bold uppercase transition-all shadow-sm cursor-pointer hover:scale-[1.02]"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Featured Lab Test Packages */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                {/* Animated cross/medical SVG */}
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <rect x="2" y="2" width="20" height="20" rx="5" fill="#FF6B00" fillOpacity="0.12" stroke="#FF6B00" strokeWidth="1.5">
                    <animate attributeName="fill-opacity" values="0.12;0.25;0.12" dur="2s" repeatCount="indefinite" />
                  </rect>
                  <path d="M12 7V17M7 12H17" stroke="#FF6B00" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Featured Diagnostics Lab Packages
              </h3>
              <Link href="/diagnostics" className="text-xs text-brand-orange hover:underline font-bold flex items-center gap-0.5">
                View All Packages <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {diagnostics.slice(0, 3).map((diag) => {
                const coverImg = diag.image || "/images/lab_fullbody.png";
                return (
                  <div key={diag.id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex flex-col hover:border-brand-orange/35 hover:shadow-lg transition-all shadow-xs group">
                    {/* Diagnostic photo header */}
                    <div className="w-full h-36 overflow-hidden relative bg-gray-50">
                      <img src={coverImg} alt={diag.name} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent" />
                      <span className="absolute top-3 right-3 bg-[#00B894] text-white text-[9px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-sm">{diag.testsCount} Tests</span>
                    </div>
                    <div className="p-4 flex flex-col justify-between flex-grow space-y-3">
                      <div className="space-y-1.5">
                        <h4 className="text-sm sm:text-base font-extrabold text-gray-900 leading-snug">{diag.name}</h4>
                        <p className="text-[11px] leading-relaxed text-gray-500 font-medium">{diag.description}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-baseline space-x-1.5">
                          <span className="text-base font-black text-gray-900">₹{diag.price}</span>
                          <span className="text-xs text-gray-400 line-through font-semibold">₹{diag.originalPrice}</span>
                        </div>
                        <Link 
                          href="/diagnostics"
                          className="bg-[#FFF0EB] hover:bg-[#FFE5DC] text-[#FF6B00] font-black text-[10px] tracking-wide rounded-xl px-4 py-2.5 transition-colors cursor-pointer"
                        >
                          Book Checkup
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ===== HEAR IT FROM OUR CUSTOMERS (YouTube Shorts style) ===== */}
          <div className="space-y-5">
            <div className="space-y-1">
              <h3 className="text-lg sm:text-xl font-black text-gray-900">Hear It From Our Customers</h3>
              <p className="text-sm text-gray-500">They saved more with the same trusted quality.</p>
            </div>

            {/* On mobile: horizontal scroll; on sm+: grid */}
            <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-5 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0 -mx-3 px-3 sm:mx-0 sm:px-0 snap-x snap-mandatory sm:snap-none">
              {testimonials.map((reel) => (
                <div 
                  key={reel.id}
                  className="relative rounded-2xl overflow-hidden group cursor-pointer hover:scale-[1.025] transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] shadow-md hover:shadow-2xl flex-none w-[72vw] sm:w-auto snap-center border border-white/10 group-hover:border-brand-orange/30"
                  style={{ aspectRatio: "9/14" }}
                >
                  {/* Diagonal Shine Effect Sweep */}
                  <div className="shine-sweep" />

                  {/* Thumbnail background */}
                  <img 
                    src={reel.thumbnail} 
                    alt={reel.title}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-[1.06] transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  />
                  
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0"
                    style={{ background: `linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.6) 70%, rgba(0,0,0,0.85) 100%)` }}
                  />

                  {/* Top header: channel info */}
                  <div className="absolute top-4 left-4 right-4 flex items-center gap-2 z-10">
                    <div className="h-7 w-7 rounded-full bg-brand-orange flex items-center justify-center shadow-md shrink-0">
                      {/* Avenix mini logo */}
                      <svg viewBox="0 0 20 20" className="h-4 w-4" fill="white">
                        <path d="M10 2L13 8H17L14 12L16 18L10 14L4 18L6 12L3 8H7L10 2Z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white text-[10px] font-bold leading-none">{reel.channel}</p>
                      <p className="text-white/60 text-[9px] leading-none mt-0.5">{reel.title.slice(0, 28)}...</p>
                    </div>
                  </div>

                  {/* Center play button (YouTube Shorts style) */}
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <div className="h-14 w-14 rounded-full bg-red-600 flex items-center justify-center shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.25,1,0.5,1)] scale-95 group-hover:scale-105 group-hover:bg-red-500 animate-play-pulse">
                      <Play className="h-6 w-6 text-white fill-white ml-0.5" />
                    </div>
                  </div>

                  {/* Bottom captions overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-10 space-y-2 translate-y-1.5 group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.25,1,0.5,1)]">
                    {/* Caption text overlay (like a subtitle) */}
                    <div className="bg-black/50 backdrop-blur-sm px-2.5 py-1.5 rounded-lg inline-block">
                      <p className="text-white text-xs font-bold">{reel.bottomCaption}</p>
                    </div>

                    {/* Bottom action row */}
                    <div className="flex items-end justify-between">
                      <div className="flex-1 pr-3">
                        <p className="text-white text-[10px] font-medium leading-snug line-clamp-2">
                          &ldquo;{reel.caption}&rdquo;
                        </p>
                      </div>
                      {/* Share icon */}
                      <div className="flex flex-col items-center gap-1">
                        <button className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors">
                          <Share2 className="h-4 w-4 text-white" />
                        </button>
                        <span className="text-white/70 text-[8px] font-bold">Share</span>
                      </div>
                    </div>
                  </div>

                  {/* Animated live indicator */}
                  <div className="absolute top-14 right-4 z-10 flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse" />
                    <span className="text-white/80 text-[8px] font-bold uppercase tracking-wider">Watch</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Partner Brands */}
          <div className="space-y-5">
            <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.97 16.97 21 12 21C7.03 21 3 16.97 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 12Z" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Featured Partner Brands
            </h3>
            
            <div className="relative w-full overflow-hidden py-2 bg-gray-50/40 rounded-2xl border border-gray-100">
              {/* Fade overlays */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/70 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/70 to-transparent z-10 pointer-events-none" />
              
              <div className="flex gap-0 w-max animate-marquee hover:[animation-play-state:paused] py-1.5">
                {/* Copy 1 */}
                <div className="flex gap-0 shrink-0">
                  {[...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos].map((brand, idx) => {
                    const brandQuery = brand.name.includes("Cipla")
                      ? "Cipla"
                      : brand.name.includes("Micro")
                      ? "Micro Labs"
                      : brand.name.includes("Sun")
                      ? "Sun Pharma"
                      : brand.name.includes("USV")
                      ? "USV"
                      : "GSK";
                    return (
                      <Link 
                        key={`brand-1-${idx}`} 
                        href={`/delivery?brand=${brandQuery}`}
                        className="h-16 w-44 mr-6 px-5 py-3 rounded-xl border border-gray-100 bg-white shadow-2xs hover:border-brand-orange/40 hover:shadow-xs transition-all flex items-center justify-center group cursor-pointer"
                      >
                        {brand.logo}
                      </Link>
                    );
                  })}
                </div>
                {/* Copy 2 */}
                <div className="flex gap-0 shrink-0" aria-hidden="true">
                  {[...brandLogos, ...brandLogos, ...brandLogos, ...brandLogos].map((brand, idx) => {
                    const brandQuery = brand.name.includes("Cipla")
                      ? "Cipla"
                      : brand.name.includes("Micro")
                      ? "Micro Labs"
                      : brand.name.includes("Sun")
                      ? "Sun Pharma"
                      : brand.name.includes("USV")
                      ? "USV"
                      : "GSK";
                    return (
                      <Link 
                        key={`brand-2-${idx}`} 
                        href={`/delivery?brand=${brandQuery}`}
                        className="h-16 w-44 mr-6 px-5 py-3 rounded-xl border border-gray-100 bg-white shadow-2xs hover:border-brand-orange/40 hover:shadow-xs transition-all flex items-center justify-center group cursor-pointer"
                      >
                        {brand.logo}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* In The Spotlight Section */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="#FF6B00" strokeWidth="2" />
                  <path d="M12 8V16M8 12H16" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" />
                </svg>
                In The Spotlight
              </h3>
            </div>

            <div className="relative w-full overflow-hidden py-2">
              {/* Fade overlays */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/50 to-transparent z-10 pointer-events-none" />
              
              <div className="flex gap-0 w-max animate-marquee-slow hover:[animation-play-state:paused] py-1.5">
                {/* Copy 1 */}
                <div className="flex gap-0 shrink-0">
                  {[...spotlightMedicines, ...spotlightMedicines, ...spotlightMedicines].map((prod, idx) => {
                    const discount = Math.round(((prod.originalPrice! - prod.price) / prod.originalPrice!) * 100);
                    return (
                      <div 
                        key={`spot-1-${prod.id}-${idx}`} 
                        className="w-[48vw] sm:w-[220px] mr-5 p-3.5 bg-white border border-gray-100 rounded-2xl flex flex-col justify-between shrink-0 hover:border-brand-orange/40 hover:shadow-lg transition-all shadow-2xs group relative"
                      >
                        <div className="space-y-3">
                          {/* Product Image Frame */}
                          <div className="w-full h-44 rounded-xl overflow-hidden bg-gray-50 relative flex items-center justify-center p-1">
                            <img 
                              src={prod.image} 
                              alt={prod.name} 
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg" 
                            />
                            
                            {/* Floating Heart Button */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); }}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-xs cursor-pointer z-10"
                            >
                              <Heart className="h-3.5 w-3.5 fill-transparent hover:fill-red-500" />
                            </button>

                            <span className="absolute top-2 left-2 bg-[#FF4C4C] text-white text-[7.5px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                              {discount}% Off
                            </span>
                          </div>

                          {/* Product details */}
                          <div className="space-y-1 text-left">
                            <h4 className="text-[12px] font-black text-gray-900 leading-snug line-clamp-2 min-h-[34px] group-hover:text-brand-orange transition-colors">
                              {prod.name}
                            </h4>
                            <p className="text-[9px] text-gray-400 font-bold block leading-none">
                              {prod.manufacturer}
                            </p>
                          </div>
                        </div>

                        {/* Price & Add to Cart button */}
                        <div className="flex items-end justify-between pt-3 mt-3 border-t border-gray-100">
                          <div className="space-y-0.5 text-left">
                            <div className="text-[8px] text-gray-400 font-semibold leading-none">
                              MRP <span className="line-through">₹{prod.originalPrice}</span>
                            </div>
                            <div className="flex items-baseline space-x-1">
                              <span className="text-sm font-black text-gray-900">₹{prod.price}</span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); addToCart(prod, 1); }}
                            className="flex items-center gap-1 px-3 py-2 bg-brand-orange hover:bg-orange-600 text-white text-[9.5px] font-black uppercase rounded-xl transition-all shadow-xs cursor-pointer hover:scale-105"
                          >
                            <Plus className="h-3 w-3" /> Add
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Copy 2 */}
                <div className="flex gap-0 shrink-0" aria-hidden="true">
                  {[...spotlightMedicines, ...spotlightMedicines, ...spotlightMedicines].map((prod, idx) => {
                    const discount = Math.round(((prod.originalPrice! - prod.price) / prod.originalPrice!) * 100);
                    return (
                      <div 
                        key={`spot-2-${prod.id}-${idx}`} 
                        className="w-[48vw] sm:w-[220px] mr-5 p-3.5 bg-white border border-gray-100 rounded-2xl flex flex-col justify-between shrink-0 hover:border-brand-orange/40 hover:shadow-lg transition-all shadow-2xs group relative"
                      >
                        <div className="space-y-3">
                          {/* Product Image Frame */}
                          <div className="w-full h-44 rounded-xl overflow-hidden bg-gray-50 relative flex items-center justify-center p-1">
                            <img 
                              src={prod.image} 
                              alt={prod.name} 
                              loading="lazy"
                              decoding="async"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 rounded-lg" 
                            />
                            
                            {/* Floating Heart Button */}
                            <button 
                              onClick={(e) => { e.stopPropagation(); }}
                              className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 backdrop-blur-xs text-gray-400 hover:text-red-500 hover:bg-white transition-all shadow-xs cursor-pointer z-10"
                            >
                              <Heart className="h-3.5 w-3.5 fill-transparent hover:fill-red-500" />
                            </button>

                            <span className="absolute top-2 left-2 bg-[#FF4C4C] text-white text-[7.5px] font-black uppercase px-2 py-0.5 rounded-md shadow-sm">
                              {discount}% Off
                            </span>
                          </div>

                          {/* Product details */}
                          <div className="space-y-1 text-left">
                            <h4 className="text-[12px] font-black text-gray-900 leading-snug line-clamp-2 min-h-[34px] group-hover:text-brand-orange transition-colors">
                              {prod.name}
                            </h4>
                            <p className="text-[9px] text-gray-400 font-bold block leading-none">
                              {prod.manufacturer}
                            </p>
                          </div>
                        </div>

                        {/* Price & Add to Cart button */}
                        <div className="flex items-end justify-between pt-3 mt-3 border-t border-gray-100">
                          <div className="space-y-0.5 text-left">
                            <div className="text-[8px] text-gray-400 font-semibold leading-none">
                              MRP <span className="line-through">₹{prod.originalPrice}</span>
                            </div>
                            <div className="flex items-baseline space-x-1">
                              <span className="text-sm font-black text-gray-900">₹{prod.price}</span>
                            </div>
                          </div>

                          <button
                            onClick={(e) => { e.stopPropagation(); addToCart(prod, 1); }}
                            className="flex items-center gap-1 px-3 py-2 bg-brand-orange hover:bg-orange-600 text-white text-[9.5px] font-black uppercase rounded-xl transition-all shadow-xs cursor-pointer hover:scale-105"
                          >
                            <Plus className="h-3 w-3" /> Add
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            {/* Horizontal Promo Banner Cards under Spotlight products */}
            <div className="flex gap-4 overflow-x-auto pb-4 pt-2 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory">
              {[
                { title: "Liver Detox Care", desc: "Supports healthy liver & promotes detoxification with 100% natural herbs.", bg: "from-emerald-600 to-teal-800", cta: "Shop Now", badge: "NATURAL" },
                { title: "Skin Health Defend", desc: "Anti-fungal & anti-bacterial protection to keep skin infections away.", bg: "from-lime-600 to-green-800", cta: "Explore Range", badge: "SKIN CLINIC" },
                { title: "Generic Wellness", desc: "Explore India's most advanced generic formulations. Flat 25% savings.", bg: "from-blue-600 to-indigo-800", cta: "View Products", badge: "AVENIX EXCLUSIVE" },
                { title: "Radiant Sun Defence", desc: "Broad spectrum SPF 50+ sunscreen. Protect skin from harsh UV rays.", bg: "from-amber-500 to-orange-700", cta: "Buy Sunscreen", badge: "SUN PROTECTION" },
                { title: "No Tobacco - Quit Today", desc: "Nicotine replacement therapies & counseling guides to help you quit.", bg: "from-rose-600 to-pink-800", cta: "Get Support", badge: "HEALTH ADVOCACY" }
              ].map((promo, idx) => (
                <div 
                  key={idx} 
                  className={`w-[74vw] sm:w-[310px] p-5 rounded-2xl bg-gradient-to-br ${promo.bg} text-white flex flex-col justify-between shrink-0 snap-center shadow-md hover:shadow-lg hover:scale-[1.01] transition-all relative overflow-hidden`}
                  style={{ minHeight: "135px" }}
                >
                  <div className="absolute right-[-10px] bottom-[-10px] w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
                  
                  <div className="space-y-1.5 z-10 text-left">
                    <span className="text-[7px] font-black tracking-widest bg-white/20 px-2 py-0.5 rounded-full inline-block uppercase">
                      {promo.badge}
                    </span>
                    <h4 className="text-xs font-extrabold tracking-tight leading-snug">{promo.title}</h4>
                    <p className="text-[9.5px] text-white/80 leading-relaxed line-clamp-2">{promo.desc}</p>
                  </div>
                  
                  <button className="w-fit mt-3 px-3 py-1.5 bg-white text-gray-900 hover:bg-gray-100 text-[8.5px] font-black uppercase rounded-lg transition-colors shadow-2xs z-10 cursor-pointer">
                    {promo.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Health Resource Center Blogs */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-black text-gray-800 uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-orange" />
                Avenix Health Resource Center
              </h3>
            </div>
            
            <div className="relative w-full overflow-hidden py-2">
              {/* Fade overlays */}
              <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/50 to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/50 to-transparent z-10 pointer-events-none" />
              
              <div className="flex gap-0 w-max animate-marquee-reverse hover:[animation-play-state:paused] py-1.5">
                {/* Copy 1 */}
                <div className="flex gap-0 shrink-0">
                  {[...blogList, ...blogList, ...blogList, ...blogList].map((blog, idx) => (
                    <div 
                      key={`blog-1-${idx}`} 
                      className="w-[75vw] sm:w-[360px] mr-5 bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-brand-orange/40 hover:shadow-lg transition-all shadow-sm group cursor-pointer shrink-0"
                    >
                      <div>
                        <div className="w-full h-44 overflow-hidden relative">
                          <img src={blog.img} alt={blog.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-5 space-y-2.5 text-left">
                          <div className="flex items-center justify-between text-[9px] font-black uppercase text-brand-orange">
                            <span>{blog.tag}</span>
                            <span className="text-gray-400 font-semibold">{blog.time}</span>
                          </div>
                          <h4 className="text-sm font-extrabold text-gray-900 leading-snug group-hover:text-brand-orange transition-colors">{blog.title}</h4>
                          <p className="text-[10px] text-gray-400 leading-relaxed font-medium">{blog.desc}</p>
                        </div>
                      </div>
                      <div className="p-5 pt-0 flex justify-end">
                        <span className="text-[10px] font-bold text-brand-orange hover:underline flex items-center gap-0.5">
                          Read Article <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Copy 2 */}
                <div className="flex gap-0 shrink-0" aria-hidden="true">
                  {[...blogList, ...blogList, ...blogList, ...blogList].map((blog, idx) => (
                    <div 
                      key={`blog-2-${idx}`} 
                      className="w-[75vw] sm:w-[360px] mr-5 bg-white border border-gray-100 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-brand-orange/40 hover:shadow-lg transition-all shadow-sm group cursor-pointer shrink-0"
                    >
                      <div>
                        <div className="w-full h-44 overflow-hidden relative">
                          <img src={blog.img} alt={blog.title} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                        <div className="p-5 space-y-2.5 text-left">
                          <div className="flex items-center justify-between text-[9px] font-black uppercase text-brand-orange">
                            <span>{blog.tag}</span>
                            <span className="text-gray-400 font-semibold">{blog.time}</span>
                          </div>
                          <h4 className="text-sm font-extrabold text-gray-900 leading-snug group-hover:text-brand-orange transition-colors">{blog.title}</h4>
                          <p className="text-[10px] text-gray-400 leading-relaxed font-medium">{blog.desc}</p>
                        </div>
                      </div>
                      <div className="p-5 pt-0 flex justify-end">
                        <span className="text-[10px] font-bold text-brand-orange hover:underline flex items-center gap-0.5">
                          Read Article <ChevronRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Portal Gateways Section */}
          <section className="bg-gray-50 border border-gray-100 p-8 rounded-3xl relative overflow-hidden shadow-xs">
            <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand-orange via-orange-400 to-brand-orange" />
            
            {/* Background pattern */}
            <svg className="absolute right-0 bottom-0 opacity-5" viewBox="0 0 300 300" width="300" height="300">
              <circle cx="150" cy="150" r="120" fill="none" stroke="#FF6B00" strokeWidth="2" />
              <circle cx="150" cy="150" r="80" fill="none" stroke="#FF6B00" strokeWidth="2" />
              <circle cx="150" cy="150" r="40" fill="none" stroke="#FF6B00" strokeWidth="2" />
              <line x1="30" y1="150" x2="270" y2="150" stroke="#FF6B00" strokeWidth="1" />
              <line x1="150" y1="30" x2="150" y2="270" stroke="#FF6B00" strokeWidth="1" />
            </svg>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-4">
                <span className="text-[9px] font-bold uppercase tracking-[0.20em] text-brand-orange">
                  Integrated Simulator
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
                  Integrated Medical Ecosystem
                </h2>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Avenix connects all clinical nodes. Check how our role-based gateways handle workflows in real-time. Use the Demo Role toggle in the top navbar to instantly test pharmacist inventory controls, doctor queues, and admin analytics!
                </p>
                <div className="pt-1">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-brand-dark hover:bg-black text-white text-xs font-black uppercase tracking-wide transition-all shadow-md cursor-pointer hover:scale-105"
                  >
                    Enter Role Portals
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[
                  { name: "Customer Hub", title: "Personal Health Portal", desc: "Access saved medicine cupboards, set refill notifications, download AI scanner insights, and track delivery coordinates.", color: "bg-green-500" },
                  { name: "Pharmacist Panel", title: "Inventory & Verification", desc: "Verify uploaded prescriptions, manage real-time store inventory stock levels, and dispatch couriers with one click.", color: "bg-brand-orange" },
                  { name: "Doctor Terminal", title: "Tele-Medicine Queue", desc: "Consult pending patients in real-time, write official digital prescriptions, and customize consultation calendar slot availability.", color: "bg-blue-500" },
                  { name: "Super Admin Suite", title: "Platform Command", desc: "Analyze global sales charts, view courier node mesh maps, track diagnostic test bookings, and trigger fraud alarms.", color: "bg-red-500" }
                ].map((hub) => (
                  <div key={hub.name} className="p-5 rounded-2xl bg-white border border-gray-100 shadow-xs hover:shadow-md relative group hover:border-brand-orange/30 transition-all cursor-pointer">
                    <div className={`absolute top-4 right-4 h-2.5 w-2.5 rounded-full ${hub.color} animate-pulse`} />
                    <span className="text-[7.5px] font-black tracking-widest text-brand-orange uppercase block mb-1">
                      {hub.name}
                    </span>
                    <h4 className="text-sm font-bold text-gray-900">{hub.title}</h4>
                    <p className="text-[9.5px] text-gray-400 mt-1.5 leading-relaxed">
                      {hub.desc}
                    </p>
                  </div>
                ))}
              </div>

            </div>
          </section>

          <section className="bg-[#FFF8F5] border border-[#FFE6DE] rounded-3xl p-6 sm:p-10 md:p-12 relative overflow-hidden shadow-md mt-12">
            {/* Background watermark icon patterns */}
            <div className="absolute inset-0 pointer-events-none select-none opacity-[0.035] text-brand-orange">
              {/* Scattered background SVGs */}
              <div className="absolute top-8 left-8">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4.5 12.75a3.75 3.75 0 0 0 0 7.5h15a3.75 3.75 0 0 0 0-7.5H18" />
                  <path d="M12 3v13.5M8.25 12l3.75 3.75 3.75-3.75" />
                </svg>
              </div>
              <div className="absolute bottom-10 left-16">
                <svg className="w-20 h-20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 21a9 9 0 1 0-9-9 9 9 0 0 0 9 9z" />
                  <path d="M12 8v8M8 12h8" />
                </svg>
              </div>
              <div className="absolute top-1/3 left-1/4">
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="7" width="20" height="10" rx="5" />
                  <path d="M12 7v10" />
                </svg>
              </div>
              <div className="absolute top-10 right-1/4">
                <svg className="w-16 h-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                </svg>
              </div>
              <div className="absolute bottom-12 right-1/3">
                <svg className="w-14 h-14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M4.5 10.5C4.5 7.46 7.46 4.5 10.5 4.5M19.5 10.5c0-3.04-2.96-6-6-6M12 12v6M9 15h6" />
                </svg>
              </div>
              <div className="absolute top-1/2 right-12">
                <svg className="w-24 h-24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 12h3l3-9 4 18 3-12 2 3h5" />
                </svg>
              </div>
            </div>

            {/* Main responsive grid layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full relative z-10">
              
              {/* Left Smartphone Mockup (straight, slightly cropped at bottom like 1st image) */}
              <div className="hidden lg:flex lg:col-span-3 justify-center items-end self-end h-[340px] relative">
                <div className="w-56 h-[360px] border-8 border-gray-900 rounded-t-[2.5rem] border-b-0 bg-black shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.03]">
                  {/* Speaker Notch */}
                  <div className="w-20 h-4 bg-gray-900 mx-auto rounded-b-xl absolute top-0 left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center">
                    <div className="w-8 h-1 bg-gray-800 rounded-full" />
                  </div>
                  
                  {/* Screen Content - Avenix Homepage Mockup */}
                  <div className="h-full w-full bg-white pt-6 flex flex-col overflow-hidden text-left relative">
                    
                    {leftScreen === "home" && (
                      <div className="flex flex-col flex-grow overflow-hidden">
                        {/* Mock App Header */}
                        <div className="bg-[#FFF7F4] border-b border-[#FFE2D9] px-3 py-1.5 flex items-center justify-between shrink-0 select-none">
                          <div className="flex flex-col text-left">
                            <span className="text-[10px] font-black tracking-tight text-[#0F2C59]">AVENIX X</span>
                            <span className="text-[3.5px] font-black tracking-[0.22em] text-gray-400 uppercase -mt-0.5 font-mono">PHARMACEUTICALS</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="relative">
                              <span className="text-[8px]">🛒</span>
                              {leftCartCount > 0 && (
                                <span className="absolute -top-1.5 -right-1.5 bg-[#FF6B00] text-white text-[5.5px] font-black rounded-full h-3 w-3 flex items-center justify-center scale-90">
                                  {leftCartCount}
                                </span>
                              )}
                            </div>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          </div>
                        </div>

                        {/* Mock Search Bar */}
                        <div className="px-2 py-1.5 bg-white shrink-0 select-none">
                          <div className="bg-gray-50 border border-gray-150 rounded-lg px-2 py-1 text-[7px] text-gray-450 flex items-center gap-1">
                            <Search className="h-2 w-2 text-gray-450" />
                            <span>Search medicines, concerns...</span>
                          </div>
                        </div>

                        {/* Quick Circles Grid */}
                        <div className="grid grid-cols-4 gap-1 px-2 py-1 shrink-0 select-none">
                          {[
                            { name: "Medicines", color: "bg-orange-50 text-[#FF6B00]", screen: "medicines" },
                            { name: "Lab Tests", color: "bg-emerald-50 text-emerald-600", screen: "labs" },
                            { name: "Consult", color: "bg-blue-50 text-blue-600", screen: "consult" },
                            { name: "Scanner", color: "bg-purple-50 text-purple-600", screen: "scanner" }
                          ].map((item) => (
                            <button
                              key={item.name}
                              onClick={() => {
                                if (item.screen === "labs") {
                                  setRightScreen("labs");
                                  const rightEl = document.getElementById("right-mockup-phone");
                                  if (rightEl) {
                                    rightEl.classList.add("ring-4", "ring-emerald-400");
                                    setTimeout(() => rightEl.classList.remove("ring-4", "ring-emerald-400"), 1000);
                                  }
                                } else {
                                  setLeftScreen(item.screen as any);
                                }
                              }}
                              className="flex flex-col items-center cursor-pointer transition-transform hover:scale-105 active:scale-95"
                            >
                              <div className={`w-7 h-7 rounded-full ${item.color} flex items-center justify-center text-[8.5px] font-black shadow-xs`}>
                                {item.name[0]}
                              </div>
                              <span className="text-[5.5px] font-black mt-0.5 text-gray-500 scale-90">{item.name}</span>
                            </button>
                          ))}
                        </div>

                        {/* Promo Banner with our Doctor Model */}
                        <div className="mx-2 mt-1.5 bg-[#FFF0EB] border border-[#FFE5DC] rounded-lg p-2 flex items-center justify-between relative overflow-hidden flex-grow select-none">
                          <div className="space-y-0.5 text-left max-w-[60%] z-10">
                            <span className="text-[5px] font-black uppercase text-[#FF6B00] tracking-wider block bg-white px-1 rounded-sm w-fit">Offers</span>
                            <p className="text-[8px] font-black text-[#0F2C59] leading-tight">Get FLAT 25% OFF</p>
                            <p className="text-[5.5px] text-gray-500 leading-tight">Full Body Diagnostics or Medicine Deliveries</p>
                            <button 
                              onClick={() => setLeftScreen("medicines")}
                              className="bg-[#FF6B00] hover:bg-orange-600 text-white text-[4px] font-black uppercase px-1 py-0.5 rounded mt-1 cursor-pointer transition-colors"
                            >
                              Book Now
                            </button>
                          </div>
                          
                          {/* Doctor Model Image styled inside phone mockup screen */}
                          <div className="absolute right-0 bottom-0 h-16 w-16 overflow-hidden flex items-end">
                            <img
                              src="/images/model_doctor_flat.png"
                              alt="Doctor model showcase"
                              className="h-full w-full object-cover object-bottom scale-110"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {leftScreen === "medicines" && (
                      <div className="flex flex-col flex-grow overflow-hidden bg-white">
                        {/* Header */}
                        <div className="bg-[#FFF7F4] border-b border-[#FFE2D9] px-3 py-1.5 flex items-center justify-between shrink-0 select-none">
                          <button onClick={() => setLeftScreen("home")} className="text-[#FF6B00] text-[8px] font-black flex items-center gap-0.5 cursor-pointer">
                            <ChevronLeft className="h-3 w-3" /> Back
                          </button>
                          <span className="text-[8px] font-black text-[#0F2C59]">Store</span>
                          <div className="relative">
                            <span className="text-[8px]">🛒</span>
                            {leftCartCount > 0 && (
                              <span className="absolute -top-1.5 -right-1.5 bg-[#FF6B00] text-white text-[5.5px] font-black rounded-full h-3 w-3 flex items-center justify-center scale-90">
                                {leftCartCount}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Medicine List */}
                        <div className="p-2 space-y-1.5 overflow-y-auto flex-grow text-left">
                          {[
                            { id: "m1", name: "Paracetamol 650", price: 20, desc: "Fever relief tablets", strength: "10 Tabs" },
                            { id: "m2", name: "Vitamin C Chewable", price: 45, desc: "Immunity booster chew", strength: "15 Tabs" },
                            { id: "m3", name: "Amoxicillin 500", price: 85, desc: "Verified antibiotic", strength: "6 Tabs" },
                            { id: "m4", name: "Cetirizine 10", price: 15, desc: "Allergy relief drug", strength: "10 Tabs" }
                          ].map((med) => (
                            <MockMedicineItem 
                              key={med.id} 
                              med={med} 
                              onAdd={() => setLeftCartCount(prev => prev + 1)} 
                            />
                          ))}
                        </div>

                        {/* Bottom Checkout Action */}
                        <div className="p-2 border-t border-gray-100 bg-white shrink-0 select-none">
                          <button
                            onClick={() => {
                              if (leftCartCount > 0) {
                                setLeftScreen("success");
                              } else {
                                alert("Please add medicines to cart first!");
                              }
                            }}
                            className="w-full py-1 bg-[#FF6B00] hover:bg-orange-650 text-white text-[7px] font-black rounded-md cursor-pointer transition-colors text-center shadow-xs"
                          >
                            CHECKOUT (₹{leftCartCount * 45})
                          </button>
                        </div>
                      </div>
                    )}

                    {leftScreen === "success" && (
                      <div className="h-full w-full bg-white p-3 flex flex-col justify-between text-center select-none">
                        <div className="my-auto space-y-2">
                          <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto text-lg animate-bounce">
                            ✓
                          </div>
                          <h4 className="text-[8.5px] font-black text-[#0F2C59]">Order Placed Successfully!</h4>
                          <p className="text-[5.5px] text-gray-500 font-semibold">Order ID: AVX-ORD-55091</p>
                          
                          {/* Live Delivery Stepper */}
                          <div className="mt-3 pt-2.5 border-t border-gray-100 space-y-2 text-left max-w-[150px] mx-auto">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 flex items-center justify-center text-[5.5px] text-white">✓</span>
                              <span className="text-[6.5px] font-black text-gray-800">Order Confirmed</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B00] flex items-center justify-center text-[5.5px] text-white animate-pulse">✓</span>
                              <span className="text-[6.5px] font-black text-gray-800">Pharmacist Verifying</span>
                            </div>
                            <div className="flex items-center gap-1.5 opacity-50">
                              <span className="w-2.5 h-2.5 rounded-full bg-gray-200 flex items-center justify-center text-[5.5px] text-white"></span>
                              <span className="text-[6.5px] font-black text-gray-800">Out for Delivery</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            setLeftCartCount(0);
                            setLeftScreen("home");
                          }}
                          className="w-full py-1.5 bg-[#0F2C59] hover:bg-[#1a3d6d] text-white text-[7.5px] font-black rounded-lg cursor-pointer transition-colors text-center"
                        >
                          Back to App Home
                        </button>
                      </div>
                    )}

                    {leftScreen === "consult" && (
                      <div className="flex flex-col flex-grow overflow-hidden bg-white">
                        {/* Header */}
                        <div className="bg-[#FFF7F4] border-b border-[#FFE2D9] px-3 py-1.5 flex items-center justify-between shrink-0 select-none">
                          <button onClick={() => {
                            setLeftConsultState("idle");
                            setLeftScreen("home");
                          }} className="text-[#FF6B00] text-[8px] font-black flex items-center gap-0.5 cursor-pointer">
                            <ChevronLeft className="h-3 w-3" /> Back
                          </button>
                          <span className="text-[8px] font-black text-[#0F2C59]">Consult</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                        </div>

                        {leftConsultState === "calling" ? (
                          /* Active Call View */
                          <div className="flex-grow bg-[#070A13] text-white flex flex-col justify-between p-3 relative overflow-hidden select-none">
                            <div className="flex justify-between items-center text-[5px] text-gray-400 font-mono z-10 bg-black/40 p-1 rounded">
                              <div className="flex items-center gap-1">
                                <span className="w-1 h-1 bg-emerald-400 rounded-full animate-ping" />
                                <span>Dr. {leftSelectedDoctor} (NMC Verified)</span>
                              </div>
                              <span>SECURE P2P</span>
                            </div>

                            <div className="my-auto relative flex flex-col items-center">
                              {/* EKG pulse line */}
                              <div className="absolute inset-0 flex items-center justify-center opacity-30">
                                <svg className="w-full h-8 stroke-emerald-400" viewBox="0 0 100 30" fill="none">
                                  <path d="M0,15 L20,15 L25,5 L30,25 L35,15 L50,15 L55,5 L60,25 L65,15 L100,15" strokeWidth="1.5" strokeDasharray="100" strokeDashoffset="100" className="animate-draw-pulse" />
                                </svg>
                              </div>

                              <div className="w-14 h-14 rounded-full border-2 border-[#FF6B00] overflow-hidden bg-gray-800 relative z-10 animate-pulse">
                                <img
                                  src={leftSelectedDoctor === "Priya" ? "/images/doctor_priya_1779707836866.png" : "/images/doctor_rohan_1779707754675.png"}
                                  alt="Doctor avatar"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.onerror = null;
                                    target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${leftSelectedDoctor}`;
                                  }}
                                />
                              </div>
                              <span className="text-[6.5px] font-black text-gray-300 mt-2 z-10 animate-pulse">Live Consultation...</span>
                              
                              <div className="grid grid-cols-2 gap-1.5 mt-3 w-full max-w-[110px] text-[4.5px] font-mono bg-black/60 p-1.5 rounded-lg border border-white/5 z-10 text-left">
                                <div>
                                  <p className="text-gray-400 scale-90">Vitals Signal</p>
                                  <p className="text-emerald-400 font-bold animate-pulse">72 BPM &bull; Stable</p>
                                </div>
                                <div>
                                  <p className="text-gray-400 scale-90">Encryption</p>
                                  <p className="text-[#FF6B00] font-bold">256-bit SSL</p>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-center gap-1.5 bg-black/40 p-1 rounded-lg z-10">
                              <span className="h-4 w-4 rounded-full bg-gray-800 flex items-center justify-center text-[6px]">🎙️</span>
                              <span className="h-4 w-4 rounded-full bg-gray-800 flex items-center justify-center text-[6px]">📹</span>
                              <button
                                onClick={() => setLeftConsultState("idle")}
                                className="h-4 px-2 bg-red-600 hover:bg-red-700 text-white text-[5.5px] font-black rounded cursor-pointer transition-colors"
                              >
                                DISCONNECT
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Listings */
                          <div className="p-2 space-y-2 overflow-y-auto flex-grow text-left">
                            {[
                              { name: "Priya", fullname: "Dr. Priya Sharma", spec: "Pediatrician", exp: "8 Yrs Exp", fee: 400 },
                              { name: "Rohan", fullname: "Dr. Rohan Gupta", spec: "General MD", exp: "12 Yrs Exp", fee: 500 }
                            ].map((doc) => (
                              <div key={doc.name} className="p-1.5 bg-white border border-gray-100 rounded-xl shadow-xs space-y-1">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden shrink-0">
                                    <img
                                      src={doc.name === "Priya" ? "/images/doctor_priya_1779707836866.png" : "/images/doctor_rohan_1779707754675.png"}
                                      alt={doc.fullname}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement;
                                        target.onerror = null;
                                        target.src = `https://api.dicebear.com/7.x/adventurer/svg?seed=${doc.name}`;
                                      }}
                                    />
                                  </div>
                                  <div className="space-y-0.5">
                                    <h4 className="text-[7.5px] font-black text-gray-800 leading-tight">{doc.fullname}</h4>
                                    <p className="text-[5.5px] text-[#FF6B00] font-bold">{doc.spec} &bull; {doc.exp}</p>
                                  </div>
                                </div>
                                <div className="flex justify-between items-center pt-1 border-t border-gray-50">
                                  <span className="text-[6.5px] font-black text-gray-655">Fee: ₹{doc.fee}</span>
                                  <button
                                    onClick={() => {
                                      setLeftSelectedDoctor(doc.name);
                                      setLeftConsultState("calling");
                                    }}
                                    className="h-4.5 px-2 bg-emerald-500 hover:bg-emerald-600 text-white text-[5.5px] font-black rounded-md cursor-pointer transition-colors"
                                  >
                                    Consult
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {leftScreen === "scanner" && (
                      <div className="flex flex-col flex-grow overflow-hidden bg-white">
                        {/* Header */}
                        <div className="bg-[#FFF7F4] border-b border-[#FFE2D9] px-3 py-1.5 flex items-center justify-between shrink-0 select-none">
                          <button onClick={() => {
                            setLeftScanState("idle");
                            setLeftScreen("home");
                          }} className="text-[#FF6B00] text-[8px] font-black flex items-center gap-0.5 cursor-pointer">
                            <ChevronLeft className="h-3 w-3" /> Back
                          </button>
                          <span className="text-[8px] font-black text-[#0F2C59]">Scanner</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-ping" />
                        </div>

                        {leftScanState === "scanning" ? (
                          /* Scanning sequence */
                          <div className="flex-grow bg-[#070A13] text-white flex flex-col justify-center items-center p-3 relative overflow-hidden select-none">
                            <div className="absolute left-0 right-0 h-0.5 bg-[#FF6B00] shadow-md shadow-brand-orange/60 z-20 animate-laser-scan" />
                            <div className="border border-dashed border-white/20 p-3.5 rounded-lg flex flex-col items-center bg-white/[0.02]">
                              <UploadCloud className="h-6 w-6 text-gray-500 animate-bounce" />
                              <span className="text-[6px] font-black text-gray-300 mt-2 uppercase tracking-widest animate-pulse">Analyzing prescription Rx...</span>
                            </div>
                          </div>
                        ) : leftScanState === "result" ? (
                          /* Extracted list */
                          <div className="p-2 space-y-2 overflow-y-auto flex-grow text-left">
                            <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1">
                              <div className="flex items-center gap-1.5">
                                <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 text-white text-[7px] flex items-center justify-center font-black">✓</span>
                                <h4 className="text-[7.5px] font-black text-emerald-800 leading-tight">Prescription Parsed</h4>
                              </div>
                              <div className="bg-white/80 p-1.5 rounded border border-emerald-100 space-y-1 text-[5.5px] text-gray-700 leading-tight mt-1.5">
                                <p>1. Paracetamol 650mg &bull; 10 Tabs</p>
                                <p>2. Cetirizine 10mg &bull; 10 Tabs</p>
                              </div>
                              <p className="text-[4px] text-gray-400 italic mt-1 font-semibold">Matched Avenix Batch Shield check</p>
                            </div>

                            <button
                              onClick={() => {
                                setLeftCartCount(prev => prev + 2);
                                setLeftScanState("idle");
                                setLeftScreen("medicines");
                              }}
                              className="w-full py-1 bg-[#FF6B00] hover:bg-orange-600 text-white text-[7px] font-black rounded-lg cursor-pointer transition-colors text-center shadow-xs"
                            >
                              ADD MEDICINES TO CART
                            </button>
                          </div>
                        ) : (
                          /* Idle */
                          <div className="flex-grow p-3 flex flex-col justify-center items-center text-center space-y-2 select-none">
                            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600">
                              <UploadCloud className="h-5 w-5" />
                            </div>
                            <h4 className="text-[8px] font-black text-gray-800">AI Rx Reader</h4>
                            <p className="text-[5.5px] text-gray-450 mt-1 max-w-[150px] leading-relaxed mx-auto">
                              Take a photo or upload prescription. Our neural engine checks drug matches instantly.
                            </p>
                            <button
                              onClick={() => {
                                setLeftScanState("scanning");
                                setTimeout(() => setLeftScanState("result"), 2000);
                              }}
                              className="px-3.5 py-1 bg-purple-600 hover:bg-purple-700 text-white text-[6.5px] font-black rounded-lg cursor-pointer transition-colors mt-2"
                            >
                              Scan Mock Prescription
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Center Content: Heading, Subtitle & Download Badges */}
              <div className="col-span-1 lg:col-span-6 text-center space-y-6 flex flex-col items-center justify-center py-6">
                <div className="space-y-3">
                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#0F2C59] leading-tight tracking-tight font-poppins">
                    Simplifying <span className="text-[#FF6B00]">Healthcare</span> <br />
                    Impacting Lives
                  </h2>
                  <p className="text-sm sm:text-base md:text-lg font-bold text-gray-500">
                    Download the Avenix App for Free
                  </p>
                </div>

                {/* Google Play & App Store Badges */}
                <div className="flex flex-wrap justify-center gap-3.5 pt-2">
                  <div className="flex items-center gap-2 bg-[#0F2C59] text-white px-5 py-2.5 rounded-2xl shadow-md hover:bg-[#1a3d6d] hover:scale-102 transition-all cursor-pointer select-none">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M5 3h14c1.1 0 2 .9 2 2v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2m7 3c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2m-3 8h6v-1.5c0-1-2-1.5-3-1.5s-3 .5-3 1.5V14m3-11c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-[8px] uppercase tracking-wider text-gray-300 font-mono leading-none">Get it on</p>
                      <p className="text-[12px] font-black leading-none mt-0.5">Google Play</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-[#0F2C59] text-white px-5 py-2.5 rounded-2xl shadow-md hover:bg-[#1a3d6d] hover:scale-102 transition-all cursor-pointer select-none">
                    <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
                      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 4.17c.66-.81 1.11-1.93.99-3.06-1 .04-2.22.67-2.94 1.5-.63.73-1.18 1.87-1.03 2.97 1.12.09 2.27-.56 2.98-1.41z"/>
                    </svg>
                    <div className="text-left">
                      <p className="text-[8px] uppercase tracking-wider text-gray-300 font-mono leading-none">Download on the</p>
                      <p className="text-[12px] font-black leading-none mt-0.5">App Store</p>
                    </div>
                  </div>
                </div>

                {/* Additional helpline info at bottom center */}
                <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-[10px] text-[#0F2C59] font-black pt-4 border-t border-[#FF6B00]/10 w-full max-w-sm">
                  <div className="flex items-center gap-1.5 hover:text-[#FF6B00] transition-colors cursor-pointer">
                    <Phone className="h-3.5 w-3.5 text-[#FF6B00]" />
                    <span>+91 1800 208 9999</span>
                  </div>
                  <div className="flex items-center gap-1.5 hover:text-[#FF6B00] transition-colors cursor-pointer">
                    <Mail className="h-3.5 w-3.5 text-[#FF6B00]" />
                    <span>app@avenixpharma.in</span>
                  </div>
                </div>
              </div>

              {/* Right Smartphone Mockup (straight, slightly cropped at bottom like 1st image) */}
              <div className="hidden lg:flex lg:col-span-3 justify-center items-end self-end h-[340px] relative">
                <div id="right-mockup-phone" className="w-56 h-[360px] border-8 border-gray-900 rounded-t-[2.5rem] border-b-0 bg-black shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300 hover:scale-[1.03]">
                  {/* Speaker Notch */}
                  <div className="w-20 h-4 bg-gray-900 mx-auto rounded-b-xl absolute top-0 left-1/2 transform -translate-x-1/2 z-20 flex items-center justify-center">
                    <div className="w-8 h-1 bg-gray-800 rounded-full" />
                  </div>
                  
                  {/* Screen Content - Avenix Lab Tests / Category list */}
                  <div className="h-full w-full bg-[#FAFAFA] pt-6 flex flex-col overflow-hidden text-left text-xs">
                    
                    {rightScreen === "labs" && (
                      <div className="flex flex-col flex-grow overflow-hidden">
                        {/* Header */}
                        <div className="px-3 py-2 bg-white border-b border-gray-100 flex items-center justify-between shrink-0">
                          <span className="text-[8px] font-black text-gray-800">Lab Tests by Concern</span>
                          <span className="text-[5.5px] text-[#FF6B00] font-bold">View All</span>
                        </div>

                        {/* Concern Grids */}
                        <div className="grid grid-cols-2 gap-1.5 p-2 flex-grow overflow-y-auto">
                          {[
                            { title: "Vitamins Profile", desc: "Starts from ₹499", color: "bg-amber-50/50 border-amber-100/60 hover:bg-amber-50", img: "🍎" },
                            { title: "Full Body Checkup", desc: "Starts from ₹899", color: "bg-blue-50/50 border-blue-100/60 hover:bg-blue-50", img: "🩺" },
                            { title: "Diabetes Profile", desc: "Starts from ₹299", color: "bg-rose-50/50 border-rose-100/60 hover:bg-rose-50", img: "🩸" },
                            { title: "Cardiac Screening", desc: "Starts from ₹999", color: "bg-emerald-50/50 border-emerald-100/60 hover:bg-emerald-50", img: "❤️" }
                          ].map((item) => (
                            <button
                              key={item.title}
                              onClick={() => {
                                setRightSelectedLab(item);
                                setRightBookingStep("idle");
                                setRightScreen("details");
                              }}
                              className={`p-1.5 border rounded-xl ${item.color} flex flex-col justify-between h-[52px] text-left cursor-pointer transition-transform hover:scale-102`}
                            >
                              <div className="flex justify-between items-start w-full">
                                <span className="text-[6.5px] font-black text-gray-800 leading-tight">{item.title}</span>
                                <span className="text-[10px] scale-90">{item.img}</span>
                              </div>
                              <span className="text-[5px] font-bold text-gray-400">{item.desc}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {rightScreen === "details" && rightSelectedLab && (
                      <div className="flex flex-col flex-grow overflow-hidden bg-white">
                        {/* Header */}
                        <div className="px-3 py-1.5 border-b border-gray-100 flex items-center gap-1 shrink-0">
                          <button onClick={() => setRightScreen("labs")} className="text-gray-455 hover:text-gray-700 cursor-pointer">
                            <ChevronLeft className="h-3 w-3" />
                          </button>
                          <span className="text-[7.5px] font-black text-gray-800">{rightSelectedLab.title}</span>
                        </div>

                        {rightBookingStep === "success" ? (
                          /* Booking success animation */
                          <div className="flex-grow p-3 flex flex-col justify-center items-center text-center space-y-2 select-none">
                            <div className="w-9 h-9 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-lg animate-bounce">
                              ✓
                            </div>
                            <h4 className="text-[8.5px] font-black text-[#0F2C59]">Lab Booking Confirmed!</h4>
                            <p className="text-[5.5px] text-gray-500 leading-relaxed max-w-[140px] mx-auto">
                              Our certified phlebotomist will arrive on <strong className="text-gray-900 font-extrabold">{rightSelectedSlot}</strong>.
                            </p>
                            <button
                              onClick={() => setRightScreen("labs")}
                              className="px-3 py-1 bg-[#0F2C59] hover:bg-[#1a3d6d] text-white text-[5.5px] font-black rounded mt-2 cursor-pointer transition-colors"
                            >
                              Back to Labs
                            </button>
                          </div>
                        ) : (
                          /* Slot selector & Confirm */
                          <div className="p-2 space-y-2 flex-grow overflow-y-auto flex flex-col justify-between">
                            <div className="space-y-1.5">
                              <div className="bg-orange-50/50 p-2 rounded-lg border border-orange-100/60 text-left">
                                <p className="text-[7px] font-black text-[#FF6B00]">Package Details</p>
                                <p className="text-[5.5px] text-gray-500 mt-0.5 leading-tight">Includes blood collection, CBC, Lipid profile, liver function, and certified NABL diagnostic reports inside 6 hours.</p>
                              </div>

                              <p className="text-[6.5px] font-black text-gray-700 text-left">Select Slot (Free Home Collection)</p>
                              <div className="grid grid-cols-3 gap-1">
                                {["8:00 AM", "11:00 AM", "2:00 PM"].map((slot) => (
                                  <button
                                    key={slot}
                                    onClick={() => setRightSelectedSlot(slot)}
                                    className={`py-1 text-[5.5px] font-black border rounded-md cursor-pointer transition-colors ${
                                      rightSelectedSlot === slot 
                                        ? "border-[#FF6B00] bg-[#FFF0EB] text-[#FF6B00]" 
                                        : "border-gray-200 bg-white text-gray-500 hover:bg-gray-55"
                                    }`}
                                  >
                                    {slot}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <button
                              onClick={() => setRightBookingStep("success")}
                              className="w-full py-1.5 bg-[#FF6B00] hover:bg-orange-600 text-white text-[7px] font-black rounded-lg cursor-pointer transition-colors text-center shadow-xs"
                            >
                              CONFIRM (₹{rightSelectedLab.title.includes("Full Body") ? 899 : 499})
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {rightScreen === "chat" && (
                      <div className="flex flex-col flex-grow overflow-hidden bg-[#F4F6F9]">
                        {/* Header */}
                        <div className="px-3 py-1.5 bg-white border-b border-gray-150 flex items-center justify-between shrink-0">
                          <span className="text-[8px] font-black text-gray-800 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                            Avenix Health Assistant AI
                          </span>
                          <span className="text-[5.5px] text-gray-400 font-bold uppercase tracking-wider">Online</span>
                        </div>

                        {/* Message list */}
                        <div className="flex-grow p-2 overflow-y-auto space-y-1.5 text-left scrollbar-none">
                          {chatMessages.map((msg, index) => (
                            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                              <div className={`p-1.5 rounded-lg max-w-[85%] text-[5.5px] font-semibold leading-relaxed ${
                                msg.sender === "user" 
                                  ? "bg-[#FF6B00] text-white rounded-br-none font-bold" 
                                  : "bg-white text-gray-800 border border-gray-150 rounded-bl-none shadow-xs"
                              }`}>
                                {msg.text}
                              </div>
                            </div>
                          ))}
                          {isTyping && (
                            <div className="flex justify-start">
                              <div className="bg-white text-gray-400 p-1 px-2 rounded-lg text-[5px] font-bold border border-gray-150 rounded-bl-none animate-pulse">
                                Avenix AI is typing...
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Presets suggestions */}
                        <div className="p-1 border-t border-gray-100 bg-white overflow-x-auto flex gap-1 scrollbar-none shrink-0 select-none">
                          {[
                            "Is Paracetamol safe?",
                            "Track Order AVX-201",
                            "Emergency line"
                          ].map((preset) => (
                            <button
                              key={preset}
                              disabled={isTyping}
                              onClick={() => {
                                if (isTyping) return;
                                const userMsg = preset;
                                setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
                                setIsTyping(true);
                                
                                setTimeout(() => {
                                  let reply = "";
                                  if (userMsg.includes("Paracetamol")) {
                                    reply = "Yes, Paracetamol is safe in normal medical dosages. Do not exceed 4g daily to avoid liver risk.";
                                  } else if (userMsg.includes("Track")) {
                                    reply = "Your order AVX-ORD-55091 is active! Status: Out for delivery. Courier ETA is 12 mins.";
                                  } else {
                                    reply = "Avenix emergency dispatcher is active. Call +91 1800 208 9999 for instant response.";
                                  }
                                  setChatMessages(prev => [...prev, { sender: "ai", text: reply }]);
                                  setIsTyping(false);
                                }, 1200);
                              }}
                              className="px-2 py-0.5 border border-gray-200 hover:border-[#FF6B00] hover:text-[#FF6B00] rounded-full text-[5.5px] font-black text-gray-500 whitespace-nowrap cursor-pointer transition-colors"
                            >
                              {preset}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {rightScreen === "profile" && (
                      <div className="flex flex-col flex-grow overflow-hidden bg-white text-left p-2.5">
                        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
                          <div className="w-8 h-8 rounded-full bg-[#FFF0EB] text-[#FF6B00] font-black flex items-center justify-center text-xs">
                            AP
                          </div>
                          <div>
                            <h4 className="text-[8px] font-black text-gray-800">Avnish Patel</h4>
                            <p className="text-[5.5px] text-gray-450 font-bold">avnish@avenixpharma.in</p>
                          </div>
                        </div>

                        <div className="mt-3 space-y-2 flex-grow overflow-y-auto">
                          <p className="text-[6.5px] font-black text-gray-700">Account Summary</p>
                          <div className="bg-[#FFF8F5] p-2 rounded-lg border border-[#FFE6DE] space-y-1">
                            <div className="flex justify-between text-[5.5px]">
                              <span className="text-gray-550">Care Plan Status:</span>
                              <span className="text-[#FF6B00] font-bold">Active Member</span>
                            </div>
                            <div className="flex justify-between text-[5.5px]">
                              <span className="text-gray-550">Total Orders:</span>
                              <span className="text-gray-800 font-bold">4 Verified</span>
                            </div>
                          </div>

                          <p className="text-[6.5px] font-black text-gray-700">Quick Actions</p>
                          <button
                            onClick={() => {
                              alert("Downloading welcome statement credentials letter...");
                            }}
                            className="w-full py-1 border border-[#0F2C59] hover:bg-[#0f2c59]/5 text-[#0F2C59] text-[5.5px] font-black rounded cursor-pointer transition-colors text-center"
                          >
                            DOWNLOAD PORTAL CREDENTIALS
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Bottom App Navigation Mockup */}
                    <div className="bg-white border-t border-gray-150 py-1.5 px-3 flex justify-between items-center text-[5px] font-black text-gray-405 shrink-0 select-none">
                      <button 
                        onClick={() => setRightScreen("labs")} 
                        className={`flex flex-col items-center cursor-pointer ${rightScreen === "labs" ? "text-[#FF6B00]" : "hover:text-gray-700"}`}
                      >
                        <span>🏠</span>
                        <span>Home</span>
                      </button>
                      <button 
                        onClick={() => setRightScreen("labs")} 
                        className={`flex flex-col items-center cursor-pointer ${rightScreen === "details" ? "text-[#FF6B00]" : "hover:text-gray-700"}`}
                      >
                        <span>🩺</span>
                        <span>Lab Tests</span>
                      </button>
                      <button 
                        onClick={() => setRightScreen("chat")} 
                        className={`flex flex-col items-center cursor-pointer ${rightScreen === "chat" ? "text-[#FF6B00]" : "hover:text-gray-700"}`}
                      >
                        <span>💬</span>
                        <span>Chat</span>
                      </button>
                      <button 
                        onClick={() => setRightScreen("profile")} 
                        className={`flex flex-col items-center cursor-pointer ${rightScreen === "profile" ? "text-[#FF6B00]" : "hover:text-gray-700"}`}
                      >
                        <span>👤</span>
                        <span>Profile</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

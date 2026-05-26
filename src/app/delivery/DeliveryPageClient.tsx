"use client";


import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState, Medicine } from "@/context/AppState";
import { 
  Search, ShoppingCart, ShoppingBag, Plus, Minus, Trash2, 
  UploadCloud, AlertCircle, FileText, Check, ArrowRight, Sparkles,
  ChevronRight, Calendar, ChevronLeft
} from "lucide-react";

export default function DeliveryPageClient() {
  const router = useRouter();
  const { 
    medicines, cart, addToCart, removeFromCart, 
    updateCartQuantity, placeOrder, uploadPrescriptionScan, 
    searchQuery, setSearchQuery, diagnostics
  } = useAppState();

  const [patientName, setPatientName] = useState("");
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [rxFileName, setRxFileName] = useState("");
  const [checkoutStep, setCheckoutStep] = useState(false);
  const [orderCreatedId, setOrderCreatedId] = useState("");

  // Filters state
  const [activeConcern, setActiveConcern] = useState<string | null>(null);
  const [activeBrand, setActiveBrand] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Added items tracking state for button text animation
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const concern = searchParams.get("concern");
    const brand = searchParams.get("brand");
    if (concern) {
      setActiveConcern(concern);
    }
    if (brand) {
      setActiveBrand(brand);
    }
  }, [searchParams]);

  const handleAddToCart = (med: Medicine) => {
    addToCart(med, 1);
    setAddedItems((prev) => ({ ...prev, [med.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [med.id]: false }));
    }, 2000);
  };

  // Banner carousel state
  const [activeBanner, setActiveBanner] = useState(0);
  const banners = [
    {
      id: 1,
      badge: "AVENIX MEDICINE HUB",
      title: "Save Up To 25% On Your First Order",
      desc: "Fulfillment from CDSCO-certified WHO-GMP partner warehouse nodes.",
      cta: "Use Code: AVENIX25",
      btnText: "Shop Now",
      img: "/images/smart_delivery.jpg",
      link: "#catalog"
    },
    {
      id: 2,
      badge: "INTELLIGENT MEDICAL ANALYSIS",
      title: "OCR-Enabled AI Prescription Scan",
      desc: "Upload your handwritten doctor slip. We parse drug names and flag safety risks instantly.",
      cta: "Verify CDSCO Compliance",
      btnText: "Scan Now",
      img: "/images/prescription_scanner.jpg",
      link: "/prescription-ai"
    },
    {
      id: 3,
      badge: "AVENIX DIAGNOSTICS LABS",
      title: "Flat 50% Off On Full Body Checkups",
      desc: "Certified local laboratory technicians, home blood collections, online reports in 6 hours.",
      cta: "Free Home Sample Pickups",
      btnText: "Book Test",
      img: "/images/diagnostics.jpg",
      link: "/diagnostics"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const filteredMedicines = medicines.filter(med => {
    const matchesSearch = med.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          med.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          med.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesConcern = true;
    if (activeConcern === "diabetes") {
      matchesConcern = med.name.toLowerCase().includes("metformin");
    } else if (activeConcern === "cardiac") {
      matchesConcern = med.name.toLowerCase().includes("atorvastatin");
    } else if (activeConcern === "pain") {
      matchesConcern = med.name.toLowerCase().includes("paracetamol") || med.name.toLowerCase().includes("crocin");
    } else if (activeConcern === "antibiotics") {
      matchesConcern = med.name.toLowerCase().includes("amoxicillin");
    } else if (activeConcern === "stomach") {
      matchesConcern = med.name.toLowerCase().includes("pantocid");
    } else if (activeConcern === "allergy") {
      matchesConcern = med.name.toLowerCase().includes("cetirizine") || med.name.toLowerCase().includes("montair");
    }

    let matchesBrand = true;
    if (activeBrand) {
      matchesBrand = med.manufacturer.toLowerCase().includes(activeBrand.toLowerCase());
    }

    return matchesSearch && matchesConcern && matchesBrand;
  });

  const cartTotal = cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const cartOriginalTotal = cart.reduce((sum, item) => sum + (item.medicine.originalPrice || item.medicine.price) * item.quantity, 0);
  const discountAmount = cartOriginalTotal - cartTotal;
  const requiresRx = cart.some(item => item.medicine.requiresPrescription);

  const handlePrescriptionUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setRxFileName(file.name);
      setPrescriptionUploaded(true);
      // Auto register to AI scanner
      uploadPrescriptionScan(file.name);
    }
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresRx && !prescriptionUploaded) {
      alert("Please upload a prescription for Rx-restricted items in your cart.");
      return;
    }
    
    const createdId = placeOrder(patientName || "Avnish Kumar", rxFileName || undefined);
    setOrderCreatedId(createdId);
    
    // Smooth transition
    setTimeout(() => {
      router.push("/dashboard/customer");
    }, 1500);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow medical-grid pb-12 font-sans">
        {/* 1. Full-Width End-to-End Banner & Prescription Upload Row (Tata 1mg style) */}
        <div className="w-full border-b border-gray-250 bg-white grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch overflow-hidden">
          
          {/* Banner Carousel (col-span-8) */}
          <div className="lg:col-span-8 relative h-72 sm:h-80 bg-brand-dark flex flex-col justify-between p-6 sm:p-8">
            {/* Banner content */}
            <div className="absolute inset-0 bg-cover bg-center opacity-25 z-0 transition-all duration-1000" style={{ backgroundImage: `url(${banners[activeBanner].img})` }} />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-dark via-brand-dark/75 to-transparent z-10" />

            <div className="relative z-20 space-y-2 max-w-md my-auto">
              <span className="text-[9px] font-bold text-brand-orange uppercase tracking-[0.20em] bg-brand-orange/10 border border-brand-orange/20 px-2.5 py-1 rounded-full">
                {banners[activeBanner].badge}
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-white leading-tight font-poppins pt-2">
                {banners[activeBanner].title}
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-300 font-medium leading-relaxed">
                {banners[activeBanner].desc}
              </p>
              <div className="flex items-center gap-4 pt-3">
                <span className="text-[10px] sm:text-xs font-black text-brand-orange uppercase tracking-wider">{banners[activeBanner].cta}</span>
                <Link href={banners[activeBanner].link} className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-light text-white text-[10px] font-black uppercase rounded-full shadow-md shadow-brand-orange/20 transition-all">
                  {banners[activeBanner].btnText}
                </Link>
              </div>
            </div>

            {/* Navigation dots */}
            <div className="relative z-20 flex items-center justify-between mt-auto pt-4 border-t border-white/5">
              <div className="flex items-center space-x-2">
                {banners.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveBanner(idx)}
                    className={`h-1.5 rounded-full transition-all cursor-pointer ${
                      activeBanner === idx ? "w-6 bg-brand-orange" : "w-1.5 bg-gray-600"
                    }`}
                  />
                ))}
              </div>
              <div className="flex items-center space-x-2 text-white/50 text-[10px] font-bold font-mono">
                <span>0{activeBanner + 1}</span>
                <span>/</span>
                <span>0{banners.length}</span>
              </div>
            </div>
          </div>

          {/* Prescription Quick-Order Card (col-span-4) */}
          <div className="lg:col-span-4 p-6 sm:p-8 flex flex-col justify-between bg-white border-t lg:border-t-0 lg:border-l border-gray-200 relative overflow-hidden h-72 sm:h-80">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-brand-orange/15 text-brand-orange flex items-center justify-center">
                  <FileText className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h3 className="text-xs font-black text-brand-dark uppercase tracking-wide">Quick Order with Rx</h3>
                  <p className="text-[9px] text-gray-450 font-semibold">Upload prescription & let us handle it</p>
                </div>
              </div>

              <ul className="space-y-2 text-[10px] font-medium text-gray-500">
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                  AI parses medicines instantly
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                  R.Ph Pharmacists verify safety
                </li>
                <li className="flex items-center gap-1.5">
                  <Check className="h-3.5 w-3.5 text-brand-orange shrink-0" />
                  Priority same-day rider dispatch
                </li>
              </ul>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <label className="w-full py-2.5 bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-orange/15 flex items-center justify-center gap-1.5 cursor-pointer">
                <UploadCloud className="h-4 w-4" />
                <span>UPLOAD PRESCRIPTION</span>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handlePrescriptionUpload}
                  className="hidden"
                />
              </label>
              
              <div className="flex items-center justify-between text-[9px] font-bold">
                <span className="text-gray-400">No prescription slide?</span>
                <Link href="/doctors" className="text-brand-orange hover:underline flex items-center gap-0.5">
                  Consult Online Doctor <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* 1.5. Platform Branding Title (Tata 1mg style) */}
        <div className="w-full bg-white border-b border-gray-200 py-3 text-center select-none">
          <h1 className="text-xs sm:text-sm font-extrabold text-brand-dark tracking-wide font-poppins">
            Avenix Pharmaceuticals: India's Leading Online Pharmacy & Healthcare Platform
          </h1>
        </div>

        {/* 1.6. Care Plan Membership Banner */}
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 mt-6">
          <div className="bg-[#FFEEDA] border border-orange-200/50 rounded-3xl p-4 sm:p-5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xs overflow-hidden relative">
            <div className="flex items-center gap-4 sm:gap-6 w-full md:w-auto">
              {/* Senior Wellness Counselor Stylized SVG */}
              <div className="relative shrink-0 hidden sm:block">
                <div className="absolute inset-0 bg-brand-orange/10 rounded-full blur-md" />
                <svg viewBox="0 0 120 120" className="h-16 w-16 sm:h-20 sm:w-20 relative z-10 select-none">
                  {/* Circle Backdrop */}
                  <circle cx="60" cy="60" r="50" fill="#FFE5D9" />
                  {/* Face */}
                  <circle cx="60" cy="45" r="18" fill="#FAD2E1" />
                  {/* Hair */}
                  <path d="M42 45c0-12 8-18 18-18s18 6 18 18c0 1-.5 2-1 3-2-8-8-12-17-12s-15 4-17 12c-.5-1-1-2-1-3z" fill="#B0B0B0" />
                  {/* Glasses */}
                  <rect x="47" y="41" width="10" height="6" rx="2.5" fill="none" stroke="#121212" strokeWidth="1.5" />
                  <rect x="63" y="41" width="10" height="6" rx="2.5" fill="none" stroke="#121212" strokeWidth="1.5" />
                  <line x1="57" y1="44" x2="63" y2="44" stroke="#121212" strokeWidth="1.5" />
                  {/* Smile */}
                  <path d="M55 52c2 1.5 8 1.5 10 0" fill="none" stroke="#121212" strokeWidth="1.5" strokeLinecap="round" />
                  {/* Orange Polo Body */}
                  <path d="M30 92c0-15 12-25 30-25s30 10 30 25v10H30V92z" fill="#FF6B00" />
                  {/* Collar */}
                  <path d="M48 68l12 10 12-10" fill="none" stroke="#FFE5D9" strokeWidth="2.5" />
                </svg>
              </div>

              {/* Text Content */}
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

            {/* CTA Button */}
            <div className="shrink-0 w-full md:w-auto">
              <Link 
                href="/delivery" 
                className="w-full md:w-auto px-6 py-2.5 bg-[#8A252C] hover:bg-[#721F25] text-white text-xs font-black uppercase tracking-wide rounded-xl shadow-xs transition-colors block text-center cursor-pointer"
              >
                Know More
              </Link>
            </div>
          </div>
        </div>

        {/* 2. Containerized Content */}
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 space-y-8 pt-8">
          
          {/* Header Info */}
          <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
            <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-brand-orange">
              Intelligent Logistics
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
              Smart Medicine Dispatch
            </h1>
            <p className="text-xs text-gray-500">
              Browse inventory, scan digital prescriptions for automatic checkout validation, and track couriers in real-time.
            </p>
          </div>

          <div className="w-full space-y-6">
              
              {/* Search Bar */}
              <div className="relative bg-white p-2 rounded-2xl border border-gray-200 shadow-sm glass-card flex items-center">
                <Search className="h-4.5 w-4.5 text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search medicines (e.g. Paracetamol, Novamox, Metformin, Acidity...)"
                  className="w-full bg-transparent border-0 ring-0 outline-none text-xs text-brand-dark px-3 py-2 placeholder-gray-400"
                />
                {(searchQuery || activeConcern || activeBrand) && (
                  <button 
                    onClick={() => {
                      setSearchQuery("");
                      setActiveConcern(null);
                      setActiveBrand(null);
                    }}
                    className="text-[10px] font-semibold text-gray-450 hover:text-brand-orange px-2.5"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Active Filter Indicators */}
              {(activeConcern || activeBrand || searchQuery) && (
                <div className="flex flex-wrap items-center gap-2 p-3 bg-brand-orange/5 border border-brand-orange/15 rounded-xl text-[10px] font-bold text-brand-orange">
                  <span>Active Filters:</span>
                  {searchQuery && (
                    <span className="bg-white px-2 py-0.5 rounded-full border border-brand-orange/20 flex items-center gap-1">
                      Search: "{searchQuery}"
                      <button onClick={() => setSearchQuery("")} className="hover:text-red-500 text-xs font-black">×</button>
                    </span>
                  )}
                  {activeConcern && (
                    <span className="bg-white px-2 py-0.5 rounded-full border border-brand-orange/20 flex items-center gap-1 uppercase">
                      Concern: {activeConcern}
                      <button onClick={() => setActiveConcern(null)} className="hover:text-red-500 text-xs font-black">×</button>
                    </span>
                  )}
                  {activeBrand && (
                    <span className="bg-white px-2 py-0.5 rounded-full border border-brand-orange/20 flex items-center gap-1">
                      Brand: {activeBrand}
                      <button onClick={() => setActiveBrand(null)} className="hover:text-red-500 text-xs font-black">×</button>
                    </span>
                  )}
                </div>
              )}

              {/* Shop By Health Concerns (Tata 1mg style) */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-brand-orange animate-pulse" />
                  Shop by Health Concerns
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-5 sm:gap-6 justify-items-center py-3">
                  {[
                    { id: "pain", name: "Fever & Pain", img: "/images/concern_fever_pain.png" },
                    { id: "diabetes", name: "Diabetes Care", img: "/images/concern_diabetes.png" },
                    { id: "cardiac", name: "Cardiac Care", img: "/images/concern_cardiac.png" },
                    { id: "stomach", name: "Acidity & Gas", img: "/images/concern_acidity.png" },
                    { id: "allergy", name: "Asthma & Allergy", img: "/images/concern_allergy.png" },
                    { id: "antibiotics", name: "Antibiotics", img: "/images/concern_antibiotics.png" },
                  ].map(concern => (
                    <button
                      key={concern.id}
                      onClick={() => setActiveConcern(activeConcern === concern.id ? null : concern.id)}
                      className="group flex flex-col items-center gap-2 cursor-pointer max-w-[100px]"
                    >
                      {/* Large Circle Logo */}
                      <div className={`w-18 h-18 sm:w-20 sm:h-20 rounded-full overflow-hidden bg-white border-2 flex items-center justify-center shrink-0 transition-all duration-300 transform group-hover:-translate-y-0.5 ${
                        activeConcern === concern.id 
                          ? "border-[#FF6B00] shadow-[0_4px_12px_rgba(255,107,0,0.2)]" 
                          : "border-gray-100 shadow-2xs group-hover:border-[#FF6B00]/50 group-hover:shadow-[0_4px_10px_rgba(0,0,0,0.06)]"
                      }`}>
                        <img src={concern.img} alt={concern.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      </div>
                      <span className={`text-[10px] sm:text-[11px] font-black tracking-tight text-center leading-tight transition-colors ${
                        activeConcern === concern.id ? "text-[#FF6B00]" : "text-gray-700 group-hover:text-[#FF6B00]"
                      }`}>
                        {concern.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Featured Brands */}
              <div className="space-y-2.5">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-1.5">
                  <Check className="h-4 w-4 text-brand-orange" />
                  Featured Manufacturers
                </h3>
                <div className="flex flex-wrap items-center gap-2">
                  {[
                    { name: "Cipla Ltd.", short: "Cipla" },
                    { name: "Micro Labs Ltd.", short: "Micro Labs" },
                    { name: "Sun Pharma Industries", short: "Sun Pharma" },
                    { name: "USV Private Ltd.", short: "USV" },
                    { name: "GlaxoSmithKline", short: "GSK" }
                  ].map(brand => (
                    <button
                      key={brand.name}
                      onClick={() => setActiveBrand(activeBrand === brand.name ? null : brand.name)}
                      className={`px-3 py-1.5 rounded-full border text-[9px] font-bold tracking-wide uppercase transition-all cursor-pointer bg-white ${
                        activeBrand === brand.name 
                          ? "border-brand-orange text-brand-orange bg-brand-orange/5 ring-1 ring-brand-orange" 
                          : "border-gray-200 text-gray-500 hover:border-brand-orange/40 hover:text-brand-orange"
                      }`}
                    >
                      {brand.short}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cross-Selling Diagnostics Packages (Tata 1mg style) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between border-b border-gray-100 pb-1.5">
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-brand-orange" />
                    Top Selling Diagnostics Packages
                  </h3>
                  <Link href="/diagnostics" className="text-[9px] text-brand-orange hover:underline font-bold flex items-center gap-0.5">
                    View All Packages <ChevronRight className="h-3 w-3" />
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {diagnostics.slice(0, 3).map(diag => {
                    const coverImg = diag.image || "/images/lab_fullbody.png";
                    return (
                      <div key={diag.id} className="bg-white border border-gray-200 rounded-2xl overflow-hidden flex flex-col hover:border-brand-orange/35 hover:shadow-lg transition-all shadow-sm group">
                        {/* Diagnostic photo header */}
                        <div className="w-full h-24 overflow-hidden relative bg-gray-50">
                          <img src={coverImg} alt={diag.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/5 to-transparent" />
                          <span className="absolute top-2 right-2 bg-[#00B894] text-white text-[8px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">{diag.testsCount} Tests</span>
                        </div>
                        <div className="p-3 flex flex-col justify-between flex-grow space-y-2">
                          <div className="space-y-1">
                            <h4 className="text-xs font-extrabold text-gray-900 leading-snug line-clamp-2">{diag.name}</h4>
                            <p className="text-[10px] leading-relaxed text-gray-500 font-medium line-clamp-2">{diag.description}</p>
                          </div>
                          <div className="flex items-center justify-between pt-1.5 border-t border-gray-100">
                            <div className="flex items-baseline space-x-1">
                              <span className="text-[11px] font-black text-gray-900">₹{diag.price}</span>
                              <span className="text-[8px] text-gray-400 line-through font-semibold">₹{diag.originalPrice}</span>
                            </div>
                            <Link 
                              href="/diagnostics"
                              className="bg-[#FFF0EB] hover:bg-[#FFE5DC] text-[#FF6B00] font-black text-[9px] tracking-wide rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer"
                            >
                              Book Test
                            </Link>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Medicine Grid Title */}
              <div className="border-b border-gray-100 pb-1.5">
                <h3 className="text-xs font-black text-gray-800 uppercase tracking-widest">
                  Available Medicines Catalog
                </h3>
              </div>

              {/* Medicine Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredMedicines.map((med) => {
                  const medImg = med.image || "/images/med_paracetamol.jpg";
                  const discount = med.originalPrice 
                    ? Math.round(((med.originalPrice - med.price) / med.originalPrice) * 100)
                    : 20;

                  return (
                    <div 
                      key={med.id}
                      className="bg-white border border-gray-100 rounded-[24px] flex flex-col justify-between relative overflow-hidden group hover:scale-[1.015] hover:shadow-xl transition-all duration-300 shadow-sm p-4"
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
                            </svg>
                            Rx
                          </span>
                        )}
                      </div>

                      {/* Isolated packshot image (ZOOMED) */}
                      <div className="w-full h-44 bg-white flex items-center justify-center overflow-hidden mb-4 rounded-xl">
                        <img 
                          src={medImg} 
                          alt={med.name} 
                          className="w-auto h-full max-h-40 object-contain scale-[1.3] group-hover:scale-[1.35] transition-transform duration-500"
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
                        <p className="text-[10px] text-gray-505 font-medium leading-relaxed line-clamp-2 pt-1">
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
                          onClick={() => handleAddToCart(med)}
                          className={`flex items-center gap-1 px-4 py-2 rounded-xl text-[10px] font-bold uppercase transition-all shadow-sm cursor-pointer hover:scale-[1.02] ${
                            addedItems[med.id]
                              ? "bg-green-600 hover:bg-green-700 text-white"
                              : "bg-brand-orange hover:bg-orange-600 text-white"
                          }`}
                        >
                          {addedItems[med.id] ? "Added ✓" : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  );
                })}

                {filteredMedicines.length === 0 && (
                  <div className="col-span-2 text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                    <ShoppingBag className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                    <p className="text-xs font-bold text-gray-600">No matching medicines found</p>
                    <p className="text-[10px] text-gray-450">Try searching general terms like 'OTC' or 'Prescription'.</p>
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

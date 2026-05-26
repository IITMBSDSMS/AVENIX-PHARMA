"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Percent, Tag, ShieldCheck, CreditCard, Sparkles, 
  Search, ArrowRight, Gift, Copy, Check, Info, AlertCircle,
  Stethoscope, Flame, BadgeAlert, ShoppingBag, Clock, Heart, Award
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PromoAd {
  id: string;
  badge: string;
  title: string;
  desc: string;
  code: string;
  discount: string;
  bgGradient: string;
  ctaText: string;
  ctaLink: string;
  imageUrl: string;
  icon: React.ReactNode;
}

interface Coupon {
  id: string;
  code: string;
  title: string;
  desc: string;
  discount: string;
  category: "MEDICINE" | "LAB_TESTS" | "CONSULT" | "PAYMENTS";
  expiry: string;
  minOrder: number;
  percentClaimed: number;
  imageUrl: string;
  featured?: boolean;
}

interface BrandOffer {
  name: string;
  domain: string;
  discount: string;
  color: string;
}

export default function OffersPageClient() {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [activeAd, setActiveAd] = useState(0);

  // 1. Featured Promo Banner Carousel
  const promoAds: PromoAd[] = [
    {
      id: "promo-1",
      badge: "FIRST ORDER SPECIAL",
      title: "First Wealth is Health — Welcome Gift",
      desc: "Get flat 25% discount on all prescription medicines + free express delivery within 3 hours.",
      code: "AVENIX25",
      discount: "25% OFF",
      bgGradient: "from-slate-950 via-[#1e1b4b] to-slate-950",
      ctaText: "Upload Prescription",
      ctaLink: "/prescription-ai",
      imageUrl: "/images/kids_health_deal.png",
      icon: <Gift className="w-12 h-12 text-brand-orange animate-bounce" />
    },
    {
      id: "promo-2",
      badge: "DIAGNOSTICS EXCLUSIVE",
      title: "Complete Wellness Assessment Panel",
      desc: "Flat 50% Off on our NABL-accredited Smart Full Body Health Check package. Free home sample collection.",
      code: "NABL50",
      discount: "50% OFF",
      bgGradient: "from-slate-950 via-[#064e3b] to-slate-950",
      ctaText: "Book Checkup Now",
      ctaLink: "/diagnostics",
      imageUrl: "/images/family_health_deal.png",
      icon: <ShieldCheck className="w-12 h-12 text-emerald-400 animate-pulse" />
    },
    {
      id: "promo-3",
      badge: "RAZORPAY PARTNER DEAL",
      title: "Seamless Checkout & Instant Cashback",
      desc: "Use Razorpay Wallet or Card during checkout and win up to ₹500 guaranteed cashback directly to your bank account.",
      code: "RPAYCASH",
      discount: "₹500 BACK",
      bgGradient: "from-slate-950 via-[#1a365d] to-slate-950",
      ctaText: "Shop Medicines",
      ctaLink: "/delivery",
      imageUrl: "/images/payment_cashback_deal.png",
      icon: <CreditCard className="w-12 h-12 text-[#FF6B00]" />
    }
  ];

  // 2. High-Fidelity Coupon Data
  const coupons: Coupon[] = [
    {
      id: "c-1",
      code: "AVENIX25",
      title: "Flat 25% Off on Prescriptions",
      desc: "Valid on all prescription drugs. Minimum purchase ₹999 required.",
      discount: "25% OFF",
      category: "MEDICINE",
      expiry: "Valid till 30th Jun 2026",
      minOrder: 999,
      percentClaimed: 84,
      imageUrl: "/images/med_paracetamol.png",
      featured: true
    },
    {
      id: "c-2",
      code: "NABL50",
      title: "Flat 50% Off Full Body Screening",
      desc: "Applicable on full-body diagnostics packages and lab profiles.",
      discount: "50% OFF",
      category: "LAB_TESTS",
      expiry: "Valid till 15th Jun 2026",
      minOrder: 1499,
      percentClaimed: 92,
      imageUrl: "/images/lab_fullbody.png",
      featured: true
    },
    {
      id: "c-3",
      code: "DOCFREE",
      title: "First Digital Consultation Free",
      desc: "Consult any verified super-specialist via secure video call link.",
      discount: "FREE CONSULT",
      category: "CONSULT",
      expiry: "Valid till 31st Dec 2026",
      minOrder: 0,
      percentClaimed: 67,
      imageUrl: "/images/doctor_ananya.png"
    },
    {
      id: "c-4",
      code: "GPAY100",
      title: "Flat ₹100 Google Pay Cashback",
      desc: "Applicable on payment via GPay. Minimum order value ₹1200.",
      discount: "₹100 BACK",
      category: "PAYMENTS",
      expiry: "Valid till 30th Jun 2026",
      minOrder: 1200,
      percentClaimed: 45,
      imageUrl: "/images/payment_cashback_deal.png"
    },
    {
      id: "c-5",
      code: "CIPLA30",
      title: "Cipla Therapeutics Special Offer",
      desc: "Extra 30% discount on all branded Cipla generic medicines.",
      discount: "30% OFF",
      category: "MEDICINE",
      expiry: "Valid till 30th Jun 2026",
      minOrder: 799,
      percentClaimed: 76,
      imageUrl: "/images/med_amoxicillin.png"
    },
    {
      id: "c-6",
      code: "HEARTCARE",
      title: "Flat 40% Off Cardiac Lab Profiles",
      desc: "Includes cholesterol testing, lipid panel reviews, and lipid audits.",
      discount: "40% OFF",
      category: "LAB_TESTS",
      expiry: "Valid till 31st Jul 2026",
      minOrder: 1199,
      percentClaimed: 58,
      imageUrl: "/images/lab_cardiac.png"
    },
    {
      id: "c-7",
      code: "CARDX50",
      title: "Save ₹150 using Credit Cards",
      desc: "Get flat ₹150 off on checkout using HDFC, SBI, or ICICI credit cards.",
      discount: "₹150 OFF",
      category: "PAYMENTS",
      expiry: "Valid till 31st Aug 2026",
      minOrder: 2000,
      percentClaimed: 29,
      imageUrl: "/images/payment_cashback_deal.png"
    },
    {
      id: "c-8",
      code: "EMERGENCY",
      title: "Free Instant Dispatch Delivery",
      desc: "Get free express delivery on emergency orders above ₹600.",
      discount: "FREE DELIV",
      category: "MEDICINE",
      expiry: "Valid till 31st Dec 2026",
      minOrder: 600,
      percentClaimed: 89,
      imageUrl: "/images/kids_health_deal.png"
    }
  ];

  // 3. Brand Logo Off-line Crest Data
  const brandOffers: BrandOffer[] = [
    {
      name: "Cipla",
      domain: "cipla.com",
      discount: "Flat 30% Off",
      color: "bg-[#0054A6]/10 border-[#0054A6]/20 text-[#0054A6]"
    },
    {
      name: "Sun Pharma",
      domain: "sunpharma.com",
      discount: "Up to 25% Off",
      color: "bg-[#FF6B00]/10 border-[#FF6B00]/20 text-[#FF6B00]"
    },
    {
      name: "Abbott Labs",
      domain: "abbott.com",
      discount: "Flat 22% Off",
      color: "bg-blue-600/10 border-blue-600/20 text-blue-600"
    },
    {
      name: "GSK",
      domain: "gsk.com",
      discount: "Flat 20% Off",
      color: "bg-amber-600/10 border-amber-600/20 text-amber-600"
    },
    {
      name: "Pfizer",
      domain: "pfizer.com",
      discount: "Flat 28% Off",
      color: "bg-teal-700/10 border-teal-700/20 text-teal-700"
    }
  ];

  // 4. Payment Gateway Direct Badges
  const paymentDeals = [
    { name: "Google Pay", desc: "Win guaranteed cashback up to ₹500", offer: "Flat ₹100 Off", min: 1200, code: "GPAY100", logoUrl: "/images/gpay-logo.svg", img: "gpay" },
    { name: "Paytm Wallet", desc: "Flat 10% cashback on diagnostics checkups", offer: "10% Cashback", min: 1000, code: "PAYTMDX", logoUrl: "/images/paytm-logo.svg", img: "paytm" },
    { name: "PhonePe UPI", desc: "Win scratching card rewards up to ₹250", offer: "Scratch Card", min: 800, code: "PPEUPI", logoUrl: "/images/phonepe-logo.svg", img: "phonepe" },
    { name: "Credit Cards", desc: "Save flat ₹150 using major bank credit cards", offer: "₹150 Off", min: 2000, code: "CARDX50", logoUrl: "", img: "cards" }
  ];

  // Auto ad carousel rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAd((prev) => (prev + 1) % promoAds.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter & Search Logic
  const filteredCoupons = coupons.filter((c) => {
    const matchesCategory = activeCategory === "ALL" || c.category === activeCategory;
    const matchesSearch = 
      c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.desc.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <>
      <Navbar />

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes scroll-r2l {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-r2l {
          display: flex;
          width: max-content;
          animation: scroll-r2l 30s linear infinite;
        }
        .animate-scroll-r2l:hover {
          animation-play-state: paused;
        }
        @keyframes floating-slow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        .floating-element {
          animation: floating-slow 6s ease-in-out infinite;
        }
      `}</style>

      {/* Main Promo Banner Carousel */}
      <div className="w-full border-b border-gray-200 bg-gray-950 relative h-64 sm:h-80 md:h-[350px] lg:h-[380px] flex flex-col justify-between p-6 sm:p-10 md:p-12 overflow-hidden select-none">
        
        {/* Carousel Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-r ${promoAds[activeAd].bgGradient} transition-all duration-1000 z-0`} />
        
        {/* Decorative Grid and Ambient Lights */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px] pointer-events-none z-10" />
        <div className="absolute rounded-full bg-brand-orange/20 w-[400px] h-[400px] blur-[100px] pointer-events-none -top-40 -left-40 z-10" />
        <div className="absolute rounded-full bg-blue-600/10 w-[550px] h-[550px] blur-[120px] pointer-events-none -bottom-40 -right-40 z-10" />

        <div className="mx-auto max-w-[1800px] w-full h-full flex items-center grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-20">
          
          {/* Ad text column */}
          <div className="lg:col-span-7 space-y-4 text-left my-auto">
            
            {/* Promo Badge */}
            <div className="flex items-center">
              <span className="text-[9px] sm:text-[10px] font-bold text-brand-orange uppercase tracking-[0.20em] bg-brand-orange/10 border border-brand-orange/20 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
                <Sparkles className="w-3 h-3 text-brand-orange animate-pulse" />
                {promoAds[activeAd].badge}
              </span>
            </div>

            {/* Title */}
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white leading-tight font-poppins transition-all duration-500">
              {promoAds[activeAd].title}
            </h2>

            {/* Description */}
            <p className="text-xs sm:text-sm text-gray-300 font-medium leading-relaxed max-w-2xl transition-all duration-500">
              {promoAds[activeAd].desc}
            </p>

            {/* Code Copy & CTA Bar */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <div className="flex items-center border border-dashed border-gray-600 bg-black/40 rounded-xl px-4 py-2 text-xs font-mono font-bold text-white tracking-widest relative">
                <span className="text-gray-400 mr-2 text-[9px] uppercase tracking-normal font-sans">Use Code:</span>
                {promoAds[activeAd].code}
                <button 
                  onClick={() => handleCopy(promoAds[activeAd].code)}
                  className="ml-3 p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                  title="Copy Coupon Code"
                >
                  {copiedCode === promoAds[activeAd].code ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <motion.a 
                href={promoAds[activeAd].ctaLink}
                whileHover={{ scale: 1.03 }}
                className="px-5 py-2.5 bg-brand-orange hover:bg-orange-600 text-white text-xs font-black uppercase rounded-xl shadow-lg shadow-brand-orange/25 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {promoAds[activeAd].ctaText}
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.a>
            </div>

          </div>

          {/* Large Animated Illustration Column */}
          <div className="hidden lg:col-span-5 lg:flex items-center justify-end">
            <motion.div
              key={activeAd}
              initial={{ opacity: 0, x: 30, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.96 }}
              transition={{ duration: 0.5 }}
              className="relative w-64 h-64 md:w-72 md:h-72 lg:w-[310px] lg:h-[310px] rounded-[36px] overflow-hidden border border-white/10 shadow-2xl bg-white/5 backdrop-blur-md p-1.5 flex items-center justify-center floating-element"
            >
              <img 
                src={promoAds[activeAd].imageUrl}
                alt={promoAds[activeAd].title}
                className="w-full h-full object-cover rounded-[30px] select-none pointer-events-none"
              />
              <div className="absolute bottom-3.5 left-3.5 bg-brand-orange/95 backdrop-blur-md px-3.5 py-1.5 rounded-xl shadow-lg border border-white/15 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-white" />
                <span>{promoAds[activeAd].discount}</span>
              </div>
            </motion.div>
          </div>

        </div>

        {/* Carousel indicators dots */}
        <div className="mx-auto max-w-[1800px] w-full flex items-center justify-between z-20 pt-2 border-t border-white/5 mt-auto">
          <div className="flex items-center space-x-2">
            {promoAds.map((_, idx) => (
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
            <span>0{promoAds.length}</span>
          </div>
        </div>

      </div>

      <main className="flex-grow bg-[#FCFCFD] py-10 relative overflow-hidden">
        
        {/* Background SVG Watermark Elements */}
        <div className="absolute top-12 right-0 w-[450px] h-[450px] text-brand-orange/[0.015] pointer-events-none select-none z-0 translate-x-1/4">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.8" className="w-full h-full">
            <path d="M100 10 L190 100 L100 190 L10 100 Z" />
            <circle cx="100" cy="100" r="45" />
            <path d="M100 70 L100 130 M70 100 L130 100" />
          </svg>
        </div>
        
        <div className="absolute bottom-20 left-0 w-[400px] h-[400px] text-brand-orange/[0.012] pointer-events-none select-none z-0 -translate-x-1/4">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.6" className="w-full h-full">
            <circle cx="100" cy="100" r="80" strokeDasharray="5 5" />
            <circle cx="100" cy="100" r="40" />
            <path d="M100 10 L100 190 M10 100 L190 100" />
          </svg>
        </div>

        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Section Header */}
          <div className="text-center max-w-xl mx-auto space-y-3 mb-10 mt-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-brand-orange block">
              OFFICIAL AVENIX DIRECT DEALS
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
              Save Big on Your Health Goals
            </h1>
            <p className="text-xs text-gray-500 leading-relaxed">
              Explore corporate coupons, bank rewards, and certified pharmaceutical discounts. Code copy applies automatically during Razorpay checkouts.
            </p>
          </div>

          {/* Branded Partners Infinite Logo Marquee */}
          <div className="space-y-4 mb-12">
            <h3 className="text-center text-[10px] font-black uppercase tracking-widest text-brand-dark flex items-center justify-center gap-2">
              <BadgeAlert className="h-3.5 w-3.5 text-brand-orange animate-pulse" />
              Special Brand-Specific Discounts
            </h3>
            
            <div className="w-full overflow-hidden bg-gray-50 border-y border-gray-150 py-4 relative">
              <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#FCFCFD] to-transparent z-10 pointer-events-none" />
              <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#FCFCFD] to-transparent z-10 pointer-events-none" />
              
              <div className="animate-scroll-r2l flex gap-6">
                {/* Loop 1 */}
                {brandOffers.concat(brandOffers).concat(brandOffers).map((brand, i) => (
                  <div 
                    key={`brand-1-${i}`}
                    className="flex items-center gap-3.5 bg-white border border-gray-150 rounded-full pl-3 pr-5 py-2 shadow-2xs shrink-0 select-none hover:shadow-xs transition-all duration-300"
                  >
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shrink-0 border border-gray-150 overflow-hidden shadow-2xs p-1">
                      <img 
                        src={`https://s2.googleusercontent.com/s2/favicons?domain=${brand.domain}&sz=128`}
                        alt={`${brand.name} logo`}
                        className="w-full h-full object-contain rounded-full"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.onerror = null;
                          target.style.display = "none";
                          const parent = target.parentElement;
                          if (parent && !parent.querySelector(".fallback-text")) {
                            const span = document.createElement("span");
                            span.className = "fallback-text text-[9px] font-black text-brand-dark font-sans tracking-tight uppercase";
                            span.innerText = brand.name.slice(0, 3);
                            parent.appendChild(span);
                          }
                        }}
                      />
                    </div>
                    <div className="text-left leading-tight">
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{brand.name}</div>
                      <div className="text-xs font-black text-brand-orange mt-0.5">{brand.discount}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Interactive Filters and Search Bar Container */}
          <div className="max-w-5xl mx-auto mb-10 bg-white border border-gray-100 rounded-3xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
            
            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              {[
                { name: "ALL DEALS", value: "ALL" },
                { name: "MEDICINES", value: "MEDICINE" },
                { name: "LAB TEST OFFERS", value: "LAB_TESTS" },
                { name: "CONSULTATIONS", value: "CONSULT" },
                { name: "PAYMENTS", value: "PAYMENTS" }
              ].map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setActiveCategory(tab.value)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                    activeCategory === tab.value
                      ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
                      : "bg-gray-50 hover:bg-gray-100 text-gray-600 border border-gray-150"
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search promo codes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-150 bg-[#FCFCFD] focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange/20 text-xs font-medium placeholder-gray-400"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
                >
                  Clear
                </button>
              )}
            </div>

          </div>

          {/* Promo Deals Grid */}
          <div className="max-w-5xl mx-auto">
            {filteredCoupons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {filteredCoupons.map((coupon) => (
                    <motion.div
                      key={coupon.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className={`bg-white rounded-[32px] border ${
                        coupon.featured 
                          ? "border-brand-orange/40 shadow-md shadow-brand-orange/5" 
                          : "border-gray-150 shadow-2xs"
                      } hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col justify-between`}
                    >
                      {/* Corner Sparkle for Featured */}
                      {coupon.featured && (
                        <div className="absolute top-0 right-0 bg-brand-orange text-white text-[7.5px] font-black uppercase tracking-widest px-3 py-1.5 rounded-bl-2xl flex items-center gap-1 shadow-sm z-10">
                          <Sparkles className="w-2.5 h-2.5 animate-spin" style={{ animationDuration: "5s" }} />
                          Featured Deal
                        </div>
                      )}

                      {/* Header details with Coupon Cutter Pattern */}
                      <div className="p-5 pb-3 flex gap-4.5 items-center relative z-10">
                        {/* Photographic/Graphic Preview Thumbnail */}
                        <div className="h-20 w-20 rounded-full overflow-hidden shrink-0 border border-gray-150 bg-white shadow-md flex items-center justify-center p-1">
                          <img 
                            src={coupon.imageUrl} 
                            alt={`${coupon.title} preview`} 
                            className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-108 select-none"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = "https://cdn-icons-png.flaticon.com/512/508/508786.png";
                            }}
                          />
                        </div>

                        {/* Title details */}
                        <div className="space-y-1 text-left min-w-0 pr-12 flex-grow">
                          <span className="text-[8px] font-black uppercase tracking-wider text-brand-orange bg-brand-orange/10 border border-brand-orange/20 px-2 py-0.5 rounded-full">
                            {coupon.category.replace("_", " ")}
                          </span>
                          <h3 className="text-sm sm:text-md font-black text-brand-dark truncate group-hover:text-brand-orange transition-colors duration-300">{coupon.title}</h3>
                          <p className="text-[10px] text-gray-500 leading-normal line-clamp-2">{coupon.desc}</p>
                        </div>
                      </div>

                      {/* Coupon Cutter Dashed Divider */}
                      <div className="relative h-1 flex items-center justify-between select-none">
                        <div className="absolute left-0 -translate-x-1/2 w-4 h-4 rounded-full bg-[#FCFCFD] border-r border-gray-150 z-10" />
                        <div className="w-full border-t border-dashed border-gray-200" />
                        <div className="absolute right-0 translate-x-1/2 w-4 h-4 rounded-full bg-[#FCFCFD] border-l border-gray-150 z-10" />
                      </div>

                      {/* Claim progress details & Coupon Action row */}
                      <div className="p-6 pt-4 space-y-4">
                        {/* Claims progress loading line */}
                        <div className="space-y-1.5 text-left">
                          <div className="flex justify-between text-[9px] font-bold text-gray-400 uppercase">
                            <span>Coupon Claimed</span>
                            <span className="font-extrabold text-brand-dark">{coupon.percentClaimed}%</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden border border-gray-200/50">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-brand-orange rounded-full shadow-inner" 
                              style={{ width: `${coupon.percentClaimed}%` }}
                            />
                          </div>
                        </div>

                        {/* Footer coupon claim triggers */}
                        <div className="flex items-center justify-between gap-4 pt-1">
                          <div className="text-left font-mono">
                            <div className="text-[8px] text-gray-400 uppercase tracking-widest font-sans font-bold">Expires</div>
                            <div className="text-[10px] text-gray-500 font-extrabold flex items-center gap-1">
                              <Clock className="w-3 h-3 text-gray-400" />
                              {coupon.expiry.replace("Valid till ", "")}
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleCopy(coupon.code)}
                              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer ${
                                copiedCode === coupon.code 
                                  ? "bg-emerald-500 text-white shadow-emerald-500/20"
                                  : "bg-[#FFF0EB] hover:bg-[#FFE5DC] text-[#FF6B00]"
                              }`}
                            >
                              {copiedCode === coupon.code ? (
                                <>
                                  <Check className="w-3.5 h-3.5" />
                                  Copied ✓
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3.5 h-3.5" />
                                  Copy Code
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="bg-white border border-gray-150 rounded-3xl p-12 text-center max-w-md mx-auto space-y-4">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto animate-pulse" />
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-brand-dark uppercase">No matching coupons found</h4>
                  <p className="text-[11px] text-gray-500 leading-normal">
                    Try searching other keywords like &quot;GPAY&quot;, &quot;50%&quot;, or &quot;AVENIX&quot; to inspect active promotions.
                  </p>
                </div>
                <button 
                  onClick={() => { setSearchQuery(""); setActiveCategory("ALL"); }}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-[10px] font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* Payment Gateways Special Cashback Offers */}
          <div className="max-w-5xl mx-auto mt-20 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-brand-orange block">
                BANK & PAYMENT WALLET PRIVILEGES
              </span>
              <h2 className="text-lg font-black text-brand-dark uppercase tracking-widest">
                Partner Payment Promotions
              </h2>
              <p className="text-[11px] text-gray-500 max-w-lg mx-auto">
                Get supplementary instant cashbacks and credit reward vouchers by paying through Avenix integrated Razorpay checkout gateways.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {paymentDeals.map((deal, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-5 rounded-[28px] border border-gray-150 hover:border-brand-orange/40 hover:shadow-md transition-all duration-300 flex flex-col justify-between text-left space-y-4 group"
                >
                  <div className="space-y-3">
                    {/* Payment Icon Placeholder in Circle */}
                    {deal.logoUrl ? (
                      <div className="h-14 w-14 rounded-full border border-gray-150 bg-white flex items-center justify-center p-2.5 shrink-0 overflow-hidden shadow-xs hover:scale-105 transition-transform duration-300">
                        <img 
                          src={deal.logoUrl} 
                          alt={`${deal.name} logo`} 
                          className="w-full h-full object-contain rounded-full"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.onerror = null;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent && !parent.querySelector(".fallback-text")) {
                              const span = document.createElement("span");
                              span.className = "fallback-text text-[9px] font-black text-brand-dark font-sans tracking-tight uppercase";
                              span.innerText = deal.code.slice(0, 4);
                              parent.appendChild(span);
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 via-purple-600 to-indigo-700 text-white border border-indigo-600/20 flex items-center justify-center shrink-0 shadow-xs hover:scale-105 transition-transform duration-300">
                        <CreditCard className="w-6 h-6 text-white" />
                      </div>
                    )}

                    <div className="space-y-1">
                      <div className="text-xs font-black text-brand-orange uppercase tracking-wider">{deal.offer}</div>
                      <h4 className="text-xs font-black text-brand-dark">{deal.name}</h4>
                      <p className="text-[10px] text-gray-400 leading-normal">{deal.desc}</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-100 pt-3 flex items-center justify-between">
                    <span className="text-[9px] text-gray-400 font-bold uppercase">Min Order: ₹{deal.min}</span>
                    <button
                      onClick={() => handleCopy(deal.code)}
                      className="text-[9px] font-black text-brand-orange hover:text-orange-600 uppercase flex items-center gap-0.5 transition-colors cursor-pointer"
                    >
                      {copiedCode === deal.code ? "Copied ✓" : "Copy Code"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Secure Guarantee Seal Stamp section */}
          <div className="max-w-5xl mx-auto mt-20 p-8 rounded-3xl bg-gray-50 border border-gray-150 flex flex-col md:flex-row items-center gap-6 justify-between text-left">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-xs">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <div className="space-y-1 max-w-xl">
                <h4 className="text-sm font-black text-brand-dark uppercase">100% Genuine Discount Guarantees</h4>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  All promotional coupons and brand discounts listed on Avenix are fully certified. Payments checkout integrations comply with PCI-DSS guidelines for secure medical transactions.
                </p>
              </div>
            </div>

            <a 
              href="/delivery"
              className="px-5 py-3 bg-brand-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-xl transition-all shadow-md shadow-brand-orange/20 cursor-pointer shrink-0"
            >
              Start Ordering Now
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

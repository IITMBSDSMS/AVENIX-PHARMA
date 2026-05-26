"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAppState, Role } from "@/context/AppState";
import {
  Activity, ShoppingCart, User, ChevronDown, Flame,
  ShieldAlert, Menu, X, ChevronRight, Percent, Search, MapPin, LocateFixed
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, role, logout, cart, emergencyActive, searchQuery, setSearchQuery } = useAppState();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeLoc, setActiveLoc] = useState("");
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState(false);

  // Auto-detect location on mount
  useEffect(() => {
    detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const detectLocation = () => {
    if (!navigator.geolocation) {
      setActiveLoc("400001 Mumbai");
      return;
    }
    setLocLoading(true);
    setLocError(false);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
            { headers: { "Accept-Language": "en" } }
          );
          const data = await res.json();
          const addr = data.address || {};
          const city =
            addr.city ||
            addr.town ||
            addr.village ||
            addr.suburb ||
            addr.county ||
            "Your City";
          const pin = addr.postcode ? addr.postcode.split("-")[0].trim() : "";
          setActiveLoc(pin ? `${pin} ${city}` : city);
        } catch {
          setActiveLoc("400001 Mumbai");
          setLocError(true);
        } finally {
          setLocLoading(false);
        }
      },
      () => {
        setActiveLoc("400001 Mumbai");
        setLocError(true);
        setLocLoading(false);
      },
      { timeout: 8000, maximumAge: 300000 }
    );
  };

  const [searchVal, setSearchVal] = useState("");
  const [typedPlaceholder, setTypedPlaceholder] = useState("");
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Typewriter animation for search placeholder
  useEffect(() => {
    const phrases = [
      "Search Paracetamol 650mg…",
      "Search Amoxicillin 500mg…",
      "Search Full Body Health Checkup…",
      "Search Diabetes Care Kit…",
      "Search Consult a Cardiologist…",
      "Search Cetirizine 10mg…",
      "Search Vitamin C Supplements…",
      "Search Cardiac Screening…",
    ];
    let phraseIdx = 0;
    let charIdx = 0;
    let deleting = false;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      const current = phrases[phraseIdx];
      if (!deleting) {
        charIdx++;
        setTypedPlaceholder(current.slice(0, charIdx));
        if (charIdx === current.length) {
          deleting = true;
          timer = setTimeout(tick, 1800); // pause before delete
          return;
        }
        timer = setTimeout(tick, 70); // type speed
      } else {
        charIdx--;
        setTypedPlaceholder(current.slice(0, charIdx));
        if (charIdx === 0) {
          deleting = false;
          phraseIdx = (phraseIdx + 1) % phrases.length;
          timer = setTimeout(tick, 300); // pause before next phrase
          return;
        }
        timer = setTimeout(tick, 35); // delete speed
      }
    };

    timer = setTimeout(tick, 800);
    return () => clearTimeout(timer);
  }, []);

  // Sync searchVal with global searchQuery context
  useEffect(() => {
    setSearchVal(searchQuery || "");
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchVal.trim()) return;
    setSearchQuery(searchVal);
    router.push("/delivery");
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: "HOME", href: "/" },
    { name: "MEDICINES", href: "/delivery" },
    { name: "PRESCRIPTION AI", href: "/prescription-ai" },
    { name: "HEALTH ASSISTANT", href: "/assistant" },
    { name: "EMERGENCY DELIVERY", href: "/emergency" },
    { name: "DIAGNOSTICS", href: "/diagnostics" },
    { name: "DOCTORS", href: "/doctors" },
  ];



  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-gray-200/40">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          
          {/* Row 1: Brand Logo, Location Selector & Right Actions */}
          <div className="flex h-16 items-center gap-3 border-b border-gray-100/70">
            {/* Left Side: Logo & Location */}
            <div className="flex items-center gap-5">
              {/* Logo */}
              <Link href="/" className="flex items-center group" aria-label="Avenix Pharmaceuticals Home">
                <div className="flex flex-col select-none text-left">
                  <span className="text-2xl sm:text-[28px] md:text-[30px] font-black tracking-tight text-brand-dark flex items-center font-poppins leading-none">
                    AVENIX
                    <span className="text-brand-orange ml-0.5">X</span>
                  </span>
                  <span className="text-[6.5px] sm:text-[7.5px] md:text-[8.5px] font-black tracking-[0.32em] sm:tracking-[0.38em] md:tracking-[0.44em] text-gray-400 mt-0.5 uppercase font-mono">
                    PHARMACEUTICALS
                  </span>
                </div>
              </Link>
              
              {/* Vertical Divider */}
              <div className="hidden sm:block h-8 w-[1px] bg-gray-200" />
              
              {/* Location Widget — GPS Auto-Detect */}
              <div className="hidden sm:flex flex-col text-left min-w-[110px]">
                <span className="text-[9px] font-medium text-gray-400 flex items-center gap-1 leading-none">
                  {locLoading ? (
                    <span className="inline-flex items-center gap-1 text-brand-orange">
                      <span className="h-1.5 w-1.5 rounded-full bg-brand-orange animate-ping inline-block" />
                      Detecting…
                    </span>
                  ) : (
                    <>
                      <MapPin className="h-2.5 w-2.5 text-brand-orange" />
                      Express delivery to
                    </>
                  )}
                </span>
                <div className="flex items-center gap-1.5 mt-1">
                  {locLoading ? (
                    <span className="text-xs font-black text-gray-400 animate-pulse">Locating you…</span>
                  ) : (
                    <span className="text-xs font-black text-gray-800 truncate max-w-[120px]">
                      {activeLoc || "Detecting…"}
                    </span>
                  )}
                  <button
                    onClick={detectLocation}
                    title="Re-detect my location"
                    aria-label="Auto-detect my current location"
                    className={`shrink-0 p-0.5 rounded-full transition-all cursor-pointer ${
                      locLoading
                        ? "text-brand-orange animate-spin"
                        : locError
                        ? "text-red-400 hover:text-brand-orange"
                        : "text-gray-400 hover:text-brand-orange"
                    }`}
                  >
                    <LocateFixed className="h-3 w-3" />
                  </button>
                </div>
                {locError && !locLoading && (
                  <span className="text-[8px] text-red-400 font-semibold mt-0.5">
                    Permission denied — showing default
                  </span>
                )}
              </div>
            </div>

            {/* Center Search Bar — desktop only */}
            <form
              onSubmit={handleSearchSubmit}
              id="navbar-search-form"
              className="hidden md:flex flex-1 min-w-0 mx-4 lg:mx-6 items-center relative"
              role="search"
              aria-label="Search medicines"
            >
              <Search className="h-4 w-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                id="navbar-search-input"
                type="search"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder={searchVal ? "" : typedPlaceholder || "Search medicines, lab tests, doctors…"}
                className="w-full bg-gray-50 border border-gray-200 hover:border-gray-300 focus:border-brand-orange focus:bg-white rounded-2xl text-xs text-brand-dark pl-10 pr-24 py-2.5 outline-none transition-all placeholder-gray-400 font-medium"
                autoComplete="off"
              />
              <button
                type="submit"
                id="navbar-search-btn"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 py-1.5 px-4 bg-brand-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Search
              </button>
            </form>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 sm:gap-5 shrink-0">
              


              {/* Login / Hello User Link */}
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 text-left text-gray-600 hover:text-brand-orange transition-colors cursor-pointer group"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-8 w-8 rounded-full border border-brand-orange/20 object-cover"
                      />
                      <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-[#FF4C4C] ring-2 ring-white animate-pulse" />
                    </div>
                    <div className="hidden md:flex flex-col leading-none">
                      <span className="text-[9.5px] text-gray-400 font-bold">Hello, {user.name.startsWith("Dr.") || user.name.startsWith("Pharmacist") ? user.name : user.name.split(" ")[0]}</span>
                      <span className="text-xs font-black text-gray-850 group-hover:text-brand-orange transition-colors mt-0.5">My Account</span>
                    </div>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white p-2 shadow-2xl ring-1 ring-black/5 z-50 glass-card">
                      <div className="px-3 py-2 border-b border-gray-100">
                        <p className="text-xs font-bold text-gray-900 truncate">{user.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[8px] font-extrabold uppercase bg-brand-orange/10 text-brand-orange rounded-full tracking-wider">
                          {role === "admin" ? "Super Admin" : role}
                        </span>
                      </div>
                      <div className="py-1">
                        <Link
                          href={`/dashboard/${role === "admin" ? "admin" : role}`}
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-brand-orange/5 hover:text-brand-orange rounded-lg transition-colors"
                        >
                          <User className="h-4 w-4" />
                          Go to Dashboard
                        </Link>
                        <Link
                          href="/prescription-ai"
                          onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-brand-orange/5 hover:text-brand-orange rounded-lg transition-colors"
                        >
                          <Activity className="h-4 w-4" />
                          AI Scans & Reports
                        </Link>
                      </div>
                      <div className="border-t border-gray-100 pt-1 mt-1">
                        <button
                          onClick={() => {
                            setDropdownOpen(false);
                            logout();
                            router.push("/login");
                          }}
                          className="flex w-full items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <ShieldAlert className="h-4 w-4" />
                          Switch / Re-authenticate
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-gray-600 hover:text-brand-orange transition-colors group cursor-pointer"
                >
                  <div className="relative p-1.5 rounded-full bg-gray-100 group-hover:bg-brand-orange/5 transition-colors">
                    <User className="h-4 w-4 text-gray-500 group-hover:text-brand-orange transition-colors" />
                    <span className="absolute top-0 right-0 h-1.5 w-1.5 rounded-full bg-[#FF4C4C] ring-2 ring-white" />
                  </div>
                  <div className="flex flex-col text-left leading-none">
                    <span className="text-[9.5px] text-gray-400 font-bold">Login or</span>
                    <span className="text-xs font-black text-gray-800 group-hover:text-brand-orange transition-colors mt-0.5">Sign In / Sign Up</span>
                  </div>
                </Link>
              )}

              {/* Offers action icon */}
              <Link
                href="/offers"
                className="flex items-center gap-2 text-gray-600 hover:text-brand-orange transition-colors group cursor-pointer"
              >
                <div className="p-1.5 rounded-full bg-gray-100 group-hover:bg-brand-orange/5 transition-colors">
                  <Percent className="h-4 w-4 text-gray-500 group-hover:text-brand-orange transition-colors" />
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[9.5px] text-gray-400 font-bold">Special</span>
                  <span className="text-xs font-black text-gray-800 group-hover:text-brand-orange transition-colors mt-0.5">Offers</span>
                </div>
              </Link>

              {/* Cart action icon */}
              <Link
                href="/cart"
                className="flex items-center gap-2 text-gray-600 hover:text-brand-orange transition-colors group cursor-pointer"
                aria-label={`Shopping cart, ${cartCount} items`}
              >
                <div className="relative p-1.5 rounded-full bg-gray-100 group-hover:bg-brand-orange/5 transition-colors">
                  <ShoppingCart className="h-4 w-4 text-gray-500 group-hover:text-brand-orange transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-orange text-[9px] font-bold text-white ring-2 ring-white">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[9.5px] text-gray-400 font-bold">Active</span>
                  <span className="text-xs font-black text-gray-800 group-hover:text-brand-orange transition-colors mt-0.5">Cart</span>
                </div>
              </Link>

              {/* Mobile hamburger menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl text-gray-600 hover:text-brand-orange hover:bg-gray-100 transition-colors flex items-center justify-center shrink-0 w-10 h-10"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search Row — tablet/phone only */}
          <div className="flex md:hidden items-center pb-2.5 pt-1">
            <form
              onSubmit={handleSearchSubmit}
              id="mobile-search-form"
              className="flex w-full items-center relative"
              role="search"
              aria-label="Search medicines mobile"
            >
              <Search className="h-4 w-4 text-gray-400 absolute left-3.5 pointer-events-none" />
              <input
                id="mobile-search-input"
                type="search"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder={searchVal ? "" : typedPlaceholder || "Search medicines, lab tests…"}
                className="w-full bg-gray-50 border border-gray-200 focus:border-brand-orange focus:bg-white rounded-2xl text-xs text-brand-dark pl-10 pr-20 py-2.5 outline-none transition-all placeholder-gray-400 font-medium"
                autoComplete="off"
              />
              <button
                type="submit"
                id="mobile-search-btn"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 py-1.5 px-3 bg-brand-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer shadow-sm"
              >
                Go
              </button>
            </form>
          </div>

          {/* Row 2: Secondary Navigation Links */}
          <div className="hidden md:flex h-11 items-center justify-center">
            <nav className="flex items-center space-x-6 lg:space-x-8" aria-label="Secondary navigation">
              {[
                { name: "MEDICINE", href: "/delivery", hasDropdown: false },
                { name: "HEALTHCARE", href: "/verify", hasDropdown: true },
                { name: "DOCTOR CONSULT", href: "/doctors", hasDropdown: false },
                { name: "LAB TESTS", href: "/diagnostics", hasDropdown: true },
                { name: "PLUS", href: "/delivery", hasDropdown: false, isHighlight: true },
                { name: "Health Insights", href: "/prescription-ai", hasDropdown: true },
                { name: "OFFERS", href: "/offers", hasDropdown: false },
              ].map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`flex items-center gap-1 py-1.5 text-xs font-black transition-colors ${
                      link.isHighlight
                        ? "text-brand-orange hover:text-orange-600 bg-brand-orange/10 px-2.5 py-0.5 rounded-md shadow-2xs font-extrabold"
                        : isActive
                        ? "text-brand-orange"
                        : "text-gray-700 hover:text-brand-orange"
                    }`}
                  >
                    {link.name}
                    {link.hasDropdown && (
                      <ChevronDown className="h-3 w-3 text-gray-400 group-hover:text-brand-orange" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Full-Screen Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          className="md:hidden fixed inset-0 z-40 flex flex-col"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />

          {/* Drawer panel — slides in from left */}
          <nav className="relative z-50 w-[80vw] max-w-[320px] h-full bg-white shadow-2xl flex flex-col overflow-y-auto">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 bg-brand-orange/5">
              <div className="flex flex-col select-none">
                <span className="text-xl font-extrabold tracking-tight text-brand-dark font-poppins leading-none">
                  AVENIX<span className="text-brand-orange font-black">X</span>
                </span>
                <span className="text-[7px] font-black tracking-[0.30em] text-gray-400 uppercase font-mono">
                  PHARMACEUTICALS
                </span>
              </div>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-gray-100 min-w-[40px] min-h-[40px] flex items-center justify-center"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Nav links */}
            <div className="flex-1 px-3 py-4 space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const isEmergency = link.name === "Emergency Delivery";
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all min-h-[52px] ${
                      isActive
                        ? "bg-brand-orange text-white shadow-md shadow-brand-orange/25"
                        : isEmergency
                        ? emergencyActive
                          ? "bg-red-50 text-red-600"
                          : "bg-orange-50 text-brand-orange"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      {isEmergency && (
                        <Flame className={`h-4 w-4 ${emergencyActive ? "text-red-500" : ""}`} />
                      )}
                      {link.name}
                    </span>
                    <ChevronRight className={`h-4 w-4 ${isActive ? "text-white/70" : "text-gray-400"}`} />
                  </Link>
                );
              })}
            </div>



            {/* Login CTA */}
            <div className="px-4 py-4 border-t border-gray-100">
              {user ? (
                <div className="flex items-center gap-3 p-3 bg-brand-orange/5 rounded-2xl">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-10 w-10 rounded-full border-2 border-brand-orange/20 object-cover shrink-0"
                    loading="lazy"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{user.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{user.email}</p>
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="block w-full text-center bg-brand-orange hover:bg-orange-600 text-white text-sm font-bold py-3.5 rounded-2xl transition-all shadow-md shadow-brand-orange/25 min-h-[52px] flex items-center justify-center"
                >
                  Login / Signup
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}

      {/* Close role dropdown on outside click */}
      {dropdownOpen && (
        <div
          className="fixed inset-0 z-30"
          onClick={() => { setDropdownOpen(false); }}
        />
      )}
    </>
  );
}

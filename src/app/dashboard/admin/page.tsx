"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState, Medicine, CarouselBanner, TestimonialReel, HealthCategory, DiagnosticPackage } from "@/context/AppState";
import { 
  BarChart, Activity, AlertTriangle, ShieldCheck, 
  Map, Network, TrendingUp, Users, DollarSign, Award,
  Plus, Trash2, Edit2, Save, X, Image, Film, Tag, Briefcase, PlusCircle, Check,
  FileText, Mail, UserCheck, Globe, KeyRound, Clock, UserCircle2
} from "lucide-react";

type Tab = "overview" | "banners" | "reels" | "categories" | "medicines" | "diagnostics" | "users";

interface RegisteredUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
  createdAt: string;
}

export default function AdminDashboard() {
  const { 
    user,
    orders, banners, testimonials, categories, medicines, diagnostics,
    updateBanners, updateTestimonials, updateCategories,
    addMedicine, updateMedicine, deleteMedicine,
    addDiagnosticPackage, updateDiagnosticPackage, deleteDiagnosticPackage,
    downloadWelcomePDF
  } = useAppState();

  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [successToast, setSuccessToast] = useState("");
  const [mounted, setMounted] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (activeTab === "users") {
      setUsersLoading(true);
      fetch("/api/users")
        .then(r => r.json())
        .then(data => {
          if (data.users) setRegisteredUsers(data.users);
        })
        .catch(console.error)
        .finally(() => setUsersLoading(false));
    }
  }, [activeTab]);

  const isGoogleUser = (avatar?: string | null) =>
    !!(avatar && (avatar.includes("googleusercontent.com") || avatar.includes("lh3.google")));

  const filteredUsers = registeredUsers.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email.toLowerCase().includes(userSearch.toLowerCase());
    const matchRole = userRoleFilter === "all" || u.role === userRoleFilter;
    return matchSearch && matchRole;
  });

  // Banners editing state
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  const [bannerForm, setBannerForm] = useState<Partial<CarouselBanner>>({});
  const [newBannerMode, setNewBannerMode] = useState(false);

  // Testimonials/Reels editing state
  const [editingReelId, setEditingReelId] = useState<number | null>(null);
  const [reelForm, setReelForm] = useState<Partial<TestimonialReel>>({});

  // Categories editing state
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [categoryForm, setCategoryForm] = useState<Partial<HealthCategory>>({});

  // Medicines editing state
  const [editingMedId, setEditingMedId] = useState<string | null>(null);
  const [medForm, setMedForm] = useState<Partial<Medicine>>({});
  const [newMedMode, setNewMedMode] = useState(false);

  // Diagnostics editing state
  const [editingDiagId, setEditingDiagId] = useState<string | null>(null);
  const [diagForm, setDiagForm] = useState<Partial<DiagnosticPackage>>({});
  const [newDiagMode, setNewDiagMode] = useState(false);

  // Toast Helper
  const showToast = (msg: string) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3000);
  };

  // Mock Admin States (from original page)
  const [fraudLogs] = useState([
    { id: 1, type: "CDSCO Registry Alert", details: "Batch AVX-BAD-CODE flagged as unregistered CDSCO ledger entity", location: "Noida Sector 45", time: "5 mins ago", severity: "High" },
    { id: 2, type: "Multiple IP Handshake", details: "OTP verification mismatch from 2 concurrent IP devices", location: "New Delhi", time: "1 hr ago", severity: "Moderate" }
  ]);

  const [deliveryNodes] = useState([
    { name: "Pharmacy Hub 1", type: "Hub", status: "Active", coordinate: "28.613, 77.209" },
    { name: "Pharmacy Hub 2", type: "Hub", status: "Active", coordinate: "28.535, 77.391" },
    { name: "Rider Rahul Kumar", type: "Courier", status: "Transit", coordinate: "28.601, 77.251" },
    { name: "Rider Amit Singh", type: "Courier", status: "Idle", coordinate: "28.581, 77.312" }
  ]);

  // Statistics calculation
  const totalRev = orders
    .filter(o => o.status !== "cancelled" && o.status !== "pending")
    .reduce((sum, o) => sum + o.totalAmount, 0) + 128450; // add mock baseline

  // Banner Actions
  const handleSaveBanner = (id: string) => {
    const updated = banners.map(b => b.id === id ? { ...b, ...bannerForm } as CarouselBanner : b);
    updateBanners(updated);
    setEditingBannerId(null);
    showToast("Banner updated successfully!");
  };

  const handleAddBanner = () => {
    const newBanner: CarouselBanner = {
      id: `banner-${Date.now()}`,
      badge: bannerForm.badge || "NEW PROMOTION",
      title: bannerForm.title || "Special Medicine Discount Offer",
      desc: bannerForm.desc || "Verified brand medicines at unbeatable price points.",
      cta: bannerForm.cta || "Use Code: NEWAVX",
      btnText: bannerForm.btnText || "Shop Now",
      img: bannerForm.img || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200",
      link: bannerForm.link || "/delivery"
    };
    updateBanners([...banners, newBanner]);
    setNewBannerMode(false);
    setBannerForm({});
    showToast("New banner added successfully!");
  };

  const handleDeleteBanner = (id: string) => {
    if (confirm("Are you sure you want to delete this banner?")) {
      updateBanners(banners.filter(b => b.id !== id));
      showToast("Banner deleted successfully!");
    }
  };

  // Testimonial/Reel Actions
  const handleSaveReel = (id: number) => {
    const updated = testimonials.map(t => t.id === id ? { ...t, ...reelForm } as TestimonialReel : t);
    updateTestimonials(updated);
    setEditingReelId(null);
    showToast("Testimonial reel updated successfully!");
  };

  // Category Actions
  const handleSaveCategory = (id: string) => {
    const updated = categories.map(c => c.id === id ? { ...c, ...categoryForm } as HealthCategory : c);
    updateCategories(updated);
    setEditingCategoryId(null);
    showToast("Category details updated!");
  };

  // Medicine Catalog Actions
  const handleSaveMed = (id: string) => {
    updateMedicine(id, medForm);
    setEditingMedId(null);
    showToast("Medicine item updated!");
  };

  const handleAddMed = () => {
    addMedicine({
      name: medForm.name || "Generic Medicine Name",
      tagline: medForm.tagline || "Clinical efficacy formulation",
      price: Number(medForm.price) || 50,
      originalPrice: medForm.originalPrice ? Number(medForm.originalPrice) : undefined,
      inStock: Number(medForm.inStock) || 100,
      requiresPrescription: !!medForm.requiresPrescription,
      dosage: medForm.dosage || "1-0-1 after meals",
      category: medForm.category || "OTC",
      manufacturer: medForm.manufacturer || "Avenix Bio Labs",
      image: medForm.image || undefined
    });
    setNewMedMode(false);
    setMedForm({});
    showToast("Medicine added to catalog!");
  };

  const handleDeleteMed = (id: string) => {
    if (confirm("Remove this medicine from catalog?")) {
      deleteMedicine(id);
      showToast("Medicine removed.");
    }
  };

  // Diagnostic Package Actions
  const handleSaveDiag = (id: string) => {
    updateDiagnosticPackage(id, diagForm);
    setEditingDiagId(null);
    showToast("Lab package updated!");
  };

  const handleAddDiag = () => {
    addDiagnosticPackage({
      name: diagForm.name || "Special Health Screen",
      price: Number(diagForm.price) || 999,
      originalPrice: Number(diagForm.originalPrice) || 1999,
      testsCount: Number(diagForm.testsCount) || 20,
      tests: typeof diagForm.tests === "string" ? (diagForm.tests as string).split(",").map(t => t.trim()) : diagForm.tests || [],
      description: diagForm.description || "Diagnostics package checkup"
    });
    setNewDiagMode(false);
    setDiagForm({});
    showToast("Diagnostics package added!");
  };

  const handleDeleteDiag = (id: string) => {
    if (confirm("Delete this lab test package?")) {
      deleteDiagnosticPackage(id);
      showToast("Package deleted.");
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow medical-grid py-8 min-h-screen">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-brand-orange">
                Super Admin Terminal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
                Enterprise Command Control
              </h1>
            </div>
            <div className="flex gap-2.5 items-center flex-wrap">
              <button
                onClick={() => downloadWelcomePDF(user)}
                className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-750 text-[10.5px] font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="h-3.5 w-3.5 text-brand-orange" />
                Download Welcome Letter & Credentials (PDF)
              </button>
              <div className="bg-brand-orange/10 border border-brand-orange/15 px-3 py-1.5 rounded-xl text-[10px] font-bold text-brand-orange flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" />
                <span>Identity Verified: {user?.name || "Anjali Roy (Super Admin)"}</span>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-gray-200 scrollbar-none">
            {[
              { id: "overview", label: "Overview", icon: BarChart },
              { id: "users", label: "Registered Users", icon: Users },
              { id: "banners", label: "Carousel Banners", icon: Image },
              { id: "reels", label: "Reels / Testimonials", icon: Film },
              { id: "categories", label: "Categories Grid", icon: Tag },
              { id: "medicines", label: "Medicine Catalog", icon: Briefcase },
              { id: "diagnostics", label: "Lab Packages", icon: Activity }
            ].map(tab => {
              const TabIcon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id as Tab);
                    setNewBannerMode(false);
                    setNewMedMode(false);
                    setNewDiagMode(false);
                    setEditingBannerId(null);
                    setEditingReelId(null);
                    setEditingCategoryId(null);
                    setEditingMedId(null);
                    setEditingDiagId(null);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-brand-orange text-white shadow-md shadow-brand-orange/20"
                      : "bg-white border border-gray-200 text-gray-600 hover:border-brand-orange/30 hover:bg-orange-50/20"
                  }`}
                >
                  <TabIcon className="h-4 w-4" />
                  {tab.label}
                  {tab.id === "users" && registeredUsers.length > 0 && (
                    <span className="ml-0.5 bg-white/20 text-[9px] font-black px-1.5 py-0.5 rounded-full">
                      {registeredUsers.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Success Toast */}
          {successToast && (
            <div className="fixed bottom-5 right-5 z-50 bg-green-600 text-white font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
              <Check className="h-4 w-4" />
              <span>{successToast}</span>
            </div>
          )}

          {/* Tab Contents */}
          <div className="min-h-[500px]">
            
            {/* TAB: OVERVIEW */}
            {activeTab === "overview" && (
              <div className="space-y-8">
                {/* Statistics Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  <div className="bg-white border border-gray-200 p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide">Enterprise Revenue</span>
                      <div className="text-lg sm:text-xl font-black text-brand-dark">₹{mounted ? totalRev.toLocaleString() : "..."}</div>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                      <DollarSign className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide">Dynamic Banners</span>
                      <div className="text-lg sm:text-xl font-black text-brand-dark">{banners.length} Promo Cards</div>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                      <Image className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide">Active Reels</span>
                      <div className="text-lg sm:text-xl font-black text-brand-dark">{testimonials.length} Videos</div>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center shrink-0">
                      <Film className="h-4.5 w-4.5" />
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 p-4 sm:p-5 rounded-2xl shadow-sm flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide">CDSCO Supply Integrity</span>
                      <div className="text-lg sm:text-xl font-black text-green-600">99.98%</div>
                    </div>
                    <div className="h-9 w-9 rounded-xl bg-green-50 text-green-600 flex items-center justify-center shrink-0">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </div>
                  </div>
                </div>

                {/* Mesh Nodes & Alerts */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Gross Revenue Graphic Chart */}
                  <div className="lg:col-span-7 space-y-6">
                    <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                          <TrendingUp className="h-4.5 w-4.5 text-brand-orange" />
                          Gross revenue analytics
                        </h3>
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 border border-gray-100 px-2 py-0.5 rounded">
                          Monthly performance
                        </span>
                      </div>
                      
                      <div className="h-48 relative flex items-end">
                        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                          <defs>
                            <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#FF6B00" stopOpacity="0.25" />
                              <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path d="M 0,90 Q 20,70 40,80 T 80,40 T 100,20 L 100,100 L 0,100 Z" fill="url(#chartGrad)" />
                          <path d="M 0,90 Q 20,70 40,80 T 80,40 T 100,20" fill="none" stroke="#FF6B00" strokeWidth="2" />
                        </svg>
                        <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2 text-[8px] font-bold text-gray-400 uppercase tracking-wider">
                          <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span>
                        </div>
                      </div>
                    </div>

                    {/* Mesh monitoring */}
                    <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm space-y-4">
                      <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center gap-1.5">
                        <Network className="h-4.5 w-4.5 text-brand-orange" />
                        Delivery Network Nodes mesh
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {deliveryNodes.map((node, i) => (
                          <div key={i} className="p-3 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                            <div className="space-y-0.5">
                              <h4 className="text-[11px] font-bold text-gray-700">{node.name}</h4>
                              <p className="text-[8.5px] text-gray-400">GPS: {node.coordinate}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide ${
                              node.status === "Active" || node.status === "Idle"
                                ? "bg-green-50 text-green-600"
                                : "bg-brand-orange/10 text-brand-orange"
                            }`}>
                              {node.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Alarm Center */}
                  <div className="lg:col-span-5 bg-white border border-gray-200 p-5 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-red-500" />
                    <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center gap-1.5">
                      <AlertTriangle className="h-4.5 w-4.5 text-red-500 animate-pulse" />
                      Security & CDSCO Monitoring
                    </h3>
                    <div className="space-y-4">
                      {fraudLogs.map((log) => (
                        <div key={log.id} className="p-4 rounded-xl border border-red-200 bg-red-50/20 space-y-2">
                          <span className="float-right px-2 py-0.5 bg-red-100 text-red-700 text-[8px] font-extrabold uppercase tracking-wider rounded">
                            {log.severity}
                          </span>
                          <h4 className="text-xs font-bold text-red-700">{log.type}</h4>
                          <p className="text-[8.5px] text-gray-400">{log.time} &middot; {log.location}</p>
                          <p className="text-[10px] font-medium text-gray-600 leading-relaxed">{log.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB: REGISTERED USERS */}
            {activeTab === "users" && (
              <div className="space-y-6">
                
                {/* Stats row */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Total Users", value: registeredUsers.length, color: "text-brand-dark", bg: "bg-brand-orange/10", icon: Users },
                    { label: "Google Sign-ins", value: registeredUsers.filter(u => isGoogleUser(u.avatar)).length, color: "text-blue-600", bg: "bg-blue-50", icon: Globe },
                    { label: "Email / Password", value: registeredUsers.filter(u => !isGoogleUser(u.avatar)).length, color: "text-purple-600", bg: "bg-purple-50", icon: KeyRound },
                    { label: "Admins & Staff", value: registeredUsers.filter(u => u.role !== "customer").length, color: "text-emerald-600", bg: "bg-emerald-50", icon: UserCheck },
                  ].map((stat, i) => {
                    const StatIcon = stat.icon;
                    return (
                      <div key={i} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                        <div className={`h-10 w-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                          <StatIcon className={`h-5 w-5 ${stat.color}`} />
                        </div>
                        <div>
                          <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
                          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">{stat.label}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Search & Filter bar */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Search by name or email..."
                      value={userSearch}
                      onChange={e => setUserSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-xs border border-gray-200 rounded-xl bg-white focus:outline-none focus:border-brand-orange shadow-sm"
                    />
                    <UserCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  </div>
                  <div className="flex gap-2 shrink-0">
                    {["all", "customer", "doctor", "pharmacist", "admin"].map(role => (
                      <button
                        key={role}
                        onClick={() => setUserRoleFilter(role)}
                        className={`px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                          userRoleFilter === role
                            ? "bg-brand-orange text-white shadow-md"
                            : "bg-white border border-gray-200 text-gray-500 hover:border-brand-orange/30"
                        }`}
                      >
                        {role === "all" ? "All Roles" : role}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => {
                      setUsersLoading(true);
                      fetch("/api/users").then(r => r.json()).then(d => { if (d.users) setRegisteredUsers(d.users); }).catch(console.error).finally(() => setUsersLoading(false));
                    }}
                    className="px-4 py-2.5 bg-white border border-gray-200 hover:border-brand-orange/40 text-gray-600 text-xs font-bold rounded-xl cursor-pointer flex items-center gap-1.5 transition-all"
                  >
                    <Activity className="h-3.5 w-3.5 text-brand-orange" />
                    Refresh
                  </button>
                </div>

                {/* User Cards Grid */}
                {usersLoading ? (
                  <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <div className="h-10 w-10 rounded-full border-4 border-brand-orange border-t-transparent animate-spin" />
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Loading users from database...</p>
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-16 bg-gray-50 rounded-2xl border border-gray-100">
                    <UserCircle2 className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                    <p className="text-sm font-bold text-gray-400">No users found</p>
                    <p className="text-xs text-gray-400 mt-1">Try adjusting your search or role filter.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                    {filteredUsers.map(u => {
                      const googleLogin = isGoogleUser(u.avatar);
                      const initials = u.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
                      const roleColors: Record<string, string> = {
                        admin: "bg-red-50 text-red-600 border-red-200",
                        doctor: "bg-blue-50 text-blue-600 border-blue-200",
                        pharmacist: "bg-emerald-50 text-emerald-700 border-emerald-200",
                        customer: "bg-gray-100 text-gray-600 border-gray-200"
                      };
                      const roleColor = roleColors[u.role] || roleColors.customer;
                      const joinDate = new Date(u.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

                      return (
                        <div
                          key={u.id}
                          className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-brand-orange/20 transition-all group relative overflow-hidden"
                        >
                          {/* Subtle corner gradient */}
                          <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-5 ${
                            u.role === "admin" ? "bg-red-500" : u.role === "doctor" ? "bg-blue-500" : u.role === "pharmacist" ? "bg-emerald-500" : "bg-brand-orange"
                          }`} />

                          {/* Top: Avatar + Name */}
                          <div className="flex items-start gap-3.5">
                            <div className="relative shrink-0">
                              {u.avatar ? (
                                <img
                                  src={u.avatar}
                                  alt={u.name}
                                  className="h-14 w-14 rounded-2xl object-cover border-2 border-white shadow-md"
                                  onError={e => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                    (e.target as HTMLImageElement).nextElementSibling?.classList.remove("hidden");
                                  }}
                                />
                              ) : null}
                              <div className={`h-14 w-14 rounded-2xl bg-gradient-to-br from-brand-orange to-amber-400 flex items-center justify-center text-white font-black text-lg shadow-md ${u.avatar ? "hidden" : ""}`}>
                                {initials}
                              </div>
                              {/* Online indicator dot */}
                              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-400 border-2 border-white shadow" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-black text-gray-900 truncate">{u.name}</h3>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <Mail className="h-3 w-3 text-gray-400 shrink-0" />
                                <span className="text-[10px] text-gray-500 font-medium truncate">{u.email}</span>
                              </div>
                              <div className="flex items-center gap-2 mt-2 flex-wrap">
                                <span className={`text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleColor}`}>
                                  {u.role === "admin" ? "Super Admin" : u.role}
                                </span>
                                {/* Login Method Badge */}
                                {googleLogin ? (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-blue-50 text-blue-600 border border-blue-200 px-2 py-0.5 rounded-full">
                                    <Globe className="h-2.5 w-2.5" />
                                    Google Login
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[9px] font-bold bg-purple-50 text-purple-600 border border-purple-200 px-2 py-0.5 rounded-full">
                                    <KeyRound className="h-2.5 w-2.5" />
                                    Email / Password
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Divider */}
                          <div className="border-t border-gray-100 mt-4 pt-3 flex items-center justify-between">
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                              <Clock className="h-3 w-3" />
                              <span>Joined {joinDate}</span>
                            </div>
                            {/* Order count for this user */}
                            <div className="flex items-center gap-1.5 text-[10px] font-bold text-brand-orange bg-brand-orange/8 border border-brand-orange/20 px-2 py-0.5 rounded-full">
                              <ShieldCheck className="h-3 w-3" />
                              {orders.filter(o => o.userEmail === u.email).length} orders
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB: BANNERS */}

            {activeTab === "banners" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Homepage Hero Carousel Banners</h3>
                  <button 
                    onClick={() => {
                      setNewBannerMode(true);
                      setBannerForm({});
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Banner
                  </button>
                </div>

                {/* New Banner Form */}
                {newBannerMode && (
                  <div className="bg-orange-50/30 border border-brand-orange/20 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-black text-brand-orange uppercase">New Banner Details</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Promo Badge Text</label>
                        <input 
                          type="text" 
                          placeholder="e.g. FLASH SALE 50%" 
                          className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white" 
                          onChange={(e) => setBannerForm({...bannerForm, badge: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Main Title Heading</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Flat 50% Off Medicines" 
                          className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white" 
                          onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Description Subtitle</label>
                        <input 
                          type="text" 
                          placeholder="Brief subtitle explanation" 
                          className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white" 
                          onChange={(e) => setBannerForm({...bannerForm, desc: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">CTA Code / Note</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Use Code: EXTRA50" 
                          className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white" 
                          onChange={(e) => setBannerForm({...bannerForm, cta: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Button Caption</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Shop Now" 
                          className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white" 
                          onChange={(e) => setBannerForm({...bannerForm, btnText: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Image URL (Unsplash or Local)</label>
                        <input 
                          type="text" 
                          placeholder="https://..." 
                          className="w-full text-xs border border-gray-200 rounded-lg p-2 bg-white" 
                          onChange={(e) => setBannerForm({...bannerForm, img: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button 
                        onClick={() => setNewBannerMode(false)}
                        className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button 
                        onClick={handleAddBanner}
                        className="px-4 py-2 bg-brand-orange text-white text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Save & Add Banner
                      </button>
                    </div>
                  </div>
                )}

                {/* Banner list */}
                <div className="grid grid-cols-1 gap-5">
                  {banners.map((banner) => {
                    const isEditing = editingBannerId === banner.id;
                    return (
                      <div key={banner.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col lg:flex-row gap-5 items-start">
                        {/* Live Banner Preview (Left) */}
                        <div className="relative w-full lg:w-[320px] h-[160px] bg-gray-900 rounded-xl overflow-hidden shrink-0 flex flex-col justify-between p-4">
                          <img 
                            src={isEditing ? (bannerForm.img || banner.img) : banner.img} 
                            alt="preview" 
                            className="absolute inset-0 w-full h-full object-cover opacity-40" 
                          />
                          <div className="relative z-10">
                            <span className="text-[7.5px] font-bold text-brand-orange bg-brand-orange/10 px-2 py-0.5 rounded border border-brand-orange/20 uppercase tracking-widest">
                              {isEditing ? (bannerForm.badge || banner.badge) : banner.badge}
                            </span>
                            <h5 className="text-white font-black text-sm mt-1.5 leading-tight">
                              {isEditing ? (bannerForm.title || banner.title) : banner.title}
                            </h5>
                          </div>
                          <div className="relative z-10 flex justify-between items-center pt-2 border-t border-white/5">
                            <span className="text-[8px] text-brand-orange font-bold">
                              {isEditing ? (bannerForm.cta || banner.cta) : banner.cta}
                            </span>
                            <span className="text-[7.5px] px-2 py-1 bg-brand-orange text-white rounded-full font-bold">
                              {isEditing ? (bannerForm.btnText || banner.btnText) : banner.btnText}
                            </span>
                          </div>
                        </div>

                        {/* Banner Fields Form (Right) */}
                        <div className="flex-grow w-full space-y-4">
                          {isEditing ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div className="space-y-0.5">
                                <label className="text-[8px] text-gray-400 uppercase font-black">Badge</label>
                                <input 
                                  type="text" 
                                  value={bannerForm.badge || ""} 
                                  className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50"
                                  onChange={(e) => setBannerForm({...bannerForm, badge: e.target.value})}
                                />
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-[8px] text-gray-400 uppercase font-black">Title</label>
                                <input 
                                  type="text" 
                                  value={bannerForm.title || ""} 
                                  className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50"
                                  onChange={(e) => setBannerForm({...bannerForm, title: e.target.value})}
                                />
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-[8px] text-gray-400 uppercase font-black">Description</label>
                                <input 
                                  type="text" 
                                  value={bannerForm.desc || ""} 
                                  className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50"
                                  onChange={(e) => setBannerForm({...bannerForm, desc: e.target.value})}
                                />
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-[8px] text-gray-400 uppercase font-black">CTA</label>
                                <input 
                                  type="text" 
                                  value={bannerForm.cta || ""} 
                                  className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50"
                                  onChange={(e) => setBannerForm({...bannerForm, cta: e.target.value})}
                                />
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-[8px] text-gray-400 uppercase font-black">Image Link</label>
                                <input 
                                  type="text" 
                                  value={bannerForm.img || ""} 
                                  className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50"
                                  onChange={(e) => setBannerForm({...bannerForm, img: e.target.value})}
                                />
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-[8px] text-gray-400 uppercase font-black">Button Text</label>
                                <input 
                                  type="text" 
                                  value={bannerForm.btnText || ""} 
                                  className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50"
                                  onChange={(e) => setBannerForm({...bannerForm, btnText: e.target.value})}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-1">
                              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{banner.badge}</p>
                              <h4 className="text-base font-black text-gray-800">{banner.title}</h4>
                              <p className="text-xs text-gray-500 font-medium leading-relaxed">{banner.desc}</p>
                              <div className="flex gap-4 text-[10px] font-bold text-gray-400 pt-1">
                                <span>CTA: <strong className="text-brand-orange">{banner.cta}</strong></span>
                                <span>Link: <strong className="text-gray-600">{banner.link}</strong></span>
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 justify-end pt-2 border-t border-gray-100">
                            {isEditing ? (
                              <>
                                <button 
                                  onClick={() => setEditingBannerId(null)}
                                  className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-gray-600 text-[10px] font-bold rounded-lg cursor-pointer"
                                >
                                  <X className="h-3 w-3" /> Cancel
                                </button>
                                <button 
                                  onClick={() => handleSaveBanner(banner.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white text-[10px] font-bold rounded-lg cursor-pointer"
                                >
                                  <Save className="h-3 w-3" /> Save Changes
                                </button>
                              </>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleDeleteBanner(banner.id)}
                                  className="flex items-center gap-1 px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 text-[10px] font-bold rounded-lg cursor-pointer"
                                >
                                  <Trash2 className="h-3 w-3" /> Delete
                                </button>
                                <button 
                                  onClick={() => {
                                    setEditingBannerId(banner.id);
                                    setBannerForm(banner);
                                  }}
                                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 text-[10px] font-bold rounded-lg cursor-pointer"
                                >
                                  <Edit2 className="h-3 w-3" /> Edit Fields
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: REELS */}
            {activeTab === "reels" && (
              <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Testimonials Video Reels</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {testimonials.map((reel) => {
                    const isEditing = editingReelId === reel.id;
                    return (
                      <div key={reel.id} className="bg-white border border-gray-200 rounded-3xl p-5 flex flex-col justify-between space-y-4">
                        {/* Live Reel Preview */}
                        <div 
                          className="relative rounded-2xl overflow-hidden w-full aspect-[9/13] shadow-md flex flex-col justify-between p-4 group"
                        >
                          <img 
                            src={isEditing ? (reelForm.thumbnail || reel.thumbnail) : reel.thumbnail} 
                            alt={reel.title} 
                            className="absolute inset-0 w-full h-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/5 to-black/75" />
                          <div className="relative z-10 flex items-center gap-1.5">
                            <div className="h-5 w-5 bg-brand-orange rounded-full flex items-center justify-center text-white text-[8px] font-bold">A</div>
                            <span className="text-[8px] text-white font-bold">{isEditing ? (reelForm.channel || reel.channel) : reel.channel}</span>
                          </div>
                          
                          <div className="relative z-10 space-y-2 mt-auto">
                            <div className="bg-black/60 px-2 py-1 rounded inline-block text-[9px] font-black text-white">
                              {isEditing ? (reelForm.bottomCaption || reel.bottomCaption) : reel.bottomCaption}
                            </div>
                            <p className="text-[10px] text-white/90 font-medium leading-snug line-clamp-2">
                              {isEditing ? (reelForm.caption || reel.caption) : reel.caption}
                            </p>
                          </div>
                        </div>

                        {/* Editable Form */}
                        {isEditing ? (
                          <div className="space-y-2.5 pt-2">
                            <div className="space-y-0.5">
                              <label className="text-[8px] text-gray-400 uppercase font-black text-left block">Video Title</label>
                              <input 
                                type="text" 
                                value={reelForm.title || ""} 
                                className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50"
                                onChange={(e) => setReelForm({...reelForm, title: e.target.value})}
                              />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[8px] text-gray-400 uppercase font-black text-left block">Subtitle Caption</label>
                              <input 
                                type="text" 
                                value={reelForm.bottomCaption || ""} 
                                className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50"
                                onChange={(e) => setReelForm({...reelForm, bottomCaption: e.target.value})}
                              />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[8px] text-gray-400 uppercase font-black text-left block">Long Quote</label>
                              <input 
                                type="text" 
                                value={reelForm.caption || ""} 
                                className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50"
                                onChange={(e) => setReelForm({...reelForm, caption: e.target.value})}
                              />
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[8px] text-gray-400 uppercase font-black text-left block">Thumbnail / Photo path</label>
                              <input 
                                type="text" 
                                value={reelForm.thumbnail || ""} 
                                className="w-full text-xs p-1.5 border border-gray-200 rounded-lg bg-gray-50"
                                onChange={(e) => setReelForm({...reelForm, thumbnail: e.target.value})}
                              />
                            </div>
                            <div className="flex gap-1.5 justify-end pt-1">
                              <button 
                                onClick={() => setEditingReelId(null)}
                                className="px-2.5 py-1 text-[9px] border border-gray-200 rounded-lg cursor-pointer"
                              >
                                Cancel
                              </button>
                              <button 
                                onClick={() => handleSaveReel(reel.id)}
                                className="px-2.5 py-1 text-[9px] bg-green-600 text-white rounded-lg cursor-pointer"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="pt-1">
                            <h5 className="text-xs font-bold text-gray-700 line-clamp-1">{reel.title}</h5>
                            <p className="text-[10px] text-gray-400 leading-relaxed font-medium mt-1">Image path: {reel.thumbnail}</p>
                            <button 
                              onClick={() => {
                                setEditingReelId(reel.id);
                                setReelForm(reel);
                              }}
                              className="mt-3 w-full py-1.5 bg-gray-50 border border-gray-200 hover:border-brand-orange/30 text-gray-700 text-[10px] font-bold rounded-xl cursor-pointer flex items-center justify-center gap-1"
                            >
                              <Edit2 className="h-3 w-3" /> Change Photo & Text
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: CATEGORIES */}
            {activeTab === "categories" && (
              <div className="space-y-6">
                <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Health Concerns Categories Grid</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
                  {categories.map((cat) => {
                    const isEditing = editingCategoryId === cat.id;
                    return (
                      <div key={cat.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col items-center justify-between text-center gap-3">
                        <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 border flex items-center justify-center">
                          <img src={isEditing ? (categoryForm.img || cat.img) : cat.img} alt={cat.name} className="w-full h-full object-cover" />
                        </div>
                        
                        {isEditing ? (
                          <div className="space-y-2 w-full">
                            <input 
                              type="text" 
                              value={categoryForm.name || ""} 
                              className="w-full text-[10px] p-1 border rounded text-center"
                              onChange={(e) => setCategoryForm({...categoryForm, name: e.target.value})}
                            />
                            <input 
                              type="text" 
                              value={categoryForm.img || ""} 
                              placeholder="Image URL"
                              className="w-full text-[8px] p-1 border rounded text-center"
                              onChange={(e) => setCategoryForm({...categoryForm, img: e.target.value})}
                            />
                            <div className="flex gap-1 justify-center">
                              <button onClick={() => setEditingCategoryId(null)} className="p-1 border rounded text-[8px]">Cancel</button>
                              <button onClick={() => handleSaveCategory(cat.id)} className="p-1 bg-green-600 text-white rounded text-[8px]">Save</button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="text-xs font-bold text-gray-800 block leading-tight">{cat.name}</span>
                            <button 
                              onClick={() => {
                                setEditingCategoryId(cat.id);
                                setCategoryForm(cat);
                              }}
                              className="text-[9px] font-bold text-brand-orange hover:underline cursor-pointer"
                            >
                              Edit Info
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB: MEDICINES */}
            {activeTab === "medicines" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Trending Medicines Catalog</h3>
                  <button 
                    onClick={() => {
                      setNewMedMode(true);
                      setMedForm({ category: "OTC", requiresPrescription: false });
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-brand-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Medicine
                  </button>
                </div>

                {/* Add Medicine Form */}
                {newMedMode && (
                  <div className="bg-orange-50/20 border border-brand-orange/20 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-black text-brand-orange uppercase">New Medicine Specification</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Medicine Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Paracetamol 650mg" 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setMedForm({...medForm, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Brand Tagline</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Dolo-650 Premium Grade" 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setMedForm({...medForm, tagline: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Manufacturer</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Cipla Ltd." 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setMedForm({...medForm, manufacturer: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Price (₹)</label>
                        <input 
                          type="number" 
                          placeholder="30" 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setMedForm({...medForm, price: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Original Price (₹)</label>
                        <input 
                          type="number" 
                          placeholder="42" 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setMedForm({...medForm, originalPrice: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Stock Count</label>
                        <input 
                          type="number" 
                          placeholder="250" 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setMedForm({...medForm, inStock: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Dosage Instruction</label>
                        <input 
                          type="text" 
                          placeholder="e.g. 1-0-1 after food" 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setMedForm({...medForm, dosage: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Custom Image URL</label>
                        <input 
                          type="text" 
                          placeholder="https://..." 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setMedForm({...medForm, image: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1 flex flex-col justify-end">
                        <div className="flex items-center gap-4 py-2">
                          <label className="flex items-center gap-1.5 text-xs font-bold text-gray-700 cursor-pointer">
                            <input 
                              type="checkbox" 
                              className="rounded border-gray-300"
                              onChange={(e) => setMedForm({...medForm, requiresPrescription: e.target.checked})}
                            />
                            Requires Rx Prescription
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setNewMedMode(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                      <button onClick={handleAddMed} className="px-4 py-2 bg-brand-orange text-white rounded-xl text-xs font-bold">Add Medicine</button>
                    </div>
                  </div>
                )}

                {/* Catalog Listing */}
                <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-400 uppercase tracking-widest font-black text-[9px]">
                        <th className="p-3">Medicine</th>
                        <th className="p-3">Type</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">In Stock</th>
                        <th className="p-3">Dosage / Manufacturer</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {medicines.map((med) => {
                        const isEditing = editingMedId === med.id;
                        return (
                          <tr key={med.id} className="hover:bg-gray-50/50">
                            <td className="p-3">
                              {isEditing ? (
                                <div className="space-y-1">
                                  <input 
                                    type="text" 
                                    value={medForm.name || ""} 
                                    className="border rounded p-1 text-xs w-full"
                                    onChange={(e) => setMedForm({...medForm, name: e.target.value})}
                                  />
                                  <input 
                                    type="text" 
                                    value={medForm.tagline || ""} 
                                    className="border rounded p-1 text-[10px] w-full text-gray-400"
                                    onChange={(e) => setMedForm({...medForm, tagline: e.target.value})}
                                  />
                                  <input 
                                    type="text" 
                                    value={medForm.image || ""} 
                                    placeholder="Image URL" 
                                    className="border rounded p-1 text-[9px] w-full text-gray-400"
                                    onChange={(e) => setMedForm({...medForm, image: e.target.value})}
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 bg-gray-100 rounded-lg overflow-hidden shrink-0 border border-gray-200">
                                    <img src={med.image || "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=100"} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  <div>
                                    <p className="font-extrabold text-gray-900">{med.name}</p>
                                    <p className="text-[10px] text-gray-400 font-medium leading-none mt-0.5">{med.tagline}</p>
                                  </div>
                                </div>
                              )}
                            </td>
                            <td className="p-3">
                              {isEditing ? (
                                <div className="space-y-1">
                                  <select 
                                    value={medForm.category || "OTC"} 
                                    className="border rounded p-1 text-xs w-full"
                                    onChange={(e) => setMedForm({...medForm, category: e.target.value as any})}
                                  >
                                    <option value="OTC">OTC</option>
                                    <option value="Prescription">Prescription</option>
                                    <option value="Critical">Critical</option>
                                  </select>
                                  <label className="flex items-center gap-1 text-[10px]">
                                    <input 
                                      type="checkbox" 
                                      checked={!!medForm.requiresPrescription} 
                                      onChange={(e) => setMedForm({...medForm, requiresPrescription: e.target.checked})}
                                    />
                                    Rx Required
                                  </label>
                                </div>
                              ) : (
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${
                                  med.requiresPrescription ? "bg-brand-orange/10 text-brand-orange" : "bg-green-50 text-green-600"
                                }`}>
                                  {med.requiresPrescription ? "Rx Required" : "OTC"}
                                </span>
                              )}
                            </td>
                            <td className="p-3">
                              {isEditing ? (
                                <div className="space-y-1 w-20">
                                  <input 
                                    type="number" 
                                    value={medForm.price || 0} 
                                    className="border rounded p-1 text-xs w-full"
                                    onChange={(e) => setMedForm({...medForm, price: Number(e.target.value)})}
                                  />
                                  <input 
                                    type="number" 
                                    value={medForm.originalPrice || 0} 
                                    placeholder="Original"
                                    className="border rounded p-1 text-[10px] w-full text-gray-400"
                                    onChange={(e) => setMedForm({...medForm, originalPrice: Number(e.target.value)})}
                                  />
                                </div>
                              ) : (
                                <div className="font-extrabold text-gray-900">
                                  ₹{med.price}
                                  {med.originalPrice && <span className="text-[10px] text-gray-400 font-semibold line-through ml-1.5">₹{med.originalPrice}</span>}
                                </div>
                              )}
                            </td>
                            <td className="p-3">
                              {isEditing ? (
                                <input 
                                  type="number" 
                                  value={medForm.inStock || 0} 
                                  className="border rounded p-1 text-xs w-20"
                                  onChange={(e) => setMedForm({...medForm, inStock: Number(e.target.value)})}
                                />
                              ) : (
                                <span className={`font-bold ${med.inStock < 50 ? "text-red-500" : "text-gray-700"}`}>{med.inStock} units</span>
                              )}
                            </td>
                            <td className="p-3">
                              {isEditing ? (
                                <div className="space-y-1">
                                  <input 
                                    type="text" 
                                    value={medForm.dosage || ""} 
                                    className="border rounded p-1 text-xs w-full"
                                    onChange={(e) => setMedForm({...medForm, dosage: e.target.value})}
                                  />
                                  <input 
                                    type="text" 
                                    value={medForm.manufacturer || ""} 
                                    className="border rounded p-1 text-xs w-full"
                                    onChange={(e) => setMedForm({...medForm, manufacturer: e.target.value})}
                                  />
                                </div>
                              ) : (
                                <div>
                                  <p className="font-semibold text-gray-800">{med.dosage}</p>
                                  <p className="text-[10px] text-gray-400 font-medium">{med.manufacturer}</p>
                                </div>
                              )}
                            </td>
                            <td className="p-3 text-right">
                              <div className="flex gap-1 justify-end">
                                {isEditing ? (
                                  <>
                                    <button 
                                      onClick={() => setEditingMedId(null)}
                                      className="p-1 border border-gray-200 text-gray-500 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                      Cancel
                                    </button>
                                    <button 
                                      onClick={() => handleSaveMed(med.id)}
                                      className="p-1 bg-green-600 text-white rounded hover:bg-green-700 cursor-pointer"
                                    >
                                      Save
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button 
                                      onClick={() => {
                                        setEditingMedId(med.id);
                                        setMedForm(med);
                                      }}
                                      className="p-1 border border-gray-200 text-gray-700 rounded hover:bg-gray-50 cursor-pointer"
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      onClick={() => handleDeleteMed(med.id)}
                                      className="p-1 border border-red-200 text-red-600 rounded hover:bg-red-50 cursor-pointer"
                                    >
                                      Delete
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: DIAGNOSTICS */}
            {activeTab === "diagnostics" && (
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black text-gray-800 uppercase tracking-wider">Featured Diagnostic Lab Packages</h3>
                  <button 
                    onClick={() => {
                      setNewDiagMode(true);
                      setDiagForm({ tests: [] });
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 bg-brand-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-lg cursor-pointer"
                  >
                    <Plus className="h-3.5 w-3.5" /> Add Package
                  </button>
                </div>

                {/* Add Diagnostics Form */}
                {newDiagMode && (
                  <div className="bg-orange-50/20 border border-brand-orange/20 p-5 rounded-2xl space-y-4">
                    <h4 className="text-xs font-black text-brand-orange uppercase">New Lab Package Specification</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Package Name</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Smart Full Body Health Check" 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setDiagForm({...diagForm, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Pricing (₹)</label>
                        <input 
                          type="number" 
                          placeholder="1499" 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setDiagForm({...diagForm, price: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Original Price (₹)</label>
                        <input 
                          type="number" 
                          placeholder="2999" 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setDiagForm({...diagForm, originalPrice: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Lab Tests Count Included</label>
                        <input 
                          type="number" 
                          placeholder="82" 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setDiagForm({...diagForm, testsCount: Number(e.target.value)})}
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Tests List (comma separated)</label>
                        <input 
                          type="text" 
                          placeholder="Thyroid Profile, Kidney Function Test, CBC..." 
                          className="w-full text-xs border rounded-lg p-2 bg-white" 
                          onChange={(e) => setDiagForm({...diagForm, tests: e.target.value.split(",").map(t => t.trim())})}
                        />
                      </div>
                      <div className="space-y-1 sm:col-span-2">
                        <label className="text-[9px] font-black text-gray-400 uppercase">Description</label>
                        <textarea 
                          placeholder="Provide details about the diagnostic checkup..." 
                          rows={2}
                          className="w-full text-xs border rounded-lg p-2 bg-white outline-none resize-none" 
                          onChange={(e) => setDiagForm({...diagForm, description: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button onClick={() => setNewDiagMode(false)} className="px-4 py-2 border rounded-xl text-xs font-bold">Cancel</button>
                      <button onClick={handleAddDiag} className="px-4 py-2 bg-brand-orange text-white rounded-xl text-xs font-bold">Add Lab Package</button>
                    </div>
                  </div>
                )}

                {/* Diagnostics List cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {diagnostics.map((diag) => {
                    const isEditing = editingDiagId === diag.id;
                    return (
                      <div key={diag.id} className="bg-white border border-gray-200 rounded-2xl p-5 flex flex-col justify-between space-y-4">
                        {isEditing ? (
                          <div className="space-y-3">
                            <div className="space-y-0.5">
                              <label className="text-[8px] font-black text-gray-400 uppercase">Package Name</label>
                              <input 
                                type="text" 
                                value={diagForm.name || ""} 
                                className="w-full text-xs border p-2 rounded-lg"
                                onChange={(e) => setDiagForm({...diagForm, name: e.target.value})}
                              />
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div className="space-y-0.5">
                                <label className="text-[8px] font-black text-gray-400 uppercase">Price</label>
                                <input 
                                  type="number" 
                                  value={diagForm.price || 0} 
                                  className="w-full text-xs border p-2 rounded-lg"
                                  onChange={(e) => setDiagForm({...diagForm, price: Number(e.target.value)})}
                                />
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-[8px] font-black text-gray-400 uppercase">Original</label>
                                <input 
                                  type="number" 
                                  value={diagForm.originalPrice || 0} 
                                  className="w-full text-xs border p-2 rounded-lg"
                                  onChange={(e) => setDiagForm({...diagForm, originalPrice: Number(e.target.value)})}
                                />
                              </div>
                              <div className="space-y-0.5">
                                <label className="text-[8px] font-black text-gray-400 uppercase">Tests Count</label>
                                <input 
                                  type="number" 
                                  value={diagForm.testsCount || 0} 
                                  className="w-full text-xs border p-2 rounded-lg"
                                  onChange={(e) => setDiagForm({...diagForm, testsCount: Number(e.target.value)})}
                                />
                              </div>
                            </div>
                            <div className="space-y-0.5">
                              <label className="text-[8px] font-black text-gray-400 uppercase">Description</label>
                              <textarea 
                                value={diagForm.description || ""} 
                                className="w-full text-xs border p-2 rounded-lg outline-none resize-none"
                                rows={2}
                                onChange={(e) => setDiagForm({...diagForm, description: e.target.value})}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <span className="float-right px-2 py-0.5 bg-green-50 text-green-600 text-[8px] font-black uppercase rounded-full">
                              {diag.testsCount} Lab Tests
                            </span>
                            <h4 className="text-sm font-extrabold text-gray-900 leading-tight">{diag.name}</h4>
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed">{diag.description}</p>
                            <div className="text-lg font-black text-gray-900 pt-1">
                              ₹{diag.price}
                              <span className="text-xs text-gray-400 font-semibold line-through ml-2">₹{diag.originalPrice}</span>
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 justify-end pt-2 border-t border-gray-100">
                          {isEditing ? (
                            <>
                              <button onClick={() => setEditingDiagId(null)} className="px-3 py-1.5 border rounded-lg text-[10px] font-bold">Cancel</button>
                              <button onClick={() => handleSaveDiag(diag.id)} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-[10px] font-bold">Save</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => handleDeleteDiag(diag.id)} className="px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-[10px] font-bold">Delete</button>
                              <button 
                                onClick={() => {
                                  setEditingDiagId(diag.id);
                                  setDiagForm(diag);
                                }} 
                                className="px-3 py-1.5 bg-gray-50 border rounded-lg text-[10px] font-bold"
                              >
                                Edit
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

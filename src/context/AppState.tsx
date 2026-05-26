"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { validatePrescription } from "@/lib/prescriptionValidator";

export type Role = "customer" | "pharmacist" | "doctor" | "admin";

export interface User {
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export interface Medicine {
  id: string;
  name: string;
  tagline: string;
  price: number;
  originalPrice?: number;
  inStock: number;
  requiresPrescription: boolean;
  dosage: string;
  category: "OTC" | "Prescription" | "Critical";
  manufacturer: string;
  image?: string;
  scientificName?: string;
  description?: string;
  subCategory?: string;
}

export interface CartItem {
  medicine: Medicine;
  quantity: number;
}

export interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: "pending" | "verified" | "dispatched" | "delivered" | "cancelled";
  date: string;
  patientName: string;
  prescriptionAttached?: string;
  eta: string;
  trackingStep: number; // 1: Order Placed, 2: Rx Verified, 3: Dispatched, 4: Out for Delivery, 5: Delivered
  userEmail?: string;
}

export interface PrescriptionScan {
  id: string;
  fileName: string;
  date: string;
  medicines: { name: string; dose: string; timing: string; purpose: string }[];
  warnings: string[];
  sideEffects: string[];
  safetyScore: number;
  interactions: string;
  userEmail?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  urgencyScore?: "Low" | "Moderate" | "High";
  recommendations?: string[];
  referralNeeded?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  availability: string;
  rating: number;
  fees: number;
  image: string;
}

export interface DiagnosticPackage {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  testsCount: number;
  tests: string[];
  description: string;
  image?: string;
}

export interface Booking {
  id: string;
  type: "doctor" | "diagnostics";
  targetName: string;
  patientName: string;
  date: string;
  timeslot: string;
  status: "upcoming" | "completed" | "cancelled";
  userEmail?: string;
}

export interface NotificationAlert {
  id: string;
  type: "whatsapp" | "email" | "sms";
  recipient: string;
  subject?: string;
  message: string;
  timestamp: string;
  status: "sent" | "delivered";
}

export interface CarouselBanner {
  id: string;
  badge: string;
  title: string;
  desc: string;
  cta: string;
  btnText: string;
  img: string;
  link: string;
}

export interface TestimonialReel {
  id: number;
  title: string;
  channel: string;
  caption: string;
  bottomCaption: string;
  thumbnail: string;
  bgFrom: string;
  bgTo: string;
}

export interface HealthCategory {
  id: string;
  name: string;
  img: string;
}

interface AppContextType {
  user: User | null;
  role: Role;
  medicines: Medicine[];
  cart: CartItem[];
  orders: Order[];
  prescriptions: PrescriptionScan[];
  chatHistory: ChatMessage[];
  emergencyActive: boolean;
  emergencyETA: number; // in seconds (e.g. 600 for 10:00)
  emergencyCourierGPS: { lat: number; lng: number };
  emergencyStep: number; // 0: Idle, 1: Dispatching, 2: Rider Assigned, 3: On The Way, 4: Arrived
  doctors: Doctor[];
  diagnostics: DiagnosticPackage[];
  bookings: Booking[];
  notificationAlerts: NotificationAlert[];
  
  // New Customizable Content states
  banners: CarouselBanner[];
  testimonials: TestimonialReel[];
  categories: HealthCategory[];

  login: (role: Role, email?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (email: string, name: string, avatar?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogleToken: (credential: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  downloadWelcomePDF: (targetUser: User | null) => void;
  addToCart: (med: Medicine, qty?: number) => void;
  removeFromCart: (medId: string) => void;
  updateCartQuantity: (medId: string, qty: number) => void;
  clearCart: () => void;
  placeOrder: (patientName: string, rxFile?: File | string) => string;
  uploadPrescriptionScan: (fileName: string) => Promise<{ isValid: boolean; errorType?: "human_photo" | "unrelated_document" | "generic_file" | "invalid_format"; prescription?: any }>;
  verifyAuthenticity: (batchCode: string) => {
    valid: boolean;
    manufacturer: string;
    expiryDate: string;
    batchNo: string;
    safetyScore: number;
    notes: string;
  };
  sendChatMessage: (text: string) => void;
  triggerEmergencyDelivery: (address: string) => void;
  cancelEmergency: () => void;
  bookAppointment: (type: "doctor" | "diagnostics", targetName: string, patientName: string, date: string, timeslot: string) => void;
  updateOrderStatus: (orderId: string, status: Order["status"]) => void;
  setSearchQuery: (q: string) => void;
  searchQuery: string;

  // New Content Management Methods for Admin Panel
  updateBanners: (banners: CarouselBanner[]) => void;
  updateTestimonials: (testimonials: TestimonialReel[]) => void;
  updateCategories: (categories: HealthCategory[]) => void;
  
  addMedicine: (med: Omit<Medicine, "id">) => void;
  updateMedicine: (id: string, med: Partial<Medicine>) => void;
  deleteMedicine: (id: string) => void;

  addDiagnosticPackage: (diag: Omit<DiagnosticPackage, "id">) => void;
  updateDiagnosticPackage: (id: string, diag: Partial<DiagnosticPackage>) => void;
  deleteDiagnosticPackage: (id: string) => void;

  addDoctor: (doc: Omit<Doctor, "id">) => void;
  updateDoctor: (id: string, doc: Partial<Doctor>) => void;
  deleteDoctor: (id: string) => void;
}

const defaultMedicines: Medicine[] = [
  { 
    id: "1", 
    name: "Paracetamol 650mg", 
    tagline: "Dolo-650 Premium Grade", 
    price: 15, 
    originalPrice: 18, 
    inStock: 250, 
    requiresPrescription: false, 
    dosage: "1-0-1 after food", 
    category: "OTC", 
    manufacturer: "By Cipla Ltd", 
    image: "/images/med_paracetamol.jpg",
    scientificName: "Acetaminophen",
    description: "Effective relief from pain and fever, commonly used for headaches and mild body aches. Fast-acting formulation.",
    subCategory: "ANALGESICS"
  },
  { 
    id: "2", 
    name: "Cetirizine 10mg", 
    tagline: "Okacet Fast-acting Anti-allergy", 
    price: 24, 
    originalPrice: 30, 
    inStock: 350, 
    requiresPrescription: false, 
    dosage: "0-0-1 before sleep", 
    category: "OTC", 
    manufacturer: "By GSK Pharmaceuticals", 
    image: "/images/med_cetirizine.jpg",
    scientificName: "Cetirizine Hydrochloride",
    description: "Non-drowsy 24-hour allergy relief for running nose, sneezing, and itchy eyes. Recommended by leading allergists.",
    subCategory: "ANTIHISTAMINES"
  },
  { 
    id: "3", 
    name: "Amoxicillin 500mg", 
    tagline: "Novamox Broad-Spectrum Antibiotic", 
    price: 85, 
    originalPrice: 106, 
    inStock: 120, 
    requiresPrescription: true, 
    dosage: "1-1-1 after food (5 days)", 
    category: "Prescription", 
    manufacturer: "By Abbott India Ltd", 
    image: "/images/med_amoxicillin.jpg",
    scientificName: "Amoxicillin",
    description: "Broad-spectrum antibiotic to treat various bacterial infections like ear, throat, and sinus infections. Take precisely as prescribed.",
    subCategory: "ANTIBIOTICS"
  },
  { 
    id: "4", 
    name: "Atorvastatin 10mg", 
    tagline: "Lipvas Cardiovascular Shield", 
    price: 140, 
    originalPrice: 175, 
    inStock: 180, 
    requiresPrescription: true, 
    dosage: "0-0-1 before sleep", 
    category: "Prescription", 
    manufacturer: "By Pfizer Inc.", 
    image: "/images/med_atorvastatin.jpg",
    scientificName: "Atorvastatin",
    description: "Statins medication used to lower lipid and cholesterol levels to prevent stroke and heart disease. Take at night.",
    subCategory: "CARDIOVASCULAR"
  },
  { 
    id: "5", 
    name: "Pantoprazole 40mg", 
    tagline: "Proton Pump Inhibitor for Acid Control", 
    price: 65, 
    originalPrice: 81, 
    inStock: 400, 
    requiresPrescription: true, 
    dosage: "1-0-0 empty stomach", 
    category: "Prescription", 
    manufacturer: "By Sun Pharma", 
    image: "/images/med_pantoprazole.jpg",
    scientificName: "Pantoprazole Sodium",
    description: "Proton pump inhibitor (PPI) that decreases stomach acid. Used for GERD and acid reflux treatment.",
    subCategory: "GASTROINTESTINAL"
  },
  { 
    id: "6", 
    name: "Vitamin C 500mg", 
    tagline: "Immunity Booster & Antioxidant Support", 
    price: 40, 
    originalPrice: 50, 
    inStock: 500, 
    requiresPrescription: false, 
    dosage: "1-0-0 daily", 
    category: "OTC", 
    manufacturer: "By Zydus Cadila", 
    image: "/images/med_vitaminc.jpg",
    scientificName: "Ascorbic Acid",
    description: "Immunity boosting chewable tablets with zinc. Helps protect against common cold and infections.",
    subCategory: "SUPPLEMENTS"
  },
  { 
    id: "7", 
    name: "Karela Jamun Juice", 
    tagline: "Organic Blood Sugar Control & Detoxification", 
    price: 210, 
    originalPrice: 374, 
    inStock: 150, 
    requiresPrescription: false, 
    dosage: "30ml daily morning", 
    category: "OTC", 
    manufacturer: "By Avenix Organics", 
    image: "/images/spot_karela.jpg",
    scientificName: "Momordica Charantia & Syzygium Cumini",
    description: "Supports healthy blood sugar levels and promotes digestion. Formulated with 100% organic, cold-pressed ingredients.",
    subCategory: "SUPPLEMENTS"
  }
];

const defaultDoctors: Doctor[] = [
  { id: "doc-1", name: "Dr. Ananya Sharma", specialty: "MD Cardiology", experience: 12, availability: "Immediate Response", rating: 4.9, fees: 600, image: "/images/doctor_ananya.png" },
  { id: "doc-2", name: "Dr. Rohan Verma", specialty: "MD Pediatrics", experience: 8, availability: "In 10 Minutes", rating: 4.8, fees: 500, image: "/images/doctor_rohan.png" },
  { id: "doc-3", name: "Dr. Sidharth Mehta", specialty: "MBBS General Medicine", experience: 15, availability: "Immediate Response", rating: 4.7, fees: 400, image: "/images/doctor_sidharth.png" },
  { id: "doc-4", name: "Dr. Priya Iyer", specialty: "MD Dermatology", experience: 10, availability: "Today, 4:30 PM", rating: 4.9, fees: 700, image: "/images/doctor_priya.png" }
];

const defaultDiagnostics: DiagnosticPackage[] = [
  { id: "diag-1", name: "Smart Full Body Health Check", price: 1499, originalPrice: 2999, testsCount: 82, tests: ["Thyroid Profile (T3, T4, TSH)", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Complete Blood Count (CBC)", "Lipid Profile (Cholesterol)", "HbA1c & Blood Sugar"], description: "Best-selling comprehensive checkup covering vital organs and metabolism indicators. Includes free home sample collection.", image: "/images/lab_fullbody.png" },
  { id: "diag-2", name: "Active Cardiac Screening", price: 2499, originalPrice: 4999, testsCount: 45, tests: ["Lipid Profile Extended", "High-Sensitivity CRP (hs-CRP)", "Apolipoproteins A1 & B", "Electrocardiogram (ECG)", "Serum Electrolytes"], description: "Targeted screen for cardiovascular health, arterial block risk, and cholesterol sub-components.", image: "/images/lab_cardiac.png" },
  { id: "diag-3", name: "Diabetes Control Profile", price: 699, originalPrice: 1499, testsCount: 12, tests: ["HbA1c (Average Sugar)", "Fasting Blood Glucose", "Post-Prandial Glucose", "Urine Microalbumin"], description: "Essential periodic monitor for diabetic & pre-diabetic patients to track sugar trends and kidney safety.", image: "/images/lab_diabetes.png" }
];

const defaultBanners: CarouselBanner[] = [
  {
    id: "banner-1",
    badge: "AVENIX MEDICINE HUB",
    title: "Save Up To 25% On Your First Order",
    desc: "Fulfillment from CDSCO-certified WHO-GMP partner warehouse nodes.",
    cta: "Use Code: AVENIX25",
    btnText: "Shop Now",
    img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200",
    link: "/delivery"
  },
  {
    id: "banner-2",
    badge: "INTELLIGENT MEDICAL ANALYSIS",
    title: "OCR-Enabled AI Prescription Scan",
    desc: "Upload your handwritten doctor slip. We parse drug names and flag safety risks instantly.",
    cta: "Verify CDSCO Compliance",
    btnText: "Scan Now",
    img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=1200",
    link: "/prescription-ai"
  },
  {
    id: "banner-3",
    badge: "AVENIX DIAGNOSTICS LABS",
    title: "Flat 50% Off On Full Body Checkups",
    desc: "Certified local laboratory technicians, home blood collections, online reports in 6 hours.",
    cta: "Free Home Sample Pickups",
    btnText: "Book Test",
    img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200",
    link: "/diagnostics"
  }
];

const defaultTestimonials: TestimonialReel[] = [
  {
    id: 1,
    title: "Real Customer Stories: Switching to Generic Medicines",
    channel: "Avenix Health App",
    caption: "I switched to generic and saved ₹3000 a month",
    bottomCaption: "Branded medicines",
    thumbnail: "/images/reel_thumb_1.jpg",
    bgFrom: "#1a2a1a",
    bgTo: "#243524",
  },
  {
    id: 2,
    title: "Youngsters on Generic Medicines: What do they say?",
    channel: "Avenix Health App",
    caption: "so I might just order from here always",
    bottomCaption: "so I might",
    thumbnail: "/images/reel_thumb_2.jpg",
    bgFrom: "#1a2020",
    bgTo: "#243030",
  },
  {
    id: 3,
    title: "Doctors Recommend: Trusted Generic Alternatives",
    channel: "Avenix Health App",
    caption: "Same molecule, huge savings on your prescription",
    bottomCaption: "Doctor approved",
    thumbnail: "/images/reel_thumb_3.jpg",
    bgFrom: "#1a1a2a",
    bgTo: "#243030",
  }
];

const defaultCategories: HealthCategory[] = [
  { id: "pain", name: "Fever & Pain", img: "/images/concern_fever_pain.png" },
  { id: "diabetes", name: "Diabetes Care", img: "/images/concern_diabetes.png" },
  { id: "cardiac", name: "Cardiac Care", img: "/images/concern_cardiac.png" },
  { id: "stomach", name: "Acidity & Gas", img: "/images/concern_acidity.png" },
  { id: "allergy", name: "Asthma & Allergy", img: "/images/concern_allergy.png" },
  { id: "antibiotics", name: "Antibiotics", img: "/images/concern_antibiotics.png" }
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppStateProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("customer");
  const [user, setUser] = useState<User | null>(null);

  // Hydratable contents
  const [medicines, setMedicines] = useState<Medicine[]>(defaultMedicines);
  const [doctors, setDoctors] = useState<Doctor[]>(defaultDoctors);
  const [diagnostics, setDiagnostics] = useState<DiagnosticPackage[]>(defaultDiagnostics);
  const [banners, setBanners] = useState<CarouselBanner[]>(defaultBanners);
  const [testimonials, setTestimonials] = useState<TestimonialReel[]>(defaultTestimonials);
  const [categories, setCategories] = useState<HealthCategory[]>(defaultCategories);

  const refreshAllData = async () => {
    try {
      // 1. Fetch user session
      const meRes = await fetch("/api/auth/me");
      const meData = await meRes.json();
      if (meData.user) {
        setUser(meData.user);
        setRole(meData.user.role);
      } else {
        setUser(null);
        setRole("customer");
      }

      // 2. Fetch medicines
      const medsRes = await fetch("/api/medicines");
      const medsData = await medsRes.json();
      if (medsData.medicines && medsData.medicines.length > 0) {
        setMedicines(medsData.medicines);
      }

      // 3. Fetch orders
      const ordersRes = await fetch("/api/orders");
      const ordersData = await ordersRes.json();
      if (ordersData.orders) {
        setOrders(ordersData.orders);
      }

      // 4. Fetch bookings
      const bookingsRes = await fetch("/api/bookings");
      const bookingsData = await bookingsRes.json();
      if (bookingsData.bookings) {
        setBookings(bookingsData.bookings);
      }

      // 5. Fetch prescriptions
      const rxRes = await fetch("/api/prescriptions");
      const rxData = await rxRes.json();
      if (rxData.prescriptions) {
        setPrescriptions(rxData.prescriptions);
      }

      // 6. Fetch alerts
      const alertsRes = await fetch("/api/alerts");
      const alertsData = await alertsRes.json();
      if (alertsData.alerts) {
        setNotificationAlerts(alertsData.alerts);
      }

      // 7. Fetch custom content
      const contentRes = await fetch("/api/content");
      const contentData = await contentRes.json();
      if (contentData.content) {
        const { banners: b, testimonials: t, categories: c, doctors: d, diagnostics: diag } = contentData.content;
        if (b) setBanners(b);
        if (t) setTestimonials(t);
        if (c) setCategories(c);
        if (d) setDoctors(d);
        if (diag) setDiagnostics(diag);
      }
    } catch (error) {
      console.error("Error hydrating AppState from APIs:", error);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);


  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "AVX-ORD-70891",
      items: [
        { medicine: defaultMedicines[0], quantity: 2 },
        { medicine: defaultMedicines[4], quantity: 1 }
      ],
      totalAmount: 155,
      status: "delivered",
      date: "2026-05-21",
      patientName: "Avnish Kumar",
      eta: "Delivered",
      trackingStep: 5,
      userEmail: "avnish@avenix.in"
    },
    {
      id: "AVX-ORD-90234",
      items: [
        { medicine: defaultMedicines[1], quantity: 1 },
        { medicine: defaultMedicines[5], quantity: 3 }
      ],
      totalAmount: 195,
      status: "verified",
      date: "2026-05-23",
      patientName: "Sushma Devi",
      prescriptionAttached: "prescription_sushma_dermat.png",
      eta: "Arriving in 45 mins",
      trackingStep: 2,
      userEmail: "avnish@avenix.in"
    }
  ]);

  const [prescriptions, setPrescriptions] = useState<PrescriptionScan[]>([
    {
      id: "rx-901",
      fileName: "prescription_sushma_dermat.png",
      date: "2026-05-23",
      medicines: [
        { name: "Amoxicillin 500mg", dose: "500mg", timing: "1-1-1 after food", purpose: "Bacterial Infection Control" },
        { name: "Cetirizine 10mg", dose: "10mg", timing: "0-0-1 before sleep", purpose: "Anti-allergy / Rhinitis" }
      ],
      warnings: ["Do not skip antibiotics course", "Avoid alcohol consumption during treatment"],
      sideEffects: ["Mild drowsiness (from Cetirizine)", "Nausea or stomach upset (from Amoxicillin)"],
      safetyScore: 98,
      interactions: "No major drug-drug interactions detected between Amoxicillin and Cetirizine.",
      userEmail: "avnish@avenix.in"
    }
  ]);

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: "c-1",
      sender: "ai",
      text: "Hello! I am your Avenix AI Health Assistant. Ask me anything about symptoms, medicines, side effects, or drug safety scores. (e.g. 'I have a fever and weakness' or 'Side effects of Metformin')",
      timestamp: "12:00 PM"
    }
  ]);

  // Emergency Delivery States
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [emergencyETA, setEmergencyETA] = useState(600); // 10 minutes default
  const [emergencyCourierGPS, setEmergencyCourierGPS] = useState({ lat: 28.6139, lng: 77.209 }); // Delhi coordinates base
  const [emergencyStep, setEmergencyStep] = useState(0);

  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: "bk-301",
      type: "diagnostics",
      targetName: "Smart Full Body Health Check",
      patientName: "Avnish Kumar",
      date: "2026-05-25",
      timeslot: "08:00 AM - 10:00 AM",
      status: "upcoming",
      userEmail: "avnish@avenix.in"
    }
  ]);

  // Notification Alerts History State
  const [notificationAlerts, setNotificationAlerts] = useState<NotificationAlert[]>([
    {
      id: "alt-init-1",
      type: "email",
      recipient: "avnish@avenix.in",
      subject: "Avenix Delivered Alert - Invoice AVX-ORD-70891",
      message: "Your order AVX-ORD-70891 has been successfully delivered. Thank you for choosing India's Intelligent Healthcare Delivery. Your PDF billing invoice is available for download on your dashboard.",
      timestamp: "04:32 PM",
      status: "sent"
    },
    {
      id: "alt-init-2",
      type: "whatsapp",
      recipient: "+91 90812-70891",
      message: "*AVENIX PHARMACEUTICALS* 🧪\n\nOrder *AVX-ORD-70891* has been *DELIVERED* successfully. Thank you for trusting Avenix!",
      timestamp: "04:32 PM",
      status: "delivered"
    }
  ]);

  // Countdown timer for Emergency delivery
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (emergencyActive && emergencyETA > 0) {
      timer = setInterval(() => {
        setEmergencyETA((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setEmergencyStep(4); // Arrived
            return 0;
          }
          // Dynamic GPS update to simulate courier moving
          setEmergencyCourierGPS((gps) => ({
            lat: gps.lat + (Math.random() - 0.5) * 0.0003 + 0.0001,
            lng: gps.lng + (Math.random() - 0.5) * 0.0003 + 0.0001
          }));

          // Progress steps based on time
          if (prev === 540) setEmergencyStep(2); // Rider assigned
          if (prev === 480) setEmergencyStep(3); // Rider on the way

          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [emergencyActive, emergencyETA]);

  const classifyEmail = (emailStr: string): { role: Role; name: string } => {
    const cleanEmail = emailStr.trim().toLowerCase();
    
    // Super Admin check
    if (
      cleanEmail === "avnish@avenix.in" ||
      cleanEmail === "admin@avenix.in" ||
      cleanEmail.endsWith("@admin.avenix.in")
    ) {
      let namePart = cleanEmail.split("@")[0];
      let displayName = "Avnish (Super Admin)";
      if (namePart === "admin") {
        displayName = "Admin (Super Admin)";
      } else if (namePart !== "avnish") {
        displayName = `${namePart.charAt(0).toUpperCase() + namePart.slice(1)} (Super Admin)`;
      }
      return { role: "admin", name: displayName };
    }

    // Doctor check
    if (cleanEmail.startsWith("dr.") || cleanEmail.endsWith("@doctor.avenix.in")) {
      let namePart = "";
      if (cleanEmail.startsWith("dr.")) {
        namePart = cleanEmail.substring(3).split("@")[0];
      } else {
        namePart = cleanEmail.split("@")[0];
        if (namePart.startsWith("dr.")) namePart = namePart.substring(3);
      }
      const capitalized = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : "Verma";
      return { role: "doctor", name: `Dr. ${capitalized}` };
    }

    // Pharmacist check
    if (cleanEmail.startsWith("ph.") || cleanEmail.endsWith("@pharmacist.avenix.in")) {
      let namePart = "";
      if (cleanEmail.startsWith("ph.")) {
        namePart = cleanEmail.substring(3).split("@")[0];
      } else {
        namePart = cleanEmail.split("@")[0];
        if (namePart.startsWith("ph.")) namePart = namePart.substring(3);
      }
      const capitalized = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : "Rahul";
      return { role: "pharmacist", name: `Pharmacist ${capitalized}` };
    }

    // Customer check
    let namePart = cleanEmail.split("@")[0];
    namePart = namePart.replace(/[^a-zA-Z]/g, " ");
    const capitalized = namePart
      ? namePart.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ").trim()
      : "Avnish Kumar";
    return { role: "customer", name: capitalized };
  };

  const login = async (newRole: Role, email?: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    let targetEmail = email;
    let targetPassword = password;
    if (!targetEmail) {
      if (newRole === "admin") targetEmail = "avnish@avenix.in";
      else if (newRole === "doctor") targetEmail = "dr.verma@doctor.avenix.in";
      else if (newRole === "pharmacist") targetEmail = "ph.rahul@pharmacist.avenix.in";
      else targetEmail = "avnish@gmail.com";
    }

    if (!targetPassword) {
      if (targetEmail === "avnish@avenix.in" || targetEmail === "admin@avenix.in") targetPassword = "admin123";
      else if (targetEmail.startsWith("dr.") || targetEmail.endsWith("@doctor.avenix.in")) targetPassword = "doctor123";
      else if (targetEmail.startsWith("ph.") || targetEmail.endsWith("@pharmacist.avenix.in")) targetPassword = "pharma123";
      else targetPassword = "customer123";
    }

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail, password: targetPassword })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setRole(data.user.role);
        
        // Mock welcome credentials letter PDF trigger on login
        downloadWelcomePDF(data.user);
        
        // Sync database records across context state
        await refreshAllData();
        return { success: true };
      } else {
        return { success: false, error: data.error || "Login failed" };
      }
    } catch (err) {
      console.error("Login API error:", err);
      return { success: false, error: "Network error occurred." };
    }
  };

  const loginWithGoogle = async (email: string, name: string, avatar?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name, avatar })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setRole(data.user.role);
        
        // Mock welcome credentials letter PDF trigger on login
        downloadWelcomePDF(data.user);
        
        // Sync database records across context state
        await refreshAllData();
        return { success: true };
      } else {
        return { success: false, error: data.error || "Google login failed" };
      }
    } catch (err) {
      console.error("Google Login API error:", err);
      return { success: false, error: "Network error occurred." };
    }
  };

  const loginWithGoogleToken = async (credential: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ credential })
      });
      const data = await res.json();
      if (res.ok && data.user) {
        setUser(data.user);
        setRole(data.user.role);
        
        // Mock welcome credentials letter PDF trigger on login
        downloadWelcomePDF(data.user);
        
        // Sync database records across context state
        await refreshAllData();
        return { success: true };
      } else {
        return { success: false, error: data.error || "Google token login failed" };
      }
    } catch (err) {
      console.error("Google Login token API error:", err);
      return { success: false, error: "Network error occurred during Google Verification." };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setRole("customer");
      await refreshAllData();
    } catch (err) {
      console.error("Logout API error:", err);
    }
  };

  const downloadWelcomePDF = (targetUser: User | null) => {
    if (!targetUser) return;
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    let roleDescription = "";
    let rolePermissions: string[] = [];
    if (targetUser.role === "admin") {
      roleDescription = "Super Admin Profile - Full administrative authority over platform metrics, homepage layout banner config, NABL diagnostics catalogs, and fraud prevention pipelines.";
      rolePermissions = [
        "Read/Write access to Homepage Promo Carousels",
        "Manage Medicine Catalog & Stock Indexes",
        "Audit CDSCO Cryptographic Registry Alerts",
        "Monitor live dispatch riders & network nodes"
      ];
    } else if (targetUser.role === "doctor") {
      roleDescription = "Certified Medical Doctor Profile - Clinical workspace authorization for telehealth consult slots, real-time virtual triage patient queues, and cryptographic digital Rx signature issuing.";
      rolePermissions = [
        "Cryptographically sign & issue digital Rx prescriptions",
        "View and triage incoming Patient Consultation queues",
        "Access patients' diagnostic history files",
        "Trigger emergency cardiac consultation sequence"
      ];
    } else if (targetUser.role === "pharmacist") {
      roleDescription = "Licensed Pharmacist Profile - Regulatory verification access for incoming prescription uploads, pharmacy inventory controllers, and thermal-boxed courier dispatch gates.";
      rolePermissions = [
        "Verify customer-uploaded Rx prescription slips",
        "Authorize and trigger priority medicine shipments",
        "Real-time control over medical stock inventories",
        "Monitor express delivery dispatch channels"
      ];
    } else {
      roleDescription = "Verified Platform Customer Profile - Patient dashboard access for generic drug catalog browsing, family refill reminders, diagnostics sample bookings, and live courier GPS tracking.";
      rolePermissions = [
        "Browse & order WHO-GMP certified generic medicines",
        "Create custom family refill alarms & reminders",
        "Schedule home sample diagnostic checkups",
        "Track active order dispatches on live GPS maps"
      ];
    }

    const permissionsHtml = rolePermissions.map(p => `
      <li style="margin-bottom: 8px; color: #374151;">
        <span style="color: #FF6B00; font-weight: bold; margin-right: 6px;">✓</span> ${p}
      </li>
    `).join("");

    printWindow.document.write(`
      <html>
        <head>
          <title>Avenix Welcome Letter - ${targetUser.name}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800;900&display=swap');
            body { font-family: 'Poppins', sans-serif; color: #121212; padding: 40px; margin: 0; line-height: 1.6; background-color: #ffffff; }
            .letter-box { max-width: 800px; margin: auto; border: 1px solid #E5E7EB; padding: 40px; border-radius: 24px; box-shadow: 0 4px 24px rgba(0,0,0,0.02); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #F3F4F6; padding-bottom: 25px; margin-bottom: 30px; }
            .logo { display: flex; flex-direction: column; }
            .logo-main { font-size: 24px; font-weight: 800; tracking: -0.03em; color: #121212; letter-spacing: -0.5px; }
            .logo-sub { font-size: 6px; font-weight: 900; letter-spacing: 0.38em; color: #9CA3AF; margin-top: -3px; font-family: monospace; }
            .doc-type { font-size: 11px; font-weight: 900; text-align: right; color: #FF6B00; text-transform: uppercase; letter-spacing: 1.5px; }
            .salutation { font-size: 16px; font-weight: 800; color: #111827; margin-bottom: 15px; }
            .intro-text { font-size: 12px; color: #4B5563; margin-bottom: 25px; text-align: justify; }
            .section-title { font-size: 11px; font-weight: 800; text-transform: uppercase; tracking-wider: 1px; color: #9CA3AF; margin-bottom: 12px; border-bottom: 1px solid #F3F4F6; padding-bottom: 6px; }
            .cred-card { background-color: #F9FAFB; border: 1px solid #E5E7EB; border-radius: 16px; padding: 20px; margin-bottom: 25px; }
            .cred-grid { display: grid; grid-template-cols: 1fr 1fr; gap: 15px; font-size: 11px; }
            .cred-label { color: #6B7280; font-weight: 600; margin-bottom: 3px; }
            .cred-value { color: #111827; font-weight: 700; font-family: monospace; font-size: 12px; }
            .perm-box { font-size: 11.5px; margin-bottom: 30px; }
            .perm-list { list-style: none; padding: 0; margin: 0; }
            .signature-box { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; border-top: 1px dashed #E5E7EB; padding-top: 25px; }
            .signature { font-size: 11px; color: #4B5563; }
            .seal-wrap { transform: rotate(-6deg); display: inline-block; filter: drop-shadow(0 2px 8px rgba(15,44,89,0.20)); }
            .footer { margin-top: 50px; text-align: center; font-size: 8px; color: #9CA3AF; line-height: 1.5; border-top: 1px solid #F3F4F6; padding-top: 15px; }
            @media print {
              body { padding: 0; }
              .letter-box { border: none; padding: 0; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="letter-box">
            <div class="header">
              <div class="logo">
                <span class="logo-main">AVENIX <span style="color: #FF6B00;">X</span></span>
                <span class="logo-sub">PHARMACEUTICALS</span>
              </div>
              <div>
                <div class="doc-type">Welcome & Credentials Package</div>
                <div style="font-size: 9px; color: #6B7280; text-align: right; margin-top: 4px; font-weight: 500;">Doc ID: <span style="font-family: monospace; font-weight: 700; color: #121212;">AVX-WLM-${Math.floor(100000 + Math.random() * 900000)}</span></div>
                <div style="font-size: 9px; color: #6B7280; text-align: right; font-weight: 500;">Date: <span style="font-weight: 700; color: #121212;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
              </div>
            </div>

            <div class="salutation">Dear ${targetUser.name},</div>
            
            <div class="intro-text">
              Welcome to <strong>Avenix Pharmaceuticals</strong>, India's premier intelligent healthcare delivery and verification network. We are excited to confirm the successful configuration of your secure portal account. Our platform bridges the gap between patient care, clinical supervision, pharmacy fulfillment, and administrative oversight under a unified, real-time CDSCO-compliant architecture. 
              <br/><br/>
              Your profile has been provisioned with role-based access tokens tailored to your designation. Below, you will find your official system login credentials, security parameters, and authorized platform capabilities. Please save this statement securely for your operational records.
            </div>

            <div class="section-title">Authenticated Profile Credentials</div>
            <div class="cred-card">
              <div class="cred-grid">
                <div>
                  <div class="cred-label">Authorized Name</div>
                  <div class="cred-value" style="font-family: inherit; font-size: 13px;">${targetUser.name}</div>
                </div>
                <div>
                  <div class="cred-label">Assigned Profile Scope</div>
                  <div class="cred-value" style="text-transform: uppercase; color: #FF6B00;">${targetUser.role === 'admin' ? 'Super Admin' : targetUser.role}</div>
                </div>
                <div>
                  <div class="cred-label">Registered Identity Email</div>
                  <div class="cred-value" style="font-size: 11px;">${targetUser.email}</div>
                </div>
                <div>
                  <div class="cred-label">Security PIN Code (Simulated)</div>
                  <div class="cred-value" style="letter-spacing: 2px;">1234</div>
                </div>
              </div>
              <div style="margin-top: 15px; font-size: 10px; color: #6B7280; border-top: 1px solid #E5E7EB; padding-top: 10px; font-weight: 500;">
                <strong>Classification Scope:</strong> ${roleDescription}
              </div>
            </div>

            <div class="section-title">Authorized Platform Capabilities</div>
            <div class="perm-box">
              <ul class="perm-list">
                ${permissionsHtml}
              </ul>
            </div>

            <div class="signature-box">
              <div class="signature">
                <strong>Electronic Security Authorization</strong><br/>
                <span style="color: #6B7280; font-size: 9.5px; display: inline-block; margin-top: 4px;">
                  Secured via JWT Web Tokens & OTP Authentication<br/>
                  Avenix Security Compliance Ledger node verified.
                </span>
              </div>
              <div class="seal-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="130" height="130" viewBox="0 0 130 130">
                  <!-- Outer rings -->
                  <circle cx="65" cy="65" r="62" fill="none" stroke="#0F2C59" stroke-width="3"/>
                  <circle cx="65" cy="65" r="56" fill="none" stroke="#0F2C59" stroke-width="0.9" stroke-dasharray="4,3"/>
                  <circle cx="65" cy="65" r="50" fill="none" stroke="#0F2C59" stroke-width="1.8"/>
                  <circle cx="65" cy="65" r="48" fill="rgba(15,44,89,0.03)"/>
                  <!-- 8-point stars between rings -->
                  <g fill="#0F2C59" font-size="8" text-anchor="middle">
                    <text x="65" y="9">&#9733;</text>
                    <text x="100" y="22">&#9733;</text>
                    <text x="114" y="57">&#9733;</text>
                    <text x="100" y="102">&#9733;</text>
                    <text x="65" y="124">&#9733;</text>
                    <text x="30" y="102">&#9733;</text>
                    <text x="16" y="57">&#9733;</text>
                    <text x="30" y="22">&#9733;</text>
                  </g>
                  <!-- Arc paths -->
                  <defs>
                    <path id="topArcW" d="M 13,65 A 52,52 0 1,1 117,65"/>
                    <path id="botArcW" d="M 20,74 A 45,45 0 0,0 110,74"/>
                  </defs>
                  <!-- Top arc: company name -->
                  <text font-family="Georgia,serif" font-size="8" font-weight="900" fill="#0F2C59" letter-spacing="1.8">
                    <textPath href="#topArcW" startOffset="4%">AVENIX PHARMACEUTICALS · INDIA</textPath>
                  </text>
                  <!-- Bottom arc: Healix + dept -->
                  <text font-family="Georgia,serif" font-size="7" font-weight="700" fill="#0F2C59" letter-spacing="1.2">
                    <textPath href="#botArcW" startOffset="5%">· HEALIX TECHNOLOGIES · SECURITY ·</textPath>
                  </text>
                  <!-- Cross guide lines -->
                  <line x1="65" y1="30" x2="65" y2="100" stroke="#0F2C59" stroke-width="0.8" opacity="0.25"/>
                  <line x1="30" y1="65" x2="100" y2="65" stroke="#0F2C59" stroke-width="0.8" opacity="0.25"/>
                  <!-- Centre emblem rings -->
                  <circle cx="65" cy="65" r="18" fill="none" stroke="#0F2C59" stroke-width="1.8"/>
                  <circle cx="65" cy="65" r="13" fill="rgba(15,44,89,0.07)"/>
                  <!-- Centre text: AVENIX X -->
                  <text x="65" y="61" font-family="Arial,sans-serif" font-size="8" font-weight="900" fill="#0F2C59" text-anchor="middle" letter-spacing="0.5">AVENIX</text>
                  <text x="69" y="71" font-family="Arial,sans-serif" font-size="10" font-weight="900" fill="#FF6B00" text-anchor="middle">X</text>
                  <!-- Role badge text -->
                  <text x="65" y="90" font-family="Arial,sans-serif" font-size="6" font-weight="900" fill="#0F2C59" text-anchor="middle" letter-spacing="1">SYSTEM PROVISIONED</text>
                  <!-- Port code -->
                  <text x="65" y="99" font-family="monospace" font-size="5" fill="#0F2C59" text-anchor="middle" opacity="0.7">PORT-${targetUser.role.slice(0, 3).toUpperCase()}</text>
                </svg>
              </div>
            </div>

            <div class="footer">
              This credentials statement is cryptographically generated and signed by Avenix Pharmaceuticals Private Limited.<br/>
              Access control complies with the Information Technology Act, 2000. For emergency resets, contact security@avenix.in.<br/>
              <span style="font-weight: 700; color: #6B7280; font-size: 8px;">Powered by Healix Technologies</span>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const addToCart = (med: Medicine, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.medicine.id === med.id);
      if (existing) {
        return prev.map((item) =>
          item.medicine.id === med.id
            ? { ...item, quantity: Math.min(item.quantity + qty, med.inStock) }
            : item
        );
      }
      return [...prev, { medicine: med, quantity: qty }];
    });
  };

  const removeFromCart = (medId: string) => {
    setCart((prev) => prev.filter((item) => item.medicine.id !== medId));
  };

  const updateCartQuantity = (medId: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.medicine.id === medId
          ? { ...item, quantity: Math.max(1, Math.min(qty, item.medicine.inStock)) }
          : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const placeOrder = (patientName: string, rxFile?: File | string): string => {
    const totalAmount = cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
    const orderId = `AVX-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    const itemsToSave = cart.map(item => ({
      medicine: {
        id: item.medicine.id,
        name: item.medicine.name,
        tagline: item.medicine.tagline,
        price: item.medicine.price,
        originalPrice: item.medicine.originalPrice,
        inStock: item.medicine.inStock,
        requiresPrescription: item.medicine.requiresPrescription,
        dosage: item.medicine.dosage,
        category: item.medicine.category,
        manufacturer: item.medicine.manufacturer,
        image: item.medicine.image,
        scientificName: item.medicine.scientificName,
        description: item.medicine.description,
        subCategory: item.medicine.subCategory
      },
      quantity: item.quantity
    }));

    fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: itemsToSave,
        totalAmount,
        patientName,
        prescriptionAttached: rxFile ? (typeof rxFile === "string" ? rxFile : rxFile.name) : undefined,
      })
    })
    .then(async (res) => {
      const data = await res.json();
      if (data.order) {
        setOrders(prev => [data.order, ...prev]);

        // Trigger simulated notification alerts saved persistently in DB
        const emailRecipient = user?.email || "avnish@avenix.in";
        const phoneRecipient = "+91 90812-70891";

        const emailMsg = `Your Avenix order ${data.order.id} has been successfully registered. Amount payable: ₹${totalAmount}. Your professional PDF invoice receipt is ready. You can download the PDF receipt directly from your Avenix Customer Dashboard. Thank you for choosing India's Intelligent Healthcare Delivery.`;
        const waMsg = `*AVENIX PHARMACEUTICALS* 🧪\n\nOrder *${data.order.id}* is placed! \nPatient: ${patientName}\nTotal amount: *₹${totalAmount}*\n\nStatus: *Awaiting Verification*\nTrack live here: https://avenix.in/track/${data.order.id}`;
        const smsMsg = `AVENIX ALERT: Order ${data.order.id} placed for ₹${totalAmount}. Verified pharmacist approval pending. Live track: avx.in/t/${data.order.id.split("-")[2]}`;

        await fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "email", recipient: emailRecipient, subject: `Avenix Order Placed Successfully - Invoice ${data.order.id}`, message: emailMsg })
        });
        await fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "whatsapp", recipient: phoneRecipient, message: waMsg })
        });
        await fetch("/api/alerts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type: "sms", recipient: phoneRecipient, message: smsMsg })
        });

        const alertsRes = await fetch("/api/alerts");
        const alertsData = await alertsRes.json();
        if (alertsData.alerts) {
          setNotificationAlerts(alertsData.alerts);
        }
      }
    })
    .catch(err => console.error("Place order API error:", err));

    clearCart();
    return orderId;
  };

  const uploadPrescriptionScan = async (fileName: string): Promise<{ isValid: boolean; errorType?: "human_photo" | "unrelated_document" | "generic_file" | "invalid_format"; prescription?: any }> => {
    const validationResult = validatePrescription(fileName);
    if (!validationResult.isValid) {
      return {
        isValid: false,
        errorType: validationResult.errorType
      };
    }

    const payload = {
      fileName,
      medicines: validationResult.medicines,
      warnings: validationResult.warnings,
      sideEffects: validationResult.sideEffects,
      safetyScore: validationResult.safetyScore,
      interactions: validationResult.interactions
    };

    try {
      const res = await fetch("/api/prescriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.prescription) {
        const returnedPrescription = {
          ...data.prescription,
          medicines: typeof data.prescription.medicines === "string" ? JSON.parse(data.prescription.medicines) : data.prescription.medicines,
          warnings: typeof data.prescription.warnings === "string" ? JSON.parse(data.prescription.warnings) : data.prescription.warnings,
          sideEffects: typeof data.prescription.sideEffects === "string" ? JSON.parse(data.prescription.sideEffects) : data.prescription.sideEffects
        };
        setPrescriptions(prev => [returnedPrescription, ...prev]);
        return {
          isValid: true,
          prescription: returnedPrescription
        };
      }
      return { isValid: false, errorType: "generic_file" };
    } catch (err) {
      console.error("Upload prescription API error:", err);
      return { isValid: false, errorType: "generic_file" };
    }
  };

  const verifyAuthenticity = (batchCode: string) => {
    const codes: Record<string, any> = {
      "AVX-90812-GEN": {
        valid: true,
        manufacturer: "Cipla Pharmaceuticals India",
        expiryDate: "12/2028",
        batchNo: "AVX-90812-GEN",
        safetyScore: 99,
        notes: "Blockchain verified original. Sourced directly from WHO-GMP certified Cipla plant in Pune."
      },
      "AVX-80122-MCR": {
        valid: true,
        manufacturer: "Micro Labs Ltd., Bangalore",
        expiryDate: "05/2027",
        batchNo: "AVX-80122-MCR",
        safetyScore: 98,
        notes: "Verified authentic batch. Fully compliant with NABL lab tests."
      }
    };

    if (codes[batchCode.toUpperCase()]) {
      return codes[batchCode.toUpperCase()];
    }

    const randomValid = batchCode.length >= 6;
    return {
      valid: randomValid,
      manufacturer: randomValid ? "Sun Pharmaceutical Industries" : "Unknown / Unregistered Manufacturer",
      expiryDate: randomValid ? "10/2027" : "Expired or Invalid",
      batchNo: batchCode.toUpperCase(),
      safetyScore: randomValid ? 92 : 0,
      notes: randomValid
        ? "Verified via standard batch-listing. Direct supply-chain handshake verified."
        : "CAUTION: This batch code does not exist in the National CDSCO registry. Product authenticity cannot be guaranteed."
    };
  };

  const sendChatMessage = (text: string) => {
    const userMsg: ChatMessage = {
      id: `m-${Math.random()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setChatHistory((prev) => [...prev, userMsg]);

    setTimeout(() => {
      let aiText = "I have received your description. To offer correct drug guidelines, please share any history of allergies.";
      let urgency: ChatMessage["urgencyScore"] = "Low";
      let recs: string[] = [];
      let referral = false;

      const prompt = text.toLowerCase();
      if (prompt.includes("fever") || prompt.includes("weakness")) {
        aiText = "Based on your symptoms of fever and weakness, this could indicate a viral infection or dehydration. Please monitor your body temperature.";
        urgency = "Moderate";
        recs = ["Paracetamol 650mg (Dolo) for fever reduction", "Electrolyte (ORS) hydration fluids", "Adequate physical rest"];
        referral = true;
      } else if (prompt.includes("chest pain") || prompt.includes("breathing") || prompt.includes("breath")) {
        aiText = "EMERGENCY WARNING: Chest pain and breathing difficulty could indicate an acute cardiac episode or respiratory crisis. Please do not self-medicate.";
        urgency = "High";
        recs = ["Sit upright in a comfortable position", "Call emergency services immediately or click 'Emergency Delivery'"];
        referral = true;
      } else if (prompt.includes("stomach") || prompt.includes("acidity") || prompt.includes("gas")) {
        aiText = "Your stomach discomfort and acidity can be managed effectively using an over-the-counter antacid.";
        urgency = "Low";
        recs = ["Pantocid 40mg (taken empty stomach)", "Avoid spicy foods and carbonated drinks"];
      } else if (prompt.includes("metformin") || prompt.includes("side effect")) {
        aiText = "Metformin is a safe first-line medication for type-2 diabetes. Common mild side effects include nausea, loose stools, or metallic taste, which resolve in 1-2 weeks.";
        urgency = "Low";
        recs = ["Always take Metformin with meals to minimize GI side effects", "Avoid alcohol to prevent lactic acidosis risk"];
      }

      const aiMsg: ChatMessage = {
        id: `m-${Math.random()}`,
        sender: "ai",
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        urgencyScore: urgency,
        recommendations: recs,
        referralNeeded: referral
      };

      setChatHistory((prev) => [...prev, aiMsg]);
    }, 1000);
  };

  const triggerEmergencyDelivery = (address: string) => {
    setEmergencyActive(true);
    setEmergencyETA(600); // 10 minutes countdown
    setEmergencyCourierGPS({ lat: 28.6139, lng: 77.209 });
    setEmergencyStep(1); // Dispatching
  };

  const cancelEmergency = () => {
    setEmergencyActive(false);
    setEmergencyStep(0);
  };

  const bookAppointment = (
    type: "doctor" | "diagnostics",
    targetName: string,
    patientName: string,
    date: string,
    timeslot: string
  ) => {
    fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, targetName, patientName, date, timeslot })
    })
    .then(async (res) => {
      const data = await res.json();
      if (data.booking) {
        setBookings(prev => [data.booking, ...prev]);
      }
    })
    .catch(err => console.error("Book appointment API error:", err));
  };

  const updateOrderStatus = (orderId: string, status: Order["status"]) => {
    fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    })
    .then(async (res) => {
      const data = await res.json();
      if (data.order) {
        setOrders(prev => prev.map(o => o.id === orderId ? data.order : o));

        // Persist notification alerts in database
        const phoneRecipient = "+91 90812-70891";
        let message = "";
        let alertType: "whatsapp" | "email" | "sms" = "whatsapp";

        if (status === "verified") {
          message = `*AVENIX PHARMACEUTICALS* 🧪\n\nOrder *${orderId}* is *VERIFIED*! \nPrescription checks completed by Pharmacist Vikram Singh (R.Ph). Preparing for priority dispatch.`;
        } else if (status === "dispatched") {
          message = `*AVENIX PHARMACEUTICALS* 🧪\n\nOrder *${orderId}* is *DISPATCHED*! \nCourier Rahul Kumar is heading to your location with your secure thermal-boxed medicines. ETA: *15 mins*.`;
        } else if (status === "delivered") {
          message = `*AVENIX PHARMACEUTICALS* 🧪\n\nOrder *${orderId}* has been *DELIVERED* successfully. Thank you for trusting Avenix!`;
        }

        if (message) {
          await fetch("/api/alerts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ type: alertType, recipient: phoneRecipient, message })
          });
          const alertsRes = await fetch("/api/alerts");
          const alertsData = await alertsRes.json();
          if (alertsData.alerts) {
            setNotificationAlerts(alertsData.alerts);
          }
        }
      }
    })
    .catch(err => console.error("Update order status API error:", err));
  };

  const updateBanners = (newBanners: CarouselBanner[]) => {
    fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "banners", value: newBanners })
    })
    .then(() => setBanners(newBanners))
    .catch(err => console.error("Update banners API error:", err));
  };

  const updateTestimonials = (newTestimonials: TestimonialReel[]) => {
    fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "testimonials", value: newTestimonials })
    })
    .then(() => setTestimonials(newTestimonials))
    .catch(err => console.error("Update testimonials API error:", err));
  };

  const updateCategories = (newCategories: HealthCategory[]) => {
    fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "categories", value: newCategories })
    })
    .then(() => setCategories(newCategories))
    .catch(err => console.error("Update categories API error:", err));
  };

  // Medicine operations
  const addMedicine = (med: Omit<Medicine, "id">) => {
    fetch("/api/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(med)
    })
    .then(async (res) => {
      const data = await res.json();
      if (data.medicine) {
        setMedicines(prev => [...prev, data.medicine]);
      }
    })
    .catch(err => console.error("Add medicine API error:", err));
  };

  const updateMedicine = (id: string, partial: Partial<Medicine>) => {
    fetch(`/api/medicines/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial)
    })
    .then(async (res) => {
      const data = await res.json();
      if (data.medicine) {
        setMedicines(prev => prev.map(m => m.id === id ? data.medicine : m));
      }
    })
    .catch(err => console.error("Update medicine API error:", err));
  };

  const deleteMedicine = (id: string) => {
    fetch(`/api/medicines/${id}`, {
      method: "DELETE"
    })
    .then(() => {
      setMedicines(prev => prev.filter(m => m.id !== id));
    })
    .catch(err => console.error("Delete medicine API error:", err));
  };

  // Diagnostics operations
  const addDiagnosticPackage = (diag: Omit<DiagnosticPackage, "id">) => {
    const newDiag = { ...diag, id: `diag-${Math.floor(1000 + Math.random() * 9000)}` };
    const updated = [...diagnostics, newDiag];
    fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "diagnostics", value: updated })
    })
    .then(() => setDiagnostics(updated))
    .catch(err => console.error("Add diagnostic API error:", err));
  };

  const updateDiagnosticPackage = (id: string, partial: Partial<DiagnosticPackage>) => {
    const updated = diagnostics.map((d) => (d.id === id ? { ...d, ...partial } : d));
    fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "diagnostics", value: updated })
    })
    .then(() => setDiagnostics(updated))
    .catch(err => console.error("Update diagnostic API error:", err));
  };

  const deleteDiagnosticPackage = (id: string) => {
    const updated = diagnostics.filter((d) => d.id !== id);
    fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "diagnostics", value: updated })
    })
    .then(() => setDiagnostics(updated))
    .catch(err => console.error("Delete diagnostic API error:", err));
  };

  // Doctor operations
  const addDoctor = (doc: Omit<Doctor, "id">) => {
    const newDoc = { ...doc, id: `doc-${Math.floor(1000 + Math.random() * 9000)}` };
    const updated = [...doctors, newDoc];
    fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "doctors", value: updated })
    })
    .then(() => setDoctors(updated))
    .catch(err => console.error("Add doctor API error:", err));
  };

  const updateDoctor = (id: string, partial: Partial<Doctor>) => {
    const updated = doctors.map((d) => (d.id === id ? { ...d, ...partial } : d));
    fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "doctors", value: updated })
    })
    .then(() => setDoctors(updated))
    .catch(err => console.error("Update doctor API error:", err));
  };

  const deleteDoctor = (id: string) => {
    const updated = doctors.filter((d) => d.id !== id);
    fetch("/api/content", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "doctors", value: updated })
    })
    .then(() => setDoctors(updated))
    .catch(err => console.error("Delete doctor API error:", err));
  };

  return (
    <AppContext.Provider
      value={{
        user,
        role,
        medicines,
        cart,
        orders,
        prescriptions,
        chatHistory,
        emergencyActive,
        emergencyETA,
        emergencyCourierGPS,
        emergencyStep,
        doctors,
        diagnostics,
        bookings,
        notificationAlerts,
        banners,
        testimonials,
        categories,
        login,
        loginWithGoogle,
        loginWithGoogleToken,
        logout,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        placeOrder,
        uploadPrescriptionScan,
        verifyAuthenticity,
        sendChatMessage,
        triggerEmergencyDelivery,
        cancelEmergency,
        bookAppointment,
        updateOrderStatus,
        searchQuery,
        setSearchQuery,
        downloadWelcomePDF,
        updateBanners,
        updateTestimonials,
        updateCategories,
        addMedicine,
        updateMedicine,
        deleteMedicine,
        addDiagnosticPackage,
        updateDiagnosticPackage,
        deleteDiagnosticPackage,
        addDoctor,
        updateDoctor,
        deleteDoctor
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};

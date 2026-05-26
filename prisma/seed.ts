import { PrismaClient } from "@prisma/client";
import { scryptSync, randomBytes } from "crypto";

const prisma = new PrismaClient();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

const defaultMedicines = [
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

const defaultDoctors = [
  { id: "doc-1", name: "Dr. Ananya Sharma", specialty: "MD Cardiology", experience: 12, availability: "Immediate Response", rating: 4.9, fees: 600, image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300" },
  { id: "doc-2", name: "Dr. Rohan Verma", specialty: "MD Pediatrics", experience: 8, availability: "In 10 Minutes", rating: 4.8, fees: 500, image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300" },
  { id: "doc-3", name: "Dr. Sidharth Mehta", specialty: "MBBS General Medicine", experience: 15, availability: "Immediate Response", rating: 4.7, fees: 400, image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300" },
  { id: "doc-4", name: "Dr. Priya Iyer", specialty: "MD Dermatology", experience: 10, availability: "Today, 4:30 PM", rating: 4.9, fees: 700, image: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300" }
];

const defaultDiagnostics = [
  { id: "diag-1", name: "Smart Full Body Health Check", price: 1499, originalPrice: 2999, testsCount: 82, tests: ["Thyroid Profile (T3, T4, TSH)", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Complete Blood Count (CBC)", "Lipid Profile (Cholesterol)", "HbA1c & Blood Sugar"], description: "Best-selling comprehensive checkup covering vital organs and metabolism indicators. Includes free home sample collection.", image: "/images/lab_fullbody.png" },
  { id: "diag-2", name: "Active Cardiac Screening", price: 2499, originalPrice: 4999, testsCount: 45, tests: ["Lipid Profile Extended", "High-Sensitivity CRP (hs-CRP)", "Apolipoproteins A1 & B", "Electrocardiogram (ECG)", "Serum Electrolytes"], description: "Targeted screen for cardiovascular health, arterial block risk, and cholesterol sub-components.", image: "/images/lab_cardiac.png" },
  { id: "diag-3", name: "Diabetes Control Profile", price: 699, originalPrice: 1499, testsCount: 12, tests: ["HbA1c (Average Sugar)", "Fasting Blood Glucose", "Post-Prandial Glucose", "Urine Microalbumin"], description: "Essential periodic monitor for diabetic & pre-diabetic patients to track sugar trends and kidney safety.", image: "/images/lab_diabetes.png" }
];

const defaultBanners = [
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

const defaultTestimonials = [
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

const defaultCategories = [
  { id: "pain", name: "Fever & Pain", img: "/images/concern_fever_pain.png" },
  { id: "diabetes", name: "Diabetes Care", img: "/images/concern_diabetes.png" },
  { id: "cardiac", name: "Cardiac Care", img: "/images/concern_cardiac.png" },
  { id: "stomach", name: "Acidity & Gas", img: "/images/concern_acidity.png" },
  { id: "allergy", name: "Asthma & Allergy", img: "/images/concern_allergy.png" },
  { id: "antibiotics", name: "Antibiotics", img: "/images/concern_antibiotics.png" }
];

async function main() {
  console.log("Seeding database...");

  // Delete existing records to avoid duplicates
  await prisma.user.deleteMany({});
  await prisma.medicine.deleteMany({});
  await prisma.homepageContent.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.prescriptionScan.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.notificationAlert.deleteMany({});
  await prisma.emergencyEvent.deleteMany({});
  await prisma.hospitalNetwork.deleteMany({});
  await prisma.clinicalGuidanceEfficacy.deleteMany({});
  await prisma.emergencySession.deleteMany({});
  await prisma.voiceTranscript.deleteMany({});
  await prisma.severityScore.deleteMany({});
  await prisma.ambulanceRoute.deleteMany({});
  await prisma.hospitalCapacity.deleteMany({});
  await prisma.incidentOutcome.deleteMany({});
  await prisma.dispatchLog.deleteMany({});
  await prisma.familyNotification.deleteMany({});
  await prisma.survivalAnalytics.deleteMany({});

  // Seed Users
  const defaultUsers = [
    {
      email: "avnish@avenix.in",
      name: "Avnish (Super Admin)",
      role: "admin",
      password: hashPassword("admin123"),
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=150"
    },
    {
      email: "dr.verma@doctor.avenix.in",
      name: "Dr. Verma",
      role: "doctor",
      password: hashPassword("doctor123"),
      avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=150"
    },
    {
      email: "ph.rahul@pharmacist.avenix.in",
      name: "Pharmacist Rahul",
      role: "pharmacist",
      password: hashPassword("pharma123"),
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=150"
    },
    {
      email: "avnish@gmail.com",
      name: "Avnish Kumar",
      role: "customer",
      password: hashPassword("customer123"),
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150"
    }
  ];

  for (const u of defaultUsers) {
    await prisma.user.create({
      data: u
    });
  }

  // Seed Medicines
  for (const m of defaultMedicines) {
    await prisma.medicine.create({
      data: m,
    });
  }

  // Seed Homepage content components
  await prisma.homepageContent.create({
    data: {
      key: "banners",
      valueJson: JSON.stringify(defaultBanners),
    },
  });

  await prisma.homepageContent.create({
    data: {
      key: "testimonials",
      valueJson: JSON.stringify(defaultTestimonials),
    },
  });

  await prisma.homepageContent.create({
    data: {
      key: "categories",
      valueJson: JSON.stringify(defaultCategories),
    },
  });

  await prisma.homepageContent.create({
    data: {
      key: "doctors",
      valueJson: JSON.stringify(defaultDoctors),
    },
  });

  await prisma.homepageContent.create({
    data: {
      key: "diagnostics",
      valueJson: JSON.stringify(defaultDiagnostics),
    },
  });

  // Seed baseline orders
  const initialOrders = [
    {
      id: "AVX-ORD-70891",
      itemsJson: JSON.stringify([
        { medicine: defaultMedicines[0], quantity: 2 },
        { medicine: defaultMedicines[4], quantity: 1 }
      ]),
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
      itemsJson: JSON.stringify([
        { medicine: defaultMedicines[1], quantity: 1 },
        { medicine: defaultMedicines[5], quantity: 3 }
      ]),
      totalAmount: 195,
      status: "verified",
      date: "2026-05-23",
      patientName: "Sushma Devi",
      prescriptionAttached: "prescription_sushma_dermat.png",
      eta: "Arriving in 45 mins",
      trackingStep: 2,
      userEmail: "avnish@avenix.in"
    }
  ];

  for (const o of initialOrders) {
    await prisma.order.create({
      data: o,
    });
  }

  // Seed baseline prescriptions
  await prisma.prescriptionScan.create({
    data: {
      id: "rx-901",
      fileName: "prescription_sushma_dermat.png",
      date: "2026-05-23",
      medicinesJson: JSON.stringify([
        { name: "Amoxicillin 500mg", dose: "500mg", timing: "1-1-1 after food", purpose: "Bacterial Infection Control" },
        { name: "Cetirizine 10mg", dose: "10mg", timing: "0-0-1 before sleep", purpose: "Anti-allergy / Rhinitis" }
      ]),
      warningsJson: JSON.stringify([
        "Do not skip antibiotics course",
        "Avoid alcohol consumption during treatment"
      ]),
      sideEffectsJson: JSON.stringify([
        "Mild drowsiness (from Cetirizine)",
        "Nausea or stomach upset (from Amoxicillin)"
      ]),
      safetyScore: 98,
      interactions: "No major drug-drug interactions detected between Amoxicillin and Cetirizine.",
      userEmail: "avnish@avenix.in"
    }
  });

  // Seed baseline bookings
  await prisma.booking.create({
    data: {
      id: "bk-301",
      type: "diagnostics",
      targetName: "Smart Full Body Health Check",
      patientName: "Avnish Kumar",
      date: "2026-05-25",
      timeslot: "08:00 AM - 10:00 AM",
      status: "upcoming",
      userEmail: "avnish@avenix.in"
    }
  });

  // Seed baseline notifications
  const initialAlerts = [
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
  ];

  for (const a of initialAlerts) {
    await prisma.notificationAlert.create({
      data: a,
    });
  }

  // Seed Hospital Network
  const hospitals = [
    { name: "AIIMS Delhi (STEMI Specialty)", distance: "11.2 km", beds: 5, strokeUnit: "Active", cathLab: "Ready", doctorDuty: "Dr. R. Sharma", survivalProb: 96.0, isBest: true },
    { name: "Max Super Specialty Noida", distance: "4.8 km", beds: 2, strokeUnit: "Full Queue", cathLab: "Occupied", doctorDuty: "Dr. A. Verma", survivalProb: 68.0, isBest: false },
    { name: "Fortis Hospital Sector 62", distance: "2.1 km", beds: 0, strokeUnit: "Full Queue", cathLab: "Ready", doctorDuty: "Dr. P. Joshi", survivalProb: 58.0, isBest: false }
  ];
  for (const h of hospitals) {
    await prisma.hospitalNetwork.create({
      data: h
    });
  }

  // Seed Hospital Capacity for FHIR HL7 Sync
  const hospitalCapacities = [
    { hospitalName: "AIIMS Delhi (STEMI Specialty)", icuAvailable: 5, specialtyReady: "Active", cathLabReady: "Ready", doctorReady: "Dr. R. Sharma", emergencyLoad: 18, staffReady: 95 },
    { hospitalName: "Max Super Specialty Noida", icuAvailable: 2, specialtyReady: "Full", cathLabReady: "Occupied", doctorReady: "Dr. A. Verma", emergencyLoad: 65, staffReady: 80 },
    { hospitalName: "Fortis Hospital Sector 62", icuAvailable: 0, specialtyReady: "Offline", cathLabReady: "Ready", doctorReady: "Dr. P. Joshi", emergencyLoad: 85, staffReady: 60 }
  ];
  for (const hc of hospitalCapacities) {
    await prisma.hospitalCapacity.create({
      data: hc
    });
  }

  // Seed Guidance Efficacy
  const guidanceEfficacy = [
    { symptom: "heart_attack", instructions: "sit upright + chew aspirin (300mg) + family alert + pre-notify cath lab", survivalOutcome: 96.0 },
    { symptom: "heart_attack", instructions: "await ambulance + check pulse", survivalOutcome: 64.0 },
    { symptom: "stroke", instructions: "FAST test + zero oral intake + recovery position + pre-notify stroke unit", survivalOutcome: 92.0 },
    { symptom: "stroke", instructions: "elevate legs + drink warm tea", survivalOutcome: 42.0 }
  ];
  for (const ge of guidanceEfficacy) {
    await prisma.clinicalGuidanceEfficacy.create({
      data: ge
    });
  }

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

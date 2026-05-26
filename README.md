# 🧪 AVENIX PHARMACEUTICALS

> **India's Intelligent Online Pharmacy** — AI-powered medicine delivery, emergency dispatch, prescription scanning, lab tests & telemedicine.

![Platform](https://img.shields.io/badge/Platform-Next.js%2016-black?style=for-the-badge&logo=next.js)
![Database](https://img.shields.io/badge/Database-SQLite%20%2B%20Prisma-blue?style=for-the-badge&logo=prisma)
![AI](https://img.shields.io/badge/AI-Voice%20Triage%20%7C%20OCR%20Scan-red?style=for-the-badge)
![Mobile](https://img.shields.io/badge/Mobile-Optimized-green?style=for-the-badge)

---

## ✨ Features

### 🏠 Core Platform
- **Medicine Delivery** — Browse 7+ certified medicines, add to cart, Razorpay checkout
- **AI Prescription Scanner** — OCR upload → drug name extraction → safety score
- **Lab Tests & Diagnostics** — Book home sample collection with NABL-certified labs
- **Doctor Consultation** — Live video calls with certified specialists
- **Health Assistant** — AI chatbot for symptom guidance

### 🚨 Healix SOS Emergency System
- **Voice Biomarker Triage** — Detects panic level, speech delay, breath irregularity
- **AI Severity Classification** — Stable / Urgent / Critical / Immediate Dispatch Required
- **Live Leaflet Map** — Real GPS tracking of patient + ambulance
- **Smart Hospital Routing** — FHIR HL7 capacity sync, survival probability scoring
- **Clinical Guidance** — Animated CPR, FAST stroke, Heimlich instructions
- **Calm Voice Support** — English / Hindi / Hinglish adaptive voice

### 🎛️ Dashboards
| Role | Features |
|---|---|
| **Customer** | Orders, prescriptions, bookings, profile |
| **Doctor** | Appointments, video calls, patient records |
| **Pharmacist** | Inventory, dispatch, orders queue |
| **Admin** | Full analytics, hospital network, SOS control |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Database | SQLite + Prisma ORM |
| Auth | JWT (httpOnly cookie) + Google OAuth |
| Maps | Leaflet.js (real OpenStreetMap tiles) |
| Animations | Framer Motion |
| AI Voice | Web Speech API (browser-native) |
| Payments | Razorpay |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/IITMBSDSMS/AVENIX-PHARMA.git
cd AVENIX-PHARMA
npm install
```

### 2. Environment Variables
Create a `.env` file in the root:
```env
DATABASE_URL="file:./prisma/dev.db"
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"
GOOGLE_CLIENT_ID="your-google-oauth-client-id"
GOOGLE_CLIENT_SECRET="your-google-oauth-secret"
RAZORPAY_KEY_ID="your-razorpay-key-id"
RAZORPAY_KEY_SECRET="your-razorpay-key-secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"
```

### 3. Database Setup
```bash
npx prisma generate
npx prisma db push
npx ts-node --compiler-options '{"module":"CommonJS"}' prisma/seed.ts
```

### 4. Run Dev Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

---

## 👤 Default Credentials (after seed)

| Role | Email | Password |
|---|---|---|
| Admin | `avnish@avenix.in` | `admin123` |
| Doctor | `dr.verma@doctor.avenix.in` | `doctor123` |
| Pharmacist | `ph.rahul@pharmacist.avenix.in` | `pharma123` |
| Customer | `avnish@gmail.com` | `customer123` |

---

## 📁 Project Structure

```
avenix-pharmaceuticals/
├── src/
│   ├── app/                  # Next.js App Router pages + API routes
│   │   ├── api/              # 20 API endpoints
│   │   ├── dashboard/        # 4 role dashboards
│   │   ├── delivery/         # Medicine store
│   │   ├── doctors/          # Doctor consultation
│   │   ├── diagnostics/      # Lab tests
│   │   ├── prescription-ai/  # OCR scanner
│   │   ├── emergency/        # SOS emergency page
│   │   └── ...
│   ├── components/           # Shared components
│   │   ├── HealixSOSOverlay.tsx   # Full SOS triage system (2600+ lines)
│   │   ├── HealixSOSWrapper.tsx   # Global SOS button
│   │   ├── Navbar.tsx            # Responsive navigation
│   │   └── Footer.tsx
│   ├── context/              # React context (AppState)
│   └── lib/                  # DB client, auth helpers
├── prisma/
│   ├── schema.prisma         # 19 models
│   └── seed.ts               # Database seeder
├── public/
│   ├── map.html              # Leaflet live tracking map
│   ├── manifest.json         # PWA manifest
│   └── images/               # Medicine & UI images
└── package.json
```

---

## 🏥 Emergency API

```bash
curl -X POST http://localhost:3000/api/emergency/triage \
  -H "Content-Type: application/json" \
  -d '{
    "symptom": "heart_attack",
    "patientGps": "28.5355,77.3910",
    "panicIndex": 85,
    "stressLevel": 80,
    "breathRate": 28,
    "urgencyScore": 0.85
  }'
```

**Response includes:** severity classification, nearest hospital with ICU beds, ambulance GPS, ETA, survival probability, and full replay log.

---

## 📱 Mobile Optimised

- Responsive layouts (mobile-first Tailwind)
- iOS Safe Area support (`env(safe-area-inset-bottom)`)
- `prefers-reduced-motion` support
- Touch-optimised (44px tap targets)
- PWA-ready with `manifest.json`
- WhatsApp floating quick-contact button

---

## 🌐 Live URL

**[https://www.avenixpharma.in](https://www.avenixpharma.in)**

---

## 📄 License

Private — © 2026 Avenix Pharmaceuticals. All rights reserved.

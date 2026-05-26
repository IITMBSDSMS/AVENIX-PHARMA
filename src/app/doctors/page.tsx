import type { Metadata } from "next";
import DoctorsPageClient from "./DoctorsPageClient";

export const metadata: Metadata = {
  title: "Consult a Doctor Online — Instant Video Consultation",
  description: "Connect instantly with board-certified Indian doctors. Video consultations, digital prescriptions, specialist referrals. Available 24/7. Consultation from ₹400.",
  keywords: ["consult doctor online", "video consultation", "telehealth india", "doctor appointment", "nmc certified doctors", "online md consultation", "chat with doctor online", "telemedicine service bangalore"],
  openGraph: {
    title: "Consult a Doctor Online — Avenix Health",
    description: "Board-certified doctors available 24/7. Video consultation from ₹400.",
    url: "https://www.avenixpharma.in/doctors",
  },
};

export default function Page() {
  return <DoctorsPageClient />;
}

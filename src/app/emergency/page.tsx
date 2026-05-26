import type { Metadata } from "next";
import EmergencyPageClient from "./EmergencyPageClient";

export const metadata: Metadata = {
  title: "Emergency Medicine Delivery — Under 10 Minutes",
  description: "Urgent medicine delivery in under 10 minutes. One-tap emergency dispatch, live GPS tracking, priority rider assignment for life-critical medication needs.",
  keywords: ["emergency medicine delivery", "urgent medicine", "fast medicine delivery", "emergency pharmacy", "10 minute delivery bangalore", "critical care medication express", "life saving drugs home delivery", "night medicine delivery"],
  openGraph: {
    title: "Emergency Medicine Delivery — Avenix Express",
    description: "Life-critical medicines delivered in under 10 minutes with live GPS tracking.",
    url: "https://www.avenixpharma.in/emergency",
  },
};

export default function Page() {
  return <EmergencyPageClient />;
}

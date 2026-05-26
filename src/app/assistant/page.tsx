import type { Metadata } from "next";
import AssistantPageClient from "./AssistantPageClient";

export const metadata: Metadata = {
  title: "AI Health Assistant — Symptom Checker & Medicine Advisor",
  description: "Describe your symptoms and get instant AI-powered health guidance, urgency scores, and generic medicine recommendations. Powered by clinical intelligence.",
  keywords: ["AI health assistant", "symptom checker", "medicine advisor", "online health guidance", "medical chat AI", "check symptoms online", "virtual health assistant", "clinical symptom triage"],
  openGraph: {
    title: "AI Health Assistant — Avenix Intelligence",
    description: "Instant symptom analysis, urgency scores, and medicine recommendations.",
    url: "https://www.avenixpharma.in/assistant",
  },
};

export default function Page() {
  return <AssistantPageClient />;
}

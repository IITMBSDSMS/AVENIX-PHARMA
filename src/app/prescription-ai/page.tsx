import type { Metadata } from "next";
import PrescriptionAIPageClient from "./PrescriptionAIPageClient";

export const metadata: Metadata = {
  title: "AI Prescription Scanner — Upload & Analyze Your Rx",
  description: "Upload a photo of your handwritten or digital prescription. Our AI instantly extracts medicine names, dosage, drug interactions, and safety warnings.",
  keywords: ["prescription scanner", "AI prescription", "upload prescription", "OCR medicine", "analyze rx online", "handwritten prescription reader", "dosage extraction AI", "medical prescription analysis"],
  openGraph: {
    title: "AI Prescription Scanner — Avenix AI",
    description: "Upload your prescription photo for instant AI analysis and safety scan.",
    url: "https://www.avenixpharma.in/prescription-ai",
  },
};

export default function Page() {
  return <PrescriptionAIPageClient />;
}

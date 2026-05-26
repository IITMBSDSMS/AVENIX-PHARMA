import type { Metadata } from "next";
import VerifyPageClient from "./VerifyPageClient";

export const metadata: Metadata = {
  title: "Verify Medicine Authenticity — Batch Code Checker",
  description: "Instantly verify your medicine's authenticity using batch code or barcode. Check manufacturer details, expiry date, and safety trust score. CDSCO-compliant.",
  keywords: ["verify medicine", "medicine authenticity", "batch code checker", "drug verification india", "is my medicine genuine", "fake medicine detector", "verify expiry date online", "drug quality testing"],
  openGraph: {
    title: "Verify Medicine Authenticity — Avenix Trust Shield",
    description: "Scan your medicine batch code to verify authenticity and expiry instantly.",
    url: "https://www.avenixpharma.in/verify",
  },
};

export default function Page() {
  return <VerifyPageClient />;
}

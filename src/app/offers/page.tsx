import type { Metadata } from "next";
import OffersPageClient from "./OffersPageClient";

export const metadata: Metadata = {
  title: "Avenix Special Offers & Discounts — Save Up to 70%",
  description: "Explore the latest discount codes, corporate coupons, bank cashbacks, and drug discounts at Avenix Pharmaceuticals. Save on prescription medicines and lab tests.",
  keywords: ["medicine discounts", "lab test offers", "pharmacy coupons", "cashback deals", "Avenix deals", "prescription drug discount code", "health checkup coupons bangalore", "paytm pharmacy cashback"],
  openGraph: {
    title: "Special Health Offers & Pharmacy Deals — Avenix",
    description: "Get flat discounts and instant cashback. Save on diagnostics checks and super-specialist consultations.",
    url: "https://www.avenixpharma.in/offers",
  },
};

export default function Page() {
  return <OffersPageClient />;
}

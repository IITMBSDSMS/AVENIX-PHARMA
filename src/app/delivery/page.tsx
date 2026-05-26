import type { Metadata } from "next";
import DeliveryPageClient from "./DeliveryPageClient";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Buy Medicines Online — Up to 25% Off",
  description: "Order authentic medicines online with guaranteed same-day delivery. Search from 500+ medicines including OTC and prescription drugs. CDSCO-certified warehouse.",
  keywords: ["buy medicines online", "medicine delivery", "online pharmacy", "prescription medicines", "generic drugs discount", "order over-the-counter medicine", "chemists near me same day", "online pharmacy bangalore fast"],
  openGraph: {
    title: "Buy Medicines Online — Avenix Pharmaceuticals",
    description: "Authentic medicines, same-day delivery, up to 25% off.",
    url: "https://www.avenixpharma.in/delivery",
  },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">Loading catalog...</div>}>
      <DeliveryPageClient />
    </Suspense>
  );
}

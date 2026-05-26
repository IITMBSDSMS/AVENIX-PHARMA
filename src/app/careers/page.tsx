import type { Metadata } from "next";
import CareersPageClient from "./CareersPageClient";

export const metadata: Metadata = {
  title: "Careers — Join Avenix Healthcare Tech Team",
  description: "Explore career opportunities at Avenix Pharmaceuticals. Build advanced healthcare delivery logistics, telemetry diagnostics engines, and compliant online pharmacy software.",
  keywords: ["Avenix careers", "clinical healthcare jobs", "nextjs software engineer jobs bangalore", "pharmacist jobs"],
};

export default function Page() {
  return <CareersPageClient />;
}

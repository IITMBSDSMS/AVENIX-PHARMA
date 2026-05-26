import type { Metadata } from "next";
import DiagnosticsPageClient from "./DiagnosticsPageClient";

export const metadata: Metadata = {
  title: "Book Lab Tests at Home — NABL Certified",
  description: "Book affordable lab tests with free home sample collection. NABL-certified pathology, digital reports in 6 hours. Full body checkup packages from ₹699.",
  keywords: ["lab tests at home", "diagnostics booking", "blood test home collection", "full body checkup", "nabl certified lab bangalore", "thyroid profile test cost", "preventive health packages", "diabetes test home sample"],
  openGraph: {
    title: "Book Lab Tests at Home — Avenix Diagnostics",
    description: "NABL-certified lab tests with free home collection. Reports in 6 hours.",
    url: "https://www.avenixpharma.in/diagnostics",
  },
};

export default function Page() {
  return <DiagnosticsPageClient />;
}

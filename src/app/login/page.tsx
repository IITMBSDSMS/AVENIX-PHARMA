import type { Metadata } from "next";
import LoginPageClient from "./LoginPageClient";

export const metadata: Metadata = {
  title: "Login — Access Your Health Portal",
  description: "Sign in to your Avenix account to manage orders, view prescriptions, book lab tests, and access your personal health dashboard.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <LoginPageClient />;
}

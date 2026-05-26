import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";

export type Role = "customer" | "pharmacist" | "doctor" | "admin";

export interface User {
  name: string;
  email: string;
  role: Role;
  avatar: string;
}

export const AUTH_COOKIE_NAME = "avx_auth_token";

export function classifyEmail(emailStr: string): { role: Role; name: string } {
  const cleanEmail = emailStr.trim().toLowerCase();
  
  // Super Admin check
  if (
    cleanEmail === "avnish@avenix.in" ||
    cleanEmail === "admin@avenix.in" ||
    cleanEmail.endsWith("@admin.avenix.in")
  ) {
    let namePart = cleanEmail.split("@")[0];
    let displayName = "Avnish (Super Admin)";
    if (namePart === "admin") {
      displayName = "Admin (Super Admin)";
    } else if (namePart !== "avnish") {
      displayName = `${namePart.charAt(0).toUpperCase() + namePart.slice(1)} (Super Admin)`;
    }
    return { role: "admin", name: displayName };
  }

  // Doctor check
  if (cleanEmail.startsWith("dr.") || cleanEmail.endsWith("@doctor.avenix.in")) {
    let namePart = "";
    if (cleanEmail.startsWith("dr.")) {
      namePart = cleanEmail.substring(3).split("@")[0];
    } else {
      namePart = cleanEmail.split("@")[0];
      if (namePart.startsWith("dr.")) namePart = namePart.substring(3);
    }
    const capitalized = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : "Verma";
    return { role: "doctor", name: `Dr. ${capitalized}` };
  }

  // Pharmacist check
  if (cleanEmail.startsWith("ph.") || cleanEmail.endsWith("@pharmacist.avenix.in")) {
    let namePart = "";
    if (cleanEmail.startsWith("ph.")) {
      namePart = cleanEmail.substring(3).split("@")[0];
    } else {
      namePart = cleanEmail.split("@")[0];
      if (namePart.startsWith("ph.")) namePart = namePart.substring(3);
    }
    const capitalized = namePart ? namePart.charAt(0).toUpperCase() + namePart.slice(1) : "Rahul";
    return { role: "pharmacist", name: `Pharmacist ${capitalized}` };
  }

  // Customer check
  let namePart = cleanEmail.split("@")[0];
  namePart = namePart.replace(/[^a-zA-Z]/g, " ");
  const capitalized = namePart
    ? namePart.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ").trim()
    : "Avnish Kumar";
  return { role: "customer", name: capitalized };
}

export function getUserFromRequest(req: NextRequest): User | null {
  const token = req.cookies.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifyToken(token);
}

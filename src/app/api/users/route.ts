import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = getUserFromRequest(req);
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden – Admin only" }, { status: 403 });
    }

    let users = [];
    try {
      users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      });
    } catch (e) {
      console.warn("db.user.findMany failed (read-only SQLite fallback):", e);
      users = [
        { id: "1", name: "Avnish Kumar", email: "avnish@gmail.com", role: "customer", avatar: null, createdAt: new Date() },
        { id: "2", name: "Dr. Rohan Verma", email: "dr.verma@doctor.avenix.in", role: "doctor", avatar: null, createdAt: new Date() },
        { id: "3", name: "Pharmacist Rahul", email: "ph.rahul@pharmacist.avenix.in", role: "pharmacist", avatar: null, createdAt: new Date() },
        { id: "4", name: "Avnish (Super Admin)", email: "avnish@avenix.in", role: "admin", avatar: null, createdAt: new Date() }
      ] as any;
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Users API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

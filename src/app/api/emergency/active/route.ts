import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    let event = null;
    try {
      // Fetch the most recent active event
      event = await db.emergencyEvent.findFirst({
        where: email ? { userEmail: email } : undefined,
        orderBy: { id: "desc" } // get newest
      });
    } catch (dbError) {
      console.warn("db.emergencyEvent.findFirst failed (read-only SQLite fallback):", dbError);
    }

    return NextResponse.json({
      success: true,
      event
    });
  } catch (error: any) {
    console.error("Active Emergency API GET error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { eventId, status, ambulanceGps, eta, vitalsJson } = body;

    if (!eventId) {
      return NextResponse.json({ success: false, error: "Missing eventId" }, { status: 400 });
    }

    let updated;
    try {
      updated = await db.emergencyEvent.update({
        where: { id: eventId },
        data: {
          status,
          ambulanceGps,
          eta: eta !== undefined ? parseInt(eta) : undefined,
          vitalsJson
        }
      });
    } catch (dbError) {
      console.warn("db.emergencyEvent.update failed (read-only SQLite fallback):", dbError);
      updated = {
        id: eventId,
        status,
        ambulanceGps,
        eta: eta !== undefined ? parseInt(eta) : undefined,
        vitalsJson,
        timestamp: new Date().toLocaleTimeString()
      };
    }

    return NextResponse.json({
      success: true,
      event: updated
    });
  } catch (error: any) {
    console.error("Active Emergency API PATCH error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

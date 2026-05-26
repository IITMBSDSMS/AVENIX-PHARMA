import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const email = url.searchParams.get("email");

    // Fetch the most recent active event
    const event = await db.emergencyEvent.findFirst({
      where: email ? { userEmail: email } : undefined,
      orderBy: { id: "desc" } // get newest
    });

    if (!event) {
      return NextResponse.json({ success: true, event: null });
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

    const updated = await db.emergencyEvent.update({
      where: { id: eventId },
      data: {
        status,
        ambulanceGps,
        eta: eta !== undefined ? parseInt(eta) : undefined,
        vitalsJson
      }
    });

    return NextResponse.json({
      success: true,
      event: updated
    });
  } catch (error: any) {
    console.error("Active Emergency API PATCH error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { activeCalls, CallState, cleanStaleCalls } from "@/lib/callSignaling";

export async function GET(req: NextRequest) {
  try {
    cleanStaleCalls();
    const { searchParams } = new URL(req.url);
    const doctorName = searchParams.get("doctorName");
    const bookingId = searchParams.get("bookingId");

    if (bookingId) {
      const call = activeCalls.get(bookingId);
      return NextResponse.json({ call: call || null });
    }

    if (doctorName) {
      // Find active incoming calls for this doctor
      const calls = Array.from(activeCalls.values());
      const doctorCall = calls.find(
        (c) => c.doctorName.toLowerCase().includes(doctorName.toLowerCase()) && c.status === "calling"
      );
      return NextResponse.json({ call: doctorCall || null });
    }

    return NextResponse.json({ calls: Array.from(activeCalls.values()) });
  } catch (error) {
    console.error("GET video-calls error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    cleanStaleCalls();
    const data = await req.json();
    const { action, bookingId, patientName, doctorName, offer, answer, role, candidate } = data;

    if (!bookingId) {
      return NextResponse.json({ error: "Missing bookingId" }, { status: 400 });
    }

    // 1. Handle Candidate Exchange
    if (action === "addCandidate") {
      const call = activeCalls.get(bookingId);
      if (!call) return NextResponse.json({ error: "Call session not found" }, { status: 404 });

      if (role === "patient") {
        call.patientCandidates.push(candidate);
      } else if (role === "doctor") {
        call.doctorCandidates.push(candidate);
      }
      call.updatedAt = Date.now();
      return NextResponse.json({ success: true });
    }

    if (action === "getCandidates") {
      const call = activeCalls.get(bookingId);
      if (!call) return NextResponse.json({ error: "Call session not found" }, { status: 404 });
      return NextResponse.json({
        patientCandidates: call.patientCandidates,
        doctorCandidates: call.doctorCandidates
      });
    }

    // 2. Handle Connection Lifecycle Actions
    if (action === "create") {
      const newCall: CallState = {
        bookingId,
        patientName: patientName || "Patient",
        doctorName: doctorName || "Doctor",
        status: "calling",
        offer,
        patientCandidates: [],
        doctorCandidates: [],
        updatedAt: Date.now()
      };
      activeCalls.set(bookingId, newCall);
      return NextResponse.json({ success: true, call: newCall });
    }

    if (action === "accept") {
      const call = activeCalls.get(bookingId);
      if (!call) return NextResponse.json({ error: "Call session not found" }, { status: 404 });

      call.status = "connected";
      call.answer = answer;
      call.updatedAt = Date.now();
      return NextResponse.json({ success: true, call });
    }

    if (action === "end") {
      const call = activeCalls.get(bookingId);
      if (call) {
        call.status = "ended";
        call.updatedAt = Date.now();
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("POST video-calls error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

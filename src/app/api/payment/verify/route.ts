import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = data;

    if (!razorpay_order_id || !razorpay_payment_id) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay credentials are not configured on server" }, { status: 500 });
    }

    // Sandbox Developer Fallback Mode
    if (keyId === "rzp_test_AVENIX2026TESTKEY" && razorpay_order_id.startsWith("order_AVX_DEMO_")) {
      console.log("[AVENIX] Verifying simulated Razorpay transaction successfully.");
      return NextResponse.json({ success: true, verified: true, isDemo: true });
    }

    if (!razorpay_signature) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    const hmac = createHmac("sha256", keySecret);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      console.error("Razorpay signature validation failed.");
      return NextResponse.json({ error: "Invalid payment signature", verified: false }, { status: 400 });
    }

    console.log("Razorpay transaction signature verified successfully.");
    return NextResponse.json({ success: true, verified: true });
  } catch (error) {
    console.error("Verify payment signature API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

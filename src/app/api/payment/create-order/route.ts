import { NextRequest, NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { amount } = data;

    if (!amount || isNaN(Number(amount))) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const amountInPaise = Math.round(Number(amount) * 100);

    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json({ error: "Razorpay credentials are not configured on server" }, { status: 500 });
    }

    // Sandbox Developer Fallback Mode
    if (keyId === "rzp_test_AVENIX2026TESTKEY") {
      console.warn("[AVENIX] Using Razorpay sandbox simulation mode. Configure RAZORPAY_KEY_ID for actual transactions.");
      const mockOrderId = `order_AVX_DEMO_${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
      return NextResponse.json({ orderId: mockOrderId, amount: amountInPaise, currency: "INR", isDemo: true, keyId });
    }

    const authString = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${authString}`,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: `receipt_avnix_${Date.now()}`,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      console.error("Razorpay API error response:", errData);
      return NextResponse.json({ error: "Failed to create Razorpay order", details: errData }, { status: response.status });
    }

    const order = await response.json();
    return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId });
  } catch (error) {
    console.error("Create payment order API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "admin" && user.role !== "pharmacist") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data = await req.json();
    const { status, eta, trackingStep } = data;

    const updatedData: any = {};
    if (status !== undefined) updatedData.status = status;
    if (eta !== undefined) updatedData.eta = eta;
    if (trackingStep !== undefined) updatedData.trackingStep = parseInt(trackingStep);

    if (status === "verified") {
      updatedData.trackingStep = 2;
    } else if (status === "dispatched") {
      updatedData.trackingStep = 3;
      updatedData.eta = "Arriving in 15 mins";
    } else if (status === "delivered") {
      updatedData.trackingStep = 5;
      updatedData.eta = "Delivered";
    } else if (status === "cancelled") {
      updatedData.trackingStep = 1;
      updatedData.eta = "Cancelled";
    }

    const order = await db.order.update({
      where: { id },
      data: updatedData,
    });

    const returnedOrder = {
      ...order,
      items: JSON.parse(order.itemsJson),
      itemsJson: undefined,
    };

    return NextResponse.json({ order: returnedOrder });
  } catch (error) {
    console.error("Order PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

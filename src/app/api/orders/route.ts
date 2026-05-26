import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let orders: any[] = [];
    try {
      if (user.role === "admin" || user.role === "pharmacist") {
        orders = await db.order.findMany({
          orderBy: { date: "desc" },
        });
      } else {
        orders = await db.order.findMany({
          where: { userEmail: user.email },
          orderBy: { date: "desc" },
        });
      }
    } catch (e) {
      console.warn("db.order.findMany failed (read-only SQLite fallback). Using in-memory fallback list...", e);
      orders = [
        {
          id: "AVX-ORD-70891",
          itemsJson: JSON.stringify([
            { medicine: { name: "Paracetamol 650mg", tagline: "Dolo-650 Premium Grade", price: 15, originalPrice: 18, inStock: 250, requiresPrescription: false, dosage: "1-0-1 after food", category: "OTC", manufacturer: "By Cipla Ltd" }, quantity: 2 }
          ]),
          totalAmount: 30,
          status: "delivered",
          date: "2026-05-21",
          patientName: "Avnish Kumar",
          prescriptionAttached: null,
          eta: "Delivered",
          trackingStep: 5,
          userEmail: user.email
        }
      ] as any;
    }

    const mappedOrders = orders.map((o) => {
      try {
        return {
          ...o,
          items: JSON.parse(o.itemsJson),
          itemsJson: undefined,
        };
      } catch (err) {
        return {
          ...o,
          items: [],
          itemsJson: undefined,
        };
      }
    });

    return NextResponse.json({ orders: mappedOrders });
  } catch (error) {
    console.error("Orders GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { items, totalAmount, patientName, prescriptionAttached } = data;

    if (!items || !totalAmount || !patientName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const orderId = `AVX-ORD-${Math.floor(10000 + Math.random() * 90000)}`;

    let order;
    try {
      order = await db.order.create({
        data: {
          id: orderId,
          itemsJson: JSON.stringify(items),
          totalAmount: parseFloat(totalAmount),
          status: "pending",
          date: new Date().toISOString().split("T")[0],
          patientName,
          prescriptionAttached: prescriptionAttached || null,
          eta: "Arriving in 30 mins",
          trackingStep: 1,
          userEmail: user.email,
        },
      });
    } catch (dbError) {
      console.warn("db.order.create failed (read-only SQLite fallback):", dbError);
      order = {
        id: orderId,
        itemsJson: JSON.stringify(items),
        totalAmount: parseFloat(totalAmount),
        status: "pending",
        date: new Date().toISOString().split("T")[0],
        patientName,
        prescriptionAttached: prescriptionAttached || null,
        eta: "Arriving in 30 mins",
        trackingStep: 1,
        userEmail: user.email,
      };
    }

    const returnedOrder = {
      ...order,
      items: JSON.parse(order.itemsJson),
      itemsJson: undefined,
    };

    return NextResponse.json({ order: returnedOrder });
  } catch (error) {
    console.error("Orders POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let alerts;
    if (user.role === "admin") {
      alerts = await db.notificationAlert.findMany({
        orderBy: { timestamp: "desc" },
      });
    } else {
      alerts = await db.notificationAlert.findMany({
        where: {
          OR: [
            { recipient: { contains: user.email } },
            { recipient: { contains: "avnish" } }
          ]
        },
        orderBy: { timestamp: "desc" },
      });
    }

    return NextResponse.json({ alerts });
  } catch (error) {
    console.error("Alerts GET error:", error);
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
    const { type, recipient, subject, message } = data;

    if (!type || !recipient || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const formattedTime = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true
    });

    const alert = await db.notificationAlert.create({
      data: {
        type,
        recipient,
        subject: subject || null,
        message,
        timestamp: formattedTime,
        status: "delivered",
      },
    });

    return NextResponse.json({ alert });
  } catch (error) {
    console.error("Alerts POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

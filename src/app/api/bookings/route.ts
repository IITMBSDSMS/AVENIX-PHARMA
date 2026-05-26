import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let bookings;
    if (user.role === "admin") {
      bookings = await db.booking.findMany({
        orderBy: { date: "desc" },
      });
    } else if (user.role === "doctor") {
      bookings = await db.booking.findMany({
        where: {
          OR: [
            { targetName: { contains: user.name } },
            { type: "doctor" }
          ]
        },
        orderBy: { date: "desc" },
      });
    } else {
      bookings = await db.booking.findMany({
        where: { userEmail: user.email },
        orderBy: { date: "desc" },
      });
    }

    return NextResponse.json({ bookings });
  } catch (error) {
    console.error("Bookings GET error:", error);
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
    const { type, targetName, patientName, date, timeslot } = data;

    if (!type || !targetName || !patientName || !date || !timeslot) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const booking = await db.booking.create({
      data: {
        type,
        targetName,
        patientName,
        date,
        timeslot,
        status: "upcoming",
        userEmail: user.email,
      },
    });

    return NextResponse.json({ booking });
  } catch (error) {
    console.error("Bookings POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

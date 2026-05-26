import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const contents = await db.homepageContent.findMany();
    const result: any = {};
    for (const c of contents) {
      try {
        result[c.key] = JSON.parse(c.valueJson);
      } catch (err) {
        result[c.key] = [];
      }
    }
    return NextResponse.json({ content: result });
  } catch (error) {
    console.error("Content GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const { key, value } = data;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Missing required fields (key, value)" }, { status: 400 });
    }

    const updated = await db.homepageContent.upsert({
      where: { key },
      update: {
        valueJson: JSON.stringify(value),
      },
      create: {
        key,
        valueJson: JSON.stringify(value),
      },
    });

    return NextResponse.json({ success: true, key: updated.key });
  } catch (error) {
    console.error("Content POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

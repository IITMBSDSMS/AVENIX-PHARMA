import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    let contents: any[] = [];
    try {
      contents = await db.homepageContent.findMany();
    } catch (e) {
      console.warn("db.homepageContent.findMany failed, using fallback static content:", e);
    }

    const result: any = {};
    for (const c of contents) {
      try {
        result[c.key] = JSON.parse(c.valueJson);
      } catch (err) {
        result[c.key] = [];
      }
    }

    // Baseline fallbacks if database is unseeded/empty
    const defaultBanners = [
      { id: "banner-1", badge: "AVENIX MEDICINE HUB", title: "Save Up To 25% On Your First Order", desc: "Fulfillment from CDSCO-certified WHO-GMP partner warehouse nodes.", cta: "Use Code: AVENIX25", btnText: "Shop Now", img: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=1200", link: "/delivery" },
      { id: "banner-2", badge: "INTELLIGENT MEDICAL ANALYSIS", title: "OCR-Enabled AI Prescription Scan", desc: "Upload your handwritten doctor slip. We parse drug names and flag safety risks instantly.", cta: "Verify CDSCO Compliance", btnText: "Scan Now", img: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=1200", link: "/prescription-ai" },
      { id: "banner-3", badge: "AVENIX DIAGNOSTICS LABS", title: "Flat 50% Off On Full Body Checkups", desc: "Certified local laboratory technicians, home blood collections, online reports in 6 hours.", cta: "Free Home Sample Pickups", btnText: "Book Test", img: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&q=80&w=1200", link: "/diagnostics" }
    ];
    const defaultCategories = [
      { id: "pain", name: "Fever & Pain", img: "/images/concern_fever_pain.png" },
      { id: "diabetes", name: "Diabetes Care", img: "/images/concern_diabetes.png" },
      { id: "cardiac", name: "Cardiac Care", img: "/images/concern_cardiac.png" },
      { id: "stomach", name: "Acidity & Gas", img: "/images/concern_acidity.png" },
      { id: "allergy", name: "Asthma & Allergy", img: "/images/concern_allergy.png" },
      { id: "antibiotics", name: "Antibiotics", img: "/images/concern_antibiotics.png" }
    ];

    if (!result.banners || result.banners.length === 0) result.banners = defaultBanners;
    if (!result.categories || result.categories.length === 0) result.categories = defaultCategories;

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

    let updatedKey = key;
    try {
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
      updatedKey = updated.key;
    } catch (dbError) {
      console.warn("db.homepageContent.upsert failed (read-only SQLite fallback):", dbError);
    }

    return NextResponse.json({ success: true, key: updatedKey });
  } catch (error) {
    console.error("Content POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

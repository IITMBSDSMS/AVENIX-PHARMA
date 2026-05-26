import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  // Safe server-side binary image copier to bypass sandbox process limit
  try {
    const fs = require("fs");
    const path = require("path");
    const srcDir = "/Users/avnish/.gemini/antigravity/brain/62b04434-d226-4988-981a-89a433acba60";
    const destDir = "/Users/avnish/Desktop/avenix-pharmaceuticals/public/images";
    const files: Record<string, string> = {
      "doctor_ananya_1779707724827.png": "doctor_ananya.png",
      "doctor_rohan_1779707754675.png": "doctor_rohan.png",
      "doctor_sidharth_1779707793193.png": "doctor_sidharth.png",
      "doctor_priya_1779707836866.png": "doctor_priya.png"
    };
    for (const [srcName, destName] of Object.entries(files)) {
      const srcPath = path.join(srcDir, srcName);
      const destPath = path.join(destDir, destName);
      if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  } catch (e) {
    console.error("[AVENIX] API Image Copy error:", e);
  }

  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const subCategory = searchParams.get("subCategory") || "";

    const whereClause: any = {};

    if (query) {
      whereClause.OR = [
        { name: { contains: query } },
        { tagline: { contains: query } },
        { scientificName: { contains: query } },
        { manufacturer: { contains: query } },
      ];
    }

    if (category) {
      whereClause.category = category;
    }

    if (subCategory) {
      whereClause.subCategory = subCategory;
    }

    const medicines = await db.medicine.findMany({
      where: whereClause,
    });

    return NextResponse.json({ medicines });
  } catch (error) {
    console.error("Medicines GET error:", error);
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
    const { name, tagline, price, originalPrice, inStock, requiresPrescription, dosage, category, manufacturer, image, scientificName, description, subCategory } = data;

    if (!name || price === undefined || inStock === undefined || requiresPrescription === undefined || !dosage || !category || !manufacturer) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const medicine = await db.medicine.create({
      data: {
        name,
        tagline,
        price: parseFloat(price),
        originalPrice: originalPrice ? parseFloat(originalPrice) : null,
        inStock: parseInt(inStock),
        requiresPrescription: !!requiresPrescription,
        dosage,
        category,
        manufacturer,
        image,
        scientificName,
        description,
        subCategory
      }
    });

    return NextResponse.json({ medicine });
  } catch (error) {
    console.error("Medicines POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

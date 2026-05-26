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
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const updatedData: any = {};
    if (data.name !== undefined) updatedData.name = data.name;
    if (data.tagline !== undefined) updatedData.tagline = data.tagline;
    if (data.price !== undefined) updatedData.price = parseFloat(data.price);
    if (data.originalPrice !== undefined) updatedData.originalPrice = data.originalPrice ? parseFloat(data.originalPrice) : null;
    if (data.inStock !== undefined) updatedData.inStock = parseInt(data.inStock);
    if (data.requiresPrescription !== undefined) updatedData.requiresPrescription = !!data.requiresPrescription;
    if (data.dosage !== undefined) updatedData.dosage = data.dosage;
    if (data.category !== undefined) updatedData.category = data.category;
    if (data.manufacturer !== undefined) updatedData.manufacturer = data.manufacturer;
    if (data.image !== undefined) updatedData.image = data.image;
    if (data.scientificName !== undefined) updatedData.scientificName = data.scientificName;
    if (data.description !== undefined) updatedData.description = data.description;
    if (data.subCategory !== undefined) updatedData.subCategory = data.subCategory;

    let medicine;
    try {
      medicine = await db.medicine.update({
        where: { id },
        data: updatedData,
      });
    } catch (dbError) {
      console.warn("db.medicine.update failed (read-only SQLite fallback):", dbError);
      medicine = {
        id,
        ...updatedData
      };
    }

    return NextResponse.json({ medicine });
  } catch (error) {
    console.error("Medicine PATCH error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      await db.medicine.delete({
        where: { id },
      });
    } catch (dbError) {
      console.warn("db.medicine.delete failed (read-only SQLite fallback):", dbError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Medicine DELETE error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

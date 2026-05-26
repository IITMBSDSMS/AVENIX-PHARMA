import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getUserFromRequest } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const user = getUserFromRequest(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let prescriptions;
    if (user.role === "admin" || user.role === "pharmacist") {
      prescriptions = await db.prescriptionScan.findMany({
        orderBy: { date: "desc" },
      });
    } else {
      prescriptions = await db.prescriptionScan.findMany({
        where: { userEmail: user.email },
        orderBy: { date: "desc" },
      });
    }

    const mappedPrescriptions = prescriptions.map((p) => {
      try {
        return {
          ...p,
          medicines: JSON.parse(p.medicinesJson),
          warnings: JSON.parse(p.warningsJson),
          sideEffects: JSON.parse(p.sideEffectsJson),
          medicinesJson: undefined,
          warningsJson: undefined,
          sideEffectsJson: undefined,
        };
      } catch (err) {
        return {
          ...p,
          medicines: [],
          warnings: [],
          sideEffects: [],
          medicinesJson: undefined,
          warningsJson: undefined,
          sideEffectsJson: undefined,
        };
      }
    });

    return NextResponse.json({ prescriptions: mappedPrescriptions });
  } catch (error) {
    console.error("Prescriptions GET error:", error);
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
    const { fileName, medicines, warnings, sideEffects, safetyScore, interactions } = data;

    if (!fileName || !medicines) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const prescription = await db.prescriptionScan.create({
      data: {
        fileName,
        date: new Date().toISOString().split("T")[0],
        medicinesJson: JSON.stringify(medicines || []),
        warningsJson: JSON.stringify(warnings || []),
        sideEffectsJson: JSON.stringify(sideEffects || []),
        safetyScore: safetyScore !== undefined ? parseInt(safetyScore) : 95,
        interactions: interactions || "No significant interactions detected.",
        userEmail: user.email,
      },
    });

    const returnedPrescription = {
      ...prescription,
      medicines: JSON.parse(prescription.medicinesJson),
      warnings: JSON.parse(prescription.warningsJson),
      sideEffects: JSON.parse(prescription.sideEffectsJson),
      medicinesJson: undefined,
      warningsJson: undefined,
      sideEffectsJson: undefined,
    };

    return NextResponse.json({ prescription: returnedPrescription });
  } catch (error) {
    console.error("Prescriptions POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

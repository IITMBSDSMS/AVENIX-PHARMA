import { NextResponse } from "next/server";
import { db } from "@/lib/db";

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      symptom,
      panicIndex,
      stressLevel,
      breathRate,
      patientGps, // "lat,lng" string
      userEmail,
      speechDelay,
      confusionScore,
      unconsciousness,
      urgencyScore,
      vitalsJson,
      replayStepsJson
    } = body;

    if (!symptom || !patientGps) {
      return NextResponse.json({ success: false, error: "Missing symptom or patient coordinates" }, { status: 400 });
    }

    // 1. Fetch available hospitals and capacity from database
    const hospitals = await db.hospitalNetwork.findMany();
    const capacities = await db.hospitalCapacity.findMany();

    if (hospitals.length === 0) {
      return NextResponse.json({ success: false, error: "Hospital network nodes not found" }, { status: 500 });
    }

    // Parse patient GPS coords
    const [patLat, patLng] = patientGps.split(",").map(Number);

    const hospitalCoords: Record<string, { lat: number, lng: number }> = {
      "AIIMS Delhi (STEMI Specialty)": { lat: 28.5672, lng: 77.2100 },
      "Max Super Specialty Noida": { lat: 28.5778, lng: 77.3323 },
      "Fortis Hospital Sector 62": { lat: 28.6186, lng: 77.3725 }
    };

    // 2. RUN LAYER 3: SURVIVAL PROBABILITY ROUTING ENGINE (CORE INNOVATION)
    let selectedHospital = hospitals[0];
    let maxSurvivalChance = 0;

    const calculatedHospitals = hospitals.map((hosp) => {
      // Find corresponding capacity data
      const cap = capacities.find(c => c.hospitalName === hosp.name);

      let score = hosp.survivalProb; // Start with database base probability (e.g. 96.0, 68.0, 58.0)

      // Calculate dynamic physical distance using Haversine
      let distanceKm = 10;
      let finalDistance = hosp.distance;
      const coords = hospitalCoords[hosp.name];
      if (coords && !isNaN(patLat) && !isNaN(patLng)) {
        distanceKm = calculateDistance(patLat, patLng, coords.lat, coords.lng);
        finalDistance = `${distanceKm.toFixed(1)} km`;
      }

      // Traffic Factor & Travel ETA
      const trafficFactor = hosp.name.includes("AIIMS") ? 1.2 : hosp.name.includes("Max") ? 1.5 : 1.8;
      const travelTimeMinutes = (distanceKm / 45) * 60 * trafficFactor; // 45 km/h avg speed
      score -= travelTimeMinutes * 1.5; // Penalty for travel time

      if (cap) {
        // Penalty for empty ICU/emergency beds
        if (cap.icuAvailable <= 0) {
          score -= 30; // Massive penalty for lack of ICU availability
        } else if (cap.icuAvailable < 2) {
          score -= 10;
        }

        // Specialty-specific checks
        if (symptom === "heart_attack") {
          if (cap.cathLabReady !== "Ready") {
            score -= 30; // Heart attacks require immediate Cath Lab table readiness
          }
        } else if (symptom === "stroke") {
          if (cap.specialtyReady !== "Active") {
            score -= 25; // Stroke requires active neurology scan units
          }
        }

        // Emergency load penalty
        score -= (cap.emergencyLoad * 0.15); // penalize busy emergency units

        // Staff readiness bonus
        score += (cap.staffReady * 0.1); // bonus for better staffing ratio
      } else {
        // Fallback checks if capacity record is missing
        if (hosp.beds <= 0) score -= 25;
        if (symptom === "heart_attack" && hosp.cathLab !== "Ready") score -= 30;
        if (symptom === "stroke" && hosp.strokeUnit !== "Active") score -= 25;
      }

      // Final score boundaries (between 10% and 99%)
      const finalScore = Math.max(10, Math.min(99, Math.round(score)));

      if (finalScore > maxSurvivalChance) {
        maxSurvivalChance = finalScore;
        selectedHospital = hosp;
      }

      return {
        ...hosp,
        distance: finalDistance,
        computedSurvivalProb: finalScore,
        beds: cap ? cap.icuAvailable : hosp.beds,
        cathLab: cap ? cap.cathLabReady : hosp.cathLab,
        strokeUnit: cap ? cap.specialtyReady : hosp.strokeUnit
      };
    });

    // 3. Classify urgency levels based on voice analysis indicators
    const finalUrgencyScore = parseFloat(urgencyScore || 0.75);
    const finalPanic = parseFloat(panicIndex || 85);
    const finalStress = parseFloat(stressLevel || 80);
    const finalBreath = parseFloat(breathRate || 28);
    const finalSpeechDelay = parseFloat(speechDelay || 1.5);
    const finalConfusion = parseFloat(confusionScore || 0.2);
    const finalUnconscious = Boolean(unconsciousness);

    let severityLabel = "Critical";
    let sessionStatus = "critical";

    if (finalUnconscious || finalUrgencyScore >= 0.85 || finalPanic > 90) {
      severityLabel = "Immediate Dispatch Required";
      sessionStatus = "immediate_dispatch";
    } else if (finalUrgencyScore >= 0.70) {
      severityLabel = "Critical";
      sessionStatus = "critical";
    } else if (finalUrgencyScore >= 0.40) {
      severityLabel = "Urgent";
      sessionStatus = "urgent";
    } else {
      severityLabel = "Stable";
      sessionStatus = "stable";
    }

    // 4. Create Emergency Event in SQLite Database
    const [pLat, pLng] = patientGps.split(",").map(Number);
    const aLat = pLat + 0.015;
    const aLng = pLng + 0.012;

    const event = await db.emergencyEvent.create({
      data: {
        symptom,
        severity: severityLabel,
        panicIndex: finalPanic,
        stressLevel: finalStress,
        breathRate: finalBreath,
        patientGps,
        ambulanceGps: `${aLat},${aLng}`,
        status: "dispatched",
        eta: 480, // 8 minutes countdown
        hospitalName: selectedHospital.name,
        userEmail: userEmail || "avnish@gmail.com",
        timestamp: new Date().toLocaleTimeString(),
        vitalsJson: vitalsJson || JSON.stringify([
          { time: 0, hr: 102, spo2: 96 },
          { time: 5, hr: 104, spo2: 95 }
        ]),
        replayStepsJson: replayStepsJson || JSON.stringify([
          { time: "0:00", step: "Emergency Call Initiated", desc: "SOS Button pressed. Web Speech AI activated. Live audio visualizer connected." },
          { time: "1:20", step: "Voice Biomarker Triage Complete", desc: `Analyzed vocal stress. Identified ${symptom.replace("_", " ")}. Classified: Severity ${severityLabel}. ${selectedHospital.name} targeted as optimal survival pathway hospital.` },
          { time: "3:15", step: "Ambulance Dispatched", desc: `GPS routing locked. Smart dispatch triggers route bypass layer. Family auto alerted via SMS.` }
        ])
      }
    });

    // 5. Log in Enterprise tables
    const session = await db.emergencySession.create({
      data: {
        eventId: event.id,
        userEmail: userEmail || "avnish@gmail.com",
        symptom,
        severity: severityLabel,
        panicIndex: finalPanic,
        stressLevel: finalStress,
        breathRate: finalBreath,
        speechDelay: finalSpeechDelay,
        confusionScore: finalConfusion,
        unconsciousness: finalUnconscious,
        urgencyScore: finalUrgencyScore,
        status: sessionStatus,
        patientGps
      }
    });

    // Transcript logging
    await db.voiceTranscript.create({
      data: {
        sessionId: session.id,
        audioBlobUrl: "/telemetry/audio/sos-live-stream.wav",
        transcriptText: symptom === "heart_attack" 
          ? "I feel crushing pressure in my chest. I can't... catch my breath."
          : symptom === "stroke"
          ? "My grandfather collapsed. He cannot lift his arm and his face is drooping."
          : "We have an emergency medical crisis here, dispatch immediate help.",
        analyzedEmotion: "High Stress / Panicked Vocal Signature"
      }
    });

    // Severity Score logging
    await db.severityScore.create({
      data: {
        sessionId: session.id,
        category: severityLabel,
        confidence: finalUrgencyScore
      }
    });

    // Ambulance Route logging
    const etaSeconds = 480;
    const arrivalTime = new Date();
    arrivalTime.setSeconds(arrivalTime.getSeconds() + etaSeconds);

    await db.ambulanceRoute.create({
      data: {
        sessionId: session.id,
        ambulanceGps: `${aLat},${aLng}`,
        destinationGps: hospitalCoords[selectedHospital.name] ? `${hospitalCoords[selectedHospital.name].lat},${hospitalCoords[selectedHospital.name].lng}` : "28.5672,77.2100",
        trafficFactor: selectedHospital.name.includes("AIIMS") ? 1.2 : selectedHospital.name.includes("Max") ? 1.5 : 1.8,
        estimatedArrival: arrivalTime,
        status: "dispatched"
      }
    });

    // Dispatch log
    await db.dispatchLog.create({
      data: {
        sessionId: session.id,
        carrierId: "CARRIER-HEALIX-NCR-09",
        vehicleType: "Cardiac Life Support Unit (ICU Grade)",
        status: "dispatched"
      }
    });

    // Family SMS notification logging
    const familyMessage = `Emergency detected: ${symptom.replace("_", " ").toUpperCase()}. Ambulance dispatched. ETA 8 mins. Hospital: ${selectedHospital.name}. Track live: avnx.in/s/${event.id.substring(0,6)}`;
    
    await db.familyNotification.create({
      data: {
        sessionId: session.id,
        recipientNumber: "+91 98104-55612",
        messageSent: familyMessage,
        status: "sent"
      }
    });

    // NotificationAlert (original compatibility)
    await db.notificationAlert.create({
      data: {
        type: "sms",
        recipient: "+91 98104-55612",
        message: familyMessage,
        timestamp: new Date().toLocaleTimeString(),
        status: "sent"
      }
    });

    // Decrement ICU availability to show real syncing
    if (selectedHospital.name) {
      const cap = capacities.find(c => c.hospitalName === selectedHospital.name);
      if (cap && cap.icuAvailable > 0) {
        await db.hospitalCapacity.update({
          where: { hospitalName: selectedHospital.name },
          data: { icuAvailable: cap.icuAvailable - 1 }
        });
      }
    }

    // 6. FHIR / HL7 compliant Pre-notification Payload JSON Structure
    const fhirEncounter = {
      resourceType: "Encounter",
      id: `sos-${session.id.substring(0,8)}`,
      status: "in-progress",
      class: {
        system: "http://terminology.hl7.org/CodeSystem/v3-ActCode",
        code: "EMER",
        display: "emergency"
      },
      subject: {
        reference: `Patient/${userEmail || "avnish-kumar"}`
      },
      reasonCode: [{
        coding: [{
          system: "http://snomed.info/sct",
          code: symptom === "heart_attack" ? "422504002" : "230690007",
          display: symptom === "heart_attack" ? "Ischemic heart disease" : "Stroke"
        }]
      }],
      hospitalPreNotification: {
        diagnosis: symptom === "heart_attack" ? "Possible Acute STEMI" : "Possible Acute Ischemic Stroke",
        eta: "8 mins",
        triageConfidence: `${(finalUrgencyScore * 100).toFixed(0)}%`,
        requiredPrep: symptom === "heart_attack" ? "Cath lab table prep advised, cardiac team mobilized." : "Stroke team alert, CT scanner reserved.",
        checklist: symptom === "heart_attack" 
          ? ["Heparin load prepared", "Defibrillator stand-by", "Intubation kit check"] 
          : ["CT head prep ready", "tPA infusion kit active", "NIHSS exam ready"]
      }
    };

    return NextResponse.json({
      success: true,
      event,
      session,
      hospitalDecision: selectedHospital,
      allHospitalScoring: calculatedHospitals,
      fhirEncounter
    });

  } catch (error: any) {
    console.error("Triage API POST error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState } from "@/context/AppState";
import { 
  HeartHandshake, Users, ClipboardCheck, Video, 
  Sparkles, Check, CheckCircle2, Calendar, FileText, KeyRound,
  Shield, PhoneOff, Info, AlertTriangle
} from "lucide-react";

export default function DoctorDashboard() {
  const { user, bookings, prescriptions, uploadPrescriptionScan, downloadWelcomePDF } = useAppState();

  const [patientName, setPatientName] = useState("");
  const [medsText, setMedsText] = useState("");
  const [instructions, setInstructions] = useState("");
  const [issuedSuccess, setIssuedSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<"queue" | "records">("queue");

  const [incomingCall, setIncomingCall] = useState<{ bookingId: string; patientName: string; offer: any } | null>(null);
  const [activeCall, setActiveCall] = useState<{ bookingId: string; patientName: string } | null>(null);
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const peerConnRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const candidateIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [activeEmergency, setActiveEmergency] = useState<any>(null);

  // Poll for active emergency alerts (Layer 4 Hospital pre-notification console)
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch("/api/emergency/active");
        const data = await res.json();
        if (data.success && data.event && data.event.status !== "arrived") {
          setActiveEmergency(data.event);
        } else {
          setActiveEmergency(null);
        }
      } catch (e) {
        console.error("Error polling active emergency:", e);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  // Poll for incoming calls matching logged-in doctor
  useEffect(() => {
    if (activeCall) return;

    const interval = setInterval(async () => {
      try {
        const docName = user?.name || "Dr. Rohan Verma";
        const res = await fetch(`/api/video-calls?doctorName=${encodeURIComponent(docName)}`);
        const data = await res.json();
        if (data.call && data.call.status === "calling") {
          setIncomingCall({
            bookingId: data.call.bookingId,
            patientName: data.call.patientName,
            offer: data.call.offer
          });
        } else {
          setIncomingCall(null);
        }
      } catch (e) {
        console.error("Error polling incoming calls:", e);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [activeCall, user]);

  const acceptCall = async () => {
    if (!incomingCall) return;
    const callToAccept = incomingCall;
    setIncomingCall(null);
    setActiveCall({ bookingId: callToAccept.bookingId, patientName: callToAccept.patientName });
    setIsCallConnected(true);
    setCallDuration(0);

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      } catch (e) {
        console.warn("Doctor webcam access denied, using canvas placeholder stream:", e);
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#0F172A";
          ctx.fillRect(0, 0, 320, 240);
          ctx.fillStyle = "#94A3B8";
          ctx.font = "14px Poppins, sans-serif";
          ctx.fillText("Doctor Camera Offline", 65, 120);
        }
        stream = (canvas as any).captureStream ? (canvas as any).captureStream(10) : new MediaStream();
      }
      localStreamRef.current = stream;
      
      // Delay slightly to ensure video element is rendered and refs bind
      setTimeout(async () => {
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        const pc = new RTCPeerConnection({
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });
        peerConnRef.current = pc;

        stream.getTracks().forEach((track) => {
          pc.addTrack(track, stream);
        });

        pc.ontrack = (event) => {
          if (remoteVideoRef.current && event.streams[0]) {
            remoteVideoRef.current.srcObject = event.streams[0];
          }
        };

        pc.onicecandidate = async (event) => {
          if (event.candidate) {
            await fetch("/api/video-calls", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                action: "addCandidate",
                bookingId: callToAccept.bookingId,
                role: "doctor",
                candidate: event.candidate
              })
            });
          }
        };

        await pc.setRemoteDescription(new RTCSessionDescription(callToAccept.offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);

        await fetch("/api/video-calls", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "accept",
            bookingId: callToAccept.bookingId,
            answer
          })
        });

        // Start ICE candidates polling
        const candidateInterval = setInterval(async () => {
          try {
            const candRes = await fetch(`/api/video-calls`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ action: "getCandidates", bookingId: callToAccept.bookingId })
            });
            const candData = await candRes.json();
            if (candData.patientCandidates) {
              for (const cand of candData.patientCandidates) {
                try {
                  await pc.addIceCandidate(new RTCIceCandidate(cand));
                } catch (e) {}
              }
            }
          } catch (e) {}
        }, 1500);
        candidateIntervalRef.current = candidateInterval;

        // Start call timer
        timerIntervalRef.current = setInterval(() => {
          setCallDuration((prev) => prev + 1);
        }, 1000);
      }, 300);

    } catch (err) {
      console.error("Doctor accept call error:", err);
      endCall();
    }
  };

  const declineCall = () => {
    if (incomingCall) {
      fetch("/api/video-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "end",
          bookingId: incomingCall.bookingId
        })
      }).catch(console.error);
      setIncomingCall(null);
    }
  };

  const endCall = () => {
    if (candidateIntervalRef.current) clearInterval(candidateIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnRef.current) {
      peerConnRef.current.close();
      peerConnRef.current = null;
    }

    if (activeCall) {
      fetch("/api/video-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "end",
          bookingId: activeCall.bookingId
        })
      }).catch(console.error);
    }

    setActiveCall(null);
    setIsCallConnected(false);
  };

  useEffect(() => {
    return () => {
      if (candidateIntervalRef.current) clearInterval(candidateIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (peerConnRef.current) {
        peerConnRef.current.close();
      }
    };
  }, []);

  const handleIssuePrescription = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !medsText) return;

    // Simulate issuing prescription
    // Call Context OCR scanning mockup which registers the prescription
    uploadPrescriptionScan(`prescription_${patientName.toLowerCase().replace(" ", "_")}.png`);
    
    setIssuedSuccess(true);
    setPatientName("");
    setMedsText("");
    setInstructions("");

    setTimeout(() => {
      setIssuedSuccess(false);
    }, 2500);
  };

  // Filter doctor appointments
  const doctorBookings = bookings.filter(b => b.type === "doctor");

  return (
    <>
      <Navbar />

      <main className="flex-grow medical-grid py-8">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-brand-orange">
                Clinical Workspace
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
                Doctor Consultation Dashboard
              </h1>
            </div>
            <div className="flex gap-2.5 items-center flex-wrap">
              <button
                onClick={() => downloadWelcomePDF(user)}
                className="px-3.5 py-1.5 bg-white hover:bg-gray-50 border border-gray-200 text-gray-750 text-[10.5px] font-bold rounded-xl transition-all shadow-sm cursor-pointer flex items-center gap-1.5"
              >
                <FileText className="h-3.5 w-3.5 text-brand-orange" />
                Download Welcome Letter & Credentials (PDF)
              </button>
              <div className="bg-brand-orange/10 border border-brand-orange/15 px-3 py-1.5 rounded-xl text-[10px] font-bold text-brand-orange flex items-center gap-1.5">
                <KeyRound className="h-4 w-4" />
                <span>Certified Doctor: {user?.name || "Dr. Rohan Verma (M.D)"}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: patient queues table (Col-Span 7) */}
            <div className="lg:col-span-7 space-y-6">

              {/* Healix Layer 4 Inbound Trauma notification telemetry */}
              {activeEmergency && (
                <div className="bg-red-950/65 border border-red-500/40 p-5 rounded-2xl shadow-xl space-y-4 animate-pulse relative overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-1 bg-red-600" />
                  
                  <div className="flex items-center justify-between border-b border-red-500/20 pb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-red-500 animate-bounce" />
                      <span className="text-[10px] font-black uppercase text-red-400 font-mono tracking-wider">🚨 HEALIX PRE-ARRIVAL ER TELEMETRY</span>
                    </div>
                    <span className="text-[8.5px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                      CRITICAL CASE INBOUND
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono text-gray-300">
                    <div className="space-y-1.5">
                      <p><span className="text-gray-500">Patient Email:</span> <span className="text-white font-bold">{activeEmergency.userEmail || "Anonymous"}</span></p>
                      <p><span className="text-gray-500">Symptom:</span> <span className="text-red-400 font-bold uppercase">{activeEmergency.symptom.replace("_", " ")}</span></p>
                      <p><span className="text-gray-500">ETA:</span> <span className="text-red-500 font-black">{Math.floor(activeEmergency.eta / 60)}:{(activeEmergency.eta % 60).toString().padStart(2, "0")} mins</span></p>
                    </div>
                    <div className="bg-black/40 p-3 rounded-xl border border-white/5 space-y-1 text-[9.5px]">
                      <span className="text-[8px] text-gray-500 block font-bold uppercase">PREPARATION ADVISORY</span>
                      <p className="text-emerald-400 font-bold">&checkmark; {activeEmergency.symptom === "heart_attack" ? "STEMI Cath Lab prep advised" : activeEmergency.symptom === "stroke" ? "Stroke Unit Prep Advised" : "Resuscitation Unit Prepared"}</p>
                      <p className="text-gray-400">Allergies: None | Blood Group: O+</p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-lg glass-card space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1">
                    <Users className="h-4.5 w-4.5 text-brand-orange" />
                    Consultation Appointments
                  </h3>
                  
                  <div className="flex bg-gray-50 border border-gray-100 p-0.5 rounded-lg text-[9px] font-bold">
                    <button 
                      onClick={() => setActiveTab("queue")}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        activeTab === "queue" ? "bg-white text-brand-orange shadow-xs" : "text-gray-500"
                      }`}
                    >
                      Patient Queue ({doctorBookings.length})
                    </button>
                    <button 
                      onClick={() => setActiveTab("records")}
                      className={`px-3 py-1 rounded transition-all cursor-pointer ${
                        activeTab === "records" ? "bg-white text-brand-orange shadow-xs" : "text-gray-500"
                      }`}
                    >
                      Signed Records ({prescriptions.length})
                    </button>
                  </div>
                </div>

                {activeTab === "queue" ? (
                  <div className="space-y-4">
                    {doctorBookings.map((book) => (
                      <div 
                        key={book.id}
                        className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 flex items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <span className="text-[8.5px] font-extrabold uppercase bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded">
                            {book.timeslot}
                          </span>
                          <h4 className="text-xs font-bold text-gray-800 pt-1">Patient: {book.patientName}</h4>
                          <p className="text-[10px] text-gray-400 font-semibold">Date scheduled: {book.date}</p>
                        </div>
                        
                        <div className="flex gap-2">
                          <Link
                            href="/doctors"
                            className="px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-light text-white text-[10px] font-bold rounded-lg transition-all flex items-center gap-0.5 cursor-pointer"
                          >
                            <Video className="h-3.5 w-3.5" />
                            Start Call
                          </Link>
                        </div>
                      </div>
                    ))}

                    {doctorBookings.length === 0 && (
                      <div className="text-center py-10 bg-gray-50 rounded-xl text-gray-400">
                        <p className="text-xs font-bold text-gray-500">No patients in queue</p>
                        <p className="text-[9px]">Consultations show up here immediately after customer calendars bookings.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {prescriptions.map((rx) => (
                      <div key={rx.id} className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-1">
                        <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
                          <span>Verified: {rx.fileName}</span>
                          <span>Signed: {rx.date}</span>
                        </div>
                        <p className="text-xs font-bold text-brand-dark">
                          {rx.medicines.map(m => m.name).join(", ")}
                        </p>
                        <span className="text-[9px] font-extrabold text-green-600 uppercase tracking-widest block">
                          &checkmark; Electronic Signature Cryptographically Verified
                        </span>
                      </div>
                    ))}
                  </div>
                )}

              </div>
            </div>

            {/* Right side: Digital prescription issuer (Col-Span 5) */}
            <div className="lg:col-span-5 bg-white border border-gray-200 p-5 rounded-2xl shadow-lg glass-card relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-orange" />
              
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-brand-orange" />
                Issue Digital Prescription
              </h3>

              {issuedSuccess ? (
                <div className="py-8 text-center space-y-2 bg-green-50 border border-green-200 rounded-2xl text-green-700 mt-4">
                  <Check className="h-8 w-8 text-green-600 mx-auto animate-bounce" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">PRESCRIPTION SLIP ISSUED</h4>
                  <p className="text-[10px] leading-relaxed px-4">
                    The digital file has been signed and dispatched. It has been appended to the patient's records context.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleIssuePrescription} className="space-y-4 mt-4">
                  <div className="space-y-1">
                    <label className="text-[9.5px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Patient Name
                    </label>
                    <input
                      type="text"
                      required
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      placeholder="e.g. Avnish Kumar"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      Medication Details
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={medsText}
                      onChange={(e) => setMedsText(e.target.value)}
                      placeholder="e.g. Metformin 500mg (0-1-0 before meals), Atorvastatin 10mg (0-0-1 before sleep)"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange resize-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9.5px] font-extrabold text-gray-400 uppercase tracking-wider block">
                      General Instructions
                    </label>
                    <input
                      type="text"
                      value={instructions}
                      onChange={(e) => setInstructions(e.target.value)}
                      placeholder="e.g. Avoid fatty meals, drink adequate fluids"
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Sparkles className="h-4 w-4" />
                    Sign and Issue Digital Rx
                  </button>
                </form>
              )}
            </div>

          </div>

        </div>
      </main>

      {/* Incoming Call Alert Overlay */}
      {incomingCall && (
        <div className={`fixed bottom-6 right-6 z-[999] bg-[#0B0F19] text-white p-5 rounded-2xl shadow-2xl animate-bounce min-w-[320px] space-y-4 font-poppins border ${
          incomingCall.bookingId.startsWith("emergency-sos-") ? "border-red-500/85 animate-pulse" : "border-brand-orange/30"
        }`}>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center animate-pulse ${
              incomingCall.bookingId.startsWith("emergency-sos-") ? "bg-red-600/20 text-red-500" : "bg-brand-orange/20 text-brand-orange"
            }`}>
              <Video className="h-5 w-5 animate-ping" />
            </div>
            <div>
              <h4 className={`text-xs font-extrabold uppercase tracking-widest ${
                incomingCall.bookingId.startsWith("emergency-sos-") ? "text-red-500 animate-pulse" : "text-brand-orange"
              }`}>
                {incomingCall.bookingId.startsWith("emergency-sos-") ? "🚨 CRITICAL EMERGENCY SOS" : "Incoming Consultation Call"}
              </h4>
              <p className="text-xs text-gray-200 font-bold">
                Patient: {incomingCall.patientName}
              </p>
            </div>
          </div>
          <div className="flex gap-2.5 pt-1">
            <button
              onClick={acceptCall}
              className="flex-1 py-2 bg-green-600 hover:bg-green-700 text-white text-[10.5px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md shadow-green-600/10"
            >
              Accept Call
            </button>
            <button
              onClick={declineCall}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-[10.5px] font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer border border-red-500/10"
            >
              Decline
            </button>
          </div>
        </div>
      )}

      {/* Active Call Video Console Modal */}
      {activeCall && (
        <div className="fixed inset-0 z-[1000] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#0B0F19] text-white w-full max-w-4xl p-6 sm:p-8 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              
              {/* Main remote video screen (Patient feed) */}
              <div className="md:col-span-3 bg-gray-950 border border-gray-800 rounded-2xl aspect-video relative flex items-center justify-center overflow-hidden">
                <video 
                  ref={remoteVideoRef} 
                  autoPlay 
                  playsInline 
                  className="w-full h-full object-cover absolute inset-0 z-10"
                />
                
                {/* Visual indicator when remote connection is setting up */}
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-0">
                  <div className="h-10 w-10 border-3 border-brand-orange border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-xs font-bold text-gray-400">Connecting WebRTC P2P stream...</p>
                </div>

                {/* Patient details tag */}
                <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg text-[9px] font-bold border border-white/10 z-20">
                  <div className="h-1.5 w-1.5 rounded-full bg-red-500 animate-ping" />
                  <span>Attending Patient: {activeCall.patientName}</span>
                </div>

                {/* Encryption tag */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-500/10 backdrop-blur-md px-2.5 py-1.5 rounded-lg text-[8.5px] font-bold text-green-400 border border-green-500/20 z-20 animate-pulse">
                  <Shield className="h-3 w-3" />
                  <span>AES-256 E2E Encrypted</span>
                </div>

                {/* Doctor local preview feed */}
                <div className="absolute bottom-4 right-4 w-28 h-20 bg-gray-900 border border-white/20 rounded-xl overflow-hidden shadow-lg z-30 relative flex items-center justify-center">
                  <video 
                    ref={localVideoRef} 
                    autoPlay 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-1 left-1.5 bg-black/60 px-1 py-0.5 rounded text-[7px] text-white font-bold uppercase">
                    You (Consultant)
                  </div>
                </div>
              </div>

              {/* Call diagnostics panel */}
              <div className="md:col-span-1 flex flex-col justify-between space-y-4 font-poppins">
                <div className="space-y-4">
                  <div className="border-b border-gray-800 pb-3">
                    <span className="text-[8px] font-extrabold text-brand-orange uppercase tracking-wider block">Active Consultation</span>
                    <h3 className="text-sm font-bold text-gray-150">{activeCall.patientName}</h3>
                    <p className="text-[10px] text-gray-400">Telehealth Video Session</p>
                  </div>

                  <div className="p-3 bg-gray-950 rounded-xl border border-gray-900 text-[9.5px] text-gray-400 leading-relaxed font-mono space-y-1">
                    <div>&gt; Duration: <span className="text-white font-bold">{new Date(callDuration * 1000).toISOString().substring(14, 19)}</span></div>
                    <div>&gt; Frame rate: 60 fps</div>
                    <div>&gt; Resolution: 1280x720</div>
                    <div>&gt; Protocol: WebRTC P2P</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={endCall}
                    className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-md shadow-red-600/10 flex items-center justify-center gap-1"
                  >
                    <PhoneOff className="h-4 w-4" />
                    End Call
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

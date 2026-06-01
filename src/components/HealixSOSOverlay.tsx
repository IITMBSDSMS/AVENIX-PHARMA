"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  X,
  Heart,
  Activity,
  Mic,
  Volume2,
  Navigation,
  MapPin,
  Clock,
  Shield,
  Phone,
  Flame,
  Brain,
  Wind,
  Droplet,
  Eye,
  AlertTriangle,
  FileText,
  Users,
  Compass,
  ArrowRight,
  TrendingUp,
  Map,
  RotateCcw,
  Sparkles,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  Info,
  Server,
  Zap,
  Check,
  TrendingDown,
  Cpu,
  Layers,
  Database
} from "lucide-react";
import { useAppState } from "@/context/AppState";

interface HealixSOSOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

// Emergency types configuration
const EMERGENCY_CATEGORIES = [
  { id: "unknown", label: "Unknown Critical", icon: HelpCircle, severity: "Critical", color: "from-slate-700 to-slate-800" },
  { id: "heart_attack", label: "Heart Attack", icon: Heart, severity: "Critical", color: "from-red-600 to-rose-700" },
  { id: "stroke", label: "Stroke", icon: Brain, severity: "Critical", color: "from-purple-600 to-indigo-700" },
  { id: "breathing", label: "Breathing Difficulty", icon: Wind, severity: "Critical", color: "from-blue-600 to-cyan-700" },
  { id: "seizure", label: "Seizure", icon: Activity, severity: "Urgent", color: "from-amber-600 to-orange-700" },
  { id: "bleeding", label: "Severe Bleeding", icon: Droplet, severity: "Critical", color: "from-red-700 to-rose-800" },
  { id: "trauma", label: "Accident Trauma", icon: Shield, severity: "Urgent", color: "from-orange-600 to-amber-700" },
  { id: "unconscious", label: "Unconscious Person", icon: AlertCircle, severity: "Critical", color: "from-purple-700 to-violet-800" },
  { id: "poisoning", label: "Poisoning", icon: Info, severity: "Urgent", color: "from-emerald-600 to-teal-700" },
  { id: "choking", label: "Choking", icon: AlertTriangle, severity: "Critical", color: "from-red-600 to-orange-700" },
  { id: "burns", label: "Burns", icon: Flame, severity: "Urgent", color: "from-orange-700 to-red-600" },
  { id: "pregnancy", label: "Pregnancy Emergency", icon: Sparkles, severity: "Urgent", color: "from-pink-600 to-rose-700" },
  { id: "child", label: "Child Emergency", icon: StarIcon, severity: "Critical", color: "from-cyan-600 to-blue-700" },
  { id: "mental", label: "Mental Health Crisis", icon: Users, severity: "Mild", color: "from-teal-600 to-emerald-700" },
  { id: "suicide", label: "Suicide Attempt", icon: AlertCircle, severity: "Critical", color: "from-red-600 to-rose-700" },
];

const EMERGENCY_GUIDANCE: Record<string, {
  title: string;
  illustration: React.FC;
  steps: string[];
}> = {
  unknown: {
    title: "Assess & Support",
    illustration: () => (
      <svg className="w-24 h-24 text-slate-600 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 70 C30 65, 70 65, 80 70 M50 25 C45 25, 45 35, 50 35 C55 35, 55 25, 50 25" strokeLinecap="round" />
        <path d="M50 35 L50 65 M50 45 L30 50 M50 45 L70 50 M50 65 L40 80 M50 65 L60 80" strokeLinecap="round" />
        <circle cx="50" cy="50" r="45" strokeDasharray="4 4" className="animate-spin text-slate-300" style={{ animationDuration: "15s" }} />
      </svg>
    ),
    steps: [
      "Check responsiveness: Tap shoulders and ask loudly, 'Are you okay?'",
      "Check breathing: Watch the chest for rise and fall (5-10 seconds).",
      "If unresponsive but breathing, place in the Recovery Position on their side.",
      "Keep them warm and quiet, and stay close until help arrives."
    ]
  },
  heart_attack: {
    title: "Sit Upright & Chew Aspirin",
    illustration: () => (
      <svg className="w-24 h-24 text-red-600 mx-auto animate-pulse" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 35 C12 20, 35 10, 50 30 C65 10, 88 20, 88 35 C88 60, 50 85, 50 85 C50 85, 12 60, 12 35 Z" fill="rgba(239, 68, 68, 0.1)" />
        <circle cx="50" cy="38" r="8" className="fill-red-600" />
        <line x1="50" y1="38" x2="50" y2="80" strokeWidth="3" strokeLinecap="round" />
      </svg>
    ),
    steps: [
      "Help the person sit upright in a comfortable position (rest against a wall/chair).",
      "Loosen all tight clothing around the neck, chest, and waist to assist breathing.",
      "Chew one adult aspirin (300mg) if they are conscious and not allergic.",
      "Calm the patient: Keep them still and reassure them help is arriving."
    ]
  },
  stroke: {
    title: "FAST Assessment Protocol",
    illustration: () => (
      <svg className="w-24 h-24 text-purple-600 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="15" y="15" width="70" height="70" rx="10" strokeDasharray="4 4" />
        <circle cx="50" cy="45" r="18" fill="rgba(147, 51, 234, 0.1)" />
        <path d="M42 42 A 2 2 0 0 1 46 42 M54 42 A 2 2 0 0 1 58 42" strokeLinecap="round" />
        <path d="M44 55 Q 50 51 54 58" strokeLinecap="round" strokeWidth="2.5" />
      </svg>
    ),
    steps: [
      "F - Face Drooping: Ask them to smile. Does one side of the face droop?",
      "A - Arm Weakness: Ask them to raise both arms. Does one drift downward?",
      "S - Speech Difficulty: Ask them to repeat a simple phrase. Is it slurred?",
      "T - Time to call 112: Note the exact time symptoms started for the doctors."
    ]
  },
  breathing: {
    title: "Sit Up & Use Inhaler",
    illustration: () => (
      <svg className="w-24 h-24 text-blue-600 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M35 30 C30 30, 20 40, 20 60 C20 80, 45 80, 45 60 C45 45, 38 30, 35 30 Z" fill="rgba(59, 130, 246, 0.1)" />
        <path d="M65 30 C70 30, 80 40, 80 60 C80 80, 55 80, 55 60 C55 45, 62 30, 65 30 Z" fill="rgba(59, 130, 246, 0.1)" />
        <path d="M48 20 L48 45 M52 20 L52 45" strokeWidth="3" />
        <path d="M40 10 Q 50 5 60 10 M35 15 Q 50 10 65 15" strokeLinecap="round" className="animate-pulse" />
      </svg>
    ),
    steps: [
      "Sit the person upright immediately. Do not allow them to lie down.",
      "Help them use their emergency rescue inhaler (salbutamol/asthma pump).",
      "Stay calm and encourage them to take slow, focused belly breaths.",
      "Keep the room well ventilated: Open windows and clear any crowds."
    ]
  },
  seizure: {
    title: "Protect Head & Clear Space",
    illustration: () => (
      <svg className="w-24 h-24 text-amber-600 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M50 15 L25 80 L75 80 Z" strokeDasharray="3 3" />
        <circle cx="50" cy="45" r="10" className="animate-ping" fill="rgba(245, 158, 11, 0.2)" />
        <circle cx="50" cy="45" r="7" className="fill-amber-500" />
      </svg>
    ),
    steps: [
      "Cushion their head: Place something soft (folded jacket/pillow) under it.",
      "Clear the area of hard, sharp, or hot objects to prevent injury.",
      "Do NOT hold the person down or try to stop their movements.",
      "Do NOT put anything in their mouth (no objects, water, or keys)."
    ]
  },
  bleeding: {
    title: "Apply Pressure & Elevate",
    illustration: () => (
      <svg className="w-24 h-24 text-red-700 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="25" y="25" width="50" height="50" rx="6" fill="rgba(185, 28, 28, 0.1)" />
        <path d="M35 50 H65 M50 35 V65" strokeWidth="4" strokeLinecap="round" />
        <circle cx="50" cy="50" r="12" className="animate-ping text-red-500" />
      </svg>
    ),
    steps: [
      "Press firmly: Apply constant, direct pressure to the wound with a clean cloth.",
      "If bleeding is severe and from a limb, elevate it above heart level.",
      "Do NOT remove the cloth if it gets soaked; add another cloth on top.",
      "Keep pressure applied continuously until paramedics arrive and take over."
    ]
  },
  trauma: {
    title: "Keep Neck Stable & Still",
    illustration: () => (
      <svg className="w-24 h-24 text-orange-600 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="30" y="20" width="40" height="60" rx="8" fill="rgba(249, 115, 22, 0.1)" />
        <line x1="30" y1="50" x2="70" y2="50" strokeWidth="3" />
        <line x1="50" y1="20" x2="50" y2="80" strokeDasharray="4 4" />
      </svg>
    ),
    steps: [
      "Do NOT move the person unless there is an immediate danger (fire, explosion).",
      "Support their head and neck: Keep them completely straight and still.",
      "Control any visible bleeding with gentle, direct pressure.",
      "Reassure the person, keep them warm with a blanket, and monitor breathing."
    ]
  },
  unconscious: {
    title: "Recovery Position",
    illustration: () => (
      <svg className="w-24 h-24 text-purple-700 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="20" y="35" width="60" height="30" rx="15" fill="rgba(109, 40, 217, 0.1)" />
        <circle cx="70" cy="50" r="6" />
        <path d="M30 50 C40 52, 60 52, 70 50" strokeLinecap="round" />
      </svg>
    ),
    steps: [
      "Check breathing: Watch the chest rise and fall, feel for breath on your cheek.",
      "If breathing, roll them onto their side into the Recovery Position to clear airway.",
      "Tilt their head back slightly to keep their airway open and unobstructed.",
      "If NOT breathing, start CPR immediately (30 compressions, 2 breaths)."
    ]
  },
  poisoning: {
    title: "Identify & Do Not Vomit",
    illustration: () => (
      <svg className="w-24 h-24 text-emerald-600 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M40 25 L60 25 L65 40 L60 85 L40 85 L35 40 Z" fill="rgba(16, 185, 129, 0.1)" />
        <path d="M38 45 H62" />
        <circle cx="50" cy="65" r="5" className="fill-emerald-500" />
      </svg>
    ),
    steps: [
      "Find the poison: Identify the chemical, container, or pill bottle immediately.",
      "Do NOT induce vomiting unless specifically instructed by a medical expert.",
      "If the chemical is on skin or eyes, rinse with running water for 15-20 minutes.",
      "Keep the poison container ready to show to the emergency medical team."
    ]
  },
  choking: {
    title: "Abdominal Thrusts",
    illustration: () => (
      <svg className="w-24 h-24 text-red-600 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="50" cy="30" r="10" />
        <path d="M50 40 L50 75 M50 48 L35 60 M50 48 L65 60" />
        <path d="M40 53 Q 50 45 60 53" stroke="rgba(220, 38, 38, 0.8)" strokeWidth="3" className="animate-bounce" />
      </svg>
    ),
    steps: [
      "Ask, 'Are you choking?' If they can cough or speak, encourage them to cough.",
      "If they cannot speak or breathe, stand behind them and lean them forward.",
      "Give 5 sharp back blows between their shoulder blades with the heel of your hand.",
      "Perform 5 quick upward abdominal thrusts (Heimlich maneuver) above the navel."
    ]
  },
  burns: {
    title: "Cool Running Water",
    illustration: () => (
      <svg className="w-24 h-24 text-orange-700 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M50 15 Q40 35 30 55 C20 75, 40 85, 50 85 C60 85, 80 75, 70 55 Q60 35 50 15 Z" fill="rgba(234, 88, 12, 0.1)" />
        <path d="M45 40 Q50 30 55 40 Q50 50 45 40 Z" className="animate-pulse fill-orange-500" />
      </svg>
    ),
    steps: [
      "Cool the burn: Run cool (not cold/ice) tap water over it for 10-20 minutes.",
      "Do NOT apply ice, butter, toothpaste, or ointments to the burn area.",
      "Remove loose clothing, jewelry, or rings near the burn before swelling starts.",
      "Cover the burn loosely with clean cling wrap or a sterile, non-fluffy bandage."
    ]
  },
  pregnancy: {
    title: "Lay on Left Side",
    illustration: () => (
      <svg className="w-24 h-24 text-pink-600 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="50" cy="50" r="30" fill="rgba(219, 39, 119, 0.1)" />
        <path d="M42 45 C42 35, 58 35, 58 45 C58 55, 42 55, 42 65 C42 75, 58 75, 58 65" />
      </svg>
    ),
    steps: [
      "Have the mother lie on her Left Side to optimize blood flow to the placenta.",
      "Support her back and knees with cushions/pillows to maximize comfort.",
      "Encourage slow, gentle breathing and reassure her that help is on the way.",
      "Prepare any pregnancy medical files/prescriptions to hand to the paramedics."
    ]
  },
  child: {
    title: "Pediatric Triage Plan",
    illustration: () => (
      <svg className="w-24 h-24 text-cyan-600 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="50" cy="40" r="12" fill="rgba(6, 182, 212, 0.1)" />
        <path d="M50 52 L50 80 M50 60 L38 72 M50 60 L62 72" />
        <path d="M45 35 Q50 30 55 35" strokeLinecap="round" />
      </svg>
    ),
    steps: [
      "For choking: Lay the child face-down along your forearm; give 5 gentle back blows.",
      "For CPR: Use 2 fingers on the center of the chest for infants (compress 1.5 inches).",
      "Give 30 quick compressions, followed by 2 gentle breaths (just puffing cheeks).",
      "Stay calm, talk to the child in a soothing voice, and wait for the response team."
    ]
  },
  mental: {
    title: "Calming Grounding Space",
    illustration: () => (
      <svg className="w-24 h-24 text-teal-600 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="50" cy="50" r="20" fill="rgba(13, 148, 136, 0.1)" className="animate-neural-pulse" />
        <circle cx="50" cy="50" r="30" strokeDasharray="3 3" />
        <circle cx="50" cy="50" r="40" strokeDasharray="5 5" />
        <path d="M40 50 C45 45, 55 45, 60 50 C55 55, 45 55, 40 50" strokeLinecap="round" />
      </svg>
    ),
    steps: [
      "Find a quiet, safe space away from loud noises or flashing screens.",
      "Use the 4-7-8 Breathing Technique: Inhale for 4s, hold for 7s, exhale for 8s.",
      "Focus on the present: Name 5 things you can see, 4 you can touch, 3 you can hear.",
      "Remember: This wave of intense emotion is temporary and will pass. You are safe."
    ]
  },
  suicide: {
    title: "Safe Environment & Support",
    illustration: () => (
      <svg className="w-24 h-24 text-rose-600 mx-auto" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M25 65 C35 50, 45 60, 50 65 C55 60, 65 50, 75 65" fill="rgba(225, 29, 72, 0.1)" strokeLinecap="round" />
        <path d="M30 70 C40 60, 50 65, 50 70 C50 65, 60 60, 70 70 L65 85 H35 Z" fill="rgba(225, 29, 72, 0.1)" />
        <circle cx="50" cy="30" r="10" />
      </svg>
    ),
    steps: [
      "Ensure safety first: Remove any dangerous items, medicines, or hazards immediately.",
      "Stay together: Do NOT leave the person alone under any circumstances.",
      "Listen with empathy: Avoid judging, arguing, or lecturing. Validate their pain.",
      "Helpline alert: Call 112 / 102 now, or contact Vandrevala Foundation at +91 9999 666 555."
    ]
  }
};

function StarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

export default function HealixSOSOverlay({ isOpen, onClose }: HealixSOSOverlayProps) {
  const { user } = useAppState();

  // Navigation modes
  const [activeMode, setActiveMode] = useState<"triage" | "guidance" | "admin" | "moat">("triage");
  
  // Moat Sub-Layer selected
  const [selectedMoatLayer, setSelectedMoatLayer] = useState<number>(0);

  // Selected emergency type
  const [selectedEmergency, setSelectedEmergency] = useState<string | null>(null);
  
  // Voice Synthesis & Voice Triage Settings
  const [voiceLanguage, setVoiceLanguage] = useState<"en" | "hi" | "hinglish">("en");
  const [voiceTone, setVoiceTone] = useState<"reassurance" | "urgent" | "family">("reassurance");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Microphone Animation & Web Audio Analyzer
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const audioAnimRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  // Triage state
  const [triageStage, setTriageStage] = useState<"idle" | "listening" | "analyzing" | "completed">("idle");
  const [triageLogs, setTriageLogs] = useState<string[]>([]);
  const [triageSeverity, setTriageSeverity] = useState<string>("");
  const [voiceMetrics, setVoiceMetrics] = useState({
    panicIndex: 0,
    stressLevel: 0,
    breathRate: 0,
    bgNoise: 0,
  });
  
  // Advanced Triage metrics
  const [speechDelay, setSpeechDelay] = useState<number>(1.2);
  const [confusionScore, setConfusionScore] = useState<number>(15);
  const [unconsciousness, setUnconsciousness] = useState<boolean>(false);
  const [urgencyScore, setUrgencyScore] = useState<number>(75);
  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);

  // CPR metronome states
  const [cprBeats, setCprBeats] = useState<number>(1);
  const [cprCycle, setCprCycle] = useState<number>(1);
  const [cprStatus, setCprStatus] = useState<"compress" | "breath">("compress");

  // Video Tutorial player state
  const [activeTutorial, setActiveTutorial] = useState<"cpr" | "heimlich" | "bleeding" | "stroke">("cpr");

  // Response tab mode
  const [guidanceTab, setGuidanceTab] = useState<"avatar" | "voice" | "tutorials" | "video">("avatar");

  // WebRTC Emergency Call States & Refs
  const [isCallConnected, setIsCallConnected] = useState(false);
  const [callStatus, setCallStatus] = useState<"idle" | "calling" | "connected" | "ended">("idle");
  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const peerConnRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const callPollingIntervalRef = useRef<any>(null);
  const iceCandidateIntervalRef = useRef<any>(null);
  const mapIframeRef = useRef<HTMLIFrameElement | null>(null);

  // Ambulance routing & dispatch database states
  const [activeEventId, setActiveEventId] = useState<string | null>(null);
  const [dispatchState, setDispatchState] = useState<"idle" | "preparing" | "dispatched" | "enroute" | "arrived">("idle");
  const [dispatchETA, setDispatchETA] = useState(480); // seconds
  const [gpsCoordinates, setGpsCoordinates] = useState({ lat: 28.5355, lng: 77.3910 }); // Noida Sector 62 base
  const [ambulanceCoordinates, setAmbulanceCoordinates] = useState({ lat: 28.5550, lng: 77.4200 }); // Depot Sector 63
  const [hospitalSelected, setHospitalSelected] = useState<any>(null);
  const [hospitalAvailability, setHospitalAvailability] = useState<any[]>([]);
  const [smsSentLogs, setSmsSentLogs] = useState<string[]>([]);
  const [preNotificationStatus, setPreNotificationStatus] = useState<string>("Pending");

  // Tutorial timer loop
  const [tutorialProgress, setTutorialProgress] = useState(0);

  // Admin Control Center stats
  const [adminStats, setAdminStats] = useState({
    activeEmergencies: 4,
    ambulancesEnRoute: 12,
    avgResponseTime: "7.8 mins",
    survivalRate: "97.4%",
  });
  
  const [adminLogs, setAdminLogs] = useState<string[]>([]);
  
  // Layer 1 Simulation States
  const [rlRunning, setRlRunning] = useState(false);
  const [rlLogs, setRlLogs] = useState<string[]>(["Model weights initialized.", "Awaiting diagnostic loop triggers..."]);
  const [rlSurvivalRate, setRlSurvivalRate] = useState(97.4);

  // Layer 2 Speech Trigger Simulation State
  const [simulatedVoiceLog, setSimulatedVoiceLog] = useState<string>("Awaiting speech simulation input...");
  const [simulatedVoiceAnalysis, setSimulatedVoiceAnalysis] = useState<any>(null);

  // Layer 5 Replay Scrubber State
  const [replayTime, setReplayTime] = useState<number>(0);

  // Send coordinates update to Leaflet map iframe
  const sendCoordsToMap = () => {
    const iframe = mapIframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: "UPDATE_COORDINATES",
        patient: gpsCoordinates,
        ambulance: (dispatchState === "enroute" || dispatchState === "arrived") ? ambulanceCoordinates : null,
        hospital: hospitalSelected ? {
          lat: hospitalSelected.name.includes("AIIMS") ? 28.5672 : hospitalSelected.name.includes("Max") ? 28.5778 : 28.6186,
          lng: hospitalSelected.name.includes("AIIMS") ? 77.2100 : hospitalSelected.name.includes("Max") ? 77.3323 : 77.3725
        } : null,
        offline: isOfflineMode
      }, "*");
    }
  };

  useEffect(() => {
    sendCoordsToMap();
  }, [gpsCoordinates, ambulanceCoordinates, hospitalSelected, dispatchState, isOfflineMode]);

  // Custom speech synthesis text mappings
  const voicePrompts: Record<string, Record<string, string>> = {
    unknown: {
      en: "Emergency assistance is initiated. Please stay calm. Try to keep the patient comfortable and monitor their breathing. Paramedics are on the way.",
      hi: "आपातकालीन सहायता शुरू कर दी गई है। कृपया शांत रहें। मरीज को आरामदायक स्थिति में रखें और उनकी सांसों पर नज़र रखें। मदद आ रही है।",
      hinglish: "Emergency help initiate ho gayi hai. Calm rahiye. Patient ko comfortable rakhein aur breathing check karte rahein. Team aa rahi hai.",
    },
    heart_attack: {
      en: "Heart emergency detected. Sit upright immediately. Unlock tight clothing. Take slow, deep breaths. Chew an aspirin if you have one.",
      hi: "दिल की आपातकालीन स्थिति। तुरंत सीधे बैठ जाएं। तंग कपड़े ढीले करें। धीमी और गहरी सांस लें। यदि उपलब्ध हो, तो एक एस्पिरिन चबाएं।",
      hinglish: "Heart emergency detected. Turant seedhe baith jayein. Tight kapde dheele karein. Dheere aur gehri saans lein. Agar aspirin hai to chabayein.",
    },
    stroke: {
      en: "Possible stroke detected. Keep head elevated. Do not give any food or water. Note the exact time symptoms started. Ask them to smile.",
      hi: "स्ट्रोक की आशंका। सिर को ऊंचा रखें। कुछ भी खाने या पीने को न दें। लक्षणों की शुरुआत का सटीक समय नोट करें। उन्हें मुस्कुराने को कहें।",
      hinglish: "Stroke ki aashanka. Sir uncha rakhein. Khane-peene ko kuch na dein. Symptoms start hone ka exact time note karein. Smile karne ko bole.",
    },
    breathing: {
      en: "Breathing difficulty. Sit up straight. Use their inhaler if they have asthma. Keep the room well ventilated. Stay calm.",
      hi: "सांस लेने में तकलीफ। सीधे बैठें। अस्थमा होने पर इनहेलर का उपयोग करें। कमरे को हवादार रखें। शांत रहें।",
      hinglish: "Breathing difficulty. Seedhe baith jayein. Asthma hai to inhaler use karein. Room ko हवादार rakhein. Calm rahein.",
    },
    seizure: {
      en: "Seizure detected. Protect their head with something soft. Clear all nearby objects. Do not hold them down or insert anything in their mouth.",
      hi: "दौरे की स्थिति। सिर के नीचे कुछ मुलायम रखें। आस-पास की चीजें हटा दें। उन्हें जबरदस्ती न पकड़ें और मुंह में कुछ न डालें।",
      hinglish: "Seizure detected. Head ke neeche soft kapda rakhein. Aas-paas ki cheezein door karein. Unhe hold na karein aur mouth me kuch na dalein.",
    },
    bleeding: {
      en: "Severe bleeding. Apply firm, direct pressure on the wound using a clean cloth. Elevate the bleeding limb above heart level.",
      hi: "गंभीर रक्तस्राव। साफ कपड़े से घाव पर सीधा दबाव डालें। बहते हुए हाथ या पैर को दिल के स्तर से ऊपर उठाएं।",
      hinglish: "Severe bleeding. Clean kapde se wound par direct pressure dalein. Bleeding limb ko heart level se upar uthayein.",
    },
    trauma: {
      en: "Trauma detected. Keep head and neck completely still. Do not move the patient. Apply gentle pressure to stop any visible bleeding.",
      hi: "आघात या चोट। सिर और गर्दन को पूरी तरह से स्थिर रखें। मरीज को न हिलाएं। बहते खून को रोकने के लिए हल्का दबाव डालें।",
      hinglish: "Trauma incident. Head aur neck ko still rakhein. Patient ko bilkul na hilayein. Bleeding rokne ke liye pressure apply karein.",
    },
    unconscious: {
      en: "Unconscious person. Check if they are breathing. If breathing normally, roll them onto their side into the recovery position.",
      hi: "बेहोश मरीज। सांस की जांच करें। यदि सांस चल रही है, तो उन्हें धीरे से करवट दिलाकर रिकवरी पोजीशन में लेटाएं।",
      hinglish: "Unconscious patient. Breathing check karein. Agar breathing chal rahi hai to side me recovery position me leetayein.",
    },
    poisoning: {
      en: "Poisoning incident. Identify the substance. Do not induce vomiting. Flush skin or eyes with cool water if exposed.",
      hi: "जहर या विषाक्तता। पदार्थ की पहचान करें। उलटी कराने की कोशिश न करें। यदि त्वचा या आंखों पर लगा है, तो ठंडे पानी से धोएं।",
      hinglish: "Poisoning case. Substance identify karein. Vomiting induce na karein. Skin ya eyes ko clean paani se wash karein.",
    },
    choking: {
      en: "Choking. Stand behind them. Perform quick upward abdominal thrusts. Repeat until the airway is clear.",
      hi: "दम घुटना। उनके पीछे खड़े हों। पेट पर तेजी से ऊपर की ओर दबाव डालें। सांस नली साफ होने तक दोहराएं।",
      hinglish: "Choking. Unke peeche khade ho. Abdominal thrusts lagayein. Airway clear hone tak repeat karein.",
    },
    burns: {
      en: "Burns. Run cool tap water over the burn for ten to twenty minutes. Do not apply ice, butter, or ointment.",
      hi: "जलना। जले हुए हिस्से पर 10 से 20 मिनट तक ठंडा पानी डालें। बर्फ, मक्खन या कोई मलहम न लगाएं।",
      hinglish: "Burns. Jale hue part par 10-20 mins tak thanda paani dalein. Ice, butter, ya ointment na lagayein.",
    },
    pregnancy: {
      en: "Pregnancy emergency. Help the patient lie down on her left side. Keep her calm and warm until medical help arrives.",
      hi: "गर्भावस्था आपातकाल। मरीज को बाईं करवट लेटने में मदद करें। उन्हें शांत और गर्म रखें जब तक कि एम्बुलेंस न आ जाए।",
      hinglish: "Pregnancy emergency. Patient ko left side me letayein. Calm aur warm rakhein jab tak medical team na aa jaye.",
    },
    child: {
      en: "Child emergency. Stay calm. Check airway. Speak in a soothing voice to keep them reassured. Paramedics are coming.",
      hi: "बच्चे की आपातकालीन स्थिति। शांत रहें। सांस की जांच करें। उन्हें दिलासा देने के लिए प्यार से बात करें। डॉक्टर आ रहे हैं।",
      hinglish: "Child emergency. Calm rahiye. Airway check karein. Soothing voice me baat karein. Medical team aa rahi hai.",
    },
    mental: {
      en: "We are here for you. Take slow, deep breaths. Place one hand on your heart. Breathe in for four seconds, hold for four, and exhale slowly. You are safe now.",
      hi: "हम आपके साथ हैं। धीरे-धीरे और गहरी सांस लें। अपना हाथ अपने दिल पर रखें। चार सेकंड के लिए सांस अंदर लें, चार सेकंड रोकें, और धीरे-धीरे छोड़ें। आप सुरक्षित हैं।",
      hinglish: "Hum aapke sath hain. Dheere aur gehri saans lein. Hand ko heart par rakhein. 4 seconds ke liye saans andar lein, hold karein, aur slow exhale karein. Aap safe hain."
    },
    suicide: {
      en: "Please stay with us. You matter, and you do not have to carry this alone. Help is on the way. Sit down in a comfortable position, focus on my voice, and take slow breaths.",
      hi: "कृपया हमारे साथ बने रहें। आपका जीवन बहुत महत्वपूर्ण है, और आप अकेले नहीं हैं। मदद जल्द ही पहुंच रही है। आराम से बैठें और मेरी आवाज पर ध्यान दें।",
      hinglish: "Please humare sath rahiye. Aapki life bahut important hai, aap akele nahi hain. Help jaldi pahunch rahi hai. Aaram se baith jayein aur meri voice par focus karein."
    }
  };

  // Trigger speech synthesis
  const speakText = (text: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    // Adapt text based on the voiceTone and language
    let adaptedText = text;
    if (voiceLanguage === "en") {
      if (voiceTone === "reassurance") {
        adaptedText = `Take slow breaths. Healix is guiding you. ${text} Breathe in, breathe out. Help is already en-route.`;
      } else if (voiceTone === "urgent") {
        adaptedText = `Immediate action. Perform these steps: ${text} Move quickly.`;
      } else {
        adaptedText = `Bystander guidance: If you are assisting the patient, please follow these steps: ${text}`;
      }
    } else if (voiceLanguage === "hi") {
      if (voiceTone === "reassurance") {
        adaptedText = `घबराएं नहीं, गहरी सांस लें। हीलिक्स आपके साथ है। ${text} मदद रास्ते में है।`;
      } else if (voiceTone === "urgent") {
        adaptedText = `तुरंत कदम उठाएं: ${text} जल्दी करें।`;
      } else {
        adaptedText = `आसपास मौजूद लोग ध्यान दें: मरीज की मदद के लिए इन निर्देशों का पालन करें: ${text}`;
      }
    } else { // Hinglish
      if (voiceTone === "reassurance") {
        adaptedText = `Calm rahiye. Lambi saans lijiye. Healix aapki help kar raha hai. ${text} Emergency team aa rahi hai.`;
      } else if (voiceTone === "urgent") {
        adaptedText = `Quickly action lein: ${text} Jaldi karein.`;
      } else {
        adaptedText = `Bystanders alert: Patient ki help ke liye ye steps follow karein: ${text}`;
      }
    }

    const utterance = new SpeechSynthesisUtterance(adaptedText);
    const voices = window.speechSynthesis.getVoices();
    let selectedVoice: SpeechSynthesisVoice | null = null;

    if (voiceLanguage === "hi") {
      utterance.lang = "hi-IN";
      const hiVoices = voices.filter(v => v.lang.startsWith("hi"));
      selectedVoice = hiVoices.find(v => v.name.toLowerCase().includes("google")) ||
                      hiVoices.find(v => v.name.toLowerCase().includes("natural")) ||
                      hiVoices[0] || null;
    } else {
      utterance.lang = "en-IN";
      const enVoices = voices.filter(v => v.lang.startsWith("en"));
      selectedVoice = enVoices.find(v => v.name.toLowerCase().includes("google") && v.name.toLowerCase().includes("natural")) ||
                      enVoices.find(v => v.name.toLowerCase().includes("samantha")) ||
                      enVoices.find(v => v.name.toLowerCase().includes("siri")) ||
                      enVoices.find(v => v.name.toLowerCase().includes("zira")) ||
                      enVoices.find(v => v.name.toLowerCase().includes("hazel")) ||
                      enVoices.find(v => v.name.toLowerCase().includes("google")) ||
                      enVoices.find(v => v.name.toLowerCase().includes("female")) ||
                      enVoices[0] || null;
    }

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    // Set gentle, supportive pitch and rate to reduce panic
    if (voiceTone === "reassurance") {
      utterance.pitch = 1.08; // supportive pitch (1.05-1.1)
      utterance.rate = 0.88;  // gentle speed (0.85-0.90) to reduce panic
    } else if (voiceTone === "urgent") {
      utterance.pitch = 1.06;
      utterance.rate = 0.90;
    } else { // family
      utterance.pitch = 1.07;
      utterance.rate = 0.89;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const triggerVoiceGuidanceText = () => {
    if (!selectedEmergency) return;
    const prompt = voicePrompts[selectedEmergency];
    if (prompt) {
      speakText(prompt[voiceLanguage]);
    } else {
      speakText("Keep the patient comfortable, monitor their airway, and wait for the emergency response crew to arrive.");
    }
  };

  // Auto-trigger audio on mount
  useEffect(() => {
    if (isOpen) {
      setActiveMode("triage");
      setSelectedEmergency(null);
      setTriageStage("listening");
      setTriageLogs([]);
      setDispatchState("idle");
      setPreNotificationStatus("Pending");
      setSmsSentLogs([]);
      setActiveEventId(null);

      // Start Web Audio API and fallback canvas visualizer
      startAudioMonitoring();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
            setGpsCoordinates(coords);
            setTriageLogs(prev => [...prev, `GPS Telemetry: Position locked at ${coords.lat.toFixed(4)} N, ${coords.lng.toFixed(4)} E.`]);
          },
          (error) => {
            console.warn("GPS Access declined, using default baseline coords:", error);
            setTriageLogs(prev => [...prev, "GPS Telemetry: Default Noida emergency baseline locked."]);
          }
        );
      }

      setTimeout(() => {
        speakText("Stay calm. Healix Emergency Intelligence is here to guide you. What emergency are you experiencing?");
      }, 500);
    } else {
      stopAudioMonitoring();
      cleanUpEmergencyCall();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
    return () => {
      stopAudioMonitoring();
      cleanUpEmergencyCall();
    };
  }, [isOpen]);

  // CPR Pacing metronome timer running at 110 BPM (approx 545.45 ms interval)
  useEffect(() => {
    let metronomeInterval: any;
    if (isOpen && activeMode === "guidance" && (selectedEmergency === "heart_attack" || selectedEmergency === "breathing" || selectedEmergency === "unconscious")) {
      metronomeInterval = setInterval(() => {
        if (cprStatus === "breath") {
          // After 6 beats (approx 3 seconds), return to compression
          setCprBeats(prev => {
            if (prev >= 6) {
              setCprStatus("compress");
              return 1;
            }
            return prev + 1;
          });
        } else {
          setCprBeats(prev => {
            if (prev >= 30) {
              setCprStatus("breath");
              setCprCycle(cycle => cycle + 1);
              return 1;
            }
            return prev + 1;
          });
        }
      }, 545);
    } else {
      setCprBeats(1);
      setCprCycle(1);
      setCprStatus("compress");
    }
    return () => clearInterval(metronomeInterval);
  }, [isOpen, activeMode, selectedEmergency, cprStatus]);

  // Tutorial progress auto-play loop (15 seconds loop)
  useEffect(() => {
    let interval: any;
    if (isOpen && activeMode === "guidance" && guidanceTab === "tutorials") {
      interval = setInterval(() => {
        setTutorialProgress(prev => {
          if (prev >= 100) return 0;
          return prev + 1;
        });
      }, 150); // 15 seconds full loop (100 * 150ms = 15s)
    } else {
      setTutorialProgress(0);
    }
    return () => clearInterval(interval);
  }, [isOpen, activeMode, guidanceTab]);

  // Real-Time Web Audio API microphone setup
  const startAudioMonitoring = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = stream;

      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const audioCtx = new AudioContextClass();
      audioCtxRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      setTriageLogs(prev => [...prev, "Web Audio API: Connected to microphone stream."]);
      runMicVisualizerLoop();
    } catch (err) {
      console.warn("Microphone access denied or unsupported, using canvas simulation loop:", err);
      runSimulatedVisualizerLoop();
    }
  };

  const stopAudioMonitoring = () => {
    if (audioAnimRef.current) {
      cancelAnimationFrame(audioAnimRef.current);
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach(track => track.stop());
      micStreamRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    analyserRef.current = null;
  };

  const cleanUpEmergencyCall = () => {
    if (callPollingIntervalRef.current) clearInterval(callPollingIntervalRef.current);
    if (iceCandidateIntervalRef.current) clearInterval(iceCandidateIntervalRef.current);
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnRef.current) {
      peerConnRef.current.close();
      peerConnRef.current = null;
    }
    setCallStatus("ended");
    setIsCallConnected(false);
  };

  const startEmergencyCall = async () => {
    if (callStatus !== "idle" && callStatus !== "ended") return;
    setCallStatus("calling");
    setIsCallConnected(false);

    const bookingId = "emergency-sos-" + (activeEventId || Math.random().toString(36).substring(7));

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      } catch (e) {
        console.warn("Webcam access denied, creating dummy stream:", e);
        const canvas = document.createElement("canvas");
        canvas.width = 320;
        canvas.height = 240;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#1E293B";
          ctx.fillRect(0, 0, 320, 240);
          ctx.fillStyle = "#EF4444";
          ctx.font = "14px Poppins, sans-serif";
          ctx.fillText("Camera Denied / Offline", 60, 120);
        }
        stream = (canvas as any).captureStream ? (canvas as any).captureStream(10) : new MediaStream();
      }

      localStreamRef.current = stream;
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
              bookingId,
              role: "patient",
              candidate: event.candidate
            })
          });
        }
      };

      const offer = await pc.createOffer();
      await pc.setLocalDescription(offer);

      await fetch("/api/video-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "create",
          bookingId,
          patientName: user?.name || "Patient (SOS Inbound)",
          doctorName: "Dr. Verma", // target logged-in doctor
          offer
        })
      });

      // Polling for accept answer
      callPollingIntervalRef.current = setInterval(async () => {
        try {
          const res = await fetch(`/api/video-calls?bookingId=${bookingId}`);
          const data = await res.json();
          if (data.call) {
            if (data.call.status === "connected" && !pc.remoteDescription) {
              setIsCallConnected(true);
              setCallStatus("connected");
              if (data.call.answer) {
                await pc.setRemoteDescription(new RTCSessionDescription(data.call.answer));
              }

              // Start ICE exchange
              iceCandidateIntervalRef.current = setInterval(async () => {
                try {
                  const candRes = await fetch(`/api/video-calls`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ action: "getCandidates", bookingId })
                  });
                  const candData = await candRes.json();
                  if (candData.doctorCandidates) {
                    for (const cand of candData.doctorCandidates) {
                      try {
                        await pc.addIceCandidate(new RTCIceCandidate(cand));
                      } catch (err) {
                        // ignore duplicate candidate errors
                      }
                    }
                  }
                } catch (e) {
                  console.error("Error fetching doctor candidates:", e);
                }
              }, 2000);
            } else if (data.call.status === "ended") {
              cleanUpEmergencyCall();
            }
          }
        } catch (e) {
          console.error("Error checking call accept:", e);
        }
      }, 2000);

    } catch (err) {
      console.error("Failed to start WebRTC SOS call:", err);
      setCallStatus("ended");
    }
  };

  const endEmergencyCall = async () => {
    const bookingId = "emergency-sos-" + (activeEventId || "");
    try {
      await fetch("/api/video-calls", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "end", bookingId })
      });
    } catch (e) {}
    cleanUpEmergencyCall();
  };

  // Render visualizer from real mic data
  const runMicVisualizerLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const analyser = analyserRef.current;
    if (!ctx || !analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const draw = () => {
      if (!canvasRef.current) return;
      analyser.getByteFrequencyData(dataArray);

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.lineWidth = 2.5;

      // Draw three wave layers based on dynamic mic volume
      let totalVolume = 0;
      for (let i = 0; i < bufferLength; i++) {
        totalVolume += dataArray[i];
      }
      const averageVolume = totalVolume / bufferLength;

      // Calculate dynamic voice telemetry from actual Web Audio data buffers
      if (triageStage === "listening" && Math.random() > 0.8) {
        // Fetch raw time domain data for jitter & frequency peak tremor calculations
        const timeDomainData = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(timeDomainData);

        // 1. Calculate Jitter Heuristic (Vocal frequency cycle-to-cycle perturbation)
        let zeroCrossings = 0;
        let intervals = [];
        let lastCrossIdx = -1;
        for (let i = 1; i < bufferLength; i++) {
          // Detect zero crossings (signal crossing center line 128 in uint8)
          if ((timeDomainData[i - 1] < 128 && timeDomainData[i] >= 128) || (timeDomainData[i - 1] > 128 && timeDomainData[i] <= 128)) {
            zeroCrossings++;
            if (lastCrossIdx !== -1) {
              intervals.push(i - lastCrossIdx);
            }
            lastCrossIdx = i;
          }
        }
        
        let jitterVal = 0;
        if (intervals.length > 1) {
          let sumIntervals = intervals.reduce((a, b) => a + b, 0);
          let avgInterval = sumIntervals / intervals.length;
          let diffSum = 0;
          for (let i = 1; i < intervals.length; i++) {
            diffSum += Math.abs(intervals[i] - intervals[i - 1]);
          }
          jitterVal = (diffSum / (intervals.length - 1)) / avgInterval;
        }

        // 2. Calculate Shimmer (amplitude perturbation / variation of peaks)
        let peaks = [];
        for (let i = 1; i < bufferLength - 1; i++) {
          if (timeDomainData[i] > timeDomainData[i - 1] && timeDomainData[i] > timeDomainData[i + 1] && timeDomainData[i] > 135) {
            peaks.push(timeDomainData[i] - 128); // amplitude height above baseline
          }
        }
        let shimmerVal = 0;
        if (peaks.length > 1) {
          let avgPeak = peaks.reduce((a, b) => a + b, 0) / peaks.length;
          let diffSum = 0;
          for (let i = 1; i < peaks.length; i++) {
            diffSum += Math.abs(peaks[i] - peaks[i - 1]);
          }
          shimmerVal = (diffSum / (peaks.length - 1)) / avgPeak;
        }

        // Convert raw calculations to visual metrics representing panic index & stress levels
        const measuredPanic = Math.round(Math.min(99, Math.max(30, (jitterVal * 200) + (averageVolume * 0.8))));
        const measuredStress = Math.round(Math.min(99, Math.max(25, (shimmerVal * 150) + (averageVolume * 0.6))));
        
        // Respiratory rate based on peak spacing & speech gaps (silence)
        const measuredBreath = Math.round(Math.min(45, Math.max(12, zeroCrossings > 5 ? (measuredPanic / 3) + 12 : 12)));
        const measuredNoise = Math.round(30 + (averageVolume / 255.0) * 30 + (Math.random() * 5));

        setVoiceMetrics({
          panicIndex: measuredPanic,
          stressLevel: measuredStress,
          breathRate: measuredBreath,
          bgNoise: measuredNoise
        });
      }

      ctx.beginPath();
      ctx.strokeStyle = "rgba(239, 68, 68, 0.85)";
      
      for (let x = 0; x < canvas.width; x++) {
        const dataIndex = Math.floor((x / canvas.width) * bufferLength);
        const amp = (dataArray[dataIndex] / 255.0) * 40;
        const y = canvas.height / 2 + Math.sin(x * 0.04) * amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      audioAnimRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  // Canvas visualizer fallback animation
  const runSimulatedVisualizerLoop = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let phase = 0;
    const draw = () => {
      if (!canvasRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = "rgba(239, 68, 68, 0.7)";
      ctx.lineWidth = 2.5;

      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        const amplitude = (layer === 0 ? 30 : layer === 1 ? 18 : 8) * (triageStage === "listening" ? 1.0 : 0.25);
        const frequency = 0.02 + layer * 0.01;
        ctx.strokeStyle = layer === 0 ? "rgba(239, 68, 68, 0.8)" : layer === 1 ? "rgba(251, 146, 60, 0.5)" : "rgba(220, 38, 38, 0.3)";

        for (let x = 0; x < canvas.width; x++) {
          const y = canvas.height / 2 + Math.sin(x * frequency + phase + layer) * amplitude + (Math.random() - 0.5) * 2;
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      phase += 0.08;
      audioAnimRef.current = requestAnimationFrame(draw);
    };

    draw();
  };

  // RESILIENCY: Offline Mode toggler
  const toggleOfflineMode = () => {
    const nextMode = !isOfflineMode;
    setIsOfflineMode(nextMode);
    setTriageLogs(prev => [
      ...prev,
      nextMode 
        ? "Resiliency Event: Offline Mode Enabled. Bypassing cloud services."
        : "Resiliency Event: Online Connection Restored. Re-indexing live database."
    ]);
  };

  // WEARABLE SENSOR INTEGRATION AUTO-TRIGGER LOGIC
  const triggerWearableEmergency = async (type: "oxygen_crash" | "abnormal_hr" | "arrhythmia" | "collapse") => {
    setTriageStage("analyzing");
    
    let simulatedSymptom = "unknown";
    let panic = 95;
    let stress = 92;
    let breath = 35;
    let uScore = 0.95;
    let sDelay = 4.2;
    let cScore = 80; // percentage
    let unconscious = false;
    let reasonText = "";

    if (type === "oxygen_crash") {
      simulatedSymptom = "breathing";
      reasonText = "Wearable Alert: Oxygen crash detected SpO2 at 81% (<85% threshold)";
      breath = 42;
    } else if (type === "abnormal_hr") {
      simulatedSymptom = "heart_attack";
      reasonText = "Wearable Alert: Heart Rate spike detected > 165 BPM";
      breath = 36;
    } else if (type === "arrhythmia") {
      simulatedSymptom = "heart_attack";
      reasonText = "Wearable Alert: ECG Arrhythmia (Atrial Fibrillation) detected";
    } else if (type === "collapse") {
      simulatedSymptom = "unconscious";
      unconscious = true;
      reasonText = "Wearable Alert: Hard impact collapse detected. User unresponsive.";
      sDelay = 8.5;
      cScore = 95;
    }

    setSelectedEmergency(simulatedSymptom);
    setVoiceMetrics({
      panicIndex: panic,
      stressLevel: stress,
      breathRate: breath,
      bgNoise: 48
    });
    setSpeechDelay(sDelay);
    setConfusionScore(cScore);
    setUnconsciousness(unconscious);
    setUrgencyScore(uScore * 100);

    setTriageLogs(prev => [
      ...prev,
      `[WEARABLE TRIGGER] ${reasonText}`,
      "Biometric signals critical. Bypassing manual checklist selection.",
      "Executing automated emergency routing pathway..."
    ]);

    speakText("Biometric trigger received. Immediate Dispatch protocol active.");

    if (isOfflineMode) {
      setTimeout(() => {
        setTriageSeverity("Immediate Dispatch Required");
        setTriageStage("completed");
        setDispatchState("dispatched");
        
        const smsPayload = `HEALIX_SOS_OFFLINE:${gpsCoordinates.lat.toFixed(4)},${gpsCoordinates.lng.toFixed(4)};SYM:${simulatedSymptom};PANIC:${panic};STRESS:${stress};CONF:96`;
        setSmsSentLogs(prev => [
          `SMS Distress sent: "${smsPayload}"`,
          ...prev
        ]);
        speakText("Offline Rescue engaged. Local checklists loaded. Distress SMS dispatched.");
        
        setTimeout(() => {
          setActiveMode("guidance");
          setDispatchState("enroute");
        }, 3200);
      }, 2000);
    } else {
      setTimeout(async () => {
        try {
          const res = await fetch("/api/emergency/triage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              symptom: simulatedSymptom,
              panicIndex: panic,
              stressLevel: stress,
              breathRate: breath,
              speechDelay: sDelay,
              confusionScore: cScore / 100,
              unconsciousness: unconscious,
              urgencyScore: uScore,
              patientGps: `${gpsCoordinates.lat},${gpsCoordinates.lng}`,
              userEmail: user?.email || "avnish@gmail.com"
            })
          });

          const data = await res.json();
          if (data.success && data.event) {
            setActiveEventId(data.event.id);
            setHospitalSelected(data.hospitalDecision);
            setHospitalAvailability(data.allHospitalScoring);
            setTriageSeverity(data.event.severity);
            setTriageStage("completed");
            setDispatchState("dispatched");
            setSmsSentLogs(prev => [
              `SMS sent to family: "Wearable alert: Emergency detected. Ambulance dispatched. ETA 8 mins. Assigned: ${data.hospitalDecision.name}."`,
              ...prev
            ]);
            setTimeout(() => {
              setActiveMode("guidance");
              setDispatchState("enroute");
            }, 3200);
          }
        } catch (e) {
          console.error(e);
        }
      }, 2000);
    }
  };

  // REAL VOICE TRIAGE SUBMISSION TO SQLite ENDPOINT
  const handleCategorySelect = async (categoryId: string) => {
    setSelectedEmergency(categoryId);
    setTriageStage("analyzing");
    setTriageLogs(["Checking cellular network status...", "Ingesting GPS telemetry layer..."]);

    const addLog = (log: string, delay: number) => {
      setTimeout(() => {
        setTriageLogs(prev => [...prev, log]);
      }, delay);
    };

    if (isOfflineMode) {
      addLog("Cellular signal absent. Initializing Local Rescue Engine...", 500);
      addLog("Fetching cached Noida-NCR medical maps...", 1000);
      addLog("Formatting compressed distress SMS string...", 1500);

      setTimeout(() => {
        setTriageSeverity("Immediate Dispatch Required");
        setTriageStage("completed");
        setDispatchState("dispatched");
        
        // Generate distress SMS payload
        const smsPayload = `HEALIX_SOS_OFFLINE:${gpsCoordinates.lat.toFixed(4)},${gpsCoordinates.lng.toFixed(4)};SYM:${categoryId};PANIC:${voiceMetrics.panicIndex};STRESS:${voiceMetrics.stressLevel}`;
        setSmsSentLogs(prev => [
          `SMS Distress sent: "${smsPayload}"`,
          ...prev
        ]);

        speakText("Offline Mode Active. Pre-cached emergency routing maps and local guidance initialized. Cellular SMS alert sent.");
        
        setTimeout(() => {
          setActiveMode("guidance");
          setDispatchState("enroute");
        }, 3200);
      }, 2000);

    } else {
      addLog("Analyzing vocal frequency tremors...", 500);
      addLog("Executing Layer 3 Survival Routing Algorithm...", 1000);
      addLog("Broadcasting FHIR HL7 telemetry payloads...", 1500);

      setTimeout(async () => {
        try {
          const res = await fetch("/api/emergency/triage", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              symptom: categoryId,
              panicIndex: voiceMetrics.panicIndex || 82,
              stressLevel: voiceMetrics.stressLevel || 78,
              breathRate: voiceMetrics.breathRate || 26,
              speechDelay: speechDelay || 1.4,
              confusionScore: confusionScore / 100 || 0.25,
              unconsciousness: unconsciousness || false,
              urgencyScore: urgencyScore / 100 || 0.76,
              patientGps: `${gpsCoordinates.lat},${gpsCoordinates.lng}`,
              userEmail: user?.email || "avnish@gmail.com"
            })
          });

          const data = await res.json();
          if (data.success && data.event) {
            const ev = data.event;
            setActiveEventId(ev.id);
            setHospitalSelected(data.hospitalDecision);
            setHospitalAvailability(data.allHospitalScoring);
            setTriageSeverity(ev.severity);
            setTriageStage("completed");
            setDispatchState("dispatched");
            
            setSmsSentLogs(prev => [
              `SMS sent to family: "Emergency: ${categoryId.toUpperCase()}. Ambulance dispatched. Assigned hospital: ${data.hospitalDecision.name}."`,
              ...prev
            ]);

            speakText(`Emergency classified as ${ev.severity}. Smart routing chooses ${data.hospitalDecision.name}. Guidance loaded.`);
            
            setTimeout(() => {
              setActiveMode("guidance");
              setDispatchState("enroute");
            }, 3200);
          } else {
            setTriageLogs(prev => [...prev, "Triage API Error: Database sync failed."]);
          }
        } catch (err: any) {
          console.error("Triage API client error:", err);
          setTriageLogs(prev => [...prev, "Triage API network failure."]);
        }
      }, 2000);
    }
  };

  // Poll active event status from database dynamically during dispatch enroute
  useEffect(() => {
    let interval: any;
    if (activeEventId && dispatchState === "enroute") {
      interval = setInterval(async () => {
        try {
          // Increment simulated coordinate progress and push update
          const newEta = Math.max(0, dispatchETA - 10);
          setDispatchETA(newEta);

          const deltaRatio = (480 - newEta) / 480;
          const currentLat = 28.5550 + (28.5355 - 28.5550) * deltaRatio;
          const currentLng = 77.4200 + (77.3910 - 77.4200) * deltaRatio;
          setAmbulanceCoordinates({ lat: currentLat, lng: currentLng });

          const payload = {
            eventId: activeEventId,
            status: newEta <= 0 ? "arrived" : "enroute",
            ambulanceGps: `${currentLat},${currentLng}`,
            eta: newEta
          };

          const patchRes = await fetch("/api/emergency/active", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
          });
          const patchData = await patchRes.json();

          if (patchData.success && patchData.event.status === "arrived") {
            setDispatchState("arrived");
            setPreNotificationStatus("Patient Arrived. Cath Lab table transfer active.");
            clearInterval(interval);
          }
        } catch (e) {
          console.error("Error updating active emergency:", e);
        }
      }, 3000);
    }

    return () => clearInterval(interval);
  }, [activeEventId, dispatchState, dispatchETA]);

  // Layer 1 Reinforcement Learning Sim Trigger
  const runRlSimulation = async () => {
    if (rlRunning) return;
    setRlRunning(true);
    setRlLogs(prev => ["Triggering learning epoch over 12,854 historical events...", ...prev]);

    try {
      const res = await fetch("/api/emergency/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          symptom: selectedEmergency || "heart_attack",
          instructions: "sit upright + chew aspirin (300mg) + family alert + pre-notify cath lab",
          survivalOutcome: 98.2
        })
      });
      const data = await res.json();
      
      if (data.success) {
        setTimeout(() => {
          setRlLogs(prev => [
            `Gradient calculated. Optimized Cath Lab prep constants.`,
            `Learned Average outcome: ${data.newLearnedAverage}%.`,
            `Total trained cases in model: ${data.totalTrainedCases}.`,
            ...prev
          ]);
          setRlSurvivalRate(parseFloat(data.newLearnedAverage.toFixed(1)));
          setRlRunning(false);
        }, 1200);
      }
    } catch (e) {
      console.error(e);
      setRlRunning(false);
    }
  };

  // Layer 2 Simulated Voice Biomarker Trigger
  const simulateVoiceInput = (phraseType: "breathing" | "stroke" | "minor") => {
    setSimulatedVoiceLog("Ingesting simulated audio stream package...");
    
    setTimeout(() => {
      if (phraseType === "breathing") {
        setSimulatedVoiceLog("Analyzed input: 'I... I can't... breathe...'");
        setSimulatedVoiceAnalysis({
          gaspDetected: "YES (Heavy Gasp / Respiratory struggle)",
          tremorDetected: "HIGH (Voice frequency tremor index: 0.88)",
          speechBreaks: "CRITICAL (Delayed response speed, breaks pattern matches crying)",
          classification: "Critical Respiratory Distress (Immediate Dispatch required)",
          probability: "87%",
          urgency: "Immediate Resuscitation Unit Dispatch"
        });
        speakText("Respiratory distress detected. Dispatching critical care team.");
      } else if (phraseType === "stroke") {
        setSimulatedVoiceLog("Analyzed input: 'My... grandfather... collapsed... his face is drooping...'");
        setSimulatedVoiceAnalysis({
          gaspDetected: "NO (Standard breath)",
          tremorDetected: "MODERATE (Tremor index: 0.65)",
          speechBreaks: "CONFUSED (Speech slurry index: 0.81, semantic confusion match)",
          classification: "Ischemic Stroke FAST Signature Match",
          probability: "92%",
          urgency: "Route to primary Certified Stroke Hospital"
        });
        speakText("Stroke pattern matched. Pre notifying stroke specialist team.");
      } else {
        setSimulatedVoiceLog("Analyzed input: 'I fell down and scraped my knee, it's bleeding a little'");
        setSimulatedVoiceAnalysis({
          gaspDetected: "NO",
          tremorDetected: "LOW (Tremor index: 0.12)",
          speechBreaks: "NONE",
          classification: "Mild Abrasion / Superficial Bleeding",
          probability: "94%",
          urgency: "Mild Triage Guidance. Defers dispatch. Route standard courier."
        });
        speakText("Injury classified as minor. Loading local bleeding pressure instructions.");
      }
    }, 1200);
  };

  // Layer 5 Replay Scrubber step text
  const getReplayStepText = (timeVal: number) => {
    if (timeVal < 20) return { time: "0:00", step: "Emergency Call Initiated", desc: "SOS Button pressed. Web Speech AI activated. Live audio visualizer connected." };
    if (timeVal < 40) return { time: "1:20", step: "Voice Biomarker Triage Complete", desc: `Analyzed vocal stress. Identified Heart Attack. Classified: Severity Critical. AIIMS Delhi targeted as optimal survival pathway hospital.` };
    if (timeVal < 60) return { time: "3:15", step: "Ambulance Dispatched", desc: `GPS routing locked. Smart dispatch triggers route bypass layer. Family auto alerted via SMS.` };
    if (timeVal < 80) return { time: "5:45", step: "Hospital Pre-Notification Triggered", desc: "Telemetry payload (vitals, ECG, ETA) pushed to AIIMS Trauma Desk. Cath lab mobilizes prep checklists." };
    return { time: "8:00", step: "Ambulance Arrival & Transition", desc: "Patient coordinates met. Transitioned to ER bed. Delayed response post-analysis logged. Optimized sector weights for next run." };
  };

  const getSeverityStatus = () => {
    const panic = voiceMetrics.panicIndex || 0;
    const stress = voiceMetrics.stressLevel || 0;
    const breath = voiceMetrics.breathRate || 0;

    // Advanced score combining all metrics
    let scoreVal = (panic * 0.25) + (stress * 0.25) + (breath * 0.8) + (speechDelay * 6) + (confusionScore * 0.25);
    if (unconsciousness) {
      scoreVal = 98;
    }

    const scorePct = Math.max(10, Math.min(99, Math.round(scoreVal)));

    let label = "Stable";
    let color = "text-emerald-400";
    let stroke = "stroke-emerald-400";
    let bg = "bg-emerald-500/10";
    let border = "border-emerald-500/20";

    if (unconsciousness || scorePct >= 85) {
      label = "Immediate Dispatch Required";
      color = "text-red-500 font-extrabold animate-pulse";
      stroke = "stroke-red-600";
      bg = "bg-red-950/40 border-red-500/30 text-red-400";
      border = "border-red-600/40";
    } else if (scorePct >= 70) {
      label = "Critical";
      color = "text-red-400 animate-pulse";
      stroke = "stroke-red-400";
      bg = "bg-red-500/10";
      border = "border-red-500/20";
    } else if (scorePct >= 40) {
      label = "Urgent";
      color = "text-amber-400";
      stroke = "stroke-amber-400";
      bg = "bg-amber-500/10";
      border = "border-amber-500/20";
    } else {
      label = "Stable";
      color = "text-emerald-400";
      stroke = "stroke-emerald-400";
      bg = "bg-emerald-500/10";
      border = "border-emerald-500/20";
    }

    return {
      label,
      score: scorePct / 100,
      color,
      stroke,
      bg,
      border,
      delay: `${speechDelay.toFixed(1)}s`,
      confusion: `${confusionScore.toFixed(0)}%`,
      unconscious: unconsciousness ? "Collapse Alert! (Unconscious)" : "Conscious / Responding",
      confidence: 0.85 + (scorePct / 1000)
    };
  };

  const severity = getSeverityStatus();

  // Radial visualization circular parameters
  const radius = 55;
  const strokeWidth = 8;
  const normalizedRadius = radius - strokeWidth;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (severity.score * circumference);

  const currentReplay = getReplayStepText(replayTime);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex flex-col overflow-hidden bg-[#FAF9F6] text-slate-800 font-poppins transition-all duration-300">
      
      {/* Full-Screen ECG Grid Line Overlay */}
      <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <pattern id="ecg-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(100, 116, 139, 0.15)" strokeWidth="0.5" />
            <path d="M 8 0 L 8 40 M 16 0 L 16 40 M 24 0 L 24 40 M 32 0 L 32 40 M 0 8 L 40 8 M 0 16 L 40 16 M 0 24 L 40 24 M 0 32 L 40 32" fill="none" stroke="rgba(100, 116, 139, 0.05)" strokeWidth="0.25" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#ecg-grid)" />
        </svg>
      </div>

      {/* Top Banner Navigation */}
      <header className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-200 bg-[#FAF9F6]/90 backdrop-blur-md shrink-0 gap-2 sm:gap-0">
        <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/35 relative">
            <span className="absolute -inset-1 rounded-xl bg-red-500/25 animate-ping" />
            <Activity className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-xs sm:text-sm font-black uppercase tracking-[0.12em] text-red-600">
              Healix Predictive Emergency Clinical Intelligence Network
            </h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest">
              Predictive Life Support & Dispatch Grid
            </p>
          </div>
        </div>

        {/* Navigation Toggles */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide w-full sm:w-auto pb-0.5 sm:pb-0">
          <button
            onClick={() => setActiveMode("triage")}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeMode === "triage"
                ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                : "bg-slate-200 hover:bg-slate-300 text-slate-700"
            }`}
          >
            Triage Selection
          </button>
          <button
            onClick={() => {
              if (selectedEmergency) {
                setActiveMode("guidance");
              } else {
                alert("Please select or simulate an emergency type first.");
              }
            }}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all whitespace-nowrap shrink-0 ${
              activeMode === "guidance"
                ? "bg-red-600 text-white shadow-md shadow-red-600/20"
                : "bg-slate-200 hover:bg-slate-300 text-slate-700"
            }`}
          >
            Life Support Guidance
          </button>
          <button
            onClick={() => setActiveMode("admin")}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 whitespace-nowrap shrink-0 ${
              activeMode === "admin"
                ? "bg-orange-600 text-white shadow-md shadow-orange-600/20"
                : "bg-slate-200 hover:bg-slate-300 text-slate-700"
            }`}
          >
            <Compass className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Admin Monitor
          </button>
          <button
            onClick={() => setActiveMode("moat")}
            className={`px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-bold transition-all flex items-center gap-1 border border-emerald-600/30 whitespace-nowrap shrink-0 ${
              activeMode === "moat"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                : "bg-emerald-100 hover:bg-emerald-200 text-emerald-800"
            }`}
          >
            <Shield className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            Survival Moat
          </button>
          
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-200 hover:bg-slate-300 transition-all text-slate-700 border border-slate-350 shrink-0 ml-auto sm:ml-1"
            aria-label="Close SOS screen"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="relative flex-grow flex flex-col md:flex-row overflow-hidden z-10">
        
        {/* ================= MODE 1: TRIAGE SELECTION ================= */}
        {activeMode === "triage" && (
          <div className="flex-grow flex flex-col overflow-y-auto px-6 py-6 md:px-12 items-center w-full">
            
            {/* 1. Direct Emergency Helpline Button (Top of Triage view) */}
            <a
              href="tel:112"
              className="w-full max-w-5xl mb-8 bg-gradient-to-r from-red-600 to-rose-700 text-white p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between shadow-lg hover:scale-[1.01] transition-all cursor-pointer relative overflow-hidden group border border-red-500/25 shrink-0"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full filter blur-xl -z-10 group-hover:scale-125 transition-transform" />
              <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                <div className="h-14 w-14 rounded-full bg-white/20 flex items-center justify-center animate-pulse">
                  <Phone className="h-7 w-7 text-white fill-current" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-black uppercase tracking-wider text-white">
                    Direct Emergency Helpline
                  </h3>
                  <p className="text-xs text-red-100 font-medium">
                    Call 112 / 102 immediately for local emergency ambulance & physician dispatch
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2 text-white font-extrabold uppercase text-xs sm:text-sm tracking-widest bg-black/20 px-4 py-2.5 rounded-full border border-white/25">
                <span>Call Helpline Now</span>
                <ArrowRight className="h-4 w-4" />
              </div>
            </a>

            {/* 2. AI Question header */}
            <div className="text-center mb-6 max-w-2xl shrink-0">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 mb-2 uppercase">
                What emergency are you experiencing?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">
                Select a category tile below for immediate live triage guidance, visual checklists, and smart ambulance routing.
              </p>
            </div>

            {/* 3. Categories Grid (Moved to top of Triage view) */}
            <div className="w-full max-w-5xl grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 pb-8 shrink-0">
              {EMERGENCY_CATEGORIES.map((category) => {
                const IconComp = category.icon;
                return (
                  <button
                    key={category.id}
                    onClick={() => handleCategorySelect(category.id)}
                    className={`relative p-5 pt-8 pb-5 rounded-2xl text-left border transition-all duration-300 cursor-pointer overflow-hidden flex flex-col justify-between h-40 group ${
                      selectedEmergency === category.id
                        ? "bg-slate-200 border-red-500 shadow-md scale-105"
                        : "bg-slate-100/90 border-slate-200/80 hover:border-red-500/40 hover:bg-slate-200/60 hover:-translate-y-1"
                    }`}
                  >
                    {/* Calming low-opacity colored backdrop wash matching concern color */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-[0.06] group-hover:opacity-[0.10] transition-opacity duration-300 -z-10`} />

                    {/* Gradient top concern stripe (increased from 6px to 10px) */}
                    <div className={`absolute top-0 left-0 right-0 h-[10px] bg-gradient-to-r ${category.color}`} />
                    
                    {/* Decorative subtle background gradient */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-slate-200/10 rounded-full filter blur-md -z-10 group-hover:scale-125 transition-transform" />

                    <div className="flex items-center justify-between w-full">
                      {/* Fully color-coded icon container with white icon */}
                      <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${category.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-sm`}>
                        <IconComp className="h-6 w-6 text-white" />
                      </div>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md border ${
                        category.severity === "Critical"
                          ? "bg-red-500/10 border-red-500/20 text-red-600"
                          : category.severity === "Urgent"
                          ? "bg-amber-500/10 border-amber-500/20 text-amber-600"
                          : "bg-teal-500/10 border-teal-500/20 text-teal-600"
                      }`}>
                        {category.severity}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="text-sm font-extrabold uppercase text-slate-800 tracking-wide group-hover:text-red-600 transition-colors">
                        {category.label}
                      </h3>
                      <span className="text-[10px] text-slate-500 block group-hover:text-slate-700 transition-colors font-medium">
                        Life-saving protocol
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* 4. Audio Wave / Microphone Status panel & Radial Severity Visualization (2-Column Grid) */}
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-6 mb-8 shrink-0">
              
              {/* Left Col: Mic Wave & Logs (Col-Span 7) */}
              <div className="md:col-span-7 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 to-orange-500 animate-pulse" />
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-black uppercase text-red-600 tracking-widest flex items-center gap-1.5">
                    <Mic className="h-4 w-4 animate-bounce text-red-600" />
                    Live Voice Triage Receiver (Web Audio API active)
                  </span>
                  <span className="text-[9px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                    {triageStage === "listening" ? "LISTEN ACTIVE" : triageStage === "analyzing" ? "ANALYZING SPEECH" : "COMPLETED"}
                  </span>
                </div>

                <div className="h-20 w-full mb-4 bg-slate-50 rounded-2xl relative overflow-hidden flex items-center justify-center border border-slate-150">
                  <canvas ref={canvasRef} width={500} height={80} className="w-full h-full block" />
                  <div className="absolute inset-0 flex items-center justify-center bg-transparent pointer-events-none">
                    {triageStage === "listening" && (
                      <span className="text-xs text-red-600 font-bold uppercase tracking-wider animate-pulse bg-white/90 px-3 py-1 rounded-full border border-red-500/25 shadow-sm">
                        Speak now or select category below
                      </span>
                    )}
                  </div>
                </div>

                {/* Triage Analytics Live Gauges */}
                <div className="grid grid-cols-4 gap-3 mb-4 text-xs font-mono">
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center">
                    <span className="text-[8px] text-slate-500 block font-bold">Panic Index</span>
                    <span className="text-red-600 font-black">{voiceMetrics.panicIndex}%</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center">
                    <span className="text-[8px] text-slate-500 block font-bold">Stress Level</span>
                    <span className="text-orange-600 font-black">{voiceMetrics.stressLevel}%</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center">
                    <span className="text-[8px] text-slate-500 block font-bold">Respirations</span>
                    <span className="text-blue-600 font-black">{voiceMetrics.breathRate}/m</span>
                  </div>
                  <div className="bg-slate-50 p-2 rounded border border-slate-200 text-center">
                    <span className="text-[8px] text-slate-500 block font-bold">Ambient Noise</span>
                    <span className="text-teal-600 font-black">{voiceMetrics.bgNoise} dB</span>
                  </div>
                </div>

                {/* Logs output */}
                <div className="h-28 overflow-y-auto text-left font-mono text-[10px] bg-slate-900 p-3.5 rounded-xl border border-slate-800 text-emerald-400 space-y-1">
                  {triageLogs.length === 0 ? (
                    <p className="text-slate-400 italic">No audio classifications recorded yet. Start by tapping an emergency category card below or talking.</p>
                  ) : (
                    triageLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-slate-500">[{10 + i * 2}s]</span>
                        <span className={log.includes("Critical") || log.includes("Error") ? "text-red-400 font-bold" : ""}>{log}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Right Col: Live Radial Severity Visualization (Col-Span 5) */}
              <div className="md:col-span-5 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden flex flex-col justify-between items-center text-center">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 to-red-600 animate-pulse" />
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-4">
                  Live Severity Radial Analyzer
                </span>

                <div className="relative h-28 w-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90">
                    <circle
                      fill="transparent"
                      stroke="rgba(0,0,0,0.03)"
                      strokeWidth={strokeWidth}
                      r={normalizedRadius}
                      cx={56}
                      cy={56}
                    />
                    <circle
                      fill="transparent"
                      strokeDasharray={circumference + ' ' + circumference}
                      style={{ strokeDashoffset }}
                      strokeWidth={strokeWidth}
                      strokeLinecap="round"
                      r={normalizedRadius}
                      cx={56}
                      cy={56}
                      className={`transition-all duration-500 ${severity.stroke}`}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center text-center">
                    <span className="text-[8px] text-slate-500 uppercase font-black">Confidence</span>
                    <span className="text-sm font-mono font-extrabold text-slate-800">{(severity.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>

                <div className="w-full mt-4 space-y-2">
                  <div className={`text-[10px] font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-xl border inline-block ${severity.bg} ${severity.border} ${severity.color}`}>
                    {severity.label}
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-left font-mono text-[9px] text-slate-500 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <div>
                      <span className="text-[7.5px] text-slate-400 block font-bold">SPEECH DELAY</span>
                      <span className="text-slate-800 font-bold">{severity.delay}</span>
                    </div>
                    <div>
                      <span className="text-[7.5px] text-slate-400 block font-bold">CONFUSION</span>
                      <span className="text-slate-800 font-bold">{severity.confusion}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200">
                      <span className="text-[7.5px] text-slate-400 block font-bold">CONSCIOUSNESS INDICATOR</span>
                      <span className="text-slate-800 font-bold">{severity.unconscious}</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* 5. Resiliency & Wearable Integration Panel */}
            <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 shrink-0">
              
              {/* Wearable Simulator Panel */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500" />
                <div>
                  <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider mb-3 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-blue-500" />
                    Wearable Device Integration Emulator
                  </h3>
                  <p className="text-[10px] text-slate-500 mb-4">
                    Simulate bio-telemetry triggers from connected smartwatches and ECG sensors to test instant auto-dispatch sequences.
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <button
                    onClick={() => triggerWearableEmergency("oxygen_crash")}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left cursor-pointer transition-all hover:scale-102 flex flex-col justify-between"
                  >
                    <span className="text-[9px] text-red-600 font-extrabold uppercase">Oxygen Crash</span>
                    <span className="text-[10px] text-slate-800 font-bold mt-1">SpO2 @ 81%</span>
                    <span className="text-[8px] text-slate-500 mt-1">Auto Dispatch</span>
                  </button>
                  
                  <button
                    onClick={() => triggerWearableEmergency("abnormal_hr")}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left cursor-pointer transition-all hover:scale-102 flex flex-col justify-between"
                  >
                    <span className="text-[9px] text-red-600 font-extrabold uppercase">HR Spike</span>
                    <span className="text-[10px] text-slate-800 font-bold mt-1">HR &gt; 165 BPM</span>
                    <span className="text-[8px] text-slate-500 mt-1">Arrhythmia alert</span>
                  </button>
                  
                  <button
                    onClick={() => triggerWearableEmergency("arrhythmia")}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left cursor-pointer transition-all hover:scale-102 flex flex-col justify-between"
                  >
                    <span className="text-[9px] text-red-600 font-extrabold uppercase">ECG Check</span>
                    <span className="text-[10px] text-slate-800 font-bold mt-1">Atrial Fibrillation</span>
                    <span className="text-[8px] text-slate-500 mt-1">Critical trigger</span>
                  </button>
                  
                  <button
                    onClick={() => triggerWearableEmergency("collapse")}
                    className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-2xl text-left cursor-pointer transition-all hover:scale-102 flex flex-col justify-between"
                  >
                    <span className="text-[9px] text-red-600 font-extrabold uppercase">Collapse Alert</span>
                    <span className="text-[10px] text-slate-800 font-bold mt-1">User Dropped</span>
                    <span className="text-[8px] text-slate-500 mt-1">Immediate dispatch</span>
                  </button>
                </div>
              </div>

              {/* Resiliency Offline Mode Panel */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xs font-black uppercase text-slate-800 tracking-wider flex items-center gap-1.5">
                      <Layers className="h-4 w-4 text-emerald-500" />
                      Offline Resiliency Layer
                    </h3>
                    <button
                      onClick={toggleOfflineMode}
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase transition-all cursor-pointer ${
                        isOfflineMode
                          ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/30"
                          : "bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200"
                      }`}
                    >
                      {isOfflineMode ? "DISCONNECT: OFFLINE" : "NETWORK: ONLINE"}
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed mb-3">
                    If internet signals cut during an emergency, Healix automatically shifts to pre-cached offline maps, local guide checklists, and encrypts GPS coordinates into emergency SMS text payloads.
                  </p>
                </div>

                {isOfflineMode ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-mono text-emerald-800 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black uppercase text-emerald-700">Distress SMS Relay</span>
                      <span className="text-[8px] text-slate-400">COMPRESSED PAYLOAD</span>
                    </div>
                    <p className="text-[9px] break-all bg-slate-900 p-2 rounded text-emerald-400 border border-slate-800 select-all">
                      HEALIX_SOS_LOC:{gpsCoordinates.lat.toFixed(4)},{gpsCoordinates.lng.toFixed(4)};SYM:{selectedEmergency || "CHEST_PAIN"};PANIC:{voiceMetrics.panicIndex};STRESS:{voiceMetrics.stressLevel};CONF:96
                    </p>
                    <p className="text-[8.5px] text-slate-400">Auto relayed over local cellular distress channels.</p>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-500 text-center italic">
                    Awaiting offline switch to engage backup localized rescue.
                  </div>
                )}
              </div>
            </div>

          </div>
        )}

        {/* ================= MODE 2: RESPONSE ENGINE / GUIDANCE ================= */}
        {activeMode === "guidance" && (
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
            
            {/* Left Panel: Clinical Triage and Response Instructions */}
            <div className="w-full md:w-1/2 flex flex-col border-r border-slate-200 overflow-y-auto p-6 bg-[#FAF9F6] text-slate-800">
              
              <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-5 shrink-0 flex items-center justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600 block mb-1">
                    Active Emergency Guidance
                  </span>
                  <h3 className="text-xl font-black uppercase tracking-wide text-slate-800">
                    {EMERGENCY_CATEGORIES.find(c => c.id === selectedEmergency)?.label || "Emergency"}
                  </h3>
                </div>
                <div className="h-10 w-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold text-xs animate-pulse border border-red-200 shadow-sm">
                  SOS
                </div>
              </div>

              {/* Internal Guidance Tabs */}
              <div className="flex bg-slate-100 border border-slate-200 rounded-xl p-1 mb-5 shrink-0 shadow-xs">
                <button
                  onClick={() => setGuidanceTab("avatar")}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                    guidanceTab === "avatar"
                      ? "bg-red-600 text-white shadow shadow-red-600/10"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Medical Avatar
                </button>
                <button
                  onClick={() => setGuidanceTab("voice")}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                    guidanceTab === "voice"
                      ? "bg-red-600 text-white shadow shadow-red-600/10"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Voice Guide
                </button>
                <button
                  onClick={() => setGuidanceTab("tutorials")}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                    guidanceTab === "tutorials"
                      ? "bg-red-600 text-white shadow shadow-red-600/10"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Video Tutorial
                </button>
                <button
                  onClick={() => setGuidanceTab("video")}
                  className={`flex-1 py-2 text-center text-xs font-bold rounded-lg transition-all ${
                    guidanceTab === "video"
                      ? "bg-red-600 text-white shadow shadow-red-600/10"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  Emergency Call
                </button>
              </div>

              {/* Tab Content 1: Medical Avatar */}
              {guidanceTab === "avatar" && (
                <div className="flex-grow flex flex-col justify-between min-h-[300px] bg-white border border-slate-200 rounded-2xl p-6 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-b from-slate-50/50 to-transparent pointer-events-none" />
                  
                  {selectedEmergency && EMERGENCY_GUIDANCE[selectedEmergency] ? (
                    (() => {
                      const guidance = EMERGENCY_GUIDANCE[selectedEmergency];
                      const Illustration = guidance.illustration;
                      return (
                        <div className="w-full flex flex-col items-center space-y-4">
                          <div className="h-36 w-full flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 p-4 relative">
                            <Illustration />
                            <div className="absolute bottom-2 right-2 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[9px] font-bold text-emerald-700 uppercase animate-pulse">
                              Visual Aid Loaded
                            </div>
                          </div>
                          
                          <div className="w-full text-left space-y-3">
                            <h4 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 pb-2">
                              <CheckCircle className="h-4.5 w-4.5 text-red-500 shrink-0" />
                              {guidance.title} Checklist
                            </h4>
                            <div className="space-y-2">
                              {guidance.steps.map((step, idx) => (
                                <div key={idx} className="flex items-start gap-2.5 bg-slate-50 border border-slate-200/60 p-3 rounded-xl shadow-xs">
                                  <span className="h-5 w-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0">
                                    {idx + 1}
                                  </span>
                                  <p className="text-xs text-slate-700 leading-relaxed font-medium">
                                    {step}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })()
                  ) : (
                    <div className="w-full flex flex-col items-center justify-center py-12">
                      <p className="text-sm text-slate-500 italic">No emergency selected. Please select a category from the Triage view.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Tab Content 2: Voice Instruction */}
              {guidanceTab === "voice" && (
                <div className="flex-grow bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
                  <div className="space-y-4">
                    <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest block">
                      Voice Modulation Settings & Audio Telemetry
                    </span>

                    <div className="grid grid-cols-2 gap-4 bg-white/5 p-4 rounded-xl border border-white/5 text-xs">
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Instruction Language</label>
                        <select
                          value={voiceLanguage}
                          onChange={(e) => setVoiceLanguage(e.target.value as any)}
                          className="w-full bg-black border border-white/10 px-2 py-1.5 rounded focus:outline-none focus:border-red-500 text-white"
                        >
                          <option value="en">English (Calm)</option>
                          <option value="hi">Hindi (हिंदी)</option>
                          <option value="hinglish">Hinglish</option>
                        </select>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">AI Voice Tone</label>
                        <select
                          value={voiceTone}
                          onChange={(e) => setVoiceTone(e.target.value as any)}
                          className="w-full bg-black border border-white/10 px-2 py-1.5 rounded focus:outline-none focus:border-red-500 text-white"
                        >
                          <option value="reassurance">Reassurance Mode</option>
                          <option value="urgent">Urgent Mode</option>
                          <option value="family">Family Instruction Mode</option>
                        </select>
                      </div>
                    </div>

                    <div className="p-4 bg-white/5 border border-white/5 rounded-xl">
                      <h4 className="text-xs font-bold text-gray-200 uppercase mb-2">Active Voice Script:</h4>
                      <p className="text-xs text-gray-300 italic leading-relaxed">
                        "{voicePrompts[selectedEmergency || ""]?.[voiceLanguage] || "Healix dispatcher is analyzing conditions. Stay on the line."}"
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 flex flex-col items-center">
                    <button
                      onClick={triggerVoiceGuidanceText}
                      className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white font-extrabold rounded-xl shadow-lg shadow-red-600/35 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Volume2 className="h-5 w-5 text-white animate-bounce" />
                      PLAY VOICE ASSISTANCE
                    </button>
                    {isSpeaking && (
                      <span className="text-[9px] font-black text-emerald-400 animate-pulse uppercase mt-2 tracking-widest">
                        Audio broadcast streaming...
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Tab Content 3: Video Tutorials / Emergency Action Clips */}
              {guidanceTab === "tutorials" && (
                <div className="flex-grow bg-black/40 border border-white/5 rounded-2xl p-5 flex flex-col justify-between overflow-y-auto">
                  <div className="w-full space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] font-black text-red-400 uppercase tracking-widest block">
                        Emergency Action Loops (Auto-playing)
                      </span>
                      <span className="text-[9px] text-gray-500 bg-white/5 px-2 py-0.5 rounded border border-white/10 uppercase tracking-wider">
                        10-20s Clips
                      </span>
                    </div>

                    {/* Tutorial Category Selector */}
                    <div className="grid grid-cols-4 gap-1">
                      {[
                        { id: "cpr", label: "CPR Guide" },
                        { id: "heimlich", label: "Heimlich" },
                        { id: "bleeding", label: "Bleeding" },
                        { id: "stroke", label: "Stroke FAST" }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setActiveTutorial(t.id as any)}
                          className={`py-1.5 px-2 rounded-xl text-[9px] font-black uppercase text-center border transition-all cursor-pointer ${
                            activeTutorial === t.id
                              ? "bg-red-600 border-red-500 text-white shadow shadow-red-600/20"
                              : "bg-white/5 border-white/5 text-gray-400 hover:text-white"
                          }`}
                        >
                          {t.label}
                        </button>
                      ))}
                    </div>

                    {/* Animated Micro-Instruction video screen container */}
                    <div className="w-full h-44 bg-black/60 border border-white/10 rounded-2xl relative overflow-hidden flex items-center justify-center">
                      
                      {/* CPR Animation */}
                      {activeTutorial === "cpr" && (
                        <div className="flex flex-col items-center justify-center space-y-2.5">
                          {/* Chest Ripple Metronome circle */}
                          <div className="relative h-16 w-16 flex items-center justify-center">
                            {cprStatus === "compress" && (
                              <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping" />
                            )}
                            <div className={`h-12 w-12 rounded-full border border-red-500/50 flex items-center justify-center text-[10px] font-mono font-black transition-all ${
                              cprStatus === "compress" ? "bg-red-600 text-white scale-90" : "bg-blue-600 text-white scale-110"
                            }`}>
                              {cprStatus === "compress" ? `BEAT ${cprBeats}` : "BREATH"}
                            </div>
                          </div>
                          <div className="text-center font-mono">
                            <p className="text-[11px] font-bold text-white uppercase tracking-wider">
                              {cprStatus === "compress" ? `COMPRESSION PHASE (110 BPM)` : "RESCUE BREATHS ACTIVE"}
                            </p>
                            <p className="text-[9px] text-gray-400 mt-1 uppercase">
                              CYCLE {cprCycle} | {cprStatus === "compress" ? `${cprBeats}/30 COMPRESSIONS` : `TAKE 2 BREATHS`}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Heimlich Animation */}
                      {activeTutorial === "heimlich" && (
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="relative h-16 w-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                            {/* Upward arrows animating */}
                            <div className="space-y-1 animate-bounce">
                              <span className="block border-l-2 border-t-2 border-orange-500 w-3 h-3 rotate-45 mx-auto" />
                              <span className="block border-l-2 border-t-2 border-orange-400 w-3 h-3 rotate-45 mx-auto" />
                            </div>
                          </div>
                          <div className="text-center font-mono">
                            <p className="text-[11px] font-bold text-white uppercase tracking-wider">Abdominal Thrusts</p>
                            <p className="text-[9px] text-gray-400 mt-1 uppercase">Quick inward and upward thrusts under diaphragm</p>
                          </div>
                        </div>
                      )}

                      {/* Bleeding Animation */}
                      {activeTutorial === "bleeding" && (
                        <div className="flex flex-col items-center justify-center space-y-3">
                          <div className="h-16 w-16 bg-white/5 border border-white/10 rounded-full flex items-center justify-center relative overflow-hidden">
                            <Droplet className="h-8 w-8 text-red-600 animate-pulse" />
                            <div className="absolute inset-0 bg-red-600/10 animate-ping" />
                          </div>
                          <div className="text-center font-mono">
                            <p className="text-[11px] font-bold text-white uppercase tracking-wider">Direct Pressure & Elevation</p>
                            <p className="text-[9px] text-gray-400 mt-1 uppercase">Pack deep wounds and apply firm constant force</p>
                          </div>
                        </div>
                      )}

                      {/* Stroke Animation */}
                      {activeTutorial === "stroke" && (
                        <div className="flex flex-col items-center justify-center space-y-2 w-full px-8">
                          <p className="text-[11.5px] font-mono font-bold text-white uppercase tracking-wider mb-1.5">FAST Diagnostic Check</p>
                          <div className="grid grid-cols-2 gap-2 w-full text-[9px] font-mono text-left">
                            <div className="bg-white/5 p-1.5 rounded border border-white/5 flex items-center justify-between">
                              <span>Face Droop</span>
                              <span className="text-red-400 font-bold font-mono">75%</span>
                            </div>
                            <div className="bg-white/5 p-1.5 rounded border border-white/5 flex items-center justify-between">
                              <span>Arm Drift</span>
                              <span className="text-orange-400 font-bold font-mono">Moderate</span>
                            </div>
                            <div className="bg-white/5 p-1.5 rounded border border-white/5 flex items-center justify-between">
                              <span>Speech Slur</span>
                              <span className="text-red-400 font-bold font-mono">81%</span>
                            </div>
                            <div className="bg-white/5 p-1.5 rounded border border-white/5 flex items-center justify-between">
                              <span>Time Check</span>
                              <span className="text-emerald-400 font-bold font-mono">ETA 8m</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Clip Progress timeline */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/15">
                        <div className="bg-red-600 h-full transition-all duration-300" style={{ width: `${tutorialProgress}%` }} />
                      </div>
                    </div>
                  </div>

                  <div className="w-full mt-4 text-left space-y-2">
                    <h4 className="text-xs font-black text-white uppercase">Procedure Steps:</h4>
                    <p className="text-[10.5px] text-gray-400 leading-relaxed min-h-[44px]">
                      {activeTutorial === "cpr" 
                        ? "Push straight down 2 inches on center of chest at 100-120 compressions per minute. After 30 compressions, tilt head back and deliver 2 rescue breaths."
                        : activeTutorial === "heimlich" 
                        ? "Stand behind patient. Wrap arms around waist. Make a fist and place thumb side against abdomen just above bellybutton. Grasp fist and thrust upward rapidly."
                        : activeTutorial === "bleeding" 
                        ? "Place sterile pad or clean cloth on wound. Apply firm, direct pressure. Do not lift padding to check. Keep limb elevated above heart level."
                        : "Ask the person to smile (does one side droop?). Ask them to raise both arms (does one drift down?). Ask them to repeat a simple phrase (is speech slurred?). Time is brain."
                      }
                    </p>
                  </div>
                </div>
              )}

              {/* Tab Content 4: WebRTC Emergency Video Call */}
              {guidanceTab === "video" && (
                <div className="flex-grow bg-black/40 border border-white/5 rounded-2xl p-6 flex flex-col justify-between items-center text-center">
                  <div className="w-full space-y-4">
                    <span className="text-[10px] font-extrabold text-red-400 uppercase tracking-widest block">
                      Live WebRTC Emergency Consultation Room
                    </span>

                    {/* Camera Viewports */}
                    <div className="grid grid-cols-2 gap-4 h-48 bg-black/80 border border-white/10 rounded-2xl p-3 relative overflow-hidden">
                      {/* Doctor Remote stream */}
                      <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden relative flex items-center justify-center h-full">
                        <video
                          ref={remoteVideoRef}
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-bold">
                          Doctor (Attending)
                        </div>
                        {callStatus === "calling" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 text-[9px] text-gray-400">
                            <span className="h-5 w-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin mb-2" />
                            Calling duty doctor...
                          </div>
                        )}
                        {callStatus === "idle" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] text-gray-500">
                            Call inactive
                          </div>
                        )}
                        {callStatus === "ended" && (
                          <div className="absolute inset-0 flex flex-col items-center justify-center text-[10px] text-red-400 font-bold">
                            Call terminated
                          </div>
                        )}
                      </div>

                      {/* Patient Local stream */}
                      <div className="bg-slate-900 border border-white/5 rounded-xl overflow-hidden relative flex items-center justify-center h-full">
                        <video
                          ref={localVideoRef}
                          autoPlay
                          playsInline
                          muted
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[8px] font-bold">
                          You (Patient)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="w-full mt-6 flex flex-col items-center">
                    {callStatus === "idle" || callStatus === "ended" ? (
                      <button
                        onClick={startEmergencyCall}
                        className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all text-white font-extrabold rounded-xl shadow-lg shadow-emerald-600/35 flex items-center justify-center gap-2 cursor-pointer text-xs"
                      >
                        <Phone className="h-4.5 w-4.5 text-white animate-pulse" />
                        START EMERGENCY VIDEO CALL
                      </button>
                    ) : (
                      <button
                        onClick={endEmergencyCall}
                        className="w-full py-3.5 bg-red-600 hover:bg-red-700 active:scale-95 transition-all text-white font-extrabold rounded-xl shadow-lg shadow-red-600/35 flex items-center justify-center gap-2 cursor-pointer text-xs"
                      >
                        <Phone className="h-4.5 w-4.5 text-white rotate-135" />
                        TERMINATE CONSULTATION
                      </button>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* Right Panel: Smart Auto Dispatch & Routing */}
            <div className="w-full md:w-1/2 flex flex-col overflow-y-auto p-6 bg-[#FAF9F6] text-slate-800">
              
              {/* GPS Tracking Map Panel */}
              <div className="bg-white border border-slate-200 rounded-3xl p-4 shadow-sm relative overflow-hidden h-[260px] flex flex-col justify-between shrink-0 mb-5">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                  <div className="flex items-center space-x-1.5">
                    <Navigation className="h-4.5 w-4.5 text-orange-500 animate-spin" />
                    <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">
                      Healix GPS Emergency Routing Layer
                    </span>
                  </div>
                  <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    GPS TRACKING ACTIVE
                  </span>
                </div>

                <div className="flex-grow bg-slate-50 border border-slate-150 rounded-xl relative overflow-hidden flex items-center justify-center">
                  <iframe
                    ref={mapIframeRef}
                    src="/map.html"
                    className="w-full h-full border-none rounded-xl"
                    title="Healix Live Tracking Grid"
                    onLoad={sendCoordsToMap}
                  />
                </div>

                <div className="flex items-center justify-between text-[9px] text-slate-500 font-mono mt-2">
                  <span>GPS Patient: {gpsCoordinates.lat.toFixed(4)} N, {gpsCoordinates.lng.toFixed(4)} E</span>
                  <span>Ambulance Status: {dispatchState.toUpperCase()}</span>
                </div>
              </div>

              {/* Triage & Dispatch Stats */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Guaranteed ETA</span>
                  <div className="text-2xl font-mono font-black text-slate-800">
                    {Math.floor(dispatchETA / 60)}:{(dispatchETA % 60).toString().padStart(2, "0")} Mins
                  </div>
                  <span className="text-[8px] text-slate-400 uppercase tracking-wider">Traffic Bypass Layer On</span>
                </div>

                <div className="bg-slate-100 border border-slate-200 rounded-2xl p-4 text-center flex flex-col justify-center items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Survival Pathway</span>
                  <div className="text-[12px] font-extrabold text-emerald-600 uppercase flex items-center gap-1.5 animate-pulse bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 mt-1">
                    <CheckCircle className="h-4 w-4 text-emerald-600 shrink-0" />
                    PATHWAY: OPTIMIZED
                  </div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider mt-1.5 font-bold">Safe Routing Engaged</span>
                </div>
              </div>

              {/* Reassurance Alert Message Panel (Replaces Diagnostics) */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-5 flex items-start space-x-3.5 shadow-sm">
                <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 animate-bounce">
                  <Shield className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-slate-800">Help will reach you soon</h4>
                  <p className="text-xs text-slate-600 leading-relaxed font-medium">
                    Your emergency request is verified. The dispatch fleet has bypassed local red lights. **Please stay calm and follow the guidelines on your screen.**
                  </p>
                </div>
              </div>

              {/* Pre-Notification and Family Alerts */}
              <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
                <h4 className="text-xs font-black uppercase text-slate-800 flex items-center gap-1">
                  <FileText className="h-4 w-4 text-orange-500" />
                  Outbound Communications & Telemetry
                </h4>

                <div className="text-xs space-y-2 font-mono">
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <p className="text-[9px] text-slate-500 uppercase font-black">Hospital Pre-Notification</p>
                    <p className="text-[10.5px] text-emerald-600 font-bold">{preNotificationStatus}</p>
                    <p className="text-[8px] text-slate-400 mt-1">
                      Checklist: {selectedEmergency === "heart_attack" ? "Cath lab checklist prep advised." : "FAST stroke team mobilization alert."}
                    </p>
                  </div>

                  <div className="p-2.5 bg-black/40 rounded border border-white/5">
                    <p className="text-[9px] text-gray-500 uppercase font-black">Family SMS Automation (Live GPS Tracking Enabled)</p>
                    <div className="h-12 overflow-y-auto text-[9.5px] text-gray-300 space-y-1 mt-1">
                      {smsSentLogs.map((log, i) => (
                        <div key={i} className="flex gap-1.5 items-start">
                          <span className="text-orange-500">✓</span>
                          <span>{log}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* FHIR HL7 compliance JSON telemetry payload */}
                  <div className="p-2.5 bg-black/40 rounded border border-white/5 space-y-1">
                    <div className="flex justify-between items-center">
                      <p className="text-[9px] text-gray-500 uppercase font-black">FHIR Interoperability Payload</p>
                      <span className="text-[7px] text-emerald-400 font-bold bg-emerald-500/10 px-1 py-0.5 rounded border border-emerald-500/20">HL7 FHIR v4</span>
                    </div>
                    <pre className="text-[7.5px] text-gray-400 bg-black/60 p-2 rounded max-h-24 overflow-y-auto select-all leading-normal">
{JSON.stringify({
  resourceType: "Encounter",
  id: `encounter-sos-${activeEventId?.substring(0,8) || "88a09a"}`,
  status: "in-progress",
  class: { system: "http://terminology.hl7.org/CodeSystem/v3-ActCode", code: "EMER", display: "emergency" },
  subject: { reference: `Patient/${user?.name || "Avnish Kumar"}` },
  reasonCode: [{
    coding: [{
      system: "http://snomed.info/sct",
      code: selectedEmergency === "heart_attack" ? "422504002" : "230690007",
      display: selectedEmergency === "heart_attack" ? "Ischemic heart disease" : "Stroke"
    }]
  }],
  participant: [{
    type: [{ coding: [{ system: "http://terminology.hl7.org/CodeSystem/v3-ParticipationType", code: "ATND" }] }],
    individual: { display: hospitalSelected?.doctorDuty || "Emergency Physician" }
  }],
  hospitalPreNotification: {
    diagnosis: selectedEmergency === "heart_attack" ? "Possible STEMI" : "Possible Stroke FAST alert",
    eta: `${Math.floor(dispatchETA/60)}m`,
    allergies: "Penicillin",
    bloodGroup: "O-positive",
    knownConditions: "Hypertension",
    liveTelemetry: { hr: 104, SpO2: 95 }
  }
}, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= MODE 3: ADMIN CONTROL CENTER ================= */}
        {activeMode === "admin" && (
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden p-6 md:p-8 space-y-6 md:space-y-0 md:space-x-8">
            
            <div className="w-full md:w-1/3 flex flex-col space-y-6">
              
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl glass-panel-dark relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-1 bg-orange-600" />
                
                <h3 className="text-sm font-black uppercase text-white tracking-widest mb-6 flex items-center gap-1.5">
                  <Compass className="h-5 w-5 text-orange-500" />
                  Global Survival Metrics
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/50 p-4 rounded-2xl border border-white/5 text-center">
                    <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Active Alerts</span>
                    <span className="text-3xl font-black text-red-500 font-mono animate-pulse">{adminStats.activeEmergencies}</span>
                  </div>
                  <div className="bg-black/50 p-4 rounded-2xl border border-white/5 text-center">
                    <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Fleet Active</span>
                    <span className="text-3xl font-black text-orange-500 font-mono">{adminStats.ambulancesEnRoute}</span>
                  </div>
                  <div className="bg-black/50 p-4 rounded-2xl border border-white/5 text-center">
                    <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Response Time</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">{adminStats.avgResponseTime}</span>
                  </div>
                  <div className="bg-black/50 p-4 rounded-2xl border border-white/5 text-center">
                    <span className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Survival Pathway</span>
                    <span className="text-2xl font-black text-blue-400 font-mono">{adminStats.survivalRate}</span>
                  </div>
                </div>
              </div>

              {/* Triage Analytics log */}
              <div className="bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl glass-panel-dark flex-grow flex flex-col justify-between overflow-hidden h-[300px]">
                <div>
                  <h4 className="text-xs font-black uppercase text-white mb-3 tracking-widest flex items-center gap-1">
                    <Activity className="h-4.5 w-4.5 text-red-600" />
                    City Incident Replay logs
                  </h4>
                  <div className="h-44 overflow-y-auto font-mono text-[9.5px] text-emerald-400 space-y-1.5 pr-2">
                    {adminLogs.length === 0 ? (
                      <p className="text-gray-500 italic">Listening for incoming telemetry updates...</p>
                    ) : (
                      adminLogs.map((log, i) => (
                        <div key={i} className="border-b border-white/5 pb-1">
                          {log}
                        </div>
                      ))
                    )}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setAdminLogs(prev => [
                      `[REPLAY] Incident #038a - Cardiac triage: AIIMS Delhi prep check completed. Vitals stable.`,
                      `[REPLAY] Incident #038b - Stroke FAST triage: Patient en-route to Max Hospital.`,
                      ...prev
                    ]);
                  }}
                  className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold text-center text-gray-300 transition-colors mt-4 cursor-pointer"
                >
                  LOAD SIMULATED HISTORICAL LOGS
                </button>
              </div>

            </div>

            <div className="w-full md:w-2/3 flex flex-col bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl glass-panel-dark relative overflow-hidden h-full">
              
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                <div>
                  <h3 className="text-sm font-black uppercase text-white tracking-widest">
                    Enterprise Dispatch Dashboard
                  </h3>
                  <p className="text-[10px] text-gray-400">Delhi-NCR City Emergency Grid and Active Ambulance fleet vectors</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 bg-red-500 rounded-full animate-ping" />
                  <span className="text-[9.5px] font-bold text-red-500 tracking-wider">LIVE HEATMAP FEED</span>
                </div>
              </div>

              <div className="flex-grow bg-black/60 border border-white/5 rounded-2xl relative overflow-hidden min-h-[350px]">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M 0,10 H 100 M 0,20 H 100 M 0,30 H 100 M 0,40 H 100 M 0,50 H 100 M 0,60 H 100 M 0,70 H 100 M 0,80 H 100 M 0,90 H 100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  <path d="M 10,0 V 100 M 20,0 V 100 M 30,0 V 100 M 40,0 V 100 M 50,0 V 100 M 60,0 V 100 M 70,0 V 100 M 80,0 V 100 M 90,0 V 100" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                  <path d="M 10,20 L 90,80 M 80,10 L 20,90 M 10,50 L 90,50 M 50,10 V 90" stroke="rgba(255,255,255,0.07)" strokeWidth="1.5" />
                  <defs>
                    <radialGradient id="heat1" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heat2" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id="heat3" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="35" cy="45" r="15" fill="url(#heat1)" className="animate-pulse" />
                  <circle cx="70" cy="30" r="12" fill="url(#heat2)" />
                  <circle cx="20" cy="75" r="18" fill="url(#heat3)" className="animate-pulse" />
                  <circle cx="42" cy="30" r="2.5" fill="#FF6B00" />
                  <circle cx="73" cy="55" r="2.5" fill="#FF6B00" />
                  <circle cx="28" cy="80" r="2.5" fill="#FF6B00" />
                </svg>

                <div className="absolute bottom-4 left-4 bg-black/80 border border-white/10 p-3 rounded-xl text-[9px] text-gray-400 space-y-1">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    <span>Critical Alert Density (High)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    <span>Urgent Alert Density (Medium)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-brand-orange border border-white" />
                    <span>Ambulance (Active)</span>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ================= SURVIVAL MOAT LAYERS VISUALIZER ================= */}
        {activeMode === "moat" && (
          <div className="flex-grow flex flex-col md:flex-row overflow-hidden p-6 md:p-8 space-y-6 md:space-y-0 md:space-x-8">
            
            <div className="w-full md:w-1/3 flex flex-col space-y-3 shrink-0">
              <span className="text-[10px] font-black uppercase text-red-500 tracking-widest px-2">
                Healix Survival Pathway Engine
              </span>
              <h2 className="text-lg font-black uppercase text-white px-2 tracking-wide">
                Proprietary AI Moats
              </h2>
              <p className="text-[11px] text-gray-400 px-2 pb-2">
                Unlike simple vehicle booking apps, Healix is an advanced reinforcement learning life-support matrix. Click layers below to inspect.
              </p>

              {[
                { title: "Layer 1: Adaptive Emergency Brain", subtitle: "Pathways optimized from 10k+ cases" },
                { title: "Layer 2: Voice Biomarker Engine", subtitle: "Speech breaks & respiratory triage prediction" },
                { title: "Layer 3: Survival Probability Routing", subtitle: "Nearest vs Best Survival outcome routing" },
                { title: "Layer 4: Hospital Readiness Network", subtitle: "Pre-alert checklists & live vitals terminal" },
                { title: "Layer 5: Incident Replay Learning", subtitle: "Feedback loops that self-correct the city" },
                { title: "Infrastructure Technical Blueprint", subtitle: "Multi-region failovers, Kafka & FHIR layers" }
              ].map((layer, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedMoatLayer(index)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedMoatLayer === index
                      ? "bg-gradient-to-r from-emerald-950/45 to-emerald-900/30 border-emerald-500/50 shadow-md shadow-emerald-500/10"
                      : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-emerald-500/30"
                  }`}
                >
                  <div className="flex items-center space-x-2.5">
                    <div className={`h-6 w-6 rounded-lg flex items-center justify-center text-[10px] font-bold ${
                      selectedMoatLayer === index ? "bg-emerald-500 text-white" : "bg-white/15 text-gray-400"
                    }`}>
                      {index === 5 ? <Server className="h-3 w-3" /> : index + 1}
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase text-white tracking-wide">{layer.title}</h4>
                      <p className="text-[9.5px] text-gray-400 mt-0.5">{layer.subtitle}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Col: Layer Telemetry Sandbox */}
            <div className="flex-grow bg-white/5 border border-white/10 rounded-3xl p-6 shadow-2xl glass-panel-dark flex flex-col overflow-y-auto">
              
              {/* Layer 1 Pane */}
              {selectedMoatLayer === 0 && (
                <div className="space-y-5">
                  <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase text-emerald-400">Layer 1 — Adaptive Emergency Intelligence Brain</h3>
                      <p className="text-[10px] text-gray-400">Fixed checklists fail. Dynamic AI pathways adjust instructions dynamically based on survival weights.</p>
                    </div>
                    <Layers className="h-6 w-6 text-emerald-500" />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-[9px] text-gray-400 block mb-1">LEARNING RATE</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">0.02 (Adaptive)</span>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-[9px] text-gray-400 block mb-1">TRAINING DATASET SIZE</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">12,854 Events</span>
                    </div>
                    <div className="bg-black/50 p-4 rounded-xl border border-white/5 text-center">
                      <span className="text-[9px] text-gray-400 block mb-1">MODEL SURVIVAL SCORE</span>
                      <span className="text-xl font-black text-emerald-400 font-mono">{rlSurvivalRate}%</span>
                    </div>
                  </div>

                  <div className="p-4 bg-black/40 border border-white/5 rounded-xl text-xs space-y-3">
                    <h4 className="font-bold text-gray-200 uppercase flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      Model Survival Optimizations Curve
                    </h4>
                    <div className="h-28 w-full border-l border-b border-white/10 relative overflow-hidden flex items-end">
                      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M 0,90 Q 30,70 60,35 T 100,10" fill="none" stroke="#10B981" strokeWidth="2.5" />
                        <circle cx="100" cy="10" r="3.5" fill="#10B981" className="animate-pulse" />
                      </svg>
                      <div className="absolute top-2 left-2 text-[8px] text-gray-500">Survival Pathway (97.4%)</div>
                      <div className="absolute bottom-2 right-2 text-[8px] text-gray-500">Trained Epochs (12,850 cases)</div>
                    </div>
                  </div>

                  <div className="p-4 bg-white/5 border border-white/5 rounded-xl text-xs space-y-2">
                    <h4 className="font-bold text-gray-200 uppercase">Learned Decision Path (Chest Pain)</h4>
                    <div className="grid grid-cols-2 gap-4 text-[10.5px]">
                      <div className="bg-red-950/20 p-3 rounded-lg border border-red-500/10">
                        <span className="text-red-400 block font-bold mb-1">Standard Checklist (No AI)</span>
                        <p className="text-gray-400">Call doctor → await callback → dispatch nearest vehicle. (Average survival outcome: 64%)</p>
                      </div>
                      <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-500/10">
                        <span className="text-emerald-400 block font-bold mb-1">Learned Healix Guidance</span>
                        <p className="text-emerald-200">Sit upright + chew aspirin immediately + trigger pre-op hospital prep. (Average survival outcome: 96%)</p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={runRlSimulation}
                    disabled={rlRunning}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-900 transition-colors text-white font-extrabold rounded-xl text-xs tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Cpu className={`h-4 w-4 ${rlRunning ? "animate-spin" : ""}`} />
                    {rlRunning ? "RUNNING DEEP LEARNING GRADIENT OPTIMIZER..." : "SIMULATE REINFORCEMENT LEARNING EPOCH"}
                  </button>

                  <div className="h-20 overflow-y-auto font-mono text-[9px] text-emerald-400 bg-black/60 border border-white/5 p-2 rounded-xl">
                    {rlLogs.map((log, i) => <div key={i}>{log}</div>)}
                  </div>
                </div>
              )}

              {/* Layer 2 Pane */}
              {selectedMoatLayer === 1 && (
                <div className="space-y-5">
                  <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase text-emerald-400">Layer 2 — Emergency Voice Biomarker Engine</h3>
                      <p className="text-[10px] text-gray-400">Advanced transformer models analyze acoustic and stress inputs to diagnose distress severity index.</p>
                    </div>
                    <Mic className="h-6 w-6 text-emerald-500" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-wider block">Simulate Microphone Input phrases:</span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => simulateVoiceInput("breathing")}
                        className="px-3.5 py-2 bg-red-950/30 hover:bg-red-950/60 border border-red-500/30 rounded-xl text-xs font-bold text-red-300 transition-all cursor-pointer"
                      >
                        "I... I can't... breathe..."
                      </button>
                      <button
                        onClick={() => simulateVoiceInput("stroke")}
                        className="px-3.5 py-2 bg-purple-950/30 hover:bg-purple-950/60 border border-purple-500/30 rounded-xl text-xs font-bold text-purple-300 transition-all cursor-pointer"
                      >
                        "My grandfather collapsed... face is drooping..."
                      </button>
                      <button
                        onClick={() => simulateVoiceInput("minor")}
                        className="px-3.5 py-2 bg-slate-800/80 hover:bg-slate-700/80 border border-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all cursor-pointer"
                      >
                        "I fell down and scraped my knee..."
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-black/40 border border-white/5 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                      <span className="font-bold text-gray-300">Biomarker Audio Status:</span>
                      <span className="font-mono text-emerald-400 text-[10px]">{simulatedVoiceLog}</span>
                    </div>

                    {simulatedVoiceAnalysis ? (
                      <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                        <div className="space-y-2">
                          <p><span className="text-gray-500">GASPS DETECTED:</span> <span className="text-white">{simulatedVoiceAnalysis.gaspDetected}</span></p>
                          <p><span className="text-gray-500">VOCAL TREMOR:</span> <span className="text-white">{simulatedVoiceAnalysis.tremorDetected}</span></p>
                          <p><span className="text-gray-500">SPEECH DELAYS:</span> <span className="text-white">{simulatedVoiceAnalysis.speechBreaks}</span></p>
                        </div>
                        <div className="p-3.5 bg-white/5 border border-white/5 rounded-xl flex flex-col justify-between">
                          <div>
                            <span className="text-[8px] text-gray-400 uppercase">CLASSIFICATION MODEL</span>
                            <p className="font-bold text-red-400 text-xs mt-0.5">{simulatedVoiceAnalysis.classification}</p>
                          </div>
                          <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
                            <span className="text-[8px] text-gray-400 uppercase">PROBABILITY</span>
                            <span className="text-base font-black text-red-500">{simulatedVoiceAnalysis.probability}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-28 flex items-center justify-center text-gray-500 text-xs italic">
                        Select one of the sample voice inputs above to trigger real-time AI speech analysis telemetry.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Layer 3 Pane */}
              {selectedMoatLayer === 2 && (
                <div className="space-y-5">
                  <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase text-emerald-400">Layer 3 — Survival Probability Routing Algorithm</h3>
                      <p className="text-[10px] text-gray-400">Healix rejects simple nearest-distance math. Our optimizer routes exclusively to the hospital yielding the highest survival probability.</p>
                    </div>
                    <Compass className="h-6 w-6 text-emerald-500" />
                  </div>

                  <div className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-4">
                    <span className="text-[10.5px] font-black uppercase text-gradient-orange tracking-widest block">Survival Optimization Calculus</span>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      {/* Nearest Hospital A */}
                      <div className="p-4 bg-red-950/15 border border-red-500/25 rounded-2xl flex flex-col justify-between h-44">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-red-500/20 text-red-400 text-[8px] font-bold px-2 py-0.5 rounded border border-red-500/20">NEAREST</span>
                            <span className="text-gray-400 text-[9px]">Dist: 2.1 km</span>
                          </div>
                          <h4 className="font-bold text-white text-xs uppercase">Fortis Noida (Sector 62)</h4>
                          <ul className="text-[9.5px] text-gray-400 mt-2.5 space-y-1">
                            <li>• Travel time: 6 mins</li>
                            <li>• Specialty: General ICU</li>
                            <li>• Cath Lab queue: 0 (No active unit)</li>
                          </ul>
                        </div>
                        <div className="border-t border-white/5 pt-2 flex justify-between items-center mt-4">
                          <span className="text-[9.5px] text-gray-400 uppercase">SURVIVAL CHANCE</span>
                          <span className="text-lg font-black text-red-500 font-mono">58%</span>
                        </div>
                      </div>

                      {/* Best Survival Hospital B */}
                      <div className="p-4 bg-emerald-950/20 border border-emerald-500/35 rounded-2xl flex flex-col justify-between h-44">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="bg-emerald-500/20 text-emerald-400 text-[8px] font-bold px-2 py-0.5 rounded border border-emerald-500/20">RECOMMENDED</span>
                            <span className="text-gray-400 text-[9px]">Dist: 11.2 km</span>
                          </div>
                          <h4 className="font-bold text-emerald-300 text-xs uppercase">AIIMS Delhi (STEMI Unit)</h4>
                          <ul className="text-[9.5px] text-emerald-300 mt-2.5 space-y-1">
                            <li>• Travel time: 11 mins</li>
                            <li>• Specialty: Dedicated Cath Lab</li>
                            <li>• Queue status: 0 wait-time cleared</li>
                          </ul>
                        </div>
                        <div className="border-t border-white/5 pt-2 flex justify-between items-center mt-4">
                          <span className="text-[9.5px] text-emerald-300 uppercase">SURVIVAL CHANCE</span>
                          <span className="text-lg font-black text-emerald-400 font-mono">96%</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3.5 bg-black/40 border border-white/5 rounded-xl text-[10px] leading-relaxed text-gray-400 font-mono">
                      <strong>AI decision matrix</strong>: Hospital B is physically 5 minutes further away. However, since Hospital A lacks active cardiac catheterization prep facilities, routing to A would cause an arrival-to-treatment lag of 32 minutes (waiting for transfers). Healix chooses Hospital B, improving survival outcomes by <strong>+38%</strong>.
                    </div>
                  </div>
                </div>
              )}

              {/* Layer 4 Pane */}
              {selectedMoatLayer === 3 && (
                <div className="space-y-5">
                  <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase text-emerald-400">Layer 4 — Hospital Readiness Network Integration</h3>
                      <p className="text-[10px] text-gray-400">Partner hospitals receive active, live diagnostic feeds and checklists BEFORE the patient arrives to eliminate triage waiting times.</p>
                    </div>
                    <FileText className="h-6 w-6 text-emerald-500" />
                  </div>

                  <div className="bg-black/60 border border-white/10 rounded-2xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4.5 w-4.5 text-red-500 animate-pulse" />
                        <span className="text-xs font-black uppercase text-white font-mono">AIIMS ER trauma console - LIVE FEED</span>
                      </div>
                      <span className="text-[9px] font-bold text-red-500 bg-red-500/10 px-2.5 py-0.5 rounded border border-red-500/20 animate-pulse">
                        INCOMING PATIENT PRE-ALERT
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-xs font-mono text-gray-300">
                      <div className="space-y-2">
                        <p><span className="text-gray-500">Patient:</span> <span className="text-white">{user?.name || "Avnish Kumar"}</span></p>
                        <p><span className="text-gray-500">ESTIMATED ETA:</span> <span className="text-red-400 font-bold">06:42 mins</span></p>
                        <p><span className="text-gray-500">PREDICTED DIAGNOSIS:</span> <span className="text-red-400">Acute STEMI (Heart attack)</span></p>
                        <p><span className="text-gray-500">TRIAGE URGENCY:</span> <span className="text-red-500 font-bold">Category 1 (Immediate)</span></p>
                      </div>

                      <div className="bg-white/5 border border-white/5 p-3 rounded-xl space-y-1.5">
                        <span className="text-[8px] text-gray-400 uppercase font-black">Pre-Op Action checklist</span>
                        <div className="space-y-1 text-[9.5px]">
                          <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> <span>Prep Cath Lab Table 3</span></div>
                          <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> <span>Mobilize bypass cardiac crew</span></div>
                          <div className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-emerald-500" /> <span>Prep Heparin & Thrombolytic kits</span></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex items-center justify-between text-xs font-mono">
                      <div>
                        <span className="text-[8px] text-gray-500 uppercase">WEARABLE TELEMETRY SYNC</span>
                        <p className="text-emerald-400 text-xs font-bold mt-0.5">HR: 104 bpm | SpO2: 95% | Rhythm: Sinus Tachycardia</p>
                      </div>
                      <div className="h-6 w-24 overflow-hidden relative">
                        <svg className="w-full h-full text-emerald-500" viewBox="0 0 100 30" preserveAspectRatio="none">
                          <path d="M0,15 L30,15 L35,5 L40,25 L45,15 L70,15 L75,5 L80,25 L85,15 L100,15" fill="none" stroke="currentColor" strokeWidth="1.5" className="animate-ecg-line" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Layer 5 Pane */}
              {selectedMoatLayer === 4 && (
                <div className="space-y-5">
                  <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase text-emerald-400">Layer 5 — Incident Replay Learning Engine</h3>
                      <p className="text-[10px] text-gray-400">Every incident is dynamically replayed and evaluated anonymously to detect dispatch lag and self-correct route weights.</p>
                    </div>
                    <RotateCcw className="h-6 w-6 text-emerald-500" />
                  </div>

                  <div className="space-y-4">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-wider block">Incident Replay Scrubbing timeline:</span>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={replayTime}
                      onChange={(e) => setReplayTime(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                    />

                    <div className="grid grid-cols-3 text-[10px] font-mono text-gray-500 uppercase font-black">
                      <span>0:00 (Call placed)</span>
                      <span className="text-center">5:00 (Enroute)</span>
                      <span className="text-right">10:00 (Arrived)</span>
                    </div>
                  </div>

                  <div className="p-5 bg-black/40 border border-white/5 rounded-2xl space-y-3 font-mono">
                    <div className="flex items-center justify-between text-xs border-b border-white/5 pb-2">
                      <span className="font-bold text-emerald-400 uppercase tracking-widest">{currentReplay.step}</span>
                      <span className="text-gray-400 font-bold">{currentReplay.time} MIN</span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed italic">
                      "{currentReplay.desc}"
                    </p>
                  </div>

                  <div className="p-3.5 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-[10px] leading-relaxed text-emerald-200">
                    <strong>Moat Loop</strong>: Feedback analysis identifies that the ambulance spent 42 seconds waiting at Noida bypass. The model updates the city street weights database instantly, routing future emergency vectors around Sector 62.
                  </div>
                </div>
              )}

              {/* Tech Architecture Pane */}
              {selectedMoatLayer === 5 && (
                <div className="space-y-5">
                  <div className="border-b border-white/10 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-black uppercase text-emerald-400">Enterprise Technical Architecture</h3>
                      <p className="text-[10px] text-gray-400">Complete multi-region resilient failover layout driving Healix's hospital interoperability networks.</p>
                    </div>
                    <Server className="h-6 w-6 text-emerald-500" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-black/60 border border-white/5 p-4 rounded-xl space-y-3">
                      <span className="text-[9.5px] font-black text-gradient-orange uppercase block">Application stack</span>
                      <div className="space-y-2 text-[10.5px]">
                        <p><strong className="text-white block font-bold">Frontend Portal:</strong> React Native, Framer Motion, WebRTC streams, Offline Emergency caches.</p>
                        <p><strong className="text-white block font-bold">Backend Services:</strong> Node.js, Express APIs, Redis cache, PostgreSQL DB, Kafka event streaming queues.</p>
                      </div>
                    </div>

                    <div className="bg-black/60 border border-white/5 p-4 rounded-xl space-y-3">
                      <span className="text-[9.5px] font-black text-emerald-400 uppercase block">AI & Infrastructure</span>
                      <div className="space-y-2 text-[10.5px]">
                        <p><strong className="text-white block font-bold">AI Triage Models:</strong> Whisper audio pipeline, voice stress transformers, routing optimizers, reinforcement learning engine.</p>
                        <p><strong className="text-white block font-bold">AWS Cloud & Interop:</strong> AWS multi-region failovers, Geo-indexing clusters, FHIR healthcare compliance layers.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

          </div>
        )}

      </main>

      {/* ECG Live visual scrolling bar at bottom */}
      <div className="relative h-1 bg-white/5 overflow-hidden shrink-0 border-t border-white/5">
        <div className="absolute inset-0 bg-red-600/25 animate-pulse" />
      </div>

    </div>
  );
}

export interface CallState {
  bookingId: string;
  patientName: string;
  doctorName: string;
  status: "calling" | "connected" | "ended";
  offer?: any;
  answer?: any;
  patientCandidates: any[];
  doctorCandidates: any[];
  updatedAt: number;
}

// Persist the active calls map on the global object in Next.js dev server
if (!(global as any).activeCalls) {
  (global as any).activeCalls = new Map<string, CallState>();
}

export const activeCalls = (global as any).activeCalls as Map<string, CallState>;

// Helper to clean up old ended/stale calls (older than 10 minutes)
export function cleanStaleCalls() {
  const now = Date.now();
  for (const [key, call] of activeCalls.entries()) {
    if (call.status === "ended" || now - call.updatedAt > 600000) {
      activeCalls.delete(key);
    }
  }
}

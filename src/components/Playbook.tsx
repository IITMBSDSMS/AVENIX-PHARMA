"use client";

import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppState, Role, Order, NotificationAlert } from "@/context/AppState";
import { 
  Sparkles, CheckCircle2, Play, ArrowRight, X, MessageSquare, 
  Bell, RotateCcw, ShieldCheck, Truck, Smartphone, Mail, Settings2, User, ChevronUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Playbook() {
  const router = useRouter();
  const pathname = usePathname();
  const { 
    role, login, orders, medicines, addToCart, placeOrder, 
    updateOrderStatus, notificationAlerts, cart, clearCart 
  } = useAppState();

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"tour" | "roles" | "alerts" | "ai">("tour");
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Welcome to Avenix! I can assist you with clinical triage, drug info, or guide you through this simulation dashboard. How can I help?" }
  ]);
  const [isTyping, setIsTyping] = useState(false);

  // Auto-open playbook on first visit after 2 seconds to welcome the user
  useEffect(() => {
    const hasVisited = localStorage.getItem("avenix_playbook_opened");
    if (!hasVisited) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("avenix_playbook_opened", "true");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  // Find active orders for quick controls
  const pendingOrder = orders.find(o => o.status === "pending");
  const verifiedOrder = orders.find(o => o.status === "verified");
  const activeOrderCount = orders.length;

  const currentStep = () => {
    if (orders.length === 0) return 1; // Step 1: Place Order
    if (pendingOrder) return 2; // Step 2: Pharmacist Verification
    if (verifiedOrder) return 3; // Step 3: Pharmacist Dispatch
    const dispatchedOrder = orders.find(o => o.status === "dispatched");
    if (dispatchedOrder) return 4; // Step 4: Track GPS / Customer Dashboard
    return 5; // Step 5: Admin Analytics / Finished
  };

  const handleQuickOrder = () => {
    const dolo = medicines.find(m => m.id === "1"); // Paracetamol 650mg
    if (dolo) {
      addToCart(dolo, 2);
      // Give a tiny timeout so cart updates before placing order
      setTimeout(() => {
        placeOrder("Simulated Test Patient");
        setActiveTab("tour");
      }, 200);
    }
  };

  const handleQuickVerify = async () => {
    if (pendingOrder) {
      await login("pharmacist");
      await updateOrderStatus(pendingOrder.id, "verified");
      router.push("/dashboard/pharmacist");
    }
  };

  const handleQuickDispatch = async () => {
    if (verifiedOrder) {
      await login("pharmacist");
      await updateOrderStatus(verifiedOrder.id, "dispatched");
      router.push("/dashboard/customer");
    }
  };

  const handleResetSimulation = () => {
    clearCart();
    // In our context, we don't have a direct clearOrders method, so refreshing resets simulated state to defaults
    window.location.reload();
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = chatInput;
    setChatMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsTyping(true);

    // Mock responses reflecting Avenix clinical context
    setTimeout(() => {
      let reply = "I am processing your clinical question. For urgent safety, please refer to our full diagnostic portal or call our emergency hotline.";
      const query = userMsg.toLowerCase();

      if (query.includes("dolo") || query.includes("paracetamol")) {
        reply = "Paracetamol 650mg (Dolo) is safe for fever and minor pains. Standard dosage is 1 tablet every 6 hours (Max 4g/day). Side effects: Hepatotoxicity if overdosed. OTC Safe.";
      } else if (query.includes("amoxicillin") || query.includes("antibiotic")) {
        reply = "Amoxicillin 500mg is a penicillin-class antibiotic requiring a doctor's prescription. Do not stop midway. Safe dosage is usually 1-1-1 after food for 5 days.";
      } else if (query.includes("emergency") || query.includes("fast")) {
        reply = "If you are experiencing chest pain or severe trauma, toggle the red 'Emergency Delivery' link in the top bar to trigger high-speed 10-minute dispatch routing.";
      } else if (query.includes("how to run") || query.includes("test") || query.includes("demo")) {
        reply = "Go to Tour Guide tab! 1. Click 'Quick-Order' to place an order. 2. Switch to Pharmacist to approve. 3. Watch the GPS rider live on the Customer Dashboard!";
      }

      setChatMessages((prev) => [...prev, { sender: "ai", text: reply }]);
      setIsTyping(false);
    }, 1200);
  };

  const currentStepNum = currentStep();

  return (
    <div className="fixed bottom-5 right-5 z-[9999] font-sans selection:bg-brand-orange selection:text-white">
      {/* Floating Pulse Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            layoutId="playbook-box"
            onClick={() => setIsOpen(true)}
            className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-dark border-2 border-brand-orange text-white shadow-[0_0_30px_rgba(255,107,0,0.45)] hover:shadow-[0_0_40px_rgba(255,107,0,0.65)] hover:scale-105 transition-all duration-300 relative group cursor-pointer"
          >
            <Settings2 className="h-6 w-6 text-brand-orange group-hover:rotate-45 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-orange text-[9px] font-black text-white animate-bounce shadow-md">
              {currentStepNum === 5 ? "✓" : currentStepNum}
            </span>
            <div className="absolute -inset-2 rounded-full border border-brand-orange/20 animate-ping -z-10" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Sidebar Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            layoutId="playbook-box"
            className="w-[360px] sm:w-[400px] h-[520px] rounded-3xl border border-gray-200 bg-white/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col glass-card relative"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
          >
            {/* Header branding */}
            <div className="bg-brand-dark text-white p-4 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-2">
                <div className="h-2.5 w-2.5 rounded-full bg-brand-orange animate-pulse" />
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-brand-orange tracking-[0.2em] uppercase">AVENIX SIMULATOR</span>
                  <span className="text-xs font-extrabold text-white tracking-wide">Interactive Platform Playbook</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={handleResetSimulation}
                  title="Reset Demo Simulation"
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Menu Tabs */}
            <div className="grid grid-cols-4 bg-gray-50 border-b border-gray-150 text-[10px] font-bold text-gray-500">
              <button 
                onClick={() => setActiveTab("tour")}
                className={`py-2.5 border-b-2 text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${activeTab === "tour" ? "border-brand-orange text-brand-orange bg-white" : "border-transparent hover:bg-gray-100/50"}`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                Playbook
              </button>
              <button 
                onClick={() => setActiveTab("roles")}
                className={`py-2.5 border-b-2 text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${activeTab === "roles" ? "border-brand-orange text-brand-orange bg-white" : "border-transparent hover:bg-gray-100/50"}`}
              >
                <User className="h-3.5 w-3.5" />
                Role Control
              </button>
              <button 
                onClick={() => setActiveTab("alerts")}
                className={`py-2.5 border-b-2 text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${activeTab === "alerts" ? "border-brand-orange text-brand-orange bg-white" : "border-transparent hover:bg-gray-100/50"}`}
              >
                <Bell className="h-3.5 w-3.5" />
                Alerts ({notificationAlerts.length})
              </button>
              <button 
                onClick={() => setActiveTab("ai")}
                className={`py-2.5 border-b-2 text-center transition-colors cursor-pointer flex flex-col items-center gap-1 ${activeTab === "ai" ? "border-brand-orange text-brand-orange bg-white" : "border-transparent hover:bg-gray-100/50"}`}
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Quick AI
              </button>
            </div>

            {/* Tab Contents */}
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              
              {/* TOUR TAB */}
              {activeTab === "tour" && (
                <div className="space-y-3.5">
                  <div className="p-3 bg-brand-orange/5 border border-brand-orange/10 rounded-2xl">
                    <p className="text-[11px] text-brand-orange-dark font-bold leading-relaxed">
                      Follow the workflow checklist below to watch Avenix's smart pharmaceutical delivery network react in real-time.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {/* Step 1 */}
                    <div className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${currentStepNum === 1 ? "bg-white border-brand-orange shadow-md shadow-brand-orange/5" : "bg-gray-50/50 border-gray-100"}`}>
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {activeOrderCount > 0 ? (
                            <CheckCircle2 className="h-4.5 w-4.5 text-green-600 fill-green-50" />
                          ) : (
                            <div className="h-4.5 w-4.5 rounded-full border-2 border-brand-orange flex items-center justify-center text-[9px] font-black text-brand-orange bg-white">1</div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-gray-800">Place an Order</h4>
                          <p className="text-[10px] text-gray-450 leading-relaxed">Place a digital prescription order inside the medicine catalog.</p>
                        </div>
                      </div>
                      {activeOrderCount === 0 && (
                        <button 
                          onClick={handleQuickOrder}
                          className="px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-light text-white text-[9px] font-bold uppercase rounded-lg shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          Quick-Order
                        </button>
                      )}
                    </div>

                    {/* Step 2 */}
                    <div className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${currentStepNum === 2 ? "bg-white border-brand-orange shadow-md shadow-brand-orange/5" : "bg-gray-50/50 border-gray-100 opacity-80"}`}>
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {orders.some(o => o.status === "verified" || o.status === "dispatched" || o.status === "delivered") ? (
                            <CheckCircle2 className="h-4.5 w-4.5 text-green-600 fill-green-50" />
                          ) : (
                            <div className="h-4.5 w-4.5 rounded-full border-2 border-gray-300 flex items-center justify-center text-[9px] font-black text-gray-400 bg-white">2</div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-gray-800">Pharmacist Verification</h4>
                          <p className="text-[10px] text-gray-450 leading-relaxed">Approve the medical safety prescription slips.</p>
                        </div>
                      </div>
                      {pendingOrder && (
                        <button 
                          onClick={handleQuickVerify}
                          className="px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-light text-white text-[9px] font-bold uppercase rounded-lg shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          Verify Rx
                        </button>
                      )}
                    </div>

                    {/* Step 3 */}
                    <div className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${currentStepNum === 3 ? "bg-white border-brand-orange shadow-md shadow-brand-orange/5" : "bg-gray-50/50 border-gray-100 opacity-80"}`}>
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {orders.some(o => o.status === "dispatched" || o.status === "delivered") ? (
                            <CheckCircle2 className="h-4.5 w-4.5 text-green-600 fill-green-50" />
                          ) : (
                            <div className="h-4.5 w-4.5 rounded-full border-2 border-gray-300 flex items-center justify-center text-[9px] font-black text-gray-400 bg-white">3</div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-gray-800">Dispatch courier rider</h4>
                          <p className="text-[10px] text-gray-450 leading-relaxed">Approve inventory and dispatch the delivery courier.</p>
                        </div>
                      </div>
                      {verifiedOrder && (
                        <button 
                          onClick={handleQuickDispatch}
                          className="px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-light text-white text-[9px] font-bold uppercase rounded-lg shadow-sm cursor-pointer whitespace-nowrap animate-pulse"
                        >
                          Dispatch
                        </button>
                      )}
                    </div>

                    {/* Step 4 */}
                    <div className={`p-3 rounded-2xl border transition-all flex items-start justify-between gap-3 ${currentStepNum === 4 ? "bg-white border-brand-orange shadow-md shadow-brand-orange/5" : "bg-gray-50/50 border-gray-100 opacity-80"}`}>
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {orders.some(o => o.status === "delivered") ? (
                            <CheckCircle2 className="h-4.5 w-4.5 text-green-600 fill-green-50" />
                          ) : (
                            <div className="h-4.5 w-4.5 rounded-full border-2 border-gray-300 flex items-center justify-center text-[9px] font-black text-gray-400 bg-white">4</div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-gray-800">Track & Billing Receipt</h4>
                          <p className="text-[10px] text-gray-450 leading-relaxed">Follow GPS coordinates & print the professional invoice.</p>
                        </div>
                      </div>
                      {orders.some(o => o.status === "dispatched") && (
                        <button 
                          onClick={() => {
                            login("customer");
                            router.push("/dashboard/customer");
                          }}
                          className="px-3 py-1.5 bg-brand-orange hover:bg-brand-orange-light text-white text-[9px] font-bold uppercase rounded-lg shadow-sm cursor-pointer whitespace-nowrap"
                        >
                          Track Live
                        </button>
                      )}
                    </div>

                    {/* Step 5 */}
                    <div className="p-3 rounded-2xl border border-gray-100 bg-gray-50/50 flex items-start justify-between gap-3 opacity-80">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          {orders.some(o => o.status === "delivered") ? (
                            <CheckCircle2 className="h-4.5 w-4.5 text-green-600 fill-green-50" />
                          ) : (
                            <div className="h-4.5 w-4.5 rounded-full border-2 border-gray-300 flex items-center justify-center text-[9px] font-black text-gray-400 bg-white">5</div>
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <h4 className="text-xs font-bold text-gray-800">Enterprise Dashboard</h4>
                          <p className="text-[10px] text-gray-450 leading-relaxed">Inspect sales records inside the Super Admin panel.</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          login("admin");
                          router.push("/dashboard/admin");
                        }}
                        className="px-3 py-1.5 bg-gray-700 hover:bg-gray-850 text-white text-[9px] font-bold uppercase rounded-lg shadow-sm cursor-pointer whitespace-nowrap"
                      >
                        Enterprise
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* ROLES TAB */}
              {activeTab === "roles" && (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 border border-gray-150 rounded-2xl text-[10.5px] text-gray-500 leading-relaxed">
                    Switch user terminals instantly. Changing your role re-renders dashboards and permissions dynamically.
                  </div>

                  <div className="grid grid-cols-1 gap-2.5">
                    {/* Customer */}
                    <button 
                      onClick={() => {
                        login("customer");
                        router.push("/dashboard/customer");
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${role === "customer" ? "bg-brand-orange/5 border-brand-orange text-brand-orange" : "bg-white border-gray-150 text-gray-700 hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Smartphone className="h-4 w-4" />
                        <div>
                          <p className="text-xs font-bold">Customer Portal</p>
                          <p className="text-[9px] text-gray-400">Order medicines, view reminders, download invoices</p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                    </button>

                    {/* Pharmacist */}
                    <button 
                      onClick={() => {
                        login("pharmacist");
                        router.push("/dashboard/pharmacist");
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${role === "pharmacist" ? "bg-brand-orange/5 border-brand-orange text-brand-orange" : "bg-white border-gray-150 text-gray-700 hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="h-4 w-4" />
                        <div>
                          <p className="text-xs font-bold">Pharmacist Terminal</p>
                          <p className="text-[9px] text-gray-400">Approve prescriptions, dispatch couriers, edit stock</p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                    </button>

                    {/* Doctor */}
                    <button 
                      onClick={() => {
                        login("doctor");
                        router.push("/dashboard/doctor");
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${role === "doctor" ? "bg-brand-orange/5 border-brand-orange text-brand-orange" : "bg-white border-gray-150 text-gray-700 hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <User className="h-4 w-4" />
                        <div>
                          <p className="text-xs font-bold">Doctor Terminal</p>
                          <p className="text-[9px] text-gray-400">Manage patient consult queue, issue e-prescriptions</p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                    </button>

                    {/* Admin */}
                    <button 
                      onClick={() => {
                        login("admin");
                        router.push("/dashboard/admin");
                      }}
                      className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${role === "admin" ? "bg-brand-orange/5 border-brand-orange text-brand-orange" : "bg-white border-gray-150 text-gray-700 hover:bg-gray-50"}`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Settings2 className="h-4 w-4" />
                        <div>
                          <p className="text-xs font-bold">Super Admin Command</p>
                          <p className="text-[9px] text-gray-400">Revenue analytics, live rider GPS radar, fraud checker</p>
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 opacity-60" />
                    </button>
                  </div>
                </div>
              )}

              {/* ALERTS TAB */}
              {activeTab === "alerts" && (
                <div className="space-y-3">
                  <div className="p-3 bg-gray-50 border border-gray-150 rounded-2xl text-[10px] text-gray-500 leading-relaxed flex items-center justify-between">
                    <span>Outbound notification log (Simulated Twilio & SendGrid)</span>
                    <span className="bg-brand-orange/10 text-brand-orange text-[8px] font-black uppercase px-2 py-0.5 rounded-full">ACTIVE</span>
                  </div>

                  {notificationAlerts.length === 0 ? (
                    <div className="py-8 text-center border border-dashed border-gray-200 rounded-2xl bg-white">
                      <Bell className="h-8 w-8 text-gray-300 mx-auto mb-2 animate-bounce" />
                      <p className="text-xs font-bold text-gray-500">No alerts dispatched yet</p>
                      <p className="text-[9px] text-gray-400 mt-0.5">Order changes dispatch notifications</p>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {notificationAlerts.map((alert) => (
                        <div key={alert.id} className="p-3 bg-white border border-gray-100 rounded-xl shadow-xs space-y-1.5 relative overflow-hidden">
                          <div className="absolute top-0 bottom-0 left-0 w-1 bg-brand-orange" />
                          <div className="flex items-center justify-between text-[9px] font-bold">
                            <span className="flex items-center gap-1 text-gray-450 uppercase">
                              {alert.type === "whatsapp" ? (
                                <span className="text-green-600 flex items-center gap-0.5">
                                  <MessageSquare className="h-3 w-3" /> WhatsApp
                                </span>
                              ) : alert.type === "sms" ? (
                                <span className="text-amber-600 flex items-center gap-0.5">
                                  <Smartphone className="h-3 w-3" /> SMS
                                </span>
                              ) : (
                                <span className="text-blue-500 flex items-center gap-0.5">
                                  <Mail className="h-3 w-3" /> Email
                                </span>
                              )}
                              • {alert.recipient}
                            </span>
                            <span className="text-gray-400">{alert.timestamp}</span>
                          </div>
                          <p className="text-[10px] font-medium text-gray-700 whitespace-pre-wrap leading-relaxed">
                            {alert.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* AI CHAT TAB */}
              {activeTab === "ai" && (
                <div className="flex flex-col h-full space-y-3 min-h-[380px]">
                  <div className="flex-grow overflow-y-auto border border-gray-100 rounded-2xl bg-gray-50/50 p-3 space-y-2.5 max-h-[300px]">
                    {chatMessages.map((msg, i) => (
                      <div 
                        key={i} 
                        className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div className={`p-2.5 rounded-2xl text-[10px] max-w-[85%] leading-relaxed ${
                          msg.sender === "user" 
                            ? "bg-brand-orange text-white rounded-br-none" 
                            : "bg-white border border-gray-150 text-gray-800 rounded-bl-none shadow-2xs"
                        }`}>
                          <p className="font-semibold">{msg.text}</p>
                        </div>
                      </div>
                    ))}
                    {isTyping && (
                      <div className="flex justify-start">
                        <div className="p-2.5 rounded-2xl bg-white border border-gray-150 text-[10px] text-gray-400 flex items-center gap-1">
                          <span className="animate-bounce">•</span>
                          <span className="animate-bounce [animation-delay:0.2s]">•</span>
                          <span className="animate-bounce [animation-delay:0.4s]">•</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <form onSubmit={handleSendMessage} className="flex gap-2">
                    <input 
                      type="text"
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      placeholder="Ask about medications, dosages..."
                      className="flex-grow px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-brand-orange focus:ring-1 focus:ring-brand-orange outline-none"
                    />
                    <button 
                      type="submit"
                      className="px-3 py-2 bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Send
                    </button>
                  </form>
                </div>
              )}

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

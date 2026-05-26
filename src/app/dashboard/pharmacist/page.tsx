"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState, Order } from "@/context/AppState";
import { 
  ClipboardList, ShoppingCart, Sliders, CheckCircle2, 
  Truck, ArrowRight, ShieldCheck, DollarSign, Award, Layers,
  FileText
} from "lucide-react";

export default function PharmacistDashboard() {
  const { user, orders, updateOrderStatus, medicines, downloadWelcomePDF } = useAppState();
  
  // Custom stock states to simulate sliders
  const [stockQuantities, setStockQuantities] = useState<Record<string, number>>({
    "1": 250,
    "2": 120,
    "3": 300,
    "4": 180,
    "5": 400
  });

  const handleStockChange = (medId: string, val: number) => {
    setStockQuantities({
      ...stockQuantities,
      [medId]: val
    });
    // In a real app we'd write directly to the medicine index in the context.
    // For our demo context, we let it update locally.
    const target = medicines.find(m => m.id === medId);
    if (target) {
      target.inStock = val;
    }
  };

  // Calculate pharmacist stats
  const totalVerified = orders.filter(o => o.status === "verified" || o.status === "dispatched" || o.status === "delivered").length;
  const pendingOrders = orders.filter(o => o.status === "pending");
  const activeEarnings = orders
    .filter(o => o.status !== "cancelled" && o.status !== "pending")
    .reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <>
      <Navbar />

      <main className="flex-grow medical-grid py-8">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-brand-orange">
                Pharmacist Workspace
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
                Pharmacy Dispatch Hub
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
                <Award className="h-4 w-4" />
                <span>Licensed Pharmacist: {user?.name || "Vikram Singh (R.Ph)"}</span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm glass-card flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide">Pending Verifications</span>
                <div className="text-xl font-black text-brand-dark">{pendingOrders.length} Orders</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm glass-card flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide">Prescriptions Verified</span>
                <div className="text-xl font-black text-green-600">{totalVerified} Items</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-sm glass-card flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wide">Store Revenue (Today)</span>
                <div className="text-xl font-black text-brand-dark">₹{activeEarnings}</div>
              </div>
              <div className="h-10 w-10 rounded-xl bg-brand-orange/10 text-brand-orange flex items-center justify-center">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Orders dispatch table (Col-Span 8) */}
            <div className="lg:col-span-8 space-y-6">
              
              <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-lg glass-card space-y-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3">
                  Live Dispatch Orders Queue
                </h3>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-500">
                        <th className="p-3">Order ID</th>
                        <th className="p-3">Patient Name</th>
                        <th className="p-3">Medicines</th>
                        <th className="p-3">Amount</th>
                        <th className="p-3">Rx Attachment</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 text-gray-700">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50">
                          <td className="p-3 font-mono font-bold text-brand-dark">{order.id}</td>
                          <td className="p-3 font-medium">{order.patientName}</td>
                          <td className="p-3 max-w-[200px] truncate">
                            {order.items.map(item => `${item.medicine.name} (x${item.quantity})`).join(", ")}
                          </td>
                          <td className="p-3 font-bold text-brand-dark">₹{order.totalAmount}</td>
                          <td className="p-3">
                            {order.prescriptionAttached ? (
                              <span className="inline-flex items-center gap-1 bg-brand-orange/10 text-brand-orange text-[9.5px] px-2 py-0.5 rounded font-semibold border border-brand-orange/15">
                                Attached
                              </span>
                            ) : (
                              <span className="text-gray-400">None</span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            {order.status === "pending" && (
                              <button
                                onClick={() => updateOrderStatus(order.id, "verified")}
                                className="px-2.5 py-1 bg-brand-orange/10 hover:bg-brand-orange text-brand-orange hover:text-white text-[9.5px] font-bold rounded-lg border border-brand-orange/20 transition-all cursor-pointer"
                              >
                                Verify Rx
                              </button>
                            )}

                            {order.status === "verified" && (
                              <button
                                onClick={() => updateOrderStatus(order.id, "dispatched")}
                                className="px-2.5 py-1 bg-green-500 hover:bg-green-600 text-white text-[9.5px] font-bold rounded-lg transition-all cursor-pointer flex items-center gap-0.5 ml-auto"
                              >
                                <Truck className="h-3.5 w-3.5 animate-bounce" />
                                Dispatch Courier
                              </button>
                            )}

                            {order.status === "dispatched" && (
                              <span className="text-[10px] text-brand-orange font-bold uppercase tracking-wider flex items-center gap-0.5 justify-end">
                                <Truck className="h-3.5 w-3.5" />
                                Out for Delivery
                              </span>
                            )}

                            {order.status === "delivered" && (
                              <span className="text-[10px] text-green-600 font-bold uppercase tracking-wider flex items-center gap-0.5 justify-end">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Delivered
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}

                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={6} className="text-center py-10 text-gray-400">
                            No orders queue available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-2 bg-brand-orange/5 p-3 rounded-xl border border-brand-orange/15 text-[9px] text-brand-orange font-semibold">
                  TIP: Pressing "Verify Rx" or "Dispatch Courier" updates the progress state globally. Open your Customer Portal in a separate tab or role to view live courier GPS movements.
                </div>
              </div>
            </div>

            {/* Right side: Inventory controllers (Col-Span 4) */}
            <div className="lg:col-span-4 bg-white border border-gray-200 p-5 rounded-2xl shadow-lg glass-card space-y-4">
              <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest border-b border-gray-100 pb-3 flex items-center gap-1">
                <Sliders className="h-4.5 w-4.5 text-brand-orange" />
                Live Stock Controller
              </h3>

              <div className="space-y-4">
                {medicines.slice(0, 5).map((med) => {
                  const currentStock = stockQuantities[med.id] !== undefined ? stockQuantities[med.id] : med.inStock;
                  return (
                    <div key={med.id} className="space-y-1.5 p-3 bg-gray-50/80 border border-gray-100 rounded-xl">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-900 truncate max-w-[150px]">{med.name}</span>
                        <span className="text-brand-orange">{currentStock} Units</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={currentStock}
                        onChange={(e) => handleStockChange(med.id, Number(e.target.value))}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-orange"
                      />
                      <div className="flex justify-between text-[9px] text-gray-400 font-semibold uppercase">
                        <span>Min: 0</span>
                        <span>Max: 500</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

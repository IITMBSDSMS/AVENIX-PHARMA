"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState, Order, NotificationAlert } from "@/context/AppState";
import { 
  ShoppingBag, ShieldCheck, Calendar, Bell, Clock, 
  ChevronRight, FileText, Plus, Trash2, CheckCircle2,
  Download, Mail, MessageSquare, Smartphone, Sparkles
} from "lucide-react";

export default function CustomerDashboard() {
  const { user, orders, prescriptions, bookings, notificationAlerts, downloadWelcomePDF } = useAppState();

  const userOrders = orders.filter(o => o.userEmail === user?.email);
  const userPrescriptions = prescriptions.filter(p => p.userEmail === user?.email);
  const userBookings = bookings.filter(b => b.userEmail === user?.email);
  const userAlerts = notificationAlerts.filter(a => a.recipient === user?.email || a.recipient === "+91 90812-70891");
  
  // Refill reminders state
  const [reminders, setReminders] = useState([
    { id: 1, medicine: "Metformin 500mg", timing: "02:00 PM Daily", user: "Self" },
    { id: 2, medicine: "Atorvastatin 10mg", timing: "09:00 PM Daily", user: "Mother" }
  ]);
  const [newMedName, setNewMedName] = useState("");
  const [newTiming, setNewTiming] = useState("");
  const [newUser, setNewUser] = useState("Self");

  const handleAddReminder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMedName || !newTiming) return;

    setReminders([
      ...reminders,
      {
        id: Date.now(),
        medicine: newMedName,
        timing: newTiming,
        user: newUser
      }
    ]);
    setNewMedName("");
    setNewTiming("");
  };

  const handleDeleteReminder = (id: number) => {
    setReminders(reminders.filter(r => r.id !== id));
  };

  const getStepText = (step: number) => {
    switch (step) {
      case 1: return "Order Placed";
      case 2: return "Prescription Verified";
      case 3: return "Courier Dispatched";
      case 4: return "Out for Delivery";
      case 5: return "Delivered";
      default: return "Pending";
    }
  };

  const downloadInvoice = (order: Order) => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;
    
    const itemsHtml = order.items.map(item => `
      <tr>
        <td style="padding: 12px 10px; border-bottom: 1px solid #E5E7EB;">
          <strong style="color: #121212; font-size: 11px;">${item.medicine.name}</strong><br/>
          <span style="color: #6B7280; font-size: 9px; font-weight: 500;">Mfg: ${item.medicine.manufacturer}</span>
        </td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #E5E7EB; text-align: center; color: #121212;">${item.quantity}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #E5E7EB; text-align: right; color: #121212;">₹${item.medicine.price.toFixed(2)}</td>
        <td style="padding: 12px 10px; border-bottom: 1px solid #E5E7EB; text-align: right; color: #121212; font-weight: 600;">₹${(item.medicine.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join("");

    const totalMRP = order.items.reduce((sum, item) => sum + (item.medicine.originalPrice || item.medicine.price) * item.quantity, 0);
    const discount = totalMRP - order.totalAmount;

    printWindow.document.write(`
      <html>
        <head>
          <title>Avenix Invoice - ${order.id}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap');
            body { font-family: 'Inter', sans-serif; color: #121212; padding: 40px; margin: 0; line-height: 1.5; background-color: #ffffff; }
            .invoice-box { max-width: 800px; margin: auto; border: 1px solid #E5E7EB; padding: 30px; border-radius: 20px; box-shadow: 0 4px 20px rgba(0,0,0,0.02); }
            .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid #E5E7EB; padding-bottom: 25px; margin-bottom: 30px; }
            .logo { display: flex; flex-direction: column; }
            .logo-main { font-size: 24px; font-weight: 800; tracking: -0.03em; color: #121212; letter-spacing: -0.5px; }
            .logo-sub { font-size: 6px; font-weight: 900; letter-spacing: 0.38em; color: #9CA3AF; margin-top: -3px; font-family: monospace; }
            .title { font-size: 16px; font-weight: 900; text-align: right; color: #FF6B00; text-transform: uppercase; letter-spacing: 1px; }
            .meta-row { display: flex; justify-content: space-between; margin-bottom: 35px; font-size: 11px; gap: 40px; }
            .meta-col { flex: 1; }
            .meta-label { color: #9CA3AF; text-transform: uppercase; font-size: 8px; font-weight: 800; margin-bottom: 6px; letter-spacing: 0.5px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 35px; font-size: 11px; }
            th { background-color: #F9FAFB; padding: 12px 10px; border-bottom: 2px solid #E5E7EB; text-align: left; color: #4B5563; font-weight: 700; text-transform: uppercase; font-size: 9px; letter-spacing: 0.5px; }
            .summary { display: flex; justify-content: flex-end; }
            .summary-table { width: 280px; font-size: 11px; }
            .summary-row { display: flex; justify-content: space-between; padding: 7px 0; color: #4B5563; }
            .divider { border-top: 1px solid #E5E7EB; margin-top: 8px; padding-top: 8px; font-weight: 800; color: #121212; }
            .badge-box { display: flex; justify-content: space-between; align-items: center; margin-top: 40px; border-top: 1px dashed #E5E7EB; padding-top: 25px; }
            .badge { border: 2px dashed #059669; color: #059669; padding: 12px 16px; font-weight: bold; border-radius: 12px; font-size: 9.5px; display: inline-block; line-height: 1.4; max-width: 450px; }
            .seal-wrap { transform: rotate(-8deg); display: inline-block; filter: drop-shadow(0 2px 6px rgba(15,44,89,0.18)); }
            .footer { margin-top: 60px; text-align: center; font-size: 8.5px; color: #9CA3AF; line-height: 1.6; }
            @media print {
              body { padding: 0; }
              .invoice-box { border: none; padding: 0; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="header">
              <div class="logo">
                <span class="logo-main">AVENIX <span style="color: #FF6B00;">X</span></span>
                <span class="logo-sub">PHARMACEUTICALS</span>
              </div>
              <div>
                <div class="title">Official Billing Receipt</div>
                <div style="font-size: 10px; color: #4B5563; text-align: right; margin-top: 4px; font-weight: 500;">Invoice No: <span style="font-family: monospace; font-weight: 700; color: #121212;">${order.id}</span></div>
                <div style="font-size: 10px; color: #4B5563; text-align: right; font-weight: 500;">Date Generated: <span style="font-weight: 700; color: #121212;">${order.date}</span></div>
              </div>
            </div>

            <div class="meta-row">
              <div class="meta-col">
                <div class="meta-label">Billed To (Patient Account)</div>
                <strong style="color: #121212; font-size: 12px;">${order.patientName}</strong><br/>
                <span style="color: #4B5563; font-weight: 500; display: inline-block; margin-top: 4px;">
                  Secure Digital Healthcare ID: Avenix Account<br/>
                  Email ID: ${order.userEmail || user?.email || "avnish@avenix.in"}<br/>
                  Registered Contact: +91 90812-70891
                </span>
              </div>
              <div class="meta-col" style="text-align: right;">
                <div class="meta-label">Dispatched From</div>
                <strong style="color: #121212; font-size: 12px;">AVENIX FULFILLMENT CORRIDOR</strong><br/>
                <span style="color: #4B5563; font-weight: 500; display: inline-block; margin-top: 4px;">
                  WHO-GMP Certified Pharmacy Warehouse Node<br/>
                  CDSCO Registry Number: DL-CDSCO-589012-A<br/>
                  Licence Authority: Drugs Controller General of India (DCGI)
                </span>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Prescribed / OTC Medication</th>
                  <th style="text-align: center; width: 60px;">Quantity</th>
                  <th style="text-align: right; width: 100px;">Price (MRP)</th>
                  <th style="text-align: right; width: 120px;">Net Amount</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>

            <div class="summary">
              <div class="summary-table">
                <div class="summary-row">
                  <span>Gross Subtotal MRP</span>
                  <span>₹${totalMRP.toFixed(2)}</span>
                </div>
                ${discount > 0 ? `
                <div class="summary-row" style="color: #059669; font-weight: 600;">
                  <span>Exclusive Avenix Discount</span>
                  <span>-₹${discount.toFixed(2)}</span>
                </div>
                ` : ""}
                <div class="summary-row">
                  <span>Integrated CGST & SGST (5%)</span>
                  <span style="font-weight: 500;">Included (₹${(order.totalAmount * 0.05).toFixed(2)})</span>
                </div>
                <div class="summary-row">
                  <span>Standard Fulfillment Charges</span>
                  <span style="color: #059669; font-weight: 700;">FREE</span>
                </div>
                <div class="summary-row divider">
                  <span style="font-size: 12px; font-weight: 900;">Total Amount Paid</span>
                  <span style="color: #FF6B00; font-size: 15px; font-weight: 900;">₹${order.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div class="badge-box">
              <div class="badge">
                ✓ CDSCO supply-chain cryptographic validation check passed.<br/>
                <span style="font-weight: 500; font-size: 8.5px; color: #4B5563; display: inline-block; margin-top: 2px;">
                  Batch authenticity verified under CDSCO national medical ledgers. Sourced directly from WHO-GMP compliant manufacturers. Originality index: 100%.
                </span>
              </div>
              <div class="seal-wrap">
                <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
                  <!-- Outer decorative ring -->
                  <circle cx="60" cy="60" r="57" fill="none" stroke="#0F2C59" stroke-width="2.5"/>
                  <circle cx="60" cy="60" r="52" fill="none" stroke="#0F2C59" stroke-width="0.8" stroke-dasharray="3,3"/>
                  <circle cx="60" cy="60" r="46" fill="none" stroke="#0F2C59" stroke-width="1.5"/>
                  <!-- Inner fill -->
                  <circle cx="60" cy="60" r="44" fill="rgba(15,44,89,0.04)"/>
                  <!-- Stars around ring -->
                  <g fill="#0F2C59" font-size="7" text-anchor="middle">
                    <text x="60" y="9">&#9733;</text>
                    <text x="93" y="22">&#9733;</text>
                    <text x="105" y="55">&#9733;</text>
                    <text x="93" y="90">&#9733;</text>
                    <text x="60" y="114">&#9733;</text>
                    <text x="27" y="90">&#9733;</text>
                    <text x="15" y="55">&#9733;</text>
                    <text x="27" y="22">&#9733;</text>
                  </g>
                  <!-- Circular top text path: AVENIX PHARMACEUTICALS -->
                  <defs>
                    <path id="topArc" d="M 12,60 A 48,48 0 1,1 108,60"/>
                    <path id="botArc" d="M 18,68 A 42,42 0 0,0 102,68"/>
                    <path id="midArc" d="M 20,60 A 40,40 0 1,1 100,60"/>
                  </defs>
                  <text font-family="Georgia,serif" font-size="7.5" font-weight="900" fill="#0F2C59" letter-spacing="2">
                    <textPath href="#topArc" startOffset="5%">AVENIX PHARMACEUTICALS · INDIA</textPath>
                  </text>
                  <!-- Bottom arc: Healix Technologies -->
                  <text font-family="Georgia,serif" font-size="6.5" font-weight="700" fill="#0F2C59" letter-spacing="1.5">
                    <textPath href="#botArc" startOffset="8%">· HEALIX TECHNOLOGIES · CDSCO ·</textPath>
                  </text>
                  <!-- Centre cross / emblem -->
                  <line x1="60" y1="28" x2="60" y2="92" stroke="#0F2C59" stroke-width="1" opacity="0.3"/>
                  <line x1="28" y1="60" x2="92" y2="60" stroke="#0F2C59" stroke-width="1" opacity="0.3"/>
                  <circle cx="60" cy="60" r="14" fill="none" stroke="#0F2C59" stroke-width="1.5"/>
                  <circle cx="60" cy="60" r="10" fill="#0F2C59" opacity="0.08"/>
                  <!-- AVENIX X centre logo text -->
                  <text x="60" y="56" font-family="Arial,sans-serif" font-size="7.5" font-weight="900" fill="#0F2C59" text-anchor="middle" letter-spacing="0.5">AVENIX</text>
                  <text x="64" y="65" font-family="Arial,sans-serif" font-size="9" font-weight="900" fill="#FF6B00" text-anchor="middle">X</text>
                  <!-- VERIFIED ribbon text -->
                  <text x="60" y="83" font-family="Arial,sans-serif" font-size="5.5" font-weight="900" fill="#0F2C59" text-anchor="middle" letter-spacing="1.5">VERIFIED</text>
                  <!-- ID number -->
                  <text x="60" y="91" font-family="monospace" font-size="4.5" fill="#0F2C59" text-anchor="middle" opacity="0.7">#${order.id.split("-")[2]}</text>
                </svg>
              </div>
            </div>

            <div class="footer">
              This billing statement is electronically signed and dispatched by Avenix Pharmaceuticals Private Limited.<br/>
              Licence compliance governed under the Drugs and Cosmetics Act, 1940. For customer queries, reach out to billing@avenix.in.<br/>
              <span style="font-weight: 700; color: #6B7280; font-size: 8px;">Powered by Healix Technologies</span>
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow medical-grid py-8">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-brand-orange">
                Customer Terminal
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
                Personal Health Portal
              </h1>
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => downloadWelcomePDF(user)}
                className="px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer inline-flex items-center gap-1.5"
              >
                <FileText className="h-3.5 w-3.5 text-brand-orange" />
                Download Credentials & Welcome Letter (PDF)
              </button>
              <Link
                href="/delivery"
                className="px-4 py-2 bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-bold rounded-xl transition-all shadow-md cursor-pointer"
              >
                Order Medicines
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Orders, Bookings, and Alerts Log (Col-Span 8) */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Active Orders List */}
              <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-lg glass-card space-y-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-3">
                  <ShoppingBag className="h-4.5 w-4.5 text-brand-orange" />
                  Your Dispatched Orders
                </h3>

                <div className="space-y-4">
                  {userOrders.map((order) => (
                    <div 
                      key={order.id}
                      className="border border-gray-150 rounded-2xl p-4 bg-gray-50/50 space-y-3 relative overflow-hidden"
                    >
                      {/* Order status headers */}
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-0.5">
                          <span className="text-[9px] font-bold text-gray-400 font-mono">ID: {order.id}</span>
                          <h4 className="text-xs font-bold text-gray-700">
                            Patient: {order.patientName} &middot; ₹{order.totalAmount} Total
                          </h4>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${
                          order.status === "delivered" 
                            ? "bg-green-50 text-green-600 border border-green-150" 
                            : "bg-brand-orange/10 text-brand-orange border border-brand-orange/20 animate-pulse"
                        }`}>
                          {order.status}
                        </span>
                      </div>

                      {/* Tracking step indicator */}
                      <div className="pt-2">
                        <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-2">
                          <span>Progress: {getStepText(order.trackingStep)}</span>
                          <span className="text-brand-orange">{order.eta}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden flex">
                          <div 
                            className={`h-full transition-all duration-500 ${order.status === "delivered" ? "bg-green-500" : "bg-brand-orange"}`}
                            style={{ width: `${(order.trackingStep / 5) * 100}%` }}
                          />
                        </div>
                      </div>

                      {/* Item list toggle details */}
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center text-[10px] text-gray-500 pt-2 border-t border-gray-200/50 gap-2">
                        <span className="font-semibold truncate max-w-[250px]">
                          {order.items.map(item => `${item.medicine.name} (x${item.quantity})`).join(", ")}
                        </span>
                        
                        <div className="flex items-center gap-3">
                          <span>Date: {order.date}</span>
                          <button
                            onClick={() => downloadInvoice(order)}
                            className="inline-flex items-center gap-1 bg-white border border-gray-200 hover:border-brand-orange hover:text-brand-orange px-2 py-1 rounded-lg text-[9px] font-bold text-gray-600 transition-all cursor-pointer shadow-xs"
                          >
                            <Download className="h-3 w-3" />
                            <span>Download Invoice PDF</span>
                          </button>
                        </div>
                      </div>

                      {/* Small overlay logic for demo interaction help */}
                      {order.status === "pending" && (
                        <div className="mt-2 bg-amber-50 text-amber-800 text-[8.5px] font-bold p-2 rounded-lg border border-amber-200 uppercase text-center tracking-wider">
                          TIP: Switch Demo Role in Top Navbar to "Pharmacist" to verify and dispatch this order.
                        </div>
                      )}
                    </div>
                  ))}

                  {userOrders.length === 0 && (
                    <div className="text-center py-10 bg-gray-50 rounded-xl text-gray-400">
                      <p className="text-xs font-bold text-gray-500">No orders registered</p>
                      <p className="text-[9px]">Click Order Medicines to generate a dispatch.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Automation Alerts Audit Log (New Feature Request) */}
              <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-lg glass-card space-y-4">
                <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                  <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5">
                    <Smartphone className="h-4.5 w-4.5 text-brand-orange animate-pulse" />
                    Automation Dispatch Log (Email & WhatsApp Alerts)
                  </h3>
                  <div className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-[8.5px] font-bold">
                    <Sparkles className="h-3 w-3" />
                    <span>Real-time Trigger Active</span>
                  </div>
                </div>

                <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                  {userAlerts.map((alert) => (
                    <div 
                      key={alert.id}
                      className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-2 text-xs"
                    >
                      <div className="flex justify-between items-center">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[8px] font-extrabold uppercase tracking-wide ${
                          alert.type === "whatsapp" 
                            ? "bg-green-50 text-green-600 border border-green-150" 
                            : "bg-blue-50 text-blue-600 border border-blue-150"
                        }`}>
                          {alert.type === "whatsapp" ? (
                            <>
                              <MessageSquare className="h-2.5 w-2.5" />
                              WhatsApp Dispatched
                            </>
                          ) : (
                            <>
                              <Mail className="h-2.5 w-2.5" />
                              Email Notification
                            </>
                          )}
                        </span>
                        <div className="flex items-center gap-2 text-[9px] text-gray-400 font-bold">
                          <span>{alert.timestamp}</span>
                          <span className="text-green-600 uppercase">&bull; {alert.status}</span>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="text-[10px] text-gray-500">
                          <span className="font-bold text-gray-700">Recipient:</span> {alert.recipient}
                          {alert.subject && (
                            <> &middot; <span className="font-bold text-gray-700">Subject:</span> {alert.subject}</>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-600 leading-relaxed bg-white border border-gray-100 p-2 rounded-lg font-medium whitespace-pre-line">
                          {alert.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Lab Diagnostic Bookings */}
              <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-lg glass-card space-y-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-3">
                  <Calendar className="h-4.5 w-4.5 text-brand-orange" />
                  Diagnostic Bookings & Reports
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {userBookings.map((book) => (
                    <div 
                      key={book.id}
                      className="border border-gray-150 rounded-xl p-4 bg-gray-50/50 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-[8.5px] font-extrabold uppercase bg-brand-orange/10 text-brand-orange px-2 py-0.5 rounded">
                            {book.type}
                          </span>
                          <span className="text-[9.5px] font-bold text-gray-400 font-mono">{book.id}</span>
                        </div>
                        <h4 className="text-xs font-bold text-gray-800 pt-1.5">{book.targetName}</h4>
                        <p className="text-[10px] text-gray-500">Patient: {book.patientName}</p>
                      </div>

                      <div className="mt-3 pt-3 border-t border-gray-100 text-[10px] text-gray-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5 text-brand-orange" />
                          <span>{book.date} &middot; {book.timeslot}</span>
                        </div>
                        <span className="text-[9px] font-extrabold uppercase text-green-600 tracking-wider flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          Phlebotomist Dispatched
                        </span>
                      </div>
                    </div>
                  ))}

                  {userBookings.length === 0 && (
                    <div className="col-span-2 text-center py-10 bg-gray-50 rounded-xl text-gray-400">
                      <p className="text-xs font-bold text-gray-500">No bookings registered</p>
                      <p className="text-[9px]">Check Diagnostics page to book sample collections.</p>
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Right side: AI prescription records & Family reminders (Col-Span 4) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Refill Reminders */}
              <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-lg glass-card space-y-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-3">
                  <Bell className="h-4.5 w-4.5 text-brand-orange" />
                  Family Refill Reminders
                </h3>

                <div className="space-y-3">
                  {reminders.map((rem) => (
                    <div 
                      key={rem.id} 
                      className="flex items-center justify-between p-2.5 bg-gray-50/80 border border-gray-100 rounded-xl text-xs"
                    >
                      <div>
                        <h4 className="font-bold text-gray-900">{rem.medicine}</h4>
                        <p className="text-[9px] text-gray-400">For {rem.user} &middot; {rem.timing}</p>
                      </div>
                      <button
                        onClick={() => handleDeleteReminder(rem.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}

                  {/* Add Reminder Form */}
                  <form onSubmit={handleAddReminder} className="space-y-2.5 pt-3 border-t border-gray-100">
                    <input
                      type="text"
                      required
                      value={newMedName}
                      onChange={(e) => setNewMedName(e.target.value)}
                      placeholder="Med name (e.g. Paracetamol)"
                      className="w-full px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-brand-orange"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        required
                        value={newTiming}
                        onChange={(e) => setNewTiming(e.target.value)}
                        placeholder="Timing (e.g. 02:00 PM)"
                        className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-[10px] focus:outline-none focus:border-brand-orange"
                      />
                      <select
                        value={newUser}
                        onChange={(e) => setNewUser(e.target.value)}
                        className="px-2 bg-gray-50 border border-gray-200 rounded-lg text-[10px] focus:outline-none focus:border-brand-orange"
                      >
                        <option value="Self">Self</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Spouse">Spouse</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-brand-orange hover:bg-brand-orange-light text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      Add Reminder
                    </button>
                  </form>
                </div>
              </div>

              {/* AI Prescription History Records */}
              <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-lg glass-card space-y-4">
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest flex items-center gap-1.5 border-b border-gray-100 pb-3">
                  <FileText className="h-4.5 w-4.5 text-brand-orange" />
                  Prescription History
                </h3>

                <div className="space-y-3">
                  {userPrescriptions.map((rx) => (
                    <div 
                      key={rx.id}
                      className="p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-2 hover:border-brand-orange/20 transition-all"
                    >
                      <div className="flex justify-between text-[9px] text-gray-400 font-bold uppercase">
                        <span>{rx.fileName.slice(0, 18)}...</span>
                        <span>{rx.date}</span>
                      </div>
                      <div>
                        <span className="text-[8px] font-extrabold uppercase text-brand-orange block">Extracted Medicines</span>
                        <p className="text-[10px] font-semibold text-gray-700">
                          {rx.medicines.map(m => m.name).join(", ")}
                        </p>
                      </div>
                      <Link
                        href="/prescription-ai"
                        className="text-[9.5px] font-bold text-brand-orange uppercase flex items-center gap-0.5 hover:text-brand-orange-light"
                      >
                        View AI Report Analysis
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ))}

                  {userPrescriptions.length === 0 && (
                    <div className="text-center py-6 text-gray-400 text-[10px]">
                      No digital slips checked yet. Use the AI prescription scanner.
                    </div>
                  )}
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}

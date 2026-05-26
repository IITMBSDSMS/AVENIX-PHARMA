"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState } from "@/context/AppState";
import {
  ShoppingCart, ShoppingBag, Plus, Minus, Trash2,
  UploadCloud, AlertCircle, FileText, Check, ArrowRight,
  ChevronRight, Package, Truck, Shield, Tag, Zap, X
} from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    cart, removeFromCart, updateCartQuantity,
    placeOrder, uploadPrescriptionScan,
  } = useAppState();

  const [patientName, setPatientName] = useState("");
  const [prescriptionUploaded, setPrescriptionUploaded] = useState(false);
  const [rxFileName, setRxFileName] = useState("");
  const [checkoutStep, setCheckoutStep] = useState(false);
  const [orderCreatedId, setOrderCreatedId] = useState("");

  // Razorpay simulated state
  const [showRazorpay, setShowRazorpay] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "netbanking">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [paymentState, setPaymentState] = useState<"idle" | "processing" | "success">("idle");
  const [mockOrderId, setMockOrderId] = useState("");

  const cartTotal = cart.reduce((sum, item) => sum + item.medicine.price * item.quantity, 0);
  const cartOriginalTotal = cart.reduce((sum, item) => sum + (item.medicine.originalPrice || item.medicine.price) * item.quantity, 0);
  const discountAmount = cartOriginalTotal - cartTotal;
  const requiresRx = cart.some(item => item.medicine.requiresPrescription);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const MEDICINE_IMAGES: Record<string, string> = {
    "1": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200",
    "2": "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=200",
    "3": "https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=200",
    "4": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&q=80&w=200",
    "5": "https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=200",
    "6": "https://images.unsplash.com/photo-1550572017-edd951aa8f72?auto=format&fit=crop&q=80&w=200",
    "7": "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=200",
  };

  const handlePrescriptionUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const res = await uploadPrescriptionScan(file.name);
      if (res.isValid) {
        setRxFileName(file.name);
        setPrescriptionUploaded(true);
      } else {
        let msg = "Invalid document: Please upload a real doctor's prescription.";
        if (res.errorType === "human_photo") {
          msg = "❌ Invalid Prescription: Human photo detected!\n\nPlease upload a real doctor's prescription slip containing patient details, the Rx symbol, and physician signature.";
        } else if (res.errorType === "unrelated_document") {
          msg = "❌ Invalid Prescription: Unrelated administrative document detected!\n\nPlease upload a valid doctor's prescription slip.";
        } else {
          msg = "❌ Invalid Prescription: AI Scanner could not detect any prescription markers (Rx symbol, doctor header, or medicines).\n\nPlease upload a valid, clear doctor's prescription.";
        }
        alert(msg);
        setRxFileName("");
        setPrescriptionUploaded(false);
        e.target.value = ""; // Reset file input
      }
    }
  };

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && (window as any).Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (requiresRx && !prescriptionUploaded) {
      alert("Please upload a prescription for Rx-restricted items in your cart.");
      return;
    }

    setPaymentState("idle");

    try {
      // 1. Create order on backend API
      const res = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: cartTotal }),
      });

      const orderData = await res.json();
      if (orderData.error) {
        alert(`Order creation failed: ${orderData.error}`);
        return;
      }

      const { orderId, amount, currency, isDemo, keyId } = orderData;

      if (isDemo) {
        // Fallback to our high-fidelity simulated Razorpay overlay
        setMockOrderId(orderId);
        setShowRazorpay(true);
      } else {
        // Load official SDK script
        const isLoaded = await loadRazorpayScript();
        if (!isLoaded) {
          alert("Failed to load Razorpay SDK. Check your internet connection.");
          return;
        }

        const options = {
          key: keyId,
          amount: amount,
          currency: currency,
          name: "Avenix Pharmaceuticals",
          description: "Intelligent Medicine Delivery",
          order_id: orderId,
          handler: async function (response: any) {
            setPaymentState("processing");
            setShowRazorpay(true); // display payment loader modal
            try {
              // Verify cryptographic signature in database
              const verifyRes = await fetch("/api/payment/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              });
              const verifyData = await verifyRes.json();
              if (verifyData.success) {
                setPaymentState("success");
                setTimeout(() => {
                  const createdId = placeOrder(patientName || "Guest User", rxFileName || undefined);
                  setOrderCreatedId(createdId);
                  setShowRazorpay(false);
                  setPatientName("");
                  setPrescriptionUploaded(false);
                  setRxFileName("");
                  setCheckoutStep(false);
                }, 1500);
              } else {
                alert("Payment verification failed: " + verifyData.error);
                setPaymentState("idle");
                setShowRazorpay(false);
              }
            } catch (err) {
              console.error("Verification payment error:", err);
              setPaymentState("idle");
              setShowRazorpay(false);
            }
          },
          prefill: {
            name: patientName || "Guest User",
            email: "avnish@avenix.in",
            contact: "+919081270891"
          },
          theme: {
            color: "#FF6B00",
          },
        };

        const rzp = new (window as any).Razorpay(options);
        rzp.open();
      }
    } catch (error) {
      console.error("Checkout payment initialization error:", error);
      alert("Error starting transaction checkout flow.");
    }
  };

  const handleRazorpayPayment = async () => {
    setPaymentState("processing");
    
    // Simulate transaction authorization delay
    setTimeout(async () => {
      try {
        const verifyRes = await fetch("/api/payment/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_order_id: mockOrderId,
            razorpay_payment_id: `pay_AVX_MOCK_${Math.floor(10000000 + Math.random() * 90000000)}`,
            razorpay_signature: "simulated_signature_verification_pass",
          }),
        });
        const verifyData = await verifyRes.json();
        
        if (verifyData.success) {
          setPaymentState("success");
          
          // Complete Avenix order log write on success
          setTimeout(() => {
            const createdId = placeOrder(patientName || "Guest User", rxFileName || undefined);
            setOrderCreatedId(createdId);
            setShowRazorpay(false);
            setPatientName("");
            setPrescriptionUploaded(false);
            setRxFileName("");
            setCheckoutStep(false);
          }, 1500);
        } else {
          alert("Payment verification failed: " + verifyData.error);
          setPaymentState("idle");
        }
      } catch (err) {
        console.error("Verify mock payment error:", err);
        setPaymentState("idle");
      }
    }, 2000);
  };

  return (
    <>
      <Navbar />

      {/* Ambient glows */}
      <div className="fixed top-0 left-1/4 -z-10 h-[600px] w-[600px] rounded-full bg-brand-orange/4 blur-[140px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 -z-10 h-[500px] w-[500px] rounded-full bg-brand-orange/3 blur-[160px] pointer-events-none" />

      <main className="min-h-screen pb-20 font-sans selection:bg-brand-orange selection:text-white">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-10 pt-8 space-y-8">

          {/* Page Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-brand-dark font-poppins flex items-center gap-3">
                <ShoppingCart className="h-7 w-7 text-brand-orange" />
                MEDICINE CART
                <span className="px-2.5 py-0.5 rounded-full bg-brand-orange/10 text-brand-orange text-sm font-black">
                  {cartCount}
                </span>
              </h1>
              <p className="text-xs text-gray-500 mt-1 font-medium">
                Review your medicines • CDSCO-certified fulfilment • Free delivery
              </p>
            </div>
            <Link
              href="/delivery"
              className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:border-brand-orange hover:text-brand-orange transition-all"
            >
              + Add More Medicines <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Trust Badges Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Shield, label: "WHO-GMP Certified", sub: "All partner warehouses" },
              { icon: Truck, label: "Free Delivery", sub: "Orders above ₹299" },
              { icon: Zap, label: "Same-Day Dispatch", sub: "Before 5 PM orders" },
              { icon: Package, label: "Secure Packaging", sub: "Temperature-controlled" },
            ].map((badge) => (
              <div key={badge.label} className="flex items-center gap-3 bg-white border border-gray-100 rounded-2xl p-3 shadow-xs">
                <div className="h-8 w-8 rounded-full bg-brand-orange/10 flex items-center justify-center shrink-0">
                  <badge.icon className="h-4 w-4 text-brand-orange" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-gray-800 leading-none">{badge.label}</p>
                  <p className="text-[9px] text-gray-400 mt-0.5">{badge.sub}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Main Cart Grid */}
          {cart.length === 0 ? (
            /* Empty State */
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-6">
              <div className="relative">
                <div className="h-28 w-28 rounded-full bg-gray-100 flex items-center justify-center">
                  <ShoppingBag className="h-14 w-14 text-gray-300" />
                </div>
                <div className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-brand-orange/10 flex items-center justify-center">
                  <span className="text-lg">💊</span>
                </div>
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-black text-gray-800">YOUR CART IS EMPTY</h2>
                <p className="text-sm text-gray-400 font-medium max-w-sm">
                  Add medicines from our clinical inventory to begin your order.
                </p>
              </div>
              <Link
                href="/delivery"
                className="inline-flex items-center gap-2 px-8 py-3.5 bg-brand-orange hover:bg-orange-600 text-white text-sm font-black uppercase rounded-full shadow-lg shadow-brand-orange/25 transition-all hover:scale-105"
              >
                Browse Medicines <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">

              {/* Left: Cart Items List */}
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <span className="text-xs font-black text-gray-500 uppercase tracking-wider">
                    {cartCount} Item{cartCount !== 1 ? "s" : ""} in Cart
                  </span>
                  <button
                    onClick={() => cart.forEach(item => removeFromCart(item.medicine.id))}
                    className="text-[10px] font-bold text-red-400 hover:text-red-600 transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Trash2 className="h-3 w-3" /> Clear All
                  </button>
                </div>

                {cart.map((item) => {
                  const imgSrc = item.medicine.image || MEDICINE_IMAGES[item.medicine.id] || MEDICINE_IMAGES["1"];
                  const itemTotal = item.medicine.price * item.quantity;
                  const itemOriginal = (item.medicine.originalPrice || item.medicine.price) * item.quantity;
                  const itemDiscount = itemOriginal - itemTotal;
                  return (
                    <div
                      key={item.medicine.id}
                      className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-brand-orange/20 transition-all flex gap-5 items-start group"
                    >
                      {/* Medicine Image */}
                      <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-xl overflow-hidden border border-gray-100 shrink-0 bg-gray-50">
                        <img
                          src={imgSrc}
                          alt={item.medicine.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      {/* Medicine Details */}
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-sm font-black text-gray-900 leading-tight">{item.medicine.name}</h3>
                            <p className="text-[10px] text-gray-500 font-medium mt-0.5">{item.medicine.tagline}</p>
                            <p className="text-[9px] text-gray-400 mt-0.5">{item.medicine.manufacturer}</p>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.medicine.id)}
                            className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer shrink-0"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        {/* Badges */}
                        <div className="flex flex-wrap gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[8.5px] font-black uppercase tracking-wider ${
                            item.medicine.category === "OTC"
                              ? "bg-green-50 text-green-600 border border-green-100"
                              : "bg-amber-50 text-amber-600 border border-amber-100"
                          }`}>
                            {item.medicine.category}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[8.5px] font-semibold bg-blue-50 text-blue-500 border border-blue-100">
                            {item.medicine.dosage}
                          </span>
                          {item.medicine.requiresPrescription && (
                            <span className="px-2 py-0.5 rounded-md text-[8.5px] font-black bg-red-50 text-red-500 border border-red-100">
                              Rx Required
                            </span>
                          )}
                        </div>

                        {/* Qty + Price */}
                        <div className="flex items-center justify-between gap-3 pt-1">
                          {/* Quantity Stepper */}
                          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1">
                            <button
                              onClick={() => updateCartQuantity(item.medicine.id, item.quantity - 1)}
                              className="h-7 w-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-orange hover:border-brand-orange/30 transition-all cursor-pointer"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-black text-brand-dark w-6 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateCartQuantity(item.medicine.id, item.quantity + 1)}
                              className="h-7 w-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-brand-orange hover:border-brand-orange/30 transition-all cursor-pointer"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>

                          {/* Pricing */}
                          <div className="text-right">
                            <div className="text-sm font-black text-brand-orange">₹{itemTotal}</div>
                            {itemDiscount > 0 && (
                              <div className="flex items-center gap-1.5 justify-end">
                                <span className="text-[9px] text-gray-400 line-through font-medium">₹{itemOriginal}</span>
                                <span className="text-[9px] font-black text-green-500">
                                  -{Math.round((itemDiscount / itemOriginal) * 100)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Add more link (mobile) */}
                <Link
                  href="/delivery"
                  className="flex sm:hidden items-center justify-center gap-2 py-3 border-2 border-dashed border-brand-orange/30 rounded-2xl text-xs font-bold text-brand-orange hover:border-brand-orange/60 transition-all"
                >
                  + Add More Medicines
                </Link>
              </div>

              {/* Right: Order Summary */}
              <div className="lg:col-span-4 sticky top-24 space-y-4">

                {/* Promo Code */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-brand-orange" />
                    <span className="text-xs font-black text-gray-700 uppercase tracking-wider">Promo Code</span>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium text-gray-700 focus:outline-none focus:border-brand-orange transition-all placeholder-gray-400"
                    />
                    <button className="px-4 py-2 bg-brand-orange hover:bg-orange-600 text-white text-[10px] font-black uppercase rounded-xl transition-all cursor-pointer">
                      Apply
                    </button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {["AVENIX25", "FIRST10", "HEALTH15"].map(code => (
                      <button key={code} className="px-2.5 py-1 bg-orange-50 border border-orange-100 text-brand-orange text-[9px] font-black rounded-lg hover:bg-orange-100 transition-colors cursor-pointer">
                        {code}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Order Summary */}
                <div className="bg-white border border-gray-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                  <h3 className="text-xs font-black text-gray-800 uppercase tracking-wider pb-3 border-b border-gray-100">
                    ORDER SUMMARY
                  </h3>

                  <div className="space-y-2.5 text-[11px]">
                    <div className="flex justify-between text-gray-500 font-semibold">
                      <span>Price ({cartCount} items)</span>
                      <span>₹{cartOriginalTotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 font-bold">
                        <span>Avenix Discount</span>
                        <span>− ₹{discountAmount}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Delivery Fee</span>
                      <span>FREE</span>
                    </div>
                    <div className="flex justify-between text-green-600 font-bold">
                      <span>Platform Service Fee</span>
                      <span>FREE</span>
                    </div>
                    <div className="border-t border-dashed border-gray-100 pt-2.5 flex justify-between font-black text-gray-900 text-sm">
                      <span>Total Payable</span>
                      <span className="text-brand-orange text-base">₹{cartTotal}</span>
                    </div>
                    {discountAmount > 0 && (
                      <div className="bg-green-50 border border-green-100 rounded-xl px-3 py-2 text-[10px] font-bold text-green-600 text-center">
                        🎉 You save ₹{discountAmount} on this order!
                      </div>
                    )}
                  </div>

                  {/* Rx Warning */}
                  {requiresRx && (
                    <div className={`p-3 rounded-xl border text-[10px] ${
                      prescriptionUploaded
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-amber-50 border-amber-200 text-amber-800"
                    }`}>
                      <div className="flex items-start gap-2">
                        {prescriptionUploaded
                          ? <FileText className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                          : <AlertCircle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                        }
                        <div className="space-y-1">
                          <p className="font-black uppercase tracking-wide">
                            {prescriptionUploaded ? "Prescription Attached ✓" : "Prescription Required"}
                          </p>
                          <p className="leading-tight font-medium">
                            {prescriptionUploaded
                              ? `Attached: ${rxFileName.slice(0, 22)}…`
                              : "One or more items need an official doctor's prescription to dispatch."
                            }
                          </p>
                          {!prescriptionUploaded && (
                            <label className="mt-1.5 inline-flex items-center gap-1.5 bg-white border border-amber-300 hover:border-brand-orange px-2.5 py-1 rounded-lg font-bold text-amber-800 hover:text-brand-orange transition-all cursor-pointer">
                              <UploadCloud className="h-3 w-3" />
                              <span>Upload PDF / Image</span>
                              <input type="file" accept="image/*,.pdf" className="hidden" onChange={handlePrescriptionUpload} />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Order Success State */}
                  {orderCreatedId ? (
                    <div className="py-6 text-center space-y-3 bg-brand-orange/5 rounded-xl border border-brand-orange/15">
                      <div className="h-12 w-12 bg-brand-orange rounded-full flex items-center justify-center text-white mx-auto animate-bounce">
                        <Check className="h-6 w-6" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-black text-brand-orange uppercase">ORDER PLACED!</h3>
                        <p className="text-[10px] font-bold text-brand-dark">Order ID: {orderCreatedId}</p>
                        <p className="text-[9px] text-gray-400 leading-relaxed px-4">
                          Rx validated. Routing to nearest pharmacy. Redirecting to tracking…
                        </p>
                      </div>
                    </div>
                  ) : !checkoutStep ? (
                    <button
                      onClick={() => setCheckoutStep(true)}
                      className="w-full py-3.5 bg-brand-orange hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-md shadow-brand-orange/20 flex items-center justify-center gap-2 group cursor-pointer"
                    >
                      <span>PROCEED TO CHECKOUT</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ) : (
                    <form onSubmit={handleCheckout} className="space-y-3 border-t border-gray-100 pt-3">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-wider block">
                          Patient Name
                        </label>
                        <input
                          type="text"
                          required
                          value={patientName}
                          onChange={(e) => setPatientName(e.target.value)}
                          placeholder="e.g. Avnish Kumar"
                          className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-orange transition-all"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => setCheckoutStep(false)}
                          className="py-3 text-center text-xs font-bold text-gray-500 hover:text-brand-dark transition-colors border border-gray-200 rounded-xl cursor-pointer"
                        >
                          Back
                        </button>
                        <button
                          type="submit"
                          className="py-3 text-center text-xs font-black text-white bg-brand-orange hover:bg-orange-600 transition-colors rounded-xl shadow-md cursor-pointer"
                        >
                          Place Order
                        </button>
                      </div>
                    </form>
                  )}
                </div>

                {/* Safe checkout note */}
                <p className="text-center text-[9px] text-gray-400 font-medium flex items-center justify-center gap-1">
                  <Shield className="h-3 w-3" />
                  100% secure & encrypted checkout
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Razorpay Sandbox Modal Overlay */}
        {showRazorpay && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[99999] flex items-center justify-center p-4">
            <div className="w-full max-w-[380px] bg-white shadow-2xl rounded-2xl border border-gray-150 overflow-hidden flex flex-col font-sans animate-in fade-in zoom-in-95 duration-200">
              {/* Header */}
              <div className="bg-[#0b2545] p-5 text-white flex justify-between items-start relative">
                <div>
                  <div className="flex items-center gap-1">
                    <span className="h-4.5 w-4.5 rounded bg-sky-400 flex items-center justify-center text-white text-[10px] font-black tracking-tight select-none">R</span>
                    <span className="text-xs font-bold uppercase tracking-wider text-sky-400">Razorpay</span>
                  </div>
                  <h4 className="text-xs font-bold text-gray-200 mt-2 truncate max-w-[200px]">Avenix Pharmaceuticals</h4>
                  <p className="text-[10px] text-gray-400 font-medium">Order ID: AVX-TXN-${Math.floor(100000 + Math.random() * 900000)}</p>
                </div>
                <div className="text-right">
                  <span className="text-[9px] text-gray-400 font-extrabold block uppercase tracking-wide">Amount Payable</span>
                  <span className="text-lg font-black text-[#3399FF]">₹{cartTotal}</span>
                </div>
                <button 
                  onClick={() => setShowRazorpay(false)}
                  className="absolute top-3 right-3 text-gray-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Content Body */}
              {paymentState === "idle" && (
                <div className="flex-1 flex flex-col">
                  {/* Method selector tabs */}
                  <div className="grid grid-cols-3 border-b border-gray-150 text-[10px] font-bold text-gray-500 bg-gray-50/50">
                    <button 
                      onClick={() => setPaymentMethod("upi")}
                      className={`py-3 text-center border-b-2 transition-all cursor-pointer ${paymentMethod === "upi" ? "border-[#3399FF] text-[#3399FF] bg-white" : "border-transparent hover:bg-gray-100/30"}`}
                    >
                      UPI / QR Code
                    </button>
                    <button 
                      onClick={() => setPaymentMethod("card")}
                      className={`py-3 text-center border-b-2 transition-all cursor-pointer ${paymentMethod === "card" ? "border-[#3399FF] text-[#3399FF] bg-white" : "border-transparent hover:bg-gray-100/30"}`}
                    >
                      Credit / Debit Card
                    </button>
                    <button 
                      onClick={() => setPaymentMethod("netbanking")}
                      className={`py-3 text-center border-b-2 transition-all cursor-pointer ${paymentMethod === "netbanking" ? "border-[#3399FF] text-[#3399FF] bg-white" : "border-transparent hover:bg-gray-100/30"}`}
                    >
                      Netbanking
                    </button>
                  </div>

                  <div className="p-5 flex-grow space-y-4">
                    {/* UPI Method */}
                    {paymentMethod === "upi" && (
                      <div className="space-y-3">
                        <div className="grid grid-cols-3 gap-2">
                          {["GPay", "PhonePe", "Paytm"].map((app) => (
                            <button
                              key={app}
                              type="button"
                              onClick={() => setUpiId(`${patientName.toLowerCase().replace(/[^a-z0-9]/g, "") || "patient"}@${app.toLowerCase()}`)}
                              className="py-2.5 border border-gray-200 hover:border-[#3399FF] hover:bg-sky-50/10 text-[10px] font-bold text-gray-700 rounded-xl transition-all cursor-pointer text-center"
                            >
                              {app}
                            </button>
                          ))}
                        </div>
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">UPI VPA Address</label>
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            placeholder="e.g. mobile@upi"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#3399FF] text-gray-800"
                          />
                        </div>
                      </div>
                    )}

                    {/* Card Method */}
                    {paymentMethod === "card" && (
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Card Number</label>
                          <input
                            type="text"
                            maxLength={19}
                            value={cardNumber}
                            onChange={(e) => setCardNumber(e.target.value)}
                            placeholder="4111 2222 3333 4444"
                            className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#3399FF] text-gray-800"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">Expiry</label>
                            <input
                              type="text"
                              maxLength={5}
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              placeholder="MM/YY"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#3399FF] text-gray-800 text-center"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider block">CVV</label>
                            <input
                              type="password"
                              maxLength={3}
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value)}
                              placeholder="•••"
                              className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none focus:border-[#3399FF] text-gray-800 text-center"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Netbanking Method */}
                    {paymentMethod === "netbanking" && (
                      <div className="grid grid-cols-2 gap-2 text-center">
                        {["SBI", "HDFC", "ICICI", "AXIS"].map((bank) => (
                          <button
                            key={bank}
                            type="button"
                            onClick={() => {
                              setPaymentState("processing");
                              setTimeout(() => {
                                setPaymentState("success");
                                setTimeout(() => {
                                  const createdId = placeOrder(patientName || "Guest User", rxFileName || undefined);
                                  setOrderCreatedId(createdId);
                                  setShowRazorpay(false);
                                  setPatientName("");
                                  setPrescriptionUploaded(false);
                                  setRxFileName("");
                                  setCheckoutStep(false);
                                }, 1500);
                              }, 2000);
                            }}
                            className="py-2.5 border border-gray-200 hover:border-[#3399FF] hover:bg-sky-50/10 text-[10px] font-bold text-gray-700 rounded-xl transition-all cursor-pointer text-center"
                          >
                            {bank} Netbank
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-5 bg-gray-50 border-t border-gray-100 flex flex-col gap-2.5">
                    <button
                      onClick={handleRazorpayPayment}
                      className="w-full py-3.5 bg-[#3399FF] hover:bg-[#1A80E6] text-white text-xs font-bold rounded-xl tracking-wider transition-all duration-300 shadow-md uppercase cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <span>Pay ₹{cartTotal} Securely</span>
                    </button>
                    <p className="text-center text-[8.5px] text-gray-400 font-medium flex items-center justify-center gap-1">
                      <Shield className="h-3.5 w-3.5 text-sky-500" />
                      Secure Sandbox Transaction via Razorpay APIs
                    </p>
                  </div>
                </div>
              )}

              {/* Processing State */}
              {paymentState === "processing" && (
                <div className="p-10 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="h-12 w-12 border-4 border-t-[#3399FF] border-gray-150 rounded-full animate-spin" />
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-gray-800 uppercase">Processing Payment</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed max-w-[200px]">
                      Authorising transaction with your bank. Do not close this browser tab...
                    </p>
                  </div>
                </div>
              )}

              {/* Success State */}
              {paymentState === "success" && (
                <div className="p-10 text-center space-y-4 flex flex-col items-center justify-center min-h-[300px]">
                  <div className="h-16 w-16 bg-green-500 text-white rounded-full flex items-center justify-center text-3xl animate-bounce shadow-md">
                    ✓
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-black text-green-600 uppercase">Payment Authorized</h4>
                    <p className="text-[10px] text-gray-400 leading-relaxed">
                      Razorpay Reference ID: pay_${Math.floor(1000000000 + Math.random() * 9000000000)}
                    </p>
                    <p className="text-[10px] font-bold text-gray-500 pt-1.5 animate-pulse">
                      Fulfilling Avenix order logs...
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

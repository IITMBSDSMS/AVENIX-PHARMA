"use client";

import React from "react";
import Link from "next/link";
import { Activity, ShieldCheck, Truck, Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white border-t border-gray-800">
      {/* Premium Trust Banner */}
      <div className="border-b border-gray-800 bg-black/40">
        <div className="mx-auto max-w-[1800px] px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center space-x-3 text-gray-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Ultra-Fast Delivery</h4>
                <p className="text-[10px] text-gray-400">Emergency meds in 10 mins, standard delivery &lt; 2 hrs.</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">100% Genuine Guarantee</h4>
                <p className="text-[10px] text-gray-400">Blockchain-verified authentic batches from NABL labs.</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Prescription AI Scanner</h4>
                <p className="text-[10px] text-gray-400">Instant dosage, timing, and safety scan analysis.</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-gray-300">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 text-brand-orange">
                <Activity className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">AI Doctor Assistant</h4>
                <p className="text-[10px] text-gray-400">Instant symptom check, urgency score, referral booking.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="mx-auto max-w-[1800px] px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Tagline */}
          <div className="flex flex-col space-y-4">
            <Link href="/" className="flex items-center group">
              <div className="flex flex-col select-none">
                <span className="text-2xl sm:text-[26px] md:text-[28px] font-extrabold tracking-tight text-white flex items-center font-poppins">
                  AVENIX
                  <span className="text-brand-orange relative ml-0.5 inline-block font-black">
                    X
                    <span className="absolute -inset-1 rounded-full bg-brand-orange/10 animate-pulse -z-10"></span>
                  </span>
                </span>
                <span className="text-[6.5px] sm:text-[7.5px] md:text-[8px] font-black tracking-[0.34em] sm:tracking-[0.38em] md:tracking-[0.41em] text-gray-400 -mt-1 uppercase font-mono">
                  PHARMACEUTICALS
                </span>
              </div>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              Leading the digital healthcare revolution in India. AI-driven logistics, authenticated batch validation, and instant clinical intelligence.
            </p>
            <div className="text-[10px] font-medium text-brand-orange tracking-widest uppercase">
              Intelligent Healthcare, Delivered
            </div>
          </div>

          {/* Links: Platform */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Platform</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/delivery" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">
                  Medicines & Cart
                </Link>
              </li>
              <li>
                <Link href="/prescription-ai" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">
                  Prescription AI Scanner
                </Link>
              </li>
              <li>
                <Link href="/assistant" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">
                  AI Health Chat
                </Link>
              </li>
              <li>
                <Link href="/emergency" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">
                  Emergency Dispatch
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Consultations */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Healthcare Services</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/doctors" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">
                  Consult a Doctor
                </Link>
              </li>
              <li>
                <Link href="/diagnostics" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">
                  Lab Tests & Checkups
                </Link>
              </li>
              <li>
                <Link href="/verify" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">
                  Batch Authenticity Verify
                </Link>
              </li>
              <li>
                <Link href="/dashboard/pharmacist" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">
                  Pharmacist Hub
                </Link>
              </li>
            </ul>
          </div>

          {/* Links: Corporate */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-white">Company</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/about" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">
                  About Avenix
                </Link>
              </li>
              <li>
                <Link href="/careers" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-xs text-gray-400 hover:text-brand-orange transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment Partners Section */}
        <div className="mt-12 border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            {/* Left side: Payment Partners */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Our Payment Partners</h4>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { name: "Google Pay", domain: "pay.google.com", fallback: "GPay" },
                  { name: "Paytm", domain: "paytm.com", fallback: "Paytm" },
                  { name: "Amazon Pay", domain: "amazon.com", fallback: "Amzn" },
                  { name: "PhonePe", domain: "phonepe.com", fallback: "Phone" },
                  { name: "MobiKwik", domain: "mobikwik.com", fallback: "Kwik" },
                  { name: "Airtel Money", domain: "airtel.in", fallback: "AirPay" },
                  { name: "Ola Money", domain: "olacabs.com", fallback: "Ola" },
                  { name: "Maestro", domain: "mastercard.us", fallback: "Maes" },
                  { name: "Mastercard", domain: "mastercard.com", fallback: "MC" },
                  { name: "Visa", domain: "visa.com", fallback: "Visa" },
                  { name: "RuPay", domain: "rupay.co.in", fallback: "RuPay" },
                  { name: "Diners Club", domain: "dinersclub.com", fallback: "Diners" }
                ].map((partner) => (
                  <div 
                    key={partner.name}
                    className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-gray-200/90 shadow-xs overflow-hidden p-1.5 hover:scale-110 transition-transform duration-200 cursor-default"
                    title={partner.name}
                  >
                    <img 
                      src={`https://s2.googleusercontent.com/s2/favicons?domain=${partner.domain}&sz=128`}
                      alt={`${partner.name} logo`}
                      className="w-full h-full object-contain rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector(".fallback-text")) {
                          const span = document.createElement("span");
                          span.className = "fallback-text text-[8px] font-black text-brand-dark font-sans tracking-tighter uppercase";
                          span.innerText = partner.fallback;
                          parent.appendChild(span);
                        }
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Right side: Social Networks */}
            <div className="space-y-3 md:text-right">
              <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Connect With Us</h4>
              <div className="flex flex-wrap items-center md:justify-end gap-3">
                {[
                  { name: "LinkedIn", domain: "linkedin.com", fallback: "In", url: "https://www.linkedin.com/company/avenixharma/?viewAsMember=true" },
                  { name: "Instagram", domain: "instagram.com", fallback: "Insta", url: "https://instagram.com/avenix_pharmaceuticals" }
                ].map((social) => (
                  <a 
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="h-10 w-10 rounded-full bg-white flex items-center justify-center border border-gray-200/90 shadow-xs overflow-hidden p-1.5 hover:scale-110 transition-transform duration-200 cursor-pointer"
                    title={`Follow us on ${social.name}`}
                  >
                    <img 
                      src={`https://s2.googleusercontent.com/s2/favicons?domain=${social.domain}&sz=128`}
                      alt={`${social.name} logo`}
                      className="w-full h-full object-contain rounded-full"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.style.display = "none";
                        const parent = target.parentElement;
                        if (parent && !parent.querySelector(".fallback-text")) {
                          const span = document.createElement("span");
                          span.className = "fallback-text text-[8px] font-black text-brand-dark font-sans tracking-tighter uppercase";
                          span.innerText = social.fallback;
                          parent.appendChild(span);
                        }
                      }}
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Area */}
        <div className="mt-8 border-t border-gray-800 pt-6 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-[10px] text-gray-500">
            &copy; {new Date().getFullYear()} Avenix Pharmaceuticals Private Limited. All rights reserved.
          </p>
          <p className="text-[9px] text-gray-500 mt-2 sm:mt-0">
            Licensed in compliance with the Drugs and Cosmetics Act, 1940 and rules thereunder.
          </p>
        </div>
      </div>
    </footer>
  );
}

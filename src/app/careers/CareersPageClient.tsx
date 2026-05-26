"use client";

import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, MapPin, Clock, Calendar, CheckCircle2, ChevronRight, UploadCloud } from "lucide-react";

export default function CareersPageClient() {
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [applicantName, setApplicantName] = useState("");
  const [applicantEmail, setApplicantEmail] = useState("");
  const [applied, setApplied] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const jobsList = [
    { id: "j1", title: "Telehealth General Physician (MD)", dept: "Clinical Services", location: "Remote (India)", type: "Full-Time", exp: "3+ Years", desc: "Conduct 24/7 video consultations, prescribe digital Rxs, and review patient triage data.", salary: "₹12L - ₹18L L.A." },
    { id: "j2", title: "Lead Pharmacist (R.Ph)", dept: "Quality Assurance", location: "Bangalore", type: "Full-Time", exp: "5+ Years", desc: "Oversee prescription scan verification matching, inventory compliance, and batch validation.", salary: "₹8L - ₹12L L.A." },
    { id: "j3", title: "Senior Phlebotomist", dept: "Diagnostics Operations", location: "Mumbai", type: "Full-Time", exp: "2+ Years", desc: "Handle home collection samples, secure cold-chain diagnostic logistics, and manage reports.", salary: "₹4.5L - ₹6L L.A." },
    { id: "j4", title: "Clinical AI Product Engineer", dept: "Technology Services", location: "Bangalore / Hybrid", type: "Full-Time", exp: "4+ Years", desc: "Build Next.js frontends, train vision models for prescription OCR processing, and integrate payment systems.", salary: "₹24L - ₹36L L.A." }
  ];

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!applicantName || !applicantEmail) {
      alert("Please fill all details!");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setApplied(true);
    }, 1500);
  };

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-white py-12 md:py-20">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-10 space-y-16">
          
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-5xl font-black text-[#0F2C59] tracking-tight">
              Build the Future of <span className="text-[#FF6B00]">Digital Care</span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 font-bold leading-relaxed">
              Join a team of clinicians, researchers, and engineers building India's most secure and intelligent pharmaceutical network.
            </p>
          </div>

          {/* Core Careers Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Side: Job Postings */}
            <div className="lg:col-span-8 space-y-6">
              <h2 className="text-2xl font-black text-[#0F2C59] text-left">Current Openings</h2>
              
              <div className="space-y-4">
                {jobsList.map((job) => (
                  <div 
                    key={job.id} 
                    className={`p-6 border rounded-2xl text-left bg-white transition-all shadow-sm hover:border-[#FF6B00]/40 hover:shadow-md ${
                      selectedJob?.id === job.id ? "border-[#FF6B00] ring-1 ring-[#FF6B00]" : "border-gray-100"
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 bg-[#FFF0EB] text-[#FF6B00] text-[9px] font-black uppercase rounded-md tracking-wider">
                            {job.dept}
                          </span>
                          <span className="px-2.5 py-0.5 bg-gray-50 text-gray-500 text-[9px] font-black uppercase rounded-md tracking-wider border border-gray-100">
                            {job.type}
                          </span>
                        </div>
                        <h3 className="text-lg font-black text-gray-900 leading-tight">{job.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-400">
                          <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location}</span>
                          <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {job.exp}</span>
                          <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {job.salary}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => {
                          setSelectedJob(job);
                          setApplied(false);
                          // Scroll to apply form
                          const formEl = document.getElementById("application-form-block");
                          if (formEl) {
                            formEl.scrollIntoView({ behavior: "smooth" });
                          }
                        }}
                        className="px-5 py-2.5 bg-[#FF6B00] hover:bg-orange-655 text-white text-xs font-black uppercase rounded-xl transition-all shadow-xs cursor-pointer select-none shrink-0"
                      >
                        Apply Now
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold mt-4 border-t border-gray-50 pt-4">
                      {job.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side: Interactive Application Form */}
            <div id="application-form-block" className="lg:col-span-4 bg-gray-50 border border-gray-150 rounded-3xl p-6 sm:p-8 text-left space-y-6">
              {selectedJob ? (
                <>
                  <div className="space-y-1.5">
                    <h3 className="text-lg font-black text-gray-900">Application Form</h3>
                    <p className="text-xs font-bold text-gray-500 leading-tight">
                      Applying for: <strong className="text-[#FF6B00]">{selectedJob.title}</strong>
                    </p>
                  </div>

                  {applied ? (
                    <div className="py-12 flex flex-col items-center justify-center text-center space-y-3 bg-white border border-gray-100 rounded-2xl p-6 shadow-xs animate-pulse">
                      <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center text-2xl mx-auto">
                        ✓
                      </div>
                      <h4 className="text-sm font-black text-[#0F2C59]">Application Received!</h4>
                      <p className="text-[11px] text-gray-450 font-semibold leading-relaxed">
                        Thank you for applying, {applicantName}. Our clinical recruitment team will contact you at {applicantEmail} shortly.
                      </p>
                      <button 
                        onClick={() => {
                          setApplied(false);
                          setApplicantName("");
                          setApplicantEmail("");
                        }}
                        className="px-4 py-1.5 bg-[#0F2C59] hover:bg-[#1a3d6d] text-white text-[10px] font-black rounded-lg mt-2 cursor-pointer transition-colors"
                      >
                        Apply for Another Job
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleApply} className="space-y-4">
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">Full Name</label>
                        <input 
                          type="text" 
                          required
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          placeholder="Enter your name" 
                          className="w-full px-4 py-2.5 text-xs border border-gray-200 bg-white rounded-xl focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">Email Address</label>
                        <input 
                          type="email" 
                          required
                          value={applicantEmail}
                          onChange={(e) => setApplicantEmail(e.target.value)}
                          placeholder="Enter your email" 
                          className="w-full px-4 py-2.5 text-xs border border-gray-200 bg-white rounded-xl focus:border-[#FF6B00] focus:ring-1 focus:ring-[#FF6B00] focus:outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-black text-gray-500 uppercase tracking-wider block">Upload CV / Resume</label>
                        <div className="border border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-[#FF6B00]/40 transition-colors">
                          <UploadCloud className="h-6 w-6 text-gray-400" />
                          <span className="text-[10px] font-black text-[#FF6B00] mt-1.5">Attach Resume</span>
                          <span className="text-[9px] text-gray-450 mt-0.5">PDF or Word files up to 5MB</span>
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3 bg-[#FF6B00] hover:bg-orange-600 text-white text-xs font-black uppercase rounded-xl transition-all shadow-md shadow-brand-orange/15 cursor-pointer text-center flex items-center justify-center gap-1.5"
                      >
                        {submitting ? "Submitting Application..." : "Submit Application"}
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <Briefcase className="h-10 w-10 text-gray-300 mx-auto" />
                  <p className="text-xs font-black text-[#0F2C59]">No Job Selected</p>
                  <p className="text-[11px] text-gray-450 font-semibold leading-relaxed max-w-[180px] mx-auto">
                    Select a job listing on the left to activate the application form.
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}

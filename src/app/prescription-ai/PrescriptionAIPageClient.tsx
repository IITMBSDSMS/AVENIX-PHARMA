"use client";


import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState, PrescriptionScan } from "@/context/AppState";
import { 
  UploadCloud, FileText, Activity, AlertTriangle, ShieldCheck, 
  Sparkles, CheckCircle2, RefreshCw, Layers 
} from "lucide-react";

export default function PrescriptionAIPageClient() {
  const { prescriptions, uploadPrescriptionScan } = useAppState();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState(0);
  const [completedScan, setCompletedScan] = useState<PrescriptionScan | null>(null);
  const [validationError, setValidationError] = useState<{
    type: "human_photo" | "unrelated_document" | "generic_file" | "invalid_format";
    message: string;
  } | null>(null);

  const scanProgressSteps = [
    "Executing high-fidelity OCR scanning...",
    "Extracting handwritten medicine nomenclatures...",
    "Running drug-drug interaction validation index...",
    "Querying CDSCO safety database structures...",
    "Generating premium diagnostic reports..."
  ];

  // Auto progression of scanning texts and validation triggers
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isScanning) {
      let currentStep = 0;
      interval = setInterval(async () => {
        if (currentStep >= scanProgressSteps.length - 1) {
          clearInterval(interval);
          setIsScanning(false);
          setScanStep(0);
          
          const fileName = selectedFile?.name || "prescription_slip.png";
          const res = await uploadPrescriptionScan(fileName);
          if (res.isValid) {
            setCompletedScan(res.prescription);
            setValidationError(null);
          } else {
            setCompletedScan(null);
            setValidationError({
              type: res.errorType || "generic_file",
              message: "Invalid prescription file"
            });
          }
        } else {
          currentStep++;
          setScanStep(currentStep);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isScanning, selectedFile, uploadPrescriptionScan]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Setup preview
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      // Reset states
      setCompletedScan(null);
      setValidationError(null);
    }
  };

  const startScanning = () => {
    if (!selectedFile) return;
    setIsScanning(true);
    setScanStep(0);
    setCompletedScan(null);
    setValidationError(null);
  };

  const loadMockPrescription = () => {
    // Generate a dummy file
    const file = new File(["dummy"], "rx_dr_ananya_sharma.jpg", { type: "image/jpeg" });
    setSelectedFile(file);
    setFilePreview("/images/prescription_scanner.jpg");
    setCompletedScan(null);
    setValidationError(null);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow medical-grid py-10">
        <div className="mx-auto max-w-[1800px] px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="text-center max-w-xl mx-auto space-y-2 mb-10">
            <span className="text-[10px] font-bold uppercase tracking-[0.20em] text-brand-orange">
              Artificial Intelligence
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-brand-dark font-poppins">
              AI Prescription Scanner
            </h1>
            <p className="text-xs text-gray-500">
              Upload diagnostic or handwritten slips. Our OCR engine parses medical records, safety ratings, side effects, and toxic combinations.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Scanner Control Box (Col-Span 5) */}
            <div className="lg:col-span-5 space-y-5">
              <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-lg glass-card relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-brand-orange" />
                
                <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <Layers className="h-4 w-4 text-brand-orange" />
                  Prescription Capture Module
                </h3>

                {/* Upload Area */}
                {!filePreview ? (
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center bg-gray-50 hover:bg-gray-100/50 hover:border-brand-orange/40 transition-colors relative group">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <UploadCloud className="h-10 w-10 text-gray-300 mx-auto group-hover:text-brand-orange transition-colors" />
                    <p className="text-xs font-bold text-gray-700 mt-3">Drag & Drop Prescription Slip</p>
                    <p className="text-[9px] text-gray-400 mt-1">Supports JPG, PNG, PDF formats up to 5MB</p>
                    <div className="mt-4">
                      <span className="inline-block px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[9px] font-bold text-gray-600 hover:text-brand-orange hover:border-brand-orange/40 transition-colors shadow-sm cursor-pointer">
                        Select File
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Prescription image preview container */}
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-950 relative h-64 flex items-center justify-center">
                      <img
                        src={filePreview}
                        alt="Prescription preview"
                        className="max-h-full max-w-full object-contain opacity-80"
                      />

                      {/* Laser scanning line animation */}
                      {isScanning && (
                        <>
                          <div className="absolute left-0 right-0 h-[2px] bg-brand-orange shadow-[0_0_15px_#FF6B00] animate-scan z-10" />
                          <div className="absolute inset-0 bg-brand-orange/5 animate-pulse-slow" />
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500 font-medium truncate max-w-[200px]">
                        {selectedFile?.name}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedFile(null);
                          setFilePreview(null);
                          setCompletedScan(null);
                        }}
                        className="text-[10px] font-bold text-red-500 hover:text-red-600 cursor-pointer"
                      >
                        Remove file
                      </button>
                    </div>

                    {/* Scan Button */}
                    {!isScanning ? (
                      <button
                        onClick={startScanning}
                        className="w-full py-3 bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-orange/15 flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        Start Intelligent AI Scan
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-brand-orange h-full transition-all duration-1000"
                            style={{ width: `${((scanStep + 1) / scanProgressSteps.length) * 100}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-[10px]">
                          <span className="text-brand-orange font-bold animate-pulse">
                            {scanProgressSteps[scanStep]}
                          </span>
                          <span className="text-gray-400 font-semibold">{scanStep + 1}/{scanProgressSteps.length}</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Pre-fill Option for Demo */}
                {!selectedFile && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="text-[9px] text-gray-400 font-medium">No prescription slide handy?</span>
                    <button
                      onClick={loadMockPrescription}
                      className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-orange/10 hover:bg-brand-orange/20 text-brand-orange text-[9px] font-bold transition-all cursor-pointer"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Load Demo Rx Slip
                    </button>
                  </div>
                )}

              </div>
            </div>

            {/* Right: Scan Results (Col-Span 7) */}
            <div className="lg:col-span-7">
              {validationError ? (
                <div className="bg-white border border-red-200 p-6 rounded-2xl shadow-lg relative overflow-hidden space-y-4">
                  <div className="absolute top-0 left-0 right-0 h-[4px] bg-red-500" />
                  <div className="flex items-center gap-3 pb-3 border-b border-red-50 text-red-600">
                    <AlertTriangle className="h-6 w-6 shrink-0" />
                    <div>
                      <h2 className="text-sm font-extrabold tracking-tight">
                        {validationError.type === "human_photo" ? "AI Vision Check: Human Photo Detected" :
                         validationError.type === "unrelated_document" ? "AI Vision Check: Unrelated File Pattern" :
                         validationError.type === "invalid_format" ? "AI Vision Check: Unsupported File Format" :
                         "AI Vision Check: Medical Verification Failed"}
                      </h2>
                      <p className="text-[9px] text-red-500 font-bold uppercase tracking-wider">
                        Document Rejection Code: RX_ERR_{validationError.type.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-gray-600 leading-relaxed space-y-2">
                    <p className="font-semibold text-gray-800">
                      {validationError.type === "human_photo" ? 
                       "Our Bio-AI OCR Vision model detected a human profile picture, selfie, or person in the uploaded file." :
                       validationError.type === "unrelated_document" ? 
                       "The uploaded document is identified as a receipt, administrative form, resume, or non-medical document." :
                       validationError.type === "invalid_format" ?
                       "Only image files (JPG, PNG, WEBP) or PDF documents are allowed. Formats like word documents (.docx), text (.txt), or compressed files are not supported." :
                       "The uploaded file could not be parsed. No prescription layout or medicine names were detected."}
                    </p>
                    <p className="text-gray-500 text-[11px]">
                      Avenix Pharmaceuticals only processes genuine medical prescriptions. A valid doctor's prescription slip must contain:
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 pt-2 border-t border-gray-100">
                      <li className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        <span>Doctor's Name & Qualifications (M.B.B.S / M.D)</span>
                      </li>
                      <li className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        <span>The standard Rx medical symbol</span>
                      </li>
                      <li className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        <span>Patient name, age, and date</span>
                      </li>
                      <li className="flex items-center gap-2 text-[10px] text-gray-500">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                        <span>Registered doctor signature or stamp</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-gray-150 flex items-center justify-between">
                    <span className="text-[9px] text-gray-400">Please upload a valid Rx prescription slip and try again.</span>
                    <button
                      onClick={() => {
                        setSelectedFile(null);
                        setFilePreview(null);
                        setValidationError(null);
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-[10px] font-bold transition-all cursor-pointer"
                    >
                      Clear File
                    </button>
                  </div>
                </div>
              ) : completedScan ? (
                <div className="space-y-6">
                  {/* Result Header Badge */}
                  <div className="bg-white border border-gray-200 p-5 rounded-2xl shadow-lg glass-card space-y-4">
                    <div className="flex items-start justify-between pb-3 border-b border-gray-100">
                      <div className="space-y-0.5">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                          Scan Completed - CDSCO Compliant
                        </span>
                        <h2 className="text-lg font-extrabold text-brand-dark tracking-tight">
                          Prescription Safety Analysis
                        </h2>
                      </div>
                      <div className="text-center bg-green-50 border border-green-200 px-3 py-1.5 rounded-xl">
                        <div className="text-md font-black text-green-600">{completedScan.safetyScore}%</div>
                        <div className="text-[7.5px] font-extrabold text-green-700 tracking-wider uppercase">Safety Score</div>
                      </div>
                    </div>

                    {/* Extracted Medicines Table */}
                    <div className="space-y-2.5">
                      <h4 className="text-[10px] font-extrabold text-brand-orange uppercase tracking-wider">
                        Extracted Medications ({completedScan.medicines.length})
                      </h4>
                      <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 font-bold text-gray-500">
                              <th className="p-3">Medicine Name</th>
                              <th className="p-3">Dosage Level</th>
                              <th className="p-3">Dose Timing</th>
                              <th className="p-3">Clinical Indication</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50 text-gray-700">
                            {completedScan.medicines.map((med, i) => (
                              <tr key={i} className="hover:bg-gray-50/50">
                                <td className="p-3 font-bold text-brand-dark">{med.name}</td>
                                <td className="p-3 font-medium">{med.dose}</td>
                                <td className="p-3 font-semibold text-brand-orange">{med.timing}</td>
                                <td className="p-3 font-medium text-gray-500">{med.purpose}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Side Effects / safety warnings Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      <div className="p-4 rounded-xl bg-orange-50/50 border border-brand-orange/15 space-y-2">
                        <h4 className="text-[10px] font-extrabold text-brand-orange uppercase tracking-widest flex items-center gap-1">
                          <AlertTriangle className="h-3.5 w-3.5" />
                          Safety Alerts & Instructions
                        </h4>
                        <ul className="space-y-1.5">
                          {completedScan.warnings.map((warn, i) => (
                            <li key={i} className="text-[10px] text-brand-orange-dark font-semibold flex items-start gap-1.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-brand-orange mt-1.5 shrink-0" />
                              {warn}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 space-y-2">
                        <h4 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                          <Activity className="h-3.5 w-3.5" />
                          Anticipated Side Effects
                        </h4>
                        <ul className="space-y-1.5">
                          {completedScan.sideEffects.map((side, i) => (
                            <li key={i} className="text-[10px] text-gray-600 font-medium flex items-start gap-1.5">
                              <div className="h-1.5 w-1.5 rounded-full bg-gray-400 mt-1.5 shrink-0" />
                              {side}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Drug-Drug Interactions */}
                    <div className="p-3.5 rounded-xl border border-green-150 bg-green-50/30 flex items-start gap-2.5">
                      <ShieldCheck className="h-4.5 w-4.5 text-green-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <h4 className="text-[10px] font-extrabold text-green-700 uppercase tracking-wider">
                          Drug interaction analysis
                        </h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                          {completedScan.interactions}
                        </p>
                      </div>
                    </div>

                  </div>
                </div>
              ) : (
                <div className="h-full min-h-[350px] border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-center p-6 bg-white glass-card">
                  <FileText className="h-12 w-12 text-gray-300 mb-2 animate-pulse" />
                  <p className="text-xs font-bold text-gray-600">Awaiting Scanner Input</p>
                  <p className="text-[10px] text-gray-400 max-w-sm">
                    Select a prescription file and initiate the AI scanning pipeline to extract dosages, instructions, side effects, and CDSCO compliance records.
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

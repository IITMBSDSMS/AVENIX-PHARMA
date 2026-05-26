"use client";


import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppState, Role } from "@/context/AppState";
import { ShieldCheck, Mail, Lock, KeyRound, ArrowRight, Activity, Smartphone, Eye, EyeOff, ArrowLeft } from "lucide-react";

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPageClient() {
  const router = useRouter();
  const { login, loginWithGoogle, loginWithGoogleToken } = useAppState();
  
  const [detectedRole, setDetectedRole] = useState<Role>("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState<"email" | "password">("email");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleCustomEmail, setGoogleCustomEmail] = useState("");
  const [showGoogleCustomEmailInput, setShowGoogleCustomEmailInput] = useState(false);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  // Dynamically load Google GSI script and initialize button if clientId is configured
  React.useEffect(() => {
    if (!googleClientId) return;

    let script = document.querySelector('script[src="https://accounts.google.com/gsi/client"]') as HTMLScriptElement;
    if (!script) {
      script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }

    const initGoogleBtn = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          use_fedcm_for_prompt: false,
          callback: async (response: any) => {
            setIsLoading(true);
            setError("");
            try {
              const res = await loginWithGoogleToken(response.credential);
              if (res.success) {
                // Decode token to find email for role classification
                const payload = JSON.parse(atob(response.credential.split(".")[1]));
                const gEmail = payload.email;
                const role = getRoleFromEmail(gEmail);
                router.push(`/dashboard/${role === "admin" ? "admin" : role}`);
              } else {
                setError(res.error || "Google verification failed.");
              }
            } catch (err) {
              console.error("Google login token verify error:", err);
              setError("Failed to verify Google identity.");
            } finally {
              setIsLoading(false);
            }
          }
        });

        window.google.accounts.id.renderButton(
          document.getElementById("google-signin-btn"),
          { 
            theme: "outline", 
            size: "large", 
            width: "382", 
            text: "signin_with", 
            shape: "rectangular" 
          }
        );
      }
    };

    script.onload = () => {
      initGoogleBtn();
    };

    if (window.google) {
      initGoogleBtn();
    }
  }, [googleClientId]);

  const handleGoogleAccountSelect = async (gEmail: string, name: string) => {
    setIsLoading(true);
    setError("");
    try {
      const res = await loginWithGoogle(gEmail, name);
      if (res.success) {
        setIsGoogleModalOpen(false);
        const role = getRoleFromEmail(gEmail);
        router.push(`/dashboard/${role === "admin" ? "admin" : role}`);
      } else {
        setError(res.error || "Google Authentication failed.");
      }
    } catch (err) {
      console.error("Google login error:", err);
      setError("Failed to sign in with Google.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleCustomEmail) return;
    
    let namePart = googleCustomEmail.split("@")[0];
    namePart = namePart.replace(/[^a-zA-Z]/g, " ");
    const name = namePart
      ? namePart.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ").trim()
      : "Google User";
      
    await handleGoogleAccountSelect(googleCustomEmail, name);
  };

  const getRoleFromEmail = (emailStr: string): Role => {
    const cleanEmail = emailStr.trim().toLowerCase();
    if (
      cleanEmail === "avnish@avenix.in" ||
      cleanEmail === "admin@avenix.in" ||
      cleanEmail.endsWith("@admin.avenix.in")
    ) {
      return "admin";
    }
    if (cleanEmail.startsWith("dr.") || cleanEmail.endsWith("@doctor.avenix.in")) {
      return "doctor";
    }
    if (cleanEmail.startsWith("ph.") || cleanEmail.endsWith("@pharmacist.avenix.in")) {
      return "pharmacist";
    }
    return "customer";
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setError("");
    setIsLoading(true);
    const role = getRoleFromEmail(email);
    setDetectedRole(role);

    // Simulate minor premium network check before showing password screen
    setTimeout(() => {
      setIsLoading(false);
      setStep("password");
    }, 600);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setError("Password is required");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await login(detectedRole, email, password);
      if (res.success) {
        // Redirect to correct dashboard
        router.push(`/dashboard/${detectedRole === "admin" ? "admin" : detectedRole}`);
      } else {
        setError(res.error || "Invalid password or credentials matching this email.");
      }
    } catch (err) {
      console.error("Login verification error:", err);
      setError("An unexpected network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <main className="flex-grow medical-grid flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative min-h-[calc(100vh-16rem)]">
        <div className="absolute top-1/4 left-1/3 -z-10 h-[300px] w-[300px] rounded-full bg-brand-orange/5 blur-3xl pointer-events-none" />
        
        <div className="w-full max-w-md bg-white border border-gray-200/80 p-6 sm:p-8 rounded-3xl shadow-2xl glass-card relative overflow-hidden">
          {/* Futuristic corner accent */}
          <div className="absolute -top-12 -right-12 h-24 w-24 rounded-full bg-brand-orange/10 blur-md" />

          <div className="text-center space-y-2 mb-6">
            <Link href="/" className="inline-flex justify-center mb-1">
              <div className="flex flex-col select-none">
                <span className="text-2xl sm:text-[26px] md:text-[28px] font-extrabold tracking-tight text-brand-dark flex items-center font-poppins">
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
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest pt-1">
              Secure Identity Authentication Portal
            </p>
          </div>

          {step === "email" ? (
            <form onSubmit={handleEmailSubmit} className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                  Registered Identity Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. avnish@avenix.in, dr.verma@..., ph.rahul@..."
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-orange transition-colors"
                  />
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-md shadow-brand-orange/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Continue to Password
                    <ArrowRight className="h-3.5 w-3.5" />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className="relative flex items-center justify-center my-2">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-150"></div>
                </div>
                <span className="relative px-3 bg-white text-[9px] font-extrabold uppercase text-gray-400">
                  Or
                </span>
              </div>

              {googleClientId ? (
                /* Real Google OAuth Button Container */
                <div className="flex justify-center w-full min-h-[40px]">
                  <div id="google-signin-btn" className="w-full flex justify-center"></div>
                </div>
              ) : (
                /* Simulated Google Login Button Fallback */
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(true)}
                  className="w-full py-2.5 bg-white hover:bg-gray-50 border border-gray-200/80 text-gray-700 text-xs font-bold rounded-xl transition-all duration-300 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  Sign in with Google
                </button>
              )}

            </form>
          ) : (
            <form onSubmit={handleLoginSubmit} className="space-y-4 animate-fade-in">
              {/* Identity Details Card */}
              <div className="flex items-center justify-between bg-gray-50 border border-gray-150 px-3.5 py-2.5 rounded-2xl text-xs mb-2">
                <div className="flex items-center gap-2 text-brand-dark min-w-0">
                  <div className="h-6 w-6 rounded-full bg-brand-orange/10 flex items-center justify-center text-brand-orange shrink-0">
                    <Mail className="h-3.5 w-3.5" />
                  </div>
                  <span className="font-medium truncate text-gray-700">{email}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setError("");
                    setPassword("");
                  }}
                  className="text-[10.5px] font-extrabold text-brand-orange hover:text-brand-orange-light transition-colors whitespace-nowrap px-2.5 py-1 rounded-lg hover:bg-brand-orange/5"
                >
                  Change
                </button>
              </div>

              {/* Classification Pill */}
              <div className="flex items-center gap-1.5 bg-gray-50/50 border border-gray-100 p-2 rounded-xl w-fit">
                <span className={`inline-block h-2 w-2 rounded-full ${
                  detectedRole === "admin" ? "bg-brand-orange" :
                  detectedRole === "doctor" ? "bg-emerald-500" :
                  detectedRole === "pharmacist" ? "bg-blue-500" : "bg-purple-500"
                }`} />
                <span className="text-[9.5px] font-extrabold text-gray-500 uppercase tracking-widest">
                  Role: {detectedRole === "admin" ? "Super Admin" : detectedRole.charAt(0).toUpperCase() + detectedRole.slice(1)}
                </span>
              </div>

              {/* Password Input */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                  Password Credentials
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={
                      detectedRole === "admin" ? "admin123" :
                      detectedRole === "doctor" ? "doctor123" :
                      detectedRole === "pharmacist" ? "pharma123" :
                      "customer123"
                    }
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-orange transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-brand-dark hover:bg-black text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Verify and Authorize
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="bg-rose-50 border border-rose-100 text-rose-600 px-3.5 py-2.5 rounded-xl text-[10.5px] font-medium flex items-start gap-2 shadow-[0_2px_4px_rgba(244,63,94,0.05)] animate-shake mt-2">
                  <span className="shrink-0 mt-0.5 font-bold text-xs">⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              {/* Context Instructions */}
              <div className="bg-gray-50/60 border border-gray-100 p-3 rounded-xl text-[9.5px] text-gray-500 leading-relaxed mt-2">
                {detectedRole === "customer" ? (
                  <p>
                    <span className="font-extrabold text-gray-600 block mb-0.5">💡 Customer Auto-Registration</span>
                    If this email does not exist, a new profile will be registered with your entered password. Existing profiles must match passwords (default: <code className="bg-gray-200/80 px-1 rounded font-bold font-mono">customer123</code>).
                  </p>
                ) : (
                  <p>
                    <span className="font-extrabold text-gray-600 block mb-0.5">🔒 Administrative Access Only</span>
                    Pre-seeded administrative credentials required. System credentials defaults are: <code className="bg-gray-200/80 px-1 rounded font-bold font-mono">admin123</code> / <code className="bg-gray-200/80 px-1 rounded font-bold font-mono">doctor123</code> / <code className="bg-gray-200/80 px-1 rounded font-bold font-mono">pharma123</code>.
                  </p>
                )}
              </div>
            </form>
          )}
        </div>
      </main>

      {/* Simulated Google Accounts Selection Popup Modal */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className="w-full max-w-sm bg-white border border-gray-200 rounded-3xl shadow-2xl p-6 relative overflow-hidden animate-scale-up">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsGoogleModalOpen(false);
                setShowGoogleCustomEmailInput(false);
                setGoogleCustomEmail("");
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer"
            >
              &times;
            </button>

            {/* Google Logo */}
            <div className="flex justify-center mb-3">
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  fill="#EA4335"
                />
              </svg>
            </div>

            <h3 className="text-center text-sm font-black text-gray-800">
              Sign in with Google
            </h3>
            <p className="text-center text-[10px] text-gray-400 mt-0.5 mb-5 font-medium uppercase tracking-wider">
              to continue to Avenix Pharmaceuticals
            </p>

            {!showGoogleCustomEmailInput ? (
              <div className="space-y-2">
                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">
                  Choose an account
                </p>

                {/* Preconfigured Google Accounts */}
                {[
                  { name: "Avnish Kumar", email: "avnish@gmail.com", avatar: "AK", color: "bg-purple-100 text-purple-700" },
                  { name: "Avnish Verma", email: "avnishverma718@gmail.com", avatar: "AV", color: "bg-blue-100 text-blue-700" },
                  { name: "Avnish (Super Admin)", email: "avnish@avenix.in", avatar: "SA", color: "bg-brand-orange/10 text-brand-orange" }
                ].map((acc) => (
                  <button
                    key={acc.email}
                    onClick={() => handleGoogleAccountSelect(acc.email, acc.name)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl border border-gray-150 hover:bg-gray-50 transition-colors text-left cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${acc.color}`}>
                        {acc.avatar}
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-gray-800 text-xs block truncate leading-none">{acc.name}</span>
                        <span className="text-[10px] text-gray-500 font-mono truncate">{acc.email}</span>
                      </div>
                    </div>
                    <ArrowRight className="h-3.5 w-3.5 text-gray-400 shrink-0" />
                  </button>
                ))}

                {/* Use another account button */}
                <button
                  onClick={() => setShowGoogleCustomEmailInput(true)}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-dashed border-gray-300 hover:border-brand-orange hover:bg-brand-orange/5 transition-all text-left cursor-pointer mt-3"
                >
                  <div className="h-8 w-8 rounded-full border border-gray-300 bg-gray-50 flex items-center justify-center text-gray-500 shrink-0">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <div>
                    <span className="font-bold text-gray-700 text-xs block leading-none">Use another account</span>
                    <span className="text-[9px] text-gray-400 mt-1 block">Log in with a different Google account</span>
                  </div>
                </button>
              </div>
            ) : (
              <form onSubmit={handleGoogleCustomSubmit} className="space-y-4">
                <div className="flex items-center gap-2 mb-1">
                  <button
                    type="button"
                    onClick={() => {
                      setShowGoogleCustomEmailInput(false);
                      setGoogleCustomEmail("");
                    }}
                    className="p-1 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <span className="text-xs font-bold text-gray-750">Enter Google Account</span>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">
                    Google Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                      <Mail className="h-4 w-4" />
                    </div>
                    <input
                      type="email"
                      required
                      value={googleCustomEmail}
                      onChange={(e) => setGoogleCustomEmail(e.target.value)}
                      placeholder="e.g. yourname@gmail.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-brand-dark focus:outline-none focus:border-brand-orange transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-brand-orange hover:bg-brand-orange-light text-white text-xs font-bold rounded-xl transition-all duration-300 shadow-md shadow-brand-orange/20 flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      Sign In & Authorize
                      <ShieldCheck className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

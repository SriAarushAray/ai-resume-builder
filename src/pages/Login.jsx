import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  auth,
  googleProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  isFirebaseMock
} from "../firebase";
import { extractTextFromPdf, parseResumeText } from "../utils/pdfParser";

function Login() {
  const navigate = useNavigate();

  // Auth form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authProvider, setAuthProvider] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Parser states
  const [isParsing, setIsParsing] = useState(false);
  const [parseStep, setParseStep] = useState(0);
  const [dragActive, setDragActive] = useState(false);

  const PARSE_STEPS = [
    { title: "Analyzing PDF Document", desc: "Reading text vectors and identifying sections..." },
    { title: "Extracting Profile Data", desc: "Parsing contact details, email, and education history..." },
    { title: "Mapping Work Timeline", desc: "Compiling job roles, responsibilities, and performance metrics..." },
    { title: "Synthesizing Competencies", desc: "Categorizing skill keywords and generating A4 workspace..." }
  ];

  // Listen to popup authentication coordinates
  useEffect(() => {
    const handleAuthMessage = (event) => {
      if (event.data && event.data.type === "OAUTH_SUCCESS") {
        const { user, importType, resume } = event.data;
        setIsAuthenticating(false);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userName", user.name);
        const emailVal = user.email || `${user.name.toLowerCase().replace(/\s+/g, "")}@${importType.toLowerCase()}.com`;
        localStorage.setItem("userEmail", emailVal);
        if (user.avatar) {
          localStorage.setItem("userAvatar", user.avatar);
        }

        if (importType === "LINKEDIN" || importType === "GITHUB") {
          const resumesKey = `savedResumes_${emailVal}`;
          const savedResumes = JSON.parse(localStorage.getItem(resumesKey) || "[]");
          const staticId = `${importType.toLowerCase()}-imported`;
          
          const existingIndex = savedResumes.findIndex(r => r.id === staticId);
          const importedResume = {
            id: staticId,
            name: `${user.name}'s Resume (${importType === "LINKEDIN" ? "LinkedIn" : "GitHub"} Import)`,
            lastEdited: 1,
            atsScore: importType === "LINKEDIN" ? 92 : 89,
            data: resume
          };

          if (existingIndex === -1) {
            savedResumes.push(importedResume);
            localStorage.setItem(resumesKey, JSON.stringify(savedResumes));
          }
        }

        navigate("/dashboard");
      }
    };

    window.addEventListener("message", handleAuthMessage);
    return () => window.removeEventListener("message", handleAuthMessage);
  }, [navigate]);

  // Centered Popup Handler for Backend & Mock Auth
  const openAuthPopup = (providerName) => {
    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    setIsAuthenticating(true);

    const targetUrl = providerName === "Google"
      ? `/auth/google`
      : `http://localhost:5000/api/auth/${providerName.toLowerCase()}`;

    const popup = window.open(
      targetUrl,
      `OAuth_${providerName}`,
      `width=${width},height=${height},top=${top},left=${left},status=no,resizable=yes`
    );

    if (!popup || popup.closed || typeof popup.closed === "undefined") {
      setIsAuthenticating(false);
      alert(`Popup blocked! Please enable popups in your browser settings to log in with ${providerName}.`);
      return;
    }

    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        setIsAuthenticating(false);
      }
    }, 1000);
  };

  // Handle Mock/Live Email Login & Signup
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    setIsAuthenticating(true);
    setAuthProvider("Email");
    setErrorMsg("");

    if (!isFirebaseMock) {
      try {
        if (isSignUp) {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userName", user.displayName || "Sri Aarush");
          navigate("/dashboard");
        } else {
          const userCredential = await signInWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userName", user.displayName || "Sri Aarush");
          navigate("/dashboard");
        }
      } catch (authError) {
        console.error("Firebase authentication error:", authError);
        let readableMsg = authError.message;
        if (authError.code === "auth/user-not-found") {
          readableMsg = "No account found with this email. Please sign up first.";
        } else if (authError.code === "auth/wrong-password" || authError.code === "auth/invalid-credential") {
          readableMsg = "Incorrect password or account details. Please try again.";
        } else if (authError.code === "auth/email-already-in-use") {
          readableMsg = "This email is already registered. Please sign in instead.";
        } else if (authError.code === "auth/weak-password") {
          readableMsg = "Password should be at least 6 characters long.";
        }
        setErrorMsg(readableMsg);
      } finally {
        setIsAuthenticating(false);
      }
    } else {
      setTimeout(() => {
        setIsAuthenticating(false);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", email);
        localStorage.setItem("userName", "Sri Aarush");
        navigate("/dashboard");
      }, 1500);
    }
  };

  // Handle Mock/Live Social Logins
  const handleSocialLogin = async (providerName) => {
    setAuthProvider(providerName);

    if (providerName === "Google") {
      if (!isFirebaseMock) {
        setIsAuthenticating(true);
        try {
          const result = await signInWithPopup(auth, googleProvider);
          const user = result.user;
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userName", user.displayName || "Sri Aarush");
          localStorage.setItem("userEmail", user.email);
          if (user.photoURL) {
            localStorage.setItem("userAvatar", user.photoURL);
          }
          navigate("/dashboard");
        } catch (error) {
          console.error("Google live sign-in error:", error);
          alert("Google live sign-in failed: " + error.message);
        } finally {
          setIsAuthenticating(false);
        }
      } else {
        openAuthPopup("Google");
      }
    } else {
      openAuthPopup(providerName);
    }
  };

  // Handle PDF drop / selection parsing
  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      triggerParser(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      triggerParser(e.target.files[0]);
    }
  };

  const triggerParser = async (file) => {
    if (!file) return;
    setIsParsing(true);
    setParseStep(0);

    const interval = setInterval(() => {
      setParseStep(prev => {
        if (prev < PARSE_STEPS.length - 1) {
          return prev + 1;
        } else {
          return prev;
        }
      });
    }, 800);

    try {
      const rawText = await extractTextFromPdf(file);
      const parsedData = parseResumeText(rawText);
      
      await new Promise(resolve => setTimeout(resolve, 3200));
      clearInterval(interval);

      const parsedName = parsedData.personal.fullName || "Guest User";
      localStorage.setItem("userEmail", "guest");
      localStorage.setItem("userName", `${parsedName} (Guest)`);
      localStorage.setItem("isGuest", "true");

      const resumesKey = "savedResumes_guest";
      const savedResumes = JSON.parse(localStorage.getItem(resumesKey) || "[]");
      const newResumeId = "parsed-" + Date.now().toString();
      
      let atsScore = 65;
      if (parsedData.skills.length > 5) atsScore += 10;
      if (parsedData.experiences.length > 0) atsScore += 10;
      if (parsedData.projects.length > 0) atsScore += 5;
      if (parsedData.personal.email && parsedData.personal.phone) atsScore += 5;
      atsScore = Math.min(atsScore, 98);

      const parsedResumeObject = {
        id: newResumeId,
        name: `${parsedName}'s Resume (Parsed)`,
        lastEdited: Date.now(),
        atsScore: atsScore,
        data: parsedData
      };

      savedResumes.push(parsedResumeObject);
      localStorage.setItem(resumesKey, JSON.stringify(savedResumes));

      setIsParsing(false);
      navigate(`/builder/${newResumeId}`);
    } catch (err) {
      console.error("PDF Parsing failed:", err);
      clearInterval(interval);
      setIsParsing(false);
      alert(`Failed to parse the PDF file: ${err.message || err.toString()}\n\nPlease ensure it is a text-based PDF and try again.`);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#030712] text-slate-100 flex items-center justify-center p-6 overflow-hidden select-none">
      <style>{`
        @keyframes scroll-bg {
          0% { background-position-y: 0px; }
          100% { background-position-y: 1600px; }
        }
        @keyframes laser-scan {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 100%; opacity: 0.8; }
          100% { top: 0%; opacity: 0.8; }
        }
        @keyframes rotate-orbit-1 {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes rotate-orbit-2 {
          0% { transform: translate(-50%, -50%) rotate(360deg); }
          100% { transform: translate(-50%, -50%) rotate(0deg); }
        }
        @keyframes float-ball-1 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.01); }
        }
        @keyframes float-ball-2 {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(12px) scale(0.99); }
        }
        .laser-line-parser {
          height: 3px;
          background: linear-gradient(90deg, transparent, #22d3ee, #a78bfa, #22d3ee, transparent);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.8);
          animation: laser-scan 3.5s ease-in-out infinite;
        }
        .orbit-ring-1 {
          border: 1px dashed rgba(6, 182, 212, 0.12);
          animation: rotate-orbit-1 50s linear infinite;
        }
        .orbit-ring-2 {
          border: 1px dashed rgba(167, 139, 250, 0.08);
          animation: rotate-orbit-2 70s linear infinite;
        }
        .floating-sphere-1 {
          animation: float-ball-1 6s ease-in-out infinite;
        }
        .floating-sphere-2 {
          animation: float-ball-2 7s ease-in-out infinite;
        }
        .ball-input-focus:focus {
          border-color: #22d3ee;
          box-shadow: 0 0 10px rgba(34, 211, 238, 0.2);
        }
      `}</style>

      {/* Starry background */}
      <div 
        className="absolute inset-0 bg-repeat opacity-[0.05] pointer-events-none mix-blend-screen z-0" 
        style={{ 
          backgroundImage: "url('/landing_bg.png')", 
          backgroundSize: '1600px auto',
          animation: 'scroll-bg 150s linear infinite'
        }}
      />

      {/* Orbit paths */}
      <div className="absolute top-1/2 left-1/2 w-[850px] h-[850px] rounded-full orbit-ring-1 pointer-events-none z-0"></div>
      <div className="absolute top-1/2 left-1/2 w-[1150px] h-[1150px] rounded-full orbit-ring-2 pointer-events-none z-0"></div>

      {/* Glowing cosmic background orbs */}
      <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px] mix-blend-screen pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[140px] mix-blend-screen pointer-events-none"></div>

      {/* MAIN CONTAINER */}
      <div className="flex flex-wrap items-center justify-center gap-8 relative z-10 max-w-6xl w-full">
        
        {/* SPHERE A: AUTHENTICATION POD */}
        <div className="floating-sphere-1 w-[460px] h-[460px] rounded-full bg-[#0a1122]/85 border border-white/10 backdrop-blur-xl shadow-[0_0_60px_-10px_rgba(6,182,212,0.25)] flex flex-col items-center justify-center p-12 text-center relative group select-text">
          
          {/* Sphere reflection highlight */}
          <div className="absolute top-4 left-1/4 w-[160px] h-[40px] bg-gradient-to-b from-white/15 to-transparent rounded-full blur-sm pointer-events-none"></div>

          {/* Logo Header */}
          <div className="flex items-center gap-2.5 mb-5 cursor-pointer select-none" onClick={() => navigate("/")}>
            <div className="relative w-7 h-7 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-violet-500 rounded-lg blur-sm opacity-40"></div>
              <svg className="relative w-6 h-6" viewBox="0 0 32 32" fill="none">
                <defs>
                  <linearGradient id="q-logo-login" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle cx="15" cy="15" r="9" stroke="url(#q-logo-login)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M12 10.5H17.5L19.5 12.5V19.5H12V10.5Z" fill="white" />
                <path d="M21 21L27 27" stroke="url(#q-logo-login)" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </div>
            <span className="text-lg font-bold text-white tracking-widest uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Resumiq</span>
          </div>

          {isAuthenticating ? (
            <div className="flex flex-col items-center justify-center space-y-4">
              <svg className="animate-spin h-9 w-9 text-cyan-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <div>
                <h4 className="font-bold text-white text-sm">Connecting with {authProvider}...</h4>
                <p className="text-[10px] text-slate-500 mt-1">Authorizing profile credentials safely.</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4 w-full">
              <div className="text-center">
                <h2 className="text-xl font-black text-white leading-tight">
                  {isSignUp ? "Create Account" : "Welcome Back"}
                </h2>
                {errorMsg ? (
                  <p className="text-red-400 text-[10px] font-semibold leading-tight max-w-[280px] text-center my-1 select-none">
                    ⚠️ {errorMsg}
                  </p>
                ) : (
                  <p className="text-slate-400 text-[11px] mt-0.5 leading-tight max-w-[280px] text-center select-none">
                    {isSignUp ? "Register to save and sync resumes." : "Log in to manage your workspaces."}
                  </p>
                )}
              </div>

              {isFirebaseMock && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[9px] uppercase font-extrabold tracking-wider px-2.5 py-1 rounded-lg text-center select-none">
                  Demo Mode (Offline)
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-2.5 w-full flex flex-col items-center">
                <input
                  type="email"
                  required
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-[280px] bg-[#070d1a]/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none ball-input-focus transition-all"
                />

                <input
                  type="password"
                  required
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-[280px] bg-[#070d1a]/80 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none ball-input-focus transition-all"
                />

                <button
                  type="submit"
                  className="w-[280px] bg-white hover:bg-slate-200 text-black font-black py-2.5 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.15)] active:scale-95 text-xs mt-1"
                >
                  {isSignUp ? "Sign Up" : "Sign In"}
                </button>
              </form>

              <div className="text-center text-[10px] text-slate-400 select-none">
                {isSignUp ? "Already registered?" : "New user?"}{" "}
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUp(!isSignUp);
                    setErrorMsg("");
                  }}
                  className="text-cyan-400 hover:underline font-bold focus:outline-none"
                >
                  {isSignUp ? "Sign In" : "Sign Up"}
                </button>
              </div>

              <div className="flex items-center gap-2.5 text-[9px] text-slate-600 w-[280px] select-none">
                <div className="flex-1 h-px bg-white/5"></div>
                <span>SOCIAL SIGN IN</span>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>

              {/* Social Login circular buttons */}
              <div className="flex gap-4 justify-center select-none">
                {/* LinkedIn */}
                <button
                  onClick={() => handleSocialLogin("LinkedIn")}
                  title="Sign In with LinkedIn"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-[#0077b5]/10 hover:border-[#0077b5]/30 text-slate-300 hover:text-white transition-all active:scale-90 group"
                >
                  <svg className="w-4 h-4 text-[#0077b5] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </button>

                {/* Google */}
                <button
                  onClick={() => handleSocialLogin("Google")}
                  title="Sign In with Google"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all active:scale-90 group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                </button>

                {/* GitHub */}
                <button
                  onClick={() => handleSocialLogin("GitHub")}
                  title="Sign In with GitHub"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all active:scale-90 group"
                >
                  <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SPHERE B: PDF PARSER POD */}
        <div className="floating-sphere-2 w-[460px] h-[460px] rounded-full bg-[#070b18]/80 border border-white/10 backdrop-blur-xl shadow-[0_0_60px_-10px_rgba(167,139,250,0.2)] flex flex-col items-center justify-center p-12 text-center relative group">
          
          {/* Sphere reflection highlight */}
          <div className="absolute top-4 left-1/4 w-[160px] h-[40px] bg-gradient-to-b from-white/10 to-transparent rounded-full blur-sm pointer-events-none"></div>

          {isParsing ? (
            <div className="flex flex-col items-center justify-center space-y-5 w-full">
              {/* Circular laser scan area */}
              <div className="relative w-20 h-24 bg-slate-900/90 border border-white/10 rounded-lg overflow-hidden shadow-2xl p-2 flex flex-col gap-1.5 animate-pulse">
                <div className="laser-line-parser absolute top-0 left-0 w-full z-20 pointer-events-none"></div>
                <div className="h-2 w-1/2 bg-white/15 rounded"></div>
                <div className="h-1.5 w-full bg-white/5 rounded"></div>
                <div className="h-1.5 w-5/6 bg-white/5 rounded"></div>
                <div className="h-1.5 w-2/3 bg-white/5 rounded"></div>
                <div className="h-px bg-white/5 my-0.5"></div>
                <div className="h-1.5 w-4/5 bg-cyan-500/10 rounded"></div>
                <div className="h-1.5 w-full bg-white/5 rounded"></div>
              </div>

              <div className="space-y-1 select-none">
                <h3 className="text-sm font-bold text-white">{PARSE_STEPS[parseStep].title}</h3>
                <p className="text-[10px] text-slate-400 max-w-[240px] mx-auto leading-relaxed">{PARSE_STEPS[parseStep].desc}</p>
              </div>

              {/* Progress ticker */}
              <div className="w-48 h-1.5 bg-[#050b18] rounded-full overflow-hidden border border-white/5 select-none">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-1000 ease-out"
                  style={{ width: `${((parseStep + 1) / PARSE_STEPS.length) * 100}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-4 w-full">
              <div className="select-none">
                <h2 className="text-xl font-black text-white">Start Instantly</h2>
                <p className="text-slate-400 text-[11px] mt-0.5 leading-tight max-w-[280px] mx-auto">
                  Skip sign in. Drag your resume PDF to import details.
                </p>
              </div>

              {/* Circular Drop Zone */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleFileDrop}
                className={`relative w-[240px] h-[240px] rounded-full border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  dragActive 
                    ? "border-cyan-400 bg-cyan-950/15 shadow-[0_0_25px_rgba(34,211,238,0.1)] scale-[0.98]" 
                    : "border-white/10 bg-white/[0.01] hover:border-cyan-500/30 hover:bg-white/[0.02]"
                }`}
              >
                {/* Laser animation inside the circle on hover */}
                <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-10 pointer-events-none transition-opacity duration-300">
                  <div className="laser-line-parser absolute top-0 left-0 w-full"></div>
                </div>

                <input
                  type="file"
                  id="pdf-upload-input"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <label htmlFor="pdf-upload-input" className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 z-10 select-none">
                  <div className="w-10 h-10 rounded-full bg-cyan-950/20 border border-cyan-500/10 flex items-center justify-center text-cyan-400 mb-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">Drag & drop PDF here</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">or click to browse device</p>
                  </div>
                  <div className="text-[8px] font-bold text-slate-500 bg-slate-900 border border-white/5 px-2 py-0.5 rounded uppercase tracking-wider mt-2.5">
                    PDF (Max 5MB)
                  </div>
                </label>
              </div>

              {/* Informational ticks */}
              <div className="space-y-1 text-[10px] text-slate-400 select-none text-left w-[240px] px-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-400">⚡</span>
                  <span>100% client-side parser</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-cyan-400">⚡</span>
                  <span>Fills profile & history instantly</span>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default Login;

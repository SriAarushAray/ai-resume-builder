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

  // Mock parsed resume data structure
  const mockParsedResume = {
    personal: {
      fullName: "Sri Aarush Aray",
      email: "aarush.aray@resumiq.ai",
      phone: "+91 98765 43210",
      location: "Bangalore, India",
      summary: "High-performance Full Stack Engineer specializing in React architectures, real-time metrics dashboards, and AI pipeline integrations. Passionate about optimization and scalable systems."
    },
    skills: ["React", "TypeScript", "JavaScript", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Git", "Docker", "RESTful APIs", "State Management", "CI/CD Pipelines"],
    education: {
      college: "Indian Institute of Technology",
      degree: "B.Tech in Computer Science & Engineering",
      year: "2024",
      gpa: "9.2/10"
    },
    experiences: [
      {
        company: "InnovateTech Solutions",
        role: "Frontend Engineering Intern",
        year: "May 2023 - Present",
        summary: "Architected modern modular UI dashboards using React, optimizing state management hooks and slashing average page load latency by 34% (from 420ms to 277ms).",
        points: ["Architected modern modular UI dashboards using React, optimizing state management hooks and slashing average page load latency by 34%.", "Spearheaded integration of real-time WebSocket charts, increasing data rendering speeds by 25% under load."]
      },
      {
        company: "Launchpad Labs",
        role: "Software Developer Intern",
        year: "Dec 2022 - Apr 2023",
        summary: "Developed secure RESTful API routes in Node.js/Express, increasing database throughput by 2.2x using SQL query indices.",
        points: ["Developed secure RESTful API routes in Node.js/Express, increasing database throughput by 2.2x using SQL query indices.", "Implemented responsive design patterns using Tailwind CSS, improving mobile conversion rates by 18%."]
      }
    ],
    projects: [
      {
        title: "AI-Powered Smart Dashboard",
        technologies: "React, Node.js, WebSockets, Tailwind",
        points: [
          "Engineered responsive full-stack telemetry dashboard mapping server metrics in real-time.",
          "Compressed client assets and implemented lazy loading routines, boosting Lighthouse rating to 98%."
        ]
      }
    ],
    achievements: [
      { title: "Hackathon Winner", desc: "First Place out of 120 teams in TechGlow Innovation Challenge." }
    ],
    certificates: [
      { title: "AWS Certified Developer", issuer: "Amazon Web Services (2024)" }
    ],
    publications: [],
    responsibilities: [
      { role: "Technical Lead", desc: "Guided a team of 4 junior developers to ship project modules." }
    ]
  };

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
            lastEdited: Date.now(),
            atsScore: importType === "LINKEDIN" ? 92 : 89,
            data: resume
          };

          if (existingIndex === -1) {
            // Only create the imported card if it doesn't exist yet.
            // This preserves all manual edits the user makes to their resume.
            savedResumes.push(importedResume);
            localStorage.setItem(resumesKey, JSON.stringify(savedResumes));
          }
        }

        // Always redirect to dashboard instead of direct builder workspace
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

    // If it's Google, open our React client-side mock popup
    // If it's LinkedIn or GitHub, call our Node/Express backend on port 5000
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

    // Monitor when the popup is closed by the user
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
          // Real Firebase Sign Up
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          localStorage.setItem("isLoggedIn", "true");
          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userName", user.displayName || "Sri Aarush");
          navigate("/dashboard");
        } else {
          // Real Firebase Sign In (Strict validation)
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
      // Mock Fallback
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
      // Both GitHub and LinkedIn redirect to our Node backend server to execute
      // the real OAuth flow, fetch repositories, and generate the profile.
      openAuthPopup(providerName);
    }
  };

  // Handle PDF drop / selection simulation
  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      triggerParser();
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      triggerParser();
    }
  };

  const triggerParser = () => {
    setIsParsing(true);
    setParseStep(0);

    const interval = setInterval(() => {
      setParseStep(prev => {
        if (prev < PARSE_STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          return prev;
        }
      });
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      
      localStorage.setItem("userEmail", "guest");
      localStorage.setItem("userName", "Sri Aarush (Guest)");
      const resumesKey = "savedResumes_guest";
      const savedResumes = JSON.parse(localStorage.getItem(resumesKey) || "[]");
      const newResumeId = "parsed-" + Date.now().toString();
      
      const parsedResumeObject = {
        id: newResumeId,
        name: "Sri Aarush's Resume (Parsed)",
        lastEdited: Date.now(),
        atsScore: 88,
        data: mockParsedResume
      };

      savedResumes.push(parsedResumeObject);
      localStorage.setItem(resumesKey, JSON.stringify(savedResumes));
      localStorage.setItem("isGuest", "true");

      setIsParsing(false);
      navigate(`/builder/${newResumeId}`);
    }, 4500);
  };

  return (
    <div className="relative min-h-screen bg-[#070b14] text-slate-100 flex items-center justify-center p-6 overflow-y-auto">
      {/* Background Animated Scrolling Grid */}
      <div 
        className="absolute inset-0 bg-repeat opacity-[0.06] pointer-events-none mix-blend-screen z-0 animate-scroll-bg" 
        style={{ 
          backgroundImage: "url('/landing_bg.png')", 
          backgroundSize: '1600px auto',
          animation: 'scroll-bg 120s linear infinite'
        }}
      />
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
        .laser-line-parser {
          height: 3px;
          background: linear-gradient(90deg, transparent, #22d3ee, #a78bfa, #22d3ee, transparent);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.8);
          animation: laser-scan 3.5s ease-in-out infinite;
        }
      `}</style>

      {/* Glow Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/5 rounded-full blur-[140px] mix-blend-screen pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[140px] mix-blend-screen pointer-events-none"></div>

      <div className="w-full max-w-5xl glass-card overflow-hidden shadow-2xl relative z-10 grid md:grid-cols-12 min-h-[620px] border border-white/10 rounded-3xl">
        
        {/* LEFT COLUMN: AUTHENTICATION */}
        <div className="md:col-span-6 p-8 flex flex-col justify-between border-b md:border-b-0 md:border-r border-white/5 bg-[#0c1220]/40">
          
          {/* Logo Header */}
          <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate("/")}>
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-violet-500 rounded-lg blur-sm opacity-40 animate-pulse"></div>
              <svg className="relative w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="q-logo-login" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle cx="15" cy="15" r="9" stroke="url(#q-logo-login)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="42 12" />
                <path d="M12 10.5H17.5L19.5 12.5V19.5H12V10.5Z" fill="white" />
                <path d="M14 13.5H17" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
                <path d="M14 16.5H17" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
                <path d="M21 21L27 27" stroke="url(#q-logo-login)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M24 27H27V24" stroke="url(#q-logo-login)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-widest uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">Resumiq</span>
          </div>

          {/* Authentic login box */}
          {isAuthenticating ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
              <svg className="animate-spin h-10 w-10 text-cyan-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <div>
                <h4 className="font-bold text-white">Connecting with {authProvider}...</h4>
                <p className="text-xs text-slate-500 mt-1">Authorizing profile credentials safely.</p>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center space-y-5">
              <div>
                <h2 className="text-2xl font-black text-white">
                  {isSignUp ? "Create your account" : "Welcome back"}
                </h2>
                <p className="text-slate-400 text-sm mt-1">
                  {isSignUp 
                    ? "Sign up to start building and optimizing your resumes." 
                    : "Log in to manage and optimize your career resumes."}
                </p>
              </div>

              {isFirebaseMock && (
                <div className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-[10px] uppercase font-bold tracking-wider px-3 py-2 rounded-xl text-center">
                  ⚠️ Demo Mode Active (Offline Auth)
                </div>
              )}

              {errorMsg && (
                <div className="bg-red-500/10 border border-red-500/25 text-red-400 text-xs px-4 py-3 rounded-xl font-medium animate-in fade-in duration-300">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0c1220]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#0c1220]/60 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-white hover:bg-slate-200 text-black font-extrabold py-3 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-95 text-sm"
                >
                  {isSignUp ? "Create Account" : "Sign In with Email"}
                </button>
              </form>

              <div className="text-center text-xs text-slate-400 mt-2">
                {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
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

              <div className="flex items-center gap-4 text-xs text-slate-600 my-1">
                <div className="flex-1 h-px bg-white/5"></div>
                <span>OR SIGN IN WITH</span>
                <div className="flex-1 h-px bg-white/5"></div>
              </div>

              {/* Social Login Button Grid */}
              <div className="grid grid-cols-3 gap-3">
                {/* LinkedIn Button */}
                <button
                  onClick={() => handleSocialLogin("LinkedIn")}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#0077b5]/5 border border-[#0077b5]/10 hover:bg-[#0077b5]/10 text-slate-300 hover:text-white transition-all active:scale-95 group"
                >
                  <svg className="w-5 h-5 text-[#0077b5] group-hover:scale-110 transition-transform mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">LinkedIn</span>
                </button>

                {/* Google Button */}
                <button
                  onClick={() => handleSocialLogin("Google")}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-95 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform mb-1" viewBox="0 0 24 24" fill="none">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">Google</span>
                </button>

                {/* GitHub Button */}
                <button
                  onClick={() => handleSocialLogin("GitHub")}
                  className="flex flex-col items-center justify-center p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white transition-all active:scale-95 group"
                >
                  <svg className="w-5 h-5 group-hover:scale-110 transition-transform mb-1" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                  <span className="text-[10px] font-bold uppercase tracking-wider">GitHub</span>
                </button>
              </div>
            </div>
          )}

          {/* Footer Info */}
          <div className="text-[11px] text-slate-500 mt-6 leading-relaxed">
            By signing in, you agree to Resumiq's Terms of Service and Privacy Policy. Secured with mock-encryption.
          </div>
        </div>

        {/* RIGHT COLUMN: GUEST PARSER */}
        <div className="md:col-span-6 p-8 flex flex-col justify-between bg-black/35 relative">
          
          {isParsing ? (
            /* SCANNING LOADER */
            <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6">
              
              {/* Document Scanning Animation */}
              <div className="relative w-24 h-32 bg-slate-900/80 border border-white/10 rounded-xl overflow-hidden shadow-2xl p-3 flex flex-col gap-2">
                <div className="laser-line-parser absolute top-0 left-0 w-full z-20 pointer-events-none"></div>
                <div className="h-3 w-1/2 bg-white/10 rounded"></div>
                <div className="h-2 w-full bg-white/5 rounded"></div>
                <div className="h-2 w-5/6 bg-white/5 rounded"></div>
                <div className="h-2 w-2/3 bg-white/5 rounded"></div>
                <div className="h-px bg-white/5 my-1"></div>
                <div className="h-2 w-4/5 bg-cyan-500/10 rounded"></div>
                <div className="h-2 w-full bg-white/5 rounded"></div>
                <div className="h-2 w-3/4 bg-white/5 rounded"></div>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">{PARSE_STEPS[parseStep].title}</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">{PARSE_STEPS[parseStep].desc}</p>
              </div>

              {/* Progress bar ticker */}
              <div className="w-56 h-1.5 bg-[#0c1220] rounded-full overflow-hidden border border-white/5">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-1000 ease-out"
                  style={{ width: `${((parseStep + 1) / PARSE_STEPS.length) * 100}%` }}
                />
              </div>

            </div>
          ) : (
            /* DROPZONE FORM */
            <div className="flex-1 flex flex-col justify-center space-y-6">
              <div>
                <h2 className="text-2xl font-black text-white">Start Instantly</h2>
                <p className="text-slate-400 text-sm mt-1">Skip registration. Drop your PDF resume and let our AI extract your work metrics.</p>
              </div>

              {/* File Drop Area */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleFileDrop}
                className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all min-h-[260px] ${
                  dragActive 
                    ? "border-cyan-400 bg-cyan-950/10 shadow-[0_0_30px_rgba(34,211,238,0.08)] scale-[0.99]" 
                    : "border-white/10 bg-white/[0.02] hover:border-cyan-500/30 hover:bg-white/[0.04]"
                }`}
              >
                {/* Visual file input element */}
                <input
                  type="file"
                  id="pdf-upload-input"
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                
                <label htmlFor="pdf-upload-input" className="w-full h-full flex flex-col items-center justify-center cursor-pointer space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Drag & drop your PDF here</p>
                    <p className="text-xs text-slate-500 mt-1">or click to browse from device</p>
                  </div>
                  <div className="text-[10px] font-bold text-slate-600 bg-slate-900 border border-white/5 px-2 py-0.5 rounded uppercase tracking-wider">
                    Supports .PDF (Max 5MB)
                  </div>
                </label>
              </div>

              {/* Informative Checklist */}
              <div className="space-y-2 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">⚡</span>
                  <span>100% Client-side processing (no account registration needed)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-cyan-400">⚡</span>
                  <span>Fills 80%+ of experience metrics, education, and credentials instantly</span>
                </div>
              </div>
            </div>
          )}

          {/* Guest Note */}
          <div className="text-[11px] text-slate-600 border-t border-white/5 pt-4">
            Guest mode stores all resume workspaces locally inside your browser's Cache. You can register an account later to synchronize folders.
          </div>
        </div>

      </div>
    </div>
  );
}

export default Login;

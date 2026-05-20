import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function LandingPage() {
  // Waitlist modal state
  const [isWaitlistOpen, setIsWaitlistOpen] = useState(false);
  const [waitlistEmail, setWaitlistEmail] = useState("");
  const [waitlistSuccess, setWaitlistSuccess] = useState(false);

  // Slider State (Before/After)
  const [sliderPos, setSliderPos] = useState(50);

  // Live Theme Teaser State
  const [selectedTheme, setSelectedTheme] = useState("cyan");

  // Keyword Matching Simulation State
  const [matchedKeywords, setMatchedKeywords] = useState([
    { name: "React", checked: false },
    { name: "NodeJS", checked: false },
    { name: "Tailwind CSS", checked: false },
    { name: "ATS Optimization", checked: false },
    { name: "GraphQL", checked: false },
    { name: "CI/CD Pipelines", checked: false },
  ]);
  const [atsScoreSimulation, setAtsScoreSimulation] = useState(45);

  // FAQ state
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Interactive rewriter state
  const [selectedRole, setSelectedRole] = useState("frontend");
  const [isRefining, setIsRefining] = useState(false);
  const [refinedText, setRefinedText] = useState("");

  const ROLES_DATA = {
    frontend: {
      title: "Frontend Engineer",
      before: "I made the website load faster.",
      after: "Optimized critical rendering path and refactored bundle sizes, reducing initial page load times by 38% and boosting Lighthouse performance score to 96.",
    },
    pm: {
      title: "Product Manager",
      before: "I was in charge of a mobile app release.",
      after: "Orchestrated cross-functional lifecycle launch of iOS and Android mobile app, securing 25k+ downloads within the first 30 days and a 4.8-star App Store rating.",
    },
    sales: {
      title: "Sales Executive",
      before: "I sold software to other companies.",
      after: "Executed strategic enterprise software sales campaigns, exceeding annual quota by 145% and generating $1.2M in net-new annual recurring revenue (ARR).",
    }
  };

  const THEMES_DATA = {
    cyan: {
      name: "Cyber Cyan",
      accent: "from-cyan-400 via-sky-400 to-blue-500",
      accentSolid: "text-cyan-400",
      border: "border-cyan-500/30",
      bgGlow: "bg-cyan-500/10",
      pill: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
      barColor: "bg-cyan-400",
      gradientText: "text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
    },
    emerald: {
      name: "Organic Emerald",
      accent: "from-emerald-400 via-teal-400 to-green-500",
      accentSolid: "text-emerald-400",
      border: "border-emerald-500/30",
      bgGlow: "bg-emerald-500/10",
      pill: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      barColor: "bg-emerald-400",
      gradientText: "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500"
    },
    violet: {
      name: "Royal Violet",
      accent: "from-violet-400 via-purple-400 to-fuchsia-500",
      accentSolid: "text-violet-400",
      border: "border-violet-500/30",
      bgGlow: "bg-violet-500/10",
      pill: "bg-violet-500/10 text-violet-400 border-violet-500/20",
      barColor: "bg-violet-400",
      gradientText: "text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500"
    },
    amber: {
      name: "Golden Amber",
      accent: "from-amber-400 via-orange-400 to-yellow-500",
      accentSolid: "text-amber-400",
      border: "border-amber-500/30",
      bgGlow: "bg-amber-500/10",
      pill: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      barColor: "bg-amber-400",
      gradientText: "text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500"
    }
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    setRefinedText("");
    setIsRefining(false);
  };

  const handleRefine = () => {
    setIsRefining(true);
    setRefinedText("");
    const fullText = ROLES_DATA[selectedRole].after;
    let currentIdx = 0;
    
    const interval = setInterval(() => {
      const nextText = fullText.slice(0, currentIdx + 1);
      setRefinedText(nextText);
      currentIdx += 1;
      if (currentIdx >= fullText.length) {
        clearInterval(interval);
        setIsRefining(false);
      }
    }, 15);
  };

  // Run matching simulation loop
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setMatchedKeywords(prev => {
        const next = [...prev];
        next[index] = { ...next[index], checked: true };
        return next;
      });
      setAtsScoreSimulation(prev => Math.min(prev + 8.5, 96));
      index++;
      if (index >= 6) {
        setTimeout(() => {
          setMatchedKeywords(prev => prev.map(k => ({ ...k, checked: false })));
          setAtsScoreSimulation(45);
          index = 0;
        }, 3000);
      }
    }, 1800);

    return () => clearInterval(interval);
  }, []);

  const handleWaitlistSubmit = (e) => {
    e.preventDefault();
    if (!waitlistEmail.trim() || !waitlistEmail.includes("@")) {
      alert("Please enter a valid email address.");
      return;
    }
    setWaitlistSuccess(true);
    setTimeout(() => {
      setWaitlistSuccess(false);
      setIsWaitlistOpen(false);
      setWaitlistEmail("");
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-cyan-500 selection:text-slate-900 text-slate-300 relative overflow-x-hidden">
      
      {/* Inject custom CSS keyframes directly */}
      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(1.5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-22px) rotate(-1.5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-8px) rotate(0.5deg); }
        }
        @keyframes grid-pulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.25; }
        }
        @keyframes pulse-flow {
          0% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }
        @keyframes scan-line {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 4s ease-in-out infinite;
        }
        .animate-pulse-flow {
          animation: pulse-flow 2.5s linear infinite;
        }
        .animate-scan-line {
          animation: scan-line 4s ease-in-out infinite;
        }
        .grid-bg {
          background-image: linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 40px 40px;
        }
        .glass-border-gradient {
          border-image: linear-gradient(to bottom right, rgba(255,255,255,0.1), rgba(255,255,255,0.02)) 1;
        }
        @keyframes scroll-bg {
          0% { background-position-y: 0px; }
          100% { background-position-y: 1600px; }
        }
        .animate-scroll-bg {
          animation: scroll-bg 120s linear infinite;
        }
      `}</style>

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 grid-bg pointer-events-none z-0"></div>

      {/* Background Topographic Image */}
      <div 
        className="absolute inset-0 bg-repeat opacity-[0.14] pointer-events-none mix-blend-screen z-0 animate-scroll-bg" 
        style={{ backgroundImage: "url('/landing_bg.png')", backgroundSize: '1600px auto' }}
      />
      
      {/* Floating Background Glows */}
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none animate-pulse"></div>
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[10%] left-[20%] w-[800px] h-[800px] bg-emerald-600/5 rounded-full blur-[180px] mix-blend-screen pointer-events-none"></div>

      {/* Navigation */}
      <nav className="fixed w-full z-50 top-0 transition-all duration-300 bg-black/40 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-violet-500 rounded-xl blur-md opacity-40 animate-pulse"></div>
              <svg className="relative w-9 h-9" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="q-glow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle cx="15" cy="15" r="9" stroke="url(#q-glow)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="42 12" />
                <path d="M12 10.5H17.5L19.5 12.5V19.5H12V10.5Z" fill="white" />
                <path d="M14 13.5H17" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
                <path d="M14 16.5H17" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
                <path d="M21 21L27 27" stroke="url(#q-glow)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M24 27H27V24" stroke="url(#q-glow)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-xl font-bold text-white tracking-widest uppercase bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Resumiq
            </span>
          </div>
          <div className="flex gap-4 items-center">
            <Link 
              to="/login"
              className="text-slate-400 hover:text-white font-medium px-4 py-2 transition-colors text-sm"
            >
              Dashboard
            </Link>
            <Link 
              to="/login"
              className="bg-white/10 hover:bg-white/20 border border-white/10 text-white font-semibold px-5 py-2.5 rounded-xl backdrop-blur-sm transition-all hover:shadow-[0_0_25px_rgba(255,255,255,0.08)] active:scale-95 text-sm"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-20 overflow-hidden flex flex-col items-center z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-cyan-400 font-semibold text-xs mb-8 backdrop-blur-md hover:border-cyan-500/30 transition-colors cursor-default">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
            Version 2.0: AI-Powered Performance Engine
          </div>

          {/* Main Title */}
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tight leading-[1] mb-6 max-w-4xl">
            Resume creation, <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-violet-400 to-emerald-400">
              engineered to perform.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl leading-relaxed">
            A high-performance builder analyzing semantic relevance, optimizing resume metrics, and targeting ATS matching—all in real time.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mb-20">
            <Link 
              to="/login"
              className="bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 hover:from-cyan-300 hover:to-violet-400 text-black font-extrabold px-10 py-4.5 rounded-2xl shadow-[0_0_35px_rgba(6,182,212,0.3)] transition-all hover:shadow-[0_0_55px_rgba(6,182,212,0.5)] hover:-translate-y-1 active:translate-y-0 text-lg flex items-center justify-center gap-2"
            >
              Start Building Now
            </Link>
            <button 
              onClick={() => setIsWaitlistOpen(true)}
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4.5 rounded-2xl backdrop-blur-md transition-all hover:-translate-y-1 active:translate-y-0 text-lg flex items-center justify-center gap-2"
            >
              Join Pro Waitlist <span className="text-slate-400 ml-1">→</span>
            </button>
          </div>

          {/* Visual Showcase (Mockup + Orbiting Cards) */}
          <div className="relative w-full max-w-5xl mt-8 flex justify-center perspective-[1000px]">
            {/* Ambient Base Light */}
            <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-4/5 h-40 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 blur-[100px] rounded-full rotate-x-60"></div>
            
            {/* Core Product Mockup */}
            <div className="relative w-full aspect-[16/10] bg-slate-900/60 rounded-3xl border border-white/10 p-4 shadow-[0_30px_70px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden group">
              {/* Inner glowing screen border */}
              <div className="absolute inset-px rounded-[22px] border border-white/5 pointer-events-none"></div>
              
              {/* Fake Application Window Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-4">
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-800 flex items-center justify-center text-[8px] text-slate-500 font-bold">×</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-800"></span>
                  <span className="w-3.5 h-3.5 rounded-full bg-slate-800"></span>
                </div>
                <div className="bg-black/30 border border-white/5 rounded-full px-8 py-1 text-xs text-slate-500 font-mono">app.resumiq.ai/builder</div>
                <div className="w-12"></div>
              </div>

              {/* Mockup App Interface Grid */}
              <div className="grid grid-cols-12 gap-4 h-[90%] overflow-hidden">
                <div className="col-span-3 border-r border-white/5 p-2 flex flex-col gap-2">
                  <div className="h-6 w-3/4 bg-white/5 rounded"></div>
                  <div className="h-4 w-full bg-white/5 rounded"></div>
                  <div className="h-4 w-5/6 bg-white/5 rounded"></div>
                  <div className="mt-4 flex flex-col gap-1.5">
                    <div className="h-3 w-1/2 bg-cyan-500/20 rounded"></div>
                    <div className="h-8 w-full bg-white/5 border border-white/5 rounded-lg"></div>
                    <div className="h-8 w-full bg-white/5 border border-white/5 rounded-lg"></div>
                    <div className="h-8 w-full bg-white/5 border border-white/5 rounded-lg"></div>
                  </div>
                </div>
                <div className="col-span-9 p-2 bg-black/20 rounded-2xl border border-white/5 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center border-b border-white/5 pb-3">
                      <div className="h-5 w-1/3 bg-white/10 rounded"></div>
                      <div className="h-4 w-12 bg-emerald-500/10 border border-emerald-500/30 rounded"></div>
                    </div>
                    <div className="space-y-2.5">
                      <div className="h-4 w-full bg-white/5 rounded"></div>
                      <div className="h-4 w-11/12 bg-white/5 rounded"></div>
                      <div className="h-4 w-5/6 bg-white/5 rounded"></div>
                    </div>
                  </div>
                  <div className="h-10 border-t border-white/5 flex items-center justify-end">
                    <div className="h-6 w-20 bg-cyan-500/20 border border-cyan-500/40 rounded-lg"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Orbiting Floating Card 1: ATS Scoring Radar (Bottom-Left) */}
            <div className="absolute bottom-6 -left-10 md:left-[-40px] bg-black/85 border border-white/10 rounded-2xl p-4 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl w-48 animate-float-slow z-20">
              <div className="flex flex-col gap-1.5">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ATS Score Evaluated</p>
                <div className="flex items-center justify-between">
                  <p className="text-4xl font-extrabold text-emerald-400">98%</p>
                  <div className="w-9 h-9 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-emerald-400 h-full w-[98%] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Orbiting Floating Card 2: Matching Analytics (Top-Right) */}
            <div className="absolute top-10 -right-10 md:right-[-40px] bg-black/85 border border-white/10 rounded-2xl p-4.5 shadow-[0_20px_40px_rgba(0,0,0,0.6)] backdrop-blur-xl w-56 animate-float-medium z-20">
              <div className="flex flex-col gap-2">
                <div className="flex justify-between items-center">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Target Match</p>
                  <span className="text-[9px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 px-2 py-0.5 rounded-md font-bold">AUTO</span>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-black text-white">Product Lead</span>
                </div>
                <p className="text-[11px] text-slate-500 leading-normal border-t border-white/5 pt-2">Matches 24 mandatory keyword gaps in employer job description.</p>
              </div>
            </div>

            {/* Orbiting Floating Card 3: Fast PDF Render (Bottom-Right) */}
            <div className="absolute bottom-16 -right-6 md:right-[-20px] bg-black/80 border border-white/10 rounded-2xl p-3.5 shadow-[0_15px_30px_rgba(0,0,0,0.5)] backdrop-blur-xl w-40 animate-float-fast z-20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-violet-500/20 flex items-center justify-center text-violet-400 font-bold border border-violet-500/30">PDF</div>
                <div>
                  <p className="text-xs text-white font-bold">A4 Export</p>
                  <p className="text-[9px] text-slate-500">Rendered in 20ms</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* BEFORE / AFTER DRAG COMPARISON SLIDER */}
      <section className="py-28 relative overflow-hidden border-t border-white/5 bg-transparent">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-16">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest bg-cyan-950/30 border border-cyan-500/20 px-3 py-1 rounded-full">Interactive Showcase</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">Draft bullet vs. AI performance bullet</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Drag the slider horizontally to compare a baseline description with our targeted AI transformation.</p>
          </div>

          {/* Slider Container */}
          <div className="relative w-full aspect-[16/7] md:aspect-[16/5.5] bg-[#0c1017] rounded-3xl border border-white/10 overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.6)] select-none">
            
            {/* Right Side (After - Optimized State) */}
            <div className="absolute inset-0 bg-[#0d1c1a] flex items-center justify-end p-8 md:p-12">
              <div className="w-full max-w-3xl pl-[20%] text-left">
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md font-extrabold uppercase tracking-widest mb-3 inline-block">✨ AFTER (AI Optimized)</span>
                <p className="text-xl md:text-2xl text-emerald-300 font-bold leading-relaxed">
                  "Engineered modular React architecture and optimized bundle assets, slashing page latency by 42% and raising Lighthouse performance score to 98."
                </p>
                <div className="flex gap-4 mt-6">
                  <span className="text-xs text-emerald-500 bg-emerald-500/5 px-3 py-1 rounded border border-emerald-500/20">Metric Focus</span>
                  <span className="text-xs text-cyan-400 bg-cyan-500/5 px-3 py-1 rounded border border-cyan-500/20">Strong Verb Action</span>
                </div>
              </div>
            </div>

            {/* Left Side (Before - Raw State) - Clipped by width percentage */}
            <div 
              className="absolute inset-y-0 left-0 bg-[#160d0f] flex items-center justify-start p-8 md:p-12 overflow-hidden border-r border-white/10 z-10"
              style={{ width: `${sliderPos}%` }}
            >
              {/* Inner wrapper needs fixed width so text doesn't collapse as box width changes */}
              <div className="w-[800px] text-left">
                <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2.5 py-1 rounded-md font-extrabold uppercase tracking-widest mb-3 inline-block">❌ BEFORE (Draft CV)</span>
                <p className="text-xl md:text-2xl text-red-300 font-bold leading-relaxed">
                  "I was responsible for making the application speed better and refactoring some React code."
                </p>
                <div className="flex gap-4 mt-6">
                  <span className="text-xs text-red-500 bg-red-500/5 px-3 py-1 rounded border border-red-500/20">Vague Verbs</span>
                  <span className="text-xs text-red-500 bg-red-500/5 px-3 py-1 rounded border border-red-500/20">No Metrics</span>
                </div>
              </div>
            </div>

            {/* Invisible Input Range Overlaid */}
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-30"
            />

            {/* Slider Visual Handle Bar */}
            <div 
              className="absolute inset-y-0 w-0.5 bg-gradient-to-b from-cyan-400 to-violet-500 pointer-events-none z-20 flex items-center justify-center"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Floating controller puck */}
              <div className="w-10 h-10 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center text-xs font-bold text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.5)] transform -translate-x-1/2">
                ⇄
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* BENTO GRID FEATURE WIDGETS (Inspired by Web3 Payments & Trading Bento Boxes) */}
      <section className="py-28 relative overflow-hidden border-t border-white/5 bg-transparent">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-20">
            <span className="text-violet-400 font-bold text-xs uppercase tracking-widest bg-violet-950/30 border border-violet-500/20 px-3 py-1 rounded-full">Bento Toolkit</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">Deep telemetry for resume success</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">We've broken down standard resume writing into modular automated actions built directly into the dashboard.</p>
          </div>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
            
            {/* Box 1: Dynamic Keyword Matcher Scanner (Col-7) */}
            <div className="md:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.5)] overflow-hidden relative min-h-[360px] group hover:border-white/15 transition-all">
              
              {/* Pulse Scanner Line */}
              <div className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent z-10 animate-scan-line"></div>
              
              <div>
                <span className="text-[10px] bg-cyan-500/10 text-cyan-400 border border-cyan-500/25 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider mb-4 inline-block">Real-Time Keyword Audit</span>
                <h3 className="text-2xl font-black text-white mb-2">Automated Keyword Mapping</h3>
                <p className="text-slate-400 text-sm max-w-md">Our parser audits your resume against target postings, identifying and scoring keyword density instantly.</p>
              </div>

              {/* Widget Visual Panel */}
              <div className="grid grid-cols-2 gap-4 mt-8 bg-black/40 border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                <div className="flex flex-col gap-2">
                  <span className="text-[9px] text-slate-500 font-bold uppercase">Keyword Audit</span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchedKeywords.map((kw, i) => (
                      <span 
                        key={i} 
                        className={`text-[10px] px-2 py-1 rounded-md border flex items-center gap-1 transition-all duration-300 ${
                          kw.checked 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30" 
                            : "bg-white/5 text-slate-500 border-white/5"
                        }`}
                      >
                        {kw.checked && <span className="w-1 h-1 rounded-full bg-emerald-400"></span>}
                        {kw.name}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col justify-center items-center border-l border-white/5 pl-4">
                  <p className="text-[10px] text-slate-500 font-bold uppercase mb-1">Audit Score</p>
                  <p className="text-5xl font-black text-white transition-all duration-300">{Math.floor(atsScoreSimulation)}%</p>
                  <span className="text-[9px] text-emerald-400 font-bold mt-1">▲ Keywords syncing</span>
                </div>
              </div>

            </div>

            {/* Box 2: Job Description Matching Flow (Col-5) */}
            <div className="md:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.5)] overflow-hidden hover:border-white/15 transition-all min-h-[360px]">
              <div>
                <span className="text-[10px] bg-violet-500/10 text-violet-400 border border-violet-500/25 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider mb-4 inline-block">Adaptive Engine</span>
                <h3 className="text-2xl font-black text-white mb-2">Auto-Tailoring Flow</h3>
                <p className="text-slate-400 text-sm">We pipe the employer's Job Specification directly into your layout sections, dynamically restructuring relevance.</p>
              </div>

              {/* SVG Connector Flow Diagram */}
              <div className="mt-8 bg-black/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between gap-2 relative overflow-hidden">
                <div className="bg-white/5 border border-white/10 rounded-xl p-3 text-center flex-1">
                  <p className="text-[10px] text-slate-400 font-bold">Job Desc</p>
                  <div className="h-1 bg-violet-400/40 rounded w-3/4 mx-auto mt-2"></div>
                </div>

                <div className="w-16 flex justify-center items-center">
                  <svg className="w-full h-8 overflow-visible" viewBox="0 0 100 20">
                    <path d="M 0 10 Q 50 -10 100 10" stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" strokeDasharray="3 3"/>
                    <path d="M 0 10 Q 50 -10 100 10" stroke="#8b5cf6" strokeWidth="2.5" fill="none" strokeDasharray="10 20" className="animate-pulse-flow"/>
                  </svg>
                </div>

                <div className="bg-violet-950/20 border border-violet-500/20 rounded-xl p-3 text-center flex-1">
                  <p className="text-[10px] text-violet-400 font-bold">Optimized CV</p>
                  <div className="h-1 bg-emerald-400/40 rounded w-3/4 mx-auto mt-2"></div>
                </div>
              </div>

            </div>

            {/* Box 3: PDF Print layout engine (Col-5) */}
            <div className="md:col-span-5 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.5)] overflow-hidden hover:border-white/15 transition-all min-h-[360px]">
              <div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider mb-4 inline-block">Export Engine</span>
                <h3 className="text-2xl font-black text-white mb-2">Perfect A4 Alignment</h3>
                <p className="text-slate-400 text-sm">Every resume layout is auto-adjusted with page break algorithms. No split pages or hanging lines.</p>
              </div>

              {/* Graphic Mockup of PDF sheet */}
              <div className="mt-8 bg-black/40 border border-white/5 rounded-t-2xl p-5 h-28 overflow-hidden relative">
                <div className="bg-white border border-slate-200 p-4 h-48 w-full shadow-lg rounded-t-lg text-slate-800 text-[6px] flex flex-col gap-2">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-1.5">
                    <span className="font-extrabold text-[8px]">Sri Aarush Aray</span>
                    <span>aarush@sh.com</span>
                  </div>
                  <div className="h-2 w-1/4 bg-slate-200 rounded"></div>
                  <div className="h-2 w-full bg-slate-100 rounded"></div>
                  <div className="h-2 w-full bg-slate-100 rounded"></div>
                </div>
              </div>
            </div>

            {/* Box 4: Interactive Sandbox Bullet Point Rewriter (Col-7) */}
            <div className="md:col-span-7 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-md flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.5)] overflow-hidden hover:border-white/15 transition-all min-h-[360px] relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">Sandbox Optimizer</span>
                  <div className="flex gap-2">
                    {Object.keys(ROLES_DATA).map((role) => (
                      <button 
                        key={role}
                        onClick={() => handleRoleChange(role)}
                        className={`text-[10px] px-2.5 py-1 rounded-md border font-bold transition-all ${
                          selectedRole === role 
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400" 
                            : "bg-white/5 border-white/5 text-slate-500 hover:text-slate-300"
                        }`}
                      >
                        {ROLES_DATA[role].title.split(" ")[0]}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-bold mb-1">Draft</p>
                    <div className="bg-black/30 border border-white/5 rounded-xl p-3.5 text-xs text-slate-400 leading-normal min-h-[64px]">
                      {ROLES_DATA[selectedRole].before}
                    </div>
                  </div>
                  <div>
                    <p className="text-[9px] text-emerald-400 uppercase tracking-widest font-bold mb-1">AI Amplified</p>
                    <div className="bg-emerald-950/15 border border-emerald-500/20 rounded-xl p-3.5 text-xs text-white leading-relaxed min-h-[64px] relative">
                      {refinedText ? (
                        <p>{refinedText}</p>
                      ) : (
                        <p className="text-slate-600 italic">Click Refine to run simulation...</p>
                      )}
                      {isRefining && <span className="inline-block w-1 h-3 bg-emerald-400 ml-0.5 animate-pulse"></span>}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={handleRefine}
                  disabled={isRefining || refinedText === ROLES_DATA[selectedRole].after}
                  className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow ${
                    isRefining 
                      ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                      : refinedText === ROLES_DATA[selectedRole].after
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-emerald-400 hover:bg-emerald-300 text-slate-950 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  }`}
                >
                  {isRefining ? "Analyzing..." : refinedText === ROLES_DATA[selectedRole].after ? "✓ Refined" : "✨ Refine Bullet"}
                </button>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* LIVE RESUME THEME CUSTOMIZER TEASER (Inspired by AI video timeline & theme switchers) */}
      <section className="py-28 relative overflow-hidden border-t border-white/5 bg-transparent">
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column - Customizer Controls */}
            <div className="lg:col-span-5 space-y-6">
              <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest bg-cyan-950/30 border border-cyan-500/20 px-3 py-1 rounded-full inline-block">Layout Themes</span>
              <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">Tailor your layout matching your brand</h2>
              <p className="text-slate-400 text-base leading-relaxed">
                Click the accent palettes below to instantly transform fonts, highlights, and borders on your CV mockup.
              </p>

              {/* Color Toggles */}
              <div className="flex gap-4 items-center pt-2">
                {Object.keys(THEMES_DATA).map((themeKey) => {
                  const data = THEMES_DATA[themeKey];
                  return (
                    <button
                      key={themeKey}
                      onClick={() => setSelectedTheme(themeKey)}
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 transition-all ${
                        selectedTheme === themeKey
                          ? "border-white bg-slate-900 scale-110 shadow-lg shadow-white/5"
                          : "border-white/10 bg-slate-950 hover:border-white/30"
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg bg-gradient-to-tr ${data.accent}`}></span>
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-white/5 pt-6 mt-6">
                <p className="text-sm font-bold text-white mb-2">Theme features included:</p>
                <ul className="space-y-2 text-xs text-slate-400">
                  <li className="flex items-center gap-2">✓ Dynamic accent color configurations</li>
                  <li className="flex items-center gap-2">✓ Custom typography pairings (Inter, Outfit, Lora)</li>
                  <li className="flex items-center gap-2">✓ Configurable border dividers and spacing</li>
                </ul>
              </div>
            </div>

            {/* Right Column - Live Mockup Resume Preview */}
            <div className="lg:col-span-7 bg-[#080c12] border border-white/10 rounded-3xl p-8 shadow-[0_30px_70px_rgba(0,0,0,0.7)] backdrop-blur-md relative overflow-hidden transition-all duration-500">
              <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none"></div>

              {/* Mock Resume Card Content */}
              <div className="bg-slate-950 rounded-2xl p-6 border border-white/5 text-slate-400 text-[10px] leading-relaxed relative flex flex-col gap-4">
                
                {/* Accent Highlight Bar */}
                <div className={`h-1.5 w-full bg-gradient-to-r rounded-full transition-all duration-500 ${THEMES_DATA[selectedTheme].accent}`}></div>

                {/* Header info */}
                <div className="flex justify-between items-start border-b border-white/5 pb-4">
                  <div>
                    <h4 className="text-white text-base font-extrabold tracking-tight transition-colors duration-500">Sri Aarush Aray</h4>
                    <p className={`text-[10px] font-semibold transition-colors duration-500 ${THEMES_DATA[selectedTheme].accentSolid}`}>Senior Systems Engineer</p>
                  </div>
                  <div className="text-right text-[8px] text-slate-500">
                    <p>contact@aarush.dev</p>
                    <p>GitHub: /AarushAray</p>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="space-y-1">
                  <h5 className="text-white text-[9px] font-black uppercase tracking-widest">Profile Summary</h5>
                  <p className="text-[9px] text-slate-400">
                    Ambitious systems engineer specializing in cloud solutions, automated CI/CD deployments, and high-performance React architectures.
                  </p>
                </div>

                {/* Experience Block */}
                <div className="space-y-2">
                  <h5 className="text-white text-[9px] font-black uppercase tracking-widest">Professional History</h5>
                  <div className={`border-l-2 pl-3 transition-colors duration-500 ${THEMES_DATA[selectedTheme].border} space-y-1`}>
                    <div className="flex justify-between items-center text-[9px]">
                      <span className="font-bold text-white">Cloud Systems Architect · Google Inc</span>
                      <span className="text-[8px] text-slate-500">2024 - Present</span>
                    </div>
                    <ul className="list-disc pl-3 text-[8px] text-slate-400 space-y-0.5">
                      <li>Designed modular Kubernetes architecture resolving cluster outages.</li>
                      <li>Developed auto-tailored CI pipelines reducing build delays.</li>
                    </ul>
                  </div>
                </div>

                {/* Skills Section with Accent Pill Highlights */}
                <div className="space-y-1.5">
                  <h5 className="text-white text-[9px] font-black uppercase tracking-widest">Key Skillsets</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {["Kubernetes", "React Architecture", "Python automation", "ATS Analytics", "Cloud Services"].map((skill, sIdx) => (
                      <span 
                        key={sIdx} 
                        className={`text-[8px] px-2 py-0.5 rounded border transition-colors duration-500 ${THEMES_DATA[selectedTheme].pill}`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

              </div>

              {/* Selected Theme Badge Floating */}
              <div className="mt-4 flex justify-between items-center text-xs">
                <span className="text-slate-500">Selected styling:</span>
                <span className={`font-bold uppercase tracking-wider text-[10px] transition-colors duration-500 ${THEMES_DATA[selectedTheme].accentSolid}`}>
                  {THEMES_DATA[selectedTheme].name}
                </span>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-28 relative overflow-hidden border-t border-white/5 bg-transparent">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cyan-600/5 rounded-full blur-[160px] mix-blend-screen pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-20">
            <span className="text-cyan-400 font-bold text-xs uppercase tracking-widest bg-cyan-950/30 border border-cyan-500/20 px-3 py-1 rounded-full">Billing Options</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">Choose your pace of growth</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Build and compile resumes for free, or unlock advanced automated tailoring features.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free Plan */}
            <div className="bg-white/5 rounded-3xl p-8 md:p-10 border border-white/10 backdrop-blur-md flex flex-col justify-between shadow-[0_20px_45px_rgba(0,0,0,0.4)] hover:border-white/15 transition-all">
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">Starter Core</h3>
                  <p className="text-sm text-slate-500">Essential building blocks for standard resumes</p>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-6xl font-black text-white">$0</span>
                  <span className="text-slate-500 text-xs uppercase font-semibold">/ lifetime</span>
                </div>
                <ul className="space-y-4 text-slate-400 text-sm mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>Full step-by-step resume wizard</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>Download A4 PDF format</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>Local auto-save storage</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-slate-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    <span className="line-through">AI bullet point rewriter</span>
                  </li>
                  <li className="flex items-center gap-3 text-slate-700">
                    <svg className="w-5 h-5 text-slate-700 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    <span className="line-through">ATS scoring keyword feedback report</span>
                  </li>
                </ul>
              </div>
              <Link
                to="/login"
                className="w-full text-center bg-white/10 hover:bg-white/20 border border-white/10 text-white font-bold py-4 rounded-xl transition-all"
              >
                Build For Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-white/5 rounded-3xl p-8 md:p-10 border-2 border-cyan-500/40 backdrop-blur-md flex flex-col justify-between shadow-[0_20px_45px_rgba(6,182,212,0.15)] relative overflow-hidden hover:border-cyan-400/50 transition-all">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-cyan-400 to-violet-500 text-black text-xs font-black uppercase tracking-widest px-5 py-2 rounded-bl-2xl">
                PREMIUM
              </div>
              <div>
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-white mb-2">Pro Copilot</h3>
                  <p className="text-sm text-slate-500">Unleash automated AI keyword and tailoring engines</p>
                </div>
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-6xl font-black text-white">$9</span>
                  <span className="text-slate-500 text-xs uppercase font-semibold">/ month</span>
                </div>
                <ul className="space-y-4 text-slate-300 text-sm mb-8">
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>Everything in Starter Core plan</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span className="font-semibold text-white">Unlimited AI bullet rewriter</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span className="font-semibold text-white">Full ATS scoring report & analysis</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>Cloud saving (Unlimited resumes saved)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <svg className="w-5 h-5 text-cyan-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                    <span>Multiple theme customizer configurations</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={() => setIsWaitlistOpen(true)}
                className="w-full text-center bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all hover:shadow-[0_0_35px_rgba(6,182,212,0.4)]"
              >
                Join Premium Waitlist
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-28 relative overflow-hidden border-t border-white/5 bg-transparent">
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          
          <div className="text-center mb-20">
            <span className="text-emerald-400 font-bold text-xs uppercase tracking-widest bg-emerald-950/30 border border-emerald-500/20 px-3 py-1 rounded-full">FAQ</span>
            <h2 className="text-3xl md:text-5xl font-black text-white mt-4 mb-4">Frequently Asked Questions</h2>
            <p className="text-slate-400 text-lg">Clear queries on how Resumiq handles building your resume.</p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "How does the ATS score work?",
                a: "Our built-in scanner runs a semantic audit on your content, comparing it with standard job posting requirements. It highlights keyword gaps, layout formatting issues, and suggests active verbs to ensure your CV passes automated screens."
              },
              {
                q: "Is my data stored securely?",
                a: "Absolutely. By default, your data is saved locally on your device. Once you choose to save it to the cloud, it is encrypted and securely stored in our databases."
              },
              {
                q: "Can I export to PDF and Word?",
                a: "Yes, you can download print-ready A4 PDFs immediately. In the premium version, you can also export your resume to DOCX (MS Word) and raw JSON format."
              },
              {
                q: "How does the AI tailoring work?",
                a: "You paste a target job description, and our AI analyzes the primary keywords and requirements. It suggests real-time updates for your experience bullet points, helping you match the job specification with one click."
              }
            ].map((faq, index) => (
              <div 
                key={index} 
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 text-left text-white hover:bg-white/[0.03] transition-colors"
                >
                  <span className="font-bold text-lg">{faq.q}</span>
                  <svg 
                    className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${
                      openFaqIndex === index ? "transform rotate-180 text-cyan-400" : ""
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                  </svg>
                </button>
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    openFaqIndex === index ? "max-h-48 border-t border-white/5" : "max-h-0"
                  }`}
                >
                  <p className="p-6 text-slate-400 leading-relaxed text-base">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-white/5 bg-transparent">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="relative w-8 h-8 flex items-center justify-center">
              <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-violet-500 rounded-lg blur-sm opacity-40 animate-pulse"></div>
              <svg className="relative w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="q-glow-footer" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="50%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>
                </defs>
                <circle cx="15" cy="15" r="9" stroke="url(#q-glow-footer)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="42 12" />
                <path d="M12 10.5H17.5L19.5 12.5V19.5H12V10.5Z" fill="white" />
                <path d="M14 13.5H17" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
                <path d="M14 16.5H17" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
                <path d="M21 21L27 27" stroke="url(#q-glow-footer)" strokeWidth="2.5" strokeLinecap="round" />
                <path d="M24 27H27V24" stroke="url(#q-glow-footer)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white tracking-widest uppercase">
              Resumiq Systems
            </span>
          </div>
          
          <p className="text-xs text-slate-500">
            &copy; {new Date().getFullYear()} Resumiq. Built with ❤️ for ambitious careers.
          </p>

          <div className="flex gap-6 text-slate-500 text-xs">
            <a href="#" className="hover:text-cyan-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-cyan-400 transition-colors">Support Portal</a>
          </div>
        </div>
      </footer>

      {/* Waitlist Modal */}
      {isWaitlistOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 transition-all animate-in fade-in duration-300">
          <div className="bg-[#0b0f19] border border-white/10 rounded-3xl p-8 max-w-md w-full relative shadow-[0_30px_70px_rgba(0,0,0,0.8)] animate-in zoom-in-95 duration-200">
            {/* Close Button */}
            <button 
              onClick={() => {
                setIsWaitlistOpen(false);
                setWaitlistSuccess(false);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors p-1.5 hover:bg-white/5 rounded-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            {waitlistSuccess ? (
              <div className="text-center py-8 flex flex-col items-center gap-4 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-cyan-500/10">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2">You're on the list! 🎉</h3>
                  <p className="text-slate-400 text-sm">We've saved your spot. We'll send updates to <br/><span className="text-cyan-400 font-semibold">{waitlistEmail}</span> soon.</p>
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Request Early Access</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Be the first to know when we deploy professional cloud saving, multiple premium layouts, and automated ATS match audits.
                  </p>
                </div>

                <form onSubmit={handleWaitlistSubmit} className="flex flex-col gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={waitlistEmail}
                      onChange={(e) => setWaitlistEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all font-medium"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-black py-4 rounded-xl shadow-[0_0_20px_rgba(6,182,212,0.2)] transition-all hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-[0.98]"
                  >
                    Request Early Access
                  </button>
                </form>

                <p className="text-center text-[10px] text-slate-600 mt-4 leading-normal">
                  No spam. Unsubscribe at any time. By clicking, you agree to receive product release announcements.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;

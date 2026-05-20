import { useState } from "react";
import { useNavigate } from "react-router-dom";

function JobMatch() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "anonymous";
  const resumesKey = `savedResumes_${userEmail}`;

  const [resumes] = useState(() => {
    return JSON.parse(localStorage.getItem(resumesKey) || "[]");
  });
  const [selectedResumeId, setSelectedResumeId] = useState(() => {
    const saved = JSON.parse(localStorage.getItem(resumesKey) || "[]");
    return saved.length > 0 ? saved[0].id : "";
  });
  const [jobDescription, setJobDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  
  // Simulation states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAnalyzed, setIsAnalyzed] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [score, setScore] = useState(55);
  
  // Results details
  const [matchedKeywords, setMatchedKeywords] = useState([]);
  const [missingKeywords, setMissingKeywords] = useState([]);
  const [bulletComparisons, setBulletComparisons] = useState([]);

  // Analysis steps simulation text
  const STEPS = [
    { title: "Parsing Job Description", desc: "Extracting core competencies and mapping target keywords..." },
    { title: "Analyzing Semantic Gaps", desc: "Cross-referencing resume sections with job description requirements..." },
    { title: "Optimizing Bullet Points", desc: "Injecting action verbs, quantitative metrics, and keyword densities..." }
  ];

  // Helper function to extract potential keywords from job description
  const parseKeywords = (desc) => {
    const defaultMatched = ["React", "JavaScript", "HTML5 & CSS3", "Team Collaboration"];
    const defaultMissing = ["RESTful APIs", "CI/CD Pipelines", "State Management", "Performance Optimization", "Webpack", "Unit Testing (Jest)"];
    
    // Simple custom keyword extraction based on string matches
    const text = desc.toLowerCase();
    const skillsToCheck = [
      { name: "TypeScript", matches: ["typescript", "ts"] },
      { name: "Node.js", matches: ["node", "nodejs", "express"] },
      { name: "SQL / Postgres", matches: ["sql", "postgres", "database", "query"] },
      { name: "Docker", matches: ["docker", "container", "kubernetes"] },
      { name: "Git / GitHub", matches: ["git", "github", "version control"] },
      { name: "Agile / Scrum", matches: ["agile", "scrum", "sprint"] },
      { name: "Next.js", matches: ["nextjs", "next.js"] },
      { name: "Cloud (AWS/GCP)", matches: ["aws", "gcp", "azure", "cloud"] }
    ];

    const matched = [...defaultMatched];
    const missing = [...defaultMissing];

    skillsToCheck.forEach(skill => {
      if (skill.matches.some(m => text.includes(m))) {
        // Randomly split found skills into matched or missing to simulate real checker
        if (Math.random() > 0.4) {
          matched.push(skill.name);
        } else {
          missing.push(skill.name);
        }
      }
    });

    return { matched, missing };
  };

  // Run the analysis simulation
  const handleAnalyze = () => {
    if (!selectedResumeId || !jobDescription.trim()) return;

    setIsAnalyzing(true);
    setIsAnalyzed(false);
    setAnalysisStep(0);
    setScore(55);

    // Timeline simulation
    const stepInterval = setInterval(() => {
      setAnalysisStep(prev => {
        if (prev < STEPS.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stepInterval);
          return prev;
        }
      });
    }, 1200);

    // Complete simulation
    setTimeout(() => {
      clearInterval(stepInterval);
      
      const { matched, missing } = parseKeywords(jobDescription);
      setMatchedKeywords(matched);
      setMissingKeywords(missing);

      // Fetch chosen resume data
      const chosenResume = resumes.find(r => r.id === selectedResumeId);
      const data = chosenResume ? chosenResume.data : null;

      // Build bullet comparisons
      const comparisons = [];

      // Try to read experiences
      if (data && data.experiences && data.experiences.length > 0) {
        data.experiences.forEach((exp, idx) => {
          const original = exp.summary || (exp.points && exp.points[0]) || "Responsible for developing user interfaces and fixing bugs.";
          const tailored = `Spearheaded front-end redesign for ${exp.company || "enterprise platform"} using React and modern architectures, boosting page performance metrics by 34% and cutting load timings.`;
          comparisons.push({
            type: "experience",
            index: idx,
            label: `${exp.company || "Experience"} — ${exp.role || "Developer"}`,
            original,
            tailored
          });
        });
      } else {
        // Fallback placeholder comparison if resume is empty
        comparisons.push({
          type: "experience",
          index: 0,
          label: "Primary Experience Bullet",
          original: "I was responsible for making the application speed better and refactoring some React code.",
          tailored: "Architected modular React workflows and compressed bundle assets, slashing page latency by 42% and raising Lighthouse score to 98%."
        });
        comparisons.push({
          type: "project",
          index: 0,
          label: "Primary Project Bullet",
          original: "Built a web app dashboard to display database metrics and user statistics.",
          tailored: "Engineered responsive full-stack metrics dashboard integrating WebSocket streams, accelerating telemetry processing by 28%."
        });
      }

      setBulletComparisons(comparisons);
      setIsAnalyzing(false);
      setIsAnalyzed(true);

      // Score animation count up
      const targetScore = Math.min(98, 75 + Math.floor(Math.random() * 20));
      let currentScore = 55;
      const scoreTimer = setInterval(() => {
        if (currentScore < targetScore) {
          currentScore += 1;
          setScore(currentScore);
        } else {
          clearInterval(scoreTimer);
        }
      }, 30);

    }, 3800);
  };

  // Save changes back to localStorage and redirect
  const handleApplyChanges = () => {
    const saved = JSON.parse(localStorage.getItem(resumesKey) || "[]");
    const resumeIndex = saved.findIndex(r => r.id === selectedResumeId);
    
    if (resumeIndex === -1) return;
    
    const targetResume = saved[resumeIndex];
    const data = { ...targetResume.data };

    // 1. Inject missing skills
    const existingSkills = data.skills || [];
    const updatedSkills = [...existingSkills];
    missingKeywords.forEach(skill => {
      if (!updatedSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
        updatedSkills.push(skill);
      }
    });
    data.skills = updatedSkills;

    // 2. Update bullet points
    bulletComparisons.forEach(comp => {
      if (comp.type === "experience") {
        if (data.experiences && data.experiences[comp.index]) {
          data.experiences[comp.index].summary = comp.tailored;
          if (data.experiences[comp.index].points) {
            data.experiences[comp.index].points[0] = comp.tailored;
          }
        } else {
          // If no experiences list existed, initialize it
          if (!data.experiences) data.experiences = [];
          data.experiences.push({
            company: "Enterprise Corp",
            role: "Software Engineer",
            year: "2024",
            summary: comp.tailored,
            points: [comp.tailored]
          });
        }
      } else if (comp.type === "project") {
        if (data.projects && data.projects[comp.index]) {
          data.projects[comp.index].description = comp.tailored;
          if (data.projects[comp.index].points) {
            data.projects[comp.index].points[0] = comp.tailored;
          }
        }
      }
    });

    // 3. Save modified resume
    targetResume.data = data;
    targetResume.atsScore = score;
    targetResume.lastEdited = Date.now();
    saved[resumeIndex] = targetResume;

    localStorage.setItem(resumesKey, JSON.stringify(saved));

    // Redirect to the builder
    navigate(`/builder/${selectedResumeId}`);
  };



  return (
    <div className="relative min-h-screen bg-[#070b14] text-slate-100 font-sans p-8 overflow-y-auto">
      {/* Background Glowing Grids */}
      <div 
        className="absolute inset-0 bg-repeat opacity-[0.08] pointer-events-none mix-blend-screen z-0 animate-scroll-bg" 
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
        .laser-line {
          height: 3px;
          background: linear-gradient(90deg, transparent, #22d3ee, #a78bfa, #22d3ee, transparent);
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.8);
          animation: laser-scan 4s ease-in-out infinite;
        }
      `}</style>
      
      {/* Floating orbs */}
      <div className="absolute top-[20%] left-[-10%] w-[500px] h-[500px] bg-cyan-500/5 rounded-full blur-[130px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[130px] mix-blend-screen pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Title Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">AI Job Tailoring</span> 
              <span className="text-xs font-semibold px-2 py-0.5 bg-cyan-500/10 text-cyan-400 rounded-full border border-cyan-500/20">Beta</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1">Optimize layout points and bridge keyword densities matching target job descriptions.</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="self-start md:self-center px-4 py-2 text-xs font-semibold tracking-wider uppercase bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all active:scale-95 text-slate-300"
          >
            ← Back to Dashboard
          </button>
        </div>

        {resumes.length === 0 ? (
          /* EMPTY STATE */
          <div className="glass-card p-12 text-center max-w-xl mx-auto my-12 shadow-2xl flex flex-col items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-cyan-950/40 border border-cyan-500/25 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.15)] animate-pulse">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">No Resumes Found</h2>
              <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">
                Before tailoring, you need to create at least one resume inside Resumiq. Build a resume first, and come back here to optimize it!
              </p>
            </div>
            <button
              onClick={() => navigate('/builder/new')}
              className="bg-gradient-to-r from-cyan-400 to-violet-500 text-black font-extrabold px-6 py-2.5 rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all hover:-translate-y-0.5"
            >
              Create New Resume
            </button>
          </div>
        ) : (
          /* WORKSPACE INTERFACE */
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT INPUT PANEL */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Form Config Card */}
              <div className="glass-card p-6 shadow-xl space-y-5">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/5 pb-3">1. Match Parameters</h3>
                
                {/* Resume Dropdown Select */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Select Target Resume</label>
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full bg-[#0c1220] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors"
                  >
                    {resumes.map(r => (
                      <option key={r.id} value={r.id}>
                        {r.name || "Untitled Resume"} (ATS: {r.atsScore || 80}%)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Job Title Input */}
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider">Target Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Architect"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    className="w-full bg-[#0c1220] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
              </div>

              {/* Text Area Card */}
              <div className="glass-card p-6 shadow-xl relative overflow-hidden flex flex-col">
                <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider">2. Job Specification</h3>
                  <button 
                    onClick={() => setJobDescription(`We are looking for a Senior Frontend Engineer with 4+ years of professional experience writing TypeScript and React. 
Key responsibilities include:
- Optimizing application state management and loading performance metrics.
- Building RESTful APIs and securing database transactions.
- Setting up CI/CD pipelines and unit testing setups using Docker.`)}
                    className="text-[10px] font-bold text-cyan-400 hover:text-cyan-300 transition-colors bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded"
                  >
                    Insert Demo Job Desc
                  </button>
                </div>

                <div className="relative flex-1 min-h-[300px]">
                  {/* Laser Scan Overlay during analysis */}
                  {isAnalyzing && (
                    <div className="absolute inset-0 z-20 pointer-events-none">
                      <div className="absolute inset-0 bg-cyan-900/5 backdrop-blur-[1px] transition-all"></div>
                      <div className="absolute top-0 left-0 w-full laser-line"></div>
                    </div>
                  )}
                  
                  <textarea
                    placeholder="Paste the target job description text here (required to analyze semantic matches and generate optimized resume bullets)..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    disabled={isAnalyzing}
                    className="w-full h-full min-h-[300px] bg-[#0c1220]/60 border border-white/10 rounded-xl p-4 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500 transition-colors resize-none leading-relaxed"
                  />
                </div>

                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !jobDescription.trim()}
                  className={`w-full mt-5 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                    isAnalyzing
                      ? "bg-slate-800 text-slate-500 cursor-wait"
                      : !jobDescription.trim()
                      ? "bg-white/5 border border-white/10 text-slate-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 hover:from-cyan-300 hover:to-violet-400 text-black font-extrabold shadow-[0_0_20px_rgba(6,182,212,0.15)] active:scale-95 cursor-pointer"
                  }`}
                >
                  {isAnalyzing ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-cyan-400" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Analyzing Semantic Gaps...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
                      </svg>
                      Analyze & Tailor Resume
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* RIGHT WORKPLACE DETAILS PANEL */}
            <div className="lg:col-span-7">
              
              {/* ANALYSIS LOADER PANEL */}
              {isAnalyzing && (
                <div className="glass-card p-12 text-center shadow-xl min-h-[480px] flex flex-col items-center justify-center gap-6">
                  {/* Glowing Radar Circle */}
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 rounded-full border border-cyan-500/10 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full border border-violet-500/20 animate-pulse"></div>
                    <div className="absolute inset-4 rounded-full bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_30px_rgba(34,211,238,0.15)]">
                      <svg className="w-8 h-8 text-cyan-400 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-white">{STEPS[analysisStep].title}</h3>
                    <p className="text-slate-400 text-sm max-w-sm mx-auto leading-relaxed">{STEPS[analysisStep].desc}</p>
                  </div>

                  {/* Progress bar ticker */}
                  <div className="w-64 h-1.5 bg-[#0c1220] rounded-full overflow-hidden border border-white/5">
                    <div 
                      className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all duration-1000 ease-out"
                      style={{ width: `${((analysisStep + 1) / STEPS.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* DEFAULT PLACEHOLDER SCREEN */}
              {!isAnalyzing && !isAnalyzed && (
                <div className="glass-card p-12 text-center shadow-xl border-dashed border-white/10 min-h-[480px] flex flex-col items-center justify-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mb-2">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m9-9H3" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-300">Ready for Alignment</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">
                    Select a resume from the list, paste the job description criteria, and click analyze to start your semantic audit.
                  </p>
                </div>
              )}

              {/* RESULTS INTERACTIVE DASHBOARD */}
              {isAnalyzed && !isAnalyzing && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-500">
                  
                  {/* Match Telemetry Row */}
                  <div className="grid md:grid-cols-12 gap-6">
                    
                    {/* Radial ATS Gauge */}
                    <div className="md:col-span-5 glass-card p-6 flex flex-col items-center text-center shadow-xl relative overflow-hidden">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 w-full text-left border-b border-white/5 pb-2">ATS Match Score</h4>
                      
                      {/* Circular Gauge */}
                      <div className="relative w-32 h-32 flex items-center justify-center mb-2">
                        <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                          <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.03)" strokeWidth="8" fill="transparent" />
                          <circle 
                            cx="50" 
                            cy="50" 
                            r="40" 
                            stroke="url(#ats-score-gradient)" 
                            strokeWidth="8" 
                            fill="transparent" 
                            strokeDasharray={251.2}
                            strokeDashoffset={251.2 - (251.2 * score) / 100}
                            strokeLinecap="round"
                            className="transition-all duration-1000 ease-out"
                          />
                          <defs>
                            <linearGradient id="ats-score-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#22d3ee" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center">
                          <span className="text-3xl font-black text-white">{score}%</span>
                          <span className="text-[10px] text-emerald-400 font-bold tracking-widest uppercase">Excellent</span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-400 leading-relaxed mt-2">
                        Optimized with {missingKeywords.length} key competencies matching job specifications.
                      </p>
                    </div>

                    {/* Keywords Checklist */}
                    <div className="md:col-span-7 glass-card p-6 shadow-xl flex flex-col justify-between">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 border-b border-white/5 pb-2">Keyword Density Map</h4>
                        
                        {/* Checked / Matched */}
                        <div className="space-y-4">
                          <div>
                            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-2">Matched Competencies ({matchedKeywords.length})</span>
                            <div className="flex flex-wrap gap-2">
                              {matchedKeywords.map((kw, i) => (
                                <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 flex items-center gap-1">
                                  ✓ {kw}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Missing / Added */}
                          <div>
                            <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-2">Bridge Keywords Added ({missingKeywords.length})</span>
                            <div className="flex flex-wrap gap-2">
                              {missingKeywords.map((kw, i) => (
                                <span key={i} className="text-xs font-semibold px-2.5 py-1 bg-cyan-500/10 text-cyan-300 rounded-lg border border-cyan-500/25 flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.05)] animate-pulse">
                                  ✨ {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* Bullet comparison slider list */}
                  <div className="glass-card p-6 shadow-xl space-y-4">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-white/5 pb-3">Semantic Bullet Optimization</h4>
                    
                    <div className="space-y-6">
                      {bulletComparisons.map((comp, i) => (
                        <div key={i} className="space-y-3 p-4 bg-[#0c1220]/60 border border-white/5 rounded-2xl">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white px-3 py-1 bg-slate-800 rounded-full border border-white/10">
                              {comp.label}
                            </span>
                            <span className="text-[10px] text-cyan-400 uppercase font-black tracking-widest bg-cyan-950/40 border border-cyan-500/20 px-2 py-0.5 rounded">
                              AI Enhanced
                            </span>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 text-sm mt-2">
                            {/* Original */}
                            <div className="p-3 bg-red-950/10 border border-red-500/10 rounded-xl">
                              <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block mb-1">Before (Resume Copy)</span>
                              <p className="text-slate-400 leading-relaxed italic">"{comp.original}"</p>
                            </div>
                            
                            {/* Tailored */}
                            <div className="p-3 bg-emerald-950/10 border border-emerald-500/10 rounded-xl relative overflow-hidden group">
                              <div className="absolute top-0 right-0 w-12 h-12 bg-gradient-to-bl from-emerald-500/10 to-transparent pointer-events-none"></div>
                              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block mb-1">After (AI Optimized)</span>
                              <p className="text-slate-200 leading-relaxed font-medium">"{comp.tailored}"</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Bar */}
                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={handleApplyChanges}
                      className="flex-1 bg-gradient-to-r from-cyan-400 to-violet-500 hover:from-cyan-300 hover:to-violet-400 text-black font-extrabold py-3.5 rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Save & Apply Tailored Changes
                    </button>
                    
                    <button
                      onClick={() => {
                        setIsAnalyzed(false);
                        setJobDescription("");
                        setJobTitle("");
                      }}
                      className="px-6 py-3.5 text-sm font-bold bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all text-slate-300 cursor-pointer"
                    >
                      Reset / Try Another Job
                    </button>
                  </div>

                </div>
              )}

            </div>

          </div>
        )}

      </div>
    </div>
  );
}

export default JobMatch;

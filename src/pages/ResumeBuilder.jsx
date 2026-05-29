import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Preview from "../components/Preview";
import Personal from "../components/Personal";
import Skills from "../components/Skills";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Achievements from "../components/Achievements";
import Certificates from "../components/Certificates";
import Publications from "../components/Publications";
import Responsibilities from "../components/Responsibilities";
import RobotProgress from "../components/RobotProgress";
import { calculateAtsScore, getAtsSuggestions } from "../utils/atsScorer";

const STEPS = [
  "Personal",
  "Skills",
  "Education",
  "Experience & Projects",
  "Achievements & Certs",
  "Responsibilities",
  "Preview"
];

const OPTIMAL_FONTS = {
  minimalist: "EB Garamond",
  modern: "Inter",
  executive: "Cormorant Garamond",
  creative: "Plus Jakarta Sans",
  "photo-header": "Lora",
  "photo-sidebar": "DM Sans",
  "skills-table": "Roboto",
  "two-column": "Nunito",
  timeline: "Poppins"
};

const DEFAULT_RESUME_DATA = {
  personal: {
    fullName: "",
    email: "",
    phone: "",
    location: "",
    summary: "",
    linkedin: "",
    github: "",
    portfolio: "",
  },
  skills: [],
  groupedSkills: [],
  suggestedSkills: [],
  showGroupedSkills: false,
  education: {
    college: "",
    location: "",
    degree: "",
    course: "",
    year: "",
    gpa: "",
  },
  experiences: [],
  projects: [
    {
      title: "",
      technologies: "",
      points: [],
    }
  ],
  achievements: [],
  certificates: [],
  publications: [],
  responsibilities: [],
  template: "minimalist",
  sectionOrder: [
    "personal",
    "summary",
    "skills",
    "education",
    "experience",
    "project",
    "achievement",
    "certificate",
    "publication",
    "responsibilities"
  ],
  hiddenSections: [],
  layoutSettings: {
    sectionSpacing: 16,
    lineSpacing: 4,
    individualSpacing: {}
  },
  fontSettings: {
    family: "auto",
    size: "10"
  }
};

function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  // RESIZE STATE
  const [leftWidth, setLeftWidth] = useState(50);

  // WIZARD STATE
  const [currentStep, setCurrentStep] = useState(0);

  // SETTINGS TOOLBAR STATE
  const [showLayoutSettings, setShowLayoutSettings] = useState(false);
  const [showTypographySettings, setShowTypographySettings] = useState(false);

  // RESUME NAME STATE
  const [resumeName, setResumeName] = useState("Untitled Resume");

  const userEmail = localStorage.getItem("userEmail") || "anonymous";
  const resumesKey = `savedResumes_${userEmail}`;

  // RESUME DATA STATE
  const [resumeData, setResumeData] = useState(() => {
    let saved = localStorage.getItem(resumesKey);
    if (!saved) {
      const legacy = localStorage.getItem("savedResumes");
      if (legacy) {
        localStorage.setItem(resumesKey, legacy);
        localStorage.removeItem("savedResumes");
        saved = legacy;
      }
    }

    const savedResumes = JSON.parse(saved || "[]");
    const existing = savedResumes.find(r => r.id === id);

    if (existing) {
      const legacyTemplateMap = {
        minimal: "minimalist",
        corporate: "executive",
        tech: "modern"
      };
      const cleanedData = { ...DEFAULT_RESUME_DATA, ...existing.data };
      if (cleanedData.template && legacyTemplateMap[cleanedData.template]) {
        cleanedData.template = legacyTemplateMap[cleanedData.template];
      }
      return cleanedData;
    }

    const legacySaved = localStorage.getItem("resumeData");
    if (legacySaved) {
      try {
        return { ...DEFAULT_RESUME_DATA, ...JSON.parse(legacySaved) };
      } catch {
        return DEFAULT_RESUME_DATA;
      }
    }
    return DEFAULT_RESUME_DATA;
  });

  // ADJUST STATE ON ROUTE ID CHANGE
  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    const savedResumes = JSON.parse(localStorage.getItem(resumesKey) || "[]");
    const existing = savedResumes.find(r => r.id === id);
    setResumeName(existing && existing.name ? existing.name : "Untitled Resume");
    if (existing && existing.data) {
      setResumeData({ ...DEFAULT_RESUME_DATA, ...existing.data });
    }
  }

  // REDIRECT NEW RESUMES TO A UNIQUE ID ROUTE
  useEffect(() => {
    if (!id || id === "new") {
      const newId = "res-" + Date.now().toString();
      const savedResumes = JSON.parse(localStorage.getItem(resumesKey) || "[]");

      // Read template from URL query param
      const params = new URLSearchParams(location.search);
      const templateParam = params.get("template");

      const newResumeData = templateParam
        ? { ...resumeData, template: templateParam }
        : resumeData;

      const newResumeObj = {
        id: newId,
        name: resumeName,
        lastEdited: Date.now(),
        atsScore: calculateAtsScore(newResumeData),
        data: newResumeData
      };

      savedResumes.push(newResumeObj);
      localStorage.setItem(resumesKey, JSON.stringify(savedResumes));

      navigate(`/builder/${newId}`, { replace: true });
    }
  }, [id, resumesKey, navigate, resumeData, resumeName, location.search]);

  // DYNAMIC ATS SCORING & SUGGESTIONS
  const score = useMemo(() => calculateAtsScore(resumeData), [resumeData]);
  const suggestions = useMemo(() => getAtsSuggestions(resumeData), [resumeData]);

  // SAVE TO LOCAL STORAGE HELPER
  const saveResume = () => {
    if (!id || id === "new") return;

    localStorage.setItem("resumeData", JSON.stringify(resumeData));

    const savedResumes = JSON.parse(localStorage.getItem(resumesKey) || "[]");
    const existingIndex = savedResumes.findIndex(r => r.id === id);

    const resumeToSave = {
      id: id,
      name: resumeName,
      lastEdited: Date.now(),
      atsScore: score,
      data: resumeData
    };

    if (existingIndex >= 0) {
      savedResumes[existingIndex] = resumeToSave;
    } else {
      savedResumes.push(resumeToSave);
    }

    localStorage.setItem(resumesKey, JSON.stringify(savedResumes));
  };

  // AUTOSAVE ON DATA CHANGE
  useEffect(() => {
    saveResume();
  }, [resumeData, resumeName, id, resumesKey, score]);

  // UPDATE SPACING & TYPOGRAPHY SETTINGS HELPERS
  const updateLayoutSetting = (key, value) => {
    setResumeData(prev => ({
      ...prev,
      layoutSettings: {
        ...(prev.layoutSettings || { sectionSpacing: 16, lineSpacing: 4, individualSpacing: {} }),
        [key]: value
      }
    }));
  };

  const updateFontSetting = (key, value) => {
    setResumeData(prev => ({
      ...prev,
      fontSettings: {
        ...(prev.fontSettings || { family: "auto", size: "10" }),
        [key]: value
      }
    }));
  };

  // SECTION REORDERING CONTROL HELPERS
  const sectionOrder = resumeData.sectionOrder || DEFAULT_RESUME_DATA.sectionOrder;

  const handleMoveUp = (index) => {
    if (index <= 1) return; // index 0 is personal (locked)
    const updatedOrder = [...sectionOrder];
    const temp = updatedOrder[index];
    updatedOrder[index] = updatedOrder[index - 1];
    updatedOrder[index - 1] = temp;
    setResumeData(prev => ({
      ...prev,
      sectionOrder: updatedOrder
    }));
  };

  const handleMoveDown = (index) => {
    if (index === 0 || index >= sectionOrder.length - 1) return;
    const updatedOrder = [...sectionOrder];
    const temp = updatedOrder[index];
    updatedOrder[index] = updatedOrder[index + 1];
    updatedOrder[index + 1] = temp;
    setResumeData(prev => ({
      ...prev,
      sectionOrder: updatedOrder
    }));
  };

  const handleToggleVisibility = (sectionKey) => {
    const hidden = resumeData.hiddenSections || [];
    const isHidden = hidden.includes(sectionKey);
    const updatedHidden = isHidden
      ? hidden.filter(k => k !== sectionKey)
      : [...hidden, sectionKey];

    setResumeData(prev => ({
      ...prev,
      hiddenSections: updatedHidden
    }));
  };

  // RESIZE PANEL DRAGGER
  const handleMouseDown = (e) => {
    e.preventDefault();

    const handleMouseMove = (moveEvent) => {
      const newWidth = (moveEvent.clientX / window.innerWidth) * 100;
      if (newWidth > 25 && newWidth < 75) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="h-screen bg-[#070b14] p-6 flex flex-col overflow-hidden text-slate-100">
      {/* HEADER / NAME INPUT */}
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              saveResume();
              navigate("/dashboard");
            }}
            className="px-3 py-1.5 bg-white/5 border border-white/10 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm"
          >
            ← Dashboard
          </button>
          <input
            type="text"
            value={resumeName}
            onChange={(e) => setResumeName(e.target.value)}
            className="bg-transparent border-b border-transparent hover:border-slate-700 focus:border-indigo-500 text-white text-xl font-bold px-2 py-0.5 focus:outline-none transition-colors"
            placeholder="Resume Name"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-white/5 border border-white/10 px-2.5 py-1 rounded-md animate-pulse">
            ● Draft Autosaved
          </span>
        </div>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-x-auto rounded-2xl overflow-hidden shadow-xl border border-white/5 bg-[#0a1628]">
        {/* LEFT PANEL */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="bg-white text-gray-900 p-6 overflow-y-auto h-full flex flex-col relative border-r border-slate-200"
        >
          <RobotProgress
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
          />

          <div className="flex-1 mt-6">
            {currentStep === 0 && <Personal resumeData={resumeData} setResumeData={setResumeData} />}
            {currentStep === 1 && <Skills resumeData={resumeData} setResumeData={setResumeData} />}
            {currentStep === 2 && <Education resumeData={resumeData} setResumeData={setResumeData} />}
            {currentStep === 3 && (
              <div className="space-y-8">
                <Experience resumeData={resumeData} setResumeData={setResumeData} />
                <hr className="border-gray-200" />
                <Projects resumeData={resumeData} setResumeData={setResumeData} />
              </div>
            )}
            {currentStep === 4 && (
              <div className="space-y-8">
                <Achievements resumeData={resumeData} setResumeData={setResumeData} />
                <hr className="border-gray-200" />
                <Certificates resumeData={resumeData} setResumeData={setResumeData} />
                <hr className="border-gray-200" />
                <Publications resumeData={resumeData} setResumeData={setResumeData} />
              </div>
            )}
            {currentStep === 5 && <Responsibilities resumeData={resumeData} setResumeData={setResumeData} />}
            {currentStep === 6 && (
              <div className="space-y-6 text-left animate-in fade-in duration-300 mt-2">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">Finalize & Optimize 🚀</h2>
                  <p className="text-xs text-gray-500">
                    Arrange the order of sections on your resume and check your ATS Optimization score.
                  </p>
                </div>

                <div className="flex flex-col gap-6">
                  {/* Circular Gauge Card */}
                  <div className="flex flex-col md:flex-row items-center gap-6 p-5 bg-gradient-to-br from-indigo-50/50 to-violet-50/30 border border-indigo-100 rounded-2xl shadow-sm">
                    <div className="relative flex items-center justify-center w-28 h-28 shrink-0">
                      <svg className="w-full h-full transform -rotate-95" viewBox="0 0 100 100">
                        <circle
                          className="text-slate-200"
                          strokeWidth="8"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                        <circle
                          className={`${
                            score >= 80 ? "text-emerald-500" : score >= 60 ? "text-amber-500" : "text-rose-500"
                          } transition-all duration-1000 ease-out`}
                          strokeWidth="8"
                          strokeDasharray={2 * Math.PI * 40}
                          strokeDashoffset={2 * Math.PI * 40 - (score / 100) * 2 * Math.PI * 40}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="40"
                          cx="50"
                          cy="50"
                        />
                      </svg>
                      <div className="absolute flex flex-col items-center">
                        <span className="text-2xl font-extrabold text-slate-800">{score}</span>
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Score</span>
                      </div>
                    </div>
                    <div className="flex-1 text-center md:text-left">
                      <h3 className="font-bold text-slate-800 text-sm mb-1">ATS Optimization Check</h3>
                      <p className="text-xs text-slate-500 leading-relaxed mb-2">
                        {score >= 80
                          ? "🎉 Excellent match! Your resume has strong keyword usage, clear formatting, and quantifiable metrics."
                          : score >= 60
                          ? "⚡ Good score! We found a few minor optimizations. Resolve the checklist items below to achieve a top-tier score."
                          : "⚠️ Your ATS match is quite low. Recruiters may have difficulty parsing your information. Please apply suggestions."}
                      </p>
                    </div>
                  </div>

                  {/* Suggestions checklist */}
                  <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-slate-50 p-5 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                      Optimize Checklist ({suggestions.length} items left)
                    </span>

                    {suggestions.length === 0 ? (
                      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-100 rounded-xl">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                          ✓
                        </div>
                        <div>
                          <p className="text-xs font-bold text-emerald-800">100% ATS Optimized!</p>
                          <p className="text-[11px] text-emerald-600">Great job, your resume has zero critical gaps.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {suggestions.map((s) => {
                          const impactColor =
                            s.impact === "High"
                              ? "bg-red-50 text-red-700 border-red-200"
                              : s.impact === "Medium"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-blue-50 text-blue-700 border-blue-200";

                          return (
                            <div
                              key={s.id}
                              className="flex items-start gap-3 p-2.5 bg-white border border-gray-200 rounded-xl hover:border-indigo-200 transition-colors shadow-xs"
                            >
                              <div className="mt-0.5 shrink-0 select-none">
                                <div className="w-4 h-4 rounded-full border border-gray-300 flex items-center justify-center text-[10px] font-bold text-indigo-500 bg-slate-50">
                                  !
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs text-slate-700 font-medium leading-relaxed">{s.text}</p>
                              </div>
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border shrink-0 uppercase tracking-wide ${impactColor}`}>
                                {s.impact}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Reordering widget */}
                  <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm bg-slate-50 p-5 space-y-3">
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                      Section Arrangement & Visibility
                    </span>

                    <div className="space-y-2">
                      {sectionOrder.map((sectionKey, index) => {
                        const labelMap = {
                          personal: "Header & Contact Details (Locked)",
                          summary: "Professional Summary",
                          skills: "Technical Skills",
                          education: "Education",
                          experience: "Work Experience",
                          project: "Projects",
                          achievement: "Achievements",
                          certificate: "Certificates",
                          publication: "Publications",
                          responsibilities: "Responsibilities"
                        };

                        const isHeader = sectionKey === "personal";
                        const isHidden = (resumeData.hiddenSections || []).includes(sectionKey);

                        return (
                          <div
                            key={sectionKey}
                            className={`flex items-center justify-between p-2.5 border rounded-xl transition-all ${
                              isHeader
                                ? "bg-slate-50/50 border-gray-100 opacity-60 cursor-not-allowed"
                                : isHidden
                                ? "bg-[#f1f5f9]/50 border-slate-200 opacity-50 hover:border-slate-300"
                                : "bg-white border-gray-200 hover:border-indigo-400 hover:shadow-xs"
                            }`}
                          >
                            <span className="text-xs font-semibold text-slate-700">{labelMap[sectionKey] || sectionKey}</span>

                            <div className="flex items-center gap-1.5">
                              {/* Visibility Toggle */}
                              {!isHeader && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleToggleVisibility(sectionKey);
                                  }}
                                  className={`p-1 rounded-lg border transition-all ${
                                    isHidden
                                      ? "bg-slate-100 border-slate-200 text-slate-400 hover:text-slate-600 hover:bg-slate-200"
                                      : "bg-indigo-50 border-indigo-100 text-indigo-600 hover:bg-indigo-100"
                                  }`}
                                  title={isHidden ? "Show Section" : "Hide Section"}
                                >
                                  {isHidden ? (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l-3 3m11.685-3A9.99 9.99 0 0112 5c.478 0 .943.033 1.402.096m3.67 1.03a10.05 10.05 0 011.554 2.873M12 15c-1.657 0-3-1.343-3-3 0-.417.085-.815.24-1.177l3.937 3.937A2.99 2.99 0 0112 15z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3l18 18" />
                                    </svg>
                                  ) : (
                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  )}
                                </button>
                              )}

                              {/* Move Up */}
                              {!isHeader && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleMoveUp(index);
                                  }}
                                  disabled={index <= 1}
                                  className="p-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                                  title="Move Up"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 15l7-7 7 7" />
                                  </svg>
                                </button>
                              )}

                              {/* Move Down */}
                              {!isHeader && (
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleMoveDown(index);
                                  }}
                                  disabled={index === sectionOrder.length - 1}
                                  className="p-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all"
                                  title="Move Down"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* NEXT / BACK NAVIGATION */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between sticky bottom-0 bg-white pb-2">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                currentStep === 0
                  ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              Back
            </button>

            <button
              onClick={() => setCurrentStep(prev => Math.min(STEPS.length - 1, prev + 1))}
              disabled={currentStep === STEPS.length - 1}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                currentStep === STEPS.length - 1
                  ? "bg-slate-50 text-slate-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/10 hover:-translate-y-0.5"
              }`}
            >
              Next Step
            </button>
          </div>
        </div>

        {/* RESIZER BAR */}
        <div
          onMouseDown={handleMouseDown}
          className="w-1.5 cursor-col-resize bg-slate-200 hover:bg-slate-400 transition-colors"
        />

        {/* RIGHT PANEL */}
        <div
          style={{ width: `${100 - leftWidth}%` }}
          className="bg-slate-100 text-gray-900 h-full overflow-auto"
        >
          {/* Spacing & Layout & Typography toolbar */}
          <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-3 flex flex-col gap-2.5 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowLayoutSettings(prev => !prev);
                    setShowTypographySettings(false);
                  }}
                  className={`text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                    showLayoutSettings ? "text-indigo-600 font-extrabold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  📐 Spacing & Layout {showLayoutSettings ? "▲" : "▼"}
                </button>
                <button
                  onClick={() => {
                    setShowTypographySettings(prev => !prev);
                    setShowLayoutSettings(false);
                  }}
                  className={`text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 ${
                    showTypographySettings ? "text-indigo-600 font-extrabold" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  🔤 Typography {showTypographySettings ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {/* Layout Settings Sub-panel */}
            {showLayoutSettings && (
              <div className="pt-2 pb-1 border-t border-slate-100 flex flex-col gap-3">
                {/* Global Section Spacing */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11px] font-semibold text-slate-600 min-w-[120px]">Global Section Gap</span>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    value={resumeData.layoutSettings?.sectionSpacing ?? 16}
                    onChange={(e) => {
                      updateLayoutSetting("sectionSpacing", Number(e.target.value));
                    }}
                    style={{ flex: 1, maxWidth: "160px", accentColor: "#6366f1", height: "4px", cursor: "pointer" }}
                  />
                  <span className="text-[11px] font-bold text-indigo-600 w-8 text-right">{resumeData.layoutSettings?.sectionSpacing ?? 16}px</span>
                </div>

                {/* Inner Line Spacing */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11px] font-semibold text-slate-600 min-w-[120px]">Inner Line Spacing</span>
                  <input
                    type="range"
                    min="0"
                    max="16"
                    value={resumeData.layoutSettings?.lineSpacing ?? 4}
                    onChange={(e) => {
                      updateLayoutSetting("lineSpacing", Number(e.target.value));
                    }}
                    style={{ flex: 1, maxWidth: "160px", accentColor: "#6366f1", height: "4px", cursor: "pointer" }}
                  />
                  <span className="text-[11px] font-bold text-indigo-600 w-8 text-right">{resumeData.layoutSettings?.lineSpacing ?? 4}px</span>
                </div>
              </div>
            )}

            {/* Typography Settings Sub-panel */}
            {showTypographySettings && (
              <div className="pt-2 pb-1 border-t border-slate-100 flex flex-col gap-3">
                {/* Font Family Selection */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11px] font-semibold text-slate-600 min-w-[100px]">Font Family</span>
                  <select
                    value={resumeData.fontSettings?.family ?? "auto"}
                    onChange={(e) => {
                      updateFontSetting("family", e.target.value);
                    }}
                    className="text-xs bg-white border border-slate-300 rounded px-2 py-1 max-w-[180px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  >
                    <option value="auto">★ Recommended ({OPTIMAL_FONTS[resumeData.template || "minimalist"] || "EB Garamond"})</option>
                    <optgroup label="Serif Fonts">
                      <option value="EB Garamond">EB Garamond</option>
                      <option value="Cormorant Garamond">Cormorant Garamond</option>
                      <option value="Lora">Lora</option>
                      <option value="Merriweather">Merriweather</option>
                      <option value="Playfair Display">Playfair Display</option>
                    </optgroup>
                    <optgroup label="Sans-Serif Fonts">
                      <option value="Inter">Inter</option>
                      <option value="Roboto">Roboto</option>
                      <option value="DM Sans">DM Sans</option>
                      <option value="Poppins">Poppins</option>
                      <option value="Plus Jakarta Sans">Plus Jakarta Sans</option>
                      <option value="Nunito">Nunito</option>
                      <option value="Raleway">Raleway</option>
                    </optgroup>
                  </select>
                </div>

                {/* Font Size Selection */}
                <div className="flex items-center justify-between gap-4">
                  <span className="text-[11px] font-semibold text-slate-600 min-w-[100px]">Font Size</span>
                  <div className="flex items-center gap-1.5">
                    {["8", "9", "10", "11", "12"].map((sz) => {
                      const isSelected = (resumeData.fontSettings?.size ?? "10") === sz;
                      const isOptimal = sz === "10";
                      return (
                        <button
                          key={sz}
                          type="button"
                          onClick={() => {
                            updateFontSetting("size", sz);
                          }}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold transition-all ${
                            isSelected
                              ? "bg-indigo-600 text-white shadow"
                              : "bg-white hover:bg-slate-100 text-slate-700 border border-slate-200"
                          }`}
                        >
                          {sz}pt{isOptimal && "★"}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold italic">★ 10pt is the recommended baseline size for templates</span>
              </div>
            )}
          </div>

          {/* PREVIEW CONTAINER */}
          <div className="p-6 overflow-x-auto flex justify-start">
            <div className="min-w-[820px] bg-white shadow-md rounded-xl p-1 mx-auto">
              <Preview
                resumeData={resumeData}
                resumeName={resumeName}
                layoutSettings={resumeData.layoutSettings || { sectionSpacing: 16, lineSpacing: 4, individualSpacing: {} }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;

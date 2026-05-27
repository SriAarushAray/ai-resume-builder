import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Preview from "../components/Preview";
import Personal from "../components/Personal";
import Skills from "../components/Skills";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Achievements from "../components/Achievements";
import Certificates   from "../components/Certificates";
import Publications from "../components/Publications";
import Responsibilities from "../components/Responsibilities";
import RobotProgress from "../components/RobotProgress";

const STEPS = [
  "Personal",
  "Skills",
  "Education",
  "Experience & Projects",
  "Achievements & Certs",
  "Responsibilities",
  "Preview"
];

function ResumeBuilder() {
  const { id } = useParams();
  const navigate = useNavigate();

  // RESIZE STATE
  const [leftWidth, setLeftWidth] = useState(50);

  // SPACING CONTROL (px of gap between resume sections, 0–24)
  const [sectionSpacing, setSectionSpacing] = useState(16);
  
  // WIZARD STATE
  const [currentStep, setCurrentStep] = useState(0);
  
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
      // Defer setting name since we can't do it inside useState initializer cleanly without a ref or useEffect
      return existing.data;
    }

    const legacySaved = localStorage.getItem("resumeData");
    return legacySaved
      ? JSON.parse(legacySaved)
      : {
          personal: {
            fullName: "",
            email: "",
            phone: "",
            location: "",
            summary: "",
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
        };
  });

  // ADJUST STATE ON ROUTE ID CHANGE
  const [prevId, setPrevId] = useState(id);
  if (id !== prevId) {
    setPrevId(id);
    const savedResumes = JSON.parse(localStorage.getItem(resumesKey) || "[]");
    const existing = savedResumes.find(r => r.id === id);
    setResumeName(existing && existing.name ? existing.name : "Untitled Resume");
  }

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    // Keep legacy save for backward compatibility
    localStorage.setItem("resumeData", JSON.stringify(resumeData));

    // Save to the new array structure
    const savedResumes = JSON.parse(localStorage.getItem(resumesKey) || "[]");
    const currentId = id === "new" ? Date.now().toString() : (id || "1");
    
    // If it's a new resume and we just generated an ID, we should technically redirect, 
    // but for simplicity we'll just keep saving it under this ID in local storage.
    
    const existingIndex = savedResumes.findIndex(r => r.id === currentId);
    
    const resumeToSave = {
      id: currentId,
      name: resumeName,
      lastEdited: Date.now(),
      atsScore: 82, // mock score for now
      data: resumeData
    };

    if (existingIndex >= 0) {
      savedResumes[existingIndex] = resumeToSave;
    } else {
      savedResumes.push(resumeToSave);
    }

    localStorage.setItem(resumesKey, JSON.stringify(savedResumes));
  }, [resumeData, resumeName, id, resumesKey]);

  // HANDLE DRAGGING
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
    <div className="h-screen bg-navy-900 p-6 flex flex-col overflow-hidden">
      {/* HEADER / NAME INPUT */}
      <div className="mb-4 flex items-center gap-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-slate-400 hover:text-white transition-colors"
        >
          ← Back
        </button>
        <input
          type="text"
          value={resumeName}
          onChange={(e) => setResumeName(e.target.value)}
          className="bg-transparent border-b border-transparent hover:border-slate-600 focus:border-accent text-white text-xl font-semibold px-2 py-1 focus:outline-none transition-colors"
          placeholder="Resume Name"
        />
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex flex-1 overflow-x-auto rounded-2xl overflow-hidden shadow-xl">
        {/* LEFT PANEL */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="bg-white text-gray-900 p-6 overflow-y-auto h-full flex flex-col relative"
        >
          <RobotProgress 
            steps={STEPS} 
            currentStep={currentStep} 
            onStepClick={setCurrentStep} 
          />

          <div className="flex-1">
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
              <div className="flex flex-col items-center justify-center h-full text-center space-y-6 animate-in fade-in zoom-in duration-500 mt-10">
                <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-100/50">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">You're all set! 🎉</h2>
                  <p className="text-gray-500 max-w-sm mx-auto text-lg leading-relaxed">
                    Take a look at the live preview on the right. If everything looks perfect, go ahead and download your PDF!
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* NEXT / BACK WIZARD NAVIGATION */}
          <div className="mt-8 pt-4 border-t flex items-center justify-between sticky bottom-0 bg-white pb-2">
            <button
              onClick={() => setCurrentStep(prev => Math.max(0, prev - 1))}
              disabled={currentStep === 0}
              className={`px-5 py-2.5 rounded-lg font-medium transition-all ${
                currentStep === 0 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
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
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30 hover:-translate-y-0.5"
              }`}
            >
              Next Step
            </button>
          </div>
        </div>

        {/* RESIZER BAR */}
        <div
          onMouseDown={handleMouseDown}
          className="w-2 cursor-col-resize bg-gray-300 hover:bg-gray-400"
        />

        {/* RIGHT PANEL */}
        <div
          style={{ width: `${100 - leftWidth}%` }}
          className="bg-gray-200 text-gray-900 h-full overflow-auto"
        >
          {/* Spacing toolbar */}
          <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-2 bg-gray-300/80 backdrop-blur-sm border-b border-gray-400/30">
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#475569", whiteSpace: "nowrap", letterSpacing: "0.03em" }}>
              ↕ SECTION SPACING
            </span>
            <input
              type="range"
              min="0"
              max="24"
              step="1"
              value={sectionSpacing}
              onChange={(e) => setSectionSpacing(Number(e.target.value))}
              style={{ flex: 1, maxWidth: "160px", accentColor: "#6366f1", height: "4px", cursor: "pointer" }}
            />
            <span style={{ fontSize: "11px", fontWeight: 700, color: "#6366f1", minWidth: "28px" }}>{sectionSpacing}px</span>
          </div>

          <div className="p-6">
            <div className="min-w-[820px]">
              <Preview resumeData={resumeData} resumeName={resumeName} sectionSpacing={sectionSpacing} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;

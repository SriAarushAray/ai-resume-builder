import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

function CoverLetterPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const letterId = searchParams.get("id");
  const userEmail = localStorage.getItem("userEmail") || "anonymous";

  // Active user key for data persistence
  const coverLettersKey = `savedCoverLetters_${userEmail}`;
  const resumesKey = `savedResumes_${userEmail}`;

  // Resumes list
  const [resumes, setResumes] = useState(() => {
    return JSON.parse(localStorage.getItem(resumesKey) || "[]");
  });

  // Editor states
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [tone, setTone] = useState("Professional");
  const [generatedLetter, setGeneratedLetter] = useState("");
  const [letterName, setLetterName] = useState("Untitled Cover Letter");
  
  // UX states
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Load editing cover letter if id exists
  useEffect(() => {
    if (letterId) {
      const savedLetters = JSON.parse(localStorage.getItem(coverLettersKey) || "[]");
      const currentLetter = savedLetters.find(item => item.id === letterId);
      if (currentLetter) {
        setLetterName(currentLetter.name || "Untitled Cover Letter");
        setCompanyName(currentLetter.companyName || "");
        setJobTitle(currentLetter.jobTitle || "");
        setJobDescription(currentLetter.jobDescription || "");
        setTone(currentLetter.tone || "Professional");
        setGeneratedLetter(currentLetter.content || "");
        setSelectedResumeId(currentLetter.resumeId || "");
      }
    } else {
      // Set default selected resume if available
      if (resumes.length > 0) {
        setSelectedResumeId(resumes[0].id);
      }
    }
  }, [letterId, resumes, coverLettersKey]);

  // Trigger temporary visual toasts
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  const handleGenerate = async () => {
    if (!companyName.trim()) {
      triggerToast("Please enter a company name.");
      return;
    }
    if (!jobTitle.trim()) {
      triggerToast("Please enter a job title.");
      return;
    }

    setIsGenerating(true);
    const chosenResume = resumes.find(r => r.id === selectedResumeId);
    
    try {
      const response = await fetch("/api/ai/generate-cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resumeData: chosenResume ? chosenResume.data : null,
          companyName,
          jobTitle,
          jobDescription,
          tone
        })
      });

      if (!response.ok) {
        throw new Error("Failed to generate cover letter");
      }

      const data = await response.json();
      setGeneratedLetter(data.letter);
      triggerToast("Cover letter generated successfully!");
      
      // Update letter name automatically if default
      if (letterName === "Untitled Cover Letter") {
        setLetterName(`Cover Letter - ${companyName} (${jobTitle})`);
      }
    } catch (err) {
      console.error(err);
      triggerToast("Generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    setIsSaving(true);
    setSaveSuccess(false);

    const savedLetters = JSON.parse(localStorage.getItem(coverLettersKey) || "[]");
    const now = Date.now();

    const payload = {
      id: letterId || `cl_${now}`,
      name: letterName,
      companyName,
      jobTitle,
      jobDescription,
      tone,
      content: generatedLetter,
      resumeId: selectedResumeId,
      lastEdited: now
    };

    let updatedLetters;
    if (letterId) {
      // Edit mode
      updatedLetters = savedLetters.map(item => item.id === letterId ? payload : item);
    } else {
      // Create mode
      updatedLetters = [payload, ...savedLetters];
    }

    localStorage.setItem(coverLettersKey, JSON.stringify(updatedLetters));
    
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      triggerToast("Cover letter saved successfully!");
      
      // If we created a new one, navigate to edit page of that item to prevent duplicating on next saves
      if (!letterId) {
        navigate(`/cover-letter?id=${payload.id}`, { replace: true });
      }
      
      setTimeout(() => setSaveSuccess(false), 2000);
    }, 600);
  };

  const handleCopyToClipboard = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
    triggerToast("Copied to clipboard!");
  };

  const handleDownloadTxt = () => {
    if (!generatedLetter) return;
    const element = document.createElement("a");
    const file = new Blob([generatedLetter], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${letterName.replace(/\s+/g, "_")}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    triggerToast("Downloaded TXT!");
  };

  const handleDownloadPDF = () => {
    if (!generatedLetter) return;
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>${letterName}</title>
          <style>
            body {
              font-family: Georgia, 'Times New Roman', Times, serif;
              line-height: 1.6;
              color: #1a202c;
              padding: 50px 70px;
              max-width: 800px;
              margin: 0 auto;
              background: #fff;
              white-space: pre-line;
            }
            .title {
              font-size: 14px;
              color: #4a5568;
              border-bottom: 1px solid #e2e8f0;
              padding-bottom: 8px;
              margin-bottom: 30px;
              font-family: Arial, sans-serif;
            }
          </style>
        </head>
        <body>
          <div class="title">${letterName}</div>
          <div>${generatedLetter}</div>
          <script>
            window.onload = function() {
              window.print();
              window.close();
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
    triggerToast("Initiated PDF print!");
  };

  const tones = ["Professional", "Enthusiastic", "Creative", "Formal"];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#070b14] to-[#0a1628] text-slate-100 flex flex-col">
      {/* Background patterns */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[20%] left-[-5%] w-[450px] h-[450px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Main layout wrapper */}
      <div className="relative z-10 flex-1 flex flex-col p-8 max-w-7xl mx-auto w-full">
        {/* Header toolbar */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                title="Back to Dashboard"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <input
                type="text"
                value={letterName}
                onChange={(e) => setLetterName(e.target.value)}
                className="bg-transparent border-b border-transparent hover:border-white/20 focus:border-accent focus:outline-none text-xl font-bold text-white px-1 py-0.5 transition-colors w-64 md:w-80"
              />
            </div>
            <p className="text-slate-400 text-xs mt-1 ml-11">
              {letterId ? "Updating saved letter" : "Create draft cover letter"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                saveSuccess 
                  ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400"
                  : "bg-white/[0.08] hover:bg-white/[0.12] border-white/[0.1] text-white"
              }`}
            >
              {isSaving ? (
                <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : saveSuccess ? (
                <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                </svg>
              )}
              {isSaving ? "Saving..." : saveSuccess ? "Saved!" : "Save Draft"}
            </button>
          </div>
        </div>

        {/* Split Pane Work Area */}
        <div className="flex-1 grid lg:grid-cols-12 gap-8">
          
          {/* Left panel: Generation Controls */}
          <div className="lg:col-span-5 flex flex-col gap-5">
            <div className="glass-card p-6 shadow-xl space-y-5">
              <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 border-b border-white/5 pb-2">
                Letter Details
              </h2>

              {/* Resume Selector */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Select Resume Profile</label>
                {resumes.length === 0 ? (
                  <div className="text-xs text-amber-400 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    No active resumes found. Generate a resume first to import developer profile details.
                  </div>
                ) : (
                  <select
                    value={selectedResumeId}
                    onChange={(e) => setSelectedResumeId(e.target.value)}
                    className="w-full bg-[#0c1322] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-accent transition-colors"
                  >
                    <option value="" disabled>Select a profile...</option>
                    {resumes.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name || "Untitled Resume"} (Score: {r.atsScore || 80})
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Company & Role */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google"
                    className="w-full bg-[#0c1322] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-slate-400 font-medium">Job Title</label>
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Frontend Engineer"
                    className="w-full bg-[#0c1322] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
              </div>

              {/* Tone pills */}
              <div className="space-y-2">
                <label className="text-xs text-slate-400 font-medium">Tone & Style</label>
                <div className="grid grid-cols-4 gap-2">
                  {tones.map((t) => (
                    <button
                      key={t}
                      onClick={() => setTone(t)}
                      className={`py-2 rounded-lg text-xs font-semibold border transition-all duration-200 ${
                        tone === t
                          ? "bg-accent/15 border-accent text-accent-light shadow-lg shadow-accent/5"
                          : "bg-white/[0.03] border-white/[0.05] text-slate-400 hover:text-white hover:bg-white/[0.06]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Job description */}
              <div className="space-y-1.5">
                <label className="text-xs text-slate-400 font-medium">Job Description / Requirements</label>
                <textarea
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  placeholder="Paste details of the role here to customize skills references..."
                  rows={8}
                  className="w-full bg-[#0c1322] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-accent transition-colors resize-none font-sans"
                />
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating}
                className="w-full flex items-center justify-center gap-2 py-3 bg-gradient-to-r from-accent to-accent-violet hover:shadow-lg hover:shadow-accent/20 text-white rounded-xl text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Generating letter...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                    <span>Generate Cover Letter</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right panel: Live A4 paper Preview & Editor */}
          <div className="lg:col-span-7 flex flex-col gap-4">
            
            {/* Toolbar above paper preview */}
            <div className="flex items-center justify-between px-2">
              <span className="text-xs text-slate-400 font-medium">A4 Paper Draft (Click anywhere to edit)</span>
              
              <div className="flex items-center gap-1.5">
                {/* Copy */}
                <button
                  onClick={handleCopyToClipboard}
                  disabled={!generatedLetter}
                  className="p-2 rounded-lg bg-white/5 border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                  title="Copy to Clipboard"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                  </svg>
                </button>
                {/* Download Text */}
                <button
                  onClick={handleDownloadTxt}
                  disabled={!generatedLetter}
                  className="p-2 rounded-lg bg-white/5 border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200"
                  title="Download as TXT"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Paper Preview */}
            <div className="flex-1 w-full bg-white text-slate-800 p-12 shadow-2xl rounded-sm border border-slate-200/50 flex flex-col min-h-[500px] lg:min-h-[640px] relative overflow-hidden group">
              {/* Paper Watermark / Glow Grid when empty */}
              {!generatedLetter && !isGenerating && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 pointer-events-none">
                  <svg className="w-12 h-12 text-slate-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <p className="text-sm font-medium">Cover Letter Preview</p>
                  <p className="text-xs text-slate-400 mt-1">Configure inputs and click generate to fill the page.</p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-[1px] flex flex-col items-center justify-center text-slate-600 pointer-events-none z-10 animate-fade-in">
                  <svg className="animate-spin h-8 w-8 text-accent-violet mb-3" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span className="text-sm font-semibold tracking-wide">Synthesizing tailored points...</span>
                </div>
              )}

              <textarea
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                placeholder="The text of your cover letter will display and be editable here..."
                className="w-full h-full bg-transparent resize-none border-none outline-none font-serif text-sm leading-relaxed text-slate-800 focus:ring-0 placeholder-slate-400 flex-1 z-0"
                style={{ fontFamily: "Georgia, 'Times New Roman', Times, serif" }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Floating visual toast notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-2.5 rounded-xl bg-[#0c1322] border border-white/[0.08] shadow-2xl text-xs font-semibold text-white flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default CoverLetterPage;

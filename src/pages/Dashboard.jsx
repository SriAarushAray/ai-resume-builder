import { Link, useNavigate } from "react-router-dom";
import { TemplatePickerModal } from "./TemplatesPage";

/* ── ATS Score Bar ── */
function AtsBar({ score }) {
  const color =
    score >= 80 ? "from-emerald-500 to-emerald-400" :
    score >= 60 ? "from-amber-500 to-amber-400" :
    "from-red-500 to-red-400";

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">ATS</span>
        <span className="text-xs font-semibold text-slate-300">{score}/100</span>
      </div>
      <div className="w-full h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}

import { useState } from "react";

/* ── Dashboard Page ── */
function Dashboard() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "anonymous";
  const resumesKey = `savedResumes_${userEmail}`;
  const userName = localStorage.getItem("userName") || "Sri Aarush";

  const [showTemplateModal, setShowTemplateModal] = useState(false);

  const coverLettersKey = `savedCoverLetters_${userEmail}`;
  const [coverLetters, setCoverLetters] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(coverLettersKey) || "[]");
    } catch {
      return [];
    }
  });

  const handleDeleteCoverLetter = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this cover letter?")) {
      const updated = coverLetters.filter(c => c.id !== id);
      setCoverLetters(updated);
      localStorage.setItem(coverLettersKey, JSON.stringify(updated));
    }
  };

  const [resumes, setResumes] = useState(() => {
    const userEmail = localStorage.getItem("userEmail") || "anonymous";
    const resumesKey = `savedResumes_${userEmail}`;

    // Gather all resumes from all accounts/guest/legacy keys in local storage to prevent any data loss
    const keys = Object.keys(localStorage);
    const resumeMap = {};

    const legacyTemplateMap = {
      minimal: "minimalist",
      corporate: "executive",
      tech: "modern"
    };

    keys.forEach(k => {
      if (k === "savedResumes" || k.startsWith("savedResumes_")) {
        try {
          const list = JSON.parse(localStorage.getItem(k) || "[]");
          if (Array.isArray(list)) {
            list.forEach(r => {
              if (r && r.id) {
                // Migrate legacy template name if present
                if (r.data && r.data.template && legacyTemplateMap[r.data.template]) {
                  r.data.template = legacyTemplateMap[r.data.template];
                }

                const existing = resumeMap[r.id];
                const rLastEdited = r.lastEdited || 0;
                const existingLastEdited = existing ? (existing.lastEdited || 0) : -1;
                
                if (!existing || rLastEdited > existingLastEdited) {
                  resumeMap[r.id] = r;
                }
              }
            });
          }
        } catch {
          // ignore invalid json
        }
      }
    });

    const allResumes = Object.values(resumeMap);

    // Save the combined list to the active user's key
    if (allResumes.length > 0) {
      localStorage.setItem(resumesKey, JSON.stringify(allResumes));
    }

    return allResumes.map(r => ({
      ...r,
      lastEdited: (!r.lastEdited || r.lastEdited <= 1000) ? Date.now() : r.lastEdited
    }));
  });

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this resume?")) {
      const updated = resumes.filter(r => r.id !== id);
      setResumes(updated);
      
      // Remove from all keys starting with savedResumes to prevent resurrection on reload
      Object.keys(localStorage).forEach(k => {
        if (k === "savedResumes" || k.startsWith("savedResumes_")) {
          try {
            const list = JSON.parse(localStorage.getItem(k) || "[]");
            if (Array.isArray(list)) {
              const filtered = list.filter(r => r.id !== id);
              localStorage.setItem(k, JSON.stringify(filtered));
            }
          } catch (err) {
            // ignore invalid JSON
          }
        }
      });
    }
  };

  const stats = [
    { label: "Resumes created", value: resumes.length.toString(), sub: "Total saved", color: "text-emerald-400" },
    { label: "Best ATS score", value: "82", sub: "Mock score", color: "text-accent-light" },
    { label: "Jobs matched", value: "5", sub: "This month", color: "text-amber-400" },
    { label: "Downloads", value: "12", sub: "PDF exports", color: "text-sky-400" },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#070b14] to-[#0a1628]">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Ambient Radial Glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[20%] left-[-5%] w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-[30%] left-[40%] w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Main Content Wrapper */}
      <div className="relative z-10 p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, {userName}</p>
        </div>
        <button
          onClick={() => setShowTemplateModal(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-accent-violet text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 hover:-translate-y-0.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New resume
        </button>
      </div>

      {/* AI Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-accent/20 via-accent-violet/10 to-transparent border border-accent/20 p-6 mb-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white mb-1">
              Paste a job description, get a tailored resume
            </h2>
            <p className="text-sm text-slate-400 max-w-lg">
              AI picks the best sections, rewrites bullets, and scores your ATS match instantly.
            </p>
          </div>
          <Link
            to="/job-match"
            className="flex-shrink-0 ml-6 px-5 py-2.5 bg-white/[0.08] hover:bg-white/[0.12] border border-white/[0.1] text-white rounded-xl text-sm font-medium transition-all duration-200 backdrop-blur-sm"
          >
            Try AI tailoring →
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-4 mb-10">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="glass-card p-5 hover:-translate-y-0.5 transition-all duration-300 hover:border-white/[0.12]"
          >
            <p className="text-xs text-slate-500 font-medium mb-2">{stat.label}</p>
            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
            <p className={`text-xs font-medium ${stat.color}`}>{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* My Resumes */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-white">My resumes</h2>
        <Link to="/resumes" className="text-sm text-accent-light hover:text-white transition-colors">
          See all →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Resume Cards */}
        {resumes.map((resume) => (
          <Link
            key={resume.id}
            to={`/builder/${resume.id}`}
            className="glass-card p-5 hover:-translate-y-1 transition-all duration-300 hover:border-white/[0.12] group cursor-pointer relative"
          >
            {/* Delete Resume Button */}
            <button
              onClick={(e) => handleDelete(e, resume.id)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/25 z-20"
              title="Delete Resume"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            {/* Preview Thumbnail */}
            <div className="w-full h-36 rounded-lg bg-white/[0.04] border border-white/[0.06] mb-4 flex items-center justify-center overflow-hidden group-hover:border-accent/30 transition-colors">
              <div className="w-16 text-center space-y-1.5">
                <div className="h-1.5 bg-accent/30 rounded-full w-full" />
                <div className="h-1 bg-white/10 rounded-full w-full" />
                <div className="h-1 bg-white/10 rounded-full w-3/4" />
                <div className="h-1 bg-white/10 rounded-full w-full mt-2" />
                <div className="h-1 bg-white/10 rounded-full w-5/6" />
              </div>
            </div>

            <h3 className="font-semibold text-white text-sm mb-1">{resume.name || "Untitled Resume"}</h3>
            <p className="text-xs text-slate-500">
              Modern template · Edited {new Date(resume.lastEdited).toLocaleDateString()}
            </p>

            <AtsBar score={resume.atsScore || 82} />
          </Link>
        ))}

        {/* Create New Card */}
        <button
          onClick={() => setShowTemplateModal(true)}
          className="glass-card p-5 border-dashed border-white/[0.08] hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] group cursor-pointer text-center w-full"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] group-hover:bg-accent/10 flex items-center justify-center mb-3 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-slate-500 group-hover:text-accent-light transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors font-medium">
            Create new resume
          </span>
        </button>
      </div>

      {/* My Cover Letters Section */}
      <div className="flex items-center justify-between mt-12 mb-5">
        <h2 className="text-lg font-semibold text-white">My cover letters</h2>
        <Link to="/cover-letter" className="text-sm text-accent-light hover:text-white transition-colors">
          Create Letter →
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Cover Letter Cards */}
        {coverLetters.map((cl) => (
          <Link
            key={cl.id}
            to={`/cover-letter?id=${cl.id}`}
            className="glass-card p-5 hover:-translate-y-1 transition-all duration-300 hover:border-white/[0.12] group cursor-pointer relative"
          >
            {/* Delete Cover Letter Button */}
            <button
              onClick={(e) => handleDeleteCoverLetter(e, cl.id)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/25 z-20"
              title="Delete Cover Letter"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            {/* Preview Thumbnail */}
            <div className="w-full h-36 rounded-lg bg-white/[0.04] border border-white/[0.06] mb-4 flex flex-col justify-between p-4 group-hover:border-accent/30 transition-colors overflow-hidden relative">
              <span className="text-[9px] uppercase font-extrabold tracking-wider text-accent-light px-2 py-0.5 rounded-md bg-accent/10 border border-accent/20 w-fit">
                {cl.tone || "Professional"}
              </span>
              <p className="text-[11px] text-slate-400 italic line-clamp-3 leading-relaxed mt-2 select-none">
                {cl.content ? cl.content.slice(0, 150) + "..." : "Drafting in progress..."}
              </p>
            </div>

            <h3 className="font-semibold text-white text-sm mb-1 truncate">{cl.name || "Untitled Letter"}</h3>
            <p className="text-xs text-slate-500">
              {cl.companyName || "No Company"} · Edited {new Date(cl.lastEdited).toLocaleDateString()}
            </p>
          </Link>
        ))}

        {/* Create New Card */}
        <Link
          to="/cover-letter"
          className="glass-card p-5 border-dashed border-white/[0.08] hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] group cursor-pointer text-center w-full"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] group-hover:bg-accent/10 flex items-center justify-center mb-3 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-slate-500 group-hover:text-accent-light transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors font-medium">
            Create new cover letter
          </span>
        </Link>
      </div>
      </div>

      {/* Template Picker Modal */}
      {showTemplateModal && (
        <TemplatePickerModal
          onClose={() => setShowTemplateModal(false)}
          onSelect={(templateId) => {
            setShowTemplateModal(false);
            navigate(`/builder/new?template=${templateId}`);
          }}
        />
      )}
    </div>
  );
}

export default Dashboard;

import { Link } from "react-router-dom";

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

import { useState, useEffect } from "react";

/* ── Dashboard Page ── */
function Dashboard() {
  const [resumes, setResumes] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedResumes");
    if (saved) {
      setResumes(JSON.parse(saved));
    }
  }, []);

  const stats = [
    { label: "Resumes created", value: resumes.length.toString(), sub: "Total saved", color: "text-emerald-400" },
    { label: "Best ATS score", value: "82", sub: "Mock score", color: "text-accent-light" },
    { label: "Jobs matched", value: "5", sub: "This month", color: "text-amber-400" },
    { label: "Downloads", value: "12", sub: "PDF exports", color: "text-sky-400" },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-slate-400 text-sm mt-1">Welcome back, Sri Aarush</p>
        </div>
        <Link
          to="/builder/new"
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-accent to-accent-violet text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all duration-300 hover:-translate-y-0.5"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          New resume
        </Link>
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
            className="glass-card p-5 hover:-translate-y-1 transition-all duration-300 hover:border-white/[0.12] group cursor-pointer"
          >
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
              Modern template · Edited {new Date(resume.lastEdited || Date.now()).toLocaleDateString()}
            </p>

            <AtsBar score={resume.atsScore || 82} />
          </Link>
        ))}

        {/* Create New Card */}
        <Link
          to="/builder/new"
          className="glass-card p-5 border-dashed border-white/[0.08] hover:border-accent/30 hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center min-h-[260px] group cursor-pointer"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/[0.04] group-hover:bg-accent/10 flex items-center justify-center mb-3 transition-colors">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-slate-500 group-hover:text-accent-light transition-colors">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </div>
          <span className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors font-medium">
            Create new resume
          </span>
        </Link>
      </div>
    </div>
  );
}

export default Dashboard;

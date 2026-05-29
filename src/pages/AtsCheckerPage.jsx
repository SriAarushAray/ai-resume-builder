import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { calculateAtsScore, getAtsSuggestions } from "../utils/atsScorer";

function AtsCheckerPage() {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "anonymous";
  const resumesKey = `savedResumes_${userEmail}`;

  const [resumes] = useState(() => {
    try {
      const keys = Object.keys(localStorage);
      const resumeMap = {};
      keys.forEach((k) => {
        if (k === "savedResumes" || k.startsWith("savedResumes_")) {
          const list = JSON.parse(localStorage.getItem(k) || "[]");
          if (Array.isArray(list)) {
            list.forEach((r) => {
              if (r && r.id) {
                const existing = resumeMap[r.id];
                if (!existing || (r.lastEdited || 0) > (existing.lastEdited || 0)) {
                  resumeMap[r.id] = r;
                }
              }
            });
          }
        }
      });
      return Object.values(resumeMap).sort((a, b) => (b.lastEdited || 0) - (a.lastEdited || 0));
    } catch {
      return [];
    }
  });

  const [selectedId, setSelectedId] = useState(() => resumes[0]?.id || null);

  const selectedResume = useMemo(
    () => resumes.find((r) => r.id === selectedId) || null,
    [resumes, selectedId]
  );

  const score = useMemo(
    () => (selectedResume?.data ? calculateAtsScore(selectedResume.data) : null),
    [selectedResume]
  );

  const suggestions = useMemo(
    () => (selectedResume?.data ? getAtsSuggestions(selectedResume.data) : []),
    [selectedResume]
  );

  const scoreColor =
    score === null
      ? "text-slate-400"
      : score >= 80
      ? "text-emerald-400"
      : score >= 60
      ? "text-amber-400"
      : "text-rose-400";

  const ringColor =
    score === null
      ? "text-slate-600"
      : score >= 80
      ? "text-emerald-500"
      : score >= 60
      ? "text-amber-500"
      : "text-rose-500";

  const scoreBg =
    score === null
      ? "from-slate-800/40 to-slate-700/20"
      : score >= 80
      ? "from-emerald-900/30 to-emerald-800/10"
      : score >= 60
      ? "from-amber-900/30 to-amber-800/10"
      : "from-rose-900/30 to-rose-800/10";

  const scoreLabel =
    score === null
      ? "No Resume Selected"
      : score >= 80
      ? "Excellent – ATS Ready 🎉"
      : score >= 60
      ? "Good – Minor Gaps Found ⚡"
      : "Needs Work – Low Match ⚠️";

  const highImpact = suggestions.filter((s) => s.impact === "High");
  const mediumImpact = suggestions.filter((s) => s.impact === "Medium");
  const lowImpact = suggestions.filter((s) => s.impact === "Low");

  const circumference = 2 * Math.PI * 40;
  const dashOffset = score !== null ? circumference - (score / 100) * circumference : circumference;

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#070b14] to-[#0a1628]">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />

      {/* Ambient glows */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/8 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-5%] w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 p-8 max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-white">ATS Checker</h1>
          </div>
          <p className="text-slate-400 text-sm max-w-lg">
            Analyze any of your saved resumes against our heuristic ATS engine. See your score, understand weaknesses, and jump straight to fixing them.
          </p>
        </div>

        {resumes.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mb-6">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-slate-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-300 mb-2">No resumes yet</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs">
              Build your first resume to check its ATS compatibility score and get improvement tips.
            </p>
            <Link
              to="/dashboard"
              className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all"
            >
              Create a Resume →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-[280px_1fr] gap-6 items-start">
            {/* LEFT — Resume Picker */}
            <div className="flex flex-col gap-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-1">Select Resume</h2>
              {resumes.map((r) => {
                const rScore = r.data ? calculateAtsScore(r.data) : r.atsScore || null;
                const rColor =
                  rScore === null ? "text-slate-500" :
                  rScore >= 80 ? "text-emerald-400" :
                  rScore >= 60 ? "text-amber-400" :
                  "text-rose-400";

                return (
                  <button
                    key={r.id}
                    onClick={() => setSelectedId(r.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-2xl border transition-all duration-200 ${
                      selectedId === r.id
                        ? "bg-white/[0.08] border-white/[0.15] shadow-lg"
                        : "bg-white/[0.03] border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.10]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{r.name || "Untitled Resume"}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Edited {r.lastEdited ? new Date(r.lastEdited).toLocaleDateString() : "–"}
                        </p>
                      </div>
                      <span className={`text-sm font-extrabold shrink-0 ${rColor}`}>
                        {rScore !== null ? `${rScore}` : "–"}
                      </span>
                    </div>

                    {/* Score mini-bar */}
                    <div className="mt-2.5 h-1 bg-white/[0.06] rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${
                          rScore >= 80 ? "bg-emerald-500" : rScore >= 60 ? "bg-amber-500" : "bg-rose-500"
                        }`}
                        style={{ width: `${rScore || 0}%` }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* RIGHT — Analysis Panel */}
            <div className="flex flex-col gap-5">
              {selectedResume ? (
                <>
                  {/* Score Gauge Card */}
                  <div className={`rounded-3xl border border-white/[0.08] bg-gradient-to-br ${scoreBg} p-6`}>
                    <div className="flex items-center gap-8">
                      {/* Circular gauge */}
                      <div className="relative w-36 h-36 shrink-0">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                          <circle
                            cx="50" cy="50" r="40"
                            fill="transparent"
                            stroke="rgba(255,255,255,0.06)"
                            strokeWidth="8"
                          />
                          <circle
                            cx="50" cy="50" r="40"
                            fill="transparent"
                            className={`${ringColor} transition-all duration-1000 ease-out`}
                            stroke="currentColor"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={circumference}
                            strokeDashoffset={dashOffset}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className={`text-4xl font-black ${scoreColor}`}>{score ?? "–"}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">/ 100</span>
                        </div>
                      </div>

                      {/* Score summary text */}
                      <div className="flex-1">
                        <h3 className={`text-xl font-bold mb-1 ${scoreColor}`}>{scoreLabel}</h3>
                        <p className="text-sm text-slate-400 leading-relaxed mb-4">
                          {score >= 80
                            ? "Your resume is well-optimized for ATS. Strong use of keywords, metrics, and structure. Keep it up!"
                            : score >= 60
                            ? "Good base! A few targeted improvements below will push your score into the 'Excellent' range."
                            : "Your resume needs attention. Resolve the high-impact issues in the checklist below to significantly boost your score."}
                        </p>
                        <Link
                          to={`/builder/${selectedResume.id}`}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.08] hover:bg-white/[0.13] border border-white/[0.1] rounded-xl text-sm font-semibold text-white transition-all hover:-translate-y-0.5"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                          </svg>
                          Edit Resume to Improve
                        </Link>
                      </div>
                    </div>

                    {/* Score breakdown bar */}
                    <div className="mt-5 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-3 text-center">
                      {[
                        { label: "Section Completeness", max: 40, hint: "Personal, skills, education, experience, projects" },
                        { label: "Content Quality", max: 40, hint: "Action verbs, word count, quantitative metrics" },
                        { label: "Format & Socials", max: 20, hint: "Font size, spacing, LinkedIn, GitHub/Portfolio" },
                      ].map((cat) => (
                        <div key={cat.label} className="bg-white/[0.03] rounded-xl p-3 border border-white/[0.06]">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{cat.label}</p>
                          <p className="text-[11px] text-slate-500 leading-snug">{cat.hint}</p>
                          <p className="text-xs font-semibold text-slate-300 mt-1.5">Max {cat.max} pts</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Suggestions Checklist */}
                  {suggestions.length === 0 ? (
                    <div className="rounded-3xl border border-emerald-500/20 bg-emerald-900/10 p-6 flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-emerald-400">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="font-bold text-emerald-300 text-sm mb-0.5">All checks passed!</h3>
                        <p className="text-sm text-emerald-500/70">Zero critical gaps found. Your resume is fully ATS optimized.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-white/[0.08] bg-white/[0.02] p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-bold text-white">
                          Optimization Checklist
                          <span className="ml-2 text-[11px] font-semibold text-slate-400 normal-case">({suggestions.length} issues)</span>
                        </h3>
                        <div className="flex items-center gap-2 text-[11px] font-semibold">
                          {highImpact.length > 0 && <span className="px-2 py-0.5 bg-rose-500/15 text-rose-400 border border-rose-500/20 rounded-full">{highImpact.length} High</span>}
                          {mediumImpact.length > 0 && <span className="px-2 py-0.5 bg-amber-500/15 text-amber-400 border border-amber-500/20 rounded-full">{mediumImpact.length} Medium</span>}
                          {lowImpact.length > 0 && <span className="px-2 py-0.5 bg-blue-500/15 text-blue-400 border border-blue-500/20 rounded-full">{lowImpact.length} Low</span>}
                        </div>
                      </div>

                      {/* Group by impact */}
                      {[
                        { label: "High Impact", items: highImpact, color: "bg-rose-500/10 border-rose-500/20 text-rose-400", dot: "bg-rose-500" },
                        { label: "Medium Impact", items: mediumImpact, color: "bg-amber-500/10 border-amber-500/20 text-amber-400", dot: "bg-amber-500" },
                        { label: "Low Impact", items: lowImpact, color: "bg-blue-500/10 border-blue-500/20 text-blue-400", dot: "bg-blue-500" },
                      ].map((group) =>
                        group.items.length > 0 ? (
                          <div key={group.label} className="mb-4 last:mb-0">
                            <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-600 mb-2">{group.label}</p>
                            <div className="space-y-2">
                              {group.items.map((s) => (
                                <div
                                  key={s.id}
                                  className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] hover:border-white/[0.10] transition-all"
                                >
                                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${group.dot}`} />
                                  <p className="text-sm text-slate-300 leading-relaxed flex-1">{s.text}</p>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wide ${group.color}`}>
                                    {s.type}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null
                      )}

                      <Link
                        to={`/builder/${selectedResume.id}`}
                        className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-indigo-500/20 hover:-translate-y-0.5 transition-all"
                      >
                        Fix Issues in Builder →
                      </Link>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-64 text-slate-600 text-sm">
                  Select a resume from the left to see its ATS analysis.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AtsCheckerPage;

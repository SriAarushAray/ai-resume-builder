import React, { useState, useRef, useEffect } from "react";
import MonthYearPicker from "./MonthYearPicker";

const parseDuration = (duration) => {
  if (!duration) return { from: "", to: "" };
  const parts = duration.split(" - ");
  return { from: parts[0]?.trim() || "", to: parts[1]?.trim() || "" };
};

const TECH_SUGGESTIONS = [
  "React", "Next.js", "Vue.js", "Angular", "Svelte", "Node.js", "Express.js",
  "Django", "Flask", "Spring Boot", "FastAPI", "Ruby on Rails", "Laravel",
  "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Firebase", "Supabase",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git", "GitHub",
  "TypeScript", "JavaScript", "Python", "Java", "C++", "C#", "C", "Go", "Rust",
  "Swift", "Kotlin", "PHP", "Ruby", "Dart", "R", "MATLAB",
  "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Sass", "Material UI",
  "Redux", "Zustand", "GraphQL", "REST API", "Socket.io", "WebSocket",
  "TensorFlow", "PyTorch", "OpenCV", "Pandas", "NumPy", "Scikit-learn",
  "Figma", "Vercel", "Netlify", "Heroku", "Linux", "Nginx",
  "JWT", "OAuth", "Stripe", "Razorpay", "Twilio", "SendGrid",
  "Vite", "Webpack", "Babel", "Jest", "Cypress", "Playwright",
  "Flutter", "React Native", "Electron", "Tauri",
  "Prisma", "Mongoose", "Sequelize", "Drizzle",
  "OpenAI API", "LangChain", "Hugging Face",
];

function TechInput({ value, onChange }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getFiltered = () => {
    const parts = value.split(",").map((s) => s.trim());
    const current = parts[parts.length - 1].toLowerCase();
    if (!current) return [];
    const existing = parts.slice(0, -1).map((s) => s.trim().toLowerCase());
    return TECH_SUGGESTIONS.filter(
      (t) => t.toLowerCase().startsWith(current) && !existing.includes(t.toLowerCase())
    ).slice(0, 6);
  };

  const handleSelect = (tech) => {
    const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
    parts[parts.length - 1] = tech;
    onChange(parts.join(", ") + ", ");
    setShowSuggestions(false);
  };

  const filtered = showSuggestions ? getFiltered() : [];

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        placeholder="Technologies Used (type to search)"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        className="w-full border p-2 mb-2 rounded"
      />
      {filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {filtered.map((tech) => (
            <div
              key={tech}
              onClick={() => handleSelect(tech)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {tech}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Projects({ resumeData, setResumeData }) {
  const projects = resumeData.projects || [];

  // Per-card AI states
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [errorIndex, setErrorIndex] = useState(null);
  const [previewBullets, setPreviewBullets] = useState(null); // { index, bullets[] }

  // Add new empty project
  const handleAddProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...projects,
        { title: "", technologies: "", duration: "", description: "", points: [] },
      ],
    });
  };

  // Update project while typing
  const updateProject = (index, field, value) => {
    setResumeData((prev) => {
      const updatedProjects = [...(prev.projects || [])];
      updatedProjects[index] = {
        ...updatedProjects[index],
        [field]: value,
      };
      return { ...prev, projects: updatedProjects };
    });
  };

  const handleRewriteBullets = async (index) => {
    const project = projects[index];
    if (!project.title) {
      setErrorIndex(index);
      setTimeout(() => setErrorIndex(null), 3000);
      return;
    }
    setPreviewBullets(null);
    setLoadingIndex(index);
    setErrorIndex(null);
    try {
      const response = await fetch("/api/ai/rewrite-bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: project.title,
          company: project.technologies || "Personal Project",
          description: project.description || "",
        }),
      });
      const data = await response.json();
      if (data.bullets && data.bullets.length > 0) {
        setPreviewBullets({ index, bullets: data.bullets });
      } else {
        setErrorIndex(index);
        setTimeout(() => setErrorIndex(null), 4000);
      }
    } catch {
      setErrorIndex(index);
      setTimeout(() => setErrorIndex(null), 4000);
    } finally {
      setLoadingIndex(null);
    }
  };

  const applyBullets = (index) => {
    if (!previewBullets) return;
    updateProject(index, "points", previewBullets.bullets);
    setPreviewBullets(null);
  };

  const cancelPreview = () => setPreviewBullets(null);

  const addProjectPoint = (projectIndex) => {
    setResumeData((prev) => {
      const updatedProjects = [...(prev.projects || [])];
      const currentPoints = Array.isArray(updatedProjects[projectIndex]?.points)
        ? updatedProjects[projectIndex].points
        : [];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        points: [...currentPoints, ""],
      };
      return { ...prev, projects: updatedProjects };
    });
  };

  const updateProjectPoint = (projectIndex, pointIndex, value) => {
    setResumeData((prev) => {
      const updatedProjects = [...(prev.projects || [])];
      const currentPoints = Array.isArray(updatedProjects[projectIndex]?.points)
        ? [...updatedProjects[projectIndex].points]
        : [];
      currentPoints[pointIndex] = value;
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        points: currentPoints,
      };
      return { ...prev, projects: updatedProjects };
    });
  };

  const removeProjectPoint = (projectIndex, pointIndexToRemove) => {
    setResumeData((prev) => {
      const updatedProjects = [...(prev.projects || [])];
      const currentPoints = Array.isArray(updatedProjects[projectIndex]?.points)
        ? updatedProjects[projectIndex].points
        : [];
      updatedProjects[projectIndex] = {
        ...updatedProjects[projectIndex],
        points: currentPoints.filter((_, pointIndex) => pointIndex !== pointIndexToRemove),
      };
      return { ...prev, projects: updatedProjects };
    });
  };

  // Remove project
  const handleRemoveProject = (indexToRemove) => {
    setResumeData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter(
        (_, index) => index !== indexToRemove,
      ),
    }));
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-left">Projects</h3>

      {/* Project Blocks */}
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="border p-3 mb-3 rounded">
            <input
              type="text"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) => updateProject(index, "title", e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />

            {/* Duration — Month/Year Pickers */}
            {(() => {
              const { from, to } = parseDuration(project.duration);
              const isPresent = to === "Present";
              return (
                <div className="flex items-end gap-2 mb-2">
                  <div className="flex-1 text-left">
                    <label className="text-xs text-gray-500 mb-1 block">From</label>
                    <MonthYearPicker
                      value={from}
                      onChange={(v) => updateProject(index, "duration", `${v} - ${isPresent ? "Present" : to}`)}
                      placeholder="Start date"
                    />
                  </div>
                  <span className="pb-3 text-gray-400">—</span>
                  <div className="flex-1 text-left">
                    <label className="text-xs text-gray-500 mb-1 block">To</label>
                    <MonthYearPicker
                      value={isPresent ? "" : to}
                      onChange={(v) => updateProject(index, "duration", `${from} - ${v}`)}
                      placeholder={isPresent ? "Present" : "End date"}
                    />
                  </div>
                  <label className="pb-2 flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={isPresent}
                      onChange={(e) =>
                        updateProject(index, "duration", `${from} - ${e.target.checked ? "Present" : ""}`)
                      }
                      className="rounded"
                    />
                    Present
                  </label>
                </div>
              );
            })()}

            {/* Tech Input with Autocomplete */}
            <TechInput
              value={project.technologies}
              onChange={(v) => updateProject(index, "technologies", v)}
            />

            {/* Project description textarea */}
            <textarea
              placeholder="Description / notes (optional — used as extra context for AI)"
              value={project.description || ""}
              onChange={(e) => updateProject(index, "description", e.target.value)}
              className="w-full border p-2 mb-2 rounded text-sm text-left focus:outline-none focus:ring-1 focus:ring-blue-500"
              rows={2}
            />

            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-gray-700">
                  Project Points {Array.isArray(project.points) && project.points.length > 0 && <span className="ml-1 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-bold">AI Applied</span>}
                </label>
              </div>

              <div className="space-y-2">
                {(project.points || []).map((point, pointIndex) => (
                  <div key={pointIndex} className="flex gap-2">
                    <input
                      type="text"
                      placeholder={`Point ${pointIndex + 1}`}
                      value={point}
                      onChange={(e) => updateProjectPoint(index, pointIndex, e.target.value)}
                      className="w-full border p-2 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => removeProjectPoint(index, pointIndex)}
                      className="text-red-500 hover:text-red-700 text-xs px-2"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-4 mt-2">
                <button
                  type="button"
                  onClick={() => addProjectPoint(index)}
                  className="text-blue-600 text-xs font-semibold hover:underline"
                >
                  + Add Point
                </button>
                {Array.isArray(project.points) && project.points.length > 0 && (
                  <button
                    type="button"
                    onClick={() => updateProject(index, "points", [])}
                    className="text-red-500 text-xs font-semibold hover:underline"
                  >
                    Clear All Points
                  </button>
                )}
              </div>
            </div>

            {/* ✨ Rewrite Bullets Button */}
            <button
              type="button"
              onClick={() => handleRewriteBullets(index)}
              disabled={loadingIndex === index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                background: loadingIndex === index
                  ? "linear-gradient(135deg, #9333ea55, #7c3aed55)"
                  : "linear-gradient(135deg, #9333ea, #7c3aed)",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                cursor: loadingIndex === index ? "not-allowed" : "pointer",
                fontSize: "13px",
                fontWeight: 600,
                marginBottom: "6px",
                transition: "all 0.2s ease",
                boxShadow: loadingIndex === index ? "none" : "0 2px 8px rgba(124,58,237,0.35)",
              }}
              onMouseEnter={(e) => { if (loadingIndex !== index) e.currentTarget.style.transform = "translateY(-1px)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
            >
              {loadingIndex === index ? (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: "spin 1s linear infinite" }}>
                    <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                  </svg>
                  Generating bullets…
                </>
              ) : (
                <>
                  <span>✨</span>
                  Rewrite Bullets with AI
                </>
              )}
            </button>

            {/* Error message */}
            {errorIndex === index && (
              <p style={{ fontSize: "12px", color: "#dc2626", marginBottom: "6px", textAlign: "left" }}>
                {!project.title
                  ? "Please fill in the Project Title before using AI."
                  : "AI generation failed. Please try again."}
              </p>
            )}

            {/* AI Preview */}
            {previewBullets?.index === index && (
              <div style={{
                background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                border: "1px solid #c084fc",
                borderRadius: "12px",
                padding: "14px",
                marginBottom: "8px",
                textAlign: "left",
                animation: "fadeInUp 0.3s ease"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px" }}>
                  <span style={{ fontSize: "14px" }}>✨</span>
                  <span style={{ fontWeight: 700, fontSize: "13px", color: "#7c3aed" }}>AI Suggested Bullet Points</span>
                </div>
                <ul style={{ margin: "0 0 12px 0", paddingLeft: "18px", listStyle: "disc" }}>
                  {previewBullets.bullets.map((bullet, bi) => (
                    <li key={bi} style={{ fontSize: "13px", color: "#4c1d95", marginBottom: "6px", lineHeight: "1.5" }}>{bullet}</li>
                  ))}
                </ul>
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="button"
                    onClick={() => applyBullets(index)}
                    style={{
                      padding: "7px 16px",
                      background: "linear-gradient(135deg, #9333ea, #7c3aed)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "7px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: "pointer",
                      boxShadow: "0 2px 6px rgba(124,58,237,0.4)",
                    }}
                  >
                    ✅ Apply Bullets
                  </button>
                  <button
                    type="button"
                    onClick={cancelPreview}
                    style={{
                      padding: "7px 14px",
                      background: "#f3f4f6",
                      color: "#374151",
                      border: "1px solid #d1d5db",
                      borderRadius: "7px",
                      fontSize: "12px",
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={() => handleRemoveProject(index)}
              className="text-red-500 hover:text-red-700 text-sm mt-2 block"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="mt-4">
        <button
          onClick={handleAddProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Project
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

export default Projects;

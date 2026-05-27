import { useState } from "react";
import MonthYearPicker from "./MonthYearPicker";

const parseDuration = (duration) => {
  if (!duration) return { from: "", to: "" };
  const parts = duration.split(" - ");
  return { from: parts[0]?.trim() || "", to: parts[1]?.trim() || "" };
};

function Experience({ resumeData, setResumeData }) {
  const experiences = resumeData.experiences || [];

  // Per-card AI states
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [errorIndex, setErrorIndex] = useState(null);
  const [previewBullets, setPreviewBullets] = useState(null); // { index, bullets[] }

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experiences: [
        ...(prev.experiences || []),
        { company: "", role: "", duration: "", description: "", points: [] },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    setResumeData((prev) => {
      const updated = [...(prev.experiences || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, experiences: updated };
    });
  };

  const removeExperience = (indexToRemove) => {
    setResumeData((prev) => ({
      ...prev,
      experiences: (prev.experiences || []).filter((_, index) => index !== indexToRemove),
    }));
    if (previewBullets?.index === indexToRemove) setPreviewBullets(null);
  };

  const handleRewriteBullets = async (index) => {
    const exp = experiences[index];
    if (!exp.role && !exp.company) {
      setErrorIndex(index);
      setTimeout(() => setErrorIndex(null), 3000);
      return;
    }
    // Dismiss any existing preview for another card
    setPreviewBullets(null);
    setLoadingIndex(index);
    setErrorIndex(null);
    try {
      const response = await fetch("/api/ai/rewrite-bullets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: exp.role,
          company: exp.company,
          description: exp.description || "",
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
    updateExperience(index, "points", previewBullets.bullets);
    setPreviewBullets(null);
  };

  const cancelPreview = () => setPreviewBullets(null);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-left">Experience</h3>

      <div className="space-y-4">
        {experiences.map((experience, index) => {
          const { from, to } = parseDuration(experience.duration);
          const isPresent = to === "Present";
          const isLoading = loadingIndex === index;
          const hasError = errorIndex === index;
          const hasPreview = previewBullets?.index === index;

          return (
            <div key={index} className="border p-3 rounded">
              <input
                type="text"
                placeholder="Company"
                value={experience.company}
                onChange={(e) => updateExperience(index, "company", e.target.value)}
                className="w-full border p-2 mb-2 rounded"
              />

              <input
                type="text"
                placeholder="Role"
                value={experience.role}
                onChange={(e) => updateExperience(index, "role", e.target.value)}
                className="w-full border p-2 mb-2 rounded"
              />

              {/* Duration — Month/Year Pickers */}
              <div className="flex items-end gap-2 mb-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">From</label>
                  <MonthYearPicker
                    value={from}
                    onChange={(v) => updateExperience(index, "duration", `${v} - ${isPresent ? "Present" : to}`)}
                    placeholder="Start date"
                  />
                </div>
                <span className="pb-3 text-gray-400">—</span>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 mb-1 block">To</label>
                  <MonthYearPicker
                    value={isPresent ? "" : to}
                    onChange={(v) => updateExperience(index, "duration", `${from} - ${v}`)}
                    placeholder={isPresent ? "Present" : "End date"}
                  />
                </div>
                <label className="pb-2 flex items-center gap-1.5 text-xs text-gray-500 whitespace-nowrap cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isPresent}
                    onChange={(e) =>
                      updateExperience(index, "duration", `${from} - ${e.target.checked ? "Present" : ""}`)
                    }
                    className="rounded"
                  />
                  Present
                </label>
              </div>

              <textarea
                placeholder="Description / notes (optional — used as extra context for AI)"
                value={experience.description}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
                className="w-full border p-2 mb-2 rounded text-sm"
                rows={2}
              />

              {/* AI Bullet Points (applied) */}
              {Array.isArray(experience.points) && experience.points.length > 0 && (
                <div style={{ marginBottom: "10px", background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)", border: "1px solid #86efac", borderRadius: "10px", padding: "12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px" }}>✅</span>
                    <span style={{ fontWeight: 600, fontSize: "12px", color: "#15803d" }}>AI Bullet Points Applied</span>
                    <button
                      onClick={() => updateExperience(index, "points", [])}
                      style={{ marginLeft: "auto", fontSize: "11px", color: "#dc2626", background: "none", border: "none", cursor: "pointer", padding: "2px 6px", borderRadius: "4px" }}
                    >
                      Clear
                    </button>
                  </div>
                  <ul style={{ margin: 0, paddingLeft: "18px", listStyle: "disc" }}>
                    {experience.points.map((pt, pi) => (
                      <li key={pi} style={{ fontSize: "13px", color: "#166534", marginBottom: "4px" }}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* ✨ Rewrite Bullets Button */}
              <button
                onClick={() => handleRewriteBullets(index)}
                disabled={isLoading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 16px",
                  background: isLoading
                    ? "linear-gradient(135deg, #9333ea55, #7c3aed55)"
                    : "linear-gradient(135deg, #9333ea, #7c3aed)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  cursor: isLoading ? "not-allowed" : "pointer",
                  fontSize: "13px",
                  fontWeight: 600,
                  marginBottom: "6px",
                  transition: "all 0.2s ease",
                  boxShadow: isLoading ? "none" : "0 2px 8px rgba(124,58,237,0.35)",
                }}
                onMouseEnter={(e) => { if (!isLoading) e.currentTarget.style.transform = "translateY(-1px)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}
              >
                {isLoading ? (
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
              {hasError && (
                <p style={{ fontSize: "12px", color: "#dc2626", marginBottom: "6px" }}>
                  {!experience.role && !experience.company
                    ? "Please fill in at least the Role or Company before using AI."
                    : "AI generation failed. Please try again."}
                </p>
              )}

              {/* AI Preview */}
              {hasPreview && (
                <div style={{
                  background: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)",
                  border: "1px solid #c084fc",
                  borderRadius: "12px",
                  padding: "14px",
                  marginBottom: "8px",
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
                onClick={() => removeExperience(index)}
                className="text-red-500 hover:text-red-700 text-sm mt-1"
              >
                Remove
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-4">
        <button
          onClick={addExperience}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Experience
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}


export default Experience;


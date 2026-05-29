import { useState } from "react";

function Skills({ resumeData, setResumeData }) {
  const [skillInput, setSkillInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const skillSuggestions = [
    "React",
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "Machine Learning",
    "Node.js",
    "SQL",
    "HTML",
    "CSS",
    "Git",
    "Docker",
    "PostgreSQL",
    "MongoDB",
    "Tailwind CSS",
    "TypeScript"
  ];

  // Filter suggestions
  const filteredSuggestions = skillSuggestions.filter(
    (suggestion) =>
      suggestion.toLowerCase().startsWith(skillInput.toLowerCase()) &&
      !resumeData.skills.includes(suggestion) &&
      skillInput !== ""
  );

  const handleAddSkill = (e) => {
    if (e.key === "Enter" && skillInput.trim() !== "") {
      e.preventDefault();
      const newSkill = skillInput.trim();
      setResumeData(prev => {
        const currentSkills = prev.skills || [];
        if (!currentSkills.includes(newSkill)) {
          return {
            ...prev,
            skills: [...currentSkills, newSkill]
          };
        }
        return prev;
      });
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (indexToRemove) => {
    setResumeData(prev => ({
      ...prev,
      skills: (prev.skills || []).filter((_, index) => index !== indexToRemove)
    }));
  };

  const handleSuggestionClick = (suggestion) => {
    setResumeData(prev => {
      const currentSkills = prev.skills || [];
      if (!currentSkills.includes(suggestion)) {
        return {
          ...prev,
          skills: [...currentSkills, suggestion]
        };
      }
      return prev;
    });
    setSkillInput("");
  };

  const handleAutoGroup = async () => {
    if (resumeData.skills.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/ai/group-skills", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ skills: resumeData.skills }),
      });
      if (response.ok) {
        const data = await response.json();
        setResumeData(prev => ({
          ...prev,
          groupedSkills: data.grouped || [],
          suggestedSkills: data.suggested || [],
          showGroupedSkills: true, // Auto-enable the toggle on success
        }));
      } else {
        setError("Failed to group skills. Please check if the backend is running.");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed. Make sure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSuggestedSkill = (skill) => {
    setResumeData(prev => {
      const currentSkills = prev.skills || [];
      if (!currentSkills.includes(skill)) {
        const updatedSkills = [...currentSkills, skill];
        const updatedSuggested = (prev.suggestedSkills || []).filter(s => s !== skill);
        return {
          ...prev,
          skills: updatedSkills,
          suggestedSkills: updatedSuggested
        };
      }
      return prev;
    });
  };

  const toggleGroupedView = (e) => {
    const isChecked = e.target.checked;
    setResumeData(prev => ({
      ...prev,
      showGroupedSkills: isChecked,
    }));
  };

  return (
    <>
      <h3 className="text-xl font-semibold mt-8 mb-4 text-left">
        Skills
      </h3>

      {/* Added Skills */}
      <div className="flex flex-wrap gap-3 mb-4">
        {resumeData.skills.map((skill, index) => (
          <div
            key={index}
            className="bg-blue-50 border border-blue-200 text-blue-800 px-3 py-1.5 rounded-lg flex items-center text-xs font-semibold shadow-sm gap-2"
          >
            <span>{skill}</span>
            <select
              value={resumeData.skillLevels?.[skill] || "Intermediate"}
              onChange={(e) => {
                const val = e.target.value;
                setResumeData(prev => ({
                  ...prev,
                  skillLevels: {
                    ...(prev.skillLevels || {}),
                    [skill]: val
                  }
                }));
              }}
              className="bg-blue-100 hover:bg-blue-200/80 text-blue-900 text-[10px] font-bold py-0.5 px-1.5 rounded border-none focus:outline-none cursor-pointer transition-colors"
            >
              <option value="Beginner">Beg</option>
              <option value="Intermediate">Int</option>
              <option value="Advanced">Adv</option>
              <option value="Expert">Exp</option>
            </select>
            <button
              onClick={() => handleRemoveSkill(index)}
              className="text-red-400 hover:text-red-650 font-black text-sm leading-none focus:outline-none"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      {/* Input */}
      <input
        type="text"
        value={skillInput}
        onChange={(e) => setSkillInput(e.target.value)}
        onKeyDown={handleAddSkill}
        placeholder="Enter your skills and press Enter"
        className="w-full p-3 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
      />

      {/* Suggestions */}
      {filteredSuggestions.length > 0 && (
        <div className="border border-gray-200 rounded mb-4 bg-white shadow-sm text-left max-h-48 overflow-y-auto">
          {filteredSuggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-left"
            >
              {suggestion}
            </div>
          ))}
        </div>
      )}

      {/* AI Skills Grouping Actions */}
      <div className="border-t border-gray-200 pt-4 mt-6 text-left">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={handleAutoGroup}
            disabled={loading || resumeData.skills.length === 0}
            className={`px-5 py-2.5 rounded-lg text-white font-medium text-sm flex items-center gap-2 transition-all shadow ${
              loading || resumeData.skills.length === 0
                ? "bg-gray-400 cursor-not-allowed shadow-none"
                : "bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 hover:shadow-md active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Grouping...
              </>
            ) : (
              <>
                <span>✨</span> Auto Group Skills with AI
              </>
            )}
          </button>

          {resumeData.groupedSkills && resumeData.groupedSkills.length > 0 && (
            <label className="inline-flex items-center cursor-pointer select-none">
              <input
                type="checkbox"
                checked={resumeData.showGroupedSkills || false}
                onChange={toggleGroupedView}
                className="sr-only peer"
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              <span className="ms-3 text-sm font-medium text-gray-700">Show Grouped View</span>
            </label>
          )}
        </div>

        {error && (
          <p className="mt-3 text-xs text-red-500 font-medium">
            ⚠️ {error}
          </p>
        )}

        {/* Categories Editor */}
        {resumeData.showGroupedSkills && resumeData.groupedSkills && resumeData.groupedSkills.length > 0 && (
          <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-3 text-left">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider">Grouped Skills Editor</h4>
            </div>
            {resumeData.groupedSkills.map((group, idx) => (
              <div key={idx} className="flex gap-2 items-center text-xs">
                <input
                  type="text"
                  value={group.category}
                  onChange={(e) => {
                    const val = e.target.value;
                    setResumeData(prev => {
                      const updated = [...(prev.groupedSkills || [])];
                      updated[idx] = { ...updated[idx], category: val };
                      return { ...prev, groupedSkills: updated };
                    });
                  }}
                  className="font-bold text-gray-700 bg-white border border-gray-300 rounded px-2 py-1 w-1/3 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Category Name"
                />
                <span className="text-gray-500">:</span>
                <input
                  type="text"
                  value={group.items.join(", ")}
                  onChange={(e) => {
                    const val = e.target.value;
                    setResumeData(prev => {
                      const updated = [...(prev.groupedSkills || [])];
                      updated[idx] = { ...updated[idx], items: val.split(",").map(s => s.trim()) };
                      return { ...prev, groupedSkills: updated };
                    });
                  }}
                  className="text-gray-600 bg-white border border-gray-300 rounded px-2 py-1 flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Skills (comma separated)"
                />
                <button
                  type="button"
                  onClick={() => {
                    setResumeData(prev => ({
                      ...prev,
                      groupedSkills: (prev.groupedSkills || []).filter((_, i) => i !== idx)
                    }));
                  }}
                  className="text-red-500 hover:text-red-700 font-bold px-1.5"
                  title="Remove Category"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => {
                setResumeData(prev => ({
                  ...prev,
                  groupedSkills: [...(prev.groupedSkills || []), { category: "New Category", items: [] }]
                }));
              }}
              className="text-blue-600 text-xs font-semibold hover:underline"
            >
              + Add Skill Category
            </button>
          </div>
        )}
        {/* Suggested Complementary Skills */}
        {resumeData.suggestedSkills && resumeData.suggestedSkills.length > 0 && (
          <div className="mt-5 pt-4 border-t border-dashed border-gray-200">
            <h4 className="text-xs font-semibold uppercase text-gray-500 tracking-wider mb-3">Suggested Complementary Skills</h4>
            <div className="flex flex-wrap gap-2">
              {resumeData.suggestedSkills.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAddSuggestedSkill(s)}
                  className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 border border-indigo-100 hover:scale-105 active:scale-95 flex items-center gap-1"
                >
                  <span className="text-indigo-400 font-bold text-sm">+</span> {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Skills;
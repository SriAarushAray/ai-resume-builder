import { useState } from "react";

function Skills({ resumeData, setResumeData }) {
  const [skillInput, setSkillInput] = useState("");

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

    if (!resumeData.skills.includes(newSkill)) {
      setResumeData({
        ...resumeData,
        skills: [...resumeData.skills, newSkill],
      });
    }

    setSkillInput("");
  }
};

  const handleRemoveSkill = (indexToRemove) => {
    setResumeData({
      ...resumeData,
      skills: resumeData.skills.filter(
        (_, index) => index !== indexToRemove
      ),
    });
  };

  const handleSuggestionClick = (suggestion) => {
  setResumeData({
    ...resumeData,
    skills: [...resumeData.skills, suggestion],
  });

  setSkillInput("");
};

  return (
    <>
      <h3 className="text-xl font-semibold mt-8 mb-4 text-left">
        Skills
      </h3>

      {/* Added Skills */}
      <div className="flex flex-wrap gap-2 mb-3">
        {resumeData.skills.map((skill, index) => (
          <div
            key={index}
            className="bg-blue-100 text-blue-700 px-3 py-1 rounded flex items-center"
          >
            {skill}
            <button
              onClick={() => handleRemoveSkill(index)}
              className="ml-2 text-red-500 font-bold"
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
        className="w-full p-3 border border-gray-300 rounded text-sm"
      />

      {/* Suggestions */}
      {filteredSuggestions.length > 0 && (
        <div className="border border-gray-200 rounded mt-2 bg-white shadow-sm text-left">
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
    </>
  );
}

export default Skills;
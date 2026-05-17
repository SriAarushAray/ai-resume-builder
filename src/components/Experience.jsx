import MonthYearPicker from "./MonthYearPicker";

const parseDuration = (duration) => {
  if (!duration) return { from: "", to: "" };
  const parts = duration.split(" - ");
  return { from: parts[0]?.trim() || "", to: parts[1]?.trim() || "" };
};

function Experience({ resumeData, setResumeData }) {
  const experiences = resumeData.experiences || [];

  const addExperience = () => {
    setResumeData((prev) => ({
      ...prev,
      experiences: [
        ...(prev.experiences || []),
        { company: "", role: "", duration: "", description: "" },
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
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-left">Experience</h3>

      <div className="space-y-4">
        {experiences.map((experience, index) => {
          const { from, to } = parseDuration(experience.duration);
          const isPresent = to === "Present";

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
                placeholder="Description"
                value={experience.description}
                onChange={(e) => updateExperience(index, "description", e.target.value)}
                className="w-full border p-2 mb-2 rounded"
              />

              <button
                onClick={() => removeExperience(index)}
                className="text-red-500 hover:text-red-700 text-sm"
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
    </div>
  );
}

export default Experience;

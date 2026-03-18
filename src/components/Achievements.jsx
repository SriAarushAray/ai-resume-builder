import React from "react";

function Achievements({ resumeData, setResumeData }) {
  const { achievements } = resumeData;

  // Add new achievement
  const addAchievement = () => {
    setResumeData((prev) => ({
      ...prev,
      achievements: [
        ...prev.achievements,
        { title: "", description: "" }
      ]
    }));
  };

  // Update achievement
  const updateAchievement = (index, field, value) => {
    setResumeData((prev) => {
      const updated = [...prev.achievements];
      updated[index][field] = value;

      return {
        ...prev,
        achievements: updated
      };
    });
  };

  // Remove achievement
  const removeAchievement = (index) => {
    setResumeData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="mt-8">

      <h3 className="text-xl font-semibold mb-4 text-left">
        Achievements
      </h3>

      {/* Achievement Blocks */}
      <div className="space-y-4">

        {achievements.map((ach, index) => (
          <div key={index} className="border p-3 rounded">

            <input
              type="text"
              placeholder="Achievement Title"
              value={ach.title}
              onChange={(e) =>
                updateAchievement(index, "title", e.target.value)
              }
              className="w-full border p-2 mb-2 rounded"
            />

            <textarea
              placeholder="Description"
              value={ach.description}
              onChange={(e) =>
                updateAchievement(index, "description", e.target.value)
              }
              className="w-full border p-2 mb-2 rounded"
            />

            <button
              onClick={() => removeAchievement(index)}
              className="text-red-500 hover:text-red-700 text-sm"
            >
              Remove
            </button>

          </div>
        ))}

      </div>

      {/* Add Button */}
      <div className="mt-4">
        <button
          onClick={addAchievement}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Achievement
        </button>
      </div>

    </div>
  );
}

export default Achievements;
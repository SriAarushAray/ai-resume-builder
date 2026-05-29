import MonthYearPicker from "./MonthYearPicker";

function Responsibilities({ resumeData, setResumeData }) {
  const responsibilities = resumeData.responsibilities || [];

  const addResponsibility = () => {
    setResumeData(prev => ({
      ...prev,
      responsibilities: [
        ...(prev.responsibilities || []),
        { role: "", organization: "", startDate: "", endDate: "", description: "" },
      ],
    }));
  };

  const updateResponsibility = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...(prev.responsibilities || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, responsibilities: updated };
    });
  };

  const removeResponsibility = (index) => {
    setResumeData(prev => ({
      ...prev,
      responsibilities: (prev.responsibilities || []).filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Responsibilities</h2>

      {responsibilities.map((resp, index) => (
        <div key={index} className="border p-3 mb-3 rounded">
          <input
            type="text"
            placeholder="Role (e.g., Co-Convenor)"
            value={resp.role}
            onChange={(e) => updateResponsibility(index, "role", e.target.value)}
            className="w-full border p-2 mb-2 rounded"
          />

          <input
            type="text"
            placeholder="Organization (e.g., SEDS SRMAP)"
            value={resp.organization}
            onChange={(e) => updateResponsibility(index, "organization", e.target.value)}
            className="w-full border p-2 mb-2 rounded"
          />

          <div className="flex items-end gap-2 mb-2">
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">Start Date</label>
              <MonthYearPicker
                value={resp.startDate}
                onChange={(v) => updateResponsibility(index, "startDate", v)}
                placeholder="Start"
                yearOnly
              />
            </div>
            <span className="pb-3 text-gray-400">—</span>
            <div className="flex-1">
              <label className="text-xs text-gray-500 mb-1 block">End Date</label>
              <MonthYearPicker
                value={resp.endDate}
                onChange={(v) => updateResponsibility(index, "endDate", v)}
                placeholder="End (or Present)"
                yearOnly
              />
            </div>
          </div>

          <textarea
            placeholder="Description (e.g., Coordinated and organized inter-college events...)"
            value={resp.description}
            onChange={(e) => updateResponsibility(index, "description", e.target.value)}
            className="w-full border p-2 mb-2 rounded"
            rows="3"
          />

          <button
            onClick={() => removeResponsibility(index)}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addResponsibility}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Add Responsibility
      </button>
    </div>
  );
}

export default Responsibilities;

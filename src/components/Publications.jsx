import MonthYearPicker from "./MonthYearPicker";

function Publications({ resumeData, setResumeData }) {
  const publications = resumeData.publications || [];

  const addPublication = () => {
    setResumeData({
      ...resumeData,
      publications: [
        ...publications,
        { title: "", date: "", description: "" },
      ],
    });
  };

  const updatePublication = (index, field, value) => {
    const updated = [...publications];
    updated[index][field] = value;

    setResumeData({
      ...resumeData,
      publications: updated,
    });
  };

  const removePublication = (index) => {
    const updated = publications.filter((_, i) => i !== index);

    setResumeData({
      ...resumeData,
      publications: updated,
    });
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">Publications</h2>

      {publications.map((pub, index) => (
        <div key={index} className="border p-3 mb-3 rounded">
          <input
            type="text"
            placeholder="Publication Name (e.g., International Conference on...)"
            value={pub.title}
            onChange={(e) => updatePublication(index, "title", e.target.value)}
            className="w-full border p-2 mb-2 rounded"
          />

          <div className="mb-2">
            <MonthYearPicker
              value={pub.date}
              onChange={(v) => updatePublication(index, "date", v)}
              placeholder="Select Date"
            />
          </div>

          <textarea
            placeholder="Description (e.g., IEEE-sponsored publication: Proposed a novel...)"
            value={pub.description}
            onChange={(e) => updatePublication(index, "description", e.target.value)}
            className="w-full border p-2 mb-2 rounded"
            rows="3"
          />

          <button
            onClick={() => removePublication(index)}
            className="text-red-500 text-sm"
          >
            Remove
          </button>
        </div>
      ))}

      <button
        onClick={addPublication}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Add Publication
      </button>
    </div>
  );
}

export default Publications;

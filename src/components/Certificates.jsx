import MonthYearPicker from "./MonthYearPicker";

function Certificates({ resumeData, setResumeData }) {

  const certificates = resumeData.certificates;

  const addCertificate = () => {
    setResumeData(prev => ({
      ...prev,
      certificates: [
        ...(prev.certificates || []),
        { name: "", issuer: "", year: "", link: "" }
      ]
    }));
  };

  const updateCertificate = (index, field, value) => {
    setResumeData(prev => {
      const updated = [...(prev.certificates || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, certificates: updated };
    });
  };

  const removeCertificate = (index) => {
    setResumeData(prev => ({
      ...prev,
      certificates: (prev.certificates || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="mt-6">

      <h2 className="text-xl font-semibold mb-3">
        Certificates
      </h2>

      {certificates.map((cert, index) => (
        <div key={index} className="border p-3 mb-3 rounded">

          <input
            type="text"
            placeholder="Certificate Name"
            value={cert.name}
            onChange={(e) =>
              updateCertificate(index, "name", e.target.value)
            }
            className="w-full border p-2 mb-2 rounded"
          />

          <input
            type="text"
            placeholder="Issuer (Coursera, Google, AWS)"
            value={cert.issuer}
            onChange={(e) =>
              updateCertificate(index, "issuer", e.target.value)
            }
            className="w-full border p-2 mb-2 rounded"
          />

          <MonthYearPicker
            value={cert.year}
            onChange={(v) => updateCertificate(index, "year", v)}
            placeholder="Select year"
            yearOnly
          />

          <input
            type="text"
            placeholder="Verification Link"
            value={cert.link}
            onChange={(e) =>
              updateCertificate(index, "link", e.target.value)
            }
            className="w-full border p-2 mb-2 rounded"
          />

          <button
            onClick={() => removeCertificate(index)}
            className="text-red-500"
          >
            Remove
          </button>

        </div>
      ))}

      <button
        onClick={addCertificate}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Add Certificate
      </button>

    </div>
  );
}

export default Certificates;
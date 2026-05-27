import { useState, useRef, useEffect } from "react";

function Personal({ resumeData, setResumeData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [aiSummaryPreview, setAiSummaryPreview] = useState("");
  
  const previewRef = useRef(null);

  useEffect(() => {
    if (aiSummaryPreview && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [aiSummaryPreview]);

  const handleChange = (e) => {
    setResumeData({
      ...resumeData,
      personal: {
        ...resumeData.personal,
        [e.target.name]: e.target.value,
      },
    });
  };

  const handleOptimizeSummary = async () => {
    setLoading(true);
    setError("");
    setAiSummaryPreview("");
    try {
      const response = await fetch("/api/ai/improve-summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resumeData }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.summary) {
          setAiSummaryPreview(data.summary);
        } else {
          setError("Failed to generate summary. No summary returned from API.");
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        setError(errorData.error || "Failed to generate summary. Please check backend server.");
      }
    } catch (err) {
      console.error(err);
      setError("Server connection failed. Make sure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleApplySummary = () => {
    setResumeData({
      ...resumeData,
      personal: {
        ...resumeData.personal,
        summary: aiSummaryPreview,
      },
    });
    setAiSummaryPreview("");
  };

  const handleCancelSummary = () => {
    setAiSummaryPreview("");
  };

  return (
    <>
      <h3 className="text-2xl font-semibold mb-6 text-left text-gray-900 tracking-tight">
        Personal Information
      </h3>

      <div className="grid grid-cols-2 gap-6">
        {/* Full Name */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            name="fullName"
            value={resumeData.personal.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            name="email"
            value={resumeData.personal.email}
            onChange={handleChange}
            placeholder="Enter your email"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            name="phone"
            value={resumeData.personal.phone}
            onChange={handleChange}
            placeholder="Enter your phone number"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>

        {/* Location */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            name="location"
            value={resumeData.personal.location}
            onChange={handleChange}
            placeholder="Enter your location"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
          />
        </div>
      </div>

      {/* Summary Full Width */}
      <div className="mt-6 flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <label className="text-sm font-medium text-gray-700">
            Professional Summary
          </label>
          <button
            type="button"
            onClick={handleOptimizeSummary}
            disabled={loading}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md shadow-sm transition-all duration-300 flex items-center gap-1.5 border border-transparent ${
              loading
                ? "bg-violet-100 text-violet-400 cursor-not-allowed border-violet-200"
                : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white hover:shadow-md hover:scale-[1.02] active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin h-3.5 w-3.5 text-violet-500" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Optimizing...
              </>
            ) : (
              <>
                <span>✨</span> Optimize with AI
              </>
            )}
          </button>
        </div>
        <textarea
          name="summary"
          value={resumeData.personal.summary}
          onChange={handleChange}
          placeholder="Write a brief summary about yourself"
          rows={5}
          className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
        />

        {error && (
          <div className="mt-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-md p-2 flex items-center gap-1.5 animate-fadeIn">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {aiSummaryPreview && (
          <div
            ref={previewRef}
            className="mt-3.5 p-4 border border-violet-200 rounded-lg bg-gradient-to-br from-violet-50/70 to-indigo-50/50 shadow-sm transition-all duration-300 animate-fadeIn"
          >
            <div className="flex items-center justify-between mb-2 pb-2 border-b border-violet-100/80">
              <span className="text-xs font-bold text-violet-700 tracking-wider flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                AI SUGGESTED SUMMARY PREVIEW
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleApplySummary}
                  className="px-2.5 py-1 text-xs font-semibold text-white bg-gradient-to-r from-emerald-500 to-teal-600 rounded-md shadow-sm hover:from-emerald-600 hover:to-teal-700 transition duration-200 active:scale-95 flex items-center gap-1"
                >
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Apply
                </button>
                <button
                  type="button"
                  onClick={handleCancelSummary}
                  className="px-2.5 py-1 text-xs font-semibold text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50 hover:text-gray-800 transition duration-200 active:scale-95"
                >
                  Cancel
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700 italic border-l-2 border-violet-400 pl-3 py-1 font-serif leading-relaxed">
              {aiSummaryPreview}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

export default Personal;
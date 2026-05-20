import { useState } from "react";
import MonthYearPicker from "./MonthYearPicker";

function Education({ resumeData, setResumeData }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);

  const collegeSuggestions = [
    "SRM University AP",
    "VIT Vellore",
    "BITS Pilani",
    "IIT Delhi",
    "IIT Bombay",
    "NIT Trichy",
    "Anna University",
    "Delhi University",
  ];

  const handleChange = (e) => {
    setResumeData({
      ...resumeData,
      education: {
        ...resumeData.education,
        [e.target.name]: e.target.value,
      },
    });
  };

  const filteredColleges = collegeSuggestions.filter((college) =>
    college.toLowerCase().includes(resumeData.education.college.toLowerCase()),
  );

  const handleCollegeClick = (college) => {
    setResumeData({
      ...resumeData,
      education: {
        ...resumeData.education,
        college: college,
      },
    });

    setShowSuggestions(false);
    setHighlightIndex(-1);
  };

  return (
    <>
      <h3 className="text-xl font-semibold mt-8 mb-6 text-left">Education</h3>

      <div className="grid grid-cols-2 gap-6">
        {/* College */}
        <div className="flex flex-col relative">
          <label className="mb-2 text-sm font-medium text-gray-700">
            College / University
          </label>

          <input
            name="college"
            value={resumeData.education.college}
            onChange={(e) => {
              handleChange(e);
              setShowSuggestions(true);
              setHighlightIndex(-1);
            }}
            onFocus={() => setShowSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setHighlightIndex((prev) =>
                  prev < filteredColleges.length - 1 ? prev + 1 : prev,
                );
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
              }

              if (e.key === "Enter" && highlightIndex >= 0) {
                e.preventDefault();
                handleCollegeClick(filteredColleges[highlightIndex]);
              }
            }}
            placeholder="Enter your college"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 🔥 Proper Dropdown Rendering */}
          {showSuggestions &&
            resumeData.education.college !== "" &&
            filteredColleges.length > 0 && (
              <div className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md z-10">
                {filteredColleges.map((college, index) => (
                  <div
                    key={index}
                    onClick={() => handleCollegeClick(college)}
                    className={`px-3 py-2 text-sm cursor-pointer text-left ${
                      highlightIndex === index
                        ? "bg-blue-100"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    {college}
                  </div>
                ))}
              </div>
            )}
        </div>

        {/* Degree */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Degree
          </label>

          <select
            name="degree"
            value={resumeData.education.degree}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select Degree</option>
            <option value="B.Tech">B.Tech</option>
            <option value="B.E">B.E</option>
            <option value="B.Sc">B.Sc</option>
            <option value="M.Tech">M.Tech</option>
            <option value="M.Sc">M.Sc</option>
            <option value="MBA">MBA</option>
            <option value="PhD">PhD</option>
            {resumeData.education.degree && !["", "B.Tech", "B.E", "B.Sc", "M.Tech", "M.Sc", "MBA", "PhD"].includes(resumeData.education.degree) && (
              <option value={resumeData.education.degree}>{resumeData.education.degree}</option>
            )}
          </select>
        </div>

        {/* Graduation Year */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Graduation Year
          </label>

          <MonthYearPicker
            value={resumeData.education.year}
            onChange={(v) => handleChange({ target: { name: "year", value: v } })}
            placeholder="Select year"
            yearOnly
          />
        </div>

        {/* GPA */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">GPA</label>

          <input
            name="gpa"
            value={resumeData.education.gpa}
            onChange={handleChange}
            placeholder="Enter GPA"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </>
  );
}

export default Education;

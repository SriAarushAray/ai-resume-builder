import { useState, useEffect, useRef } from "react";
import MonthYearPicker from "./MonthYearPicker";

// Local registry of major campuses (SRM, VIT, IITs, BITS, NITs) and top global universities
const offlineColleges = [
  // SRM Campuses
  "SRM University AP ",
  "SRM Institute of Science and Technology, Kattankulathur (KTR)",
  "SRM Institute of Science and Technology, Ramapuram",
  "SRM Institute of Science and Technology, Vadapalani",
  "SRM University, Delhi-NCR",
  "SRM University, Sikkim",
  "SRM University, Trichy",

  // VIT Campuses
  "VIT Vellore",
  "VIT Chennai",
  "VIT Andhra Pradesh (VIT-AP)",
  "VIT Bhopal",

  // BITS Campuses
  "BITS Pilani",
  "BITS Pilani, Goa Campus",
  "BITS Pilani, Hyderabad Campus",

  // Top IITs
  "Indian Institute of Technology Madras (IIT Madras)",
  "Indian Institute of Technology Bombay (IIT Bombay)",
  "Indian Institute of Technology Delhi (IIT Delhi)",
  "Indian Institute of Technology Kharagpur (IIT Kharagpur)",
  "Indian Institute of Technology Kanpur (IIT Kanpur)",
  "Indian Institute of Technology Roorkee (IIT Roorkee)",
  "Indian Institute of Technology Guwahati (IIT Guwahati)",
  "Indian Institute of Technology Hyderabad (IIT Hyderabad)",
  "Indian Institute of Technology BHU (IIT Varanasi)",

  // Top NITs
  "National Institute of Technology Trichy (NIT Trichy)",
  "National Institute of Technology Karnataka (NIT Surathkal)",
  "National Institute of Technology Rourkela (NIT Rourkela)",
  "National Institute of Technology Warangal (NIT Warangal)",
  "Motilal Nehru National Institute of Technology (MNNIT Allahabad)",

  // Major Indian Universities
  "Delhi University (DU)",
  "Anna University, Chennai",
  "Jawaharlal Nehru University (JNU)",
  "Banaras Hindu University (BHU)",
  "Amity University",
  "Manipal Academy of Higher Education",

  // Top World Universities
  "Harvard University",
  "Stanford University",
  "Massachusetts Institute of Technology (MIT)",
  "University of Oxford",
  "University of Cambridge",
  "California Institute of Technology (Caltech)",
  "University of California, Berkeley (UC Berkeley)",
  "Carnegie Mellon University (CMU)",
  "Princeton University",
  "Yale University"
];

function Education({ resumeData, setResumeData }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef(null);

  const [showLocSuggestions, setShowLocSuggestions] = useState(false);
  const [locHighlightIndex, setLocHighlightIndex] = useState(-1);
  const [locSuggestions, setLocSuggestions] = useState([]);
  const [isLocLoading, setIsLocLoading] = useState(false);
  const locDropdownRef = useRef(null);

  const handleChange = (e) => {
    setResumeData(prev => ({
      ...prev,
      education: {
        ...(prev.education || {}),
        [e.target.name]: e.target.value,
      },
    }));
  };

  const handleCollegeClick = (college) => {
    setResumeData(prev => ({
      ...prev,
      education: {
        ...(prev.education || {}),
        college: college,
      },
    }));

    setShowSuggestions(false);
    setHighlightIndex(-1);
  };

  const handleLocationClick = (loc) => {
    setResumeData(prev => ({
      ...prev,
      education: {
        ...(prev.education || {}),
        location: loc,
      },
    }));
    setShowLocSuggestions(false);
    setLocHighlightIndex(-1);
  };

  // Debounced search combining local curated branches and global API results
  useEffect(() => {
    const query = resumeData.education.college?.trim();
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    // 1. Instantly filter local matching campuses to make suggestions feel snappy
    const localFiltered = offlineColleges.filter((college) =>
      college.toLowerCase().includes(query.toLowerCase())
    );
    setSuggestions(localFiltered.slice(0, 10));

    const delayDebounceFn = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`http://universities.hipolabs.com/search?name=${encodeURIComponent(query)}`);
        if (response.ok) {
          const data = await response.json();
          const apiNames = data.map((item) => item.name);

          // Merge local and API names, removing duplicates, and limit to 10
          const merged = [...new Set([...localFiltered, ...apiNames])].slice(0, 10);
          setSuggestions(merged);
        }
      } catch (err) {
        console.warn("API query failed, continuing with local results only:", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [resumeData.education.college]);

  // Debounced search for location autocomplete using Open-Meteo Geocoding
  useEffect(() => {
    const query = resumeData.education.location?.trim();
    if (!query || query.length < 2) {
      setLocSuggestions([]);
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsLocLoading(true);
      try {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`);
        if (response.ok) {
          const data = await response.json();
          if (data.results) {
            const formatted = data.results.map((item) => {
              const city = item.name;
              const state = item.admin1 || "";
              const country = item.country || "";

              // Map Indian state names to standard abbreviations
              let stateAbbr = state;
              if (country === "India") {
                const indiaStates = {
                  "Andhra Pradesh": "AP",
                  "Arunachal Pradesh": "AR",
                  "Assam": "AS",
                  "Bihar": "BR",
                  "Chhattisgarh": "CG",
                  "Goa": "GA",
                  "Gujarat": "GJ",
                  "Haryana": "HR",
                  "Himachal Pradesh": "HP",
                  "Jharkhand": "JH",
                  "Karnataka": "KA",
                  "Kerala": "KL",
                  "Madhya Pradesh": "MP",
                  "Maharashtra": "MH",
                  "Manipur": "MN",
                  "Meghalaya": "ML",
                  "Mizoram": "MZ",
                  "Nagaland": "NL",
                  "Odisha": "OD",
                  "Punjab": "PB",
                  "Rajasthan": "RJ",
                  "Sikkim": "SK",
                  "Tamil Nadu": "TN",
                  "Telangana": "TG",
                  "Tripura": "TR",
                  "Uttar Pradesh": "UP",
                  "Uttarakhand": "UK",
                  "West Bengal": "WB"
                };
                if (indiaStates[state]) stateAbbr = indiaStates[state];
              }

              return stateAbbr ? `${city}, ${stateAbbr}` : city;
            });
            setLocSuggestions([...new Set(formatted)]);
          } else {
            setLocSuggestions([]);
          }
        }
      } catch (err) {
        console.warn("Location query failed:", err);
      } finally {
        setIsLocLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [resumeData.education.location]);

  // Close dropdown if user clicks outside of the field or suggestion box
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) && e.target.name !== "college") {
        setShowSuggestions(false);
      }
      if (locDropdownRef.current && !locDropdownRef.current.contains(e.target) && e.target.name !== "location") {
        setShowLocSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
                  prev < suggestions.length - 1 ? prev + 1 : prev,
                );
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();
                setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
              }

              if (e.key === "Enter" && highlightIndex >= 0) {
                e.preventDefault();
                handleCollegeClick(suggestions[highlightIndex]);
              }
            }}
            placeholder="Enter your college"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 🔥 Proper Dropdown Rendering */}
          {showSuggestions &&
            resumeData.education.college !== "" &&
            (isLoading || suggestions.length > 0) && (
              <div
                ref={dropdownRef}
                className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md z-10 max-h-60 overflow-y-auto"
              >
                {isLoading ? (
                  <div className="px-3 py-2 text-sm text-gray-500 text-left flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                    Searching schools globally...
                  </div>
                ) : (
                  suggestions.map((college, index) => (
                    <div
                      key={index}
                      onClick={() => handleCollegeClick(college)}
                      className={`px-3 py-2 text-sm cursor-pointer text-left ${highlightIndex === index
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                        }`}
                    >
                      {college}
                    </div>
                  ))
                )}
              </div>
            )}
        </div>

        {/* Location */}
        <div className="flex flex-col relative">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Location
          </label>

          <input
            name="location"
            value={resumeData.education.location || ""}
            onChange={(e) => {
              handleChange(e);
              setShowLocSuggestions(true);
              setLocHighlightIndex(-1);
            }}
            onFocus={() => setShowLocSuggestions(true)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setLocHighlightIndex((prev) =>
                  prev < locSuggestions.length - 1 ? prev + 1 : prev,
                );
              }

              if (e.key === "ArrowUp") {
                e.preventDefault();
                setLocHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
              }

              if (e.key === "Enter" && locHighlightIndex >= 0) {
                e.preventDefault();
                handleLocationClick(locSuggestions[locHighlightIndex]);
              }
            }}
            placeholder="e.g. Vijayawada, AP"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* 🔥 Proper Dropdown Rendering */}
          {showLocSuggestions &&
            resumeData.education.location !== "" &&
            (isLocLoading || locSuggestions.length > 0) && (
              <div
                ref={locDropdownRef}
                className="absolute top-full mt-1 w-full bg-white border border-gray-200 rounded-md shadow-md z-10 max-h-60 overflow-y-auto"
              >
                {isLocLoading ? (
                  <div className="px-3 py-2 text-sm text-gray-500 text-left flex items-center gap-2">
                    <span className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></span>
                    Searching locations...
                  </div>
                ) : (
                  locSuggestions.map((loc, index) => (
                    <div
                      key={index}
                      onClick={() => handleLocationClick(loc)}
                      className={`px-3 py-2 text-sm cursor-pointer text-left ${locHighlightIndex === index
                          ? "bg-blue-100"
                          : "hover:bg-gray-100"
                        }`}
                    >
                      {loc}
                    </div>
                  ))
                )}
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
            value={resumeData.education.degree || ""}
            onChange={handleChange}
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">Select Degree</option>
            <option value="B.Tech">B.Tech</option>
            <option value="B.E">B.E</option>
            <option value="B.Sc">B.Sc</option>
            <option value="B.A">B.A</option>
            <option value="M.Tech">M.Tech</option>
            <option value="M.Sc">M.Sc</option>
            <option value="MBA">MBA</option>
            <option value="PhD">PhD</option>
          </select>
        </div>

        {/* Course / Major */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Course / Major
          </label>

          <input
            name="course"
            value={resumeData.education.course || ""}
            onChange={handleChange}
            placeholder="e.g. Computer Science & Engineering"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Graduation Year */}
        <div className="flex flex-col">
          <label className="mb-2 text-sm font-medium text-gray-700">
            Graduation Date / Duration
          </label>

          <input
            name="year"
            value={resumeData.education.year || ""}
            onChange={handleChange}
            placeholder="e.g. Oct. 2022 – May 2026"
            className="p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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

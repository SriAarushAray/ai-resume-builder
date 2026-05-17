import { useState, useRef, useEffect } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function MonthYearPicker({ value, onChange, placeholder = "Select", yearOnly = false }) {
  const [isOpen, setIsOpen] = useState(false);
  const [viewYear, setViewYear] = useState(() => {
    if (yearOnly && value) return parseInt(value) || new Date().getFullYear();
    if (value) {
      const parts = value.split(" ");
      return parseInt(parts[1]) || new Date().getFullYear();
    }
    return new Date().getFullYear();
  });
  const ref = useRef(null);

  let selectedMonth = "";
  let selectedYear = null;
  if (yearOnly && value) {
    selectedYear = parseInt(value) || null;
  } else if (value) {
    const parts = value.split(" ");
    selectedMonth = parts[0] || "";
    selectedYear = parseInt(parts[1]) || null;
  }

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleMonthSelect = (month) => {
    onChange(`${month} ${viewYear}`);
    setIsOpen(false);
  };

  const handleYearSelect = (year) => {
    if (yearOnly) {
      onChange(String(year));
      setIsOpen(false);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 border border-gray-300 rounded-md text-left text-sm flex items-center justify-between hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>{value || placeholder}</span>
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-xl z-50 p-3 text-gray-900">
          {/* Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <button type="button" onClick={() => setViewYear((y) => y - 1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
              type="button"
              onClick={() => yearOnly && handleYearSelect(viewYear)}
              className={`text-sm font-semibold px-3 py-1 rounded-lg transition-colors ${yearOnly ? "hover:bg-blue-50 hover:text-blue-600 cursor-pointer" : ""} ${selectedYear === viewYear && yearOnly ? "bg-blue-500 text-white" : ""}`}
            >
              {viewYear}
            </button>
            <button type="button" onClick={() => setViewYear((y) => y + 1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
          </div>

          {yearOnly ? (
            <div className="grid grid-cols-3 gap-1">
              {Array.from({ length: 9 }, (_, i) => viewYear - 4 + i).map((year) => (
                <button
                  key={year}
                  type="button"
                  onClick={() => handleYearSelect(year)}
                  className={`p-2 text-xs rounded-lg transition-colors ${selectedYear === year ? "bg-blue-500 text-white font-semibold" : "hover:bg-gray-100 text-gray-700"}`}
                >
                  {year}
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1">
              {MONTHS.map((month) => (
                <button
                  key={month}
                  type="button"
                  onClick={() => handleMonthSelect(month)}
                  className={`p-2 text-xs rounded-lg transition-colors ${selectedMonth === month && selectedYear === viewYear ? "bg-blue-500 text-white font-semibold" : "hover:bg-gray-100 text-gray-700"}`}
                >
                  {month}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default MonthYearPicker;

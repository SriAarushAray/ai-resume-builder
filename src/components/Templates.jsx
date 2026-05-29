import React from "react";

const TEMPLATE_OPTIONS = [
  {
    id: "minimalist",
    name: "Classic Minimalist",
    desc: "A traditional serif style featuring a centered header, classic margins, and clean, elegant horizontal dividers. Ideal for academic, standard corporate, or conservative fields.",
    badge: "Most Popular",
    badgeColor: "bg-slate-100 text-slate-700 border-slate-200",
    preview: (
      <div className="w-full h-32 bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-2 font-serif text-slate-800 select-none shadow-inner overflow-hidden">
        {/* Header */}
        <div className="text-center">
          <div className="h-3 w-16 bg-slate-800 mx-auto rounded-sm mb-1"></div>
          <div className="h-1.5 w-24 bg-slate-400 mx-auto rounded-sm"></div>
        </div>
        {/* Divider */}
        <div className="h-px bg-slate-350 my-1"></div>
        {/* Section 1 */}
        <div>
          <div className="h-2 w-12 bg-slate-800 mx-auto rounded-sm mb-1"></div>
          <div className="flex justify-between items-center px-1">
            <div className="h-1.5 w-16 bg-slate-600 rounded-sm"></div>
            <div className="h-1.5 w-8 bg-slate-400 rounded-sm"></div>
          </div>
          <div className="space-y-1 mt-1.5 px-2">
            <div className="h-1 w-full bg-slate-300 rounded-sm"></div>
            <div className="h-1 w-5/6 bg-slate-300 rounded-sm"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "modern",
    name: "Sleek Modern",
    desc: "A contemporary sans-serif layout with a bold left-aligned header, tech-friendly spacing, and crisp vertical accent bars. Perfect for engineering, product, and design roles.",
    badge: "Tech & Product",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    preview: (
      <div className="w-full h-32 bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-2 font-sans text-slate-800 select-none shadow-inner overflow-hidden">
        {/* Header */}
        <div className="text-left border-b-2 border-blue-500 pb-1.5">
          <div className="h-3.5 w-20 bg-blue-600 rounded-sm mb-1"></div>
          <div className="h-1.5 w-32 bg-slate-400 rounded-sm"></div>
        </div>
        {/* Section 1 */}
        <div className="flex gap-2">
          {/* Accent vertical line */}
          <div className="w-0.5 bg-blue-500 rounded-sm shrink-0"></div>
          <div className="flex-1">
            <div className="h-2 w-14 bg-blue-600 rounded-sm mb-1"></div>
            <div className="flex justify-between items-center">
              <div className="h-1.5 w-20 bg-slate-700 rounded-sm"></div>
              <div className="h-1.5 w-10 bg-blue-500 rounded-sm"></div>
            </div>
            <div className="space-y-1 mt-1">
              <div className="h-1 w-full bg-slate-300 rounded-sm"></div>
              <div className="h-1.5 w-full flex gap-1 items-center">
                <span className="w-1 h-1 bg-slate-400 rounded-full shrink-0"></span>
                <span className="h-1 w-11/12 bg-slate-300 rounded-sm"></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "executive",
    name: "Refined Executive",
    desc: "An elegant, prestigious template with double underlines, formal serif headers, and a subtle page frame. Designed for leadership positions and senior management.",
    badge: "Leadership",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    preview: (
      <div className="w-full h-32 bg-white border-2 border-slate-200 rounded-lg p-2.5 flex flex-col gap-1.5 font-serif text-slate-900 select-none shadow-inner overflow-hidden relative">
        {/* Double header boundary mockup */}
        <div className="text-center pb-1 border-b-2 border-double border-slate-900">
          <div className="h-3.5 w-24 bg-slate-900 mx-auto rounded-sm mb-0.5"></div>
          <div className="h-1.5 w-28 bg-slate-500 mx-auto rounded-sm italic"></div>
        </div>
        {/* Section 1 */}
        <div className="mt-1">
          <div className="h-2 w-16 bg-slate-900 mx-auto rounded-sm mb-1 uppercase border-b border-slate-400 pb-0.5"></div>
          <div className="flex justify-between items-center px-1">
            <div className="h-1.5 w-16 bg-slate-800 rounded-sm uppercase"></div>
            <div className="h-1.5 w-10 bg-slate-600 rounded-sm italic"></div>
          </div>
          <div className="space-y-1 mt-1.5 px-2">
            <div className="h-1 w-full bg-slate-300 rounded-sm"></div>
            <div className="h-1 w-4/5 bg-slate-300 rounded-sm"></div>
          </div>
        </div>
      </div>
    )
  },
  {
    id: "creative",
    name: "Creative Split-Sidebar",
    desc: "A bold, modern design featuring a solid dark navy header, contrasting violet sections, and curved structural details. Recommended for creative industries, marketing, and startups.",
    badge: "Modern Creative",
    badgeColor: "bg-violet-50 text-violet-750 border-violet-200",
    preview: (
      <div className="w-full h-32 bg-white border border-gray-200 rounded-lg flex flex-col select-none shadow-inner overflow-hidden">
        {/* Top Header Banner */}
        <div className="bg-slate-900 text-white p-2.5 text-center border-b-2 border-violet-500">
          <div className="h-3 w-16 bg-white mx-auto rounded-sm mb-1"></div>
          <div className="h-1.5 w-24 bg-slate-450 mx-auto rounded-sm"></div>
        </div>
        {/* Content */}
        <div className="p-2.5 flex-1 flex flex-col gap-1.5">
          <div className="h-3 w-20 bg-violet-100 rounded-md border border-violet-200 flex items-center justify-center">
            <div className="h-1 w-14 bg-violet-700 rounded-sm"></div>
          </div>
          <div className="flex justify-between items-center px-0.5">
            <div className="h-1.5 w-16 bg-slate-800 rounded-sm"></div>
            <div className="h-1.5 w-6 bg-violet-500 rounded-sm"></div>
          </div>
          <div className="space-y-1 mt-0.5 px-1">
            <div className="h-1 w-full bg-slate-300 rounded-sm"></div>
            <div className="h-1 w-11/12 bg-slate-300 rounded-sm"></div>
          </div>
        </div>
      </div>
    )
  }
];

function Templates({ resumeData, setResumeData }) {
  const currentTemplate = resumeData.template || "minimalist";

  const handleSelectTemplate = (id) => {
    setResumeData((prev) => ({
      ...prev,
      template: id,
    }));
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in duration-300">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
          Choose a Layout Template
        </h3>
        <p className="text-sm text-gray-500">
          Select a structural style for your resume. This template governs font styles, spacing rules, colors, and header formatting. You can switch templates at any time!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        {TEMPLATE_OPTIONS.map((tpl) => {
          const isSelected = currentTemplate === tpl.id;
          return (
            <button
              key={tpl.id}
              type="button"
              onClick={() => handleSelectTemplate(tpl.id)}
              className={`group text-left border rounded-2xl p-4 transition-all duration-300 flex flex-col gap-4 relative overflow-hidden outline-none ${
                isSelected
                  ? "border-blue-600 bg-gradient-to-br from-blue-50/50 to-white ring-4 ring-blue-500/10 shadow-lg"
                  : "border-gray-200 hover:border-gray-350 hover:bg-slate-50/80 hover:shadow-md hover:-translate-y-0.5"
              }`}
            >
              {/* Selected Highlight Overlay */}
              {isSelected && (
                <div className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center">
                  <div className="absolute top-0 right-0 w-0 h-0 border-t-[48px] border-r-[48px] border-t-blue-600 border-r-blue-600"></div>
                  <svg
                    className="w-4 h-4 text-white absolute top-1.5 right-1.5 z-10"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="3.5"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              )}

              {/* Visual Preview */}
              <div className="relative">
                {tpl.preview}
                <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors rounded-lg duration-300"></div>
              </div>

              {/* Text Info */}
              <div className="flex-1 flex flex-col gap-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-extrabold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {tpl.name}
                  </span>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${tpl.badgeColor}`}>
                    {tpl.badge}
                  </span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed font-normal">
                  {tpl.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Templates;

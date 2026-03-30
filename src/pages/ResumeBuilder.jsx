import { useState, useEffect } from "react";
import Preview from "../components/Preview";
import Personal from "../components/Personal";
import Skills from "../components/Skills";
import Education from "../components/Education";
import Experience from "../components/Experience";
import Projects from "../components/Projects";
import Achievements from "../components/Achievements";
import Certificates   from "../components/Certificates";

function ResumeBuilder() {
  // RESIZE STATE
  const [leftWidth, setLeftWidth] = useState(50);

  // RESUME DATA STATE
  const [resumeData, setResumeData] = useState(() => {
    const saved = localStorage.getItem("resumeData");

    return saved
      ? JSON.parse(saved)
      : {
          personal: {
            fullName: "",
            email: "",
            phone: "",
            location: "",
            summary: "",
          },
          skills: [],
          education: {
            college: "",
            degree: "",
            year: "",
            gpa: "",
          },
          experiences: [],
          projects: [
            {
              title: "",
              technologies: "",
              points: [],
            }
          ],
          achievements: [],
          certificates: [],
        };
  });

  // SAVE TO LOCAL STORAGE
  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(resumeData));
  }, [resumeData]);

  // HANDLE DRAGGING
  const handleMouseDown = (e) => {
    e.preventDefault();

    const handleMouseMove = (moveEvent) => {
      const newWidth = (moveEvent.clientX / window.innerWidth) * 100;

      if (newWidth > 25 && newWidth < 75) {
        setLeftWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-10">
      <h1 className="text-4xl font-bold text-blue-600 text-center mb-2">
        AI Resume Builder
      </h1>

      <h2 className="text-gray-600 text-center mb-8">
        This is a resume builder app
      </h2>

      {/* MAIN LAYOUT */}
      <div className="flex h-[calc(100vh-140px)] max-w-7xl mx-auto overflow-x-auto">
        {/* LEFT PANEL */}
        <div
          style={{ width: `${leftWidth}%` }}
          className="bg-white p-6 overflow-y-auto h-full"
        >
          <Personal resumeData={resumeData} setResumeData={setResumeData} />
          <Skills resumeData={resumeData} setResumeData={setResumeData} />
          <Education resumeData={resumeData} setResumeData={setResumeData} />
          <Experience resumeData={resumeData} setResumeData={setResumeData} />
          <Projects resumeData={resumeData} setResumeData={setResumeData} />
          <Achievements resumeData={resumeData} setResumeData={setResumeData} />
          <Certificates resumeData={resumeData} setResumeData={setResumeData} />
        </div>

        {/* RESIZER BAR */}
        <div
          onMouseDown={handleMouseDown}
          className="w-2 cursor-col-resize bg-gray-300 hover:bg-gray-400"
        />

        {/* RIGHT PANEL */}
        <div
          style={{ width: `${100 - leftWidth}%` }}
          className="bg-gray-200 h-full overflow-auto p-6"
        >
          <div className="min-w-[820px]">
            <Preview resumeData={resumeData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResumeBuilder;

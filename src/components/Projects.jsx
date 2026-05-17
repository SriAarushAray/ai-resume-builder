import React, { useState, useRef, useEffect } from "react";

const TECH_SUGGESTIONS = [
  "React", "Next.js", "Vue.js", "Angular", "Svelte", "Node.js", "Express.js",
  "Django", "Flask", "Spring Boot", "FastAPI", "Ruby on Rails", "Laravel",
  "MongoDB", "PostgreSQL", "MySQL", "SQLite", "Redis", "Firebase", "Supabase",
  "AWS", "Azure", "GCP", "Docker", "Kubernetes", "Git", "GitHub",
  "TypeScript", "JavaScript", "Python", "Java", "C++", "C#", "C", "Go", "Rust",
  "Swift", "Kotlin", "PHP", "Ruby", "Dart", "R", "MATLAB",
  "HTML", "CSS", "Tailwind CSS", "Bootstrap", "Sass", "Material UI",
  "Redux", "Zustand", "GraphQL", "REST API", "Socket.io", "WebSocket",
  "TensorFlow", "PyTorch", "OpenCV", "Pandas", "NumPy", "Scikit-learn",
  "Figma", "Vercel", "Netlify", "Heroku", "Linux", "Nginx",
  "JWT", "OAuth", "Stripe", "Razorpay", "Twilio", "SendGrid",
  "Vite", "Webpack", "Babel", "Jest", "Cypress", "Playwright",
  "Flutter", "React Native", "Electron", "Tauri",
  "Prisma", "Mongoose", "Sequelize", "Drizzle",
  "OpenAI API", "LangChain", "Hugging Face",
];

function TechInput({ value, onChange }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const getFiltered = () => {
    const parts = value.split(",").map((s) => s.trim());
    const current = parts[parts.length - 1].toLowerCase();
    if (!current) return [];
    const existing = parts.slice(0, -1).map((s) => s.trim().toLowerCase());
    return TECH_SUGGESTIONS.filter(
      (t) => t.toLowerCase().startsWith(current) && !existing.includes(t.toLowerCase())
    ).slice(0, 6);
  };

  const handleSelect = (tech) => {
    const parts = value.split(",").map((s) => s.trim()).filter(Boolean);
    parts[parts.length - 1] = tech;
    onChange(parts.join(", ") + ", ");
    setShowSuggestions(false);
  };

  const filtered = showSuggestions ? getFiltered() : [];

  return (
    <div ref={ref} className="relative">
      <input
        type="text"
        placeholder="Technologies Used (type to search)"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        className="w-full border p-2 mb-2 rounded"
      />
      {filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {filtered.map((tech) => (
            <div
              key={tech}
              onClick={() => handleSelect(tech)}
              className="px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              {tech}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function Projects({ resumeData, setResumeData }) {
  const projects = resumeData.projects || [];

  // Add new empty project
  const handleAddProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...projects,
        { title: "", technologies: "", points: [] },
      ],
    });
  };

  // Update project while typing
  const updateProject = (index, field, value) => {
    const updatedProjects = [...projects];
    updatedProjects[index] = {
      ...updatedProjects[index],
      [field]: value,
    };

    setResumeData({
      ...resumeData,
      projects: updatedProjects,
    });
  };

  const addProjectPoint = (projectIndex) => {
    const updatedProjects = [...projects];
    const currentPoints = Array.isArray(updatedProjects[projectIndex]?.points)
      ? updatedProjects[projectIndex].points
      : [];

    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      points: [...currentPoints, ""],
    };

    setResumeData({
      ...resumeData,
      projects: updatedProjects,
    });
  };

  const updateProjectPoint = (projectIndex, pointIndex, value) => {
    const updatedProjects = [...projects];
    const currentPoints = Array.isArray(updatedProjects[projectIndex]?.points)
      ? [...updatedProjects[projectIndex].points]
      : [];
    currentPoints[pointIndex] = value;

    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      points: currentPoints,
    };

    setResumeData({
      ...resumeData,
      projects: updatedProjects,
    });
  };

  const removeProjectPoint = (projectIndex, pointIndexToRemove) => {
    const updatedProjects = [...projects];
    const currentPoints = Array.isArray(updatedProjects[projectIndex]?.points)
      ? updatedProjects[projectIndex].points
      : [];

    updatedProjects[projectIndex] = {
      ...updatedProjects[projectIndex],
      points: currentPoints.filter((_, pointIndex) => pointIndex !== pointIndexToRemove),
    };

    setResumeData({
      ...resumeData,
      projects: updatedProjects,
    });
  };

  // Remove project
  const handleRemoveProject = (indexToRemove) => {
    setResumeData({
      ...resumeData,
      projects: projects.filter(
        (_, index) => index !== indexToRemove,
      ),
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-left">Projects</h3>

      {/* Project Blocks */}
      <div className="space-y-4">
        {projects.map((project, index) => (
          <div key={index} className="border p-3 mb-3 rounded">
            <input
              type="text"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) => updateProject(index, "title", e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />

            {/* Tech Input with Autocomplete */}
            <TechInput
              value={project.technologies}
              onChange={(v) => updateProject(index, "technologies", v)}
            />

            <div className="mb-3">
              <p className="text-sm font-medium mb-2">Project Points</p>

              {(project.points || []).map((point, pointIndex) => (
                <div key={pointIndex} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder={`Point ${pointIndex + 1}`}
                    value={point}
                    onChange={(e) => updateProjectPoint(index, pointIndex, e.target.value)}
                    className="w-full border p-2 rounded"
                  />
                  <button
                    type="button"
                    onClick={() => removeProjectPoint(index, pointIndex)}
                    className="text-red-500 px-2"
                  >
                    Remove
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={() => addProjectPoint(index)}
                className="text-blue-600 text-sm"
              >
                + Add Point
              </button>
            </div>

            <button
              onClick={() => handleRemoveProject(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      {/* Add Button */}
      <div className="mt-4">
        <button
          onClick={handleAddProject}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Project
        </button>
      </div>
    </div>
  );
}

export default Projects;

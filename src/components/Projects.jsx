import React from "react";

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

            <input
              type="text"
              placeholder="Technologies Used"
              value={project.technologies}
              onChange={(e) =>
                updateProject(index, "technologies", e.target.value)
              }
              className="w-full border p-2 mb-2 rounded"
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

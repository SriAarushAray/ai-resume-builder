import React from "react";

function Projects({ resumeData, setResumeData }) {
  // Add new empty project
  const handleAddProject = () => {
    setResumeData({
      ...resumeData,
      projects: [
        ...resumeData.projects,
        { title: "", description: "", technologies: "" },
      ],
    });
  };

  // Update project while typing
  const updateProject = (index, field, value) => {
    const updatedProjects = [...resumeData.projects];
    updatedProjects[index][field] = value;

    setResumeData({
      ...resumeData,
      projects: updatedProjects,
    });
  };

  // Remove project
  const handleRemoveProject = (indexToRemove) => {
    setResumeData({
      ...resumeData,
      projects: resumeData.projects.filter(
        (_, index) => index !== indexToRemove,
      ),
    });
  };

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4 text-left">Projects</h3>

      {/* Project Blocks */}
      <div className="space-y-4">
        {resumeData.projects.map((project, index) => (
          <div key={index} className="border p-3 mb-3 rounded">
            <input
              type="text"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) => updateProject(index, "title", e.target.value)}
              className="w-full border p-2 mb-2 rounded"
            />

            <textarea
              placeholder="Project Description"
              value={project.description}
              onChange={(e) =>
                updateProject(index, "description", e.target.value)
              }
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

            <button
              onClick={() => handleRemoveProject(index)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        {resumeData.projects.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-lg border-b pb-1">Projects</h3>

            {resumeData.projects.map((project, index) => (
              <div key={index} className="mt-3">
                <p className="font-semibold">{project.title}</p>

                {project.description && (
                  <p className="text-sm text-gray-700">{project.description}</p>
                )}

                {project.technologies && (
                  <p className="text-sm text-gray-500">
                    Technologies: {project.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
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

import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

function Preview({ resumeData }) {
  const containerRef = useRef(null);

  const {
    personal = {},
    skills = [],
    groupedSkills = [],
    education = {},
    projects = [],
    achievements = [],
    certificates = [],
  } = resumeData || {};

  const sections = [];

  // 🔹 PERSONAL
  sections.push(
    <section key="personal">
      <h1 className="text-2xl font-bold">
        {personal.fullName || "Your Name"}
      </h1>
      <p className="text-sm text-gray-600">
        {personal.email}
        {personal.phone && ` | ${personal.phone}`}
        {personal.location && ` | ${personal.location}`}
      </p>
    </section>
  );

  // 🔹 SUMMARY
  if (personal.summary) {
    sections.push(
      <section key="summary">
        <h3 className="font-semibold border-b pb-1 mt-4">
          Professional Summary
        </h3>
        <p className="text-sm mt-1">{personal.summary}</p>
      </section>
    );
  }

  // 🔹 SKILLS (GROUPED + FALLBACK)
  if (skills.length > 0) {
    sections.push(
      <section key="skills">
        <h3 className="font-semibold border-b pb-1 mt-4">
          Skills
        </h3>

        <div className="mt-2 space-y-1">
          {groupedSkills && groupedSkills.length > 0 ? (
            groupedSkills.map((group, i) => (
              <p key={i} className="text-sm">
                <span className="font-medium">
                  {group.category}:{" "}
                </span>
                {group.items.join(", ")}
              </p>
            ))
          ) : (
            <p className="text-sm">
              {skills.join(", ")}
            </p>
          )}
        </div>
      </section>
    );
  }

  // 🔹 EDUCATION
  if (education.college) {
    sections.push(
      <section key="education">
        <h3 className="font-semibold border-b pb-1 mt-4">
          Education
        </h3>
        <p className="font-medium">
          {education.degree} – {education.college}
        </p>
        <p className="text-sm text-gray-600">
          {education.year}
          {education.gpa && ` | GPA: ${education.gpa}`}
        </p>
      </section>
    );
  }

  // 🔥 PROJECTS
  if (projects.length > 0) {
    sections.push(
      <section key="projects-heading">
        <h3 className="font-semibold border-b pb-1 mt-4">
          Projects
        </h3>
      </section>
    );

    projects.forEach((p, i) => {
      sections.push(
        <section key={`project-${i}`}>
          <p className="font-semibold">{p.title}</p>
          {p.description && (
            <p className="text-sm">{p.description}</p>
          )}
          {p.technologies && (
            <p className="text-sm text-gray-600">
              Technologies: {p.technologies}
            </p>
          )}
        </section>
      );
    });
  }

  // 🔥 ACHIEVEMENTS
  if (achievements.length > 0) {
    sections.push(
      <section key="achievements-heading">
        <h3 className="font-semibold border-b pb-1 mt-4">
          Achievements
        </h3>
      </section>
    );

    achievements.forEach((a, i) => {
      sections.push(
        <section key={`achievement-${i}`}>
          <p className="font-medium">• {a.title}</p>
          {a.description && (
            <p className="text-sm text-gray-600 ml-3">
              {a.description}
            </p>
          )}
        </section>
      );
    });
  }

  // 🔥 CERTIFICATES (FIXED + LINK IN NAME)
  const validCertificates = certificates.filter(
    (c) => c.name || c.issuer || c.year || c.link
  );

  if (validCertificates.length > 0) {
    sections.push(
      <section key="certificates-heading">
        <h3 className="font-semibold border-b pb-1 mt-4">
          Certificates
        </h3>
      </section>
    );

    validCertificates.forEach((c, i) => {
      sections.push(
        <section key={`certificate-${i}`}>
          {/* NAME AS LINK */}
          {c.link ? (
            <a
              href={c.link}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-blue-600 hover:underline"
            >
              {c.name}
            </a>
          ) : (
            <p className="font-medium">{c.name}</p>
          )}

          {/* ISSUER + YEAR */}
          {(c.issuer || c.year) && (
            <p className="text-sm text-gray-600">
              {c.issuer}
              {c.issuer && c.year && " • "}
              {c.year}
            </p>
          )}
        </section>
      );
    });
  }

  // 🔥 DOWNLOAD PDF
  const handleDownload = () => {
    const element = containerRef.current;

    const opt = {
      margin: 0,
      filename: "resume.pdf",
      html2canvas: { scale: 2, scrollY: 0 },
      pagebreak: { mode: ["css"] },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">

      {/* PREVIEW */}
      <div ref={containerRef}>
        <div className="w-[794px] min-h-[1123px] bg-white p-6 shadow-lg">
          {sections.map((section, index) => (
            <div key={index} className="mb-3 break-inside-avoid">
              {section}
            </div>
          ))}
        </div>
      </div>

      {/* BUTTON */}
      <button
        onClick={handleDownload}
        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Download PDF
      </button>

    </div>
  );
}

export default Preview;
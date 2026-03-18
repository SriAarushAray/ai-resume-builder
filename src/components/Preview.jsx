import React, { useRef } from "react";
import html2pdf from "html2pdf.js";

function Preview({ resumeData }) {
  const containerRef = useRef(null);

  const {
    personal = {},
    skills = [],
    education = {},
    projects = [],
    achievements = [],
    certificates = [],
  } = resumeData || {};

  const handleDownload = () => {
    const element = containerRef.current;

    const opt = {
      margin: 0,
      filename: "resume.pdf",
      html2canvas: {
        scale: 2,
        scrollY: 0,
      },
      pagebreak: {
        mode: ["css"],
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100">

      {/* PREVIEW */}
      <div ref={containerRef}>
        <div className="w-[794px] bg-white p-6 shadow-lg">

          {/* PERSONAL */}
          <section className="mb-4">
            <h1 className="text-2xl font-bold">
              {personal.fullName || "Your Name"}
            </h1>
            <p className="text-sm text-gray-600">
              {personal.email}
              {personal.phone && ` | ${personal.phone}`}
              {personal.location && ` | ${personal.location}`}
            </p>
          </section>

          {/* SUMMARY */}
          {personal.summary && (
            <section className="mb-4">
              <h3 className="font-semibold border-b pb-1 mb-2">
                Professional Summary
              </h3>
              <p className="text-sm">{personal.summary}</p>
            </section>
          )}

          {/* SKILLS */}
          {skills.length > 0 && (
            <section className="mb-4">
              <h3 className="font-semibold border-b pb-1 mb-2">
                Skills
              </h3>
              <p className="text-sm">
                {skills.join(", ")}
              </p>
            </section>
          )}

          {/* EDUCATION */}
          {education.college && (
            <section className="mb-4">
              <h3 className="font-semibold border-b pb-1 mb-2">
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
          )}

          {/* PROJECTS */}
          {projects.length > 0 && (
            <section className="mb-4">
              <h3 className="font-semibold border-b pb-1 mb-2">
                Projects
              </h3>

              {projects.map((p, i) => (
                <div key={i} className="mb-2">
                  <p className="font-medium">{p.title}</p>
                  {p.description && (
                    <p className="text-sm">{p.description}</p>
                  )}
                  {p.technologies && (
                    <p className="text-sm text-gray-600">
                      Technologies: {p.technologies}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* ACHIEVEMENTS */}
          {achievements.length > 0 && (
            <section className="mb-4">
              <h3 className="font-semibold border-b pb-1 mb-2">
                Achievements
              </h3>

              {achievements.map((a, i) => (
                <div key={i} className="mb-2">
                  <p className="font-medium">• {a.title}</p>
                  {a.description && (
                    <p className="text-sm text-gray-600 ml-3">
                      {a.description}
                    </p>
                  )}
                </div>
              ))}
            </section>
          )}

          {/* CERTIFICATES (SAFE VERSION) */}
          {certificates.length > 0 && (
            <section className="mb-4">
              <h3 className="font-semibold border-b pb-1 mb-2">
                Certificates
              </h3>

              {certificates.map((c, i) => (
                <div key={i} className="mb-2">
                  
                  {/* NAME (CLICKABLE IF LINK EXISTS) */}
                  {c.link ? (
                    <a
                      href={c.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600"
                    >
                      {c.name}
                    </a>
                  ) : (
                    <p className="font-medium">{c.name}</p>
                  )}

                  {/* META */}
                  {(c.issuer || c.year) && (
                    <p className="text-sm text-gray-600">
                      {c.issuer}
                      {c.issuer && c.year && " • "}
                      {c.year}
                    </p>
                  )}

                </div>
              ))}
            </section>
          )}

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
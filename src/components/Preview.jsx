import React, { useRef, useState, useLayoutEffect } from "react";

function Preview({ resumeData }) {
  const containerRef = useRef(null);
  const [breakIndexes, setBreakIndexes] = useState([]);

  const {
    personal = {},
    skills = [],
    education = {},
    projects = [],
    achievements = [],
    certificates = [],
  } = resumeData || {};

  const sections = [];

  // 🔹 PERSONAL
  sections.push(
    <section key="personal" className="section">
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
      <section key="summary" className="section">
        <h3 className="heading">Professional Summary</h3>
        <p className="text-sm mt-1">{personal.summary}</p>
      </section>
    );
  }

  // 🔹 SKILLS
  if (skills.length > 0) {
    sections.push(
      <section key="skills" className="section">
        <h3 className="heading">Skills</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {skills.map((s, i) => (
            <span key={i} className="tag">{s}</span>
          ))}
        </div>
      </section>
    );
  }

  // 🔹 EDUCATION
  if (education.college) {
    sections.push(
      <section key="education" className="section">
        <h3 className="heading">Education</h3>
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

  // 🔥 PROJECTS (split per item)
  if (projects.length > 0) {
    sections.push(
      <section key="projects-heading" className="section">
        <h3 className="heading">Projects</h3>
      </section>
    );

    projects.forEach((p, i) => {
      sections.push(
        <section key={`project-${i}`} className="section">
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

  // 🔥 ACHIEVEMENTS (split per item)
  if (achievements.length > 0) {
    sections.push(
      <section key="achievements-heading" className="section">
        <h3 className="heading">Achievements</h3>
      </section>
    );

    achievements.forEach((a, i) => {
      sections.push(
        <section key={`achievement-${i}`} className="section">
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

  // 🔥 CERTIFICATES (split per item)
  if (certificates.length > 0) {
    sections.push(
      <section key="certificates-heading" className="section">
        <h3 className="heading">Certificates</h3>
      </section>
    );

    certificates.forEach((c, i) => {
      sections.push(
        <section key={`certificate-${i}`} className="section">
          <p className="font-medium">{c.name}</p>
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

  // 🔥 PAGE BREAK LOGIC
  useLayoutEffect(() => {
    if (!containerRef.current) return;

    requestAnimationFrame(() => {
      const A4_HEIGHT = 1123;

      const sectionNodes = Array.from(
        containerRef.current.querySelectorAll(".section")
      );

      let currentHeight = 0;
      const newBreaks = [];

      sectionNodes.forEach((section, index) => {
        const height = section.getBoundingClientRect().height;

        if (currentHeight + height > A4_HEIGHT) {
          newBreaks.push(index);
          currentHeight = 0;
        }

        currentHeight += height;
      });

      setBreakIndexes(newBreaks);
    });
  }, [resumeData]);

  return (
    <div className="preview-container">
      <div className="doc-page" ref={containerRef}>
        {sections.map((section, index) => (
          <React.Fragment key={index}>
            {breakIndexes.includes(index) && (
              <div className="page-break">Page Break</div>
            )}
            {section}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export default Preview;
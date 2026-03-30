import React, { useEffect, useMemo, useRef, useState } from "react";

const PX_PER_MM = 96 / 25.4;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const A4_WIDTH_PX = A4_WIDTH_MM * PX_PER_MM;
const A4_HEIGHT_PX = A4_HEIGHT_MM * PX_PER_MM;
const PAGE_PADDING_PX = 24;
const PAGE_CONTENT_HEIGHT_PX = A4_HEIGHT_PX - PAGE_PADDING_PX * 2;

function Preview({ resumeData }) {
  const containerRef = useRef(null);
  const blockRefs = useRef([]);
  const [paginatedBlockIndexes, setPaginatedBlockIndexes] = useState([]);

  const {
    personal = {},
    skills = [],
    education = {},
    experiences = [],
    projects = [],
    achievements = [],
    certificates = [],
  } = resumeData || {};

  const contentBlocks = useMemo(() => {
    const blocks = [];
    const filteredSkills = skills.filter((skill) => Boolean(skill?.trim()));
    const filteredProjects = projects.filter(
      (project) =>
        project?.title?.trim() ||
        project?.technologies?.trim() ||
        (Array.isArray(project?.points) && project.points.some((point) => point?.trim())),
    );
    const filteredExperiences = experiences.filter(
      (experience) =>
        experience?.company?.trim() ||
        experience?.role?.trim() ||
        experience?.duration?.trim() ||
        experience?.description?.trim(),
    );
    const filteredAchievements = achievements.filter(
      (achievement) => achievement?.title?.trim() || achievement?.description?.trim(),
    );
    const filteredCertificates = certificates.filter(
      (certificate) =>
        certificate?.name?.trim() ||
        certificate?.issuer?.trim() ||
        certificate?.year?.trim() ||
        certificate?.link?.trim(),
    );

    blocks.push({
      key: "personal",
      node: (
        <section className="mb-4 text-center">
          <h1 className="text-2xl font-bold">{personal.fullName || "Your Name"}</h1>
          <p className="text-sm text-gray-600">
            {personal.email}
            {personal.phone && ` | ${personal.phone}`}
            {personal.location && ` | ${personal.location}`}
          </p>
        </section>
      ),
    });

    if (personal.summary?.trim()) {
      blocks.push({
        key: "summary",
        node: (
          <section className="mb-4">
            <h3 className="font-semibold border-b pb-1 mb-2">Professional Summary</h3>
            <p className="text-sm">{personal.summary}</p>
          </section>
        ),
      });
    }

    if (filteredSkills.length > 0) {
      blocks.push({
        key: "skills",
        node: (
          <section className="mb-4">
            <h3 className="font-semibold border-b pb-1 mb-2">Skills</h3>
            <p className="text-sm">{filteredSkills.join(", ")}</p>
          </section>
        ),
      });
    }

    if (education.college?.trim()) {
      blocks.push({
        key: "education",
        node: (
          <section className="mb-4">
            <h3 className="font-semibold border-b pb-1 mb-2">Education</h3>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">
                  {education.degree} - {education.college}
                </p>
              </div>
              {(education.gpa || education.year) && (
                <p className="text-sm text-gray-600 text-right whitespace-nowrap">
                  {education.gpa && `CGPA: ${education.gpa}`}
                  {education.gpa && education.year && " | "}
                  {education.year}
                </p>
              )}
            </div>
          </section>
        ),
      });
    }

    if (filteredProjects.length > 0) {
      filteredProjects.forEach((project, index) => {
        blocks.push({
          key: `project-${index}`,
          node: (
            <section className="mb-4">
              {index === 0 && <h3 className="font-semibold border-b pb-1 mb-2">Projects</h3>}
              <div className="mb-2">
                <p className="font-medium">{project.title}</p>
                {Array.isArray(project.points) && project.points.some((point) => point?.trim()) ? (
                  <ul className="text-sm list-disc ml-5">
                    {project.points
                      .filter((point) => point?.trim())
                      .map((point, pointIndex) => (
                        <li key={pointIndex}>{point}</li>
                      ))}
                  </ul>
                ) : null}
                {project.technologies && (
                  <p className="text-sm text-gray-600">Technologies: {project.technologies}</p>
                )}
              </div>
            </section>
          ),
        });
      });
    }

    if (filteredExperiences.length > 0) {
      filteredExperiences.forEach((experience, index) => {
        blocks.push({
          key: `experience-${index}`,
          keepTogether: true,
          node: (
            <section className="mb-4 break-inside-avoid keep-together">
              {index === 0 && <h3 className="font-semibold border-b pb-1 mb-2">Experience</h3>}
              <div className="mb-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium">
                      • 
                      {experience.company}
                      {experience.company && experience.role && " | "}
                      {experience.role}
                    </p>
                  </div>

                  {experience.duration && (
                    <p className="text-sm text-gray-600 text-right whitespace-nowrap">
                      {experience.duration}
                    </p>
                  )}
                </div>

                {experience.description && (
                  <p className="text-sm text-gray-700 mt-1">{experience.description}</p>
                )}
              </div>
            </section>
          ),
        });
      });
    }

    if (filteredAchievements.length > 0) {
      filteredAchievements.forEach((achievement, index) => {
        blocks.push({
          key: `achievement-${index}`,
          node: (
            <section className="mb-4">
              {index === 0 && <h3 className="font-semibold border-b pb-1 mb-2">Achievements</h3>}
              <div className="mb-2">
                <p className="font-medium">• {achievement.title}</p>
                {achievement.description && (
                  <p className="text-sm text-gray-600 ml-3">{achievement.description}</p>
                )}
              </div>
            </section>
          ),
        });
      });
    }

    if (filteredCertificates.length > 0) {
      filteredCertificates.forEach((certificate, index) => {
        blocks.push({
          key: `certificate-${index}`,
          keepTogether: true,
          node: (
            <section className="mb-4 break-inside-avoid keep-together">
              {index === 0 && <h3 className="font-semibold border-b pb-1 mb-2">Certificates</h3>}
              <div className="mb-2">
                <div className="flex items-start justify-between gap-3">
                  {certificate.link ? (
                    <a
                      href={certificate.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-medium text-blue-600"
                    >
                      {certificate.name}
                    </a>
                  ) : (
                    <p className="font-medium">{certificate.name}</p>
                  )}

                  {certificate.year && (
                    <p className="text-sm text-gray-600 text-right whitespace-nowrap">{certificate.year}</p>
                  )}
                </div>

                {certificate.issuer && <p className="text-sm text-gray-600">{certificate.issuer}</p>}
              </div>
            </section>
          ),
        });
      });
    }

    return blocks;
  }, [achievements, certificates, education, experiences, personal, projects, skills]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      blockRefs.current = blockRefs.current.slice(0, contentBlocks.length);
      const heights = contentBlocks.map((_, index) => {
        const element = blockRefs.current[index];
        if (!element) {
          return 0;
        }

        return element.getBoundingClientRect().height;
      });

      if (heights.length === 0) {
        setPaginatedBlockIndexes([]);
        return;
      }

      const nextPages = [];
      let currentPage = [];
      let usedHeight = 0;

      heights.forEach((height, index) => {
        const blockHeight = Math.max(1, height);
        const block = contentBlocks[index];

        if (
          block?.keepTogether &&
          currentPage.length > 0 &&
          usedHeight + blockHeight > PAGE_CONTENT_HEIGHT_PX
        ) {
          nextPages.push(currentPage);
          currentPage = [index];
          usedHeight = blockHeight;
          return;
        }

        if (currentPage.length > 0 && usedHeight + blockHeight > PAGE_CONTENT_HEIGHT_PX) {
          nextPages.push(currentPage);
          currentPage = [index];
          usedHeight = blockHeight;
          return;
        }

        currentPage.push(index);
        usedHeight += blockHeight;
      });

      if (currentPage.length > 0) {
        nextPages.push(currentPage);
      }

      setPaginatedBlockIndexes((prevPages) => {
        const prevKey = JSON.stringify(prevPages);
        const nextKey = JSON.stringify(nextPages);
        return prevKey === nextKey ? prevPages : nextPages;
      });
    });

    return () => cancelAnimationFrame(frameId);
  }, [contentBlocks]);

  const handleDownload = async () => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const pageElements = Array.from(element.querySelectorAll('[data-resume-page="true"]'));

    if (pageElements.length === 0) {
      return;
    }

    const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf"),
    ]);

    const pdf = new jsPDF({
      unit: "mm",
      format: "a4",
      orientation: "portrait",
      compress: true,
    });

    for (let pageIndex = 0; pageIndex < pageElements.length; pageIndex += 1) {
      const pageElement = pageElements[pageIndex];
      const canvas = await html2canvas(pageElement, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imageData = canvas.toDataURL("image/jpeg", 0.98);

      if (pageIndex > 0) {
        pdf.addPage();
      }

      pdf.addImage(imageData, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, "FAST");
    }

    pdf.save("resume.pdf");
  };

  const previewPages = useMemo(() => {
    const totalBlocks = contentBlocks.length;

    if (totalBlocks === 0) {
      return [];
    }

    const sanitizedPages = paginatedBlockIndexes
      .map((page) => page.filter((blockIndex) => blockIndex >= 0 && blockIndex < totalBlocks))
      .filter((page) => page.length > 0);

    if (sanitizedPages.length > 0) {
      return sanitizedPages;
    }

    return [contentBlocks.map((_, index) => index)];
  }, [contentBlocks, paginatedBlockIndexes]);

  return (
    <div className="relative flex flex-col items-center p-6 bg-gray-100">
      {/* PREVIEW */}
      <div ref={containerRef} className="flex flex-col items-center gap-6">
        {previewPages.map((pageBlockIndexes, pageIndex) => (
          <React.Fragment key={`page-${pageIndex}`}>
            <div
              data-resume-page="true"
              className="bg-white p-6 shadow-lg overflow-hidden"
              style={{ width: `${A4_WIDTH_MM}mm`, height: `${A4_HEIGHT_MM}mm` }}
            >
              {pageBlockIndexes.map((blockIndex) => {
                const block = contentBlocks[blockIndex];

                if (!block) {
                  return null;
                }

                return (
                  <div key={block.key} className="flow-root">
                    {block.node}
                  </div>
                );
              })}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* MEASURE BLOCKS OFFSCREEN TO PAGINATE AT TRUE A4 HEIGHT */}
      <div className="absolute -left-[9999px] top-0 opacity-0 pointer-events-none" aria-hidden="true">
        <div style={{ width: `${A4_WIDTH_MM}mm` }} className="p-6">
          {contentBlocks.map((block, index) => (
            <div
              key={`measure-${block.key}`}
              className="flow-root"
              ref={(element) => {
                blockRefs.current[index] = element;
              }}
            >
              {block.node}
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
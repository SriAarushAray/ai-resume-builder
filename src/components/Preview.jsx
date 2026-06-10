import React, { useEffect, useMemo, useRef, useState } from "react";

const PX_PER_MM = 96 / 25.4;
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;
const A4_WIDTH_PX = A4_WIDTH_MM * PX_PER_MM;
const A4_HEIGHT_PX = A4_HEIGHT_MM * PX_PER_MM;
const PAGE_PADDING_PX = 24;
const PAGE_CONTENT_HEIGHT_PX = A4_HEIGHT_PX - PAGE_PADDING_PX * 2;

const OPTIMAL_FONTS = {
  minimalist: "EB Garamond",
  modern: "Inter",
  executive: "Cormorant Garamond",
  creative: "Plus Jakarta Sans",
  "photo-header": "Lora",
  "photo-sidebar": "DM Sans",
  "skills-table": "Roboto",
  "two-column": "Nunito",
  timeline: "Poppins"
};

// --- Custom component for Two Column Layout templates ---
function TwoColumnLayout({ resumeData, template, tpl, lineSpacing, sectionSpacing }) {
  const {
    personal = {},
    skills = [],
    education = {},
    experiences = [],
    projects = [],
    achievements = [],
    certificates = [],
    publications = [],
    responsibilities = [],
    sectionOrder = [],
    hiddenSections = []
  } = resumeData;

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
  const filteredPublications = publications.filter(
    (pub) => pub?.title?.trim() || pub?.date?.trim() || pub?.description?.trim(),
  );
  const filteredResponsibilities = responsibilities.filter(
    (resp) => resp?.role?.trim() || resp?.organization?.trim() || resp?.description?.trim(),
  );

  const isPhotoSidebar = template === "photo-sidebar";

  return (
    <div className="flex h-full w-full">
      {/* LEFT COLUMN / SIDEBAR */}
      <div 
        className={`w-[33%] h-full p-6 flex flex-col shrink-0 text-left ${
          isPhotoSidebar 
            ? "bg-teal-950 text-white" 
            : "bg-slate-50 text-slate-800 border-r border-slate-200"
        }`}
      >
        {/* Photo for photo-sidebar */}
        {isPhotoSidebar && personal.photo && (
          <div className="mb-4 text-center">
            <img
              src={personal.photo}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mx-auto border-2 border-teal-700/50"
            />
          </div>
        )}

        {/* Name and Title if photo-sidebar */}
        {isPhotoSidebar && (
          <div className="mb-5 text-center">
            <h1 className="text-xl font-bold tracking-tight text-white">{personal.fullName || "Your Name"}</h1>
            {experiences[0]?.role && (
              <p className="text-[10px] text-teal-300 font-semibold mt-1 tracking-wider uppercase">{experiences[0].role}</p>
            )}
          </div>
        )}

        {/* Contact Info */}
        <div className="space-y-3 mb-6">
          <h4 className={`text-[10px] font-bold uppercase tracking-wider ${isPhotoSidebar ? "text-teal-400" : "text-slate-500"}`}>Contact</h4>
          <div className="space-y-2 text-[10px] leading-tight">
            {personal.email && (
              <p className="flex items-center gap-1.5 truncate">
                <span>✉️</span>
                <span className="truncate">{personal.email}</span>
              </p>
            )}
            {personal.phone && (
              <p className="flex items-center gap-1.5">
                <span>📞</span>
                <span>{personal.phone}</span>
              </p>
            )}
            {personal.location && (
              <p className="flex items-center gap-1.5">
                <span>📍</span>
                <span>{personal.location}</span>
              </p>
            )}
            
            {/* Socials */}
            {personal.linkedin && (
              <p className="flex items-center gap-1.5">
                <span>🔗</span>
                <span className="truncate">{personal.linkedin}</span>
              </p>
            )}
            {personal.github && (
              <p className="flex items-center gap-1.5">
                <span>🐙</span>
                <span className="truncate">{personal.github}</span>
              </p>
            )}
            {personal.portfolio && (
              <p className="flex items-center gap-1.5">
                <span>🌐</span>
                <span className="truncate">{personal.portfolio}</span>
              </p>
            )}
          </div>
        </div>

        {/* Skills */}
        {filteredSkills.length > 0 && !hiddenSections.includes("skills") && (
          <div className="space-y-3 mb-6">
            <h4 className={`text-[10px] font-bold uppercase tracking-wider ${isPhotoSidebar ? "text-teal-400" : "text-slate-500"}`}>Skills</h4>
            <div className="space-y-2">
              {filteredSkills.map((skill, index) => {
                const level = resumeData.skillLevels?.[skill] || "Intermediate";
                const percent = level === "Beginner" ? 30 : level === "Intermediate" ? 60 : level === "Advanced" ? 85 : 100;
                return (
                  <div key={index} className="space-y-0.5">
                    <div className="flex justify-between text-[9px] font-medium">
                      <span className="truncate">{skill}</span>
                      <span className="opacity-70">{level}</span>
                    </div>
                    <div className={`w-full rounded-full h-1 ${isPhotoSidebar ? "bg-teal-900/60" : "bg-slate-200"}`}>
                      <div 
                        className={`h-1 rounded-full ${isPhotoSidebar ? "bg-teal-400" : "bg-indigo-600"}`} 
                        style={{ width: `${percent}%` }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Education */}
        {education.college && !hiddenSections.includes("education") && (
          <div className="space-y-3">
            <h4 className={`text-[10px] font-bold uppercase tracking-wider ${isPhotoSidebar ? "text-teal-400" : "text-slate-500"}`}>Education</h4>
            <div className="space-y-1 text-[10px]">
              <p className="font-bold text-[9px] leading-tight">{education.college}</p>
              <p className="opacity-95">{education.degree}{education.course ? ` in ${education.course}` : ""}</p>
              <p className="opacity-75">{education.year}</p>
              {education.gpa && <p className="opacity-75">GPA: {education.gpa}</p>}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN / MAIN PANEL */}
      <div className="flex-1 h-full p-6 flex flex-col overflow-hidden text-left bg-white">
        {/* Name and Title if two-column template */}
        {!isPhotoSidebar && (
          <div className="mb-4 pb-3 border-b border-slate-200">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">{personal.fullName || "Your Name"}</h1>
            {experiences[0]?.role && (
              <p className="text-xs font-semibold text-indigo-600 mt-1 uppercase tracking-wider">{experiences[0].role}</p>
            )}
          </div>
        )}

        {/* Sections in right column */}
        <div className="space-y-4 overflow-y-auto pr-1 flex-1">
          {sectionOrder.map((sectionKey) => {
            if (hiddenSections.includes(sectionKey)) {
              return null;
            }
            if (sectionKey === "personal" || sectionKey === "skills" || sectionKey === "education") {
              return null; // Rendered in sidebar
            }

            if (sectionKey === "summary" && personal.summary?.trim()) {
              return (
                <div key="summary" style={{ marginBottom: `${sectionSpacing}px` }}>
                  <h3 className={tpl.sectionHeader}>Profile</h3>
                  <p className="text-xs text-slate-700 leading-relaxed">{personal.summary}</p>
                </div>
              );
            }

            if (sectionKey === "experience" && filteredExperiences.length > 0) {
              return (
                <div key="experience" style={{ marginBottom: `${sectionSpacing}px` }}>
                  <h3 className={tpl.sectionHeader}>Experience</h3>
                  <div className="space-y-3">
                    {filteredExperiences.map((exp, index) => (
                      <div key={index} className="text-xs">
                        <div className="flex justify-between items-baseline font-bold text-slate-900">
                          <span>{exp.company}</span>
                          <span className={tpl.dateClass}>{exp.duration}</span>
                        </div>
                        <div className="italic text-slate-650 mb-1">{exp.role} {exp.location && `· ${exp.location}`}</div>
                        {Array.isArray(exp.points) && exp.points.some((p) => p?.trim()) ? (
                          <ul className={tpl.bulletClass}>
                            {exp.points
                              .filter((p) => p?.trim())
                              .map((point, pi) => (
                                <li key={pi} style={{ marginTop: pi > 0 ? `${lineSpacing}px` : "0" }}>
                                  {point}
                                </li>
                              ))}
                          </ul>
                        ) : exp.description ? (
                          <p className="text-slate-700 pl-4">{exp.description}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === "project" && filteredProjects.length > 0) {
              return (
                <div key="project" style={{ marginBottom: `${sectionSpacing}px` }}>
                  <h3 className={tpl.sectionHeader}>Projects</h3>
                  <div className="space-y-3">
                    {filteredProjects.map((proj, index) => (
                      <div key={index} className="text-xs">
                        <div className="flex justify-between items-baseline font-bold text-slate-900">
                          <span>
                            {proj.title}
                            {proj.technologies && <span className="font-normal text-slate-500"> | {proj.technologies}</span>}
                          </span>
                          <span className={tpl.dateClass}>{proj.duration}</span>
                        </div>
                        {Array.isArray(proj.points) && proj.points.some((p) => p?.trim()) ? (
                          <ul className={tpl.bulletClass}>
                            {proj.points
                              .filter((p) => p?.trim())
                              .map((point, pi) => (
                                <li key={pi} style={{ marginTop: pi > 0 ? `${lineSpacing}px` : "0" }}>
                                  {point}
                                </li>
                              ))}
                          </ul>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === "achievement" && filteredAchievements.length > 0) {
              return (
                <div key="achievement" style={{ marginBottom: `${sectionSpacing}px` }}>
                  <h3 className={tpl.sectionHeader}>Achievements</h3>
                  <div className="space-y-1">
                    {filteredAchievements.map((ach, index) => (
                      <div key={index} className="text-xs">
                        <span className="font-bold">• {ach.title}</span>
                        {ach.description && <span className="text-slate-655 ml-1"> - {ach.description}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === "certificate" && filteredCertificates.length > 0) {
              return (
                <div key="certificate" style={{ marginBottom: `${sectionSpacing}px` }}>
                  <h3 className={tpl.sectionHeader}>Certifications</h3>
                  <div className="space-y-1.5">
                    {filteredCertificates.map((cert, index) => (
                      <div key={index} className="text-xs flex justify-between">
                        <span>
                          <span className="font-bold">{cert.name}</span>
                          {cert.issuer && <span className="text-slate-500"> | {cert.issuer}</span>}
                        </span>
                        <span className={tpl.dateClass}>{cert.year}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if (sectionKey === "publication" && filteredPublications.length > 0) {
              return (
                <div key="publication" style={{ marginBottom: `${sectionSpacing}px` }}>
                  <h3 className={tpl.sectionHeader}>Publications</h3>
                  <div className="space-y-1.5">
                    {filteredPublications.map((pub, index) => (
                      <div key={index} className="text-xs flex justify-between">
                        <span>
                          <span className="font-bold">{pub.title}</span>
                          {pub.description && <span className="text-slate-650 block text-[11px] mt-0.5">{pub.description}</span>}
                        </span>
                        <span className={tpl.dateClass}>{pub.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            if ((sectionKey === "responsibility" || sectionKey === "responsibilities") && filteredResponsibilities.length > 0) {
              return (
                <div key="responsibility" style={{ marginBottom: `${sectionSpacing}px` }}>
                  <h3 className={tpl.sectionHeader}>Responsibilities</h3>
                  <div className="space-y-1.5">
                    {filteredResponsibilities.map((resp, index) => (
                      <div key={index} className="text-xs">
                        <span className="font-bold">{resp.role}</span>
                        {resp.organization && <span className="text-slate-600">, {resp.organization}</span>}
                        {resp.description && <span className="text-slate-600"> - {resp.description}</span>}
                      </div>
                    ))}
                  </div>
                </div>
              );
            }

            return null;
          })}
        </div>
      </div>
    </div>
  );
}

const getBlockText = (blockKey, resumeData) => {
  const {
    personal = {},
    skills = [],
    groupedSkills = [],
    showGroupedSkills = false,
    education = {},
    experiences = [],
    projects = [],
    achievements = [],
    certificates = [],
    publications = [],
    responsibilities = []
  } = resumeData || {};

  const lines = [];

  if (blockKey === "personal") {
    lines.push(personal.fullName || "");
    const contact = [personal.email, personal.phone, personal.location].filter(Boolean);
    const links = [personal.linkedin, personal.github, personal.leetcode, personal.portfolio].filter(Boolean);
    if (contact.length > 0) lines.push(contact.join(" | "));
    if (links.length > 0) lines.push(links.join(" | "));
  } else if (blockKey === "summary") {
    if (personal.summary?.trim()) {
      lines.push("PROFESSIONAL SUMMARY");
      lines.push(personal.summary);
    }
  } else if (blockKey === "skills") {
    lines.push("TECHNICAL SKILLS");
    if (showGroupedSkills && groupedSkills?.length > 0) {
      groupedSkills.forEach(g => {
        lines.push(`${g.category}: ${g.items.join(", ")}`);
      });
    } else {
      lines.push(skills.filter(Boolean).join(", "));
    }
  } else if (blockKey === "education") {
    if (education.college?.trim()) {
      lines.push("EDUCATION");
      lines.push(`${education.college} - ${education.location || ""}`);
      lines.push(`${education.degree || ""}${education.course ? ` in ${education.course}` : ""}`);
      if (education.year || education.gpa) {
        lines.push(`${education.year || ""} ${education.gpa ? `GPA: ${education.gpa}` : ""}`);
      }
    }
  } else if (blockKey.startsWith("experience-")) {
    const index = parseInt(blockKey.split("-")[1], 10);
    const filteredExp = experiences.filter(
      (experience) =>
        experience?.company?.trim() ||
        experience?.role?.trim() ||
        experience?.duration?.trim() ||
        experience?.description?.trim(),
    );
    const exp = filteredExp[index];
    if (exp) {
      if (index === 0) lines.push("EXPERIENCE");
      lines.push(`${exp.company || ""} - ${exp.role || ""} (${exp.duration || ""})`);
      if (Array.isArray(exp.points)) {
        exp.points.filter(Boolean).forEach(p => lines.push(`• ${p}`));
      } else if (exp.description) {
        lines.push(exp.description);
      }
    }
  } else if (blockKey.startsWith("project-")) {
    const index = parseInt(blockKey.split("-")[1], 10);
    const filteredProj = projects.filter(
      (project) =>
        project?.title?.trim() ||
        project?.technologies?.trim() ||
        (Array.isArray(project?.points) && project.points.some((point) => point?.trim())),
    );
    const proj = filteredProj[index];
    if (proj) {
      if (index === 0) lines.push("PROJECTS");
      lines.push(`${proj.title || ""} ${proj.technologies ? `| ${proj.technologies}` : ""} (${proj.duration || ""})`);
      if (proj.link) lines.push(proj.link);
      if (Array.isArray(proj.points)) {
        proj.points.filter(Boolean).forEach(p => lines.push(`• ${p}`));
      }
    }
  } else if (blockKey.startsWith("achievement-")) {
    const index = parseInt(blockKey.split("-")[1], 10);
    const filteredAch = achievements.filter(
      (achievement) => achievement?.title?.trim() || achievement?.description?.trim(),
    );
    const ach = filteredAch[index];
    if (ach) {
      if (index === 0) lines.push("ACHIEVEMENTS");
      lines.push(`${ach.title || ""} (${ach.date || ""})`);
      if (ach.description) lines.push(ach.description);
    }
  } else if (blockKey.startsWith("certificate-")) {
    const index = parseInt(blockKey.split("-")[1], 10);
    const filteredCert = certificates.filter(
      (certificate) =>
        certificate?.name?.trim() ||
        certificate?.issuer?.trim() ||
        certificate?.year?.trim() ||
        certificate?.link?.trim(),
    );
    const cert = filteredCert[index];
    if (cert) {
      if (index === 0) lines.push("CERTIFICATIONS");
      lines.push(`${cert.name || ""} - ${cert.issuer || ""} (${cert.year || ""})`);
      if (cert.link) lines.push(cert.link);
    }
  } else if (blockKey.startsWith("publication-")) {
    const index = parseInt(blockKey.split("-")[1], 10);
    const filteredPub = publications.filter(
      (pub) => pub?.title?.trim() || pub?.date?.trim() || pub?.description?.trim(),
    );
    const pub = filteredPub[index];
    if (pub) {
      if (index === 0) lines.push("PUBLICATIONS");
      lines.push(`${pub.title || ""} (${pub.date || ""})`);
      if (pub.description) lines.push(pub.description);
    }
  } else if (blockKey.startsWith("responsibility-")) {
    const index = parseInt(blockKey.split("-")[1], 10);
    const filteredResp = responsibilities.filter(
      (resp) => resp?.role?.trim() || resp?.organization?.trim() || resp?.description?.trim(),
    );
    const resp = filteredResp[index];
    if (resp) {
      if (index === 0) lines.push("RESPONSIBILITIES");
      lines.push(`${resp.role || ""} - ${resp.organization || ""} (${resp.duration || ""})`);
      if (resp.description) lines.push(resp.description);
    }
  }

  return lines;
};

function Preview({ resumeData, resumeName, layoutSettings }) {
  const containerRef = useRef(null);
  const blockRefs = useRef([]);
  const [paginatedBlockIndexes, setPaginatedBlockIndexes] = useState([]);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
    if (document.fonts) {
      document.fonts.ready.then(() => {
        setFontLoaded(true);
      });
    }
  }, []);

  const {
    sectionSpacing = 16,
    lineSpacing = 4,
    individualSpacing = {}
  } = layoutSettings || {};

  const {
    personal = {},
    skills = [],
    groupedSkills = [],
    showGroupedSkills = false,
    education = {},
    experiences = [],
    projects = [],
    achievements = [],
    certificates = [],
    publications = [],
    responsibilities = [],
    template: rawTemplate = "minimalist",
    fontSettings = { family: "auto", size: "10" },
    sectionOrder = [
      "personal",
      "summary",
      "skills",
      "education",
      "experience",
      "project",
      "achievement",
      "certificate",
      "publication",
      "responsibility"
    ],
    hiddenSections = []
  } = resumeData || {};

  const legacyTemplateMap = {
    minimal: "minimalist",
    corporate: "executive",
    tech: "modern"
  };
  const template = legacyTemplateMap[rawTemplate] || rawTemplate || "minimalist";

  // Resolve the font family selection
  const effectiveFont = useMemo(() => {
    if (!fontSettings || fontSettings.family === "auto") {
      return OPTIMAL_FONTS[template] || "EB Garamond";
    }
    return fontSettings.family;
  }, [fontSettings, template]);

  // Dynamically load Google Font
  useEffect(() => {
    if (effectiveFont) {
      const linkId = `google-font-${effectiveFont.replace(/\s+/g, "-").toLowerCase()}`;
      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${effectiveFont.replace(/\s+/g, "+")}:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap`;
        document.head.appendChild(link);
      }
    }
  }, [effectiveFont]);

  const isTwoColumn = template === "photo-sidebar" || template === "two-column";

  // Template Theme configuration mapping
  const tpl = useMemo(() => {
    if (template === "modern") {
      return {
        fontClass: "font-sans text-slate-800 leading-relaxed text-left",
        pageBg: "bg-white p-8",
        headerClass: "text-left border-b-2 border-blue-500 pb-3 mb-4",
        nameClass: "text-3xl font-black tracking-tight text-blue-600",
        contactClass: "text-[11px] text-slate-500 flex flex-wrap gap-x-3 mt-1",
        sectionHeader: "font-black text-xs text-blue-600 uppercase tracking-widest border-l-4 border-blue-500 pl-2 mb-1.5",
        subHeader: "font-bold text-slate-900 text-xs",
        dateClass: "text-blue-500 text-xs font-bold",
        bulletClass: "list-disc ml-5 text-xs text-slate-700 mt-1",
        divider: "border-slate-200 mt-2",
        linkClass: "text-blue-500 hover:underline font-medium"
      };
    } else if (template === "executive") {
      return {
        fontClass: "font-serif text-gray-900 leading-normal tracking-wide text-center",
        pageBg: "bg-white p-8 border-[6px] border-slate-200",
        headerClass: "text-center pb-2 mb-4 border-b-2 border-double border-slate-350",
        nameClass: "text-2xl font-bold uppercase tracking-widest text-slate-955",
        contactClass: "text-[11px] text-slate-700 flex flex-wrap justify-center gap-x-4 mt-1.5 italic",
        sectionHeader: "font-bold border-b border-slate-800 pb-2 mb-1 text-center uppercase tracking-widest text-xs text-slate-955",
        subHeader: "font-bold text-slate-950 text-xs uppercase",
        dateClass: "text-slate-800 text-xs font-semibold uppercase italic",
        bulletClass: "list-disc ml-5 text-xs text-slate-850 mt-1.5",
        divider: "border-slate-250 mt-2",
        linkClass: "text-slate-900 hover:underline font-bold"
      };
    } else if (template === "creative") {
      return {
        fontClass: "font-sans text-slate-900 leading-relaxed text-left",
        pageBg: "bg-white p-8",
        headerClass: "bg-slate-900 text-white p-6 -mx-8 -mt-8 mb-6 text-center border-b-4 border-violet-500",
        nameClass: "text-3xl font-extrabold tracking-tight text-white",
        contactClass: "text-[11px] text-slate-300 flex flex-wrap justify-center gap-x-3 mt-2",
        sectionHeader: "font-extrabold text-xs uppercase tracking-wider bg-violet-100 text-violet-750 px-3 py-1.5 rounded-lg inline-block mb-1.5 shadow-sm",
        subHeader: "font-bold text-slate-900 text-xs",
        dateClass: "text-violet-600 text-xs font-bold bg-violet-50 px-2 py-0.5 rounded",
        bulletClass: "list-disc ml-5 text-xs text-slate-700 mt-1",
        divider: "border-slate-100 mt-2",
        linkClass: "text-violet-600 hover:underline font-medium"
      };
    } else if (template === "photo-header") {
      return {
        fontClass: "font-serif text-slate-800 leading-relaxed text-left",
        pageBg: "bg-white p-8",
        headerClass: "text-left border-b border-slate-300 pb-4 mb-4 flex items-center gap-6",
        nameClass: "text-3xl font-extrabold text-slate-900 tracking-tight",
        contactClass: "text-[11px] text-slate-600 flex flex-wrap gap-x-3 mt-1",
        sectionHeader: "font-bold text-xs text-slate-900 uppercase tracking-wide border-b border-slate-300 pb-2 mb-1",
        subHeader: "font-bold text-slate-900 text-xs",
        dateClass: "text-slate-550 text-xs font-medium",
        bulletClass: "list-disc ml-5 text-xs text-slate-700 mt-1",
        divider: "border-slate-200 mt-2",
        linkClass: "text-blue-600 hover:underline font-medium"
      };
    } else if (template === "skills-table") {
      return {
        fontClass: "font-sans text-slate-800 leading-relaxed text-left",
        pageBg: "bg-white p-8",
        headerClass: "text-center pb-3 mb-4 border-b-2 border-emerald-500",
        nameClass: "text-3xl font-bold tracking-tight text-emerald-800",
        contactClass: "text-[11px] text-slate-500 flex flex-wrap justify-center gap-x-3 mt-1",
        sectionHeader: "font-bold text-xs text-emerald-800 uppercase tracking-widest border-l-4 border-emerald-500 pl-2 mb-1.5",
        subHeader: "font-bold text-slate-900 text-xs",
        dateClass: "text-emerald-600 text-xs font-semibold",
        bulletClass: "list-disc ml-5 text-xs text-slate-755 mt-1",
        divider: "border-slate-200 mt-2",
        linkClass: "text-emerald-700 hover:underline font-medium"
      };
    } else if (template === "timeline") {
      return {
        fontClass: "font-sans text-slate-850 leading-relaxed text-left",
        pageBg: "bg-white p-8",
        headerClass: "text-left pb-4 mb-4 border-b border-indigo-150",
        nameClass: "text-3xl font-extrabold tracking-tight text-indigo-950",
        contactClass: "text-[11px] text-indigo-650 flex flex-wrap gap-x-3 mt-1.5",
        sectionHeader: "font-extrabold text-xs text-indigo-900 uppercase tracking-wider mb-1.5 bg-indigo-50 px-2.5 py-1 rounded inline-block",
        subHeader: "font-bold text-slate-900 text-xs",
        dateClass: "text-indigo-650 text-xs font-semibold bg-indigo-55 px-1.5 py-0.5 rounded",
        bulletClass: "list-disc ml-5 text-xs text-slate-700 mt-1",
        divider: "border-indigo-100 mt-2",
        linkClass: "text-indigo-650 hover:underline font-medium"
      };
    } else if (template === "photo-sidebar") {
      return {
        fontClass: "font-sans text-slate-850 leading-relaxed text-left",
        pageBg: "bg-white",
        headerClass: "mb-3",
        nameClass: "text-2xl font-extrabold text-teal-950 tracking-tight",
        contactClass: "text-[10px] text-slate-300 flex flex-col gap-1.5",
        sectionHeader: "font-bold text-xs text-teal-900 uppercase tracking-wider border-b border-teal-800/20 pb-2 mb-1",
        subHeader: "font-bold text-slate-955 text-xs",
        dateClass: "text-teal-650 text-[10px] font-semibold",
        bulletClass: "list-disc ml-4 text-[11px] text-slate-700 mt-0.5",
        divider: "border-teal-900/10 mt-1.5",
        linkClass: "text-teal-700 hover:underline font-medium"
      };
    } else if (template === "two-column") {
      return {
        fontClass: "font-sans text-slate-850 leading-relaxed text-left",
        pageBg: "bg-white",
        headerClass: "mb-3",
        nameClass: "text-2xl font-bold text-slate-900 tracking-tight",
        contactClass: "text-[10px] text-slate-500 flex flex-col gap-1.5",
        sectionHeader: "font-bold text-xs text-slate-850 uppercase tracking-wider border-b border-slate-350 pb-2 mb-1",
        subHeader: "font-bold text-slate-955 text-xs",
        dateClass: "text-slate-550 text-[10px] font-semibold",
        bulletClass: "list-disc ml-4 text-[11px] text-slate-700 mt-0.5",
        divider: "border-slate-200 mt-1.5",
        linkClass: "text-indigo-600 hover:underline font-medium"
      };
    } else {
      // default: minimalist
      return {
        fontClass: "font-serif text-slate-800 leading-relaxed text-left",
        pageBg: "bg-white p-6",
        headerClass: "text-center mb-4",
        nameClass: "text-2xl font-bold text-gray-950",
        contactClass: "text-xs text-gray-600 flex flex-wrap justify-center gap-x-2 mt-1",
        sectionHeader: "font-bold border-b border-slate-800 pb-2 mb-1 uppercase tracking-wide text-xs text-gray-900",
        subHeader: "font-bold text-slate-900 text-xs",
        dateClass: "text-gray-600 text-xs font-semibold",
        bulletClass: "list-disc ml-5 text-xs text-slate-700 mt-1",
        divider: "border-slate-200 mt-2",
        linkClass: "text-blue-600 hover:underline font-medium"
      };
    }
  }, [template]);

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
    const filteredPublications = publications.filter(
      (pub) => pub?.title?.trim() || pub?.date?.trim() || pub?.description?.trim(),
    );
    const filteredResponsibilities = responsibilities.filter(
      (resp) => resp?.role?.trim() || resp?.organization?.trim() || resp?.description?.trim(),
    );

    const sectionBuilders = {
      personal: () => {
        const cleanUrl = (url) => {
          if (!url) return "";
          return url.replace(/https?:\/\/(www\.)?/, "").replace(/\/$/, "");
        };

        const headerItems = [];
        if (personal.phone) {
          headerItems.push(<span key="phone">{personal.phone}</span>);
        }
        if (personal.email) {
          headerItems.push(
            <a key="email" href={`mailto:${personal.email}`} className="hover:underline">
              {personal.email}
            </a>
          );
        }
        if (personal.location && template !== "minimalist" && template !== "executive") {
          headerItems.push(<span key="location">{personal.location}</span>);
        }
        if (personal.linkedin) {
          const url = personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`;
          headerItems.push(
            <a key="linkedin" href={url} target="_blank" rel="noopener noreferrer" className={tpl.linkClass}>
              {cleanUrl(personal.linkedin)}
            </a>
          );
        }
        if (personal.github) {
          const url = personal.github.startsWith("http") ? personal.github : `https://${personal.github}`;
          headerItems.push(
            <a key="github" href={url} target="_blank" rel="noopener noreferrer" className={tpl.linkClass}>
              {cleanUrl(personal.github)}
            </a>
          );
        }
        if (personal.leetcode) {
          const url = personal.leetcode.startsWith("http") ? personal.leetcode : `https://${personal.leetcode}`;
          headerItems.push(
            <a key="leetcode" href={url} target="_blank" rel="noopener noreferrer" className={tpl.linkClass}>
              {cleanUrl(personal.leetcode)}
            </a>
          );
        }
        if (personal.portfolio) {
          const url = personal.portfolio.startsWith("http") ? personal.portfolio : `https://${personal.portfolio}`;
          headerItems.push(
            <a key="portfolio" href={url} target="_blank" rel="noopener noreferrer" className={tpl.linkClass}>
              {cleanUrl(personal.portfolio)}
            </a>
          );
        }

        blocks.push({
          key: "personal",
          node: (
            <section className={tpl.headerClass}>
              {template === "photo-header" && personal.photo && (
                <img
                  src={personal.photo}
                  alt="Profile"
                  className="w-18 h-18 rounded-full object-cover border border-slate-350 shadow-sm shrink-0"
                  style={{ width: '72px', height: '72px' }}
                />
              )}
              <div className={`flex-1 ${tpl.headerClass.includes("text-center") ? "text-center" : "text-left"}`}>
                <h1 className={tpl.nameClass}>{personal.fullName || "Your Name"}</h1>
                {headerItems.length > 0 && (
                  <div className={`${tpl.contactClass} justify-center items-center flex-wrap`}>
                    {headerItems.reduce((acc, item, idx) => {
                      if (idx > 0) acc.push(<span key={`sep-${idx}`} className="opacity-40 select-none">|</span>);
                      acc.push(item);
                      return acc;
                    }, [])}
                  </div>
                )}
              </div>
            </section>
          ),
        });
      },
      summary: () => {
        if (personal.summary?.trim()) {
          blocks.push({
            key: "summary",
            node: (
              <section className="text-left">
                <h3 className={tpl.sectionHeader}>PROFESSIONAL SUMMARY</h3>
                <p className="text-xs text-slate-700 leading-relaxed">{personal.summary}</p>
              </section>
            ),
          });
        }
      },
      skills: () => {
        if (template === "skills-table" && filteredSkills.length > 0) {
          blocks.push({
            key: "skills",
            node: (
              <section className="text-left">
                <h3 className={tpl.sectionHeader}>TECHNICAL SKILLS</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2.5 mt-2">
                  {filteredSkills.map((skill, index) => {
                    const level = resumeData.skillLevels?.[skill] || "Intermediate";
                    const percent = level === "Beginner" ? 30 : level === "Intermediate" ? 60 : level === "Advanced" ? 85 : 100;
                    return (
                      <div key={index} className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-800 w-1/3 truncate">{skill}</span>
                        <div className="flex-1 flex items-center gap-2">
                          <div className="w-full bg-slate-200 rounded-full h-1.5">
                            <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${percent}%` }} />
                          </div>
                          <span className="text-[10px] text-slate-500 w-16 text-right font-medium">{level}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )
          });
        } else if (showGroupedSkills && Array.isArray(groupedSkills) && groupedSkills.length > 0) {
          blocks.push({
            key: "skills",
            node: (
              <section className="text-left">
                <h3 className={tpl.sectionHeader}>TECHNICAL SKILLS</h3>
                <div className="text-xs text-left">
                  {groupedSkills.map((group, idx) => (
                    <p 
                      key={idx} 
                      className="text-xs text-slate-800"
                      style={{ marginTop: idx > 0 ? `${lineSpacing}px` : "0" }}
                    >
                      <span className="font-bold text-slate-900">{group.category}</span>: {group.items.join(", ")}
                    </p>
                  ))}
                </div>
              </section>
            ),
          });
        } else if (filteredSkills.length > 0) {
          blocks.push({
            key: "skills",
            node: (
              <section className="text-left">
                <h3 className={tpl.sectionHeader}>TECHNICAL SKILLS</h3>
                <p className="text-xs text-slate-800 text-left">
                  {filteredSkills.join(", ")}
                </p>
              </section>
            ),
          });
        }
      },
      education: () => {
        if (education.college?.trim()) {
          blocks.push({
            key: "education",
            node: (
              <section className="text-left">
                <h3 className={tpl.sectionHeader}>EDUCATION</h3>
                <div className="flex justify-between items-baseline text-xs font-semibold text-slate-900">
                  <div className={tpl.subHeader}>{education.college}</div>
                  <div>{education.location}</div>
                </div>
                <div className="flex justify-between items-baseline text-xs italic text-slate-750 mt-0.5">
                  <div>
                    {education.degree}{education.course ? ` in ${education.course}` : ""}
                    {education.gpa && ` (CGPA: ${education.gpa})`}
                  </div>
                  <div className={tpl.dateClass}>{education.year}</div>
                </div>
              </section>
            ),
          });
        }
      },
      project: () => {
        if (filteredProjects.length > 0) {
          filteredProjects.forEach((project, index) => {
            blocks.push({
              key: `project-${index}`,
              node: (
                <section className="text-left">
                  {index === 0 && <h3 className={tpl.sectionHeader}>PROJECTS</h3>}
                  <div className="mb-2">
                    <div className="flex items-start justify-between gap-3 text-xs">
                      <p className={tpl.subHeader}>
                        {project.title}
                        {project.technologies && (
                          <span className="font-normal text-slate-500"> | {project.technologies}</span>
                        )}
                      </p>
                      {project.duration && (
                        <p className={`${tpl.dateClass} text-right whitespace-nowrap`}>
                          {project.duration}
                        </p>
                      )}
                    </div>
                    {Array.isArray(project.points) && project.points.some((point) => point?.trim()) ? (
                      <ul className={tpl.bulletClass}>
                        {project.points
                          .filter((point) => point?.trim())
                          .map((point, pointIndex) => (
                            <li 
                              key={pointIndex}
                              style={{ marginTop: pointIndex > 0 ? `${lineSpacing}px` : "0" }}
                            >
                              {point}
                            </li>
                          ))}
                      </ul>
                    ) : null}
                  </div>
                </section>
              ),
            });
          });
        }
      },
      experience: () => {
        if (filteredExperiences.length > 0) {
          if (template === "timeline") {
            blocks.push({
              key: "experience-timeline",
              keepTogether: false,
              node: (
                <section className="text-left">
                  <h3 className={tpl.sectionHeader}>EXPERIENCE</h3>
                  <div className="relative pl-5 border-l-2 border-indigo-250 ml-3.5 space-y-4 py-1">
                    {filteredExperiences.map((experience, index) => (
                      <div key={index} className="relative">
                        {/* Custom Timeline Dot */}
                        <div 
                          className="absolute -left-[28.5px] top-1 w-4 h-4 rounded-full bg-white border-[3.5px] border-indigo-650 shadow-sm"
                          style={{ width: '15px', height: '15px' }}
                        />
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs">
                              <span className="font-bold text-slate-900 text-xs">{experience.company}</span>
                              {experience.company && experience.role && " | "}
                              <span className="font-semibold text-slate-700">{experience.role}</span>
                            </p>
                          </div>
                          {experience.duration && (
                            <p className={`${tpl.dateClass} text-right whitespace-nowrap`}>
                              {experience.duration}
                            </p>
                          )}
                        </div>
                        {Array.isArray(experience.points) && experience.points.some((p) => p?.trim()) ? (
                          <ul className={tpl.bulletClass}>
                            {experience.points
                              .filter((p) => p?.trim())
                              .map((point, pi) => (
                                <li 
                                  key={pi}
                                  style={{ marginTop: pi > 0 ? `${lineSpacing}px` : "0" }}
                                >
                                  {point}
                                </li>
                              ))}
                          </ul>
                        ) : experience.description ? (
                          <p className="text-xs text-slate-700 mt-1 pl-2">{experience.description}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </section>
              )
            });
          } else {
            filteredExperiences.forEach((experience, index) => {
              blocks.push({
                key: `experience-${index}`,
                keepTogether: true,
                node: (
                  <section className="break-inside-avoid keep-together text-left">
                    {index === 0 && <h3 className={tpl.sectionHeader}>EXPERIENCE</h3>}
                    <div className="mb-2">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-xs">
                            {filteredExperiences.length > 1 && "• "}
                            <span className={`${tpl.subHeader} text-slate-900`}>{experience.company}</span>
                            {experience.company && experience.role && " | "}
                            <span className="font-semibold text-slate-700">{experience.role}</span>
                          </p>
                        </div>
                        {experience.duration && (
                          <p className={`${tpl.dateClass} text-right whitespace-nowrap`}>
                            {experience.duration}
                          </p>
                        )}
                      </div>
                      {Array.isArray(experience.points) && experience.points.some((p) => p?.trim()) ? (
                        <ul className={tpl.bulletClass}>
                          {experience.points
                            .filter((p) => p?.trim())
                            .map((point, pi) => (
                              <li 
                                key={pi}
                                style={{ marginTop: pi > 0 ? `${lineSpacing}px` : "0" }}
                              >
                                {point}
                              </li>
                            ))}
                        </ul>
                      ) : experience.description ? (
                        <p className="text-xs text-slate-700 mt-1 pl-4">{experience.description}</p>
                      ) : null}
                    </div>
                  </section>
                ),
              });
            });
          }
        }
      },
      achievement: () => {
        if (filteredAchievements.length > 0) {
          filteredAchievements.forEach((achievement, index) => {
            blocks.push({
              key: `achievement-${index}`,
              node: (
                <section className="text-left">
                  {index === 0 && <h3 className={tpl.sectionHeader}>ACHIEVEMENTS</h3>}
                  <div className="mb-2 text-xs">
                    <p className={tpl.subHeader}>• {achievement.title}</p>
                    {achievement.description && (
                      <p className="text-slate-650 ml-4 mt-0.5">{achievement.description}</p>
                    )}
                  </div>
                </section>
              ),
            });
          });
        }
      },
      certificate: () => {
        if (filteredCertificates.length > 0) {
          filteredCertificates.forEach((certificate, index) => {
            blocks.push({
              key: `certificate-${index}`,
              keepTogether: true,
              node: (
                <section className="break-inside-avoid keep-together text-left">
                  {index === 0 && <h3 className={tpl.sectionHeader}>CERTIFICATIONS</h3>}
                  <div className="mb-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-xs font-semibold">
                        {certificate.link ? (
                          <a
                            href={certificate.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={tpl.linkClass}
                          >
                            {certificate.name}
                          </a>
                        ) : (
                          certificate.name
                        )}
                        {certificate.issuer && (
                          <span className="font-normal text-slate-500"> | {certificate.issuer}</span>
                        )}
                      </p>
                      {certificate.year && (
                        <p className={`${tpl.dateClass} text-right whitespace-nowrap`}>{certificate.year}</p>
                      )}
                    </div>
                  </div>
                </section>
              ),
            });
          });
        }
      },
      publication: () => {
        if (filteredPublications.length > 0) {
          filteredPublications.forEach((pub, index) => {
            blocks.push({
              key: `publication-${index}`,
              keepTogether: true,
              node: (
                <section className="break-inside-avoid keep-together text-left">
                  {index === 0 && <h3 className={tpl.sectionHeader}>PUBLICATIONS</h3>}
                  <div className="mb-2">
                    <div className="flex items-start justify-between gap-3">
                      <p className={`${tpl.subHeader} text-xs`}>{pub.title}</p>
                      {pub.date && (
                        <p className={`${tpl.dateClass} text-right whitespace-nowrap`}>{pub.date}</p>
                      )}
                    </div>
                    {pub.description && (
                      <div className="text-xs text-slate-755 mt-1 pl-4 flex">
                        <span className="mr-2 inline-block">•</span>
                        <span>{pub.description}</span>
                      </div>
                    )}
                  </div>
                </section>
              ),
            });
          });
        }
      },
      responsibility: () => {
        if (filteredResponsibilities.length > 0) {
          filteredResponsibilities.forEach((resp, index) => {
            blocks.push({
              key: `responsibility-${index}`,
              keepTogether: true,
              node: (
                <section className="break-inside-avoid keep-together text-left">
                  {index === 0 && <h3 className={tpl.sectionHeader}>RESPONSIBILITIES</h3>}
                  <div className="mb-2 text-xs">
                    <div className="text-slate-900">
                      <span className={tpl.subHeader}>{resp.role}</span>
                      {resp.organization && <span>, {resp.organization}</span>}
                      {(resp.startDate || resp.endDate) && (
                        <span className={tpl.dateClass}> ({resp.startDate}{resp.startDate && resp.endDate ? '–' : ''}{resp.endDate})</span>
                      )}
                      {resp.description && <span>: {resp.description}</span>}
                    </div>
                  </div>
                </section>
              ),
            });
          });
        }
      }
    };

    const hidden = hiddenSections || [];
    sectionOrder.forEach(rawSecKey => {
      const secKey = rawSecKey === "responsibilities" ? "responsibility" : rawSecKey;
      if (hidden.includes(rawSecKey) || hidden.includes(secKey)) return;
      if (sectionBuilders[secKey]) {
        sectionBuilders[secKey]();
      }
    });

    return blocks;
  }, [achievements, certificates, education, experiences, personal, projects, skills, publications, responsibilities, groupedSkills, showGroupedSkills, sectionOrder, template, tpl, lineSpacing, hiddenSections]);

  useEffect(() => {
    if (isTwoColumn) return; // Bypassed for Two Column templates

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
        const block = contentBlocks[index];
        const groupKey = block.key.split("-")[0];
        const blockSpacing = individualSpacing?.[block.key] !== undefined
          ? individualSpacing[block.key]
          : individualSpacing?.[groupKey] !== undefined
          ? individualSpacing[groupKey]
          : sectionSpacing;

        const blockHeight = Math.max(1, height) + blockSpacing;

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
  }, [contentBlocks, fontLoaded, sectionSpacing, lineSpacing, individualSpacing, isTwoColumn]);

  const [downloading, setDownloading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState("idle"); // "idle" | "preparing" | "rendering" | "saving"

  const handleDownload = async () => {
    try {
      setDownloading(true);
      setDownloadStatus("preparing");
      const element = containerRef.current;

      if (!element) {
        console.error("Preview container not found");
        return;
      }

      const pageElements = Array.from(element.querySelectorAll('[data-resume-page="true"]'));

      if (pageElements.length === 0) {
        console.error("No resume pages found");
        return;
      }

      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import("html2canvas"),
        import("jspdf"),
      ]);

      // Wait for fonts to finish loading with a max timeout of 1 second
      setDownloadStatus("rendering");
      if (document.fonts && document.fonts.ready) {
        await Promise.race([
          document.fonts.ready,
          new Promise((resolve) => setTimeout(resolve, 1000))
        ]);
      }
      // Extra buffer for browser to finish paint after fonts loaded
      await new Promise((resolve) => setTimeout(resolve, 300));

      const pdf = new jsPDF({
        unit: "mm",
        format: "a4",
        orientation: "portrait",
        compress: true,
      });

      for (let pageIndex = 0; pageIndex < pageElements.length; pageIndex += 1) {
        const pageElement = pageElements[pageIndex];

        // Safe and clean html2canvas configuration with scroll reset
        const canvas = await html2canvas(pageElement, {
          scale: 1.2,
          useCORS: true,
          allowTaint: false,
          backgroundColor: "#ffffff",
          logging: false,
          scrollY: 0,
          scrollX: 0,
        });

        const imageData = canvas.toDataURL("image/jpeg", 0.70);

        if (pageIndex > 0) {
          pdf.addPage();
        }

        // Draw image first
        pdf.addImage(imageData, "JPEG", 0, 0, A4_WIDTH_MM, A4_HEIGHT_MM, undefined, "FAST");

        // Add invisible text layer on top of the image for perfect ATS parsing & selectability
        pdf.setFont("Helvetica");
        pdf.setFontSize(9);
        
        let textY = 15;
        const pageBlockIndexes = (previewPages && previewPages[pageIndex]) || [];
        pageBlockIndexes.forEach(blockIdx => {
          const block = contentBlocks[blockIdx];
          if (block) {
            const lines = getBlockText(block.key, resumeData);
            lines.forEach(line => {
              if (line && typeof line === 'string' && line.trim()) {
                pdf.text(line, 12, textY, { renderingMode: "invisible" });
                textY += 5;
                if (textY > A4_HEIGHT_MM - 15) {
                  textY = 15;
                }
              }
            });
          }
        });
      }

      setDownloadStatus("saving");
      const baseName = resumeName?.trim() || resumeData?.personal?.fullName?.trim() || "Untitled";
      const fileName = `${baseName.replace(/\s+/g, "_")}_resume.pdf`;
      pdf.save(fileName);
    } catch (error) {
      console.error("PDF download failed:", error);
      alert("PDF download failed. Please try again.");
    } finally {
      setDownloading(false);
      setDownloadStatus("idle");
    }
  };

  // ─── ATS-Friendly text-based PDF via window.print() ───
  const handlePrintPdf = () => {
    const {
      personal = {},
      skills = [],
      groupedSkills = [],
      showGroupedSkills = false,
      education = {},
      experiences = [],
      projects = [],
      achievements = [],
      certificates = [],
      publications = [],
      responsibilities = [],
    } = resumeData || {};

    const fontUrl = null; // not used — blob: URLs can't load external fonts

    // Build bullet list HTML helper
    const bulletList = (items = []) => {
      const filtered = items.filter(Boolean);
      if (!filtered.length) return "";
      return `<ul>${filtered.map((b) => `<li>${b}</li>`).join("")}</ul>`;
    };

    // ── Header ──
    const cleanUrl = (url) => {
      if (!url) return "";
      return url.replace(/https?:\/\/(www\.)?/, "").replace(/\/$/, "");
    };

    const headerParts = [];
    if (personal.phone) headerParts.push(personal.phone);
    if (personal.email) headerParts.push(`<a href="mailto:${personal.email}">${personal.email}</a>`);
    if (personal.location && template !== "minimalist" && template !== "executive") {
      headerParts.push(personal.location);
    }
    if (personal.linkedin) {
      const url = personal.linkedin.startsWith("http") ? personal.linkedin : `https://${personal.linkedin}`;
      headerParts.push(`<a href="${url}">${cleanUrl(personal.linkedin)}</a>`);
    }
    if (personal.github) {
      const url = personal.github.startsWith("http") ? personal.github : `https://${personal.github}`;
      headerParts.push(`<a href="${url}">${cleanUrl(personal.github)}</a>`);
    }
    if (personal.leetcode) {
      const url = personal.leetcode.startsWith("http") ? personal.leetcode : `https://${personal.leetcode}`;
      headerParts.push(`<a href="${url}">${cleanUrl(personal.leetcode)}</a>`);
    }
    if (personal.portfolio) {
      const url = personal.portfolio.startsWith("http") ? personal.portfolio : `https://${personal.portfolio}`;
      headerParts.push(`<a href="${url}">${cleanUrl(personal.portfolio)}</a>`);
    }

    // ── Skills ──
    let skillsHtml = "";
    if (showGroupedSkills && groupedSkills?.length > 0) {
      skillsHtml = groupedSkills.map((g) => `<div class="skill-group"><strong>${g.category}:</strong> ${g.items.join(", ")}</div>`).join("");
    } else {
      const flat = skills.filter(Boolean);
      if (flat.length) skillsHtml = `<p class="skill-flat">${flat.join(" · ")}</p>`;
    }

    // ── Education ──
    const educationHtml = (education?.institution || education?.degree) ? `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${education.institution || ""}</span>
          <span class="entry-date">${education.year || ""}</span>
        </div>
        <div class="entry-sub">${education.degree || ""}${education.gpa ? ` (GPA: ${education.gpa})` : ""}</div>
      </div>` : "";

    // ── Experience ──
    const experienceHtml = experiences.filter((e) => e?.company?.trim() || e?.role?.trim()).map((exp) => {
      const bullets = Array.isArray(exp.description)
        ? exp.description
        : (exp.description || "").split(/\n|(?<=\.\s)/).filter(Boolean);
      return `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title">${exp.company || ""}${exp.role ? ` | ${exp.role}` : ""}</span>
            <span class="entry-date">${exp.duration || ""}</span>
          </div>
          ${bulletList(bullets)}
        </div>`;
    }).join("");

    // ── Projects ──
    const projectsHtml = projects.filter((p) => p?.title?.trim()).map((proj) => {
      const pts = Array.isArray(proj.points) ? proj.points.filter(Boolean) : [];
      return `
        <div class="entry">
          <div class="entry-header">
            <span class="entry-title">${proj.title || ""}${proj.technologies ? ` | ${proj.technologies}` : ""}</span>
            <span class="entry-date">${proj.duration || ""}</span>
          </div>
          ${proj.link ? `<div class="entry-link"><a href="${proj.link}">${proj.link}</a></div>` : ""}
          ${bulletList(pts)}
        </div>`;
    }).join("");

    // ── Achievements ──
    const achievementsHtml = achievements.filter((a) => a?.title?.trim()).map((a) => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${a.title || ""}</span>
          <span class="entry-date">${a.date || ""}</span>
        </div>
        ${a.description ? `<p>${a.description}</p>` : ""}
      </div>`).join("");

    // ── Certificates ──
    const certHtml = certificates.filter((c) => c?.name?.trim()).map((c) => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${c.name || ""}${c.issuer ? ` | ${c.issuer}` : ""}</span>
          <span class="entry-date">${c.year || ""}</span>
        </div>
        ${c.link ? `<div class="entry-link"><a href="${c.link}">${c.link}</a></div>` : ""}
      </div>`).join("");

    // ── Publications ──
    const pubHtml = publications.filter((p) => p?.title?.trim()).map((p) => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${p.title || ""}</span>
          <span class="entry-date">${p.date || ""}</span>
        </div>
        ${p.description ? `<p>${p.description}</p>` : ""}
      </div>`).join("");

    // ── Responsibilities ──
    const respHtml = responsibilities.filter((r) => r?.role?.trim() || r?.organization?.trim()).map((r) => `
      <div class="entry">
        <div class="entry-header">
          <span class="entry-title">${r.role || ""}${r.organization ? ` | ${r.organization}` : ""}</span>
          <span class="entry-date">${r.duration || ""}</span>
        </div>
        ${r.description ? `<p>${r.description}</p>` : ""}
      </div>`).join("");

    // ── Summary ──
    const summaryHtml = personal.summary ? `<p>${personal.summary}</p>` : "";

    const sectionOrder = resumeData?.sectionOrder || ["personal","summary","skills","education","experience","project","achievement","certificate","publication","responsibility"];
    const hiddenSections = resumeData?.hiddenSections || [];

    const sectionMap = {
      personal: "",  // handled by header above
      summary: summaryHtml ? `<section><h2>SUMMARY</h2>${summaryHtml}</section>` : "",
      skills: skillsHtml ? `<section><h2>TECHNICAL SKILLS</h2>${skillsHtml}</section>` : "",
      education: educationHtml ? `<section><h2>EDUCATION</h2>${educationHtml}</section>` : "",
      experience: experienceHtml ? `<section><h2>EXPERIENCE</h2>${experienceHtml}</section>` : "",
      project: projectsHtml ? `<section><h2>PROJECTS</h2>${projectsHtml}</section>` : "",
      achievement: achievementsHtml ? `<section><h2>ACHIEVEMENTS</h2>${achievementsHtml}</section>` : "",
      certificate: certHtml ? `<section><h2>CERTIFICATIONS</h2>${certHtml}</section>` : "",
      publication: pubHtml ? `<section><h2>PUBLICATIONS</h2>${pubHtml}</section>` : "",
      responsibility: respHtml ? `<section><h2>RESPONSIBILITIES</h2>${respHtml}</section>` : "",
      responsibilities: respHtml ? `<section><h2>RESPONSIBILITIES</h2>${respHtml}</section>` : "",
    };

    const bodySections = sectionOrder
      .filter((k) => k !== "personal" && !hiddenSections.includes(k))
      .map((k) => sectionMap[k] || "")
      .join("\n");

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<title>${resumeName || personal.fullName || "Resume"}</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Calibri', 'Arial', 'Liberation Sans', Helvetica, sans-serif;
    font-size: 10.5pt;
    line-height: 1.45;
    color: #111;
    background: #fff;
    padding: 0.75in 0.75in;
    max-width: 8.5in;
    margin: 0 auto;
  }

  /* Header */
  header {
    text-align: center;
    margin-bottom: 12pt;
    padding-bottom: 8pt;
    border-bottom: 0.75pt solid #000;
  }
  header h1 {
    font-size: 20pt;
    font-weight: 700;
    letter-spacing: 0.02em;
    margin-bottom: 3pt;
  }
  .contact-line {
    font-size: 9pt;
    color: #333;
    margin-top: 2pt;
  }
  .contact-line a { color: #1a56db; text-decoration: none; }

  /* Sections */
  section {
    margin-bottom: 10pt;
  }
  section h2 {
    font-size: 9pt;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    border-bottom: 0.5pt solid #000;
    padding-bottom: 4pt;
    margin-bottom: 3pt;
  }

  /* Entries */
  .entry { margin-bottom: 6pt; }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 8pt;
  }
  .entry-title { font-weight: 700; font-size: 9.5pt; }
  .entry-sub { font-size: 9pt; color: #444; margin-top: 1pt; }
  .entry-date { font-size: 9pt; color: #444; white-space: nowrap; font-style: italic; }
  .entry-link { font-size: 8.5pt; margin-top: 1pt; }
  .entry-link a { color: #1a56db; }

  /* Bullets */
  ul { margin: 3pt 0 0 14pt; }
  li { font-size: 9pt; margin-bottom: 2pt; }

  /* Skills */
  .skill-group { font-size: 9pt; margin-bottom: 4pt; padding-left: 0; }
  .skill-flat { font-size: 9.5pt; padding-left: 0; }
  p { font-size: 9.5pt; }

  /* Print */
  @media print {
    @page { margin: 0.65in 0.7in; size: A4; }
    body { padding: 0 !important; margin: 0 !important; max-width: 100% !important; width: 100% !important; }
    a { color: inherit !important; text-decoration: underline; }
    section { page-break-inside: avoid; }
  }
</style>
</head>
<body>
<header>
  <h1>${personal.fullName || ""}</h1>
  <div class="contact-line">${headerParts.join(" &nbsp;|&nbsp; ")}</div>
</header>

${bodySections}
</body>
</html>`;

    // Create a hidden iframe to trigger browser printing safely without popup blocking
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.zIndex = "-9999";
    document.body.appendChild(iframe);

    try {
      const doc = iframe.contentWindow.document;
      doc.open();
      doc.write(html);
      doc.close();

      // Trigger print after rendering delay
      setTimeout(() => {
        iframe.contentWindow.focus();
        iframe.contentWindow.print();
        
        // Clean up the iframe after print is closed
        setTimeout(() => {
          if (document.body.contains(iframe)) {
            document.body.removeChild(iframe);
          }
        }, 5000);
      }, 500);
    } catch (e) {
      console.error("Iframe print initialization failed:", e);
      // Fallback: download as text file if print fails
      const element = document.createElement("a");
      const file = new Blob([html], {type: 'text/html'});
      element.href = URL.createObjectURL(file);
      element.download = `${(resumeName || "resume").replace(/\s+/g, "_")}_ats.html`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
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

  const scaleStyles = `
    .resume-page-container {
      --resume-font-size: ${fontSettings?.size || 10}pt;
      font-size: var(--resume-font-size);
    }
    .resume-page-container .text-xs,
    .resume-page-container .text-xs-important {
      font-size: calc(var(--resume-font-size) * 0.9) !important;
    }
    .resume-page-container .text-sm {
      font-size: calc(var(--resume-font-size) * 1.15) !important;
    }
    .resume-page-container .text-lg {
      font-size: calc(var(--resume-font-size) * 1.35) !important;
    }
    .resume-page-container .text-xl {
      font-size: calc(var(--resume-font-size) * 1.55) !important;
    }
    .resume-page-container .text-2xl {
      font-size: calc(var(--resume-font-size) * 1.9) !important;
    }
    .resume-page-container .text-3xl {
      font-size: calc(var(--resume-font-size) * 2.3) !important;
    }
    .resume-page-container .text-\\[10px\\] {
      font-size: calc(var(--resume-font-size) * 0.8) !important;
    }
    .resume-page-container .text-\\[11px\\] {
      font-size: calc(var(--resume-font-size) * 0.85) !important;
    }
  `;

  // Render Special Two-Column Layout directly if chosen
  if (isTwoColumn) {
    return (
      <div className="relative flex flex-col items-center p-6 bg-gray-100">
        <style>{scaleStyles}</style>
        <div ref={containerRef} className="flex flex-col items-center gap-6">
          <div
            data-resume-page="true"
            className={`resume-page-container ${tpl.pageBg} ${tpl.fontClass} shadow-lg overflow-hidden flex`}
            style={{ 
              width: `${A4_WIDTH_MM}mm`, 
              height: `${A4_HEIGHT_MM}mm`,
              fontFamily: `"${effectiveFont}", sans-serif`
            }}
          >
            <TwoColumnLayout 
              resumeData={resumeData} 
              template={template} 
              tpl={tpl} 
              lineSpacing={lineSpacing} 
              sectionSpacing={sectionSpacing} 
            />
          </div>
        </div>

        {/* BUTTONS */}
        <div className="mt-6 flex flex-col items-center gap-2">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDownload}
              disabled={downloading}
              title="Download a high-fidelity image PDF matching the preview exactly"
              className={`px-5 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 transition-all text-sm ${
                downloading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
              }`}
            >
              {downloading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {downloadStatus === "preparing" && "Preparing…"}
                  {downloadStatus === "rendering" && "Rendering…"}
                  {downloadStatus === "saving" && "Saving PDF…"}
                  {downloadStatus === "idle" && "Generating…"}
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Visual PDF
                </>
              )}
            </button>
            <button
              onClick={handlePrintPdf}
              title="Download a text-based PDF that ATS systems can fully parse"
              className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all text-sm bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
              ATS-Friendly PDF
            </button>
          </div>
          <p className="text-[10px] text-gray-400 text-center max-w-[340px] leading-relaxed">
            <strong className="text-blue-500">Visual PDF</strong> — matches the preview exactly.&nbsp;
            <strong className="text-emerald-500">ATS-Friendly PDF</strong> — text-based, parseable by recruiters &amp; ATS tools.
          </p>
        </div>
      </div>
    );
  }


  return (
    <div className="relative flex flex-col items-center p-6 bg-gray-100">
      <style>{scaleStyles}</style>

      {/* PREVIEW */}
      <div ref={containerRef} className="flex flex-col items-center gap-6">
        {previewPages.map((pageBlockIndexes, pageIndex) => (
          <React.Fragment key={`page-${pageIndex}`}>
            <div
              data-resume-page="true"
              className={`resume-page-container ${tpl.pageBg} ${tpl.fontClass} shadow-lg overflow-hidden flex flex-col`}
              style={{ 
                width: `${A4_WIDTH_MM}mm`, 
                height: `${A4_HEIGHT_MM}mm`,
                fontFamily: `"${effectiveFont}", serif, sans-serif`
              }}
            >
              {pageBlockIndexes.map((blockIndex) => {
                const block = contentBlocks[blockIndex];

                if (!block) {
                  return null;
                }

                const groupKey = block.key.split("-")[0];
                const blockSpacing = individualSpacing?.[block.key] !== undefined
                  ? individualSpacing[block.key]
                  : individualSpacing?.[groupKey] !== undefined
                  ? individualSpacing[groupKey]
                  : sectionSpacing;

                return (
                  <div key={block.key} className="flow-root animate-fadeIn" style={{ marginBottom: `${blockSpacing}px` }}>
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
        <div style={{ width: `${A4_WIDTH_MM}mm` }} className={`${tpl.pageBg} ${tpl.fontClass}`}>
          {contentBlocks.map((block, index) => {
            const groupKey = block.key.split("-")[0];
            const blockSpacing = individualSpacing?.[block.key] !== undefined
              ? individualSpacing[block.key]
              : individualSpacing?.[groupKey] !== undefined
              ? individualSpacing[groupKey]
              : sectionSpacing;

            return (
              <div
                key={`measure-${block.key}`}
                className="flow-root"
                style={{ marginBottom: `${blockSpacing}px` }}
                ref={(element) => {
                  blockRefs.current[index] = element;
                }}
              >
                {block.node}
              </div>
            );
          })}
        </div>
      </div>

      {/* BUTTONS */}
      <div className="mt-6 flex flex-col items-center gap-2">
        <div className="flex items-center gap-3">
          {/* Visual PDF – exact preview */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            title="Download a high-fidelity image PDF matching the preview exactly"
            className={`px-5 py-2.5 rounded-lg text-white font-medium flex items-center gap-2 transition-all text-sm ${
              downloading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {downloading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                {downloadStatus === "preparing" && "Preparing…"}
                {downloadStatus === "rendering" && "Rendering…"}
                {downloadStatus === "saving" && "Saving PDF…"}
                {downloadStatus === "idle" && "Generating…"}
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Visual PDF
              </>
            )}
          </button>

          {/* ATS-Friendly PDF – real text */}
          <button
            onClick={handlePrintPdf}
            title="Download a text-based PDF that ATS systems can fully parse"
            className="px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 transition-all text-sm bg-emerald-600 hover:bg-emerald-700 text-white hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
            ATS-Friendly PDF
          </button>
        </div>

        <p className="text-[10px] text-gray-400 text-center max-w-[340px] leading-relaxed">
          <strong className="text-blue-500">Visual PDF</strong> — matches the preview exactly.&nbsp;
          <strong className="text-emerald-500">ATS-Friendly PDF</strong> — text-based, parseable by recruiters &amp; ATS tools.
        </p>
      </div>
    </div>

  );
}

export default Preview;
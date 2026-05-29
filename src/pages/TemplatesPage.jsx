import { useState } from "react";
import { useNavigate } from "react-router-dom";

/* ─── Sample resume data for preview ─── */
const SAMPLE = {
  name: "Alexandra Carter",
  title: "Senior Software Engineer",
  photo: "/avatar.png",
  email: "alex.carter@email.com",
  phone: "+1 (415) 892-3041",
  location: "San Francisco, CA",
  linkedin: "linkedin.com/in/alexcarter",
  github: "github.com/alexcarter",
  summary: "Results-driven software engineer with 6+ years building scalable web platforms and distributed systems. Passionate about developer experience, clean architecture, and mentoring teams to deliver impactful products.",
  skills: ["React", "TypeScript", "Node.js", "Python", "PostgreSQL", "Redis", "AWS", "Docker", "Kubernetes", "GraphQL", "REST APIs", "CI/CD"],
  skillLevels: {
    React: "Expert",
    TypeScript: "Expert",
    "Node.js": "Advanced",
    Python: "Advanced",
    PostgreSQL: "Advanced",
    Redis: "Intermediate",
    AWS: "Advanced",
    Docker: "Advanced",
    Kubernetes: "Intermediate",
    GraphQL: "Advanced",
    "REST APIs": "Expert",
    "CI/CD": "Advanced"
  },
  experience: [
    {
      role: "Senior Software Engineer",
      company: "Stripe",
      location: "San Francisco, CA",
      duration: "Jan 2022 – Present",
      bullets: [
        "Led migration of payments dashboard to React + TypeScript, reducing load time by 42%",
        "Architected real-time fraud detection pipeline processing 50K+ transactions/sec on AWS Lambda",
        "Mentored 4 junior engineers through code reviews, pair programming, and design discussions",
      ]
    },
    {
      role: "Software Engineer",
      company: "Airbnb",
      location: "San Francisco, CA",
      duration: "Jun 2019 – Dec 2021",
      bullets: [
        "Built host dashboard features used by 4M+ hosts worldwide using React and GraphQL",
        "Reduced API latency by 35% through query optimization and Redis caching strategies",
        "Collaborated with design and PM to ship end-to-end features from spec to production",
      ]
    }
  ],
  education: {
    college: "University of California, Berkeley",
    degree: "B.S. Computer Science",
    year: "2015 – 2019",
    gpa: "3.87"
  },
  projects: [
    {
      name: "OpenMetrics",
      tech: "Go, Prometheus, Grafana",
      bullets: ["Built an open-source observability toolkit with 2.3K GitHub stars", "Implemented custom metric exporters reducing monitoring setup time by 60%"]
    }
  ]
};

/* ─── Full Resume Renders per template ─── */
function ResumePreviewMinimalist() {
  return (
    <div className="w-full h-full bg-white p-6 font-serif text-slate-800 text-[9px] leading-snug overflow-hidden">
      {/* Header */}
      <div className="text-center mb-3 pb-2 border-b border-slate-800">
        <h1 className="text-[18px] font-bold text-gray-950 leading-tight">{SAMPLE.name}</h1>
        <p className="text-[9px] text-slate-500 mt-0.5">{SAMPLE.title}</p>
        <div className="flex flex-wrap justify-center gap-x-2 mt-1 text-[8px] text-gray-600">
          <span>{SAMPLE.email}</span><span>·</span>
          <span>{SAMPLE.phone}</span><span>·</span>
          <span>{SAMPLE.location}</span><span>·</span>
          <span>{SAMPLE.linkedin}</span>
        </div>
      </div>
      {/* Summary */}
      <div className="mb-2.5">
        <h3 className="font-bold border-b border-gray-900 pb-0.5 mb-1 uppercase tracking-wide text-[7.5px] text-gray-900">Professional Summary</h3>
        <p className="text-[8px] text-slate-700 leading-relaxed">{SAMPLE.summary}</p>
      </div>
      {/* Skills */}
      <div className="mb-2.5">
        <h3 className="font-bold border-b border-gray-900 pb-0.5 mb-1 uppercase tracking-wide text-[7.5px] text-gray-900">Technical Skills</h3>
        <p className="text-[8px] text-slate-700">{SAMPLE.skills.join(" · ")}</p>
      </div>
      {/* Experience */}
      <div className="mb-2.5">
        <h3 className="font-bold border-b border-gray-900 pb-0.5 mb-1.5 uppercase tracking-wide text-[7.5px] text-gray-900">Work Experience</h3>
        {SAMPLE.experience.map((exp, i) => (
          <div key={i} className={i > 0 ? "mt-2" : ""}>
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[9px] text-slate-900">{exp.company}</span>
              <span className="text-[7.5px] text-gray-600">{exp.duration}</span>
            </div>
            <p className="italic text-[8px] text-slate-600 mb-0.5">{exp.role} · {exp.location}</p>
            <ul className="list-disc ml-3.5 space-y-0.5">
              {exp.bullets.map((b, j) => <li key={j} className="text-[8px] text-slate-700">{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
      {/* Education */}
      <div className="mb-2.5">
        <h3 className="font-bold border-b border-gray-900 pb-0.5 mb-1 uppercase tracking-wide text-[7.5px] text-gray-900">Education</h3>
        <div className="flex justify-between items-baseline">
          <span className="font-bold text-[9px]">{SAMPLE.education.college}</span>
          <span className="text-[7.5px] text-gray-600">{SAMPLE.education.year}</span>
        </div>
        <p className="italic text-[8px] text-slate-600">{SAMPLE.education.degree} · GPA: {SAMPLE.education.gpa}</p>
      </div>
      {/* Projects */}
      <div>
        <h3 className="font-bold border-b border-gray-900 pb-0.5 mb-1 uppercase tracking-wide text-[7.5px] text-gray-900">Projects</h3>
        {SAMPLE.projects.map((p, i) => (
          <div key={i}>
            <div className="flex justify-between">
              <span className="font-bold text-[9px] text-slate-900">{p.name}</span>
              <span className="text-[7.5px] italic text-slate-500">{p.tech}</span>
            </div>
            <ul className="list-disc ml-3.5 space-y-0.5">
              {p.bullets.map((b, j) => <li key={j} className="text-[8px] text-slate-700">{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumePreviewModern() {
  return (
    <div className="w-full h-full bg-white p-6 font-sans text-slate-800 text-[9px] leading-snug overflow-hidden">
      {/* Header */}
      <div className="text-left pb-2 mb-3 border-b-2 border-blue-500">
        <h1 className="text-[18px] font-black tracking-tight text-blue-600 leading-tight">{SAMPLE.name}</h1>
        <p className="text-[9px] text-slate-500 font-medium mt-0.5">{SAMPLE.title}</p>
        <div className="flex flex-wrap gap-x-3 mt-1 text-[8px] text-slate-500">
          <span>{SAMPLE.email}</span>
          <span>{SAMPLE.phone}</span>
          <span>{SAMPLE.location}</span>
          <span className="text-blue-500">{SAMPLE.linkedin}</span>
        </div>
      </div>
      {/* Summary */}
      <div className="mb-2.5">
        <h3 className="font-black text-[7.5px] text-blue-600 uppercase tracking-widest border-l-4 border-blue-500 pl-2 mb-1">Summary</h3>
        <p className="text-[8px] text-slate-700 leading-relaxed">{SAMPLE.summary}</p>
      </div>
      {/* Skills */}
      <div className="mb-2.5">
        <h3 className="font-black text-[7.5px] text-blue-600 uppercase tracking-widest border-l-4 border-blue-500 pl-2 mb-1">Technical Skills</h3>
        <div className="flex flex-wrap gap-1">
          {SAMPLE.skills.map(s => (
            <span key={s} className="text-[7px] bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-semibold border border-blue-100">{s}</span>
          ))}
        </div>
      </div>
      {/* Experience */}
      <div className="mb-2.5">
        <h3 className="font-black text-[7.5px] text-blue-600 uppercase tracking-widest border-l-4 border-blue-500 pl-2 mb-1.5">Experience</h3>
        {SAMPLE.experience.map((exp, i) => (
          <div key={i} className={i > 0 ? "mt-2" : ""}>
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[9px] text-slate-900">{exp.role}</span>
              <span className="text-[7.5px] text-blue-500 font-bold">{exp.duration}</span>
            </div>
            <p className="text-[8px] text-slate-500 mb-0.5 font-medium">{exp.company} · {exp.location}</p>
            <ul className="list-disc ml-3.5 space-y-0.5">
              {exp.bullets.map((b, j) => <li key={j} className="text-[8px] text-slate-700">{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
      {/* Education */}
      <div className="mb-2.5">
        <h3 className="font-black text-[7.5px] text-blue-600 uppercase tracking-widest border-l-4 border-blue-500 pl-2 mb-1">Education</h3>
        <div className="flex justify-between items-baseline">
          <span className="font-bold text-[9px]">{SAMPLE.education.college}</span>
          <span className="text-[7.5px] text-blue-500 font-bold">{SAMPLE.education.year}</span>
        </div>
        <p className="text-[8px] text-slate-500">{SAMPLE.education.degree} · GPA: {SAMPLE.education.gpa}</p>
      </div>
      {/* Projects */}
      <div>
        <h3 className="font-black text-[7.5px] text-blue-600 uppercase tracking-widest border-l-4 border-blue-500 pl-2 mb-1">Projects</h3>
        {SAMPLE.projects.map((p, i) => (
          <div key={i}>
            <div className="flex justify-between">
              <span className="font-bold text-[9px]">{p.name}</span>
              <span className="text-[7.5px] text-slate-500 italic">{p.tech}</span>
            </div>
            <ul className="list-disc ml-3.5 space-y-0.5">
              {p.bullets.map((b, j) => <li key={j} className="text-[8px] text-slate-700">{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function ResumePreviewExecutive() {
  return (
    <div className="w-full h-full bg-white border-[5px] border-slate-200 p-5 font-serif text-slate-900 text-[9px] leading-snug overflow-hidden">
      {/* Header */}
      <div className="text-center pb-2 mb-3 border-b-2 border-double border-slate-900">
        <h1 className="text-[17px] font-bold uppercase tracking-widest text-slate-950 leading-tight">{SAMPLE.name}</h1>
        <p className="text-[8.5px] text-slate-600 uppercase tracking-wider mt-0.5">{SAMPLE.title}</p>
        <div className="flex flex-wrap justify-center gap-x-3 mt-1 text-[7.5px] text-slate-700 italic">
          <span>{SAMPLE.email}</span><span>·</span>
          <span>{SAMPLE.phone}</span><span>·</span>
          <span>{SAMPLE.location}</span>
        </div>
      </div>
      {/* Summary */}
      <div className="mb-2.5 text-center">
        <h3 className="font-bold border-b border-slate-900 pb-0.5 mb-1 text-center uppercase tracking-widest text-[7.5px] text-slate-950">Profile</h3>
        <p className="text-[8px] text-slate-700 leading-relaxed italic">{SAMPLE.summary}</p>
      </div>
      {/* Skills */}
      <div className="mb-2.5">
        <h3 className="font-bold border-b border-slate-900 pb-0.5 mb-1 text-center uppercase tracking-widest text-[7.5px] text-slate-950">Core Competencies</h3>
        <p className="text-[8px] text-slate-700 text-center">{SAMPLE.skills.join("  ·  ")}</p>
      </div>
      {/* Experience */}
      <div className="mb-2.5">
        <h3 className="font-bold border-b border-slate-900 pb-0.5 mb-1.5 text-center uppercase tracking-widest text-[7.5px] text-slate-950">Professional Experience</h3>
        {SAMPLE.experience.map((exp, i) => (
          <div key={i} className={i > 0 ? "mt-2" : ""}>
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[9px] text-slate-950 uppercase">{exp.company}</span>
              <span className="text-[7.5px] text-slate-700 uppercase italic font-semibold">{exp.duration}</span>
            </div>
            <p className="italic text-[8px] text-slate-600 mb-0.5 font-semibold uppercase tracking-wide">{exp.role}</p>
            <ul className="list-disc ml-3.5 space-y-0.5">
              {exp.bullets.map((b, j) => <li key={j} className="text-[8px] text-slate-800">{b}</li>)}
            </ul>
          </div>
        ))}
      </div>
      {/* Education */}
      <div className="mb-2.5">
        <h3 className="font-bold border-b border-slate-900 pb-0.5 mb-1 text-center uppercase tracking-widest text-[7.5px] text-slate-950">Education</h3>
        <div className="flex justify-between items-baseline">
          <span className="font-bold text-[9px] uppercase">{SAMPLE.education.college}</span>
          <span className="text-[7.5px] text-slate-700 italic">{SAMPLE.education.year}</span>
        </div>
        <p className="italic text-[8px] text-slate-600">{SAMPLE.education.degree} · GPA: {SAMPLE.education.gpa}</p>
      </div>
    </div>
  );
}

function ResumePreviewCreative() {
  return (
    <div className="w-full h-full bg-white font-sans text-slate-900 text-[9px] leading-snug overflow-hidden flex flex-col">
      {/* Dark header banner */}
      <div className="bg-slate-900 text-white px-6 py-4 text-center border-b-4 border-violet-500 shrink-0">
        <h1 className="text-[18px] font-extrabold tracking-tight text-white leading-tight">{SAMPLE.name}</h1>
        <p className="text-[9px] text-slate-300 font-medium mt-0.5">{SAMPLE.title}</p>
        <div className="flex flex-wrap justify-center gap-x-3 mt-1.5 text-[7.5px] text-slate-400">
          <span>{SAMPLE.email}</span>
          <span>{SAMPLE.phone}</span>
          <span className="text-violet-400">{SAMPLE.linkedin}</span>
        </div>
      </div>
      {/* Content */}
      <div className="p-5 flex-1 overflow-hidden">
        {/* Summary */}
        <div className="mb-2.5">
          <span className="font-extrabold text-[7.5px] uppercase tracking-wider bg-violet-100 text-violet-800 px-2 py-1 rounded-md inline-block mb-1.5">Summary</span>
          <p className="text-[8px] text-slate-700 leading-relaxed">{SAMPLE.summary}</p>
        </div>
        {/* Skills */}
        <div className="mb-2.5">
          <span className="font-extrabold text-[7.5px] uppercase tracking-wider bg-violet-100 text-violet-800 px-2 py-1 rounded-md inline-block mb-1.5">Skills</span>
          <div className="flex flex-wrap gap-1">
            {SAMPLE.skills.map(s => (
              <span key={s} className="text-[7px] bg-violet-50 text-violet-700 px-1.5 py-0.5 rounded font-semibold">{s}</span>
            ))}
          </div>
        </div>
        {/* Experience */}
        <div className="mb-2.5">
          <span className="font-extrabold text-[7.5px] uppercase tracking-wider bg-violet-100 text-violet-800 px-2 py-1 rounded-md inline-block mb-1.5">Experience</span>
          {SAMPLE.experience.map((exp, i) => (
            <div key={i} className={i > 0 ? "mt-2" : ""}>
              <div className="flex justify-between items-baseline">
                <span className="font-bold text-[9px] text-slate-900">{exp.role}</span>
                <span className="text-[7.5px] text-violet-600 font-bold bg-violet-50 px-1.5 py-0.5 rounded">{exp.duration}</span>
              </div>
              <p className="text-[8px] text-slate-500 mb-0.5 font-medium">{exp.company} · {exp.location}</p>
              <ul className="list-disc ml-3.5 space-y-0.5">
                {exp.bullets.map((b, j) => <li key={j} className="text-[8px] text-slate-700">{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
        {/* Education */}
        <div>
          <span className="font-extrabold text-[7.5px] uppercase tracking-wider bg-violet-100 text-violet-800 px-2 py-1 rounded-md inline-block mb-1.5">Education</span>
          <div className="flex justify-between items-baseline">
            <span className="font-bold text-[9px]">{SAMPLE.education.college}</span>
            <span className="text-[7.5px] text-violet-600 font-bold bg-violet-50 px-1.5 py-0.5 rounded">{SAMPLE.education.year}</span>
          </div>
          <p className="text-[8px] text-slate-500">{SAMPLE.education.degree} · GPA: {SAMPLE.education.gpa}</p>
        </div>
      </div>
    </div>
  );
}

function ResumePreviewPhotoHeader() {
  return (
    <div className="w-full h-full bg-white p-6 font-serif text-slate-800 text-[9px] leading-snug overflow-hidden flex flex-col">
      {/* Header with photo */}
      <div className="flex items-center gap-4 mb-3 pb-2 border-b border-slate-300">
        {SAMPLE.photo && (
          <img
            src={SAMPLE.photo}
            alt="Profile"
            className="w-12 h-12 rounded-full object-cover border border-slate-300 shrink-0"
          />
        )}
        <div className="flex-1 text-left">
          <h1 className="text-[17px] font-bold text-slate-900 leading-tight">{SAMPLE.name}</h1>
          <p className="text-[9px] text-slate-550 mt-0.5">{SAMPLE.title}</p>
          <div className="flex flex-wrap gap-x-2 gap-y-0.5 mt-1 text-[7.5px] text-slate-550">
            <span>{SAMPLE.email}</span><span>·</span>
            <span>{SAMPLE.phone}</span><span>·</span>
            <span>{SAMPLE.location}</span>
          </div>
        </div>
      </div>
      
      {/* Summary */}
      <div className="mb-2 text-left">
        <h3 className="font-bold border-b border-slate-200 pb-0.5 mb-1 uppercase tracking-wide text-[7px] text-slate-900">Summary</h3>
        <p className="text-[7.5px] text-slate-700 leading-relaxed">{SAMPLE.summary}</p>
      </div>

      {/* Skills */}
      <div className="mb-2 text-left">
        <h3 className="font-bold border-b border-slate-200 pb-0.5 mb-1 uppercase tracking-wide text-[7px] text-slate-900">Skills</h3>
        <p className="text-[7.5px] text-slate-700">{SAMPLE.skills.join(" · ")}</p>
      </div>

      {/* Experience */}
      <div className="mb-2 text-left">
        <h3 className="font-bold border-b border-slate-200 pb-0.5 mb-1 uppercase tracking-wide text-[7px] text-slate-900">Experience</h3>
        {SAMPLE.experience.map((exp, i) => (
          <div key={i} className={i > 0 ? "mt-1.5" : ""}>
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[8.5px] text-slate-900">{exp.company}</span>
              <span className="text-[7px] text-gray-550">{exp.duration}</span>
            </div>
            <p className="italic text-[7.5px] text-slate-500 mb-0.5">{exp.role}</p>
            <ul className="list-disc ml-3 space-y-0.5">
              {exp.bullets.map((b, j) => <li key={j} className="text-[7.5px] text-slate-700">{b}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="text-left">
        <h3 className="font-bold border-b border-slate-200 pb-0.5 mb-1 uppercase tracking-wide text-[7px] text-slate-900">Education</h3>
        <div className="flex justify-between items-baseline">
          <span className="font-bold text-[8.5px]">{SAMPLE.education.college}</span>
          <span className="text-[7px] text-slate-550">{SAMPLE.education.year}</span>
        </div>
        <p className="italic text-[7.5px] text-slate-500">{SAMPLE.education.degree} · GPA: {SAMPLE.education.gpa}</p>
      </div>
    </div>
  );
}

function ResumePreviewPhotoSidebar() {
  return (
    <div className="w-full h-full bg-white font-sans text-slate-800 text-[9px] leading-snug overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-[33%] bg-teal-950 text-white p-3.5 flex flex-col shrink-0 text-left">
        {SAMPLE.photo && (
          <div className="text-center mb-2.5">
            <img
              src={SAMPLE.photo}
              alt="Profile"
              className="w-14 h-14 rounded-full object-cover mx-auto border border-teal-850"
            />
          </div>
        )}
        <div className="mb-3 text-center">
          <h2 className="text-[10px] font-bold text-white">{SAMPLE.name}</h2>
          <p className="text-[7px] text-teal-300 font-semibold tracking-wider uppercase mt-0.5">{SAMPLE.title}</p>
        </div>

        {/* Contact */}
        <div className="mb-3 space-y-1.5 text-[7px] leading-tight">
          <h4 className="text-[7.5px] font-bold uppercase tracking-wider text-teal-400 border-b border-teal-900 pb-0.5 mb-1">Contact</h4>
          <p className="truncate">📧 {SAMPLE.email}</p>
          <p>📞 {SAMPLE.phone}</p>
          <p>📍 {SAMPLE.location}</p>
        </div>

        {/* Skills */}
        <div className="mb-3 space-y-1.5">
          <h4 className="text-[7.5px] font-bold uppercase tracking-wider text-teal-400 border-b border-teal-900 pb-0.5 mb-1">Skills</h4>
          {SAMPLE.skills.slice(0, 6).map((skill, index) => {
            const level = SAMPLE.skillLevels[skill] || "Intermediate";
            const percent = level === "Beginner" ? 30 : level === "Intermediate" ? 60 : level === "Advanced" ? 85 : 100;
            return (
              <div key={index} className="space-y-0.5">
                <div className="flex justify-between text-[6.5px]">
                  <span className="truncate">{skill}</span>
                  <span className="opacity-70">{level}</span>
                </div>
                <div className="w-full rounded-full h-0.5 bg-teal-900">
                  <div className="h-0.5 rounded-full bg-teal-400" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Education */}
        <div className="text-[6.5px]">
          <h4 className="text-[7.5px] font-bold uppercase tracking-wider text-teal-400 border-b border-teal-900 pb-0.5 mb-1">Education</h4>
          <p className="font-bold leading-tight">{SAMPLE.education.college}</p>
          <p className="opacity-90">{SAMPLE.education.degree}</p>
          <p className="opacity-75">{SAMPLE.education.year}</p>
        </div>
      </div>

      {/* Main column */}
      <div className="flex-1 p-3 text-left flex flex-col gap-2">
        {/* Summary */}
        <div>
          <h3 className="font-bold text-[7.5px] text-teal-950 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1">Profile</h3>
          <p className="text-[7.5px] text-slate-700 leading-relaxed">{SAMPLE.summary}</p>
        </div>

        {/* Experience */}
        <div>
          <h3 className="font-bold text-[7.5px] text-teal-950 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1">Experience</h3>
          <div className="space-y-1.5">
            {SAMPLE.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.company}</span>
                  <span className="text-teal-700 text-[7px]">{exp.duration}</span>
                </div>
                <p className="italic text-[7px] text-slate-505 mb-0.5">{exp.role}</p>
                <ul className="list-disc ml-3 space-y-0.5">
                  {exp.bullets.map((b, j) => <li key={j} className="text-[7px] text-slate-650">{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <h3 className="font-bold text-[7.5px] text-teal-950 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1">Projects</h3>
          {SAMPLE.projects.map((proj, i) => (
            <div key={i}>
              <div className="flex justify-between font-bold text-slate-900">
                <span>{proj.name} <span className="font-normal text-[7px] text-slate-500">| {proj.tech}</span></span>
              </div>
              <ul className="list-disc ml-3 space-y-0.5">
                {proj.bullets.map((b, j) => <li key={j} className="text-[7px] text-slate-650">{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResumePreviewSkillsTable() {
  return (
    <div className="w-full h-full bg-white p-6 font-sans text-slate-800 text-[9px] leading-snug overflow-hidden">
      {/* Header */}
      <div className="text-center pb-2 mb-3 border-b-2 border-emerald-500">
        <h1 className="text-[18px] font-bold text-emerald-800 leading-tight">{SAMPLE.name}</h1>
        <p className="text-[9px] text-slate-500 font-semibold mt-0.5">{SAMPLE.title}</p>
        <div className="flex flex-wrap justify-center gap-x-3 mt-1 text-[8px] text-slate-500">
          <span>{SAMPLE.email}</span>
          <span>{SAMPLE.phone}</span>
          <span>{SAMPLE.location}</span>
        </div>
      </div>
      
      {/* Summary */}
      <div className="mb-2 text-left">
        <h3 className="font-bold text-[7px] text-emerald-800 uppercase tracking-widest border-l-4 border-emerald-500 pl-2 mb-1">Profile</h3>
        <p className="text-[7.5px] text-slate-700 leading-relaxed">{SAMPLE.summary}</p>
      </div>

      {/* Skills Table */}
      <div className="mb-2 text-left">
        <h3 className="font-bold text-[7px] text-emerald-800 uppercase tracking-widest border-l-4 border-emerald-500 pl-2 mb-1">Technical Skills</h3>
        <div className="grid grid-cols-2 gap-x-3 gap-y-1">
          {SAMPLE.skills.slice(0, 8).map((skill, index) => {
            const level = SAMPLE.skillLevels[skill] || "Intermediate";
            const percent = level === "Beginner" ? 30 : level === "Intermediate" ? 60 : level === "Advanced" ? 85 : 100;
            return (
              <div key={index} className="flex items-center justify-between text-[7px]">
                <span className="font-medium text-slate-800 w-[45%] truncate">{skill}</span>
                <div className="flex-1 flex items-center gap-1.5">
                  <div className="w-full bg-slate-200 rounded-full h-1">
                    <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="text-[6.5px] text-slate-500 w-10 text-right">{level}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Experience */}
      <div className="mb-2 text-left">
        <h3 className="font-bold text-[7px] text-emerald-800 uppercase tracking-widest border-l-4 border-emerald-500 pl-2 mb-1">Experience</h3>
        {SAMPLE.experience.map((exp, i) => (
          <div key={i} className={i > 0 ? "mt-1.5" : ""}>
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-[8.5px] text-slate-900">{exp.company}</span>
              <span className="text-[7px] text-emerald-600 font-bold">{exp.duration}</span>
            </div>
            <p className="text-[7.5px] text-slate-500 mb-0.5 font-medium">{exp.role}</p>
            <ul className="list-disc ml-3 space-y-0.5">
              {exp.bullets.map((b, j) => <li key={j} className="text-[7.5px] text-slate-700">{b}</li>)}
            </ul>
          </div>
        ))}
      </div>

      {/* Education */}
      <div className="text-left">
        <h3 className="font-bold text-[7px] text-emerald-800 uppercase tracking-widest border-l-4 border-emerald-500 pl-2 mb-1">Education</h3>
        <div className="flex justify-between items-baseline">
          <span className="font-bold text-[8.5px]">{SAMPLE.education.college}</span>
          <span className="text-[7px] text-emerald-600 font-bold">{SAMPLE.education.year}</span>
        </div>
        <p className="text-[7.5px] text-slate-500">{SAMPLE.education.degree} · GPA: {SAMPLE.education.gpa}</p>
      </div>
    </div>
  );
}

function ResumePreviewTwoColumn() {
  return (
    <div className="w-full h-full bg-white font-sans text-slate-800 text-[9px] leading-snug overflow-hidden flex">
      {/* Sidebar */}
      <div className="w-[33%] bg-slate-50 border-r border-slate-200 p-3.5 flex flex-col shrink-0 text-left">
        {/* Contact */}
        <div className="mb-3 space-y-1.5 text-[7px] leading-tight text-slate-650">
          <h4 className="text-[7.5px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-0.5 mb-1">Contact</h4>
          <p className="truncate">✉️ {SAMPLE.email}</p>
          <p>📞 {SAMPLE.phone}</p>
          <p>📍 {SAMPLE.location}</p>
        </div>

        {/* Skills */}
        <div className="mb-3 space-y-1.5">
          <h4 className="text-[7.5px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-0.5 mb-1">Skills</h4>
          {SAMPLE.skills.slice(0, 6).map((skill, index) => {
            const level = SAMPLE.skillLevels[skill] || "Intermediate";
            const percent = level === "Beginner" ? 30 : level === "Intermediate" ? 60 : level === "Advanced" ? 85 : 100;
            return (
              <div key={index} className="space-y-0.5">
                <div className="flex justify-between text-[6.5px]">
                  <span className="truncate text-slate-850">{skill}</span>
                  <span className="opacity-70 text-slate-500">{level}</span>
                </div>
                <div className="w-full rounded-full h-0.5 bg-slate-200">
                  <div className="h-0.5 rounded-full bg-indigo-600" style={{ width: `${percent}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Education */}
        <div className="text-[6.5px]">
          <h4 className="text-[7.5px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-0.5 mb-1">Education</h4>
          <p className="font-bold leading-tight text-slate-850">{SAMPLE.education.college}</p>
          <p className="text-slate-600">{SAMPLE.education.degree}</p>
          <p className="text-slate-500">{SAMPLE.education.year}</p>
        </div>
      </div>

      {/* Main column */}
      <div className="flex-1 p-3 text-left flex flex-col gap-2">
        {/* Name and Title */}
        <div className="pb-1.5 border-b border-slate-100">
          <h1 className="text-[16px] font-bold text-slate-900">{SAMPLE.name}</h1>
          <p className="text-[7.5px] font-semibold text-indigo-600 uppercase tracking-wider mt-0.5">{SAMPLE.title}</p>
        </div>

        {/* Summary */}
        <div>
          <h3 className="font-bold text-[7.5px] text-slate-850 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1">Profile</h3>
          <p className="text-[7.5px] text-slate-700 leading-relaxed">{SAMPLE.summary}</p>
        </div>

        {/* Experience */}
        <div>
          <h3 className="font-bold text-[7.5px] text-slate-850 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1">Experience</h3>
          <div className="space-y-1.5">
            {SAMPLE.experience.map((exp, i) => (
              <div key={i}>
                <div className="flex justify-between font-bold text-slate-900">
                  <span>{exp.company}</span>
                  <span className="text-slate-500 text-[6.5px]">{exp.duration}</span>
                </div>
                <p className="italic text-[6.5px] text-slate-500 mb-0.5">{exp.role}</p>
                <ul className="list-disc ml-3 space-y-0.5">
                  {exp.bullets.map((b, j) => <li key={j} className="text-[7px] text-slate-750">{b}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Projects */}
        <div>
          <h3 className="font-bold text-[7.5px] text-slate-850 uppercase tracking-wider border-b border-slate-200 pb-0.5 mb-1">Projects</h3>
          {SAMPLE.projects.map((proj, i) => (
            <div key={i}>
              <div className="flex justify-between font-bold text-slate-900">
                <span>{proj.name} <span className="font-normal text-[6.5px] text-slate-500">| {proj.tech}</span></span>
              </div>
              <ul className="list-disc ml-3 space-y-0.5">
                {proj.bullets.map((b, j) => <li key={j} className="text-[7px] text-slate-750">{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ResumePreviewTimeline() {
  return (
    <div className="w-full h-full bg-white p-6 font-sans text-slate-800 text-[9px] leading-snug overflow-hidden">
      {/* Header */}
      <div className="text-left pb-2 mb-2.5 border-b border-indigo-100">
        <h1 className="text-[18px] font-extrabold text-indigo-950 leading-tight tracking-tight">{SAMPLE.name}</h1>
        <p className="text-[9px] text-indigo-650 font-semibold mt-0.5">{SAMPLE.title}</p>
        <div className="flex flex-wrap gap-x-3 mt-1 text-[8px] text-slate-550">
          <span>{SAMPLE.email}</span>
          <span>{SAMPLE.phone}</span>
          <span>{SAMPLE.location}</span>
        </div>
      </div>
      
      {/* Summary */}
      <div className="mb-2 text-left">
        <span className="font-extrabold text-[7px] text-indigo-900 uppercase tracking-wider mb-1 bg-indigo-50 px-2 py-0.5 rounded inline-block">Profile</span>
        <p className="text-[7.5px] text-slate-700 leading-relaxed">{SAMPLE.summary}</p>
      </div>

      {/* Experience Timeline */}
      <div className="mb-2 text-left">
        <span className="font-extrabold text-[7px] text-indigo-900 uppercase tracking-wider mb-1 bg-indigo-50 px-2 py-0.5 rounded inline-block">Experience</span>
        <div className="relative pl-3.5 border-l border-indigo-200 ml-1.5 space-y-2 py-0.5">
          {SAMPLE.experience.map((exp, i) => (
            <div key={i} className="relative">
              {/* Timeline dot */}
              <div className="absolute -left-[17.5px] top-1 w-2 h-2 rounded-full bg-white border-2 border-indigo-600" />
              <div className="flex justify-between items-baseline font-bold text-slate-900">
                <span>{exp.company}</span>
                <span className="text-indigo-600 text-[7px] bg-indigo-50 px-1 py-0.5 rounded font-semibold">{exp.duration}</span>
              </div>
              <p className="text-[7px] text-slate-500 mb-0.5 font-semibold">{exp.role}</p>
              <ul className="list-disc ml-3 space-y-0.5">
                {exp.bullets.map((b, j) => <li key={j} className="text-[7px] text-slate-700">{b}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Skills */}
      <div className="mb-2 text-left">
        <span className="font-extrabold text-[7px] text-indigo-900 uppercase tracking-wider mb-1 bg-indigo-50 px-2 py-0.5 rounded inline-block">Skills</span>
        <p className="text-[7.5px] text-slate-700">{SAMPLE.skills.join(" · ")}</p>
      </div>

      {/* Education */}
      <div className="text-left">
        <span className="font-extrabold text-[7px] text-indigo-900 uppercase tracking-wider mb-1 bg-indigo-50 px-2 py-0.5 rounded inline-block">Education</span>
        <div className="flex justify-between items-baseline">
          <span className="font-bold text-[8.5px]">{SAMPLE.education.college}</span>
          <span className="text-[7px] text-indigo-600 font-bold bg-indigo-50 px-1 py-0.5 rounded">{SAMPLE.education.year}</span>
        </div>
        <p className="text-[7.5px] text-slate-550">{SAMPLE.education.degree} · GPA: {SAMPLE.education.gpa}</p>
      </div>
    </div>
  );
}

/* ─── Template definitions ─── */
const TEMPLATES = [
  {
    id: "minimalist",
    name: "Classic Minimalist",
    badge: "Most Popular",
    badgeColor: "from-slate-500 to-slate-600",
    accentBg: "from-slate-50 to-gray-100",
    accentBorder: "#475569",
    desc: "Traditional serif design with centered header and clean horizontal dividers. Best for academic, corporate, or conservative fields.",
    tags: ["Traditional", "Serif", "Formal"],
    fullPreview: <ResumePreviewMinimalist />
  },
  {
    id: "modern",
    name: "Sleek Modern",
    badge: "Tech & Product",
    badgeColor: "from-blue-500 to-cyan-600",
    accentBg: "from-blue-50 to-cyan-50",
    accentBorder: "#2563eb",
    desc: "Clean sans-serif with bold left-aligned header and blue accent bars. Perfect for engineering and design roles.",
    tags: ["Modern", "Sans-serif", "Tech"],
    fullPreview: <ResumePreviewModern />
  },
  {
    id: "executive",
    name: "Refined Executive",
    badge: "Leadership",
    badgeColor: "from-amber-500 to-orange-600",
    accentBg: "from-amber-50 to-orange-50",
    accentBorder: "#b45309",
    desc: "Elegant serif with double-underline dividers and a formal page frame. Designed for senior leadership positions.",
    tags: ["Executive", "Serif", "Formal"],
    fullPreview: <ResumePreviewExecutive />
  },
  {
    id: "creative",
    name: "Creative Split-Sidebar",
    badge: "Modern Creative",
    badgeColor: "from-violet-500 to-purple-600",
    accentBg: "from-violet-50 to-purple-50",
    accentBorder: "#7c3aed",
    desc: "Bold dark header banner with violet section labels. Ideal for creative industries and startups.",
    tags: ["Creative", "Bold", "Modern"],
    fullPreview: <ResumePreviewCreative />
  },
  {
    id: "photo-header",
    name: "Photo Header",
    badge: "Sleek & Professional",
    badgeColor: "from-teal-500 to-emerald-600",
    accentBg: "from-teal-50 to-emerald-50",
    accentBorder: "#0d9488",
    desc: "Modern single-column serif template featuring a professional circular photo on the left. Excellent for client-facing and corporate roles.",
    tags: ["Professional", "Serif", "Photo"],
    fullPreview: <ResumePreviewPhotoHeader />
  },
  {
    id: "photo-sidebar",
    name: "Teal Premium Sidebar",
    badge: "Premium Sidebar",
    badgeColor: "from-cyan-500 to-blue-600",
    accentBg: "from-cyan-50 to-blue-50",
    accentBorder: "#0f766e",
    desc: "Beautiful double-column layout featuring a dark teal sidebar with circular headshot, skills progress bars, and clean main column.",
    tags: ["Executive", "Double Column", "Photo"],
    fullPreview: <ResumePreviewPhotoSidebar />
  },
  {
    id: "skills-table",
    name: "Skills Showcase Table",
    badge: "Skills Showcase",
    badgeColor: "from-emerald-500 to-green-600",
    accentBg: "from-emerald-50 to-green-50",
    accentBorder: "#047857",
    desc: "Clean sans-serif template highlighting technical proficiency with a neat grid of green skill strength indicator bars.",
    tags: ["Modern", "Skills Grid", "Performance"],
    fullPreview: <ResumePreviewSkillsTable />
  },
  {
    id: "two-column",
    name: "Clean Two-Column",
    badge: "Clean Layout",
    badgeColor: "from-indigo-500 to-purple-600",
    accentBg: "from-indigo-50 to-purple-50",
    accentBorder: "#4f46e5",
    desc: "Clean, elegant, non-photo double-column layout. High readability sidebar for contact details, skills, and education.",
    tags: ["Traditional", "Double Column", "Clean"],
    fullPreview: <ResumePreviewTwoColumn />
  },
  {
    id: "timeline",
    name: "Experience Timeline",
    badge: "Chronological",
    badgeColor: "from-rose-500 to-pink-600",
    accentBg: "from-rose-50 to-pink-50",
    accentBorder: "#e11d48",
    desc: "Premium sans-serif template displaying career progression with an interactive, elegant chronological vertical timeline.",
    tags: ["Creative", "Timeline", "Modern"],
    fullPreview: <ResumePreviewTimeline />
  }
];

/* ─── Template Picker Modal ─── */
export function TemplatePickerModal({ onClose, onSelect }) {
  const [selected, setSelected] = useState("minimalist");
  const [hovered, setHovered] = useState("minimalist");
  const activeTpl = TEMPLATES.find(t => t.id === (hovered || selected));

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal — full horizontal split */}
      <div className="relative z-10 m-auto flex w-full max-w-5xl max-h-[90vh] bg-[#0d1829] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
        
        {/* LEFT: template list */}
        <div className="w-[45%] border-r border-white/[0.06] flex flex-col h-[90vh]">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-white/[0.06] shrink-0">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white">Choose a Template</h2>
                <p className="text-xs text-slate-400 mt-0.5">Hover to preview · Click to select</p>
              </div>
              <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Template list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {TEMPLATES.map(tpl => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelected(tpl.id)}
                onMouseEnter={() => setHovered(tpl.id)}
                onMouseLeave={() => setHovered(null)}
                className={`w-full text-left p-4 rounded-xl border transition-all duration-200 flex items-center gap-4 group outline-none ${
                  selected === tpl.id
                    ? "border-accent bg-accent/10 ring-1 ring-accent/30"
                    : "border-white/[0.07] hover:border-white/[0.18] hover:bg-white/[0.04]"
                }`}
              >
                {/* Color dot */}
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ background: `linear-gradient(135deg, ${tpl.accentBorder}, ${tpl.accentBorder}99)` }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-white">{tpl.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-gradient-to-r ${tpl.badgeColor} text-white`}>{tpl.badge}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 truncate">{tpl.desc.slice(0, 55)}…</p>
                </div>
                {selected === tpl.id && (
                  <div className="w-5 h-5 bg-accent rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Actions */}
          <div className="px-6 py-4 border-t border-white/[0.06] flex gap-3 shrink-0">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-slate-300 text-sm font-medium hover:bg-white/[0.04] transition-all">
              Cancel
            </button>
            <button
              onClick={() => onSelect(selected)}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all hover:-translate-y-0.5 active:scale-95"
            >
              Create Resume →
            </button>
          </div>
        </div>

        {/* RIGHT: Live full-page preview */}
        <div className="flex-1 flex flex-col bg-[#070b14] relative overflow-hidden">
          {/* Preview header */}
          <div className="px-6 py-3 border-b border-white/[0.06] flex items-center gap-2 shrink-0">
            <div className="flex gap-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></div>
              <div className="w-2.5 h-2.5 rounded-full bg-green-500/60"></div>
            </div>
            <span className="text-[11px] text-slate-500 ml-2">{activeTpl?.name} — Sample Preview</span>
          </div>

          {/* A4 page preview */}
          <div className="flex-1 overflow-hidden flex items-start justify-center p-4 pt-3">
            <div
              key={activeTpl?.id}
              className="w-full bg-white rounded-lg shadow-2xl overflow-hidden"
              style={{
                maxWidth: "400px",
                minHeight: "100%",
                maxHeight: "100%",
                animation: "fadeInPreview 0.25s ease-out",
                boxShadow: `0 20px 60px -10px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.05)`
              }}
            >
              <style>{`@keyframes fadeInPreview { from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); } }`}</style>
              {activeTpl?.fullPreview}
            </div>
          </div>

          {/* Sample data watermark */}
          <div className="absolute bottom-3 right-4 text-[9px] text-slate-600 font-medium select-none">
            Sample data for preview only
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Templates Page (sidebar /templates route) ─── */
function TemplatesPage() {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(null);
  const activeTpl = TEMPLATES.find(t => t.id === hovered);

  const handleUseTemplate = (tplId) => {
    navigate(`/builder/new?template=${tplId}`);
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#070b14] to-[#0a1628] flex flex-col text-left">
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.012)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.012)_1px,transparent_1px)] bg-[size:36px_36px] pointer-events-none" />
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

      <div className="relative z-10 flex flex-col h-screen overflow-hidden">
        {/* Page Header */}
        <div className="px-8 pt-8 pb-5 shrink-0">
          <h1 className="text-3xl font-bold text-white mb-1">Resume Templates</h1>
          <p className="text-slate-400 text-sm">
            Hover over a template to see a full preview with sample data. Click <strong className="text-white">Use Template</strong> to start building.
          </p>
        </div>

        {/* Split layout: Left grid + Right preview */}
        <div className="flex flex-1 overflow-hidden px-8 pb-8 gap-6">
          {/* LEFT: Template Cards */}
          <div className="w-[48%] shrink-0 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4 pb-6">
              {TEMPLATES.map(tpl => (
                <div
                  key={tpl.id}
                  className={`group glass-card overflow-hidden cursor-pointer transition-all duration-300 ${
                    hovered === tpl.id
                      ? "border-white/[0.25] shadow-2xl -translate-y-1"
                      : "hover:border-white/[0.15] hover:-translate-y-0.5 hover:shadow-xl"
                  }`}
                  onMouseEnter={() => setHovered(tpl.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Mini preview area */}
                  <div
                    className="h-44 overflow-hidden border-b border-white/[0.06] relative bg-white"
                    style={{ borderBottom: `3px solid ${tpl.accentBorder}` }}
                  >
                    {/* Scale the full preview down to fit */}
                    <div
                      className="absolute inset-0"
                      style={{ transform: "scale(0.55)", transformOrigin: "top left", width: "182%", height: "182%" }}
                    >
                      {tpl.fullPreview}
                    </div>

                    {/* Hover CTA overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-all duration-300 flex items-center justify-center">
                      <button
                        onClick={() => handleUseTemplate(tpl.id)}
                        className="opacity-0 group-hover:opacity-100 transition-all duration-200 px-4 py-2 bg-white text-slate-900 rounded-xl text-xs font-bold shadow-xl -translate-y-2 group-hover:translate-y-0"
                      >
                        Use this template →
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                      <span className="text-sm font-bold text-white leading-tight">{tpl.name}</span>
                      <span className={`text-[8px] font-extrabold px-2 py-0.5 rounded-full bg-gradient-to-r ${tpl.badgeColor} text-white`}>
                        {tpl.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed mb-3 line-clamp-2 h-8">{tpl.desc}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1.5">
                        {tpl.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[9px] font-semibold px-2 py-0.5 rounded-full bg-white/[0.06] text-slate-400">{tag}</span>
                        ))}
                      </div>
                      <button
                        onClick={() => handleUseTemplate(tpl.id)}
                        className="text-[10px] font-semibold px-3 py-1.5 rounded-lg bg-gradient-to-r from-accent to-accent-violet text-white hover:shadow-md hover:shadow-accent/20 transition-all hover:-translate-y-0.5 active:scale-95"
                      >
                        Use
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Large live preview panel */}
          <div className="flex-1 flex flex-col min-w-0">
            {/* Browser chrome mock */}
            <div className="bg-[#0d1829] border border-white/[0.08] rounded-2xl overflow-hidden flex flex-col h-full shadow-2xl">
              {/* Titlebar */}
              <div className="flex items-center gap-3 px-4 py-3 bg-[#0a1120] border-b border-white/[0.06] shrink-0">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                </div>
                <div className="flex-1 h-6 bg-white/[0.05] rounded-md flex items-center justify-center">
                  <span className="text-[10px] text-slate-500">
                    {activeTpl ? `${activeTpl.name} — Preview` : "Hover a template to preview"}
                  </span>
                </div>
              </div>

              {/* Preview content */}
              <div className="flex-1 overflow-hidden bg-slate-200 flex items-start justify-center p-6 pt-5">
                {activeTpl ? (
                  <div
                    key={activeTpl.id}
                    className="w-full max-w-[360px] bg-white rounded-lg overflow-hidden shadow-xl"
                    style={{
                      animation: "fadeInPreview 0.2s ease-out",
                      boxShadow: `0 20px 60px rgba(0,0,0,0.35), 0 0 0 1px ${activeTpl.accentBorder}33`
                    }}
                  >
                    <style>{`@keyframes fadeInPreview { from { opacity: 0; transform: scale(0.97) translateY(8px); } to { opacity: 1; transform: scale(1) translateY(0); } }`}</style>
                    {activeTpl.fullPreview}
                  </div>
                ) : (
                  /* Placeholder state */
                  <div className="flex flex-col items-center justify-center h-full text-center opacity-40 mt-20">
                    <svg className="w-16 h-16 text-slate-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="text-slate-400 text-sm font-medium">Hover a template card</p>
                    <p className="text-slate-500 text-xs mt-1">to see a live preview here</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              {activeTpl && (
                <div
                  className="px-5 py-3 border-t border-white/[0.06] flex items-center justify-between shrink-0"
                  style={{ background: `linear-gradient(135deg, ${activeTpl.accentBorder}15, transparent)` }}
                >
                  <div>
                    <p className="text-sm font-bold text-white">{activeTpl.name}</p>
                    <div className="flex gap-1.5 mt-1">
                      {activeTpl.tags.map(tag => (
                        <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-white/[0.06] text-slate-400">{tag}</span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleUseTemplate(activeTpl.id)}
                    className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-accent to-accent-violet text-white text-sm font-semibold hover:shadow-lg hover:shadow-accent/20 transition-all hover:-translate-y-0.5 active:scale-95"
                  >
                    Use This Template →
                  </button>
                </div>
              )}
            </div>

            {/* Sample data notice */}
            <p className="text-[10px] text-slate-600 text-center mt-2">Previews show sample data — your resume will use your own information</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TemplatesPage;

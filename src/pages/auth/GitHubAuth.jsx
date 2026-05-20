import { useState } from "react";

function GitHubAuth() {
  const [isVerifying, setIsVerifying] = useState(false);

  // GitHub Profile Resume Payload
  const gitHubResumeData = {
    personal: {
      fullName: "Sri Aarush Aray",
      email: "sriaarush@github.com",
      phone: "+91 98765 43210",
      location: "Bangalore, India",
      summary: "Passionate Full Stack Engineer, open-source contributor, and shell-scripting automation expert specializing in client-side state engines, REST/Websocket performance, and containerized deployments."
    },
    skills: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Git", "WebSockets", "Docker", "CI/CD Pipelines", "Shell Scripting", "Tailwind CSS", "Linux Servers"],
    education: {
      college: "Indian Institute of Technology",
      degree: "B.Tech in Computer Science & Engineering",
      year: "2024",
      gpa: "9.2/10"
    },
    experiences: [
      {
        company: "OpenSource Foundations",
        role: "Core Repository Contributor",
        year: "Jun 2023 - Present",
        summary: "Maintained React-based workspace tools, reviewing and merging pull requests from over 40 global contributors and standardizing module packaging structures.",
        points: [
          "Maintained React-based workspace tools, reviewing and merging pull requests from over 40 global contributors.",
          "Optimized package bundle sizes by 28% using tree-shaking practices and asset minification scripts.",
          "Wrote automated Jest testing coverage modules, increasing test suite reliability from 72% to 94%."
        ]
      },
      {
        company: "InnovateTech Solutions",
        role: "Frontend Engineering Intern",
        year: "May 2023 - Present",
        summary: "Architected modern modular UI dashboards using React, optimizing state management hooks and slashing average page load latency by 34%.",
        points: [
          "Architected modern modular UI dashboards using React, optimizing state hooks and reducing latency by 34%.",
          "Integrated GitHub actions hooks to deploy micro-site builds, cutting release overhead times by 40%."
        ]
      }
    ],
    projects: [
      {
        title: "ai-resume-builder",
        technologies: "React, Tailwind, Vite, WebSockets",
        points: [
          "Created interactive resume builder hosting live ATS scan simulations and custom theme adjustments.",
          "Integrated local storage synchronization algorithms to preserve client workspaces without account login."
        ]
      },
      {
        title: "telemetry-websockets",
        technologies: "Node.js, WebSockets, PostgreSQL, Docker",
        points: [
          "Developed server telemetry monitoring application collecting performance statistics via WebSocket protocols.",
          "Compressed client load under heavy concurrency, achieving 25% lower CPU overhead compared to HTTP pooling."
        ]
      }
    ],
    achievements: [
      { title: "GitHub Arctic Code Vault Contributor", desc: "Recognized for public code contributions preserved in Svalbard archive." }
    ],
    certificates: [
      { title: "GitHub Certified Actions Expert", issuer: "GitHub Certification Portal (2024)" }
    ],
    publications: [],
    responsibilities: [
      { role: "Open Source Advocate", desc: "Presented coding workshops at local student developer meetups." }
    ]
  };

  const handleAuthorize = () => {
    setIsVerifying(true);
    setTimeout(() => {
      if (window.opener) {
        window.opener.postMessage({
          type: "OAUTH_SUCCESS",
          importType: "GITHUB",
          user: {
            name: "Sri Aarush Aray",
            email: "sriaarush@github.com",
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aarush"
          },
          resume: gitHubResumeData
        }, window.location.origin);
      }
      window.close();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f6f8fa] text-[#24292f] font-sans flex flex-col items-center justify-center p-6">
      
      {isVerifying ? (
        <div className="bg-white border border-[#d0d7de] rounded-md p-10 max-w-sm w-full text-center space-y-4 shadow-sm">
          <svg className="w-10 h-10 text-[#24292f] animate-spin mx-auto" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-sm font-semibold text-slate-600">Completing GitHub authentication...</p>
        </div>
      ) : (
        <div className="w-full max-w-[480px] bg-white border border-[#d0d7de] rounded-md shadow-sm overflow-hidden">
          
          {/* Header connector */}
          <div className="bg-[#f6f8fa] border-b border-[#d0d7de] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8 text-[#24292f]" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.646.64.699 1.026 1.592 1.026 2.683 0 3.842-2.337 4.687-4.565 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.577.688.48C19.137 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              <span className="font-semibold text-slate-800 text-sm">GitHub Auth</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Step 1 of 2</span>
          </div>

          <div className="p-6 space-y-6">
            
            {/* Visual Auth Graphic */}
            <div className="flex items-center justify-center gap-6">
              {/* App Icon */}
              <div className="w-12 h-12 bg-slate-900 border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="q-logo-github" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <circle cx="15" cy="15" r="9" stroke="url(#q-logo-github)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="42 12" />
                  <path d="M12 10.5H17.5L19.5 12.5V19.5H12V10.5Z" fill="white" />
                  <path d="M21 21L27 27" stroke="url(#q-logo-github)" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>

              {/* Connected arrows */}
              <div className="text-[#57606a] flex items-center justify-center">
                <span className="text-xl">↔</span>
              </div>

              {/* GitHub User Avatar */}
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-600 font-bold shadow-sm text-sm">
                SA
              </div>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold">Authorize Resumiq</h2>
              <p className="text-xs text-[#57606a] mt-1">
                by <span className="font-semibold text-slate-800">sriaarush</span> wants access to your GitHub account.
              </p>
            </div>

            {/* Scope Details */}
            <div className="border border-[#d0d7de] rounded-md p-4 space-y-3 bg-[#f6f8fa] text-xs">
              <span className="font-bold text-[#57606a] uppercase tracking-wider text-[10px] block">Requested scopes</span>
              
              <div className="flex gap-2">
                <span className="text-emerald-600 font-bold text-sm">✓</span>
                <div>
                  <p className="font-semibold text-slate-800">Personal user & repository data</p>
                  <p className="text-[10px] text-[#57606a]">Access public profiles, repository commits, and primary email address</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              {/* Green Authorize Button */}
              <button 
                onClick={handleAuthorize}
                className="w-full bg-[#1f883d] hover:bg-[#1a7732] text-white font-bold py-2.5 rounded-md text-sm transition-colors cursor-pointer shadow-sm text-center"
              >
                Authorize Resumiq
              </button>
              
              <button 
                onClick={() => window.close()}
                className="w-full bg-white hover:bg-[#f6f8fa] border border-[#d0d7de] text-[#24292f] font-semibold py-2.5 rounded-md text-sm transition-colors cursor-pointer text-center"
              >
                Cancel
              </button>
            </div>

          </div>

          <div className="bg-[#f6f8fa] border-t border-[#d0d7de] px-6 py-4 text-xs text-[#57606a] leading-normal">
            By authorizing, you grant permissions to this app to execute actions according to their policies. GitHub does not manage these policies.
          </div>

        </div>
      )}

    </div>
  );
}

export default GitHubAuth;

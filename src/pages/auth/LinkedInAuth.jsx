import { useState } from "react";

function LinkedInAuth() {
  const [isVerifying, setIsVerifying] = useState(false);

  // LinkedIn Profile Resume Payload
  const linkedInResumeData = {
    personal: {
      fullName: "Sri Aarush Aray",
      email: "sriaarush.aray@linkedin.com",
      phone: "+91 98765 43210",
      location: "Bangalore, India",
      summary: "Innovative Software Architect and Senior Frontend Engineer with a proven history of designing modular UI architectures, leading cross-functional developer sprints, and scaling web applications for millions of active users."
    },
    skills: ["React", "TypeScript", "Redux", "Node.js", "Webpack", "UI Systems", "Agile Sprints", "Team Leadership", "System Design", "Webpack", "A/B Testing", "CI/CD Pipelines"],
    education: {
      college: "Indian Institute of Technology",
      degree: "B.Tech in Computer Science & Engineering",
      year: "2024",
      gpa: "9.2/10"
    },
    experiences: [
      {
        company: "InnovateTech Solutions",
        role: "Senior Frontend Engineer Intern",
        year: "May 2023 - Present",
        summary: "Architected modern modular UI dashboards using React, optimizing state management hooks and slashing average page load latency by 34% (from 420ms to 277ms).",
        points: [
          "Architected modular dashboard widgets using React, optimizing hooks and slashing average page load latency by 34%.",
          "Led a squad of 4 engineers during Scrum sprints to deliver complex dashboard widgets, accelerating release schedules by 3 weeks.",
          "Configured modular A/B testing variables, increasing average client onboarding conversions by 22%."
        ]
      },
      {
        company: "Launchpad Labs",
        role: "Software Developer Intern",
        year: "Dec 2022 - Apr 2023",
        summary: "Developed secure RESTful API routes in Node.js/Express, increasing database throughput by 2.2x using SQL query indices.",
        points: [
          "Developed secure RESTful API routes in Node.js/Express, increasing database throughput by 2.2x using SQL query indices.",
          "Implemented pixel-perfect responsive designs using Tailwind CSS, boosting mobile visitor session time by 18%."
        ]
      }
    ],
    projects: [
      {
        title: "Enterprise UI Design Library",
        technologies: "React, Webpack, Tailwind CSS",
        points: [
          "Created a centralized reusable design component library adopted by 5 internal engineering squads.",
          "Reduced code duplication by 45% and improved brand alignment across 8 production applications."
        ]
      }
    ],
    achievements: [
      { title: "LinkedIn Developer Spotlight", desc: "Recognized for contributions to UI engineering and community support." }
    ],
    certificates: [
      { title: "LinkedIn Certified Frontend Architect", issuer: "LinkedIn Learning (2024)" },
      { title: "AWS Certified Developer", issuer: "Amazon Web Services (2023)" }
    ],
    publications: [],
    responsibilities: [
      { role: "Scrum Master", desc: "Facilitated weekly standups, backlog refinements, and retrospective sessions." }
    ]
  };

  const handleAllow = () => {
    setIsVerifying(true);
    setTimeout(() => {
      if (window.opener) {
        window.opener.postMessage({
          type: "OAUTH_SUCCESS",
          importType: "LINKEDIN",
          user: {
            name: "Sri Aarush Aray",
            email: "sriaarush.aray@linkedin.com",
            avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aarush"
          },
          resume: linkedInResumeData
        }, window.location.origin);
      }
      window.close();
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#f3f6f8] text-[#000000] font-sans flex flex-col justify-between">
      
      {/* LinkedIn Blue Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-1.5">
          <svg className="w-8 h-8 text-[#0077b5]" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
          </svg>
          <span className="font-extrabold text-slate-800 text-sm tracking-wide">Developer Portal</span>
        </div>
        <span className="text-xs text-slate-500 font-medium">aarush.aray@gmail.com</span>
      </header>

      {/* Main Consent Body */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto">
        
        {isVerifying ? (
          <div className="text-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#0077b5] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-semibold text-slate-600">Verifying authorization token...</p>
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm w-full space-y-6">
            
            {/* Visual Link Indicator */}
            <div className="flex items-center justify-center gap-6 py-2">
              {/* App Logo */}
              <div className="w-12 h-12 bg-slate-900 border border-slate-200 rounded-xl flex items-center justify-center shadow-sm">
                <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <linearGradient id="q-logo-auth" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#22d3ee" />
                      <stop offset="50%" stopColor="#a78bfa" />
                      <stop offset="100%" stopColor="#ec4899" />
                    </linearGradient>
                  </defs>
                  <circle cx="15" cy="15" r="9" stroke="url(#q-logo-auth)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="42 12" />
                  <path d="M12 10.5H17.5L19.5 12.5V19.5H12V10.5Z" fill="white" />
                  <path d="M21 21L27 27" stroke="url(#q-logo-auth)" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
              </div>
              
              {/* Connector dots */}
              <div className="flex gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse"></span>
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-75"></span>
                <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse delay-150"></span>
              </div>

              {/* User Avatar */}
              <div className="w-12 h-12 bg-sky-100 border border-slate-200 rounded-full flex items-center justify-center font-bold text-sky-800 shadow-sm text-sm">
                SA
              </div>
            </div>

            <div className="text-center space-y-2">
              <h2 className="text-lg font-bold text-slate-800">Authorize Resumiq</h2>
              <p className="text-xs text-slate-500 leading-relaxed">
                The application <span className="font-semibold text-slate-800">Resumiq</span> is requesting permission to access your LinkedIn account.
              </p>
            </div>

            {/* Permissions list */}
            <div className="border-t border-slate-100 pt-4 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Scope of access</span>
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <span className="text-[#0077b5] mt-0.5">✓</span>
                <div>
                  <p className="font-semibold text-slate-800">Use your primary email address</p>
                  <p className="text-[10px] text-slate-400">sriaarush.aray@linkedin.com</p>
                </div>
              </div>
              <div className="flex items-start gap-3 text-xs text-slate-600">
                <span className="text-[#0077b5] mt-0.5">✓</span>
                <div>
                  <p className="font-semibold text-slate-800">Access your profile fields</p>
                  <p className="text-[10px] text-slate-400">Name, profile image url, country location, and work history details</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-2">
              <button 
                onClick={handleAllow}
                className="flex-1 bg-[#0077b5] hover:bg-[#006097] text-white font-bold py-2.5 rounded-full text-sm transition-colors cursor-pointer shadow-sm"
              >
                Allow Access
              </button>
              <button 
                onClick={() => window.close()}
                className="flex-1 bg-white hover:bg-slate-50 border border-slate-300 text-slate-600 font-bold py-2.5 rounded-full text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>

          </div>
        )}

      </main>

      {/* Footer Branding */}
      <footer className="bg-white border-t border-slate-200 py-3 text-center text-[10px] text-slate-400">
        LinkedIn &copy; {new Date().getFullYear()} • User Agreement • Privacy Policy
      </footer>

    </div>
  );
}

export default LinkedInAuth;

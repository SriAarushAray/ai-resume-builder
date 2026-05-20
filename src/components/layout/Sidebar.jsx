import { NavLink } from "react-router-dom";

/* ── Inline SVG Icon helper ── */
function Icon({ d, className = "w-5 h-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d={d} />
    </svg>
  );
}

/* ── Navigation config ── */
const mainNav = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: "M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z",
  },
  {
    label: "My Resumes",
    path: "/resumes",
    icon: "M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z",
    badge: "3",
  },
  {
    label: "Templates",
    path: "/templates",
    icon: "M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM2.25 16.875c0-.621.504-1.125 1.125-1.125h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75Z",
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z",
  },
];

const aiNav = [
  {
    label: "AI Assistant",
    path: "/ai-assistant",
    icon: "M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z",
    badge: "New",
  },
  {
    label: "Job Match",
    path: "/job-match",
    icon: "M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0",
  },
  {
    label: "ATS Checker",
    path: "/ats-checker",
    icon: "M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z",
  },
  {
    label: "Cover Letter",
    path: "/cover-letter",
    icon: "M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75",
  },
  {
    label: "Skill Insights",
    path: "/skill-insights",
    icon: "M12 18v-5.25m0 0a6.01 6.01 0 0 0 1.5-.189m-1.5.189a6.01 6.01 0 0 1-1.5-.189m3.75 7.478a12.06 12.06 0 0 1-4.5 0m3.75 2.383a14.406 14.406 0 0 1-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 1 0-7.517 0c.85.493 1.509 1.333 1.509 2.316V18",
  },
];

const accountNav = [
  {
    label: "Settings",
    path: "/settings",
    icon: "M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28ZM15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  },
  {
    label: "Help",
    path: "/help",
    icon: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z",
  },
];

/* ── Nav Item Component ── */
function SidebarItem({ item }) {
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group
        ${
          isActive
            ? "bg-accent/15 text-white border-l-[3px] border-accent ml-[-1px]"
            : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]"
        }`
      }
    >
      <Icon d={item.icon} className="w-5 h-5 flex-shrink-0" />
      <span className="flex-1">{item.label}</span>
      {item.badge && (
        <span
          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            item.badge === "New"
              ? "bg-accent-violet/20 text-accent-violet"
              : "bg-accent/20 text-accent-light"
          }`}
        >
          {item.badge}
        </span>
      )}
    </NavLink>
  );
}

/* ── Sidebar Component ── */
function Sidebar() {
  return (
    <aside className="w-[260px] h-screen bg-navy-950 border-r border-white/[0.06] flex flex-col fixed left-0 top-0 z-30">
      {/* Logo */}
      <div className="px-5 py-6 flex items-center gap-3">
        <div className="relative w-8 h-8 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400 to-violet-500 rounded-lg blur-sm opacity-40 animate-pulse"></div>
          <svg className="relative w-7 h-7" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="q-glow-sidebar" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="50%" stopColor="#a78bfa" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
            <circle cx="15" cy="15" r="9" stroke="url(#q-glow-sidebar)" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="42 12" />
            <path d="M12 10.5H17.5L19.5 12.5V19.5H12V10.5Z" fill="white" />
            <path d="M14 13.5H17" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
            <path d="M14 16.5H17" stroke="#0f172a" strokeWidth="1" strokeLinecap="round" />
            <path d="M21 21L27 27" stroke="url(#q-glow-sidebar)" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M24 27H27V24" stroke="url(#q-glow-sidebar)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div>
          <h1 className="text-base font-bold text-white tracking-tight">Resumiq</h1>
          <p className="text-xs text-slate-500">Free plan</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 space-y-6 pb-4">
        {/* Main */}
        <div className="space-y-1">
          {mainNav.map((item) => (
            <SidebarItem key={item.path} item={item} />
          ))}
        </div>

        {/* AI Features */}
        <div>
          <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            AI Features
          </p>
          <div className="space-y-1">
            {aiNav.map((item) => (
              <SidebarItem key={item.path} item={item} />
            ))}
          </div>
        </div>

        {/* Account */}
        <div>
          <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-600">
            Account
          </p>
          <div className="space-y-1">
            {accountNav.map((item) => (
              <SidebarItem key={item.path} item={item} />
            ))}
          </div>
        </div>
      </nav>

      {/* User & Sign Out */}
      {(() => {
        const userName = localStorage.getItem("userName") || "Sri Aarush";
        const userEmail = localStorage.getItem("userEmail") || "";
        const initials = userName
          .split(" ")
          .map(n => n[0])
          .join("")
          .slice(0, 2)
          .toUpperCase() || "US";

        return (
          <div className="px-4 py-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{userName}</p>
                <p className="text-xs text-slate-500 truncate">{userEmail || "Free plan"}</p>
              </div>
            </div>
            <button
              onClick={() => {
                // Sign out of Firebase if logged in, and navigate back to login screen
                import("../../firebase").then(({ auth }) => {
                  import("firebase/auth").then(({ signOut }) => {
                    signOut(auth).catch(() => {});
                  });
                });
                window.location.href = "/login";
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all flex-shrink-0"
              title="Sign Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        );
      })()}
    </aside>
  );
}

export default Sidebar;

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import axios from "axios";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the server folder's .env file explicitly
dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5000;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// Configure CORS so React (on port 5173) can talk to Express (on port 5000)
app.use(cors({
  origin: FRONTEND_URL,
  credentials: true
}));

// Express parses incoming JSON requests automatically
app.use(express.json());

// Print setup info on start
const hasGitHubKeys = !!(process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET);
const hasLinkedInKeys = !!(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET);

console.log("--------------------------------------------------");
console.log(`Resumiq Backend: GitHub OAuth configuration: ${hasGitHubKeys ? "ACTIVE" : "FALLBACK (MOCK)"}`);
console.log(`Resumiq Backend: LinkedIn OAuth configuration: ${hasLinkedInKeys ? "ACTIVE" : "FALLBACK (MOCK)"}`);
console.log("--------------------------------------------------");

// ==========================================
// 1. GITHUB OAUTH ENDPOINTS
// ==========================================

// React popup opens this route to initiate the sign-in
app.get("/api/auth/github", (req, res) => {
  if (hasGitHubKeys) {
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}&redirect_uri=${process.env.GITHUB_REDIRECT_URI}&scope=read:user,repo`;
    console.log("Backend: Redirecting user to real GitHub OAuth page...");
    res.redirect(githubAuthUrl);
  } else {
    console.log("Backend: No GitHub keys found. Redirecting to simulated callback...");
    // Simulate the callback by sending the user straight to our callback endpoint with a mock code
    res.redirect("/api/auth/github/callback?code=mock_github_code");
  }
});

// GitHub redirects the user back here with an authorization code
app.get("/api/auth/github/callback", async (req, res) => {
  const { code } = req.query;
  console.log(`Backend: Received GitHub OAuth callback code: ${code}`);

  let userData = {
    name: "Sri Aarush Aray",
    email: "sriaarush@github.com",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aarush"
  };

  let repositories = [
    { name: "ai-resume-builder", description: "Vite + React interactive resume builder with ATS scan animations.", language: "JavaScript" },
    { name: "telemetry-websockets", description: "Express + WS application collecting CPU statistics.", language: "Node.js" }
  ];

  if (hasGitHubKeys && code !== "mock_github_code") {
    try {
      // Step A: Exchange the code for an access token
      const tokenResponse = await axios.post("https://github.com/login/oauth/access_token", {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      }, {
        headers: { Accept: "application/json" }
      });

      const accessToken = tokenResponse.data.access_token;

      // Step B: Use access token to fetch user profile details
      const userResponse = await axios.get("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      // Step C: Fetch user's public repositories
      const reposResponse = await axios.get("https://api.github.com/user/repos?sort=updated&per_page=5", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      userData = {
        name: userResponse.data.name || userResponse.data.login,
        email: userResponse.data.email || `${userResponse.data.login}@github.com`,
        avatar: userResponse.data.avatar_url,
        location: userResponse.data.location || "",
        bio: userResponse.data.bio || ""
      };

      repositories = reposResponse.data.map(repo => ({
        name: repo.name,
        description: repo.description || "No description provided.",
        language: repo.language || "Markdown"
      }));

      console.log(`Backend: Successfully fetched real profile data for GitHub user: ${userData.name}`);
    } catch (err) {
      console.error("Backend: Error calling GitHub API, falling back to mock:", err.message);
    }
  }

  const isMock = (code === "mock_github_code");

  // Build the developer-styled resume payload
  const resumePayload = {
    personal: {
      fullName: userData.name,
      email: userData.email,
      phone: isMock ? "+91 98765 43210" : "",
      location: isMock ? "Bangalore, India" : (userData.location || ""),
      summary: isMock
        ? "Full Stack Engineer and active GitHub developer. Specialized in building modern web interfaces, optimizing Javascript codebases, and automating workflows."
        : (userData.bio || "")
    },
    skills: isMock
      ? ["React", "Node.js", "Express", "Git", "TypeScript", ...repositories.map(r => r.language)]
      : [...new Set(repositories.map(r => r.language).filter(Boolean))],
    education: {
      college: isMock ? "Indian Institute of Technology" : "",
      degree: isMock ? "B.Tech" : "",
      year: isMock ? "2024" : "",
      gpa: isMock ? "9.2/10" : ""
    },
    experiences: isMock ? [
      {
        company: "GitHub OpenSource Foundations",
        role: "Repository Contributor",
        year: "Jun 2023 - Present",
        summary: "Actively maintained repositories and reviewed incoming patches, optimizing bundle distributions.",
        points: [
          "Contributed features and documentation to various Javascript frameworks.",
          "Wrote automation scripts to streamline package tests and build checks."
        ]
      }
    ] : [],
    projects: repositories.slice(0, 3).map(repo => ({
      title: repo.name,
      technologies: repo.language || "Markdown",
      points: [
        repo.description || "Project built on GitHub.",
        isMock ? "Constructed testing coverage suites, ensuring clean deployment logs." : "Developed and maintained codebase using Git."
      ]
    })),
    achievements: isMock ? [
      { title: "GitHub Code Vault Contributor", desc: "Recognized for public open-source contributions." }
    ] : [],
    certificates: isMock ? [
      { title: "GitHub Certified Developer", issuer: "GitHub Inc. (2024)" }
    ] : [],
    publications: [],
    responsibilities: isMock ? [
      { role: "Developer Advocate", desc: "Maintained repository issues and mentored junior contributors." }
    ] : []
  };

  // Return HTML that executes postMessage to transfer user data back to the React window, then closes
  res.send(`
    <html>
      <body>
        <p>Signing in... Please wait.</p>
        <script>
          window.opener.postMessage({
            type: "OAUTH_SUCCESS",
            importType: "GITHUB",
            user: ${JSON.stringify(userData)},
            resume: ${JSON.stringify(resumePayload)}
          }, "*");
          window.close();
        </script>
      </body>
    </html>
  `);
});

// ==========================================
// 2. LINKEDIN OAUTH ENDPOINTS
// ==========================================

// React popup opens this route to initiate LinkedIn sign-in
app.get("/api/auth/linkedin", (req, res) => {
  if (hasLinkedInKeys) {
    const linkedinAuthUrl = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${process.env.LINKEDIN_REDIRECT_URI}&scope=openid%20profile%20email`;
    console.log("Backend: Redirecting user to real LinkedIn OAuth page...");
    res.redirect(linkedinAuthUrl);
  } else {
    console.log("Backend: No LinkedIn keys found. Redirecting to simulated callback...");
    res.redirect("/api/auth/linkedin/callback?code=mock_linkedin_code");
  }
});

// LinkedIn redirects user here
app.get("/api/auth/linkedin/callback", async (req, res) => {
  const { code } = req.query;
  console.log(`Backend: Received LinkedIn OAuth callback code: ${code}`);

  let userData = {
    name: "Sri Aarush Aray",
    email: "sriaarush.aray@linkedin.com",
    avatar: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aarush"
  };

  if (hasLinkedInKeys && code !== "mock_linkedin_code") {
    try {
      // Step A: Exchange the code for an access token
      const tokenResponse = await axios.post("https://www.linkedin.com/oauth/v2/accessToken", null, {
        params: {
          grant_type: "authorization_code",
          code: code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET
        },
        headers: { "Content-Type": "application/x-www-form-urlencoded" }
      });

      const accessToken = tokenResponse.data.access_token;

      // Step B: Fetch user profile & email in one step using the OpenID userinfo endpoint
      const userInfoResponse = await axios.get("https://api.linkedin.com/v2/userinfo", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      userData = {
        name: userInfoResponse.data.name || `${userInfoResponse.data.given_name} ${userInfoResponse.data.family_name}`,
        email: userInfoResponse.data.email,
        avatar: userInfoResponse.data.picture || "https://api.dicebear.com/7.x/adventurer/svg?seed=Aarush"
      };

      console.log(`Backend: Successfully fetched real profile data for LinkedIn user: ${userData.name}`);
    } catch (err) {
      console.error("Backend: Error calling LinkedIn API, falling back to mock:", err.message);
    }
  }

  const isMock = (code === "mock_linkedin_code");

  // Build the professional-styled resume payload
  const resumePayload = {
    personal: {
      fullName: userData.name,
      email: userData.email,
      phone: isMock ? "+91 98765 43210" : "",
      location: isMock ? "Bangalore, India" : "",
      summary: isMock 
        ? "Senior Software Architect and UI Engineer with a history of leading developer sprints, designing highly modular state trees, and optimizing page load speeds."
        : ""
    },
    skills: isMock 
      ? ["React", "TypeScript", "Redux", "Node.js", "Webpack", "UI Systems", "Agile Sprints", "Team Leadership", "System Design"]
      : [],
    education: {
      college: isMock ? "Indian Institute of Technology" : "",
      degree: isMock ? "B.Tech" : "",
      year: isMock ? "2024" : "",
      gpa: isMock ? "9.2/10" : ""
    },
    experiences: isMock ? [
      {
        company: "InnovateTech Solutions",
        role: "Senior Frontend Engineer Intern",
        year: "May 2023 - Present",
        summary: "Architected modular analytics interfaces in React, cutting dashboard rendering latency by 34%.",
        points: [
          "Architected dashboard widgets using React, optimizing rendering paths.",
          "Coached a team of 4 junior developers to ship design modules on schedule."
        ]
      },
      {
        company: "Launchpad Labs",
        role: "Software Developer Intern",
        year: "Dec 2022 - Apr 2023",
        summary: "Coded backend REST routes, optimizing throughput using indexed database keys.",
        points: [
          "Developed backend REST routes, optimizing database response metrics.",
          "Created responsive components using Tailwind CSS, boosting user retention rates."
        ]
      }
    ] : [],
    projects: isMock ? [
      {
        title: "Enterprise Component Library",
        technologies: "React, Webpack, Tailwind CSS",
        points: [
          "Designed central utility components, accelerating interface deployment schedules."
        ]
      }
    ] : [],
    achievements: isMock ? [
      { title: "LinkedIn Spotlight Engineer", desc: "Recognized for community UI contributions." }
    ] : [],
    certificates: isMock ? [
      { title: "LinkedIn Certified Architect", issuer: "LinkedIn (2024)" }
    ] : [],
    publications: [],
    responsibilities: isMock ? [
      { role: "Scrum Master", desc: "Coordinated weekly standups and sprint planning tasks." }
    ] : []
  };

  res.send(`
    <html>
      <body>
        <p>Signing in... Please wait.</p>
        <script>
          window.opener.postMessage({
            type: "OAUTH_SUCCESS",
            importType: "LINKEDIN",
            user: ${JSON.stringify(userData)},
            resume: ${JSON.stringify(resumePayload)}
          }, "*");
          window.close();
        </script>
      </body>
    </html>
  `);
});

// Start listening for web requests
app.listen(PORT, () => {
  console.log(`Backend server successfully running on port ${PORT}`);
});

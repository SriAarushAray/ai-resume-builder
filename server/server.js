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
const hasClaudeKey = !!(process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY);
const hasGeminiKey = !!process.env.GEMINI_API_KEY;
const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

const aiProvider = hasClaudeKey 
  ? "Claude (claude-3-5-sonnet)" 
  : hasGeminiKey 
  ? "Gemini (gemini-2.5-flash)" 
  : hasOpenAIKey 
  ? "OpenAI (gpt-4o-mini)" 
  : "LOCAL FALLBACK (no API key)";

console.log("--------------------------------------------------");
console.log(`Resumiq Backend: GitHub OAuth configuration: ${hasGitHubKeys ? "ACTIVE" : "FALLBACK (MOCK)"}`);
console.log(`Resumiq Backend: LinkedIn OAuth configuration: ${hasLinkedInKeys ? "ACTIVE" : "FALLBACK (MOCK)"}`);
console.log(`Resumiq Backend: AI Provider: ${aiProvider}`);
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


// ==========================================
// 3. AI SKILLS GROUPING ENDPOINT
// ==========================================
app.post("/api/ai/group-skills", async (req, res) => {
  const { skills } = req.body;
  if (!Array.isArray(skills) || skills.length === 0) {
    return res.status(400).json({ error: "Skills array is required." });
  }

  const geminiKey = process.env.GEMINI_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  if (geminiKey) {
    try {
      console.log("Backend AI: Fetching skills categorization and suggestions from Gemini API...");
      const prompt = `Analyze the following list of skills: ${JSON.stringify(skills)}.
Perform two tasks and output the result as a raw JSON object with exactly two fields:
1. "grouped": An array of objects. Each object must have a "category" (string, e.g. Languages, Web & Frameworks, Developer Tools) and "items" (array of strings).
2. "suggested": An array of 5-8 highly relevant, missing skills that would complement the existing list.
Do not include any markdown wrapper or explanation, just the raw JSON.`;

      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
        {
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      const parsed = JSON.parse(responseText.trim());
      console.log("Backend AI: Gemini processed successfully.");
      return res.json({
        grouped: parsed.grouped || [],
        suggested: parsed.suggested || []
      });
    } catch (err) {
      console.error("Backend AI: Gemini call failed, falling back to rule-based:", err.message);
    }
  } else if (openaiKey) {
    try {
      console.log("Backend AI: Fetching skills categorization and suggestions from OpenAI API...");
      const prompt = `Analyze the following list of skills: ${JSON.stringify(skills)}.
Perform two tasks and output the result as a raw JSON object with exactly two fields:
1. "grouped": An array of objects. Each object must have a "category" (string, e.g. Languages, Web & Frameworks, Developer Tools) and "items" (array of strings).
2. "suggested": An array of 5-8 highly relevant, missing skills that would complement the existing list.
Do not include any markdown wrapper or explanation, just the raw JSON.`;

      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" }
        },
        { headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" } }
      );

      const resText = response.data?.choices?.[0]?.message?.content;
      const parsed = JSON.parse(resText.trim());
      console.log("Backend AI: OpenAI processed successfully.");
      return res.json({
        grouped: parsed.grouped || [],
        suggested: parsed.suggested || []
      });
    } catch (err) {
      console.error("Backend AI: OpenAI call failed, falling back to rule-based:", err.message);
    }
  }

  // Local Rule-Based Fallback Grouping & Suggestions (No API key or API failure)
  console.log("Backend AI: No API keys present or API failed. Using rule-based fallback...");
  const categories = {
    "Languages": ["javascript", "typescript", "python", "java", "c++", "c", "go", "rust", "c#", "php", "ruby", "sql", "html", "css", "c/c++"],
    "Web & Frameworks": ["react", "react.js", "node.js", "node", "express", "express.js", "angular", "vue", "next.js", "tailwind", "tailwind css", "bootstrap", "sass", "websockets", "graphql", "flask", "django", "spring boot", "web & frameworks", "rest apis", "jwt", "razorpay"],
    "Developer Tools": ["git", "github", "docker", "kubernetes", "aws", "azure", "gcp", "google cloud platform", "linux", "jenkins", "jira", "vs code", "pycharm", "jupyter", "postman", "webpack", "firebase", "developer tools"],
    "Databases": ["postgresql", "mongodb", "mysql", "redis", "sqlite", "oracle", "mariadb", "databases", "dbms", "database management systems"],
    "Machine Learning": ["machine learning", "deep learning", "numpy", "pandas", "matplotlib", "scikit-learn", "scikit-learn", "cnn", "transfer learning", "resnet", "densenet", "mobilenet", "vgg16"]
  };

  const grouped = [];
  const assigned = new Set();

  for (const [catName, list] of Object.entries(categories)) {
    const items = [];
    for (const skill of skills) {
      if (list.includes(skill.toLowerCase())) {
        items.push(skill);
        assigned.add(skill);
      }
    }
    if (items.length > 0) {
      grouped.push({ category: catName, items });
    }
  }

  const otherItems = skills.filter(s => !assigned.has(s));
  if (otherItems.length > 0) {
    grouped.push({ category: "Other Skills", items: otherItems });
  }

  // Local static suggestions based on current skills
  const allSuggested = [];
  const lowercaseSkills = skills.map(s => s.toLowerCase());
  
  if (lowercaseSkills.includes("react") && !lowercaseSkills.includes("typescript")) {
    allSuggested.push("TypeScript");
  }
  if (lowercaseSkills.includes("react") && !lowercaseSkills.includes("redux")) {
    allSuggested.push("Redux");
  }
  if (lowercaseSkills.includes("javascript") && !lowercaseSkills.includes("html")) {
    allSuggested.push("HTML");
  }
  if (lowercaseSkills.includes("javascript") && !lowercaseSkills.includes("css")) {
    allSuggested.push("CSS");
  }
  if (lowercaseSkills.includes("python") && !lowercaseSkills.includes("numpy")) {
    allSuggested.push("NumPy");
  }
  if (lowercaseSkills.includes("python") && !lowercaseSkills.includes("pandas")) {
    allSuggested.push("Pandas");
  }
  if (lowercaseSkills.includes("node.js") && !lowercaseSkills.includes("express")) {
    allSuggested.push("Express");
  }
  if (lowercaseSkills.includes("docker") && !lowercaseSkills.includes("kubernetes")) {
    allSuggested.push("Kubernetes");
  }
  if (lowercaseSkills.includes("sql") && !lowercaseSkills.includes("postgresql")) {
    allSuggested.push("PostgreSQL");
  }
  if (lowercaseSkills.includes("git") && !lowercaseSkills.includes("github")) {
    allSuggested.push("GitHub");
  }

  const generalSuggestions = ["Data Structures", "Algorithms", "Software Engineering"];
  for (const s of generalSuggestions) {
    if (allSuggested.length < 5 && !lowercaseSkills.includes(s.toLowerCase())) {
      allSuggested.push(s);
    }
  }

  console.log("Backend AI: Rule-based categorisation completed.");
  return res.json({ grouped, suggested: allSuggested });
});


// Helper function to simulate professional summary optimization locally (when no API keys are present)
function localOptimizeSummary(draft) {
  if (!draft) return "";
  let text = draft.trim();
  
  const replacements = [
    // Pre-optimized templates (cycle-replacements for consecutive clicks)
    {
      pattern: /\bDedicated Computer Science student and aspiring engineer\b/gi,
      replacements: [
        "Motivated Computer Science major and developer",
        "Forward-thinking Computer Science student",
        "Dedicated Computer Science candidate and tech enthusiast"
      ]
    },
    {
      pattern: /\bseeking a challenging internship opportunity\b/gi,
      replacements: [
        "eager to secure a technical internship role",
        "driven to obtain a hands-on internship",
        "seeking a professional development internship"
      ]
    },
    {
      pattern: /\bPossesses a robust foundation in\b/gi,
      replacements: [
        "Equipped with a solid background in",
        "Demonstrates strong capabilities in",
        "Exhibits a deep understanding of"
      ]
    },
    {
      pattern: /\bComplemented by excellent communication skills and a collaborative, team-oriented work ethic\b/gi,
      replacements: [
        "Supported by strong interpersonal communication capabilities and a team-first mindset",
        "Distinguished by exceptional communication skills and a collaborative attitude",
        "Exhibiting excellent communication skills coupled with a collaborative work ethic"
      ]
    },
    {
      pattern: /\bAims to contribute to high-impact projects\b/gi,
      replacements: [
        "Striving to deliver technical value on meaningful projects",
        "Eager to collaborate on practical engineering solutions",
        "Motivated to engineer solutions that drive tangible value"
      ]
    },

    // Standard draft replacements (randomized for variety)
    {
      pattern: /\bcomputer science enthusiast\b/gi,
      replacements: [
        "Dedicated Computer Science student and aspiring engineer",
        "Motivated Computer Science major and developer",
        "Forward-thinking Computer Science scholar and aspiring developer"
      ]
    },
    {
      pattern: /\bseeks an internship\b/gi,
      replacements: [
        "seeking a challenging internship opportunity",
        "eager to secure a technical internship role",
        "driven to obtain a hands-on internship"
      ]
    },
    {
      pattern: /\bseek an internship\b/gi,
      replacements: [
        "seeking a challenging internship opportunity",
        "eager to secure a technical internship role",
        "driven to obtain a hands-on internship"
      ]
    },
    {
      pattern: /\bto explore challenging opportunities and demonstrate a commitment to continuous learning\b/gi,
      replacements: [
        "to leverage technical aptitude and demonstrate a commitment to continuous learning",
        "to apply foundational knowledge and foster professional growth",
        "where I can contribute fresh perspectives while pursuing continuous skill development"
      ]
    },
    {
      pattern: /\bI have a strong foundation in\b/gi,
      replacements: [
        "Possesses a robust foundation in",
        "Equipped with a solid background in",
        "Demonstrates deep core capabilities in"
      ]
    },
    {
      pattern: /\bhave a strong foundation in\b/gi,
      replacements: [
        "possessing a robust foundation in",
        "equipped with a solid background in",
        "backed by a strong understanding of"
      ]
    },
    {
      pattern: /\bhas a strong foundation in\b/gi,
      replacements: [
        "possessing a robust foundation in",
        "equipped with a solid background in",
        "backed by a strong understanding of"
      ]
    },
    {
      pattern: /\bam interested in\b/gi,
      replacements: [
        "passionate about",
        "keenly interested in",
        "focused on"
      ]
    },
    {
      pattern: /\bis interested in\b/gi,
      replacements: [
        "passionate about",
        "keenly interested in",
        "focused on"
      ]
    },
    {
      pattern: /\bexploring the intersection of\b/gi,
      replacements: [
        "driving innovation at the intersection of",
        "developing solutions at the junction of",
        "advancing projects at the intersection of"
      ]
    },
    {
      pattern: /\bI also possess excellent communication skills and am a team player\b/gi,
      replacements: [
        "Complemented by excellent communication skills and a collaborative, team-oriented work ethic",
        "Supported by strong interpersonal capabilities and a highly collaborative team spirit",
        "Distinguished by excellent communication skills and a team-first collaborative mindset"
      ]
    },
    {
      pattern: /\bpossess excellent communication\b/gi,
      replacements: [
        "complemented by strong communication",
        "supported by excellent communication",
        "distinguished by solid interpersonal"
      ]
    },
    {
      pattern: /\bpossesses excellent communication\b/gi,
      replacements: [
        "complemented by strong communication",
        "supported by excellent communication",
        "distinguished by solid interpersonal"
      ]
    },
    {
      pattern: /\bam a team player\b/gi,
      replacements: [
        "collaborative team player",
        "highly collaborative team member",
        "team-oriented contributor"
      ]
    },
    {
      pattern: /\bThe goal is to work on projects\b/gi,
      replacements: [
        "Aims to contribute to high-impact projects",
        "Striving to deliver value on meaningful projects",
        "Eager to collaborate on practical initiatives"
      ]
    },
    {
      pattern: /\bwork on projects\b/gi,
      replacements: [
        "high-impact projects",
        "innovative engineering solutions",
        "real-world projects"
      ]
    },
    {
      pattern: /\breal-world impact\b/gi,
      replacements: [
        "tangible real-world impact",
        "direct real-world value",
        "measurable industry impact"
      ]
    },
    {
      pattern: /\bimprove people’s lives\b/gi,
      replacements: [
        "enhance user experiences and solve complex problems",
        "deliver meaningful public value and user benefits",
        "make an active difference in user-facing applications"
      ]
    },
    {
      pattern: /\bimprove peoples lives\b/gi,
      replacements: [
        "enhance user experiences and solve complex problems",
        "deliver meaningful public value and user benefits",
        "make an active difference in user-facing applications"
      ]
    },
    {
      pattern: /\benthusiast\b/gi,
      replacements: [
        "aspiring professional",
        "motivated learner",
        "passionate student"
      ]
    },
    {
      pattern: /\bam looking for\b/gi,
      replacements: [
        "seeking",
        "actively pursuing",
        "exploring"
      ]
    },
    {
      pattern: /\blooking to\b/gi,
      replacements: [
        "motivated to",
        "striving to",
        "preparing to"
      ]
    },
    {
      pattern: /\bgood at\b/gi,
      replacements: [
        "proficient in",
        "skilled in",
        "adept at"
      ]
    },
    {
      pattern: /\bhelp me to\b/gi,
      replacements: [
        "enable me to",
        "empower me to",
        "facilitate my ability to"
      ]
    },
    {
      pattern: /\bwant to\b/gi,
      replacements: [
        "striving to",
        "committed to",
        "seeking to"
      ]
    }
  ];

  for (const item of replacements) {
    if (item.replacements) {
      const list = item.replacements;
      const randomIndex = Math.floor(Math.random() * list.length);
      const selected = list[randomIndex];
      text = text.replace(item.pattern, selected);
    } else {
      text = text.replace(item.pattern, item.replacement);
    }
  }

  // Capitalize sentences
  text = text
    .split(/([.!?]\s+)/)
    .map(part => {
      if (part.trim().length > 0 && !/[.!?]/.test(part)) {
        return part.charAt(0).toUpperCase() + part.slice(part.charCodeAt(0) === 32 ? 2 : 1);
      }
      return part;
    })
    .join("");

  // Fix clean space capitalization index slice edge case (ensure first char capitalized)
  if (text.length > 0) {
    text = text.charAt(0).toUpperCase() + text.slice(1);
  }

  if (!/[.!?]$/.test(text)) {
    text += ".";
  }

  return text;
}

// ==========================================
// 4. AI SUMMARY IMPROVEMENT ENDPOINT
// ==========================================
app.post("/api/ai/improve-summary", async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: "resumeData is required." });
    }

    const personal = resumeData.personal || {};
    const experiences = Array.isArray(resumeData.experiences) ? resumeData.experiences : [];
    const projects = Array.isArray(resumeData.projects) ? resumeData.projects : [];
    const education = resumeData.education || {};

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const mappedExperiences = experiences
      .map(e => e && e.role && e.company ? `${e.role} at ${e.company}` : "")
      .filter(Boolean)
      .join(", ");

    const mappedProjects = projects
      .map(p => p && p.title ? p.title : "")
      .filter(Boolean)
      .join(", ");

    const prompt = `Write a professional resume summary for the following candidate profile:
Name: ${personal.fullName || "Candidate"}
Current Draft Summary: ${personal.summary || "None provided"}
Education: ${education.college ? `${education.degree || ""} at ${education.college}` : ""}
Experience: ${mappedExperiences || "None provided"}
Projects: ${mappedProjects || "None provided"}

Requirements:
- Make it 3-4 sentences long.
- Keep the summary focused on career goals, high-level strengths, accomplishments, soft skills, and continuous learning.
- Do NOT list or include a laundry list of technical skills, languages, or frameworks in the summary (these belong in the dedicated Technical Skills section of the resume).
- If a "Current Draft Summary" is provided, base the professional summary on it by refining and polishing the tone, correcting grammar, and improving professional vocabulary.
- Keep it highly professional, results-oriented, and suitable for recruitment tracking systems.
- Output ONLY the plain text summary, do not include quotes or markdown wrapping.`;

    if (geminiKey) {
      try {
        console.log("Backend AI: Generating summary from Gemini API...");
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            contents: [{ parts: [{ text: prompt }] }]
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
          const summary = responseText.trim().replace(/^["']|["']$/g, "");
          console.log("Backend AI: Gemini generated summary successfully.");
          return res.json({ summary });
        }
      } catch (err) {
        console.error("Backend AI: Gemini call failed, falling back to template-based:", err.message);
      }
    } else if (openaiKey) {
      try {
        console.log("Backend AI: Generating summary from OpenAI API...");
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
          },
          { headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" } }
        );

        const resText = response.data?.choices?.[0]?.message?.content;
        if (resText) {
          const summary = resText.trim().replace(/^["']|["']$/g, "");
          console.log("Backend AI: OpenAI generated summary successfully.");
          return res.json({ summary });
        }
      } catch (err) {
        console.error("Backend AI: OpenAI call failed, falling back to template-based:", err.message);
      }
    }

    // Fallback Dynamic Template-Based Summary Generator
    console.log("Backend AI: No API keys present or API failed. Using template-based fallback...");
    
    let summary = "";
    
    if (personal.summary && personal.summary.trim().length > 10) {
      // Local rule-based optimization translation
      summary = localOptimizeSummary(personal.summary);
    } else {
      // Standard generic template fallback if no draft is present
      const firstExp = experiences.find(e => e && e.role && e.company);
      const expPart = firstExp
        ? `Results-driven professional with a proven track record of success, including experience as ${firstExp.role} at ${firstExp.company}.`
        : "Results-driven engineering professional with strong analytical skills and a dedication to continuous learning.";
        
      const firstProj = projects.find(p => p && p.title);
      const projPart = firstProj
        ? `Demonstrated ability to design robust solutions and collaborate across teams on key initiatives like the "${firstProj.title}" project.`
        : "Passionate about leveraging modern software methodologies to solve complex user-centric challenges and contribute to innovative teams.";
        
      const eduPart = education.college
        ? `Academic foundation backed by studies at ${education.college}.`
        : "";

      summary = `${expPart} ${projPart} ${eduPart}`.trim();
    }

    console.log("Backend AI: Template-based summary generated successfully.");
    return res.json({ summary });
  } catch (error) {
    console.error("Backend AI: Crash occurred during summary optimization:", error);
    return res.status(500).json({ error: "Internal server error occurred during summary optimization." });
  }
});



// ==========================================
// 5. AI EXPERIENCE BULLET REWRITER ENDPOINT
// ==========================================
app.post("/api/ai/rewrite-bullets", async (req, res) => {
  try {
    const { role, company, description } = req.body;
    if (!role && !company) {
      return res.status(400).json({ error: "At least role or company is required." });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const prompt = `Generate 3-4 professional resume bullet points for the following work experience:
Role: ${role || "Not specified"}
Company: ${company || "Not specified"}
${description ? `Additional context: ${description}` : ""}

Requirements:
- Each bullet point must start with a strong, active past-tense action verb (e.g. "Developed", "Optimized", "Led", "Reduced", "Architected", "Implemented").
- Make them ATS-friendly, results-oriented, and quantified where possible (e.g. "reduced load time by 40%", "built a system serving 1000+ users").
- Keep each point concise — one impactful sentence each.
- Do NOT include vague language like "helped with", "worked on", "was involved in".
- Output ONLY a raw JSON array of strings. No markdown, no explanation. Example: ["Built...", "Led...", "Reduced..."]`;

    if (geminiKey) {
      try {
        console.log("Backend AI: Generating experience bullets from Gemini API...");
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
          const bullets = JSON.parse(responseText.trim());
          if (Array.isArray(bullets) && bullets.length > 0) {
            console.log("Backend AI: Gemini generated bullets successfully.");
            return res.json({ bullets });
          }
        }
      } catch (err) {
        console.error("Backend AI: Gemini bullets call failed, falling back:", err.message);
      }
    } else if (openaiKey) {
      try {
        console.log("Backend AI: Generating experience bullets from OpenAI API...");
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
          },
          { headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" } }
        );

        const resText = response.data?.choices?.[0]?.message?.content;
        if (resText) {
          const parsed = JSON.parse(resText.trim());
          const bullets = Array.isArray(parsed) ? parsed : parsed.bullets || parsed.points || [];
          if (bullets.length > 0) {
            console.log("Backend AI: OpenAI generated bullets successfully.");
            return res.json({ bullets });
          }
        }
      } catch (err) {
        console.error("Backend AI: OpenAI bullets call failed, falling back:", err.message);
      }
    }

    // Local rule-based fallback bullet generator
    console.log("Backend AI: No API key or API failed. Using rule-based bullet fallback...");

    const roleStr = role || "professional";
    const companyStr = company || "the organization";
    const roleVerbs = {
      engineer: ["Developed", "Architected", "Optimized"],
      developer: ["Built", "Implemented", "Engineered"],
      intern: ["Contributed to", "Assisted in developing", "Collaborated on"],
      analyst: ["Analyzed", "Assessed", "Researched"],
      manager: ["Led", "Coordinated", "Managed"],
      designer: ["Designed", "Prototyped", "Iterated on"],
      default: ["Developed", "Contributed to", "Collaborated on"]
    };

    const roleLower = roleStr.toLowerCase();
    const verbs = Object.keys(roleVerbs).find(key => roleLower.includes(key))
      ? roleVerbs[Object.keys(roleVerbs).find(key => roleLower.includes(key))]
      : roleVerbs.default;

    const bullets = [
      `${verbs[0]} scalable features and solutions as a ${roleStr} at ${companyStr}, directly improving system performance and user experience.`,
      `${verbs[1]} multiple modules with a focus on code quality, maintainability, and adherence to industry best practices.`,
      `${verbs[2]} cross-functional teams to deliver key milestones on schedule, demonstrating strong communication and project management skills.`,
      `Documented technical specifications and participated in code reviews, contributing to a culture of engineering excellence.`
    ];

    console.log("Backend AI: Rule-based bullets generated.");
    return res.json({ bullets });
  } catch (error) {
    console.error("Backend AI: Crash in rewrite-bullets:", error);
    return res.status(500).json({ error: "Internal server error during bullet generation." });
  }
});

// ==========================================
// 6. AI JOB DESCRIPTION MATCHING & TAILORING ENDPOINT
// ==========================================
app.post("/api/ai/job-match", async (req, res) => {
  try {
    const { resumeData, jobDescription, jobTitle } = req.body;
    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: "resumeData and jobDescription are required." });
    }

    const claudeKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const prompt = `You are an expert ATS (Applicant Tracking System) recruiter and resume optimization AI.
Analyze the following candidate resume data and the target job description:

Target Job Title: ${jobTitle || "Not specified"}
Target Job Description:
"""
${jobDescription}
"""

Resume Data:
"""
${JSON.stringify(resumeData)}
"""

Tasks:
1. Compare the skills, experience, and projects in the resume against the requirements in the Job Description.
2. Identify which core skills/technologies from the Job Description are "matched" (present in the resume) vs "missing" (required/recommended in the JD but absent or weak in the resume).
3. Compute a real ATS Match Score (0 to 100) representing how well the candidate's profile matches the JD.
4. Review every bullet point, summary, and description in the resume's experiences and projects, and generate an optimized "tailored" version. Each optimized bullet should start with a strong action verb, incorporate relevant missing keywords from the JD naturally, and include a realistic quantitative metric (e.g. "improving efficiency by 20%") matching the context of the work.
5. Return the result in raw JSON format. The JSON must have exactly this structure:
{
  "score": 85,
  "matched": ["React", "TypeScript", "Node.js"],
  "missing": ["Docker", "CI/CD", "Jest"],
  "tailoredBullets": [
    {
      "type": "experience",
      "index": 0,
      "field": "summary",
      "label": "InnovateTech Solutions - Senior Frontend Engineer (Summary)",
      "original": "Worked on the React dashboard.",
      "tailored": "Architected modular analytics widgets using React, cutting dashboard latency by 34% and improving team sprint velocities."
    }
  ]
}

Ensure the "tailoredBullets" array matches the exact items from the candidate's experiences and projects.
Return ONLY raw JSON, with no markdown code block wrapping or formatting explanation.`;

    if (claudeKey) {
      try {
        console.log("Backend AI: Calling Claude API for job match analysis...");
        const response = await axios.post(
          "https://api.anthropic.com/v1/messages",
          {
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 4000,
            messages: [{ role: "user", content: prompt }]
          },
          {
            headers: {
              "x-api-key": claudeKey,
              "anthropic-version": "2023-06-01",
              "content-type": "application/json"
            }
          }
        );

        const responseText = response.data?.content?.[0]?.text;
        if (responseText) {
          const parsed = JSON.parse(responseText.trim());
          console.log("Backend AI: Claude job match completed successfully.");
          return res.json(parsed);
        }
      } catch (err) {
        console.error("Backend AI: Claude job match call failed, falling back to other providers:", err.message);
      }
    }

    if (geminiKey) {
      try {
        console.log("Backend AI: Calling Gemini API for job match analysis...");
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              responseMimeType: "application/json"
            }
          },
          { headers: { "Content-Type": "application/json" } }
        );

        const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
          const parsed = JSON.parse(responseText.trim());
          console.log("Backend AI: Gemini job match completed successfully.");
          return res.json(parsed);
        }
      } catch (err) {
        console.error("Backend AI: Gemini job match call failed, falling back to other providers:", err.message);
      }
    }

    if (openaiKey) {
      try {
        console.log("Backend AI: Calling OpenAI API for job match analysis...");
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
          },
          { headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" } }
        );

        const resText = response.data?.choices?.[0]?.message?.content;
        if (resText) {
          const parsed = JSON.parse(resText.trim());
          console.log("Backend AI: OpenAI job match completed successfully.");
          return res.json(parsed);
        }
      } catch (err) {
        console.error("Backend AI: OpenAI job match call failed, falling back to local simulation:", err.message);
      }
    }

    // Local Fallback response if no keys or APIs fail
    console.log("Backend AI: No API keys present or call failed. Returning signature-compatible simulated match payload...");
    return res.json({ fallback: true });
  } catch (error) {
    console.error("Backend AI: Crash in job-match route:", error);
    return res.status(500).json({ error: "Internal server error during job description matching." });
  }
});

// ==========================================
// 8. COVER LETTER AI GENERATOR ENDPOINT
// ==========================================
app.post("/api/ai/generate-cover-letter", async (req, res) => {
  try {
    const { resumeData, companyName, jobTitle, jobDescription, tone } = req.body;
    
    const claudeKey = process.env.CLAUDE_API_KEY || process.env.ANTHROPIC_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    const fullName = resumeData?.personal?.fullName || "Sri Aarush Aray";
    const email = resumeData?.personal?.email || "sriaarush@email.com";
    const phone = resumeData?.personal?.phone || "+91 98765 43210";
    const location = resumeData?.personal?.location || "Bangalore, India";
    const topSkills = resumeData?.skills || ["React", "JavaScript", "TypeScript", "Node.js"];
    const experiences = resumeData?.experiences || [];
    const projects = resumeData?.projects || [];

    const prompt = `Write a cover letter for a candidate named ${fullName} applying for the role of ${jobTitle} at ${companyName}.
Candidate contact details:
Email: ${email}
Phone: ${phone}
Location: ${location}

Candidate skills: ${topSkills.join(", ")}
Candidate experiences: ${JSON.stringify(experiences.map(e => ({ company: e.company, role: e.role, summary: e.summary || e.points?.[0] })))}
Candidate projects: ${JSON.stringify(projects.map(p => ({ title: p.title, technologies: p.technologies, points: p.points })))}

Job Description:
${jobDescription || "No specific job description provided."}

The tone of the cover letter must be: ${tone || "Professional"}.
Return ONLY the text of the cover letter. Do not include markdown code blocks or outer JSON wrapper. Start directly with the candidate name or current date.`;

    if (claudeKey) {
      try {
        console.log("Backend AI: Calling Claude API for cover letter generation...");
        const response = await axios.post(
          "https://api.anthropic.com/v1/messages",
          {
            model: "claude-3-5-sonnet-20241022",
            max_tokens: 3000,
            messages: [{ role: "user", content: prompt }]
          },
          {
            headers: {
              "x-api-key": claudeKey,
              "anthropic-version": "2023-06-01",
              "content-type": "application/json"
            }
          }
        );
        const responseText = response.data?.content?.[0]?.text;
        if (responseText) {
          console.log("Backend AI: Claude cover letter generated.");
          return res.json({ letter: responseText.trim() });
        }
      } catch (err) {
        console.error("Backend AI: Claude cover letter call failed:", err.message);
      }
    }

    if (geminiKey) {
      try {
        console.log("Backend AI: Calling Gemini API for cover letter generation...");
        const response = await axios.post(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`,
          {
            contents: [{ parts: [{ text: prompt }] }]
          },
          { headers: { "Content-Type": "application/json" } }
        );
        const responseText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (responseText) {
          console.log("Backend AI: Gemini cover letter generated.");
          return res.json({ letter: responseText.trim() });
        }
      } catch (err) {
        console.error("Backend AI: Gemini cover letter call failed:", err.message);
      }
    }

    if (openaiKey) {
      try {
        console.log("Backend AI: Calling OpenAI API for cover letter generation...");
        const response = await axios.post(
          "https://api.openai.com/v1/chat/completions",
          {
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }]
          },
          { headers: { Authorization: `Bearer ${openaiKey}`, "Content-Type": "application/json" } }
        );
        const responseText = response.data?.choices?.[0]?.message?.content;
        if (responseText) {
          console.log("Backend AI: OpenAI cover letter generated.");
          return res.json({ letter: responseText.trim() });
        }
      } catch (err) {
        console.error("Backend AI: OpenAI cover letter call failed:", err.message);
      }
    }

    // Local Fallback Builder
    console.log("Backend AI: Using local fallback cover letter generator...");
    const dateStr = new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

    let opening = "";
    let body1 = "";
    let body2 = "";
    let closing = "";

    // Draft sections based on tone
    if (tone === "Enthusiastic") {
      opening = `Dear Hiring Team at ${companyName},

I was absolutely thrilled to come across the ${jobTitle} opening at your company! I have been following ${companyName}'s work and its impact on the industry for some time, and the chance to contribute to your mission as a passionate ${jobTitle} is an opportunity I just couldn't pass up.`;
      
      body1 = `As a developer skilled in ${topSkills.slice(0, 4).join(", ")}, I bring a combination of technical adaptability and an eager mindset to your team.`;
      
      if (experiences.length > 0) {
        const exp = experiences[0];
        body1 += ` During my time as a ${exp.role} at ${exp.company}, I was energized by solving complex engineering bottlenecks, particularly where I ${exp.summary || "collaborated with cross-functional teams to build interfaces"}. I thrive in collaborative environments where fast learning and active contributions are valued.`;
      }

      if (projects.length > 0) {
        const proj = projects[0];
        body2 = `Furthermore, my project ${proj.title} (built using ${proj.technologies}) represents my drive to explore technologies outside my comfort zone. I am incredibly eager to bring this same energy, continuous learning mindset, and problem-solving focus to the daily tasks at ${companyName}.`;
      } else {
        body2 = `I am eager to translate my technical skills and enthusiasm for modern engineering architectures into immediate value for your development sprints, supporting your team's upcoming launches.`;
      }

      closing = `I would love the opportunity to chat about how my energy and background align with your team's goals. Thank you for your time and consideration!

Warmest regards,

${fullName}`;
    } else if (tone === "Creative") {
      opening = `Hello ${companyName} Team,

Every engineering team has a story of how they build things, and I've always admired how ${companyName} approaches design and scalability. When I saw the opening for a ${jobTitle}, I knew this was a place where my knack for crafting clean code and innovative user experiences would find a perfect home.`;

      body1 = `Technical toolkits like ${topSkills.slice(0, 4).join(", ")} are tools of the trade, but my real strength lies in figuring out the 'why' behind user issues and designing robust solutions.`;

      if (experiences.length > 0) {
        const exp = experiences[0];
        body1 += ` In my role as a ${exp.role} at ${exp.company}, I focused on redefining how we structured our development workflows, specifically helping to ${exp.summary || "modernize old UI structures and improve speeds"}. I enjoy finding creative solutions to structural constraints.`;
      }

      if (projects.length > 0) {
        const proj = projects[0];
        body2 = `A great example of my hands-on creativity is ${proj.title}, which I engineered using ${proj.technologies}. It allowed me to solve a unique challenge: ${proj.points?.[0] || "rendering dynamic frontend telemetry components smoothly"}. I'm ready to bring this inventive spirit to the product engineering challenges at ${companyName}.`;
      } else {
        body2 = `I'm eager to join a forward-thinking group of creators at ${companyName} where I can write high-quality features, iterate quickly, and turn technical problems into elegant user features.`;
      }

      closing = `Let's connect and share ideas on how we can collaborate. Thanks for checking out my application!

Best creative regards,

${fullName}`;
    } else if (tone === "Formal") {
      opening = `${fullName}
${email} | ${phone}
${location}

${dateStr}

The Hiring Committee
${companyName}

Subject: Application for the Position of ${jobTitle}

Dear Members of the Hiring Committee,

I am writing to express my formal interest in the ${jobTitle} position currently open at ${companyName}. With a strong foundation in software engineering principles and a specialized expertise in ${topSkills.slice(0, 4).join(", ")}, I am confident in my capacity to make a significant contribution to your technical division.`;

      if (experiences.length > 0) {
        const exp = experiences[0];
        body1 = `My professional credentials include serving as a ${exp.role} for ${exp.company}. In this capacity, I was entrusted with critical development and system optimization responsibilities, notably where I ${exp.summary || "spearheaded dashboard refactoring and sprint reviews"}. This experience has refined my ability to deliver quality code under rigorous deployment schedules.`;
      } else {
        body1 = `My training and project portfolio have equipped me with a rigorous understanding of structured development patterns, clean styling protocols, and efficient state managers, aligning with the expectations established for this role.`;
      }

      if (projects.length > 0) {
        const proj = projects[0];
        body2 = `In addition, I have developed ${proj.title}, an application utilizing ${proj.technologies}. This project highlights my capability to design robust databases and orchestrate structured API frameworks. I intend to bring this same systematic approach and dedication to performance optimization to ${companyName}.`;
      } else {
        body2 = `I am prepared to apply my technical background and disciplined work ethic to meet the strategic product benchmarks of ${companyName}.`;
      }

      closing = `Thank you for your time and review of my qualifications. I welcome the opportunity to discuss my professional suitability for this position in an interview.

Respectfully yours,

${fullName}`;
    } else {
      // Default: Professional
      opening = `${fullName}
${email} | ${phone}
${location}

${dateStr}

Hiring Manager
${companyName}

Dear Hiring Manager,

I am writing to express my strong interest in the ${jobTitle} position at ${companyName}. As a software engineer with practical experience developing applications using ${topSkills.slice(0, 4).join(", ")}, I am excited about the opportunity to contribute to your engineering team's success.`;

      if (experiences.length > 0) {
        const exp = experiences[0];
        body1 = `In my previous role as a ${exp.role} at ${exp.company}, I was responsible for building scalable interfaces and collaborating closely with product managers. A key highlight was my work to ${exp.summary || "optimize dashboard features and improve system response times"}, which helped improve overall team output and application usability.`;
      } else {
        body1 = `Throughout my development projects, I have focused on writing clean, maintainable code and solving complex performance issues, ensuring that user interfaces remain fast, responsive, and robust.`;
      }

      if (projects.length > 0) {
        const proj = projects[0];
        body2 = `Additionally, my project ${proj.title}, which I built using ${proj.technologies}, demonstrates my ability to handle end-to-end features. I successfully ${proj.points?.[0] || "implemented real-time data visualizers and modular layouts"}. I am eager to apply this technical experience and my problem-solving skills to the challenges at ${companyName}.`;
      } else {
        body2 = `I am confident that my technical skills, professional work ethic, and ability to collaborate effectively make me a strong candidate for the ${jobTitle} position.`;
      }

      closing = `Thank you for your time and consideration. I look forward to the possibility of discussing how my background meets your needs.

Sincerely,

${fullName}`;
    }

    const fullLetter = `${opening}\n\n${body1}\n\n${body2}\n\n${closing}`;
    return res.json({ letter: fullLetter });

  } catch (error) {
    console.error("Backend AI Error in generate-cover-letter:", error);
    return res.status(500).json({ error: "Internal server error during cover letter generation." });
  }
});

// Start listening for web requests
app.listen(PORT, () => {
  console.log(`Backend server successfully running on port ${PORT}`);
});


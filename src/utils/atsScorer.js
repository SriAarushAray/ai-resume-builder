// ATS Resume Scorer Utility mimicking Enhancv scoring criteria

const ACTION_VERBS = [
  "developed", "built", "optimized", "led", "designed", "implemented", "created",
  "engineered", "architected", "reduced", "increased", "improved", "managed",
  "coordinated", "executed", "delivered", "mentored", "streamlined", "structured",
  "integrated", "pioneered", "championed", "orchestrated", "facilitated", "authored"
];

const STOPWORDS = [
  "the", "and", "a", "an", "to", "in", "for", "of", "with", "at", "by", "on", "or", "as",
  "is", "are", "was", "were", "that", "this", "these", "it", "its", "from", "using", "into",
  "various", "our", "their", "about", "also", "who", "which", "which", "been"
];

const TECH_TYPOS = {
  "reactjs": "React",
  "nodejs": "Node.js",
  "javascript": "JavaScript",
  "typescript": "TypeScript",
  "postgresql": "PostgreSQL",
  "mongodb": "MongoDB",
  "html": "HTML",
  "css": "CSS",
  "github": "GitHub",
  "linkedin": "LinkedIn",
  "mysql": "MySQL",
  "aws": "AWS",
  "api": "API",
  "apis": "APIs"
};

function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// Gathers text segments with metadata to execute granular, context-aware checking
function extractTextBlocks(resumeData) {
  const personal = resumeData.personal || {};
  const experiences = resumeData.experiences || [];
  const projects = resumeData.projects || [];
  
  const blocks = [];
  if (personal.summary && personal.summary.trim()) {
    blocks.push({ type: "summary", text: personal.summary, label: "Professional Summary" });
  }
  
  experiences.forEach((exp, idx) => {
    const company = exp.company?.trim() || `Company #${idx + 1}`;
    if (exp.description && exp.description.trim()) {
      blocks.push({ type: "experience", text: exp.description, label: `${company} description` });
    }
    if (Array.isArray(exp.points)) {
      exp.points.forEach((pt) => {
        if (pt && pt.trim()) {
          blocks.push({ type: "experience", text: pt, label: company });
        }
      });
    }
  });

  projects.forEach((proj, idx) => {
    const title = proj.title?.trim() || `Project #${idx + 1}`;
    if (proj.description && proj.description.trim()) {
      blocks.push({ type: "project", text: proj.description, label: `${title} description` });
    }
    if (Array.isArray(proj.points)) {
      proj.points.forEach((pt) => {
        if (pt && pt.trim()) {
          blocks.push({ type: "project", text: pt, label: title });
        }
      });
    }
  });
  
  return blocks;
}

export function calculateAtsScore(resumeData) {
  if (!resumeData) return 0;

  const personal = resumeData.personal || {};
  const skills = resumeData.skills || [];
  const education = resumeData.education || {};
  const experiences = resumeData.experiences || [];

  let contentScore = 100;
  let sectionsScore = 0;
  let essentialsScore = 0;

  const textBlocks = extractTextBlocks(resumeData);

  // ─── 1. CONTENT SCORE (40% weight) ───
  
  // A. Quantifying Impact (50 pts of Content)
  let nonQuantifiedCount = 0;
  let experienceBulletCount = 0;
  
  textBlocks.forEach(block => {
    if (block.type === "experience" || block.type === "project") {
      experienceBulletCount++;
      const hasMetric = /%|\$\d|\d+\+?|\d+\s*(?:percent|users|visitors|hours|months|years|credits|points)/i.test(block.text);
      if (!hasMetric) {
        nonQuantifiedCount++;
      }
    }
  });
  
  let impactDeduction = 0;
  if (experienceBulletCount > 0) {
    impactDeduction = Math.min(50, (nonQuantifiedCount / experienceBulletCount) * 50);
  } else {
    impactDeduction = 25; // fallback penalty if no items exist
  }

  // B. Repetition (30 pts of Content)
  const wordCounts = {};
  textBlocks.forEach(block => {
    const words = block.text.toLowerCase().replace(/[^a-z\s-]/g, "").split(/\s+/);
    words.forEach(w => {
      if (w.length < 3 || STOPWORDS.includes(w)) return;
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    });
  });
  const repeatedWordsCount = Object.values(wordCounts).filter(c => c >= 4).length;
  const repetitionDeduction = Math.min(30, repeatedWordsCount * 10);

  // C. Spelling & Grammar (20 pts of Content)
  let spellingErrorsCount = 0;
  const checkedTech = new Set();
  textBlocks.forEach(block => {
    if (block.text.includes("  ")) spellingErrorsCount++;
    const doubleWordRegex = /\b(\w+)\s+\1\b/gi;
    if (doubleWordRegex.test(block.text)) spellingErrorsCount++;
    
    const words = block.text.split(/[\s,./()]+/).filter(Boolean);
    words.forEach(w => {
      const lower = w.toLowerCase();
      if (TECH_TYPOS[lower] && TECH_TYPOS[lower] !== w && !checkedTech.has(lower)) {
        spellingErrorsCount++;
        checkedTech.add(lower);
      }
    });
  });
  const spellingDeduction = Math.min(20, spellingErrorsCount * 10);

  contentScore = Math.max(0, 100 - impactDeduction - repetitionDeduction - spellingDeduction);

  // ─── 2. SECTIONS SCORE (30% weight) ───
  let sectionsCount = 0;
  const maxSections = 5;
  
  if (personal.fullName && personal.email && personal.phone && personal.location) sectionsCount++;
  if (personal.summary && personal.summary.trim().length > 15) sectionsCount++;
  if (skills.length >= 5) sectionsCount++;
  if (education.college && education.degree) sectionsCount++;
  if (experiences.length > 0) sectionsCount++;

  sectionsScore = (sectionsCount / maxSections) * 100;

  // ─── 3. ATS ESSENTIALS SCORE (30% weight) ───
  let essentialsCount = 0;
  const maxEssentials = 4;

  // Social Links
  if (personal.linkedin && (personal.github || personal.portfolio)) essentialsCount++;
  
  // Word Count Range (300 to 700 words is standard for 1 page)
  let wordCount = 0;
  textBlocks.forEach(b => {
    wordCount += b.text.trim().split(/\s+/).filter(Boolean).length;
  });
  if (wordCount >= 250 && wordCount <= 750) essentialsCount++;

  // Font size settings
  const fontSize = parseInt(resumeData.fontSettings?.size || "10", 10);
  if (fontSize >= 9 && fontSize <= 12) essentialsCount++;

  // Line spacing
  const lineSpacing = resumeData.layoutSettings?.lineSpacing ?? 4;
  if (lineSpacing >= 2 && lineSpacing <= 8) essentialsCount++;

  essentialsScore = (essentialsCount / maxEssentials) * 100;

  const totalScore = (contentScore * 0.4) + (sectionsScore * 0.3) + (essentialsScore * 0.3);

  return Math.min(100, Math.round(totalScore));
}

export function getAtsSuggestions(resumeData) {
  if (!resumeData) return [];

  const personal = resumeData.personal || {};
  const skills = resumeData.skills || [];
  const education = resumeData.education || {};
  const experiences = resumeData.experiences || [];
  const projects = resumeData.projects || [];

  const suggestions = [];
  const textBlocks = extractTextBlocks(resumeData);

  // ─── 1. CONTENT SUGGESTIONS ───

  // A. Quantifying Impact Check
  const nonQuantifiedBlocks = [];
  textBlocks.forEach(block => {
    if (block.type === "experience" || block.type === "project") {
      const hasMetric = /%|\$\d|\d+\+?|\d+\s*(?:percent|users|visitors|hours|months|years|credits|points)/i.test(block.text);
      if (!hasMetric) {
        nonQuantifiedBlocks.push(block);
      }
    }
  });

  if (nonQuantifiedBlocks.length > 0) {
    nonQuantifiedBlocks.slice(0, 2).forEach((block, idx) => {
      const truncated = block.text.length > 50 ? block.text.substring(0, 47) + "..." : block.text;
      suggestions.push({
        id: `quantify_impact_${idx}`,
        text: `Under "${block.label}", bullet point lacks metrics: "${truncated}". Add a number, percent (%), or dollar value to prove impact.`,
        impact: "High",
        type: "Content"
      });
    });
    if (nonQuantifiedBlocks.length > 2) {
      suggestions.push({
        id: `quantify_impact_more`,
        text: `And ${nonQuantifiedBlocks.length - 2} other bullet point(s) lack quantifiable achievements. Check your Experience section.`,
        impact: "Medium",
        type: "Content"
      });
    }
  }

  // B. Repetition Check
  const wordCounts = {};
  textBlocks.forEach(block => {
    const words = block.text.toLowerCase().replace(/[^a-z\s-]/g, "").split(/\s+/);
    words.forEach(w => {
      if (w.length < 3 || STOPWORDS.includes(w)) return;
      wordCounts[w] = (wordCounts[w] || 0) + 1;
    });
  });
  
  const repeatedWords = Object.entries(wordCounts)
    .filter(([_, count]) => count >= 4)
    .sort((a, b) => b[1] - a[1]);
    
  if (repeatedWords.length > 0) {
    repeatedWords.slice(0, 2).forEach(([word, count]) => {
      suggestions.push({
        id: `repetition_${word}`,
        text: `The word "${word}" is repeated ${count} times. Vary your vocabulary with synonyms (e.g. built, engineered, orchestrated).`,
        impact: "Low",
        type: "Content"
      });
    });
  }

  // C. Spelling, Capitalization & Typos Check
  const doubleWordTypos = [];
  const techCapitalTypos = [];
  let hasDoubleSpaces = false;

  textBlocks.forEach(block => {
    if (block.text.includes("  ")) {
      hasDoubleSpaces = true;
    }
    const doubleWordRegex = /\b(\w+)\s+\1\b/gi;
    let match;
    while ((match = doubleWordRegex.exec(block.text)) !== null) {
      doubleWordTypos.push(`"${match[0]}"`);
    }
    
    const words = block.text.split(/[\s,./()]+/).filter(Boolean);
    words.forEach(w => {
      const lower = w.toLowerCase();
      if (TECH_TYPOS[lower] && TECH_TYPOS[lower] !== w) {
        techCapitalTypos.push(`"${w}" (should be "${TECH_TYPOS[lower]}")`);
      }
    });
  });

  if (hasDoubleSpaces) {
    suggestions.push({
      id: "spelling_double_spaces",
      text: "Remove double spaces found in your descriptions to maintain clean spacing.",
      impact: "Low",
      type: "Content"
    });
  }
  if (doubleWordTypos.length > 0) {
    suggestions.push({
      id: "spelling_double_words",
      text: `Remove duplicated adjacent words: ${Array.from(new Set(doubleWordTypos)).slice(0, 2).join(", ")}.`,
      impact: "High",
      type: "Content"
    });
  }
  if (techCapitalTypos.length > 0) {
    const uniqueCapitalTypos = Array.from(new Set(techCapitalTypos));
    suggestions.push({
      id: "spelling_tech_capitalization",
      text: `Use standard capitalization: ${uniqueCapitalTypos.slice(0, 3).join(", ")}.`,
      impact: "Medium",
      type: "Content"
    });
  }

  // ─── 2. SECTIONS SUGGESTIONS (ESSENTIALS) ───
  if (!personal.fullName) {
    suggestions.push({
      id: "sec_name",
      text: "Essential Section missing: Your full name.",
      impact: "High",
      type: "Sections"
    });
  }
  if (!personal.email) {
    suggestions.push({
      id: "sec_email",
      text: "Essential Section missing: A professional email address.",
      impact: "High",
      type: "Sections"
    });
  } else {
    const unprofessionalKeywords = ["cool", "sexy", "gamer", "boy", "girl", "love", "king", "queen", "boss", "devil", "angel", "sweet", "hot", "cute", "magic", "rockstar", "ninja", "hacker"];
    const lowerEmail = personal.email.toLowerCase();
    const hasUnprofessionalWord = unprofessionalKeywords.some(keyword => lowerEmail.includes(keyword));
    if (hasUnprofessionalWord) {
      suggestions.push({
        id: "ess_email_professional",
        text: `Your email address "${personal.email}" contains informal/slang keywords. We recommend using a clean, name-based email address.`,
        impact: "Medium",
        type: "ATS Essentials"
      });
    }
  }
  if (!personal.phone || !personal.location) {
    suggestions.push({
      id: "sec_contact",
      text: "Essential Section incomplete: Add both phone number and location.",
      impact: "Medium",
      type: "Sections"
    });
  }
  if (!personal.summary || personal.summary.trim().length < 15) {
    suggestions.push({
      id: "sec_summary",
      text: "Essential Section missing: Professional summary profile.",
      impact: "High",
      type: "Sections"
    });
  }
  if (skills.length === 0) {
    suggestions.push({
      id: "sec_skills",
      text: "Essential Section missing: Technical skills keywords list.",
      impact: "High",
      type: "Sections"
    });
  } else if (skills.length < 5) {
    suggestions.push({
      id: "sec_skills_low",
      text: `Skills section is brief (${skills.length} added). Add at least 5 relevant keywords.`,
      impact: "Medium",
      type: "Sections"
    });
  }
  if (!education.college || !education.degree) {
    suggestions.push({
      id: "sec_education",
      text: "Essential Section missing: College/Institution degree.",
      impact: "High",
      type: "Sections"
    });
  }
  if (experiences.length === 0) {
    suggestions.push({
      id: "sec_experience",
      text: "Essential Section missing: Professional Work Experience history.",
      impact: "High",
      type: "Sections"
    });
  }

  // ─── 3. ATS ESSENTIALS SUGGESTIONS ───
  if (!personal.linkedin) {
    suggestions.push({
      id: "ess_linkedin",
      text: "Include your LinkedIn URL in the header for quick online profiles review.",
      impact: "Medium",
      type: "ATS Essentials"
    });
  }
  if (!personal.github && !personal.portfolio) {
    suggestions.push({
      id: "ess_portfolio",
      text: "Provide a GitHub or Portfolio URL to showcase project code and live samples.",
      impact: "Medium",
      type: "ATS Essentials"
    });
  }

  // Full URL checks for links in the header
  const checkFullLink = (url, name) => {
    if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
      suggestions.push({
        id: `ess_fulllink_${name.toLowerCase()}`,
        text: `Use a complete URL for your ${name} link (starting with https://). This ensures proper recognition by ATS systems.`,
        impact: "Medium",
        type: "ATS Essentials"
      });
    }
  };
  if (personal.linkedin) checkFullLink(personal.linkedin, "LinkedIn");
  if (personal.github) checkFullLink(personal.github, "GitHub");
  if (personal.portfolio) checkFullLink(personal.portfolio, "Portfolio");

  // Word Count Range
  let wordCount = 0;
  textBlocks.forEach(b => {
    wordCount += b.text.trim().split(/\s+/).filter(Boolean).length;
  });
  if (wordCount > 0 && wordCount < 250) {
    suggestions.push({
      id: "ess_wordcount_short",
      text: `Word count is low (${wordCount} words). Expand descriptions to feed ATS keywords (>250).`,
      impact: "High",
      type: "ATS Essentials"
    });
  } else if (wordCount > 750) {
    suggestions.push({
      id: "ess_wordcount_long",
      text: `Word count is high (${wordCount} words). Condense bullet points to fit A4 layout (<750).`,
      impact: "Medium",
      type: "ATS Essentials"
    });
  }

  // Font size
  const fontSize = parseInt(resumeData.fontSettings?.size || "10", 10);
  if (fontSize < 9 || fontSize > 12) {
    suggestions.push({
      id: "ess_fontsize",
      text: `Adjust font size settings (current: ${fontSize}pt). Standard range is 9pt to 12pt.`,
      impact: "Low",
      type: "ATS Essentials"
    });
  }

  // Spacing
  const lineSpacing = resumeData.layoutSettings?.lineSpacing ?? 4;
  if (lineSpacing < 2 || lineSpacing > 8) {
    suggestions.push({
      id: "ess_linespacing",
      text: `Line spacing is non-standard (${lineSpacing}px). Set between 2px and 8px.`,
      impact: "Low",
      type: "ATS Essentials"
    });
  }

  // Suggest action verb variety if they have too few
  let uniqueVerbsCount = 0;
  const uniqueVerbs = new Set();
  textBlocks.forEach(block => {
    const words = block.text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
    words.forEach(w => {
      if (ACTION_VERBS.includes(w)) uniqueVerbs.add(w);
    });
  });
  uniqueVerbsCount = uniqueVerbs.size;
  if (uniqueVerbsCount < 4 && experiences.length > 0) {
    suggestions.push({
      id: "ess_verbs_low",
      text: "Start more bullet points with action verbs (e.g. Developed, Led, Engineered).",
      impact: "Medium",
      type: "ATS Essentials"
    });
  }

  return suggestions;
}

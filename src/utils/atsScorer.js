// ATS Resume Scorer Utility

const ACTION_VERBS = [
  "developed", "built", "optimized", "led", "designed", "implemented", "created",
  "engineered", "architected", "reduced", "increased", "improved", "managed",
  "coordinated", "executed", "delivered", "mentored", "streamlined", "structured",
  "integrated", "pioneered", "championed", "orchestrated", "facilitated", "authored"
];

function countWords(str) {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function calculateAtsScore(resumeData) {
  if (!resumeData) return 0;

  const personal = resumeData.personal || {};
  const skills = resumeData.skills || [];
  const education = resumeData.education || {};
  const experiences = resumeData.experiences || [];
  const projects = resumeData.projects || [];

  let score = 0;

  // 1. Section Completeness (max 40 pts)
  // Personal Info (10 pts total)
  if (personal.fullName) score += 2.5;
  if (personal.email) score += 2.5;
  if (personal.phone) score += 2.5;
  if (personal.location) score += 2.5;

  // Professional Summary (5 pts)
  if (personal.summary && personal.summary.trim().length > 10) score += 5;

  // Skills (10 pts)
  if (skills.length > 0) score += 10;

  // Education (5 pts)
  if (education.college && education.degree) score += 5;

  // Experience (5 pts)
  if (experiences.length > 0) score += 5;

  // Projects (5 pts)
  if (projects.length > 0) score += 5;

  // 2. Content Quality & Metrics (max 40 pts)
  // Word Count (15 pts)
  let wordCount = 0;
  wordCount += countWords(personal.summary);
  experiences.forEach(e => {
    wordCount += countWords(e.description);
    if (Array.isArray(e.points)) {
      e.points.forEach(p => { wordCount += countWords(p); });
    }
  });
  projects.forEach(p => {
    wordCount += countWords(p.description);
    if (Array.isArray(p.points)) {
      p.points.forEach(pt => { wordCount += countWords(pt); });
    }
  });

  if (wordCount >= 400 && wordCount <= 650) {
    score += 15;
  } else if (wordCount >= 250 && wordCount < 400) {
    score += 10;
  } else if (wordCount > 650) {
    score += 8; // Too wordy
  } else if (wordCount > 0 && wordCount < 250) {
    score += 5; // Too brief
  }

  // Action Verbs (15 pts)
  let verbCount = 0;
  const uniqueVerbs = new Set();
  const checkVerbs = (text) => {
    if (!text) return;
    const words = text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
    words.forEach(w => {
      if (ACTION_VERBS.includes(w)) {
        uniqueVerbs.add(w);
      }
    });
  };

  experiences.forEach(e => {
    checkVerbs(e.description);
    if (Array.isArray(e.points)) {
      e.points.forEach(p => checkVerbs(p));
    }
  });
  projects.forEach(p => {
    checkVerbs(p.description);
    if (Array.isArray(p.points)) {
      p.points.forEach(pt => checkVerbs(pt));
    }
  });

  verbCount = uniqueVerbs.size;
  if (verbCount >= 5) {
    score += 15;
  } else if (verbCount >= 2) {
    score += 10;
  } else if (verbCount === 1) {
    score += 5;
  }

  // Quantitative Metrics (10 pts)
  let metricCount = 0;
  const checkMetrics = (text) => {
    if (!text) return false;
    // Match percentages, currency, or clear digits like 10+, 100
    return /%|\$\d|\d+\+?|\d+\s*(?:percent|users|visitors|hours|months|years|credits)/i.test(text);
  };

  let hasMetrics = 0;
  experiences.forEach(e => {
    if (Array.isArray(e.points)) {
      e.points.forEach(p => { if (checkMetrics(p)) hasMetrics++; });
    }
  });
  projects.forEach(p => {
    if (Array.isArray(p.points)) {
      p.points.forEach(pt => { if (checkMetrics(pt)) hasMetrics++; });
    }
  });

  if (hasMetrics >= 3) {
    score += 10;
  } else if (hasMetrics >= 1) {
    score += 5;
  }

  // 3. Format & Spacing (max 20 pts)
  // Font Size (5 pts)
  const fontSize = parseInt(resumeData.fontSettings?.size || "10", 10);
  if (fontSize >= 9 && fontSize <= 12) score += 5;

  // Spacing (5 pts)
  const lineSpacing = resumeData.layoutSettings?.lineSpacing ?? 4;
  if (lineSpacing >= 2 && lineSpacing <= 8) score += 5;

  // Social Links (10 pts)
  if (personal.linkedin) score += 5;
  if (personal.github || personal.portfolio) score += 5;

  return Math.min(100, Math.round(score));
}

export function getAtsSuggestions(resumeData) {
  if (!resumeData) return [];

  const personal = resumeData.personal || {};
  const skills = resumeData.skills || [];
  const education = resumeData.education || {};
  const experiences = resumeData.experiences || [];
  const projects = resumeData.projects || [];

  const suggestions = [];

  // Contact Info
  if (!personal.fullName) {
    suggestions.push({
      id: "name",
      text: "Add your full name in the Personal Information section.",
      impact: "High",
      type: "Missing Info"
    });
  }
  if (!personal.email) {
    suggestions.push({
      id: "email",
      text: "Provide a valid email address.",
      impact: "High",
      type: "Missing Info"
    });
  }
  if (!personal.phone) {
    suggestions.push({
      id: "phone",
      text: "Add a phone number to improve contactability.",
      impact: "Medium",
      type: "Missing Info"
    });
  }
  if (!personal.linkedin) {
    suggestions.push({
      id: "linkedin",
      text: "Include your LinkedIn URL for recruiters to review your profile.",
      impact: "Medium",
      type: "Social Links"
    });
  }
  if (!personal.github && !personal.portfolio) {
    suggestions.push({
      id: "portfolio",
      text: "Add a GitHub or Portfolio URL to showcase project code and live samples.",
      impact: "Medium",
      type: "Social Links"
    });
  }

  // Summary
  if (!personal.summary || personal.summary.trim().length < 10) {
    suggestions.push({
      id: "summary",
      text: "Draft a Professional Summary to introduce your background and goals.",
      impact: "High",
      type: "Content Quality"
    });
  } else {
    const summaryWords = countWords(personal.summary);
    if (summaryWords < 20) {
      suggestions.push({
        id: "summary_short",
        text: "Your professional summary is a bit short. Expand it to 2-3 sentences.",
        impact: "Low",
        type: "Content Quality"
      });
    } else if (summaryWords > 70) {
      suggestions.push({
        id: "summary_long",
        text: "Your professional summary is too long. Keep it under 60 words for quick scanning.",
        impact: "Low",
        type: "Content Quality"
      });
    }
  }

  // Skills
  if (skills.length === 0) {
    suggestions.push({
      id: "skills",
      text: "List at least 5 key technical skills to help parse ATS keywords.",
      impact: "High",
      type: "Missing Info"
    });
  } else if (skills.length < 5) {
    suggestions.push({
      id: "skills_low",
      text: "Add more skills (recommend at least 5-8 relevant technical keywords).",
      impact: "Medium",
      type: "Content Quality"
    });
  }

  // Education
  if (!education.college || !education.degree) {
    suggestions.push({
      id: "education",
      text: "Provide your education history (college/school and degree).",
      impact: "High",
      type: "Missing Info"
    });
  }

  // Experience
  if (experiences.length === 0) {
    suggestions.push({
      id: "experience",
      text: "Add at least one professional or student work experience.",
      impact: "High",
      type: "Missing Info"
    });
  } else {
    // Check points
    let totalPoints = 0;
    let hasEmptyPoints = false;
    experiences.forEach(e => {
      if (Array.isArray(e.points)) {
        totalPoints += e.points.filter(p => p.trim()).length;
      }
    });

    if (totalPoints === 0) {
      suggestions.push({
        id: "experience_points",
        text: "Add bullet points to describe achievements at your job roles.",
        impact: "High",
        type: "Missing Info"
      });
    }

    // Check action verbs
    let uniqueVerbsCount = 0;
    const uniqueVerbs = new Set();
    const checkVerbs = (text) => {
      if (!text) return;
      const words = text.toLowerCase().replace(/[^a-z\s]/g, "").split(/\s+/);
      words.forEach(w => {
        if (ACTION_VERBS.includes(w)) uniqueVerbs.add(w);
      });
    };
    experiences.forEach(e => {
      checkVerbs(e.description);
      if (Array.isArray(e.points)) e.points.forEach(p => checkVerbs(p));
    });
    projects.forEach(p => {
      checkVerbs(p.description);
      if (Array.isArray(p.points)) p.points.forEach(pt => checkVerbs(pt));
    });

    uniqueVerbsCount = uniqueVerbs.size;
    if (uniqueVerbsCount < 3 && totalPoints > 0) {
      suggestions.push({
        id: "action_verbs",
        text: "Use more strong action verbs (e.g. Developed, Optimized, Led) to start your points.",
        impact: "High",
        type: "Content Quality"
      });
    }

    // Check metrics
    const checkMetrics = (text) => {
      if (!text) return false;
      return /%|\$\d|\d+\+?|\d+\s*(?:percent|users|visitors|hours|months|years|credits)/i.test(text);
    };
    let hasMetricsCount = 0;
    experiences.forEach(e => {
      if (Array.isArray(e.points)) {
        e.points.forEach(p => { if (checkMetrics(p)) hasMetricsCount++; });
      }
    });
    projects.forEach(p => {
      if (Array.isArray(p.points)) {
        p.points.forEach(pt => { if (checkMetrics(pt)) hasMetricsCount++; });
      }
    });

    if (hasMetricsCount === 0 && totalPoints > 0) {
      suggestions.push({
        id: "metrics",
        text: "Incorporate metrics (e.g. percentage improvements, dollar values) to prove impact.",
        impact: "High",
        type: "Content Quality"
      });
    }
  }

  // Projects
  if (projects.length === 0) {
    suggestions.push({
      id: "projects",
      text: "Add 1-2 personal or academic projects to show hands-on experience.",
      impact: "Medium",
      type: "Missing Info"
    });
  }

  // Word Count
  let wordCount = 0;
  wordCount += countWords(personal.summary);
  experiences.forEach(e => {
    wordCount += countWords(e.description);
    if (Array.isArray(e.points)) {
      e.points.forEach(p => { wordCount += countWords(p); });
    }
  });
  projects.forEach(p => {
    wordCount += countWords(p.description);
    if (Array.isArray(p.points)) {
      p.points.forEach(pt => { wordCount += countWords(pt); });
    }
  });

  if (wordCount > 0 && wordCount < 200) {
    suggestions.push({
      id: "word_count_short",
      text: "Expand your resume's descriptions; it is currently too short for an ATS scan (aim for >300 words).",
      impact: "High",
      type: "Length"
    });
  } else if (wordCount > 750) {
    suggestions.push({
      id: "word_count_long",
      text: "Condense your resume; word count is over 750 words, which may spill over A4 margins.",
      impact: "Medium",
      type: "Length"
    });
  }

  return suggestions;
}

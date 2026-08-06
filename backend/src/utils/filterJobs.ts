import type { JobLevel } from "../types/models.js";

const INTERNSHIP_KEYWORDS = ["intern", "internship", "co-op", "coop"];

const JUNIOR_KEYWORDS = ["junior", "jr.", "jr "];

const ENTRY_LEVEL_KEYWORDS = [
  "entry level",
  "entry-level",
  "new grad",
  "new-grad",
  "new graduate",
  "graduate engineer",
  "early career",
  "associate software",
  "software engineer i",
  "software engineer 1",
  "developer i",
  "developer 1",
];

const SENIOR_KEYWORDS = [
  "senior",
  "sr.",
  "sr ",
  "staff",
  "principal",
  "lead",
  "manager",
  "director",
  "architect",
  "head of",
  "vp ",
  "vice president",
  "software engineer ii",
  "software engineer iii",
  "developer ii",
  "developer iii",
];

export const detectJobLevel = (title: string): JobLevel | null => {
  const normalizedTitle = title.toLowerCase().replace(/\s+/g, " ").trim();

  const isSenior = SENIOR_KEYWORDS.some((keyword) =>
    normalizedTitle.includes(keyword),
  );

  if (isSenior) {
    return null;
  }

  const isInternship = INTERNSHIP_KEYWORDS.some((keyword) =>
    normalizedTitle.includes(keyword),
  );

  if (isInternship) {
    return "internship";
  }

  const isJunior = JUNIOR_KEYWORDS.some((keyword) =>
    normalizedTitle.includes(keyword),
  );

  if (isJunior) {
    return "junior";
  }

  const isEntryLevel = ENTRY_LEVEL_KEYWORDS.some((keyword) =>
    normalizedTitle.includes(keyword),
  );

  if (isEntryLevel) {
    return "entry_level";
  }

  return null;
};

/* Check if role in IT */
export const isSoftwareRole = (title: string): boolean => {
  const normalizedTitle = title.toLowerCase();

  const keywords = [
    "software",
    "developer",
    "frontend",
    "front-end",
    "backend",
    "back-end",
    "full stack",
    "full-stack",
    "web developer",
    "mobile",
    "ios",
    "android",
    "devops",
    "site reliability",
    "sre",
    "data engineer",
    "machine learning engineer",
  ];

  return keywords.some((keyword) => normalizedTitle.includes(keyword));
};

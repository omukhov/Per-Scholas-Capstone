const JUNIOR_PATTERNS = [
  /\bjunior\b/i,
  /\bjr\.?\b/i,
  /entry[- ]level/i,
  /\bassociate\b/i,
  /\bgraduate\b/i,
  /new grad/i,
  /\btrainee\b/i,
  /\bintern\b/i,
];

const EXCLUDE_PATTERNS = [
  /\bsenior\b/i,
  /\bsr\.?\b/i,
  /\blead\b/i,
  /\bstaff\b/i,
  /\bprincipal\b/i,
  /\bmanager\b/i,
  /\barchitect\b/i,
  /\bdirector\b/i,
  /\bhead\b/i,
  /\bvp\b/i,
];

export const isStrictEntryLevelJob = (title: string): boolean => {
  if (EXCLUDE_PATTERNS.some((pattern) => pattern.test(title))) {
    return false;
  }

  return JUNIOR_PATTERNS.some((pattern) => pattern.test(title));
};

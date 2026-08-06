/* Convert company names to one format */
export const cleanCompanyName = (name?: string): string => {
  if (!name) return "unknown";

  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(
      /\b(incorporated|inc|llc|corp|corporation|ltd|company|co|group)\b/gi,
      "",
    )
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

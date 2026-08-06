/* Delete spaces and /n */
export const cleanText = (value: string): string => {
  return value.replace(/\s+/g, " ").trim();
};

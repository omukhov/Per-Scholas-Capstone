/* Convert to date */
export const parseDate = (value?: string | number): Date | undefined => {
  if (value === undefined || value === null) {
    return undefined;
  }

  const parsedDate = new Date(value);

  return Number.isNaN(parsedDate.getTime()) ? undefined : parsedDate;
};

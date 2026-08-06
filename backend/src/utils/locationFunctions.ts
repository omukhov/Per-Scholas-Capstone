/* Check if vacancy remote */
export const detectRemote = (title: string, location: string): boolean => {
  return /remote/i.test(`${title} ${location}`);
};

export const isUsLocation = (location: string): boolean => {
  const normalizedLocation = location.toLowerCase();

  const usKeywords = [
    "united states",
    "usa",
    "u.s.",
    "us remote",
    "remote - us",
    "remote, us",
    "remote (us)",
    "new york",
    "san francisco",
    "los angeles",
    "seattle",
    "austin",
    "boston",
    "chicago",
    "denver",
    "atlanta",
    "washington, dc",
    "washington dc",
  ];

  const stateAbbreviationPattern =
    /,\s?(al|ak|az|ar|ca|co|ct|de|fl|ga|hi|id|il|in|ia|ks|ky|la|me|md|ma|mi|mn|ms|mo|mt|ne|nv|nh|nj|nm|ny|nc|nd|oh|ok|or|pa|ri|sc|sd|tn|tx|ut|vt|va|wa|wv|wi|wy)\b/i;

  return (
    usKeywords.some((keyword) => normalizedLocation.includes(keyword)) ||
    stateAbbreviationPattern.test(location)
  );
};

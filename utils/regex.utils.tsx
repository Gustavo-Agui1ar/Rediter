export const escapeRegex = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const getHighlightedParts = (text: string, searchTerm: string) => {
  if (!searchTerm.trim()) return [text];

  const escapedTerm = escapeRegex(searchTerm);
  const regex = new RegExp(`(${escapedTerm})`, "gi");

  return text.split(regex);
};

export const isMatch = (part: string, searchTerm: string): boolean => {
  if (!searchTerm.trim()) return false;
  const escapedTerm = escapeRegex(searchTerm);
  const regex = new RegExp(`^${escapedTerm}$`, "i");
  return regex.test(part);
};

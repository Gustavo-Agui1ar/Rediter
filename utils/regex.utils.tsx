export const escapeRegex = (str?: string): string => {
  return (str || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

export const getHighlightedParts = (text?: string, searchTerm?: string) => {
  const safeText = text || "";
  const safeSearch = searchTerm || "";

  if (!safeSearch.trim()) return [safeText];

  const escapedTerm = escapeRegex(safeSearch);
  const regex = new RegExp(`(${escapedTerm})`, "gi");

  return safeText.split(regex);
};

export const isMatch = (part?: string, searchTerm?: string): boolean => {
  const safePart = part || "";
  const safeSearch = searchTerm || "";

  if (!safeSearch.trim()) return false;

  const escapedTerm = escapeRegex(safeSearch);
  const regex = new RegExp(`^${escapedTerm}$`, "i");

  return regex.test(safePart);
};

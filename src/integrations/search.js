import variants from './action-variants.json' with { type: 'json' };
// Only character variants live here. All searchable wording comes from the game.
const fold = new Map(Object.entries(variants));
export const normalizeSearch = (text) =>
  [...String(text).normalize('NFKC').toLocaleLowerCase()]
    .map((c) => fold.get(c) ?? c)
    .join('')
    .replace(/[\s_:：·'"()（）-]|\[|\]/g, '');
export const hasSearchText = (text) => normalizeSearch(text).length > 0;
// Same matching algorithm as AEE's components/asset-search/searchText.ts.
export function fuzzyMatch(haystack, needle) {
  const text = normalizeSearch(haystack),
    query = normalizeSearch(needle);
  return matchNormalized(text, query);
}
function matchNormalized(text, query) {
  if (!query || text.includes(query)) return true;
  let cursor = 0;
  for (const char of text) if (char === query[cursor]) cursor++;
  return cursor === query.length;
}
export function createActivitySearch(rows) {
  const indexed = rows.map((row) => ({
    row,
    texts: [...new Set([row.label, row.name, ...(row.searchLabels ?? [])].map(normalizeSearch))],
  }));
  return searchIndex(rows, indexed);
}
export async function createActivitySearchAsync(rows, cancelled = () => false) {
  const indexed = [];
  let deadline = performance.now() + 4;
  for (const row of rows) {
    if (cancelled()) return null;
    indexed.push({
      row,
      texts: [...new Set([row.label, row.name, ...(row.searchLabels ?? [])].map(normalizeSearch))],
    });
    if (performance.now() >= deadline) {
      await new Promise((resolve) => setTimeout(resolve, 0));
      deadline = performance.now() + 4;
    }
  }
  return searchIndex(rows, indexed);
}
function searchIndex(rows, indexed) {
  return (query) => {
    const normalized = normalizeSearch(query);
    return normalized
      ? indexed
          .filter((entry) => entry.texts.some((text) => matchNormalized(text, normalized)))
          .map((entry) => entry.row)
      : rows;
  };
}
export function searchActivities(rows, query) {
  if (!hasSearchText(query)) return rows;
  return rows.filter((row) =>
    [row.label, row.name, ...(row.searchLabels ?? [])].some((text) => fuzzyMatch(text, query)),
  );
}

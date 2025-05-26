
/**
 * Generate a unique key for a position entry.
 */
function generateUniqueKey(entry) {
  return `${entry.businessName}-${entry.location}-${entry.positionName}-${entry.seniority}-${entry.positionUrl}`;
}

/**
 * Validate required fields in an entry.
 */
function validateEntry(entry) {
  return (
    entry.businessName &&
    entry.positionName &&
    entry.positionUrl &&
    entry.location &&
    entry.seniority
  );
}

/**
 * Deduplicate entries using uniqueKey.
 */
function deduplicateEntries(data) {
  const seen = new Set();
  return data.filter(entry => {
    const key = entry.uniqueKey || generateUniqueKey(entry);
    if (seen.has(key)) return false;
    seen.add(key);
    entry.uniqueKey = key;
    return true;
  });
}

/**
 * Sort entries by field in ascending or descending order.
 */
function sortEntries(data, field, direction = 'asc') {
  return [...data].sort((a, b) => {
    const aVal = a[field] || '';
    const bVal = b[field] || '';
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
}

/**
 * Filter entries by key-value pairs.
 * Example: filterEntries(data, { location: 'Japan', seniority: 'VP' });
 */
function filterEntries(data, filters = {}) {
  return data.filter(entry => {
    return Object.entries(filters).every(([key, value]) =>
      (entry[key] || '').toLowerCase().includes(value.toLowerCase())
    );
  });
}

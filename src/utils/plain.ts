/**
 * Deep-clone a value to strip Vue reactivity proxies.
 * IndexedDB's structured clone algorithm cannot serialize Vue reactive proxies,
 * so all data must be converted to plain objects/arrays before storage.
 */
export function toPlain<T>(value: T): T {
  return JSON.parse(JSON.stringify(value))
}

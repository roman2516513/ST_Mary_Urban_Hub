export function loadFromStorage(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error('saveToStorage error for', key, err);
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error('removeFromStorage error for', key, err);
  }
}

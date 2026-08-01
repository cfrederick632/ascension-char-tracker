// Hash a username to a consistent HSL color
export const getUsernameColor = (username) => {
  if (!username || username === 'Guest') return '#888888';

  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 75%, 70%)`;
};

// Capitalize first letter and lowercase the rest
export const formatName = (str) => {
  if (!str) return '';
  const trimmed = str.trim();
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
};
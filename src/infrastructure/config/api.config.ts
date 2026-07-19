const getSanitizedBaseUrl = (): string => {
  let url = import.meta.env.VITE_API_BASE_URL || 'https://futbol-stats-api.uaeftt-ute.site/api';
  url = url.replace(/^(https?:\/\/)+/i, 'https://');
  if (url.includes('futbol-pulse.uaeftt-ute.site')) {
    url = url.replace('futbol-pulse.uaeftt-ute.site', 'futbol-stats-api.uaeftt-ute.site');
  }
  if (url.includes('futbol-stats-api.uaeftt-ute.site')) {
    url = url.replace('http://', 'https://');
  }
  if (!url.endsWith('/api') && !url.endsWith('/api/')) {
    url = url.replace(/\/+$/, '') + '/api';
  }
  return url.replace(/\/+$/, '');
};

export const API_CONFIG = {
  BASE_URL: getSanitizedBaseUrl(),
  TIMEOUT: 10_000,
} as const;

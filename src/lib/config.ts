// Configuration for different environments
export const getBaseUrl = (): string => {
  // In production, use the actual deployed URL
  if (import.meta.env.PROD) {
    // Check if we're on GitHub Pages or custom domain
    if (window.location.hostname.includes('github.io')) {
      return 'https://artem-barmin.github.io/crepusculo-nexus';
    } else {
      // For custom domains, use the current origin
      return window.location.origin;
    }
  }

  // In development, use localhost
  return window.location.origin;
};

export const getRedirectUrl = (path: string = '/'): string => {
  return `${getBaseUrl()}${path}`;
};

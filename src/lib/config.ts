// Configuration for different environments
export const getBaseUrl = (): string => {
  return window.location.origin;
};

export const getRedirectUrl = (path: string = '/'): string => {
  return `${getBaseUrl()}${path}`;
};

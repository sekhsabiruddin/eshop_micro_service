// apps/user-ui/src/utils/redirect.ts

let redirectToLogin = () => {
  window.location.href = "/login";
};

export const setRedirectHandler = (handler: () => void): void => {
  redirectToLogin = handler;
};

export const runRedirectToLogin = (): void => {
  redirectToLogin();
};

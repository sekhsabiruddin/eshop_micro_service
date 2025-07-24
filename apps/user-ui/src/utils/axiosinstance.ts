// import axios from "axios";

// const axiosInstance = axios.create({
//   baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
//   withCredentials: true,
// });

// let isRefreshing = false;
// let refreshSubscribers: (() => void)[] = [];

// // Handle logout and prevent infinite loops
// const handleLogout = () => {
//   if (window.location.pathname !== "/login") {
//     window.location.href = "/login";
//   }
// };

// // Handle adding a new access token to queued requests
// const subscribeTokenRefresh = (callback: () => void) => {
//   refreshSubscribers.push(callback);
// };

// // Execute queued requests after refresh
// const onRefreshSuccess = () => {
//   refreshSubscribers.forEach((callback) => callback());
//   refreshSubscribers = [];
// };

// // Handle API requests
// axiosInstance.interceptors.request.use(
//   (config) => config,
//   (error) => Promise.reject(error)
// );

// // Handle expired tokens and refresh logic
// axiosInstance.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // prevent infinite retry loop
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         return new Promise((resolve) => {
//           subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)));
//         });
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         await axios.post(
//           `${process.env.NEXT_PUBLIC_SERVER_URI}/api/refresh-token`,
//           {},
//           { withCredentials: true }
//         );

//         isRefreshing = false;
//         onRefreshSuccess();

//         return axiosInstance(originalRequest);
//       } catch (refreshError) {
//         isRefreshing = false;
//         refreshSubscribers = [];
//         handleLogout();
//         return Promise.reject(refreshError);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosInstance;

import axios from "axios";
import { runRedirectToLogin } from "./redirect";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URI,
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];

// enqueue a request to be replayed after refresh
const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

// fire all queued requests
const onRefreshSuccess = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

// if refresh fails, log the user out
const handleLogout = () => {
  const publicPaths = ["/login", "/signup", "/forgot-password"];
  if (!publicPaths.includes(window.location.pathname)) {
    runRedirectToLogin();
  }
};

axiosInstance.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    // only handle 401s, and skip our refresh‐endpoint itself
    const is401 = error.response?.status === 401;
    const isRetry = originalRequest._retry;
    const isRefreshCall = originalRequest.url?.endsWith("/api/refresh-token");

    if (is401 && !isRetry && !isRefreshCall) {
      if (isRefreshing) {
        // queue up and replay once the in-flight refresh resolves
        return new Promise((resolve) =>
          subscribeTokenRefresh(() => resolve(axiosInstance(originalRequest)))
        );
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // attempt to get a new access token
        await axios.post(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/refresh-token`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        onRefreshSuccess();

        // re‑try the original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = []; // clear the queue
        handleLogout();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

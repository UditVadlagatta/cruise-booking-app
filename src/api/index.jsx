import axios from "axios";
import { environment } from "./env";
import { getAuthStatus } from "../util/tokenUtils";

let isRedirecting = false;
let isRefreshing = false;

const handleLogout = () => {
  if (isRedirecting) return;

  isRedirecting = true;
  const role = localStorage.getItem("role");


  localStorage.clear();
  // window.location.href = "/login";
  window.location.href = role === "admin" || role === "worker"
    ? "/celogin"
    : "/login";

  setTimeout(() => {
    isRedirecting = false;
  }, 1000);
};

const api = axios.create({
  baseURL: environment.baseurl,
});

api.interceptors.request.use(
  async (config) => {

    // 1️⃣ Allow login & refresh without token check
    if (
      config.url?.includes("/login") ||
      config.url?.includes("/refresh")
    ) {
      return config;
    }

    const status = getAuthStatus();

    // 2️⃣ Guest user (no tokens)
    if (status === "guest") {
      return config;
    }

    // 3️⃣ Tokens completely expired
    if (status === "expired") {
      handleLogout();
      return Promise.reject(new Error("Session expired"));
    }

    // 4️⃣ Access token expired but refresh token valid
    if (status === "needs_refresh" && !isRefreshing) {
      isRefreshing = true;

      try {
        const rfToken = localStorage.getItem("refreshToken");
        const role = localStorage.getItem("role"); // 'customer', 'worker', or 'admin'
        // console.log('rfToken: ',rfToken)

        // const response = await axios.post(
        //   `${environment.baseurl}/customers/refresh`,
        //   {},
        //   {
        //     headers: {
        //       Authorization: `Bearer ${rfToken}`,
        //     },
        //   }
        // );

        // Pick the right refresh endpoint based on role
    const refreshEndpoint =
      role === "admin"
        ? `${environment.baseurl}/admins/refresh`
        : role === "worker"
        ? `${environment.baseurl}/workers/refresh`
        : `${environment.baseurl}/customers/refresh`;
        const response = await axios.post(
      refreshEndpoint,
      {},
      {
        headers: {
          Authorization: `Bearer ${rfToken}`,
        },
      }
    );


        const { accessToken } = response.data;

        // Save new access token
        localStorage.setItem("token", accessToken);

        // Attach new token to request
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;

        isRefreshing = false;

        return config;
      } catch (error) {
        isRefreshing = false;
        handleLogout();
        return Promise.reject(error);
      }
    }

    // 5️⃣ Access token valid
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
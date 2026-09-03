const TOKEN_KEY = "learnup_token";
const originalFetch = window.fetch.bind(window);

export function installSecureFetch() {
  window.fetch = async (input, init = {}) => {
    const url = typeof input === "string" ? input : input.url;
    const token = localStorage.getItem(TOKEN_KEY);
    const headers = new Headers(init.headers || (typeof input !== "string" ? input.headers : undefined));
    if (token && (url.startsWith("/api") || url.includes("/api/"))) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    const response = await originalFetch(input, { ...init, headers });
    if (response.status === 401 && !url.includes("/api/auth/")) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("learnup_auth");
      if (!window.location.pathname.includes("login")) window.location.assign("/login");
    }
    return response;
  };
}

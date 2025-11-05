// базовый URL auth-сервера
export const AUTH_API = process.env.REACT_APP_AUTH_URL || "http://localhost:5001";

// универсальный хелпер для запросов
export async function authApi(path, { method = "GET", body, withAuth = false, headers } = {}) {
  const h = new Headers(headers || {});
  if (!(body instanceof FormData)) h.set("Content-Type", "application/json");

  if (withAuth) {
    const token = localStorage.getItem("access");
    if (token) h.set("Authorization", `Bearer ${token}`);
  }

  const res = await fetch(`${AUTH_API}${path}`, {
    method,
    headers: h,
    body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  return res;
}

// хранение токенов
export function setTokens({ access_token, refresh_token }) {
  localStorage.setItem("access", access_token);
  localStorage.setItem("refresh", refresh_token);
}
export function logout() {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
}
export function isLoggedIn() {
  return !!localStorage.getItem("access");
}

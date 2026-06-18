
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://0.0.0.0:8000/api/v1";

function getToken(): string | null {
  // ✅ Guard against SSR
  if (globalThis.window === undefined) return null;
  return globalThis.window.sessionStorage.getItem("auth_token") || globalThis.window.localStorage.getItem("auth_token");
}

export async function apiCall(path: string, options: RequestInit = {}) {
  const token = getToken();
  console.log("token ============" , token)
  const headers = new Headers(options.headers);
  const API_URL = "http://0.0.0.0:8000/api/v1";
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  
  return fetch(`${API_URL}${path}`, { ...options, headers });
}


export async function getUserFromToken(token: string): Record<string, any> | null {
  try {
    const payload = token.split(".")[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

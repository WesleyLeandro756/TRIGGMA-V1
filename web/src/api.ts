const TOKEN_KEYS = {
  company: "triggma_company_token",
  customer: "triggma_customer_token",
} as const;

export type Audience = keyof typeof TOKEN_KEYS;

export function getToken(aud: Audience): string | null {
  return localStorage.getItem(TOKEN_KEYS[aud]);
}
export function setToken(aud: Audience, token: string) {
  localStorage.setItem(TOKEN_KEYS[aud], token);
}
export function clearToken(aud: Audience) {
  localStorage.removeItem(TOKEN_KEYS[aud]);
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  aud?: Audience,
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (aud) {
    const token = getToken(aud);
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new Error((data && data.error) || `http_${res.status}`);
  }
  return data as T;
}

export const api = {
  get: <T>(path: string, aud?: Audience) => request<T>("GET", path, undefined, aud),
  post: <T>(path: string, body?: unknown, aud?: Audience) =>
    request<T>("POST", path, body, aud),
  patch: <T>(path: string, body?: unknown, aud?: Audience) =>
    request<T>("PATCH", path, body, aud),
};

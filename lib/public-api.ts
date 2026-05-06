function normalizePath(path: string) {
  if (!path) return '/';
  return path.startsWith('/') ? path : `/${path}`;
}

export function resolvePublicApiPath(path: string) {
  return normalizePath(path);
}

export async function fetchPublicApi<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers || undefined);
  const hasBody = init.body !== undefined && init.body !== null;

  if (hasBody && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(resolvePublicApiPath(path), {
    ...init,
    headers,
    credentials: 'same-origin',
  });

  const text = await response.text();
  let data: unknown = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'message' in data && typeof (data as { message?: unknown }).message === 'string'
        ? (data as { message: string }).message
        : `Erreur ${response.status}`;
    throw new Error(message);
  }

  return data as T;
}

export function postPublicApi<T>(path: string, body: unknown, init: Omit<RequestInit, 'body' | 'method'> = {}) {
  return fetchPublicApi<T>(path, {
    ...init,
    method: 'POST',
    body: JSON.stringify(body),
  });
}

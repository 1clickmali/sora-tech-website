const BASE = process.env.NEXT_PUBLIC_API_URL || 'https://sora-tech-website-production.up.railway.app';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include', // Automatically send/receive cookies
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur API');
  return data;
}

async function upload(path: string, formData: FormData): Promise<{ success: boolean; url: string }> {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    body: formData,
    credentials: 'include', // Include cookies
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Erreur upload');
  return data;
}

export const api = {
  get:    <T>(path: string) => request<T>(path),
  post:   <T>(path: string, body: unknown) => request<T>(path, { method: 'POST',   body: JSON.stringify(body) }),
  patch:  <T>(path: string, body: unknown) => request<T>(path, { method: 'PATCH',  body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
  upload,
};

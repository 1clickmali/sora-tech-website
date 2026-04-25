const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export function resolveMediaUrl(src?: string | null) {
  if (!src) return "";

  if (
    src.startsWith("data:") ||
    src.startsWith("blob:") ||
    src.startsWith("http://") ||
    src.startsWith("https://")
  ) {
    return src;
  }

  if (src.startsWith("//")) {
    return `https:${src}`;
  }

  if (src.startsWith("/")) {
    return `${API_BASE}${src}`;
  }

  return `${API_BASE}/${src}`;
}

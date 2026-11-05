import type { Studio } from "@/lib/studiostype";

export async function fetchStudios(): Promise<{
  studios: Studio[];
  failed: boolean;
}> {
  const studiosApi = process.env.NEXT_PUBLIC_STUDIO_API_URL;
  if (!studiosApi) {
    console.error("Studios api is not configured");
    return { studios: [], failed: true };
  }
  try {
    const res = await fetch(studiosApi, { cache: "no-store" });
    if (!res.ok) {
      console.error(`studios api failed: ${res.status}`);
      return { studios: [], failed: true };
    }
    const data = await res.json();
    return { studios: Array.isArray(data) ? (data as Studio[]) : [], failed: false };
  } catch (error) {
    console.error("Studios api error:", error);
    return { studios: [], failed: true };
  }
}

export async function fetchStudiosList(): Promise<Studio[]> {
  const { studios } = await fetchStudios();
  return studios;
}

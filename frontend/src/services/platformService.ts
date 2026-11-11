const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface PlatformAffiliation {
  platformName: string;
  platformWorkerId: string;
  workType: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  onboardedAt: string;
}

export interface ReviewSummary {
  id: string;
  platformName: string;
  rating: number;
  category: string;
  comment: string;
  flag: "NORMAL" | "WARNING" | "CRITICAL_INCIDENT";
  createdAt: string;
}

export interface PlatformOnboardRequest {
  platformName: string;
  platformWorkerId: string;
  name: string;
  phone: string;
  aadhaarLast4: string;
  workType: string;
  pan?: string;
}

export interface PlatformOnboardResponse {
  newWorker: boolean;
  did: string;
  name: string;
  phone: string;
  currentPlatform: string;
  workType: string;
  averageRating: number;
  totalReviews: number;
  trustScore: number;
  safetyRiskStatus: "CLEAR" | "WATCHLIST" | "FLAGGED";
  affiliations: PlatformAffiliation[];
  recentReviews: ReviewSummary[];
  message: string;
}

export interface AddReviewRequest {
  platformName: string;
  did?: string;
  phone?: string;
  rating: number;
  category: string;
  comment?: string;
  flag?: "NORMAL" | "WARNING" | "CRITICAL_INCIDENT";
}

export interface WorkerPassport {
  id: string;
  did: string;
  name: string;
  phone: string;
  aadhaarLast4: string;
  averageRating: number;
  totalReviews: number;
  trustScore: number;
  safetyRiskStatus: "CLEAR" | "WATCHLIST" | "FLAGGED";
  memberSince: string;
  affiliations: PlatformAffiliation[];
  reviews: ReviewSummary[];
}

export const DEFAULT_PLATFORM_API_KEYS: Record<string, string> = {
  Uber: "vaas_live_uber_883910",
  Ola: "vaas_live_ola_441029",
  "Urban Company": "vaas_live_uc_772190",
  Zomato: "vaas_live_zomato_552104",
  Swiggy: "vaas_live_swiggy_661082",
};

export async function onboardWorker(
  data: PlatformOnboardRequest,
  apiKey?: string
): Promise<PlatformOnboardResponse> {
  const key = apiKey || DEFAULT_PLATFORM_API_KEYS[data.platformName] || "vaas_live_uber_883910";

  const res = await fetch(`${BASE_URL}/api/platform/onboard`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": key,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "Failed to onboard worker");
  }

  return res.json();
}

export async function submitReview(
  data: AddReviewRequest,
  apiKey?: string
): Promise<ReviewSummary> {
  const key = apiKey || DEFAULT_PLATFORM_API_KEYS[data.platformName] || "vaas_live_uber_883910";

  const res = await fetch(`${BASE_URL}/api/platform/review`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-Key": key,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "Failed to submit review");
  }

  return res.json();
}

export async function getWorkerPassportByDid(
  did: string,
  apiKey?: string
): Promise<WorkerPassport> {
  const key = apiKey || "vaas_live_uber_883910";

  const res = await fetch(
    `${BASE_URL}/api/platform/worker/${encodeURIComponent(did)}`,
    {
      headers: { "X-API-Key": key },
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "Worker not found");
  }

  return res.json();
}

export async function getWorkerPassportByPhone(
  phone: string,
  apiKey?: string
): Promise<WorkerPassport> {
  const key = apiKey || "vaas_live_uber_883910";

  const res = await fetch(
    `${BASE_URL}/api/platform/worker/phone/${encodeURIComponent(phone)}`,
    {
      headers: { "X-API-Key": key },
    }
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "Worker not found with this phone number");
  }

  return res.json();
}


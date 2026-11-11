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

export async function onboardWorker(
  data: PlatformOnboardRequest
): Promise<PlatformOnboardResponse> {
  const res = await fetch(`${BASE_URL}/api/platform/onboard`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "Failed to onboard worker");
  }

  return res.json();
}

export async function submitReview(
  data: AddReviewRequest
): Promise<ReviewSummary> {
  const res = await fetch(`${BASE_URL}/api/platform/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "Failed to submit review");
  }

  return res.json();
}

export async function getWorkerPassportByDid(
  did: string
): Promise<WorkerPassport> {
  const res = await fetch(
    `${BASE_URL}/api/platform/worker/${encodeURIComponent(did)}`
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "Worker not found");
  }

  return res.json();
}

export async function getWorkerPassportByPhone(
  phone: string
): Promise<WorkerPassport> {
  const res = await fetch(
    `${BASE_URL}/api/platform/worker/phone/${encodeURIComponent(phone)}`
  );

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "Worker not found with this phone number");
  }

  return res.json();
}


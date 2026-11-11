const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

export interface RegisterUserData {
  name: string;
  phone: string;
  aadhaarLast4: string;
  workType: string;
  platformId: string;
  pan?: string;
}

export interface UserResponse {
  id: string;
  name: string;
  phone: string;
  aadhaarLast4: string;
  workType: string;
  platformId: string;
  did: string;
  qrCodePath?: string | null;
}

export async function registerUser(data: RegisterUserData): Promise<UserResponse> {
  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    const message = errorBody?.message || errorBody?.error || "Failed to register user";
    throw new Error(message);
  }

  return res.json();
}

export async function getUserByPhone(phone: string): Promise<UserResponse> {
  const res = await fetch(`${BASE_URL}/api/user/${encodeURIComponent(phone)}`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "User not found");
  }
  return res.json();
}

export async function verifyUserByDid(did: string): Promise<UserResponse> {
  const res = await fetch(`${BASE_URL}/api/verify/${encodeURIComponent(did)}`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.message || "Invalid or unverified DID");
  }
  return res.json();
}

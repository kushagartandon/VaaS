const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function registerUser(data: any) {
  const res = await fetch(`${BASE_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Failed to register user");
  }

  return res.json();
}

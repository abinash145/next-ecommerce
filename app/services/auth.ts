// services/auth.ts

export const registerUser = async ({
  name,
  email,
  password,
}: {
  name?: string;
  email: string;
  password: string;
}) => {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  const data = await res.json();
  console.log("data......", data);
  if (!res.ok) {
    throw new Error(data.error || "Registration failed");
  }

  return data.user;
};

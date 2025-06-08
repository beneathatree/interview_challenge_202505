import { redirect } from "@remix-run/node";
import { data as json } from "@remix-run/node";
import { getUserId } from "~/utils/session.server";
import { getUserById } from "~/services/auth.server";

export interface AuthContext {
  userId: number;
  user: Awaited<ReturnType<typeof getUserById>>;
}

/**
 * Middleware to protect API routes
 * Returns JSON response for unauthorized access
 */
export async function requireAuthApi(request: Request) {
  const userId = await getUserId(request);
  if (!userId) {
    throw json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getUserById(userId);
  if (!user) {
    throw json({ error: "User not found" }, { status: 401 });
  }

  return { userId, user };
}

/**
 * Middleware to protect page routes
 * Redirects to login page for unauthorized access
 */
export async function requireAuthPage(
  request: Request,
  redirectTo: string = new URL(request.url).pathname
) {
  const userId = await getUserId(request);
  if (!userId) {
    const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
    throw redirect(`/login?${searchParams}`);
  }

  const user = await getUserById(userId);
  if (!user) {
    throw redirect("/login");
  }

  return { userId, user };
}

/**
 * Optional authentication
 * Returns user context if logged in, null if not
 */
export async function getAuthContext(
  request: Request
): Promise<AuthContext | null> {
  const userId = await getUserId(request);
  if (!userId) {
    return null;
  }

  const user = await getUserById(userId);
  if (!user) {
    return null;
  }

  return { userId, user };
}

// Export types
export type { User } from "~/db/schema";

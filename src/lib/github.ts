import "server-only";
import { GITHUB_USER } from "./site";

export type GitHubActivity = { repo: string; url: string; at: string };

type PublicEvent = { type: string; created_at: string; repo: { name: string } };

/**
 * Latest public push, resolved at build time (the site is static; CI rebuilds daily).
 * Only public events are returned by this endpoint, so private repositories never leak.
 * Any failure (offline build, rate limit) degrades to `null` and the indicator is hidden.
 */
export async function getLatestActivity(): Promise<GitHubActivity | null> {
  const headers: HeadersInit = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "portfolio-build",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/events/public?per_page=30`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const events = (await res.json()) as PublicEvent[];
    const push = events.find((e) => e.type === "PushEvent");
    if (!push) return null;
    const repo = push.repo.name.split("/")[1] ?? push.repo.name;
    return { repo, url: `https://github.com/${push.repo.name}`, at: push.created_at };
  } catch {
    return null;
  }
}

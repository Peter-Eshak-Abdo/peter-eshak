import "server-only";
import { GITHUB_USER } from "./site";

export type GitHubActivity = { repo: string; url: string; at: string };

type PublicRepo = { name: string; html_url: string; pushed_at: string; fork: boolean; private: boolean };

/**
 * Most recently pushed public repository, resolved at build time (the site is static; CI rebuilds daily).
 * Only public, non-fork repositories are considered, so private work never leaks.
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
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?type=owner&sort=pushed&per_page=10`, {
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const repos = (await res.json()) as PublicRepo[];
    const latest = repos.find((r) => !r.fork && !r.private && r.name !== GITHUB_USER);
    if (!latest) return null;
    return { repo: latest.name, url: latest.html_url, at: latest.pushed_at };
  } catch {
    return null;
  }
}

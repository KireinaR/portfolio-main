// Public GitHub profile lookup for the contact page - avatar/name/bio only,
// no contributions/activity data. Cached via Next's fetch revalidation so a
// site with any real traffic stays well under GitHub's 60 req/hour
// unauthenticated rate limit.
export async function getGithubProfile(username) {
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: { Accept: 'application/vnd.github+json' },
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return {
      login: data.login,
      name: data.name || data.login,
      bio: data.bio,
      avatarUrl: data.avatar_url,
      htmlUrl: data.html_url,
    };
  } catch {
    return null;
  }
}

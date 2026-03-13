const HTTP_URL = process.env.NEXT_PUBLIC_HTTP_URL;

let refreshPromise: any = null;

export async function apiFetch(url: string, options = {}) {
  let res = await fetch(url, {
    ...options,
    credentials: "include",
  });

  if (res.status === 401 && !url.includes("refresh_token")) {
    if (!refreshPromise) {
      refreshPromise = fetch(`${HTTP_URL}/api/auth/refresh_token`, {
        method: "POST",
        credentials: "include",
      }).finally(() => {
        refreshPromise = null;
      });
    }

    const refreshRes = await refreshPromise;

    if (!refreshRes.ok) {
      // refresh failed → logout
      await fetch(`${HTTP_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      window.location.href = "/login";
      return res;
    }

    // retry original request
    res = await fetch(url, {
      ...options,
      credentials: "include",
    });
  }

  return res;
}

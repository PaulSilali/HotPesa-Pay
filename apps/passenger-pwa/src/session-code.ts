export function sessionCodeFromLocation(location: Pick<Location, 'pathname' | 'search'>): string | null {
  const pathMatch = location.pathname.match(/\/journey\/([^/]+)/);
  if (pathMatch?.[1]) return decodeURIComponent(pathMatch[1]);
  return new URLSearchParams(location.search).get('session');
}

export function cleanName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export function compareNames(a?: string, b?: string): boolean {
  if (!a || !b) return false;
  return cleanName(a) === cleanName(b);
}

export function matchesCoach(coach?: string, userName?: string): boolean {
  if (!coach || !userName) return false;
  const c = cleanName(coach);
  const u = cleanName(userName);
  return c.includes(u) || u.includes(c);
}

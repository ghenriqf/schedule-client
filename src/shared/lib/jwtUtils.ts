export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp é em segundos, Date.now() em milissegundos
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // token malformado = considera expirado
  }
}

export function getTokenPayload(
  token: string,
): { id: number; sub: string; exp: number } | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function getCurrentUserId(): number | null {
  const token = localStorage.getItem("@App:token");
  if (!token) return null;
  const payload = getTokenPayload(token);
  return payload?.id ?? null;
}

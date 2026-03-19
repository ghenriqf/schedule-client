export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    // exp é em segundos, Date.now() em milissegundos
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // token malformado = considera expirado
  }
}

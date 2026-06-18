// lib/jwt.ts

// export interface JwtPayload {
//   sub?: string;
//   user_id?: number;
//   email?: string;
//   name?: string;
//   role?: string;
//   is_admin?: boolean;
//   exp?: number;      // Expiration timestamp (seconds since epoch)
//   iat?: number;      // Issued-at timestamp
//   [key: string]: any;  // Allow other custom claims
// }

/**
 * Decode a JWT payload without verifying the signature.
 * Use this only to READ data from a token, never to TRUST it.
 */
// export function decodeJwt(token: string): JwtPayload | null {
export function decodeJwt(token: string){
  if (!token) return null;
  
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT — expected 3 parts");
      return null;
    }
    
    const payload = parts[1];
    
    // Convert base64url → base64
    const base64 = payload
      .replace(/-/g, "+")
      .replace(/_/g, "/");
    
    // Pad to multiple of 4
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    
    // Decode and parse
    const jsonPayload = decodeURIComponent(
      atob(padded)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error("Failed to decode JWT:", err);
    return null;
  }
}

/**
 * Check if a token is expired.
 */
export function isJwtExpired(token: string): boolean {
  const payload = decodeJwt(token);
  if (!payload?.exp) return true;
  
  const expiresAt = payload.exp * 1000;  // Convert to milliseconds
  return Date.now() >= expiresAt;
}

/**
 * Get remaining time on a token in seconds.
 */
export function getJwtRemainingTime(token: string): number {
  const payload = decodeJwt(token);
  if (!payload?.exp) return 0;
  
  const remaining = payload.exp * 1000 - Date.now();
  return Math.max(0, Math.floor(remaining / 1000));
}

/**
 * Get the expiration date of a token.
 */
export function getJwtExpiration(token: string): Date | null {
  const payload = decodeJwt(token);
  if (!payload?.exp) return null;
  return new Date(payload.exp * 1000);
}
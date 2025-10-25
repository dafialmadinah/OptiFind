import { verify } from "jsonwebtoken";
import { NextRequest } from "next/server";

export interface JWTPayload {
  id: number;
  email: string;
  role: string;
  name: string | null;
  iat: number;
  exp: number;
}

export function getAuthToken(request: NextRequest): string | null {
  // Cek dari Authorization header (Bearer token)
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.substring(7);
  }

  // Fallback: cek dari cookie (untuk backward compatibility)
  const cookieToken = request.cookies.get("auth-token")?.value;
  if (cookieToken) {
    return cookieToken;
  }

  return null;
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const secret = process.env.NEXTAUTH_SECRET || process.env.JWT_SECRET || "your-secret-key";
    const decoded = verify(token, secret) as JWTPayload;
    return decoded;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
}

export function getAuthUser(request: NextRequest): JWTPayload | null {
  const token = getAuthToken(request);
  if (!token) {
    return null;
  }
  return verifyToken(token);
}

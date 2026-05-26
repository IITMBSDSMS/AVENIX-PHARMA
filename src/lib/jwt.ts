import { createHmac } from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "avenix_secure_jwt_token_secret_key_2026_clinical_networks";

export function signToken(payload: any): string {
  const header = { alg: "HS256", typ: "JWT" };
  const headerB64 = Buffer.from(JSON.stringify(header)).toString("base64url");
  const payloadB64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  
  const hmac = createHmac("sha256", JWT_SECRET);
  hmac.update(`${headerB64}.${payloadB64}`);
  const signature = hmac.digest("base64url");
  
  return `${headerB64}.${payloadB64}.${signature}`;
}

export function verifyToken(token: string): any | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    
    const [headerB64, payloadB64, signature] = parts;
    const hmac = createHmac("sha256", JWT_SECRET);
    hmac.update(`${headerB64}.${payloadB64}`);
    const expectedSignature = hmac.digest("base64url");
    
    if (signature !== expectedSignature) {
      return null;
    }
    
    const payloadJson = Buffer.from(payloadB64, "base64url").toString("utf8");
    return JSON.parse(payloadJson);
  } catch (error) {
    return null;
  }
}

import { jwtVerify, importSPKI, importPKCS8 } from "jose";
import type { JWTPayload } from "jose";
import { Role } from "../generated/prisma/client.js";
import { readFileSync } from "fs";

const INVITE_ISSUER = "lincomms";
const INVITE_AUDIENCE = "signup";

const publicKeyPem = readFileSync(process.env.INVITE_PUBLIC_KEY!, "utf8");
const privateKeyPem = readFileSync(process.env.INVITE_PRIVATE_KEY!, "utf8");


export const publicKey = await importSPKI(publicKeyPem, "RS256");
export const privateKey = await importPKCS8(privateKeyPem, "RS256");
if (!privateKey) {
  throw new Error("Missing INVITE_PRIVATE_KEY. This operation is restricted");
}
/**
 *  Verifies a signed invite token using the configured public key.
 *
 * @param token - The Signed invite token (string, provided by the client).
 * @returns The decoded payload if the token is valid.
 * @throws An error if the token has expired, is invalid or if the token is tampered with.
 */

export async function verifyInviteToken(
  token: string,
): Promise<JWTPayload & { role: Role; email?: string }> {
  try {
    const { payload } = await jwtVerify(token, publicKey, {
      issuer: INVITE_ISSUER,
      audience: INVITE_AUDIENCE,
    });

    // Minimum required claims
    if (!payload.role) throw new Error("Invalid token: missing role claim");
    if (!payload.jti) throw new Error("Invalid token: missing jti claim");

    return payload as JWTPayload & { role: Role; email?: string };
  } catch (err) {
    console.error("Invite verification failed:", err);
    throw new Error("Invalid or expired invite token");
  }
}

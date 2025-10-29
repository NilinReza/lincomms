import { createInvite } from "../src/db/invite.ts";
import { Role } from "../src/generated/prisma/client.js";
import { v4 as uuidv4 } from "uuid";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import { SignJWT, jwtVerify, importPKCS8, importSPKI } from "jose";
import fs from "fs";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const privateKeyPath = path.resolve(
  __dirname,
  "../../backend/keys/dev_private.pem",
);
const publicKeyPath = path.resolve(
  __dirname,
  "../../backend/keys/dev_public.pem",
);

const privateKeyPEM = fs.readFileSync(privateKeyPath, "utf8");
const publicKeyPEM = fs.readFileSync(publicKeyPath, "utf8");

const INVITE_ISSUER = "lincomms";
const INVITE_AUDIENCE = "signup";

interface CreateInviteParams {
  email: string;
  role: Role;
}

export async function createInviteHandler(params: CreateInviteParams) {
  const jti = uuidv4();

  const invite = await createInvite(jti, params.role, params.email);

  const privateKey = await importPKCS8(privateKeyPEM, "RS256");
  const publicKey = await importSPKI(publicKeyPEM, "RS256");
  const jwt = await new SignJWT({
    jti,
    role: params.role,
    email: params.email,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  })
    .setProtectedHeader({ alg: "RS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .setAudience(INVITE_AUDIENCE)
    .setIssuer(INVITE_ISSUER)
    .sign(privateKey);

  const { payload } = await jwtVerify(jwt, publicKey, {
    issuer: INVITE_ISSUER,
    audience: INVITE_AUDIENCE,
  });

  console.log("\n✅ Invite created successfully!");
  console.log("------------------------------------------------------");
  console.log(`Email: ${params.email}`);
  console.log(`Role: ${params.role}`);
  console.log(`JTI: ${jti}`);
  console.log("------------------------------------------------------");
  console.log("🔐 Invite Token (copy this for /signup):");
  console.log(jwt);
  console.log("------------------------------------------------------");
  console.log("📦 Decoded Payload:");
  console.log(payload);
  console.log("------------------------------------------------------\n");

  return { ...invite, token: jwt };
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const roleArg = args.find((a) => a.startsWith("--role="));
  const emailArg = args.find((a) => a.startsWith("--email="));

  const roleStr = roleArg ? roleArg.split("=")[1] : "MEMBER";
  const role = Object.values(Role).includes(roleStr as Role)
    ? (roleStr as Role)
    : Role.MEMBER;
  const email = emailArg ? emailArg.split("=")[1] : undefined;

  if (!email) {
    console.error("Email is required.");
    process.exit(1);
  }

  createInviteHandler({ role, email })
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error creating the invite", err);
      process.exit(1);
    });
}

import { verifyInviteToken } from "../src/lib/inviteSigner.ts";

const token = process.argv[2];

if (!token) {
  console.error("Usage: node --loader ts-node/esm scripts/verifyInviteTest.ts <token>");
  process.exit(1);
}

verifyInviteToken(token)
  .then((payload) => {
    console.log("✅ Token is valid!");
    console.log("Decoded payload:", payload);
  })
  .catch((err) => {
    console.error("❌ Token verification failed:", err.message);
  });

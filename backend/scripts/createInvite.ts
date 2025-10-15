import { createInvite } from "../src/db/invite.ts";
import { Role } from "../src/generated/prisma/client.js";
import { prisma } from "../src/lib/prisma.ts";
import { v4 as uuidv4 } from "uuid";

interface CreateInviteParams {
  email: string;
  role: Role;
}

export async function createInviteHandler(params: CreateInviteParams) {
  const jti = uuidv4();

  const invite = await createInvite(jti, params.role, params.email);

  return invite;
}

if (import.meta.main) {
  const args = process.argv.slice(2);
  const roleArg = args.find((a) => a.startsWith("--role="));
  const emailArg = args.find((a) => a.startsWith("--email="));

  const roleStr = roleArg ? roleArg.split("=")[1] : "MEMBER";
  const role = Object.values(Role).includes(roleStr as Role) ? (roleStr as Role) : Role.MEMBER;
  const email = emailArg ? emailArg.split("=")[1] : undefined;

  if (!email) {
    console.error("Email is required.");
    process.exit(1);
  }

  createInviteHandler({ role, email })
    .then((invite) => {
      console.log("Invite created:", invite);
      process.exit(0);
    })
    .catch((err) => {
      console.error("Error creating the invite", err);
      process.exit(1);
    });
}

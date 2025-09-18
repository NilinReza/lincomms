import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
const prisma = new PrismaClient();
async function main() {
  const adminEmail = "admin@lincomms.test";
  const adminPassword = "AdminPass123!"; // dev-only — replace in production
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });
  if (!existingAdmin) {
    const hashed = await bcrypt.hash(adminPassword, 10);
    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        name: "Dev Admin",
        role: "ADMIN",
        hashedPassword: hashed,
      },
    });
    console.log("Seed: created admin", adminEmail);
  } else {
    console.log("Seed: admin already exists");
  }
  // create a dev invite for testing
  const token = crypto.randomBytes(16).toString("hex");
  const existingInvite = await prisma.invite.findFirst({ where: { token } });
  if (!existingInvite) {
    await prisma.invite.create({
      data: {
        token,
        email: null, // allows any email
        role: "MEMBER",
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
        createdBy: { connect: { email: adminEmail } },
      },
    });
    console.log("Seed: created invite token:", token);
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
//# sourceMappingURL=seed.js.map

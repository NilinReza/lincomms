import { Role } from "@prisma/client";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function findInviteByJti(jti: string) {
  return prisma.invite.findUnique({
    where: { jti },
  });
}

export async function markInviteAsUsed(jti: string, userId: number) {
  return prisma.invite.update({
    where: { jti },
    data: { used: true, acceptedById: userId, acceptedAt: new Date() },
  });
}

export async function createInvite(
  jti: string,
  role: Role,
  email: string,
  expiresAt?: Date,
) {
  const defaultExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const expires =
    expiresAt instanceof Date && !Number.isNaN(expiresAt.getTime())
      ? expiresAt
      : defaultExpiresAt;

  if (!(expires instanceof Date) || Number.isNaN(expires.getTime())) {
    throw new Error("Invalid expiresAt value provided");
  }
  const invite = await prisma.invite.create({
    data: {
      jti,
      role,
      email,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return invite;
}

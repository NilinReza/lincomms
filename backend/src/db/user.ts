import { Role } from "../generated/prisma/client.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
export async function createUser(
  email: string,
  name: string,
  role: Role,
  hashedPassword: string,
) {
  return prisma.user.create({
    data: { email, name, role, hashedPassword },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
  });
}

export async function getUserById(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

export async function updateUserPassword(
  userId: number,
  hashedPassword: string,
) {
  return prisma.user.update({
    where: { id: userId },
    data: { hashedPassword },
  });
}

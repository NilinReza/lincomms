import { Router } from "express";
import { verifyInviteToken } from "../lib/inviteSigner.js";
import { PrismaClient, Prisma } from "@prisma/client";
import { hashPassword } from "../auth/password.js";
import { SignJWT } from "jose";
import path from "path";
import fs from "fs";

const router = Router();
const prisma = new PrismaClient();

const keyPath = process.env.JWT_SECRET;

if (!keyPath) throw new Error("JWT_SECRET is not set");

const absolutePath = path.resolve(keyPath);
const jwt_secret = fs.readFileSync(absolutePath, "utf8");

router.post("/signup", async (req, res) => {
  const { inviteToken, email, password } = req.body;

  if (!inviteToken || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const payload = await verifyInviteToken(inviteToken);

    if (!payload) return res.status(401).json({ error: "Invalid token" });

    const hashedPassword = await hashPassword(password);

    const user = await prisma.$transaction(
      async (tx: Prisma.TransactionClient) => {
        assertHasJti(payload);

        const invite = await tx.invite.findUnique({
          where: { jti: payload.jti },
        });

        if (!invite) throw new Error("Invite invalid");

        if (invite.used) throw new Error("Invite already used");

        if (invite.expiresAt && invite.expiresAt.getTime() < Date.now()) {
          throw new Error("Invite has expired");
        }

        const newUser = await tx.user.create({
          data: {
            email,
            name: payload.email ?? email,
            role: payload.role,
            hashedPassword,
            acceptedInviteId: invite.id,
          },
        });

        await tx.invite.update({
          where: { jti: payload.jti },
          data: {
            used: true,
            acceptedById: newUser.id,
            acceptedAt: new Date(),
          },
        });

        return newUser;
      },
    );

    const jwt = await new SignJWT({
      sub: user.id.toString(),
      email: user.email,
      role: user.role,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d")
      .sign(new TextEncoder().encode(jwt_secret));

    return res.status(201).json({ message: "User created", token: jwt, user });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: err.message || "Server error" });
  }
});

export function assertHasJti(payload: {
  jti?: string;
}): asserts payload is { jti: string } {
  if (!payload.jti) throw new Error("Missing JTI in token");
}
export default router;

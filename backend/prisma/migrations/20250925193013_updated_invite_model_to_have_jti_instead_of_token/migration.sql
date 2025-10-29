/*
  Warnings:

  - You are about to drop the column `token` on the `Invite` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[jti]` on the table `Invite` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `jti` to the `Invite` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."Invite_token_key";

-- AlterTable
ALTER TABLE "public"."Invite" DROP COLUMN "token",
ADD COLUMN     "jti" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Invite_jti_key" ON "public"."Invite"("jti");
ALTER TABLE "Invite" ALTER COLUMN "jti" SET NOT NULL;

/*
  Warnings:

  - Added the required column `password_hash` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'CAMPAIGN_MANAGER', 'MEMBER');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "password_hash" TEXT NOT NULL,
ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'CAMPAIGN_MANAGER';

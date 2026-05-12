/*
  Warnings:

  - The primary key for the `contact_list_members` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `contactListId` on the `contact_list_members` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `contacts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[email]` on the table `contacts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `listId` to the `contact_list_members` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contact_list_members" DROP CONSTRAINT "contact_list_members_contactListId_fkey";

-- DropIndex
DROP INDEX "contact_list_members_contactListId_idx";

-- DropIndex
DROP INDEX "contacts_userId_email_key";

-- AlterTable
ALTER TABLE "contact_list_members" DROP CONSTRAINT "contact_list_members_pkey",
DROP COLUMN "contactListId",
ADD COLUMN     "listId" UUID NOT NULL,
ADD CONSTRAINT "contact_list_members_pkey" PRIMARY KEY ("contactId", "listId");

-- AlterTable
ALTER TABLE "contacts" DROP COLUMN "metadata",
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "source" TEXT,
ADD COLUMN     "status" TEXT;

-- CreateIndex
CREATE INDEX "contact_list_members_listId_idx" ON "contact_list_members"("listId");

-- CreateIndex
CREATE UNIQUE INDEX "contacts_email_key" ON "contacts"("email");

-- AddForeignKey
ALTER TABLE "contact_list_members" ADD CONSTRAINT "contact_list_members_listId_fkey" FOREIGN KEY ("listId") REFERENCES "contact_lists"("id") ON DELETE CASCADE ON UPDATE CASCADE;

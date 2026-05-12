/*
  Warnings:

  - You are about to drop the column `htmlBody` on the `templates` table. All the data in the column will be lost.
  - You are about to drop the column `textBody` on the `templates` table. All the data in the column will be lost.
  - Added the required column `content` to the `templates` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "templates_userId_name_key";

-- AlterTable
ALTER TABLE "templates" DROP COLUMN "htmlBody",
DROP COLUMN "textBody",
ADD COLUMN     "content" TEXT NOT NULL;

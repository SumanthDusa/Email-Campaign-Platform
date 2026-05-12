-- AlterTable
ALTER TABLE "contacts" ADD COLUMN     "unsubscribed" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "email_opens" (
    "id" UUID NOT NULL,
    "contactId" UUID NOT NULL,
    "campaignId" UUID NOT NULL,
    "openedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_opens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "email_opens_contactId_idx" ON "email_opens"("contactId");

-- CreateIndex
CREATE INDEX "email_opens_campaignId_idx" ON "email_opens"("campaignId");

-- AddForeignKey
ALTER TABLE "email_opens" ADD CONSTRAINT "email_opens_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "contacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email_opens" ADD CONSTRAINT "email_opens_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "campaigns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "Feedback" DROP CONSTRAINT "Feedback_immobileId_fkey";

-- AddForeignKey
ALTER TABLE "Immobile" ADD CONSTRAINT "Immobile_proprietaryId_fkey" FOREIGN KEY ("proprietaryId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_immobileId_fkey" FOREIGN KEY ("immobileId") REFERENCES "Immobile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

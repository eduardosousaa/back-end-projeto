-- DropForeignKey
ALTER TABLE "Image" DROP CONSTRAINT "Image_immobileId_fkey";

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_immobileId_fkey" FOREIGN KEY ("immobileId") REFERENCES "Immobile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

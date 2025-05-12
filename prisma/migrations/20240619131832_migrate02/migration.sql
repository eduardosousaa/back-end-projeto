/*
  Warnings:

  - You are about to drop the column `imageUrls` on the `Immobile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Immobile" DROP COLUMN "imageUrls";

-- CreateTable
CREATE TABLE "Image" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "immobileId" INTEGER NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Image" ADD CONSTRAINT "Image_immobileId_fkey" FOREIGN KEY ("immobileId") REFERENCES "Immobile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

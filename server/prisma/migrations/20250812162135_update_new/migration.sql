/*
  Warnings:

  - You are about to drop the column `backgroundUrl` on the `qrscannerconfig` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `qrscannerconfig` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `qrscannerconfig` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `qrscannerconfig` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `QrScannerConfig_slug_key` ON `qrscannerconfig`;

-- AlterTable
ALTER TABLE `qrscannerconfig` DROP COLUMN `backgroundUrl`,
    DROP COLUMN `createdAt`,
    DROP COLUMN `slug`,
    DROP COLUMN `updatedAt`;

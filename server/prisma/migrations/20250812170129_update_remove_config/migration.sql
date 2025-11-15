/*
  Warnings:

  - You are about to drop the `qrscannerconfig` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `qrscannerconfig` DROP FOREIGN KEY `qr_scanner_config_ibfk_tenant`;

-- AlterTable
ALTER TABLE `tenants` ADD COLUMN `brandName` VARCHAR(191) NOT NULL DEFAULT '',
    ADD COLUMN `description` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `logoUrl` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `redirectUrl` VARCHAR(191) NULL DEFAULT '',
    ADD COLUMN `themeColor` VARCHAR(191) NULL DEFAULT '';

-- DropTable
DROP TABLE `qrscannerconfig`;

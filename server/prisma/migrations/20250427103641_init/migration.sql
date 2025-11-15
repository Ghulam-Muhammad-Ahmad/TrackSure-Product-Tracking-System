/*
  Warnings:

  - You are about to drop the column `permissions` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the `qrcodes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `fk_qr_code`;

-- DropForeignKey
ALTER TABLE `qrcodes` DROP FOREIGN KEY `qrcodes_ibfk_1`;

-- DropForeignKey
ALTER TABLE `qrcodes` DROP FOREIGN KEY `qrcodes_ibfk_2`;

-- AlterTable
ALTER TABLE `roles` DROP COLUMN `permissions`;

-- DropTable
DROP TABLE `qrcodes`;

-- CreateTable
CREATE TABLE `UserRights` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `right` ENUM('PRODUCT_CREATE', 'PRODUCT_READ', 'PRODUCT_UPDATE', 'PRODUCT_DELETE', 'CATEGORY_CREATE', 'CATEGORY_READ', 'CATEGORY_UPDATE', 'CATEGORY_DELETE', 'ROLE_CREATE', 'ROLE_READ', 'ROLE_UPDATE', 'ROLE_DELETE', 'USER_CREATE', 'USER_READ', 'USER_UPDATE', 'USER_DELETE') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleRights` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `roleId` INTEGER NOT NULL,
    `right` ENUM('PRODUCT_CREATE', 'PRODUCT_READ', 'PRODUCT_UPDATE', 'PRODUCT_DELETE', 'CATEGORY_CREATE', 'CATEGORY_READ', 'CATEGORY_UPDATE', 'CATEGORY_DELETE', 'ROLE_CREATE', 'ROLE_READ', 'ROLE_UPDATE', 'ROLE_DELETE', 'USER_CREATE', 'USER_READ', 'USER_UPDATE', 'USER_DELETE') NOT NULL,

    INDEX `RoleRights_roleId_idx`(`roleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `RoleRights` ADD CONSTRAINT `RoleRights_roleId_fkey` FOREIGN KEY (`roleId`) REFERENCES `roles`(`role_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

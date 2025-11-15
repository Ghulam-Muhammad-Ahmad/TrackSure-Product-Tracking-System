/*
  Warnings:

  - You are about to drop the `rolerights` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `userrights` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `rolerights` DROP FOREIGN KEY `RoleRights_roleId_fkey`;

-- AlterTable
ALTER TABLE `roles` ADD COLUMN `permissions` JSON NOT NULL;

-- DropTable
DROP TABLE `rolerights`;

-- DropTable
DROP TABLE `userrights`;

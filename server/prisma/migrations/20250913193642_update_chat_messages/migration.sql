/*
  Warnings:

  - You are about to drop the column `user_id` on the `message` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `message` DROP FOREIGN KEY `Message_user_id_fkey`;

-- DropIndex
DROP INDEX `Message_user_id_idx` ON `message`;

-- AlterTable
ALTER TABLE `message` DROP COLUMN `user_id`;

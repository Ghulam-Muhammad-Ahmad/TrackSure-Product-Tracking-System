/*
  Warnings:

  - You are about to drop the column `user_id` on the `activitylog` table. All the data in the column will be lost.
  - Added the required column `created_for` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `activitylog` DROP FOREIGN KEY `activity_log_ibfk_1`;

-- DropIndex
DROP INDEX `activity_log_ibfk_1` ON `activitylog`;

-- AlterTable
ALTER TABLE `activitylog` DROP COLUMN `user_id`,
    ADD COLUMN `created_for` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `ActivityLog` ADD CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`created_for`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

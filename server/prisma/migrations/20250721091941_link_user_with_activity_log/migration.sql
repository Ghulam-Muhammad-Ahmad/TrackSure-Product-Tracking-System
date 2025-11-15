/*
  Warnings:

  - Added the required column `user_id` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `activitylog` ADD COLUMN `user_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `created_by` ON `product_status`(`created_by`);

-- AddForeignKey
ALTER TABLE `ActivityLog` ADD CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

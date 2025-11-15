/*
  Warnings:

  - You are about to drop the column `created_for` on the `activitylog` table. All the data in the column will be lost.
  - Added the required column `tenant_id` to the `ActivityLog` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `activitylog` DROP FOREIGN KEY `activity_log_ibfk_1`;

-- DropIndex
DROP INDEX `activity_log_ibfk_1` ON `activitylog`;

-- AlterTable
ALTER TABLE `activitylog` DROP COLUMN `created_for`,
    ADD COLUMN `tenant_id` VARCHAR(191) NOT NULL;

-- CreateIndex
CREATE INDEX `ActivityLog_tenant_id_idx` ON `ActivityLog`(`tenant_id`);

-- AddForeignKey
ALTER TABLE `ActivityLog` ADD CONSTRAINT `activity_log_tenant_fk` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

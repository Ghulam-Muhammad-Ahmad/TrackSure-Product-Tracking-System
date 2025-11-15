-- AlterTable
ALTER TABLE `users` ADD COLUMN `verifying_token` VARCHAR(255) NOT NULL DEFAULT '';

/*
  Warnings:

  - You are about to drop the column `created_by` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `product_status` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `roles` table. All the data in the column will be lost.
  - You are about to drop the column `created_by` on the `users` table. All the data in the column will be lost.
  - Added the required column `tenant_id` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `product_status` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `roles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenant_id` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `activitylog` DROP FOREIGN KEY `activity_log_ibfk_1`;

-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_ibfk_1`;

-- DropForeignKey
ALTER TABLE `notification` DROP FOREIGN KEY `notification_user_ibfk_1`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_ibfk_1`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_ibfk_2`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_ibfk_3`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_ibfk_4`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_ibfk_5`;

-- DropForeignKey
ALTER TABLE `roles` DROP FOREIGN KEY `roles_ibfk_1`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_ibfk_1`;

-- DropIndex
DROP INDEX `activity_log_ibfk_1` ON `activitylog`;

-- DropIndex
DROP INDEX `created_by` ON `categories`;

-- DropIndex
DROP INDEX `notification_user_ibfk_1` ON `notification`;

-- DropIndex
DROP INDEX `created_by` ON `product_status`;

-- DropIndex
DROP INDEX `created_by` ON `products`;

-- DropIndex
DROP INDEX `created_by` ON `roles`;

-- AlterTable
ALTER TABLE `categories` DROP COLUMN `created_by`,
    ADD COLUMN `tenant_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `product_status` DROP COLUMN `created_by`,
    ADD COLUMN `tenant_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `created_by`,
    ADD COLUMN `tenant_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `roles` DROP COLUMN `created_by`,
    ADD COLUMN `tenant_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `users` DROP COLUMN `created_by`,
    ADD COLUMN `tenant_id` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `tenants` (
    `tenant_id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenant_name` VARCHAR(100) NOT NULL,
    `is_deleted` INTEGER NULL DEFAULT 0,
    `deleted_at` TIMESTAMP(0) NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`tenant_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `categories_users` (
    `category_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,

    INDEX `categories_users_user_id_idx`(`user_id`),
    PRIMARY KEY (`category_id`, `user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `tenant_id` ON `categories`(`tenant_id`);

-- CreateIndex
CREATE INDEX `tenant_id` ON `product_status`(`tenant_id`);

-- CreateIndex
CREATE INDEX `tenant_id` ON `products`(`tenant_id`);

-- CreateIndex
CREATE INDEX `tenant_id` ON `roles`(`tenant_id`);

-- CreateIndex
CREATE INDEX `tenant_id` ON `users`(`tenant_id`);

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_ibfk_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`manufacturer_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`current_owner_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_5` FOREIGN KEY (`product_status_id`) REFERENCES `product_status`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_status` ADD CONSTRAINT `product_status_ibfk_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_ibfk_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ActivityLog` ADD CONSTRAINT `activity_log_ibfk_1` FOREIGN KEY (`created_for`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `notification_user_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories_users` ADD CONSTRAINT `categories_users_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `categories_users` ADD CONSTRAINT `categories_users_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

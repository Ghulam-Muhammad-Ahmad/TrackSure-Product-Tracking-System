/*
  Warnings:

  - The primary key for the `tenants` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE `categories` DROP FOREIGN KEY `categories_ibfk_tenant`;

-- DropForeignKey
ALTER TABLE `product_status` DROP FOREIGN KEY `product_status_ibfk_tenant`;

-- DropForeignKey
ALTER TABLE `products` DROP FOREIGN KEY `products_ibfk_tenant`;

-- DropForeignKey
ALTER TABLE `roles` DROP FOREIGN KEY `roles_ibfk_tenant`;

-- DropForeignKey
ALTER TABLE `users` DROP FOREIGN KEY `users_ibfk_tenant`;

-- AlterTable
ALTER TABLE `categories` MODIFY `tenant_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `product_status` MODIFY `tenant_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `products` MODIFY `tenant_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `roles` MODIFY `tenant_id` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `tenants` DROP PRIMARY KEY,
    MODIFY `tenant_id` VARCHAR(191) NOT NULL,
    ADD PRIMARY KEY (`tenant_id`);

-- AlterTable
ALTER TABLE `users` MODIFY `tenant_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_ibfk_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `product_status` ADD CONSTRAINT `product_status_ibfk_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_ibfk_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

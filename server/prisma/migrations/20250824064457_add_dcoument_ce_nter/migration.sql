-- CreateTable
CREATE TABLE `document_folders` (
    `folder_id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(150) NOT NULL,
    `parent_id` INTEGER NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_deleted` INTEGER NULL DEFAULT 0,
    `deleted_at` TIMESTAMP(0) NULL,

    INDEX `tenant_id`(`tenant_id`),
    INDEX `parent_id`(`parent_id`),
    PRIMARY KEY (`folder_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `documents` (
    `document_id` INTEGER NOT NULL AUTO_INCREMENT,
    `filename` VARCHAR(255) NOT NULL,
    `file_url` VARCHAR(500) NOT NULL,
    `file_type` VARCHAR(20) NOT NULL,
    `file_size` INTEGER NOT NULL,
    `tags` JSON NOT NULL,
    `permissions` JSON NOT NULL,
    `uploaded_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `tenant_id` VARCHAR(191) NOT NULL,
    `uploader_id` INTEGER NOT NULL,
    `product_id` INTEGER NULL,
    `folder_id` INTEGER NULL,

    INDEX `tenant_id`(`tenant_id`),
    INDEX `uploader_id`(`uploader_id`),
    INDEX `product_id`(`product_id`),
    INDEX `folder_id`(`folder_id`),
    PRIMARY KEY (`document_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `document_folders` ADD CONSTRAINT `folders_ibfk_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `document_folders` ADD CONSTRAINT `document_folders_parent_id_fkey` FOREIGN KEY (`parent_id`) REFERENCES `document_folders`(`folder_id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_ibfk_tenant` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_ibfk_user` FOREIGN KEY (`uploader_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_ibfk_product` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `documents` ADD CONSTRAINT `documents_ibfk_folder` FOREIGN KEY (`folder_id`) REFERENCES `document_folders`(`folder_id`) ON DELETE CASCADE ON UPDATE CASCADE;

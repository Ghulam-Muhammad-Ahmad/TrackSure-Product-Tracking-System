-- CreateTable
CREATE TABLE `categories` (
    `category_id` INTEGER NOT NULL AUTO_INCREMENT,
    `category_name` VARCHAR(100) NOT NULL,
    `is_deleted` INTEGER NULL DEFAULT 0,
    `deleted_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NOT NULL,

    UNIQUE INDEX `category_name`(`category_name`),
    INDEX `created_by`(`created_by`),
    PRIMARY KEY (`category_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `products` (
    `product_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_name` VARCHAR(100) NOT NULL,
    `category_id` INTEGER NOT NULL,
    `manufacturer_id` INTEGER NOT NULL,
    `current_owner_id` INTEGER NOT NULL,
    `status` ENUM('Made', 'Dispatched', 'Received', 'Transferred', 'Stocked', 'Listed', 'Sold', 'Returned') NOT NULL,
    `qr_code_id` INTEGER NOT NULL,
    `blockchain_record` VARCHAR(255) NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_deleted` INTEGER NULL DEFAULT 0,
    `deleted_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NOT NULL,

    UNIQUE INDEX `qr_code_id`(`qr_code_id`),
    INDEX `category_id`(`category_id`),
    INDEX `created_by`(`created_by`),
    INDEX `current_owner_id`(`current_owner_id`),
    INDEX `manufacturer_id`(`manufacturer_id`),
    PRIMARY KEY (`product_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qrcodes` (
    `qr_code_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `qr_code_data` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_deleted` INTEGER NULL DEFAULT 0,
    `deleted_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NOT NULL,

    UNIQUE INDEX `product_id`(`product_id`),
    INDEX `created_by`(`created_by`),
    PRIMARY KEY (`qr_code_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `role_id` INTEGER NOT NULL AUTO_INCREMENT,
    `role_name` VARCHAR(50) NOT NULL,
    `permissions` JSON NOT NULL,
    `is_deleted` INTEGER NULL DEFAULT 0,
    `deleted_at` TIMESTAMP(0) NULL,
    `created_by` INTEGER NULL,

    UNIQUE INDEX `role_name`(`role_name`),
    INDEX `created_by`(`created_by`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `user_id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(50) NOT NULL,
    `password_hash` VARCHAR(255) NOT NULL,
    `email` VARCHAR(100) NOT NULL,
    `location` VARCHAR(50) NOT NULL,
    `role_id` INTEGER NOT NULL,
    `created_by` INTEGER NULL,
    `created_at` TIMESTAMP(0) NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_deleted` INTEGER NULL DEFAULT 0,
    `deleted_at` TIMESTAMP(0) NULL,
    `first_name` VARCHAR(50) NOT NULL DEFAULT '',
    `last_name` VARCHAR(50) NOT NULL DEFAULT '',
    `phone_number` VARCHAR(20) NOT NULL DEFAULT '',

    UNIQUE INDEX `username`(`username`),
    UNIQUE INDEX `email`(`email`),
    INDEX `role_id`(`role_id`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `categories` ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `fk_qr_code` FOREIGN KEY (`qr_code_id`) REFERENCES `qrcodes`(`qr_code_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories`(`category_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_2` FOREIGN KEY (`manufacturer_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_3` FOREIGN KEY (`current_owner_id`) REFERENCES `users`(`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `products` ADD CONSTRAINT `products_ibfk_4` FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `qrcodes` ADD CONSTRAINT `qrcodes_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `qrcodes` ADD CONSTRAINT `qrcodes_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `roles` ADD CONSTRAINT `roles_ibfk_1` FOREIGN KEY (`created_by`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `users` ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

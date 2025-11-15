-- CreateTable
CREATE TABLE `qr_codes` (
    `qr_id` INTEGER NOT NULL AUTO_INCREMENT,
    `product_id` INTEGER NOT NULL,
    `qr_name` VARCHAR(100) NOT NULL,
    `view_permission` INTEGER NOT NULL,
    `qr_details` JSON NOT NULL,
    `qr_image_url` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `product_id`(`product_id`),
    PRIMARY KEY (`qr_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `qr_codes` ADD CONSTRAINT `qr_codes_product_id_fkey` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE CASCADE ON UPDATE CASCADE;

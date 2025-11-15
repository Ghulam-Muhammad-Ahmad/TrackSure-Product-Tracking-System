/*
  Warnings:

  - You are about to drop the column `status` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `products` DROP COLUMN `status`;

-- CreateTable
CREATE TABLE `product_status` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `status` VARCHAR(50) NOT NULL,
    `product_id` INTEGER NOT NULL,
    `updated_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `product_id`(`product_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `product_status` ADD CONSTRAINT `product_status_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products`(`product_id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

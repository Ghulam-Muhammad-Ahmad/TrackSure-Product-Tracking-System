/*
  Warnings:

  - You are about to drop the column `product_id` on the `product_status` table. All the data in the column will be lost.
  - Added the required column `product_status_id` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `product_status` DROP FOREIGN KEY `product_status_ibfk_1`;

-- DropIndex
DROP INDEX `product_id` ON `product_status`;

-- AlterTable
ALTER TABLE `product_status` DROP COLUMN `product_id`;

-- AlterTable
ALTER TABLE `products` ADD COLUMN `product_status_id` INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX `product_status_id` ON `products`(`product_status_id`);

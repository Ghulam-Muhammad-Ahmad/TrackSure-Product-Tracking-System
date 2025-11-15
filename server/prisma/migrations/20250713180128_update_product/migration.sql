/*
  Warnings:

  - You are about to drop the column `blockchain_record` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `qr_code_id` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `qr_code_id` ON `products`;

-- AlterTable
ALTER TABLE `products` DROP COLUMN `blockchain_record`,
    DROP COLUMN `qr_code_id`;

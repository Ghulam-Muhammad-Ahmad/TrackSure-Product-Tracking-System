/*
  Warnings:

  - Added the required column `created_by` to the `product_status` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product_status` ADD COLUMN `created_by` INTEGER NOT NULL;

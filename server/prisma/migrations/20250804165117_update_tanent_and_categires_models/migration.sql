/*
  Warnings:

  - You are about to drop the `categories_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `categories_users` DROP FOREIGN KEY `categories_users_category_id_fkey`;

-- DropForeignKey
ALTER TABLE `categories_users` DROP FOREIGN KEY `categories_users_user_id_fkey`;

-- DropTable
DROP TABLE `categories_users`;

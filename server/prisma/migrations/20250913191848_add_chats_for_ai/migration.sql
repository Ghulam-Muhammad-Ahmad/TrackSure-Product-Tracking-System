-- CreateTable
CREATE TABLE `Chat` (
    `chat_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `tenant_id` VARCHAR(191) NOT NULL,
    `title` VARCHAR(255) NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` TIMESTAMP(0) NOT NULL,

    INDEX `Chat_user_id_idx`(`user_id`),
    INDEX `Chat_tenant_id_idx`(`tenant_id`),
    PRIMARY KEY (`chat_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Message` (
    `message_id` INTEGER NOT NULL AUTO_INCREMENT,
    `chat_id` INTEGER NOT NULL,
    `user_id` INTEGER NOT NULL,
    `role` VARCHAR(50) NOT NULL,
    `content` TEXT NOT NULL,
    `created_at` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `Message_chat_id_idx`(`chat_id`),
    INDEX `Message_user_id_idx`(`user_id`),
    PRIMARY KEY (`message_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Chat` ADD CONSTRAINT `Chat_tenant_id_fkey` FOREIGN KEY (`tenant_id`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_chat_id_fkey` FOREIGN KEY (`chat_id`) REFERENCES `Chat`(`chat_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

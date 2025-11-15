-- CreateTable
CREATE TABLE `QrScannerConfig` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenantId` VARCHAR(191) NOT NULL DEFAULT '',
    `slug` VARCHAR(191) NOT NULL DEFAULT '',
    `brandName` VARCHAR(191) NOT NULL DEFAULT '',
    `logoUrl` VARCHAR(191) NULL DEFAULT '',
    `redirectUrl` VARCHAR(191) NULL DEFAULT '',
    `themeColor` VARCHAR(191) NULL DEFAULT '',
    `backgroundUrl` VARCHAR(191) NULL DEFAULT '',
    `description` VARCHAR(191) NULL DEFAULT '',
    `createdAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `QrScannerConfig_slug_key`(`slug`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `QrScannerConfig` ADD CONSTRAINT `qr_scanner_config_ibfk_tenant` FOREIGN KEY (`tenantId`) REFERENCES `tenants`(`tenant_id`) ON DELETE CASCADE ON UPDATE CASCADE;

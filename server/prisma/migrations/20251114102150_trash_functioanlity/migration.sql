-- AlterTable
ALTER TABLE `documents` ADD COLUMN `deleted_at` TIMESTAMP(0) NULL,
    ADD COLUMN `is_deleted` INTEGER NULL DEFAULT 0;

-- Update existing records to set is_deleted to 0 if null
UPDATE `documents` SET `is_deleted` = 0 WHERE `is_deleted` IS NULL;

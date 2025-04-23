/*
  Warnings:

  - Added the required column `seenAt` to the `Guild` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Guild` ADD COLUMN `blacklistAt` DATETIME(3) NULL,
    ADD COLUMN `prefix` VARCHAR(191) NULL,
    ADD COLUMN `seenAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `GuildUser` ADD COLUMN `bannedAt` DATETIME(3) NULL,
    ADD COLUMN `isOwner` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `nickname` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `Presence` (
    `id` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

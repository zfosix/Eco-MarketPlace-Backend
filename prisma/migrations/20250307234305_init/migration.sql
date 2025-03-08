/*
  Warnings:

  - You are about to drop the column `idMenu` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `table_number` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `idMenu` on the `order_list` table. All the data in the column will be lost.
  - You are about to alter the column `role` on the `user` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(2))` to `Enum(EnumId(0))`.
  - You are about to drop the `menu` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `order` DROP FOREIGN KEY `order_idMenu_fkey`;

-- DropForeignKey
ALTER TABLE `order_list` DROP FOREIGN KEY `order_list_idMenu_fkey`;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `idMenu`,
    DROP COLUMN `table_number`,
    ADD COLUMN `idProduct` INTEGER NULL;

-- AlterTable
ALTER TABLE `order_list` DROP COLUMN `idMenu`,
    ADD COLUMN `idProduct` INTEGER NULL;

-- AlterTable
ALTER TABLE `user` MODIFY `role` ENUM('MANAGER', 'ADMIN', 'USER') NOT NULL DEFAULT 'ADMIN';

-- DropTable
DROP TABLE `menu`;

-- CreateTable
CREATE TABLE `product` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(191) NOT NULL DEFAULT '',
    `name` VARCHAR(191) NOT NULL DEFAULT '',
    `price` INTEGER NOT NULL DEFAULT 0,
    `category` ENUM('FOOD', 'DRINK', 'ITEMS') NOT NULL DEFAULT 'FOOD',
    `picture` VARCHAR(191) NOT NULL DEFAULT '',
    `description` TEXT NOT NULL DEFAULT '',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updateAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `order` ADD CONSTRAINT `order_idProduct_fkey` FOREIGN KEY (`idProduct`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `order_list` ADD CONSTRAINT `order_list_idProduct_fkey` FOREIGN KEY (`idProduct`) REFERENCES `product`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

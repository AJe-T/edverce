ALTER TABLE `Purchase`
ADD COLUMN `certificateRecipientName` VARCHAR(191) NULL,
ADD COLUMN `certificateIssuedAt` DATETIME(3) NULL;

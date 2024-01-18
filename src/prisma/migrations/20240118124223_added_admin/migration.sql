-- CreateTable
CREATE TABLE `comics` (
    `id` INTEGER NOT NULL,
    `ComicTitle` VARCHAR(255) NOT NULL,
    `Description` LONGTEXT NOT NULL,
    `CoverImage` VARCHAR(255) NOT NULL,
    `Origin` VARCHAR(55) NOT NULL,
    `Status` VARCHAR(55) NOT NULL,
    `Genre` VARCHAR(255) NULL,
    `Author` VARCHAR(255) NULL,
    `Artist` VARCHAR(255) NULL,
    `Badges` VARCHAR(255) NULL,
    `Date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `comics_ComicTitle_key`(`ComicTitle`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chapters` (
    `chapterID` INTEGER NOT NULL,
    `ComicTitle` VARCHAR(255) NOT NULL,
    `comicID` INTEGER NOT NULL,
    `ChapterNumber` INTEGER NOT NULL,
    `ChapterName` VARCHAR(100) NOT NULL,
    `pages` LONGTEXT NOT NULL,
    `chapterDate` DATETIME(3) NOT NULL,

    PRIMARY KEY (`chapterID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(55) NOT NULL,
    `UserName` VARCHAR(55) NOT NULL,
    `Password` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `users_Email_key`(`Email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(55) NOT NULL,
    `UserName` VARCHAR(55) NOT NULL,
    `Password` VARCHAR(200) NOT NULL,

    UNIQUE INDEX `admin_Email_key`(`Email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

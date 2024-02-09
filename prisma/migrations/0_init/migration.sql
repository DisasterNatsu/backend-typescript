-- CreateTable
CREATE TABLE `admin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(100) NOT NULL,
    `UserName` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chapters` (
    `chapterID` INTEGER NOT NULL,
    `ComicTitle` VARCHAR(255) NULL,
    `comicID` VARCHAR(255) NOT NULL,
    `ChapterNumber` VARCHAR(255) NOT NULL,
    `ChapterName` VARCHAR(255) NULL,
    `pages` LONGTEXT NOT NULL,
    `chapterDate` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`chapterID`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `comics` (
    `id` VARCHAR(255) NOT NULL,
    `ComicTitle` VARCHAR(255) NOT NULL,
    `Description` LONGTEXT NOT NULL,
    `CoverImage` VARCHAR(255) NOT NULL,
    `Origin` VARCHAR(255) NOT NULL,
    `Status` VARCHAR(255) NOT NULL,
    `Genres` VARCHAR(255) NOT NULL,
    `Author` VARCHAR(255) NULL,
    `Artist` VARCHAR(255) NULL,
    `Badges` VARCHAR(255) NULL,
    `Date` DATETIME(0) NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Email` VARCHAR(100) NOT NULL,
    `UserName` VARCHAR(100) NOT NULL,
    `Password` VARCHAR(255) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


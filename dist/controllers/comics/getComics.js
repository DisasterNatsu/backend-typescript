"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetFiveRandomComics = exports.GetLatestEight = exports.AllComics = exports.GetTopEight = void 0;
const client_1 = require("@prisma/client");
const chapterGrouping_1 = require("../../helpers/chapterGrouping");
const prisma = new client_1.PrismaClient();
// get the top eight
const GetTopEight = async (req, res) => {
    // try catch block
    try {
        // get the comics from database
        const comics = await prisma.comics.findMany({
            select: {
                id: true,
                ComicTitle: true, // This will be renamed to 'name' in the response
                CoverImage: true,
            },
            orderBy: { Date: "asc" },
            take: 10,
        });
        res.status(200).json(comics); // respod with the comics
    }
    catch (error) {
        // respond if error
        return res.status(500).json({
            error,
            message: "Something went wrong while finding the comics in database",
        });
    }
    finally {
        return async () => prisma.$disconnect();
    }
};
exports.GetTopEight = GetTopEight;
// get all comics
const AllComics = async (req, res) => {
    // try catch block
    try {
        // get the comics from database
        const comics = await prisma.comics.findMany({
            orderBy: { Date: "desc" },
        });
        res.status(200).json(comics); // respod with the comics
    }
    catch (error) {
        // respond if error
        return res.status(500).json({
            error,
            message: "Something went wrong while finding the comics in database",
        });
    }
    finally {
        return async () => prisma.$disconnect();
    }
};
exports.AllComics = AllComics;
// Get latest 4 comic chapters
const GetLatestEight = async (req, res) => {
    try {
        const latestChapters = await prisma.$queryRaw `
      SELECT c.*
      FROM chapters c
      INNER JOIN (
        SELECT comicID, MAX(chapterDate) as maxDate
        FROM chapters
        GROUP BY comicID
      ) groupedChapters 
      ON c.comicID = groupedChapters.comicID 
      AND c.chapterDate = groupedChapters.maxDate
      ORDER BY c.chapterDate DESC
      LIMIT 4;
    `;
        if (latestChapters.length === 0) {
            return res.status(404).json({ message: "No Chapters found" });
        }
        // Extract comicIDs
        const comicIDs = latestChapters.map((chapter) => chapter.comicID);
        const latestChapterIDs = latestChapters.map((chapter) => chapter.chapterID);
        // Fetch previous chapters for each comicID
        const previousChaptersPromises = comicIDs.map(async (comicID) => {
            const previousChapters = await prisma.chapters.findMany({
                where: {
                    comicID,
                    chapterID: { notIn: latestChapterIDs }, // Exclude latest chapters
                },
                orderBy: { chapterDate: "desc" },
                select: {
                    comicID: true, // Include comicID
                    chapterID: true,
                    ChapterNumber: true,
                    ChapterName: true,
                    chapterDate: true,
                },
                take: 1, // Fetch only the most recent previous chapter
            });
            return previousChapters[0] || null; // Return null if no previous chapter is found
        });
        const coverImages = comicIDs.map(async (comicID) => {
            const CoverImage = await prisma.comics.findMany({
                where: {
                    id: comicID,
                },
                select: {
                    id: true,
                    CoverImage: true,
                },
            });
            return CoverImage;
        });
        const previousChaptersResults = await Promise.all(previousChaptersPromises);
        const coverImagesRes = await Promise.all(coverImages); // Cover Image Response
        const coverImageLookup = (0, chapterGrouping_1.createCoverImageLookup)(coverImagesRes); // Flattening the response array
        const transformedData = (0, chapterGrouping_1.transformData)(latestChapters, coverImageLookup); // Bending the response to fit the required format
        const mergedData = (0, chapterGrouping_1.mergeChapters)(transformedData, previousChaptersResults); // Add the next chapter
        return res.status(200).json(mergedData); // Sending Response
    }
    catch (error) {
        // Respond if there is an error
        return res.status(500).json({
            error: error || "Unknown error",
            message: "Something went wrong while finding the comics in the database",
        });
    }
    finally {
        await prisma.$disconnect();
    }
};
exports.GetLatestEight = GetLatestEight;
// Get 5 comics
const GetFiveRandomComics = async (req, res) => {
    try {
        // Use raw SQL to get 5 random comics from the database
        const comics = await prisma.$queryRaw `SELECT id, ComicTitle AS name, CoverImage, Genres FROM comics ORDER BY RAND() LIMIT 5`;
        // Respond with the random comics
        res.status(200).json(comics);
    }
    catch (error) {
        // Respond with an error message
        return res.status(500).json({
            error,
            message: "Something went wrong while finding the comics in the database",
        });
    }
    finally {
        // Ensure the Prisma client disconnects
        await prisma.$disconnect();
    }
};
exports.GetFiveRandomComics = GetFiveRandomComics;
//# sourceMappingURL=getComics.js.map
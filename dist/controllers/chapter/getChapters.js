"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChapterPages = exports.AllChapters = void 0;
const client_1 = require("@prisma/client");
const urlParser_1 = require("../../helpers/urlParser");
const prisma = new client_1.PrismaClient();
const AllChapters = async (req, res) => {
    // parsing the params to get the data needed
    const { id, title } = (0, urlParser_1.ParseParams)(req.params.comicName);
    try {
        // get the chapters from database
        const chapters = await prisma.chapters.findMany({
            select: {
                chapterID: true,
                ChapterNumber: true,
                ChapterName: true,
                chapterDate: true,
            },
            where: {
                ComicTitle: title,
                comicID: JSON.stringify(id),
            },
            orderBy: {
                ChapterNumber: "desc",
            },
        });
        // get the comic details
        const ComicDetails = await prisma.comics.findFirst({
            select: {
                ComicTitle: true,
                CoverImage: true,
                id: true,
                Artist: true,
                Author: true,
                Description: true,
                Genres: true,
                Status: true,
                Origin: true,
            },
            where: {
                ComicTitle: title,
                id: JSON.stringify(id),
            },
        });
        // Sort chapters by ChapterNumber numerically
        chapters.sort((a, b) => {
            const numA = parseFloat(a.ChapterNumber);
            const numB = parseFloat(b.ChapterNumber);
            return numB - numA;
        });
        // if no chapters for that comic
        if (!ComicDetails)
            return res
                .status(404)
                .json({ message: "No Chapters found", comicDetails: ComicDetails });
        // return the chapters
        res.status(200).json({ chapters: chapters, comicDetails: ComicDetails });
    }
    catch (error) {
        // respond if error
        return res.status(500).json({
            error,
            message: "Something went wrong while finding the chapters in database",
        });
    }
    finally {
        // Disconnect from the Prisma client
        await prisma.$disconnect();
    }
};
exports.AllChapters = AllChapters;
const ChapterPages = async (req, res) => {
    // getting comicID and name
    const { id } = (0, urlParser_1.ParseParams)(req.params.comicName);
    const { chapterID, chapterNumber } = (0, urlParser_1.ParseParamsChapter)(req.params.chapter);
    try {
        const comicPages = await prisma.chapters.findUnique({
            select: {
                ChapterNumber: true,
                ChapterName: true,
                ComicTitle: true,
                pages: true,
                chapterID: true,
            },
            where: {
                comicID: JSON.stringify(id),
                chapterID: chapterID,
                ChapterNumber: JSON.stringify(chapterNumber),
            },
        });
        return res.status(200).json(comicPages);
    }
    catch (error) {
        // respond if error
        return res.status(500).json({
            error,
            message: "Something went wrong while finding the chapters in database",
        });
    }
    finally {
        // Disconnect from the Prisma client
        await prisma.$disconnect();
    }
};
exports.ChapterPages = ChapterPages;
//# sourceMappingURL=getChapters.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCoverImageLookup = exports.transformData = exports.mergeChapters = void 0;
const mergeChapters = (latestChapters, previousChaptersResults) => {
    // Create a map to store previous chapters by comicID
    const previousChaptersMap = new Map();
    previousChaptersResults.forEach((chapter) => {
        const { comicID, chapterID, ChapterNumber, ChapterName, chapterDate } = chapter;
        if (!previousChaptersMap.has(comicID)) {
            previousChaptersMap.set(comicID, []);
        }
        previousChaptersMap.get(comicID).push({
            chapterID,
            ChapterNumber,
            ChapterName,
            chapterDate,
        });
    });
    // Merge latest chapters with previous chapters
    return latestChapters.map((latestComic) => {
        const previousChapters = previousChaptersMap.get(latestComic.comicID) || [];
        return {
            ...latestComic,
            chapters: [...latestComic.chapters, ...previousChapters],
        };
    });
};
exports.mergeChapters = mergeChapters;
const transformData = (data, coverImageLookup) => {
    // Helper function to format date as ISO string
    const formatDate = (date) => date.toISOString();
    // Group the raw chapters by comicID
    const groupedChapters = data.reduce((acc, chapter) => {
        if (!acc[chapter.comicID]) {
            acc[chapter.comicID] = {
                ComicTitle: chapter.ComicTitle || "", // Default value if needed
                comicID: chapter.comicID,
                CoverImage: coverImageLookup[chapter.comicID] || "", // Set cover image
                chapters: [],
            };
        }
        acc[chapter.comicID].chapters.push({
            chapterID: chapter.chapterID,
            ChapterNumber: chapter.ChapterNumber,
            ChapterName: chapter.ChapterName,
            chapterDate: formatDate(chapter.chapterDate), // Convert to ISO date string
        });
        return acc;
    }, {});
    // Convert groupedChapters to an array
    return Object.values(groupedChapters);
};
exports.transformData = transformData;
const createCoverImageLookup = (coverImages) => {
    const lookup = {};
    coverImages.forEach((images) => {
        images.forEach((image) => {
            lookup[image.id] = image.CoverImage;
        });
    });
    return lookup;
};
exports.createCoverImageLookup = createCoverImageLookup;
//# sourceMappingURL=chapterGrouping.js.map
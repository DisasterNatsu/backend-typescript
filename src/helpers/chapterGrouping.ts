export const mergeChapters = (
  latestChapters: TransformedComic[],
  previousChaptersResults: {
    comicID: string;
    chapterID: number;
    ChapterNumber: string;
    ChapterName: string;
    chapterDate: string;
  }[]
): TransformedComic[] => {
  // Create a map to store previous chapters by comicID
  const previousChaptersMap = new Map<string, TransformedChapter[]>();

  previousChaptersResults.forEach((chapter) => {
    const { comicID, chapterID, ChapterNumber, ChapterName, chapterDate } =
      chapter;
    if (!previousChaptersMap.has(comicID)) {
      previousChaptersMap.set(comicID, []);
    }
    previousChaptersMap.get(comicID)!.push({
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

export const transformData = (
  data: RawChapter[],
  coverImageLookup: Record<string, string>
): TransformedComic[] => {
  // Helper function to format date as ISO string
  const formatDate = (date: Date): string => date.toISOString();

  // Group the raw chapters by comicID
  const groupedChapters = data.reduce<Record<string, TransformedComic>>(
    (acc, chapter) => {
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
    },
    {}
  );

  // Convert groupedChapters to an array
  return Object.values(groupedChapters);
};

export const createCoverImageLookup = (
  coverImages: { id: string; CoverImage: string }[][]
) => {
  const lookup: Record<string, string> = {};
  coverImages.forEach((images) => {
    images.forEach((image) => {
      lookup[image.id] = image.CoverImage;
    });
  });
  return lookup;
};

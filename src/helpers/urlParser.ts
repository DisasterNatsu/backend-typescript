export const ParseParams = (param: string) => {
  const paramArray = param.split("-");

  const id = Number(paramArray[0]);

  const comicName = paramArray.splice(1, paramArray.length - 1).join(" ");

  const capitalizedComicName = comicName.replace(/\b\w/g, (char) =>
    char.toUpperCase()
  );

  return {
    id: id,
    title: capitalizedComicName,
  };
};

export const ParseParamsChapter = (param: string) => {
  const paramArray = param.split("-");

  const chapterID = Number(paramArray[0]);

  const chapterNumber = Number(paramArray[paramArray.length - 1]);

  return { chapterID, chapterNumber };
};

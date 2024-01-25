export const getUrlEncodedFileName = (fileName: string) => {
  return fileName.split("/").map(encodeURIComponent).join("/");
};

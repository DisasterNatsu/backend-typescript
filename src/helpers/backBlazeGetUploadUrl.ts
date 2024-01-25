import Axios from "axios";

interface backblazeUploadUrlProps {
  apiUrl: string;
  authorizationToken: string;
  bucketId: string;
}

export const getUploadUrl = async ({
  apiUrl,
  authorizationToken,
  bucketId,
}: backblazeUploadUrlProps) => {
  // the headers

  const headers = {
    Authorization: authorizationToken,
    "Content-Type": "application/json",
  };

  // body of the post request

  const data = {
    bucketId: bucketId,
  };

  try {
    const response = await Axios.post(apiUrl, data, { headers });

    const resData = await response.data;

    // auth token for upload
    const uploadUrlToken = resData.authorizationToken;

    //upload Url

    const uploadUrl = resData.uploadUrl;

    // return the required
    return { uploadUrlToken, uploadUrl };
  } catch (error: any) {
    console.error(
      "Error getting upload URL:",
      error.response ? error.response.data : error.message
    );
    throw error;
  }
};

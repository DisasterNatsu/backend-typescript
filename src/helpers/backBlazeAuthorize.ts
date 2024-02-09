import Axios from "axios";

export const backblazeAuthorize = async ({
  applicationKey,
  applicationID,
}: {
  applicationKey: string;
  applicationID: string;
}) => {
  // create a base64 string

  let base64 = Buffer.from(applicationKey + ":" + applicationID).toString(
    "base64"
  );

  const authTokenB2 = "Basic " + base64;

  try {
    const Authorize = await Axios.get(
      "https://api.backblazeb2.com/b2api/v3/b2_authorize_account",
      {
        headers: {
          Authorization: authTokenB2,
        },
      }
    );

    const res = await Authorize.data;

    // get the api url from response

    const apiUrl = res.apiInfo.storageApi.apiUrl;

    // get auth token

    const authorizationToken = res.authorizationToken;

    return {
      apiUrl,
      authToken: authorizationToken,
    };
  } catch (error: any) {
    console.error(error);
  }
};

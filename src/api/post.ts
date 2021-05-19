import axios from "axios";

const {
  REACT_APP_INTEROP_API_URL_ENDPOINT,
  REACT_APP_INTEROP_USERNAME,
  REACT_APP_INTEROP_PASSWORD,
} = process.env;

const postToIL = async (formattedResponse: any) => {
  try {
    return await axios({
      url: `${REACT_APP_INTEROP_API_URL_ENDPOINT}/dhis2/data-elements`,
      method: "POST",
      data: formattedResponse,
      auth: {
        username: `${REACT_APP_INTEROP_USERNAME}`,
        password: `${REACT_APP_INTEROP_PASSWORD}`,
      },
    });
  } catch (error) {
    console.log("POST TO IL ERROR======>", error);
  }
};

export default {
  postToIL,
};

import axios from "axios";
import Constants from "expo-constants";

export async function fetchtest() {
  let config = {
    method: "get",
    maxBodyLength: Infinity,
    url: "https://httpbin.org/get",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await axios
    .request(config)
    .then((response) => {
      return response;
    })
    .catch((error) => {
      console.log(error);
    });
}

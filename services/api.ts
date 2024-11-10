import Constants from "expo-constants";
import axios from "axios";

export const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.BASE_URL,
});

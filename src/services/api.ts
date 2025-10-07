import axios from "axios";
import { error } from "console";
import { config } from "process";


const apiClient = axios.create({
    baseURL: "http://localhost:8080/api",
    headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.response.use((config) => {
  try {
    if (config && config.data && typeof FormData !== "undefined" && config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers["Content-Type"];
        delete config.headers["content-type"];
  }
}
  } catch (e) {}
  return config;
}, (error) => Promise.reject(error));

export default apiClient;
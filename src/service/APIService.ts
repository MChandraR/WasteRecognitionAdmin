import Axios, {AxiosInstance} from "axios";
import { getAuthToken } from "@/util/AuthCookies";

const APIService : AxiosInstance = Axios.create({
  baseURL: "/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

//Interceptor ketika kredensial udah tidak valid lagi
APIService.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log("APIService Interceptor Error:", error);
    if (error.response && error.response.status === 401) {
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

APIService.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default APIService;
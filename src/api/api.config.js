import axios from "axios";
// Define a custom type that extends AxiosRequestConfig with 'contentType' property
const fetchApi = axios.create({
    baseURL: import.meta.env.VITE_CUSTOM_BASE_URL,
});

const addContentType = (config) => {
  try {
    if (config.contentType === "formdata") {
      // Set the 'Content-Type' header to 'multipart/form-data' for FormData.
      const formData = new FormData();
      if (config.data instanceof FormData) {
        for (const [key, value] of config.data) {
          formData.append(key, value);
        }
      } else {
        Object.entries(config.data || {}).forEach(([key, value]) => {
          formData.append(key, value);
        });
      }
      config.data = formData;
      config.headers["Content-Type"] = "multipart/form-data";
    } else if (config.contentType === "query") {
      // For query parameters, append them to the URL directly.
      const params = new URLSearchParams(config.params).toString();
      config.url += `?${params}`;
      delete config.params;
    } else {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  } catch (error) {
    console.log("Error in contentType: ", error);
  }
};

fetchApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    // console.log("Token inside request Interceptor", { token });
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add the appropriate content type headers.
    return addContentType(config);
  },
  (error) => {
    console.log("Error in request Interceptor: ", error);
    return Promise.reject(error);
  }
);

fetchApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("");
    }
    return Promise.reject(error);
  }
);

export default fetchApi;

import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api/v1/`,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("Unauthorized! Redirecting to login...");
    }
    return Promise.reject(error);
  }
);
export default api;

export const getProfile = async () => {
  try {
    const { data } = await api.get("/user/profile");
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
export const getNotes = async () => {
  try {
    const { data } = await api.get("/note/notes");
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};
export const deleteNote = async (id: string) => {
  try {
    const { data } = await api.delete(`/note/delete/${id}`);
    return data;
  } catch (error) {
    console.error("Error fetching profile:", error);
    throw error;
  }
};

import axios from "axios";

const axio = axios.create({
  baseURL: import.meta.env.BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axio;

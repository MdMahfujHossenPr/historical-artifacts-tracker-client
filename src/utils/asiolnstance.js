import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://historical-artifacts-tracker-server-lovat.vercel.app",
});

export default instance;

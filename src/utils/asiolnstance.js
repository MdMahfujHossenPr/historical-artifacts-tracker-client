import axios from "axios";

const instance = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://historical-artifacts-tracker-server-apkyn6s0q.vercel.app",
});

export default instance;

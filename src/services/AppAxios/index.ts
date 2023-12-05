import axios from "axios";
import Cookies from "js-cookie";

const AppAxios = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  },

  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL
});

const token = Cookies.get("token");

if (token !== undefined && token !== null) {
  AppAxios.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export default AppAxios;

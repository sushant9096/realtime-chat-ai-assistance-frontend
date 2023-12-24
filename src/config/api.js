import axios from "axios";

let api_url = process.env.NODE_ENV === "production" ? "https://www.chatapp.sushant9096.me/" : "http://localhost:3000/"

const instance = axios.create({
  baseURL: api_url
});

export default instance;
export {api_url};
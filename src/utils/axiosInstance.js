import axios from "axios";

export const instance = axios.create({
  baseURL: "https://api.spotify.com/v1/",
  headers: {'Accept': 'application/json'}
});

export const SetAuthToken = (token) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
  } else {
    delete instance.defaults.headers.common['Authorization'];
  }
};
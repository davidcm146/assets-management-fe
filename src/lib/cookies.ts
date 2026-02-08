import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY;

export const setAccessToken = (token: string) => {
  Cookies.set(ACCESS_TOKEN_KEY, token, {
    expires: 1,
    secure: true,
    sameSite: "strict",
  });
};

export const getAccessToken = () => {
  return Cookies.get(ACCESS_TOKEN_KEY);
};

export const removeAccessToken = () => {
  Cookies.remove(ACCESS_TOKEN_KEY);
};

import Cookies from "js-cookie";

export const setCookies = (key : string, value: string) => {
    Cookies.set(key, value);
};

export const getCookies = (key : string): string | undefined => {
    return Cookies.get(key);
};

export const removeCookies = (key : string) => {
    Cookies.remove(key);
};
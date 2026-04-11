import Cookies from "js-cookie";

export const setAuthToken = (token: string) => {
    Cookies.set("session_token", token, { expires: 7 });
};

export const getAuthToken = (): string | undefined => {
    return Cookies.get("session_token");
};

export const removeAuthToken = () => {
    Cookies.remove("session_token");
};
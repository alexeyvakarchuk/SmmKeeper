import Cookies from "js-cookie";

// We set cookies always from the browser. They expire after a day.
// It's important to specify the path to avoid unexpected behavior.
export const setCookie = (key, value) => {
  if (process.browser) {
    Cookies.set(key, value, { expires: 365, path: "/" });
  }
};

export const removeCookie = key => {
  if (process.browser) {
    Cookies.remove(key);
  }
};

const getCookieFromBrowser = key => Cookies.get(key);

const getCookieFromServer = (key, req) => {
  if (!req.headers.cookie) {
    return undefined;
  }
  const rawCookie = req.headers.cookie
    .split(";")
    .find(c => c.trim().startsWith(`${key}=`));
  if (!rawCookie) {
    return undefined;
  }
  return rawCookie.split("=")[1];
};

// We retrieve cookies from the browser or the server.
export const getCookie = (key, req) =>
  process.browser ? getCookieFromBrowser(key) : getCookieFromServer(key, req);

// import { push } from "react-router-redux";
import axios from "axios";
import { signInSuccess } from "ducks/auth";
import { baseURL } from "config";
import redirect from "server/redirect";
import { getCookie } from "server/libs/cookies";

export const fetchUserAuth = async (store, token) => {
  if (token) {
    try {
      const { data } = await axios({
        method: "get",
        url: "/api/check-token",
        baseURL,
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });

      store.dispatch(signInSuccess(data));

      return true;
    } catch (error) {
      return false;
    }
  } else {
    return false;
  }
};

export const redirectIfAuthentificated = async ctx => {
  const { store, req } = ctx;

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("tktoken")
      : getCookie("tktoken", req);

  if (typeof window === "undefined") {
    const auth = await fetchUserAuth(store, token);

    if (auth) {
      if (store.getState().auth.user.isAdmin === true) {
        redirect("/admin", ctx);
      } else {
        redirect("/app", ctx);
      }
    }
  } else {
    if (!store.getState().auth.user) {
      const auth = await fetchUserAuth(store, token);

      if (auth) {
        if (store.getState().auth.user.isAdmin === true) {
          redirect("/admin");
        } else {
          redirect("/app");
        }
      }
    }
  }
};

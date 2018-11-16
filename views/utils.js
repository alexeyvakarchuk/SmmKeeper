import { push } from "react-router-redux";
import axios from "axios";
import store from "store";
import { signInSuccess } from "ducks/auth";

export const fetchUserAuth = async () => {
  const token = await localStorage.getItem("tktoken");

  if (token) {
    try {
      const { data } = await axios({
        method: "get",
        url: "/api/check-token",
        headers: {
          "Content-Type": "application/json",
          Authorization: token
        }
      });

      store.dispatch(signInSuccess(data));

      return true;
    } catch (error) {
      // console.log(error);
      // localStorage.removeItem("tktoken");

      return false;
    }
  } else {
    return false;
  }
};

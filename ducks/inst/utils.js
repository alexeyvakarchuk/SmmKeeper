// @flow

import redirect from "server/redirect";
import type { Acc } from "ducks/inst/types";

export const redirectIfInvalidUsername = (
  accList: Acc[],
  queryUsername: string,
  ctx?: Object
) => {
  if (accList.length) {
    // Redirects if /app or /app/some-fake-username
    if (!queryUsername || !accList.find(el => el.username === queryUsername)) {
      // console.log("redirect to ", `/app/${accList[0].username}`);
      redirect(`/app/${accList[0].username}`, ctx);
    }
  } else {
    if (queryUsername) {
      redirect(`/app`, ctx);
    }
  }
};

export const delay = (delay: number): Promise<any> =>
  new Promise(res => {
    setTimeout(res, delay * 1000);
  });

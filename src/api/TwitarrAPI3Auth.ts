import { APICreateAPIMethod, APIUser } from "./TwitarrAPI3";
import TwitarrAPI3Module from "./TwitarrAPI3Module";

export default class TwitarrAPI3Auth extends TwitarrAPI3Module {
  private setUser: (user: APIUser | undefined) => void;

  constructor(
    createAPIMethod: APICreateAPIMethod,
    setUser: (user: APIUser | undefined) => void,
  ) {
    super(createAPIMethod);
    this.setUser = setUser;
  }

  // Log a user in, given a username and password
  logIn = this.createAPIMethod<
    {
      username: string;
      password: string;
    },
    {
      token: string;
      userID: string;
    }
  >({
    path: "auth/login",
    requestInit: ({ username, password }) => ({
      method: "POST",
      headers: {
        Authorization: "Basic " + btoa(username + ":" + password),
        "Content-Type": "application/json",
      },
    }),
    processSuccess: (result) => {
      this.setUser({ token: result.data.token, userID: result.data.userID });
    },
  });

  // Log a user out
  logOut = this.createAPIMethod<
    void,
    {
      token: string;
      userID: string;
    }
  >({
    path: "auth/logout",
    requiresAuth: true,
    requestInit: {
      method: "POST",
    },
    processSuccess: (result) => {
      this.setUser(undefined);
    },
    processFailure: (result) => {
      this.setUser(undefined);
    },
  });
}

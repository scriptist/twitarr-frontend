import { getCookie, removeCookie, setCookie } from "typescript-cookie";

// https://github.com/challfry/swiftarr/wiki/API-Documentation

class TwittarrAPI3 {
  readonly apiRoot: string = "https://swiftarr.herokuapp.com/api/v3";
  private readonly cookieName: string = "twitarr-session";

  private authChangeHandler: APIAuthChangeHandler | undefined;
  private user: APIUser | undefined;

  constructor() {
    // Load session information from cookie
    try {
      const cookie = getCookie(this.cookieName);
      if (cookie == null) {
        return;
      }

      const { token, userID } = JSON.parse(cookie);
      if (typeof token === "string" && typeof userID === "string") {
        this.user = { token, userID };
      }
    } catch {
      // Invalid cookie - wipe it
      removeCookie(this.cookieName);
    }
  }

  setAuthChangeHandler(authChangeHandler: APIAuthChangeHandler | undefined) {
    this.authChangeHandler = authChangeHandler;

    if (this.authChangeHandler != null) {
      this.authChangeHandler(this.user);
    }
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

  // Twarrts
  getTwarrts = this.createAPIMethod<
    {
      search?: string;
      hashtag?: string;
      mentions?: string;
      mentionSelf?: string;
      byUser?: string;
      byUsername?: string;
      bookmarked?: boolean;
      inBarrel?: string;
      replyGroup?: string;
      likeType?: string;

      after?: string;
      before?: string;
      afterDate?: number;
      beforeDate?: number;
      from?: string;

      start?: number;
      limit?: number;
    } | void,
    APITwarrt[]
  >({
    path: "twitarr",
    requiresAuth: true,
  });

  private setUser(user: APIUser | undefined) {
    this.user = user;

    if (this.authChangeHandler != null) {
      this.authChangeHandler(this.user);
    }

    if (user != null) {
      setCookie(this.cookieName, JSON.stringify(this.user), { expires: 7 });
    } else {
      removeCookie(this.cookieName);
    }
  }

  // Internal helper used to create API methods
  private createAPIMethod<TParams, TResponseData>(config: {
    path: string | ((params: TParams) => string);
    requiresAuth?: boolean;
    requestInit?: RequestInit | ((params: TParams) => RequestInit);
    processSuccess?: (result: APIResultSuccess<TResponseData>) => void;
    processFailure?: (result: APIResultError) => void;
  }): APIMethod<TParams, TResponseData> {
    return async (params: TParams) => {
      // Get request info
      const path =
        typeof config.path === "function" ? config.path(params) : config.path;
      let requestInit =
        typeof config.requestInit === "function"
          ? config.requestInit(params)
          : config.requestInit ?? {};

      // Add Authorization header if required
      if (config.requiresAuth) {
        if (this.user == null) {
          // No auth, so let's save time and pretend we got a 401
          return {
            success: false,
            status: 401,
            text: "Unauthorized",
          };
        }

        requestInit = {
          headers: {
            Authorization: "Bearer " + this.user.token,
            ...requestInit.headers,
          },
          ...requestInit,
        };
      }

      // Make request
      const result = await this.makeRequest<TResponseData>(
        `${this.apiRoot}/${path}`,
        requestInit,
      );

      try {
        if (result.success) {
          if (config.processSuccess != null) {
            config.processSuccess(result);
          }
        } else {
          if (config.processFailure != null) {
            config.processFailure(result);
          }
        }
      } catch (e) {
        return {
          success: false,
          status: -2,
          text: e instanceof Error ? e.message : "Unknown error",
        };
      }

      return result;
    };
  }

  // Internal helper used to make requests to the API
  private async makeRequest<TResponseData>(
    input: RequestInfo,
    init: RequestInit,
  ): Promise<APIResult<TResponseData>> {
    try {
      const response = await fetch(input, init);

      if (response.ok) {
        const data: TResponseData = await response.json();
        return { data, success: true };
      } else {
        return {
          success: false,
          status: response.status,
          text: response.statusText,
        };
      }
    } catch (e) {
      return {
        success: false,
        status: -1,
        text: e instanceof Error ? e.message : "Unknown error",
      };
    }
  }
}

// Types

export type APIUser = { token: string; userID: string };

type APIAuthChangeHandler = (user: APIUser | undefined) => void;

export type APIResult<TResponseData> =
  | APIResultSuccess<TResponseData>
  | APIResultError;

export interface APIResultSuccess<TResponseData> {
  data: TResponseData;
  success: true;
}

export interface APIResultError {
  success: false;
  status: number;
  text: string;
}

type APIMethod<TParams, TResponseData> = (
  params: TParams,
) => Promise<APIResult<TResponseData>>;

export interface APITwarrt {
  author: APIAuthor;
  createdAt: string;
  images: string[];
  isBookmarked: boolean;
  likeCount: number;
  text: string;
  twarrtID: number;
}

export interface APIAuthor {
  displayName: string;
  username: string;
  userID: string;
}

export default new TwittarrAPI3();

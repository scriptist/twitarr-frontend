import { getCookie, removeCookie, setCookie } from "typescript-cookie";
import TwitarrAPI3Auth from "./TwitarrAPI3Auth";
import TwitarrAPI3Events from "./TwitarrAPI3Events";
import TwitarrAPI3Forum from "./TwitarrAPI3Forum";
import TwitarrAPI3Twarrts from "./TwitarrAPI3Twarrts";

// https://github.com/challfry/swiftarr/wiki/API-Documentation

class TwittarrAPI3 {
  readonly apiRoot: string = "https://swiftarr.herokuapp.com/api/v3";
  private readonly cookieName: string = "twitarr-session";

  private authChangeHandler: APIAuthChangeHandler | undefined;
  user: APIUser | undefined;

  // Modules
  auth: TwitarrAPI3Auth;
  forum: TwitarrAPI3Forum;
  twarrts: TwitarrAPI3Twarrts;
  events: TwitarrAPI3Events;

  constructor() {
    // Init modules
    this.createAPIMethod = this.createAPIMethod.bind(this);
    this.setUser = this.setUser.bind(this);

    this.auth = new TwitarrAPI3Auth(this.createAPIMethod, this.setUser);
    this.forum = new TwitarrAPI3Forum(this.createAPIMethod);
    this.twarrts = new TwitarrAPI3Twarrts(this.createAPIMethod);
    this.events = new TwitarrAPI3Events(this.createAPIMethod);

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

  private setUser(user: APIUser | undefined): void {
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

  private createAPIMethod<TParams, TResponseData>(
    config: CreateAPIMethodConfig<TParams, TResponseData>,
  ): APIMethod<TParams, TResponseData> {
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
          ...requestInit,
          headers: {
            Authorization: "Bearer " + this.user.token,
            ...requestInit.headers,
          },
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

export interface APITwarrt {
  author: APIUserHeader;
  createdAt: string;
  images: string[];
  isBookmarked: boolean;
  likeCount: number;
  text: string;
  twarrtID: number;
}

export interface APIUserHeader {
  displayName: string;
  username: string;
  userID: string;
  userImage: string | void;
}

export interface APICategory {
  categoryID: string;
  isRestricted: true;
  numThreads: number;
  purpose: string;
  title: string;
}

export interface APICategoryData {
  categoryID: string;
  title: string;
  isRestricted: boolean;
  numThreads: number;
  forumThreads: APIForumListData[];
}

export interface APIForumListData {
  forumID: string;
  creator: APIUserHeader;
  title: string;
  postCount: number;
  readCount: number;
  createdAt: string;
  lastPoster: APIUserHeader | void;
  lastPostAt: string;
  isLocked: boolean;
  isFavorite: boolean;
}

/**
 * Interface that defines a method signature for creating
 *
 * @template TParams
 * @template TResponseData
 */
export interface APICreateAPIMethod {
  <TParams, TResponseData>(
    config: CreateAPIMethodConfig<TParams, TResponseData>,
  ): APIMethod<TParams, TResponseData>;
}

type CreateAPIMethodConfig<TParams, TResponseData> = {
  path: string | ((params: TParams) => string);
  requiresAuth?: boolean;
  requestInit?: RequestInit | ((params: TParams) => RequestInit);
  processSuccess?: (result: APIResultSuccess<TResponseData>) => void;
  processFailure?: (result: APIResultError) => void;
};

type APIMethod<TParams, TResponseData> = (
  params: TParams,
) => Promise<APIResult<TResponseData>>;

export default new TwittarrAPI3();

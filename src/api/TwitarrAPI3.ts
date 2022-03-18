import { getCookie, removeCookie, setCookie } from "typescript-cookie";

class TwittarrAPI3 {
  readonly apiRoot: string = "https://swiftarr.herokuapp.com/api/v3";
  readonly cookieName: string = "twitarr-session";

  user: APIUser | undefined;

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
      this.user = { token: result.data.token, userID: result.data.userID };
      setCookie(this.cookieName, JSON.stringify(this.user), { expires: 7 });
    },
  });

  // Internal helper used to create API methods
  private createAPIMethod<TParams, TResponseData>(config: {
    path: string | ((params: TParams) => string);
    requestInit: (params: TParams) => RequestInit;
    processSuccess?: (result: APIResultSuccess<TResponseData>) => void;
  }): APIMethod<TParams, TResponseData> {
    return async (params: TParams) => {
      const path =
        typeof config.path === "string" ? config.path : config.path(params);
      const requestInit = config.requestInit(params);

      const result = await this.makeRequest<TResponseData>(
        `${this.apiRoot}/${path}`,
        requestInit,
      );

      if (
        typeof config.processSuccess === "function" &&
        result.success === true
      ) {
        try {
          config.processSuccess(result);
        } catch (e) {
          return {
            success: false,
            status: -2,
            text: e instanceof Error ? e.message : "Unknown error",
          };
        }
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

type APIUser = { token: string; userID: string };

type APIResult<TResponseData> =
  | APIResultSuccess<TResponseData>
  | APIResultError;

interface APIResultSuccess<TResponseData> {
  data: TResponseData;
  success: true;
}

interface APIResultError {
  success: false;
  status: number;
  text: string;
}

type APIMethod<TParams, TResponseData> = (
  params: TParams,
) => Promise<APIResult<TResponseData>>;

export default new TwittarrAPI3();

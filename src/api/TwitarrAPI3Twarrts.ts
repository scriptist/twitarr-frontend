import { APITwarrt } from "./TwitarrAPI3";
import TwitarrAPI3Module from "./TwitarrAPI3Module";
import queryStringEncode from "query-string-encode";

export default class TwitarrAPI3Twarrts extends TwitarrAPI3Module {
  // Twarrts
  getTwarrts = this.createAPIMethod<
    {
      search?: string | null;
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
    path: (params) => `twitarr?${queryStringEncode(params)}`,
    requiresAuth: true,
  });

  // Post a new Twarrt
  createTwarrt = this.createAPIMethod<
    {
      text: string;
      images: [];
      postAsModerator: boolean;
      postAsTwitarrTeam: boolean;
    },
    APITwarrt
  >({
    path: "twitarr/create",
    requiresAuth: true,
    requestInit: (params) => ({
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(params),
    }),
  });
}

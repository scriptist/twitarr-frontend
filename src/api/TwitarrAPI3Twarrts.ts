import { APITwarrt } from "./TwitarrAPI3";
import TwitarrAPI3Module from "./TwitarrAPI3Module";

export default class TwitarrAPI3Twarrts extends TwitarrAPI3Module {
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
}

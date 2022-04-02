import { APICategory, APICategoryData } from "./TwitarrAPI3";
import TwitarrAPI3Module from "./TwitarrAPI3Module";
import queryStringEncode from "query-string-encode";

export default class TwitarrAPI3Forum extends TwitarrAPI3Module {
  // Categories
  getCategories = this.createAPIMethod<
    {
      cat?: string;
    } | void,
    APICategory[]
  >({
    path: (params) => `forum/categories?${queryStringEncode(params)}`,
    requiresAuth: true,
  });

  // Category data & forums
  getCategoryData = this.createAPIMethod<
    {
      categoryID: string;
      sort?: "create" | "update" | "title";
      start?: number;
      limit?: number;
      afterdate?: number;
      beforedate?: number;
    },
    APICategoryData
  >({
    path: ({ categoryID, ...params }) =>
      `forum/categories/${categoryID}?${queryStringEncode(params)}`,
    requiresAuth: true,
  });
}

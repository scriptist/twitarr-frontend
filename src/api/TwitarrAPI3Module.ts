import { APICreateAPIMethod } from "./TwitarrAPI3";

export default class TwitarrAPI3Module {
  protected createAPIMethod: APICreateAPIMethod;

  constructor(createAPIMethod: APICreateAPIMethod) {
    this.createAPIMethod = createAPIMethod;
  }
}

import { APICreateAPIMethod } from "./TwitarrAPI3";

/**
 * Defines a base class for any new API modules. API modules are generally broken up by their behavior.
 *
 * TODO: rather than hard-coding one property for each of the modules in the TwitarrAPI3, come up with a way
 * to dynamically register a module maybe?
 */
export default class TwitarrAPI3Module {
  protected createAPIMethod: APICreateAPIMethod;

  constructor(createAPIMethod: APICreateAPIMethod) {
    this.createAPIMethod = createAPIMethod;
  }
}

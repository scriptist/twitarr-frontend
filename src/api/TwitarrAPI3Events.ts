import TwitarrAPI3Module from "./TwitarrAPI3Module";

export interface EventData {
  description: string;
  // Formatted in ISO 8601 format e.g. 2020-03-08T05:00:00.000Z
  endTime: string;
  eventID: string;
  // e.g. "Official", "Gaming", "Shadow Event", etc.
  eventType: string;
  forum: string;
  isFavorite: boolean;
  location: string;
  // Formatted in ISO 8601 format e.g. 2020-03-08T05:00:00.000Z
  startTime: string;
  title: string;
  uid: string;
}

export default class TwitarrAPI3Events extends TwitarrAPI3Module {
  getEvents = this.createAPIMethod<null, EventData[]>({
    path: "/events",
    requestInit: {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    },
  });
}

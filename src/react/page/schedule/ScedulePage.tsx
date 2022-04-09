import { useEffect, useState } from "react";
import { EventData } from "../../../api/TwitarrAPI3Events";
import TwitarrAPI3 from "../../../api/TwitarrAPI3";

interface Props {}

export default function SchedulePage(_: Props) {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    /**
     * TODO: attempted to allow for a method created by createAPIMethod to have
     * no params, but not familiar enough with all the typing going on yet.
     *
     * {@link TwitarrAPI3.createAPIMethod}
     */
    TwitarrAPI3.events.getEvents(null).then((result) => {
      if (result.success) {
        setEvents(result.data);
      }
    });
  }, []);

  return (
    <>
      {events.length > 0 &&
        events.map((e) => {
          return <div>{e.title}</div>;
        })}
    </>
  );
}

import { useEffect, useState } from "react";
import { EventData } from "../../../api/TwitarrAPI3Events";
import TwitarrAPI3 from "../../../api/TwitarrAPI3";

interface Props {}

export default function SchedulePage(_: Props) {
  const [events, setEvents] = useState<EventData[]>([]);

  useEffect(() => {
    TwitarrAPI3.events.getEvents().then((result) => {
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

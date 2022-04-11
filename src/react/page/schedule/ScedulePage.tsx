import { Box, Card, CardHeader, Container, Stack } from "@mui/material";
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
    <Container>
      <Stack spacing={2}>
        {events.length > 0 &&
          events.map((e) => {
            return <EventCard event={e} />;
          })}
      </Stack>
    </Container>
  );
}

interface EventCardProps {
  event: EventData;
}

export function EventCard(_props: EventCardProps) {
  return (
    <Card>
      <CardHeader
        subheader={_props.event.location}
        title={
          <>
            {_props.event.eventType === "Official" && (
              <Box
                component="img"
                src="logo192.png"
                sx={{
                  alt: "",
                  height: "auto",
                  maxWidth: "20px",
                }}
              />
            )}{" "}
            <span>{_props.event.title}</span>
          </>
        }
      />
    </Card>
  );
}

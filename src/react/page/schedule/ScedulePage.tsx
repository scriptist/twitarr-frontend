import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Container,
  Stack,
} from "@mui/material";
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
        subheader={<EventSubHeader event={_props.event} />}
        title={<EventTitle event={_props.event} />}
      />
      <CardContent>{_props.event.description}</CardContent>
    </Card>
  );
}

/**
 * Renders the CardHeader subheader element. The event's start time and date
 */
function EventSubHeader(_props: EventCardProps) {
  const startDate: Date = new Date(_props.event.startTime);
  const endDate: Date = new Date(_props.event.endTime);
  return (
    <>
      {_props.event.location}{" "}
      <Box sx={{ display: "inline", fontStyle: "italic" }}>
        {startDate.toLocaleDateString()} {startDate.toLocaleTimeString()} -{" "}
        {endDate.toLocaleTimeString()}
      </Box>
    </>
  );
}

/**
 * Renders the CardHeader 'title' element. THe title of the event and the logo if it's an official event.
 */
function EventTitle(_props: EventCardProps) {
  return (
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
  );
}

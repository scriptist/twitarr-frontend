import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Collapse,
  Container,
  IconButton,
  IconButtonProps,
  Stack,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { EventData } from "../../../api/TwitarrAPI3Events";
import { ExpandMore } from "@mui/icons-material";
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
            return <EventCard event={e} key={e.eventID} />;
          })}
      </Stack>
    </Container>
  );
}

interface EventCardProps {
  event: EventData;
}

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const StyledExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  console.log(expand, other);
  return <IconButton {...other} />;
})(({ theme, expand }) => {
  console.log(expand);
  return {
    transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  };
});

export function EventCard(_props: EventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up("sm"));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader
        subheader={<EventSubHeader {..._props} />}
        title={<EventTitle {..._props} />}
      />
      {!sm && (
        <CardActions disableSpacing>
          <StyledExpandMore expand={sm || expanded} onClick={handleExpandClick}>
            <ExpandMore />
          </StyledExpandMore>
        </CardActions>
      )}
      <Collapse in={sm || expanded}>
        <CardContent>{_props.event.description}</CardContent>
      </Collapse>
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

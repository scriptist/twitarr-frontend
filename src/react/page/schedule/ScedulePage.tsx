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
  Typography,
  styled,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { PropsWithChildren, useEffect, useState } from "react";
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

interface StyledTextProps extends PropsWithChildren<any> {
  expand: boolean;
}

const StyledExpandMore = styled(({ expand, ...other }: ExpandMoreProps) => {
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? "rotate(0deg)" : "rotate(180deg)",
  marginLeft: "auto",
  transition: theme.transitions.create("transform", {
    duration: theme.transitions.duration.shortest,
  }),
}));

const StyledText = styled(({ children, expand, ...other }: StyledTextProps) => {
  return <Typography {...other}>{children}</Typography>;
})(({ theme, expand }) => ({
  opacity: expand ? 0 : 1,
  transition: theme.transitions.create("opacity", {
    duration: theme.transitions.duration.shortest,
  }),
}));

export function EventCard({ event, ..._props }: EventCardProps) {
  const [expanded, setExpanded] = useState(false);
  const theme = useTheme();
  const medMedia = useMediaQuery(theme.breakpoints.up("md"));

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader
        subheader={<EventSubHeader event={event} {..._props} />}
        title={<EventTitle event={event} {..._props} />}
      />
      {!medMedia && (
        <CardActions>
          <StyledText expand={medMedia || expanded} noWrap>
            {event.description}
          </StyledText>
          <StyledExpandMore
            expand={medMedia || expanded}
            onClick={handleExpandClick}
          >
            <ExpandMore />
          </StyledExpandMore>
        </CardActions>
      )}
      <Collapse in={medMedia || expanded}>
        <CardContent>{event.description}</CardContent>
      </Collapse>
    </Card>
  );
}

/**
 * Renders the CardHeader subheader element. The event's start time and date
 */
function EventSubHeader({ event }: EventCardProps) {
  const startDate: Date = new Date(event.startTime);
  const endDate: Date = new Date(event.endTime);
  return (
    <>
      {event.location}{" "}
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
function EventTitle({ event }: EventCardProps) {
  return (
    <>
      {event.eventType === "Official" && (
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
      <span>{event.title}</span>
    </>
  );
}

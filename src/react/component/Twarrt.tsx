import { Box, Card, Link as MUILink, Stack } from "@mui/material";
import { APITwarrt } from "../../api/TwitarrAPI3";
import HighlightedText from "./HighlightedText";
import { Link } from "react-router-dom";
import ProfileImage from "./ProfileImage";
import { relativeTime } from "../../utils/TimeUtils";

interface Props {
  searchText?: string | null;
  twarrt: APITwarrt;
}

export default function Twarrt({ searchText, twarrt }: Props) {
  const now = new Date();

  return (
    <Card sx={{ p: 2 }}>
      <Stack direction="row" spacing={2}>
        <Link to={`/user/${twarrt.author.userID}`}>
          <ProfileImage
            displayName={twarrt.author.displayName}
            userID={twarrt.author.userID}
          />
        </Link>
        <Box sx={{ flexGrow: 1 }}>
          <Stack direction="row" sx={{ justifyContent: "space-between" }}>
            <MUILink
              component={Link}
              to={`/user/${twarrt.author.userID}`}
              underline="hover"
            >
              <strong>{twarrt.author.displayName}</strong> @
              {twarrt.author.username}
            </MUILink>
            {relativeTime(new Date(twarrt.createdAt), now)}
          </Stack>
          <Box sx={{ typography: "body1" }}>
            <HighlightedText searchText={searchText} text={twarrt.text} />
          </Box>
        </Box>
      </Stack>
    </Card>
  );
}

import { Box } from "@mui/material";
import TwitarrAPI3 from "../../api/TwitarrAPI3";

interface Props {
  displayName: string;
  userID: string;
}

export default function ProfileImage({ displayName, userID }: Props) {
  return (
    <Box
      alt={displayName}
      component="img"
      src={`${TwitarrAPI3.apiRoot}/image/user/identicon/${userID}`}
      sx={{
        height: 40,
        width: 40,
      }}
    />
  );
}

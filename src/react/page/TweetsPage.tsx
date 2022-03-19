import { Container, Stack } from "@mui/material";
import TwitarrAPI3, { APITwarrt } from "../../api/TwitarrAPI3";
import { useEffect, useState } from "react";
import Twarrt from "../component/Twarrt";

interface Props {}

export default function TweetsPage(_: Props) {
  const [twarrts, setTwarrts] = useState<APITwarrt[] | undefined>();

  useEffect(() => {
    (async () => {
      const result = await TwitarrAPI3.getTwarrts();
      if (result.success) {
        setTwarrts(result.data);
      } else {
        alert("Could not load tweets");
      }
    })();
  }, []);

  if (twarrts == null) {
    return <>Loading...</>;
  }

  return (
    <Container maxWidth="sm">
      <Stack spacing={2} sx={{ my: 3 }}>
        {twarrts.map((twarrt) => (
          <Twarrt key={twarrt.twarrtID} twarrt={twarrt} />
        ))}
      </Stack>
    </Container>
  );
}

// Twarrt

import { Container, Stack } from "@mui/material";
import TwitarrAPI3, { APIResultError, APITwarrt } from "../../api/TwitarrAPI3";
import { useEffect, useState } from "react";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";
import Twarrt from "../component/Twarrt";

interface Props {}

export default function TweetsPage(_: Props) {
  const [twarrts, setTwarrts] = useState<APITwarrt[] | undefined>();
  const [error, setError] = useState<APIResultError | undefined>();

  useEffect(() => {
    (async () => {
      const result = await TwitarrAPI3.getTwarrts();
      if (result.success) {
        setTwarrts(result.data);
      } else {
        setError(result);
      }
    })();
  }, []);

  if (error != null) {
    return <ErrorPage error={error} />;
  }

  if (twarrts == null) {
    return <LoadingPage />;
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

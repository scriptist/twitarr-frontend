import { Container, Fab, Stack } from "@mui/material";
import TwitarrAPI3, {
  APIResultError,
  APITwarrt,
} from "../../../api/TwitarrAPI3";
import { useEffect, useState } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import ErrorPage from "../ErrorPage";
import { Link } from "react-router-dom";
import LoadingPage from "../LoadingPage";
import Twarrt from "../../component/Twarrt";

interface Props {}

export default function TwarrtsPage(_: Props) {
  const [twarrts, setTwarrts] = useState<APITwarrt[] | undefined>();
  const [error, setError] = useState<APIResultError | undefined>();

  useEffect(() => {
    (async () => {
      const result = await TwitarrAPI3.twarrts.getTwarrts();
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
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Fab
        aria-label="add"
        color="primary"
        component={Link}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        to="/tweets/compose"
      >
        <AddIcon />
      </Fab>
      <Stack spacing={1}>
        {twarrts.map((twarrt) => (
          <Twarrt key={twarrt.twarrtID} twarrt={twarrt} />
        ))}
      </Stack>
    </Container>
  );
}

// Twarrt

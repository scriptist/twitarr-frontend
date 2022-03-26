import { Button, Card, Container, Stack, TextField } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import TwitarrAPI3 from "../../../api/TwitarrAPI3";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {}

export default function TwarrtsComposePage(_: Props) {
  const [text, setText] = useState("");
  const [waiting, setWaiting] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setWaiting(true);
          const result = await TwitarrAPI3.twarrts.createTwarrt({
            text,
            images: [],
            postAsModerator: false,
            postAsTwitarrTeam: false,
          });

          if (result.success) {
            navigate("/tweets");
          } else {
            setError(result.text);
            setWaiting(false);
          }
        }}
      >
        <Card sx={{ p: 2 }}>
          <TextField
            error={error != null}
            helperText={error}
            id="outlined-multiline-flexible"
            label="Compose twarrt"
            minRows={2}
            multiline
            onChange={(e) => setText(e.target.value)}
            sx={{ width: "100%" }}
            value={text}
          />

          <Stack direction="row" justifyContent="space-between" sx={{ pt: 3 }}>
            <LoadingButton
              disabled={waiting}
              loading={waiting}
              size="large"
              type="submit"
              variant="contained"
            >
              Post
            </LoadingButton>
            <Button
              disabled={waiting}
              onClick={() => navigate(-1)}
              size="large"
            >
              Cancel
            </Button>
          </Stack>
        </Card>
      </form>
    </Container>
  );
}

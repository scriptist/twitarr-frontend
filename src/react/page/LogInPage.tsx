import {
  Box,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import LinkButton from "../component/LinkButton";
import { LoadingButton } from "@mui/lab";
import TwitarrAPI3 from "../../api/TwitarrAPI3";
import { useState } from "react";

interface Props {}

export default function LogInPage(_: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();

  const { state } = useLocation();
  const redirectTo: string = isStateWithRedirect(state)
    ? state.redirectTo
    : "/tweets";

  return (
    <Grid
      alignItems="center"
      container
      justifyContent="center"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <Box sx={{ m: 1, width: 400 }}>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setWaiting(true);
            const result = await TwitarrAPI3.logIn({ username, password });

            if (result.success) {
              navigate(redirectTo);
            } else {
              setError(true);
              setWaiting(false);
            }
          }}
        >
          <Card variant="outlined">
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography component="h2" variant="h1">
                Log in to Twitarr
              </Typography>
              <TextField
                label="Username"
                margin="normal"
                onChange={(e) => setUsername(e.target.value)}
                required
                type="text"
                value={username}
              />
              <TextField
                error={error}
                helperText={error ? "Invalid username or password" : null}
                label="Password"
                margin="normal"
                onChange={(e) => setPassword(e.target.value)}
                required
                type="password"
                value={password}
              />
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between", p: 2, pt: 0 }}>
              <LoadingButton
                disabled={waiting}
                loading={waiting}
                size="large"
                type="submit"
                variant="contained"
              >
                Log in
              </LoadingButton>
              <LinkButton disabled={waiting} size="large" to="/register">
                Create Account
              </LinkButton>
            </CardActions>
          </Card>
        </form>
      </Box>
    </Grid>
  );
}

// Helpers

type StateWithRedirect = { redirectTo: "string" };

function isStateWithRedirect(state: unknown): state is StateWithRedirect {
  return (
    state != null && typeof (state as StateWithRedirect).redirectTo === "string"
  );
}

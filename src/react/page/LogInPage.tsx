import {
  Box,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import LinkButton from "../component/LinkButton";
import { LoadingButton } from "@mui/lab";
import TwitarrAPI3 from "../../api/TwitarrAPI3";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface Props {}

export default function LogInPage(_: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();

  return (
    <Grid
      container
      alignItems="center"
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
              navigate("/tweets");
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
              <Typography variant="h1" component="h2">
                Log in to Twitarr
              </Typography>
              <TextField
                type="text"
                label="Username"
                margin="normal"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                type="password"
                label="Password"
                margin="normal"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                helperText={error ? "Invalid username or password" : null}
              />
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between", p: 2, pt: 0 }}>
              <LoadingButton
                disabled={waiting}
                loading={waiting}
                type="submit"
                size="large"
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

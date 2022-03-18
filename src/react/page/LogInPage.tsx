import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import LinkButton from "../component/LinkButton";

interface Props {}

export default function LogInPage(_: Props) {
  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <Box sx={{ width: 400 }}>
        <form>
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
              />
              <TextField
                type="password"
                label="Password"
                margin="normal"
                required
              />
            </CardContent>
            <CardActions sx={{ justifyContent: "space-between", p: 2, pt: 0 }}>
              <Button variant="contained" size="large">
                Log in
              </Button>
              <LinkButton size="large" to="/register">
                Create Account
              </LinkButton>
            </CardActions>
          </Card>
        </form>
      </Box>
    </Grid>
  );
}

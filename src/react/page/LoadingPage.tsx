import { CircularProgress, Grid } from "@mui/material";

interface Props {}

export default function LoadingPage(_: Props) {
  return (
    <Grid
      alignItems="center"
      container
      justifyContent="center"
      style={{ minHeight: "calc(100vh - 64px)" }}
    >
      <CircularProgress />
    </Grid>
  );
}

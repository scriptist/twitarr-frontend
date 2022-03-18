import { Button, ButtonProps } from "@mui/material";
import { Link } from "react-router-dom";

interface Props extends ButtonProps<typeof Link> {
  to: string;
}

export default function LinkButton(props: Props) {
  return <Button component={Link} {...props} />;
}

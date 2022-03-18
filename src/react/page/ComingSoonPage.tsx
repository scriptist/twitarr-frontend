import { useLocation } from "react-router-dom";

interface Props {}

export default function ComingSoonPage(_: Props) {
  const { pathname } = useLocation();

  return <div>Coming Soon: {pathname}</div>;
}

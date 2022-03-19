import { Navigate, useLocation } from "react-router-dom";
import { useIsLoggedIn } from "../../recoil/APIAuthHooks";

interface Props {
  children: React.ReactNode;
}

export default function AuthGate({ children }: Props) {
  const isLoggedIn = useIsLoggedIn();
  const { pathname, search, hash } = useLocation();

  if (!isLoggedIn) {
    return (
      <Navigate
        replace
        state={{ redirectTo: `${pathname}${search}${hash}` }}
        to={{
          pathname: "/login",
        }}
      />
    );
  }

  return <>{children}</>;
}

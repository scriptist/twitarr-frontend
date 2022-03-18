import TwitarrAPI3 from "../api/TwitarrAPI3";
import { useLayoutEffect } from "react";
import { useSetUser } from "../recoil/APIAuthHooks";

interface Props {}

export default function APIAuthStateMaintainer(_: Props) {
  const setUser = useSetUser();

  useLayoutEffect(() => {
    TwitarrAPI3.setAuthChangeHandler(setUser);

    return () => TwitarrAPI3.setAuthChangeHandler(undefined);
  }, [setUser]);

  return null;
}

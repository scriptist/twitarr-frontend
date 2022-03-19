import TwittarrAPI3, { APIUser } from "../api/TwitarrAPI3";
import { atom, useRecoilValue, useSetRecoilState } from "recoil";

const auth = atom<APIUser | undefined>({
  key: "APIUser",
  default: TwittarrAPI3.user,
});

export function useUser(): APIUser | undefined {
  return useRecoilValue(auth);
}

export function useSetUser(): (user: APIUser | undefined) => void {
  return useSetRecoilState(auth);
}

export function useIsLoggedIn(): boolean {
  return useUser() != null;
}

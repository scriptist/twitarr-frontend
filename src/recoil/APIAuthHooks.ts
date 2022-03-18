import { atom, useRecoilValue, useSetRecoilState } from "recoil";
import type { APIUser } from "../api/TwitarrAPI3";

const auth = atom<APIUser | undefined>({
  key: "APIUser",
  default: undefined,
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

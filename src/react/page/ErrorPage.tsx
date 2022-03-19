import { APIResultError } from "../../api/TwitarrAPI3";

interface Props {
  error: APIResultError;
}

export default function LoadingPage({ error }: Props) {
  return <div>Something has gone wrong: {JSON.stringify(error)}</div>;
}

import React from "react";
import { Typography } from "@mui/material";

interface Props {
  searchText?: string | null;
  text: string;
}

export default function HighlightedText({ text, searchText }: Props) {
  if (searchText == null) {
    return <>{text}</>;
  }

  const matches = text.matchAll(new RegExp(searchText, "gi"));

  const result = [];
  let cursor = 0;

  for (const match of matches) {
    if (match.index == null) {
      continue;
    }

    if (cursor !== match.index) {
      // Add text before match
      result.push(
        <React.Fragment key={cursor}>
          {text.substring(cursor, match.index)}
        </React.Fragment>,
      );
    }
    // Add text inside match
    result.push(
      <Typography
        component="span"
        key={match.index}
        sx={{ backgroundColor: "yellow" }}
      >
        {match[0]}
      </Typography>,
    );

    // Update cursor
    cursor = match.index + match[0].length;
  }
  // Add remaining text
  result.push(
    <React.Fragment key="last">{text.substring(cursor)}</React.Fragment>,
  );

  return <>{result}</>;
}

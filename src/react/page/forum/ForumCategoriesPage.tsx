import {
  Box,
  ButtonBase,
  ButtonGroup,
  Card,
  Container,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import TwitarrAPI3, {
  APICategory,
  APIResultError,
} from "../../../api/TwitarrAPI3";
import { useCallback, useEffect, useState } from "react";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";
import React from "react";

interface Props {}

export default function ForumCategoriesPage(_: Props) {
  const [categories, setCategories] = useState<APICategory[] | undefined>();
  const [error, setError] = useState<APIResultError | undefined>();
  const theme = useTheme();

  const [searchParams] = useSearchParams();
  const loadTwarrts = useCallback(async () => {
    setCategories(undefined);
    setError(undefined);

    const result = await TwitarrAPI3.forum.getCategories(
      Object.fromEntries(searchParams.entries()),
    );

    if (result.success) {
      setCategories(result.data);
    } else {
      setError(result);
    }
  }, [searchParams]);

  useEffect(() => {
    loadTwarrts();
  }, [loadTwarrts]);

  if (error != null) {
    return <ErrorPage error={error} />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      {/* TODO: Find */}
      <Stack spacing={1}>
        {categories == null ? (
          <LoadingPage />
        ) : categories.length === 0 ? (
          <Typography sx={{ pt: 4, textAlign: "center" }} variant="h2">
            No categories to display
          </Typography>
        ) : (
          <Card>
            <ButtonGroup orientation="vertical" sx={{ width: "100%" }}>
              {categories.map((category, i) => (
                <ButtonBase
                  component={Link}
                  key={category.categoryID}
                  sx={{
                    alignItems: "flex-start",
                    borderBottom:
                      i === categories.length - 1
                        ? null
                        : `1px solid ${theme.palette.divider}`,
                    justifyContent: "space-between",
                    p: 2,
                    "&:hover, &.Mui-focusVisible": {
                      background: theme.palette.grey["100"],
                    },
                  }}
                  to={`/forum/${category.categoryID}`}
                >
                  <Box>
                    <Typography variant="h4">{category.title}</Typography>
                    <Typography variant="body2">{category.purpose}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">
                      {category.numThreads} threads
                    </Typography>
                  </Box>
                </ButtonBase>
              ))}
            </ButtonGroup>
          </Card>
        )}
      </Stack>
    </Container>
  );
}

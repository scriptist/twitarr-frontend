import {
  Box,
  Breadcrumbs,
  ButtonBase,
  ButtonGroup,
  Card,
  Container,
  Link as MUILink,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Link, useParams } from "react-router-dom";
import TwitarrAPI3, {
  APICategoryData,
  APIResultError,
} from "../../../api/TwitarrAPI3";
import { useCallback, useEffect, useState } from "react";
import ErrorPage from "../ErrorPage";
import LoadingPage from "../LoadingPage";

interface Props {}

export default function ForumCategoryForumsPage(_: Props) {
  const { categoryId } = useParams();
  if (categoryId == null) {
    throw new Error("Shit's fucked");
  }

  const [categories, setCategories] = useState<APICategoryData | undefined>();
  const [error, setError] = useState<APIResultError | undefined>();
  const theme = useTheme();

  const loadTwarrts = useCallback(async () => {
    setCategories(undefined);
    setError(undefined);

    const result = await TwitarrAPI3.forum.getCategoryData({
      categoryID: categoryId,
    });

    if (result.success) {
      setCategories(result.data);
    } else {
      setError(result);
    }
  }, [categoryId]);

  useEffect(() => {
    loadTwarrts();
  }, [loadTwarrts]);

  if (error != null) {
    return <ErrorPage error={error} />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <MUILink color="inherit" component={Link} to="/forum" underline="hover">
          Forum
        </MUILink>
        <Typography color="text.primary">{categories?.title}</Typography>
      </Breadcrumbs>
      {/* TODO: New thread */}
      <Stack spacing={1}>
        {categories == null ? (
          <LoadingPage />
        ) : categories.forumThreads.length === 0 ? (
          <Typography sx={{ pt: 4, textAlign: "center" }} variant="h2">
            No categories to display
          </Typography>
        ) : (
          <Card>
            <ButtonGroup orientation="vertical" sx={{ width: "100%" }}>
              {categories.forumThreads.map((forumThread, i) => (
                <ButtonBase
                  component={Link}
                  key={forumThread.forumID}
                  sx={{
                    alignItems: "flex-start",
                    borderBottom:
                      i === categories.forumThreads.length - 1
                        ? null
                        : `1px solid ${theme.palette.divider}`,
                    justifyContent: "space-between",
                    p: 2,
                    "&:hover, &.Mui-focusVisible": {
                      background: theme.palette.grey["100"],
                    },
                  }}
                  to={`/forum/post/${forumThread.forumID}`}
                >
                  <Box>
                    <Typography variant="h4">{forumThread.title}</Typography>
                    <Typography variant="body2">
                      {forumThread.postCount} posts
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2">
                      By @{forumThread.creator.username}
                    </Typography>
                    <Typography variant="body2">
                      Last post: @{forumThread.lastPoster?.username}
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

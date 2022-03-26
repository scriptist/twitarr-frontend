import {
  Button,
  ButtonGroup,
  Container,
  Divider,
  Fab,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  Close as CloseIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { Link, useSearchParams } from "react-router-dom";
import TwitarrAPI3, {
  APIResultError,
  APITwarrt,
} from "../../../api/TwitarrAPI3";
import { useCallback, useEffect, useState } from "react";
import { Add as AddIcon } from "@mui/icons-material";
import ErrorPage from "../ErrorPage";
import { LoadingButton } from "@mui/lab";
import LoadingPage from "../LoadingPage";
import Twarrt from "../../component/Twarrt";
import { useUser } from "../../../recoil/APIAuthHooks";

interface Props {}

export default function TwarrtsPage(_: Props) {
  const [twarrts, setTwarrts] = useState<APITwarrt[] | undefined>();
  const [error, setError] = useState<APIResultError | undefined>();

  const [searchParams] = useSearchParams();
  const loadTwarrts = useCallback(async () => {
    const result = await TwitarrAPI3.twarrts.getTwarrts(
      Object.fromEntries(searchParams.entries()),
    );

    if (result.success) {
      setTwarrts(result.data);
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

  if (twarrts == null) {
    return <LoadingPage />;
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Fab
        aria-label="add"
        color="primary"
        component={Link}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
        }}
        to="/tweets/compose"
      >
        <AddIcon />
      </Fab>
      <Stack spacing={1}>
        <NavButtons loadTwarrts={loadTwarrts} searchParams={searchParams} />

        {twarrts.length === 0 ? (
          <Typography sx={{ pt: 4, textAlign: "center" }} variant="h2">
            No tweets to display
          </Typography>
        ) : (
          twarrts.map((twarrt) => (
            <Twarrt key={twarrt.twarrtID} twarrt={twarrt} />
          ))
        )}
      </Stack>
    </Container>
  );
}

// Helpers

interface NavButtonsProps {
  loadTwarrts: () => Promise<void>;
  searchParams: URLSearchParams;
}

function NavButtons({ loadTwarrts, searchParams }: NavButtonsProps) {
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [, setSearchParams] = useSearchParams();

  return (
    <Stack direction="row" justifyContent="space-between" spacing={1}>
      <NewerButton loadTwarrts={loadTwarrts} />
      {isSearchActive || searchParams.has("search") ? (
        <SearchForm
          onCancel={() => {
            setIsSearchActive(false);
            setSearchParams({});
          }}
          onSearch={(text) => {
            setSearchParams({ search: text });
          }}
        />
      ) : (
        <ButtonGroup
          aria-label="outlined button group"
          size="small"
          variant="outlined"
        >
          <Button onClick={() => setIsSearchActive(true)}>
            <SearchIcon fontSize="small" />
          </Button>
          <FilterButton />
        </ButtonGroup>
      )}
    </Stack>
  );
}

interface NewerButtonProps {
  loadTwarrts: () => Promise<void>;
}

function NewerButton({ loadTwarrts }: NewerButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <LoadingButton
      loading={isLoading}
      onClick={async () => {
        setIsLoading(true);
        await loadTwarrts();
        setIsLoading(false);
      }}
      size="small"
      variant="outlined"
    >
      Newer
    </LoadingButton>
  );
}

interface SearchFormProps {
  onSearch: (text: string) => void;
  onCancel: () => void;
}

function SearchForm({ onCancel, onSearch }: SearchFormProps) {
  const [text, setText] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();

        if (text !== "") {
          onSearch(text);
        }
      }}
    >
      <Stack direction="row" spacing={1}>
        <TextField
          onChange={(e) => setText(e.target.value)}
          placeholder="Search..."
          size="small"
          value={text}
        />
        <ButtonGroup aria-label="outlined button group" variant="outlined">
          <Button type="submit" variant="contained">
            Go
          </Button>
          <Button onClick={onCancel}>
            <CloseIcon />
          </Button>
        </ButtonGroup>
      </Stack>
    </form>
  );
}

interface FilterButtonProps {}

function FilterButton(_: FilterButtonProps) {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const closeMenu = () => setMenuAnchorEl(null);
  const user = useUser();
  const [searchParams, setSearchParams] = useSearchParams();

  if (user == null) {
    return null;
  }

  const Filters: [string, string, string][] = [
    ["Your tweets", "byUser", user.userID],
    ["Your mentions", "mentionSelf", "true"],
    ["Favorites", "bookmarked", "true"],
    ["Liked", "likeType", "all"],
  ];

  return (
    <>
      <Button
        endIcon={<KeyboardArrowDownIcon />}
        onClick={(event) => setMenuAnchorEl(event.currentTarget)}
      >
        Filter
      </Button>
      <Menu
        anchorEl={menuAnchorEl}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClose={closeMenu}
        open={menuAnchorEl != null}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem
          onClick={() => {
            closeMenu();
            setSearchParams({});
          }}
          selected={Array.from(searchParams.keys()).length === 0}
        >
          Show all
        </MenuItem>
        <Divider />
        {Filters.map(([text, prop, value], i) => (
          <MenuItem
            key={i}
            onClick={() => {
              closeMenu();
              setSearchParams({ [prop]: value });
            }}
            selected={searchParams.get(prop) === value}
          >
            {text}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

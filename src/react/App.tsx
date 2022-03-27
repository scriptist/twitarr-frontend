import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import APIAuthStateMaintainer from "../listeners/APIAuthStateMainter";
import AuthGate from "./component/AuthGate";
import ComingSoonPage from "./page/ComingSoonPage";
import ForumCategoriesPage from "./page/forum/ForumCategoriesPage";
import Layout from "./page/Layout";
import LogInPage from "./page/LogInPage";
import NotFoundPage from "./page/NotFoundPage";
import TwarrtsComposePage from "./page/twarrts/TwarrtsComposePage";
import TwarrtsListPage from "./page/twarrts/TwarrtsListPage";

interface Props {}

export default function App(_: Props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} path="/">
          <Route element={<Navigate replace to="/tweets" />} index />

          {/* Tweets */}
          <Route
            element={
              <AuthGate>
                <Outlet />
              </AuthGate>
            }
            path="tweets"
          >
            <Route element={<TwarrtsListPage />} index />
            <Route element={<TwarrtsComposePage />} path="compose" />
          </Route>

          {/* Forum */}
          <Route
            element={
              <AuthGate>
                <Outlet />
              </AuthGate>
            }
            path="forum"
          >
            <Route element={<ForumCategoriesPage />} index />
            <Route element={<ComingSoonPage />} path="favorites" />
            <Route element={<ComingSoonPage />} path="owned" />
            <Route element={<ComingSoonPage />} path=":categoryId" />
            <Route element={<ComingSoonPage />} path="posts">
              <Route element={<ComingSoonPage />} path="favorites" />
              <Route element={<ComingSoonPage />} path="owned" />
              <Route element={<ComingSoonPage />} path="mentions" />
              <Route element={<ComingSoonPage />} path=":postId" />
            </Route>
          </Route>

          {/* Seamail */}
          <Route
            element={
              <AuthGate>
                <Outlet />
              </AuthGate>
            }
            path="seamail"
          >
            <Route element={<ComingSoonPage />} index />
            <Route element={<ComingSoonPage />} path=":seamailId" />
          </Route>

          {/* Schedule */}
          <Route element={<ComingSoonPage />} path="schedule" />

          <Route element={<LogInPage />} path="login" />

          <Route element={<NotFoundPage />} path="*" />
        </Route>
      </Routes>

      {/* Listeners */}
      <APIAuthStateMaintainer />
    </BrowserRouter>
  );
}

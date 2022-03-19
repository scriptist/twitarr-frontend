import { BrowserRouter, Route, Routes } from "react-router-dom";
import APIAuthStateMaintainer from "../listeners/APIAuthStateMainter";
import AuthGate from "./component/AuthGate";
import ComingSoonPage from "./page/ComingSoonPage";
import Layout from "./page/Layout";
import LogInPage from "./page/LogInPage";
import NotFoundPage from "./page/NotFoundPage";
import TweetsPage from "./page/TweetsPage";

interface Props {}

export default function App(_: Props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />} path="/">
          <Route element={<ComingSoonPage />} index />

          {/* Tweets */}
          <Route
            element={
              <AuthGate>
                <TweetsPage />
              </AuthGate>
            }
            path="tweets"
          />

          {/* Forum */}
          <Route
            element={
              <AuthGate>
                <ComingSoonPage />
              </AuthGate>
            }
            path="forum"
          >
            <Route element={<ComingSoonPage />} index />
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
                <ComingSoonPage />
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

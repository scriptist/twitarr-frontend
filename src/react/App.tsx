import { BrowserRouter, Route, Routes } from "react-router-dom";
import ComingSoonPage from "./page/ComingSoonPage";
import Layout from "./page/Layout";
import NotFoundPage from "./page/NotFoundPage";

interface Props {}

export default function App(_: Props) {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<ComingSoonPage />} />
          <Route path="tweets" element={<ComingSoonPage />} />
          <Route path="forum" element={<ComingSoonPage />}>
            <Route index element={<ComingSoonPage />} />
            <Route path="favorites" element={<ComingSoonPage />} />
            <Route path="owned" element={<ComingSoonPage />} />
            <Route path=":categoryId" element={<ComingSoonPage />} />
            <Route path="posts" element={<ComingSoonPage />}>
              <Route path="favorites" element={<ComingSoonPage />} />
              <Route path="owned" element={<ComingSoonPage />} />
              <Route path="mentions" element={<ComingSoonPage />} />
              <Route path=":postId" element={<ComingSoonPage />} />
            </Route>
          </Route>
          <Route path="seamail" element={<ComingSoonPage />}>
            <Route index element={<ComingSoonPage />} />
            <Route path=":seamailId" element={<ComingSoonPage />} />
          </Route>
          <Route path="schedule" element={<ComingSoonPage />} />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

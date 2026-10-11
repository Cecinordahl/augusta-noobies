import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Landing } from "./pages/public/Landing";
import { Tournament } from "./pages/public/Tournament";
import { WallOfChampions } from "./pages/public/WallOfChampions";
import { PlayerDetail } from "./pages/public/PlayerDetail";
import { Personvern } from "./pages/public/Personvern";
import { Login } from "./pages/admin/Login";
import { Dashboard } from "./pages/admin/Dashboard";
import { RequireAdmin } from "./components/admin/RequireAdmin";
import { PlayersAdmin } from "./pages/admin/entities/PlayersAdmin";
import { TournamentsAdmin } from "./pages/admin/entities/TournamentsAdmin";
import { ResultsAdmin } from "./pages/admin/entities/ResultsAdmin";
import { SidePrizesAdmin } from "./pages/admin/entities/SidePrizesAdmin";
import { PhotosAdmin } from "./pages/admin/entities/PhotosAdmin";
import { HighlightsAdmin } from "./pages/admin/entities/HighlightsAdmin";
import { CoursesAdmin } from "./pages/admin/entities/CoursesAdmin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/tournament/:year" element={<Tournament />} />
        <Route path="/wall-of-champions" element={<WallOfChampions />} />
        <Route path="/players/:id" element={<PlayerDetail />} />
        <Route path="/personvern" element={<Personvern />} />

        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <Dashboard />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/players"
          element={
            <RequireAdmin>
              <PlayersAdmin />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/tournaments"
          element={
            <RequireAdmin>
              <TournamentsAdmin />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/results"
          element={
            <RequireAdmin>
              <ResultsAdmin />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/side-prizes"
          element={
            <RequireAdmin>
              <SidePrizesAdmin />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/photos"
          element={
            <RequireAdmin>
              <PhotosAdmin />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/highlights"
          element={
            <RequireAdmin>
              <HighlightsAdmin />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <RequireAdmin>
              <CoursesAdmin />
            </RequireAdmin>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

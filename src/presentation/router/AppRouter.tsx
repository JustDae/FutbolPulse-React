import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import { AdminTeamsPage } from '../pages/admin/AdminTeamsPage';
import { AdminPlayersPage } from '../pages/admin/AdminPlayersPage';
import { AdminMatchesPage } from '../pages/admin/AdminMatchesPage';
import { AdminTournamentsPage } from '../pages/admin/AdminTournamentsPage';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { AdminUsersPage } from '../pages/admin/AdminUsersPage';
import { AdminSubscriptionsPage } from '../pages/admin/AdminSubscriptionsPage';
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import { AdminShell } from '../components/AdminShell';
import { PlayerShell } from '../components/PlayerShell';
import { CoachShell } from '../components/CoachShell';
import { PlayerDashboardPage } from '../pages/player/PlayerDashboardPage';
import { PlayerMatchHistoryPage } from '../pages/player/PlayerMatchHistoryPage';
import { PlayerFeedbackPage } from '../pages/player/PlayerFeedbackPage';
import { MatchManagementPage } from '../pages/coach/MatchManagementPage';
import { LineupBuilderPage } from '../pages/coach/LineupBuilderPage';
import { HealthManagementPage } from '../pages/coach/HealthManagementPage';
import { LiveMatchTrackerPage } from '../pages/coach/LiveMatchTrackerPage';
import { PostMatchEvaluationPage } from '../pages/coach/PostMatchEvaluationPage';
import { AppShell } from '../components/AppShell';
import { ScoutShell } from '../components/ScoutShell';
import { ScoutDashboardPage } from '../pages/scout/ScoutDashboardPage';
import { ScoutPlayersPage } from '../pages/scout/ScoutPlayersPage';
import { ScoutProspectsPage } from '../pages/scout/ScoutProspectsPage';
import { ScoutReportsPage } from '../pages/scout/ScoutReportsPage';
import { ProtectedRoute } from './ProtectedRoute';
import { HomePage } from '../pages/public/HomePage';
import { TournamentsPage } from '../pages/tournaments/TournamentsPage';
import { TournamentDetailPage } from '../pages/tournaments/TournamentDetailPage';
import { TeamsPage } from '../pages/teams/TeamsPage';
import { TeamDetailPage } from '../pages/teams/TeamDetailPage';
import { MatchesPage } from '../pages/matches/MatchesPage';
import { MatchDetailPage } from '../pages/matches/MatchDetailPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { StatisticsPage } from '../pages/statistics/StatisticsPage';

export const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppShell />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/torneos" element={<TournamentsPage />} />
          <Route path="/torneos/:id" element={<TournamentDetailPage />} />
          <Route path="/equipos" element={<TeamsPage />} />
          <Route path="/equipos/:id" element={<TeamDetailPage />} />
          <Route path="/partidos" element={<MatchesPage />} />
          <Route path="/partidos/:id" element={<MatchDetailPage />} />
          <Route path="/estadisticas" element={<StatisticsPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
          <Route path="/admin" element={<AdminShell />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="torneos" element={<AdminTournamentsPage />} />
            <Route path="equipos" element={<AdminTeamsPage />} />
            <Route path="jugadores" element={<AdminPlayersPage />} />
            <Route path="partidos" element={<AdminMatchesPage />} />
            <Route path="suscripciones" element={<AdminSubscriptionsPage />} />
            <Route path="usuarios" element={<AdminUsersPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Jugador']} />}>
          <Route path="/jugador" element={<PlayerShell />}>
            <Route index element={<PlayerDashboardPage />} />
            <Route path="partidos" element={<PlayerMatchHistoryPage />} />
            <Route path="feedback" element={<PlayerFeedbackPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/jugador" replace />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Coach']} />}>
          <Route path="/coach" element={<CoachShell />}>
            <Route index element={<MatchManagementPage />} />
            <Route path="equipos" element={<AdminTeamsPage />} />
            <Route path="jugadores" element={<AdminPlayersPage />} />
            <Route path="alineaciones" element={<LineupBuilderPage />} />
            <Route path="salud" element={<HealthManagementPage />} />
            <Route path="live" element={<LiveMatchTrackerPage />} />
            <Route path="evaluaciones" element={<PostMatchEvaluationPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/coach" replace />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['Scout']} />}>
          <Route path="/scout" element={<ScoutShell />}>
            <Route index element={<ScoutDashboardPage />} />
            <Route path="jugadores" element={<ScoutPlayersPage />} />
            <Route path="prospectos" element={<ScoutProspectsPage />} />
            <Route path="reportes" element={<ScoutReportsPage />} />
            <Route path="perfil" element={<ProfilePage />} />
            <Route path="*" element={<Navigate to="/scout" replace />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

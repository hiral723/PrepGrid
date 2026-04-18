import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './hooks/useAuth.js';
import './styles/globals.css';

const LandingPage = React.lazy(() => import('./pages/Landingpage.jsx'));
const LoginPage = React.lazy(() => import('./pages/Loginpage.jsx'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage.jsx'));
const VerifyOTPPage = React.lazy(() => import('./pages/Verifyotppage.jsx'));
const ForgotPasswordPage = React.lazy(() => import('./pages/Forgotpasswordpage.jsx'));
const DashboardPage = React.lazy(() => import('./pages/Dashboardpage.jsx'));
const PracticePage = React.lazy(() => import('./pages/Practicepage.jsx'));
const CodeEditorPage = React.lazy(() => import('./pages/Codeeditorpage.jsx'));
const InterviewPage = React.lazy(() => import('./pages/Interviewpage.jsx'));
const InterviewSessionPage = React.lazy(() => import('./pages/Interviewsessionpage.jsx'));
const QuizPage = React.lazy(() => import('./pages/Quizpage.jsx'));
const QuizSessionPage = React.lazy(() => import('./pages/Quizsessionpage.jsx'));
const LeaderboardPage = React.lazy(() => import('./pages/Leaderboardpage.jsx'));
const ProfilePage = React.lazy(() => import('./pages/Profilepage.jsx'));
const UpgradePage = React.lazy(() => import('./pages/Upgradepage.jsx'));
const AdminPage = React.lazy(() => import('./pages/Adminpage.jsx'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30000 } }
});

class ErrorBoundary extends React.Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, fontFamily: 'monospace', color: '#ff5252', background: '#050a0a', minHeight: '100vh' }}>
          <h2 style={{ color: '#00e5e0' }}>Page crashed — check this error:</h2>
          <pre style={{ whiteSpace: 'pre-wrap', marginTop: 16 }}>{this.state.error.message}</pre>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#7a9e9e', fontSize: 12 }}>{this.state.error.stack}</pre>
          <button onClick={() => this.setState({ error: null })} style={{ marginTop: 24, padding: '8px 16px', background: '#00e5e0', color: '#001a1a', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Spinner = () => (
  <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050a0a' }}>
    <div style={{ width: 32, height: 32, border: '2px solid #00e5e0', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

const Protected = ({ children, adminOnly = false }) => {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/dashboard" replace />;
  return children;
};

const PublicOnly = ({ children }) => {
  const { user, isLoading } = useAuthStore();
  if (isLoading) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
};

function AppRoutes() {
  const init = useAuthStore(s => s.init);
  useEffect(() => { init(); }, []);

  return (
    <React.Suspense fallback={<Spinner />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<PublicOnly><LoginPage /></PublicOnly>} />
        <Route path="/register" element={<PublicOnly><RegisterPage /></PublicOnly>} />
        <Route path="/verify-otp" element={<VerifyOTPPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/dashboard" element={<Protected><DashboardPage /></Protected>} />
        <Route path="/practice" element={<Protected><PracticePage /></Protected>} />
        <Route path="/practice/:id" element={<Protected><CodeEditorPage /></Protected>} />
        <Route path="/interview" element={<Protected><InterviewPage /></Protected>} />
        <Route path="/interview/:id" element={<Protected><InterviewSessionPage /></Protected>} />
        <Route path="/quiz" element={<Protected><QuizPage /></Protected>} />
        <Route path="/quiz/:id" element={<Protected><QuizSessionPage /></Protected>} />
        <Route path="/leaderboard" element={<Protected><LeaderboardPage /></Protected>} />
        <Route path="/profile" element={<Protected><ProfilePage /></Protected>} />
        <Route path="/upgrade" element={<Protected><UpgradePage /></Protected>} />
        <Route path="/admin" element={<Protected adminOnly><AdminPage /></Protected>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </React.Suspense>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
        <Toaster
          position="top-right"
          toastOptions={{
            style: { background: '#0a1414', color: '#e8f4f4', border: '1px solid rgba(0,229,224,0.2)' },
            success: { iconTheme: { primary: '#00e5e0', secondary: '#001a1a' } }
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './store/AuthContext';
import { ProtectedRoute, AdminRoute, PublicRoute } from './components/RouteGuards';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import InboxPage from './pages/InboxPage';
import SendPage from './pages/SendPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'rgba(30,10,60,0.95)',
              color: '#f1e9ff',
              border: '1px solid rgba(168,85,247,0.3)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              padding: '12px 16px',
              fontSize: '0.9rem',
            },
            success: { iconTheme: { primary: '#34d399', secondary: 'white' } },
            error: { iconTheme: { primary: '#ef4444', secondary: 'white' } },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/send/:shareId" element={<SendPage />} />

          {/* Auth routes (redirect to dashboard if logged in) */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Protected routes (require login) */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Layout><DashboardPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/inbox" element={
            <ProtectedRoute>
              <Layout><InboxPage /></Layout>
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Layout><ProfilePage /></Layout>
            </ProtectedRoute>
          } />

          {/* Admin route */}
          <Route path="/admin" element={
            <AdminRoute>
              <Layout><AdminPage /></Layout>
            </AdminRoute>
          } />

          {/* 404 */}
          <Route path="*" element={
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
              <div className="aurora-bg" />
              <div style={{ fontSize: '5rem', position: 'relative', zIndex: 1 }}>💫</div>
              <h1 style={{ fontSize: '2rem', position: 'relative', zIndex: 1 }}>Page Not Found</h1>
              <a href="/" className="btn btn-primary" style={{ position: 'relative', zIndex: 1 }}>Go Home</a>
            </div>
          } />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

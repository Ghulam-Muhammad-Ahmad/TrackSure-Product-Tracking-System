import React from 'react';
import { BrowserRouter as Router, Route, Routes, useParams, useSearchParams } from 'react-router-dom';

import HomePage from './pages/Homepage';
import LoginPage from './pages/LoginPage';
import SignUp from './pages/SignupPage';
import PrivateRoute from './components/PrivateRoute';
import ForgotPassword from './pages/ForgotPassword';
import AccountPage from './pages/AccountPage';
import DashboardLayout from './components/DashboardLayout';
import DashboardHomePage from './pages/DashboardHomePage'; 
import LogoutPage from './pages/LogoutPage';
import VerifyEmail from './pages/VerifyEmail';
import TanentUsers from './pages/TanentUsers';
import TanentRoles from './pages/TanentRoles';
import TanentCategories from './pages/TanentCategories';
import TanentProducts from './pages/TanentProducts';
import TanentActivityLogs from './pages/TanentActivityLogs';
import TanentProductStatus from './pages/TanentProductStatus';
import TanentNotifications from './pages/TanentNotifications';
import TanentQrGenerator from './pages/TanentQrGenerator';
import TanentQrScanner from './pages/TanentQrScanner';
import TanentScanConfig from './pages/TanentScanConfig';
import NotFoundPage from './pages/NotFoundPage';
import DocumentCenter from './pages/DocumentCenter';
import DocumentViewerPage from './pages/DocumentViewerPage';
import TrackBot from './pages/TrackBot';

// --- Public wrapper for /scan/:tenantId?token=... ---
function PublicScanRoute() {
  const { tenantId } = useParams();           // /scan/:tenantId
  const [searchParams] = useSearchParams();   // ?token=...
  const token = searchParams.get('token') || '';

  // Pass these down to your scanner page. Adjust prop names if needed.
  return <TanentQrScanner tenantId={tenantId} token={token} isPublic />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/logout" element={<LogoutPage />} />

        {/* New Public Scan Route: /scan/{tanentId}/?token={token} */}
        <Route path="/scan/:tenantId" element={<PublicScanRoute />} />

        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<PrivateRoute />}>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardHomePage />} />
            <Route path="tanent-users" element={<TanentUsers />} />
            <Route path="tanent-roles" element={<TanentRoles />} />
            <Route path="tanent-categories" element={<TanentCategories />} />
            <Route path="tanent-products" element={<TanentProducts />} />
            <Route path="tanent-product-status" element={<TanentProductStatus />} />
            <Route path="tanent-activity-logs" element={<TanentActivityLogs />} />
            <Route path="tanent-notifications" element={<TanentNotifications />} />
            <Route path="tanent-qr-generator" element={<TanentQrGenerator />} />
            <Route path="tanent-qr-scanner" element={<TanentQrScanner />} />
            <Route path="tanent-qr-config" element={<TanentScanConfig />} />
            <Route path="account" element={<AccountPage />} />
            <Route path="document-center" element={<DocumentCenter />} />
            <Route path="document-viewer/:documentId" element={<DocumentViewerPage />} />
            <Route path="trackbot" element={<TrackBot />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;

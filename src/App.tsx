import React from "react";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import HomePage from "./pages/HomePage";
import TurfListPage from "./pages/TurfListPage";
import EventsPage from "./pages/EventsPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TurfDetailPage from "./pages/TurfDetailPage";
import UserDashboard from "./pages/user/UserDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserProfile from "./pages/user/UserProfile";
import OwnerTurfs from "./pages/owner/OwnerTurfs";
import OwnerBookings from "./pages/owner/OwnerBookings";
import OwnerDashboardStatic from "./pages/owner/OwnerDashboardStatic";
import TurfWizard from "./pages/owner/TurfWizard";
import OTPLoginPage from "./pages/OTPLoginPage";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminEventCreate from "./pages/admin/AdminEventCreate";
import AdminEventEdit from "./pages/admin/AdminEventEdit";
const App: React.FC = () => {
 
  return (
    <Box>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={ <HomePage /> } />
            <Route path="/turfs" element={ <TurfListPage /> } />
            <Route path="/turf/:slug" element={<TurfDetailPage />} />
            <Route path="/events" element={ <EventsPage />} />
            <Route path="/login" element={ <LoginPage /> } />
            <Route path="/otp-login" element={ <OTPLoginPage /> } />
            <Route path="/register" element={ <RegisterPage /> } />
            <Route path="/user/profile" element={ <UserProfile /> } />
            <Route path="/user/dashboard" element={ <UserDashboard /> } />
            <Route path="/owner/dashboard" element={ <OwnerDashboardStatic /> } />
            <Route path="/admin/dashboard" element={ <AdminDashboard /> } />
            <Route path="/admin/events" element={ <AdminEvents /> } />
            <Route path="/admin/events/create" element={ <AdminEventCreate /> } />
            <Route path="/admin/events/:id/edit" element={ <AdminEventEdit /> } />
            <Route path="/owner/turfs" element={ <OwnerTurfs /> } />
            <Route path="/turf/create" element={ <TurfWizard /> } />
            <Route path="/owner/bookings" element={ <OwnerBookings /> } />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Box>
  );
};

export default App;

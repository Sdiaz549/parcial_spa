import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import AdminAppointments from './pages/AdminAppointments.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import AdminServices from './pages/AdminServices.jsx';
import BookAppointment from './pages/BookAppointment.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import MyAppointments from './pages/MyAppointments.jsx';
import Register from './pages/Register.jsx';
import Services from './pages/Services.jsx';
import UserDashboard from './pages/UserDashboard.jsx';

function DashboardRouter() {
  const { role } = useAuth();
  return role === 'ADMIN' ? <AdminDashboard /> : <UserDashboard />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/services" element={<Services />} />
          <Route
            path="/book"
            element={
              <ProtectedRoute roles={['USER', 'ADMIN']}>
                <BookAppointment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-appointments"
            element={
              <ProtectedRoute roles={['USER', 'ADMIN']}>
                <MyAppointments />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute roles={['USER', 'ADMIN']}>
                <DashboardRouter />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/services"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/appointments"
            element={
              <ProtectedRoute roles={['ADMIN']}>
                <AdminAppointments />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

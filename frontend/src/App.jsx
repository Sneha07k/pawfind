import { Routes, Route } from 'react-router-dom'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyOtp from './pages/auth/VerifyOtp'
import ForgotPassword from './pages/auth/ForgotPassword'
import ResetPassword from './pages/auth/ResetPassword'
import NgoProfileSetup from './pages/ngo/NgoProfileSetup'
import AdminDashboard from './pages/admin/AdminDashboard'
import ProtectedRoute from './components/ProtectedRoute'
import MyPets from './pages/ngo/MyPets'
import PetForm from './pages/ngo/PetForm'
import BrowsePets from "./pages/public/BrowsePets";
import NearbyMap from "./pages/public/NearbyMap";
import PetDetails from "./pages/public/PetDetails";

function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold text-primary-600">
        PawFind — Find Your New Best Friend 🐾
      </h1>
      <a
        href="/browse"
        className="bg-primary-500 text-white px-6 py-2 rounded-xl hover:bg-primary-600"
      >
        Browse Pets
      </a>
    </div>
  );
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/verify-otp" element={<VerifyOtp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/map" element={<NearbyMap />} />
      <Route path="/pets/:id" element={<PetDetails />} />

      <Route
        path="/ngo/profile"
        element={
          <ProtectedRoute allowedRoles={["NGO"]}>
            <NgoProfileSetup />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/pets"
        element={
          <ProtectedRoute allowedRoles={["NGO"]}>
            <MyPets />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/pets/new"
        element={
          <ProtectedRoute allowedRoles={["NGO"]}>
            <PetForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/pets/:id/edit"
        element={
          <ProtectedRoute allowedRoles={["NGO"]}>
            <PetForm />
          </ProtectedRoute>
        }
      />
      <Route path="/browse" element={<BrowsePets />} />
    </Routes>
  );
}
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
import MyFavorites from "./pages/adopter/MyFavorites";
import PetDetails from "./pages/public/PetDetails";
import ApplyForAdoption from "./pages/adopter/ApplyForAdoption";
import MyApplications from "./pages/adopter/MyApplications";
import SignAgreement from "./pages/adopter/SignAgreement";
import NgoApplications from "./pages/ngo/NgoApplications";
import ShareStory from "./pages/adopter/ShareStory";

import { useEffect, useState } from "react";
import StoryCard from "./components/StoryCard";
import { getFeaturedStories } from "./api/storyApi";

function Home() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    getFeaturedStories(6).then((res) => setStories(res.data));
  }, []);

  return (
    <div className="min-h-screen">
      <div className="flex flex-col items-center justify-center gap-4 py-20 bg-neutral-50">
        <h1 className="text-4xl font-semibold text-primary-600 text-center px-4">
          Find Your New Best Friend 🐾
        </h1>
        <div className="flex gap-3">
          <a
            href="/browse"
            className="bg-primary-500 text-white px-6 py-2 rounded-xl hover:bg-primary-600"
          >
            Browse Pets
          </a>
          <a
            href="/map"
            className="bg-white border px-6 py-2 rounded-xl hover:bg-neutral-50"
          >
            View Nearby
          </a>
        </div>
      </div>

      {stories.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-14">
          <h2 className="text-2xl font-semibold text-primary-600 mb-6">
            Success Stories
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </div>
      )}
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
        path="/applications/:id/sign"
        element={
          <ProtectedRoute allowedRoles={["ADOPTER"]}>
            <SignAgreement />
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
      <Route
        path="/favorites"
        element={
          <ProtectedRoute allowedRoles={["ADOPTER"]}>
            <MyFavorites />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pets/:petId/apply"
        element={
          <ProtectedRoute allowedRoles={["ADOPTER"]}>
            <ApplyForAdoption />
          </ProtectedRoute>
        }
      />
      <Route
        path="/applications"
        element={
          <ProtectedRoute allowedRoles={["ADOPTER"]}>
            <MyApplications />
          </ProtectedRoute>
        }
      />
      <Route
        path="/pets/:petId/share-story"
        element={
          <ProtectedRoute allowedRoles={["ADOPTER"]}>
            <ShareStory />
          </ProtectedRoute>
        }
      />
      <Route
        path="/ngo/applications"
        element={
          <ProtectedRoute allowedRoles={["NGO"]}>
            <NgoApplications />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
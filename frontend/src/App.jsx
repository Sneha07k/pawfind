import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import MainLayout from "./layouts/MainLayout";
import PetCard from "./components/PetCard";
import StoryCard from "./components/StoryCard";
import ProtectedRoute from "./components/ProtectedRoute";

import { getFeaturedPets } from "./api/petApi";
import { getFeaturedStories } from "./api/storyApi";
import { getApprovedNgos } from "./api/ngoApi";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOtp from "./pages/auth/VerifyOtp";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

import NgoProfileSetup from "./pages/ngo/NgoProfileSetup";
import NgoDashboard from "./pages/ngo/NgoDashboard";
import MyPets from "./pages/ngo/MyPets";
import PetForm from "./pages/ngo/PetForm";
import NgoApplications from "./pages/ngo/NgoApplications";

import AdminDashboard from "./pages/admin/AdminDashboard";

import BrowsePets from "./pages/public/BrowsePets";
import PetDetails from "./pages/public/PetDetails";
import NearbyMap from "./pages/public/NearbyMap";

import AdopterDashboard from "./pages/adopter/AdopterDashboard";
import MyFavorites from "./pages/adopter/MyFavorites";
import ApplyForAdoption from "./pages/adopter/ApplyForAdoption";
import MyApplications from "./pages/adopter/MyApplications";
import SignAgreement from "./pages/adopter/SignAgreement";
import ShareStory from "./pages/adopter/ShareStory";

function Home() {
  const [pets, setPets] = useState([]);
  const [stories, setStories] = useState([]);
  const [ngos, setNgos] = useState([]);

  useEffect(() => {
    getFeaturedPets(8).then((res) => setPets(res.data));
    getFeaturedStories(6).then((res) => setStories(res.data));
    getApprovedNgos(8).then((res) => setNgos(res.data));
  }, []);

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-primary-50 to-neutral-50 py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold text-primary-600 mb-4">
            Find Your New Best Friend
          </h1>
          <p className="text-neutral-600 mb-8">
            Every pet on PawFind is waiting for a loving home. Discover their
            stories, connect with verified shelters, and start a responsible
            adoption journey.
          </p>
          <div className="flex justify-center gap-3">
            <a
              href="/browse"
              className="bg-primary-500 text-white px-6 py-2.5 rounded-xl hover:bg-primary-600"
            >
              Browse Pets
            </a>
            <a
              href="/map"
              className="bg-white border px-6 py-2.5 rounded-xl hover:bg-neutral-50"
            >
              See Who's Nearby
            </a>
          </div>
        </div>
      </div>

      {/* Featured Pets */}
      {pets.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-primary-600">
              Featured Pets
            </h2>
            <a href="/browse" className="text-sm text-primary-600">
              See all →
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        </section>
      )}

      {/* Nearby teaser */}
      <section className="bg-white py-14">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl font-semibold text-primary-600 mb-3">
            Pets Near You
          </h2>
          <p className="text-neutral-500 mb-6">
            See adoptable pets and shelters right in your area on an interactive
            map.
          </p>
          <a
            href="/map"
            className="inline-block bg-primary-500 text-white px-6 py-2.5 rounded-xl hover:bg-primary-600"
          >
            Open Map
          </a>
        </div>
      </section>

      {/* Success Stories */}
      {stories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <h2 className="text-2xl font-semibold text-primary-600 mb-6">
            Success Stories
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stories.map((story) => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}

      {/* Verified NGOs */}
      {ngos.length > 0 && (
        <section className="bg-white py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <h2 className="text-2xl font-semibold text-primary-600 mb-6">
              Verified Shelters & NGOs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {ngos.map((ngo) => (
                <div
                  key={ngo.id}
                  className="bg-neutral-50 rounded-2xl p-4 text-center"
                >
                  {ngo.logoUrl ? (
                    <img
                      src={ngo.logoUrl}
                      alt={ngo.organizationName}
                      className="w-16 h-16 object-cover rounded-full mx-auto mb-2"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-primary-50 mx-auto mb-2 flex items-center justify-center text-primary-600 font-semibold">
                      {ngo.organizationName?.[0]}
                    </div>
                  )}
                  <p className="text-sm font-medium">{ngo.organizationName}</p>
                  <p className="text-xs text-neutral-400 mt-1">{ngo.address}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default function App() {
  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/browse" element={<BrowsePets />} />
        <Route path="/pets/:id" element={<PetDetails />} />
        <Route path="/map" element={<NearbyMap />} />

        <Route
          path="/ngo/profile"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <NgoProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ngo/dashboard"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <NgoDashboard />
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
        <Route
          path="/ngo/applications"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <NgoApplications />
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
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={["ADOPTER"]}>
              <AdopterDashboard />
            </ProtectedRoute>
          }
        />
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
          path="/applications/:id/sign"
          element={
            <ProtectedRoute allowedRoles={["ADOPTER"]}>
              <SignAgreement />
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
      </Routes>
    </MainLayout>
  );
}

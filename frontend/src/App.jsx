import { Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import AllSuccessStories from "./pages/public/AllSuccessStories";
import MainLayout from "./layouts/MainLayout";
import NgoProfilePublic from "./pages/public/NgoProfilePublic";
import PetCard from "./components/PetCard";
import StoryCard from "./components/StoryCard";
import ProtectedRoute from "./components/ProtectedRoute";

import { getFeaturedPets } from "./api/petApi";
import { getFeaturedStories } from "./api/storyApi";
import { getApprovedNgos } from "./api/ngoApi";
import { Link } from "react-router-dom";

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

import catLoaderAnimation from "./pages/lottie/CatLoader.json";
import capybaraAnimation from "./pages/lottie/Capybara.json";
import yummyDogAnimation from "./pages/lottie/YummyDog.json";

function Home() {
  const [pets, setPets] = useState([]);
  const [stories, setStories] = useState([]);
  const [ngos, setNgos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getFeaturedPets(8), getFeaturedStories(6), getApprovedNgos(8)])
      .then(([petsRes, storiesRes, ngosRes]) => {
        setPets(petsRes.data);
        setStories(storiesRes.data);
        setNgos(ngosRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const themeVars = {
    "--orange": "#FF7A17",
    "--orange-dark": "#E8650A",
    "--sky": "#1AB5FF",
    "--mint": "#00C9A7",
    "--pink": "#FF5FC4",
    "--yellow": "#FFCF56",
    "--purple": "#9B6BFF",
    "--lime": "#A6E22E",
    "--sand": "#FFF1E6",
    "--line": "#FFE1CE",
    "--ink": "#241E29",
    "--ink-soft": "#8A7E70",
    fontFamily: "'Nunito', ui-sans-serif, system-ui, sans-serif",
  };

  const globalStyles = `
    @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Nunito:wght@400;600;700;800&display=swap');

    @keyframes pc-float {
      0%, 100% { transform: translateY(0) rotate(var(--r, 0deg)); }
      50% { transform: translateY(-14px) rotate(var(--r, 0deg)); }
    }
    @keyframes pc-fade-up {
      from { opacity: 0; transform: translateY(16px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes pc-fade-in {
      from { opacity: 0; }
      to   { opacity: 1; }
    }
    @keyframes pc-blob-drift {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50% { transform: translate(10px, -12px) scale(1.05); }
    }
    @keyframes pc-loader-pulse {
      0%, 100% { opacity: 0.6; }
      50% { opacity: 1; }
    }
    .pc-heading { font-family: 'Quicksand', ui-sans-serif, sans-serif; }
    .animate-pc-fade-up { animation: pc-fade-up 0.6s ease both; }
    .animate-pc-fade-in { animation: pc-fade-in 0.7s ease both; }
    .animate-pc-blob { animation: pc-blob-drift 6s ease-in-out infinite; }
    .animate-pc-loader-text { animation: pc-loader-pulse 1.8s ease-in-out infinite; }

    @media (prefers-reduced-motion: reduce) {
      .animate-pc-fade-up, .animate-pc-fade-in, .animate-pc-blob, .pc-card, .pc-btn {
        animation: none !important;
        transition: none !important;
      }
    }
  `;

  // Premium loading state — cat Lottie on the same warm gradient as the hero
  if (loading) {
    return (
      <div style={themeVars}>
        <style>{globalStyles}</style>
        <div
          className="min-h-[70vh] flex flex-col items-center justify-center px-4 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, #FFF4EC 0%, #FFEFF7 45%, #FFF8EC 100%)",
          }}
        >
          <div
            className="absolute w-72 h-72 rounded-full opacity-20 blur-3xl animate-pc-blob"
            style={{ background: "var(--mint)", top: "10%", left: "8%" }}
            aria-hidden="true"
          />
          <div
            className="absolute w-72 h-72 rounded-full opacity-20 blur-3xl animate-pc-blob"
            style={{
              background: "var(--pink)",
              bottom: "10%",
              right: "8%",
              animationDelay: "1.5s",
            }}
            aria-hidden="true"
          />
          <div className="relative w-48 h-48 sm:w-56 sm:h-56">
            <Lottie animationData={catLoaderAnimation} loop autoplay />
          </div>
          <p className="pc-heading text-lg font-bold text-[var(--ink)] mt-2 animate-pc-loader-text">
            Fetching happy tails...
          </p>
          <p className="text-sm text-[var(--ink-soft)] mt-1">
            Good things (and good boys) take a moment 🐾
          </p>
        </div>
      </div>
    );
  }

  return (
    <div style={themeVars}>
      <style>{globalStyles}</style>

      {/* Hero */}
      <div
        className="relative overflow-hidden py-20 px-4"
        style={{
          background:
            "linear-gradient(160deg, #FFF4EC 0%, #FFEFF7 45%, #FFF8EC 100%)",
        }}
      >
        {/* Ambient floating paw prints, very low opacity */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[
            {
              top: "10%",
              left: "6%",
              size: 30,
              color: "var(--orange)",
              delay: "0s",
              duration: "7s",
            },
            {
              top: "70%",
              left: "10%",
              size: 22,
              color: "var(--sky)",
              delay: "1s",
              duration: "8s",
            },
            {
              top: "20%",
              left: "90%",
              size: 26,
              color: "var(--pink)",
              delay: "0.5s",
              duration: "7.5s",
            },
            {
              top: "75%",
              left: "92%",
              size: 34,
              color: "var(--mint)",
              delay: "1.4s",
              duration: "9s",
            },
            {
              top: "45%",
              left: "48%",
              size: 20,
              color: "var(--purple)",
              delay: "0.8s",
              duration: "8.5s",
            },
          ].map((p, i) => (
            <svg
              key={i}
              viewBox="0 0 64 64"
              width={p.size}
              height={p.size}
              className="absolute opacity-[0.09]"
              style={{
                top: p.top,
                left: p.left,
                color: p.color,
                animation: `pc-float ${p.duration} ease-in-out ${p.delay} infinite`,
              }}
              aria-hidden="true"
            >
              <ellipse cx="32" cy="42" rx="16" ry="14" fill="currentColor" />
              <ellipse cx="12" cy="22" rx="7" ry="9" fill="currentColor" />
              <ellipse cx="28" cy="12" rx="7.5" ry="9.5" fill="currentColor" />
              <ellipse cx="46" cy="14" rx="7" ry="9" fill="currentColor" />
              <ellipse cx="56" cy="30" rx="6.5" ry="8.5" fill="currentColor" />
            </svg>
          ))}
        </div>

        {/* Capybara mascot — organic blob + floating Lottie, hidden on very small screens */}
        <div
          className="hidden sm:block absolute animate-pc-float pointer-events-none"
          style={{ bottom: "4%", right: "4%", "--r": "-4deg" }}
          aria-hidden="true"
        >
          <div className="relative w-28 h-28 md:w-36 md:h-36">
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-30"
              style={{ background: "var(--purple)" }}
            />
            <Lottie
              animationData={capybaraAnimation}
              loop
              autoplay
              className="relative"
            />
          </div>
        </div>

        <div className="relative max-w-3xl mx-auto text-center animate-pc-fade-in">
          <span
            className="inline-flex items-center gap-1.5 rounded-full text-[var(--mint)] text-xs font-bold px-3 py-1 tracking-wide uppercase mb-4"
            style={{ backgroundColor: "rgba(0, 201, 167, 0.15)" }}
          >
            🐾 Adoption made easy
          </span>
          <h1 className="pc-heading text-4xl sm:text-5xl font-bold text-[var(--ink)] mb-4">
            Find Your New Best Friend
          </h1>
          <p className="text-[var(--ink-soft)] mb-8 max-w-xl mx-auto">
            Every pet on PawFind is waiting for a loving home. Discover their
            stories, connect with verified shelters, and start a responsible
            adoption journey.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              to="/browse"
              className="pc-btn bg-[var(--orange)] text-white px-6 py-2.5 rounded-2xl font-bold shadow-md transition-all duration-200 hover:bg-[var(--orange-dark)] hover:-translate-y-0.5 hover:shadow-lg"
            >
              Browse Pets
            </Link>

            <Link
              to="/map"
              className="pc-btn bg-white border-2 border-[var(--line)] text-[var(--ink)] px-6 py-2.5 rounded-2xl font-bold transition-all duration-200 hover:border-[var(--sky)] hover:text-[var(--sky)] hover:-translate-y-0.5"
            >
              See Who's Nearby
            </Link>
          </div>
        </div>
      </div>

      {/* Featured Pets */}
      {pets.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 animate-pc-fade-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="pc-heading text-2xl font-bold text-[var(--ink)]">
              Featured Pets
            </h2>

            <Link
              to="/browse"
              className="pc-btn bg-[var(--orange)] text-white px-6 py-2.5 rounded-2xl font-bold shadow-md transition-all duration-200 hover:bg-[var(--orange-dark)] hover:-translate-y-0.5 hover:shadow-lg"
            >
              See all →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="pc-card rounded-3xl transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.02] focus-within:-translate-y-1.5"
              >
                <PetCard pet={pet} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Nearby teaser */}
      <section
        className="relative overflow-hidden py-14"
        style={{
          background: "linear-gradient(120deg, #E9FBF7 0%, #E7F6FF 100%)",
        }}
      >
        {/* Dog mascot — floating beside the CTA, hidden on very small screens */}
        <div
          className="hidden md:block absolute animate-pc-float pointer-events-none"
          style={{ bottom: "6%", left: "6%", "--r": "3deg" }}
          aria-hidden="true"
        >
          <div className="relative w-24 h-24 lg:w-32 lg:h-32">
            <div
              className="absolute inset-0 rounded-full blur-2xl opacity-30"
              style={{ background: "var(--lime)" }}
            />
            <Lottie
              animationData={yummyDogAnimation}
              loop
              autoplay
              className="relative"
            />
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 text-center">
          <span
            className="inline-flex items-center gap-1.5 rounded-full text-[var(--sky)] text-xs font-bold px-3 py-1 tracking-wide uppercase mb-3"
            style={{ backgroundColor: "rgba(26, 181, 255, 0.15)" }}
          >
            📍 Nearby
          </span>
          <h2 className="pc-heading text-2xl font-bold text-[var(--ink)] mb-3">
            Pets Near You
          </h2>
          <p className="text-[var(--ink-soft)] mb-6 max-w-md mx-auto">
            See adoptable pets and shelters right in your area on an interactive
            map.
          </p>

          <Link
            to="/map"
            className="pc-btn inline-block bg-[var(--sky)] text-white px-6 py-2.5 rounded-2xl font-bold shadow-md transition-all duration-200 hover:brightness-95 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Open Map
          </Link>
        </div>
      </section>

      {/* Success Stories */}
      {stories.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14 animate-pc-fade-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-primary-600">
              Success Stories
            </h2>
            <Link to="/stories" className="text-sm text-primary-600">
              See all →
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stories.map((story) => (
              <div
                key={story.id}
                className="pc-card rounded-3xl transition-transform duration-300 hover:-translate-y-1.5 hover:scale-[1.01]"
              >
                <StoryCard story={story} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Verified NGOs */}
      {ngos.length > 0 && (
        <section className="bg-white py-14">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 animate-pc-fade-up">
            <span
              className="inline-flex items-center gap-1.5 rounded-full text-[var(--purple)] text-xs font-bold px-3 py-1 tracking-wide uppercase"
              style={{ backgroundColor: "rgba(155, 107, 255, 0.15)" }}
            >
              ✓ Trusted partners
            </span>
            <h2 className="pc-heading text-2xl font-bold text-[var(--ink)] mb-6">
              Verified Shelters &amp; NGOs
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {ngos.map((ngo) => (
                <Link
                  key={ngo.id}
                  to={`/ngo/${ngo.id}`}
                  className="group rounded-2xl p-4 text-center transition-all duration-200 block border-2 border-transparent hover:border-[var(--line)] hover:-translate-y-1 hover:shadow-md"
                  style={{ background: "var(--sand)" }}
                >
                  {ngo.logoUrl ? (
                    <img
                      src={ngo.logoUrl}
                      alt={ngo.organizationName}
                      className="w-16 h-16 object-cover rounded-full mx-auto mb-2 ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div
                      className="w-16 h-16 rounded-full mx-auto mb-2 flex items-center justify-center text-white font-bold text-lg shadow-sm"
                      style={{ background: "var(--orange)" }}
                    >
                      {ngo.organizationName?.[0]}
                    </div>
                  )}
                  <p className="text-sm font-bold text-[var(--ink)] group-hover:text-[var(--orange)] transition-colors">
                    {ngo.organizationName}
                  </p>
                  <p className="text-xs text-[var(--ink-soft)] mt-1">
                    {ngo.address}
                  </p>
                </Link>
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
        <Route path="/ngo/:id" element={<NgoProfilePublic />} />
        <Route
          path="/ngo/pets"
          element={
            <ProtectedRoute allowedRoles={["NGO"]}>
              <MyPets />
            </ProtectedRoute>
          }
        />
        <Route path="/stories" element={<AllSuccessStories />} />
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

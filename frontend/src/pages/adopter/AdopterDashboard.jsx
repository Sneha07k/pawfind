import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyApplications } from "../../api/applicationApi";
import { getMyFavorites } from "../../api/favoriteApi";
import { getMyStories } from "../../api/storyApi";

export default function AdopterDashboard() {
  const [applications, setApplications] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [stories, setStories] = useState([]);

  useEffect(() => {
    getMyApplications().then((res) => setApplications(res.data));
    getMyFavorites().then((res) => setFavorites(res.data));
    getMyStories().then((res) => setStories(res.data));
  }, []);

  const completed = applications.filter((a) => a.status === "COMPLETED").length;
  const active = applications.filter((a) =>
    ["PENDING", "APPROVED", "AGREEMENT_SIGNED"].includes(a.status),
  ).length;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-primary-600 mb-6">
          My Dashboard
        </h1>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard label="Favourite Pets" value={favorites.length} />
          <StatCard label="Active Applications" value={active} />
          <StatCard label="Completed Adoptions" value={completed} />
          <StatCard label="Stories Shared" value={stories.length} />
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/favorites"
            className="bg-white border rounded-xl px-5 py-3 text-sm hover:shadow-sm"
          >
            My Favourites
          </Link>
          <Link
            to="/applications"
            className="bg-white border rounded-xl px-5 py-3 text-sm hover:shadow-sm"
          >
            My Applications
          </Link>
          <Link
            to="/browse"
            className="bg-white border rounded-xl px-5 py-3 text-sm hover:shadow-sm"
          >
            Browse Pets
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <p className="text-3xl font-semibold text-primary-600">{value}</p>
      <p className="text-sm text-neutral-500 mt-1">{label}</p>
    </div>
  );
}

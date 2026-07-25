import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getNgoDashboardStats } from "../../api/dashboardApi";

export default function NgoDashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getNgoDashboardStats()
      .then((res) => setStats(res.data))
      .catch((err) =>
        setError(err.response?.data?.error || "Could not load dashboard."),
      );
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-primary-600 mb-6">
          Shelter Dashboard
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {stats && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard label="Total Pets Listed" value={stats.totalPetsListed} />
            <StatCard
              label="Pending Applications"
              value={stats.pendingApplications}
            />
            <StatCard
              label="Approved / In Progress"
              value={stats.approvedApplications}
            />
            <StatCard
              label="Completed Adoptions"
              value={stats.completedAdoptions}
            />
          </div>
        )}

        <div className="flex gap-3">
          <Link
            to="/ngo/pets"
            className="bg-white border rounded-xl px-5 py-3 text-sm hover:shadow-sm"
          >
            Manage Pet Listings
          </Link>
          <Link
            to="/ngo/applications"
            className="bg-white border rounded-xl px-5 py-3 text-sm hover:shadow-sm"
          >
            Review Applications
          </Link>
          <Link
            to="/ngo/profile"
            className="bg-white border rounded-xl px-5 py-3 text-sm hover:shadow-sm"
          >
            Organization Profile
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

import { useEffect, useState } from "react";
import {
  approveNgo,
  deleteUser,
  getAllUsers,
  getNgosByStatus,
  rejectNgo,
} from "../../api/adminApi";

export default function AdminDashboard() {
  const [tab, setTab] = useState("ngos");

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-primary-600 mb-6">
          Admin Dashboard
        </h1>

        <div className="flex gap-2 mb-6">
          {[
            ["ngos", "NGO Approvals"],
            ["users", "Manage Users"],
          ].map(([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`px-4 py-1.5 rounded-full text-sm ${tab === key ? "bg-primary-500 text-white" : "bg-white border"}`}
            >
              {label}
            </button>
          ))}
        </div>

        {tab === "ngos" && <NgoApprovals />}
        {tab === "users" && <ManageUsers />}
      </div>
    </div>
  );
}

function NgoApprovals() {
  const [ngos, setNgos] = useState([]);
  const [statusFilter, setStatusFilter] = useState("PENDING");
  const [error, setError] = useState("");

  const load = () => {
    getNgosByStatus(statusFilter)
      .then((res) => setNgos(res.data))
      .catch((err) =>
        setError(err.response?.data?.error || "Could not load NGOs."),
      );
  };

  useEffect(load, [statusFilter]);

  const handleApprove = async (id) => {
    await approveNgo(id);
    load();
  };
  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection (optional):") || "";
    await rejectNgo(id, reason);
    load();
  };

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {["PENDING", "APPROVED", "REJECTED"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1 rounded-full text-xs ${statusFilter === s ? "bg-primary-500 text-white" : "bg-white border"}`}
          >
            {s}
          </button>
        ))}
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="grid gap-4">
        {ngos.length === 0 && (
          <p className="text-neutral-500">
            No {statusFilter.toLowerCase()} organizations.
          </p>
        )}
        {ngos.map((ngo) => (
          <div
            key={ngo.id}
            className="bg-white rounded-2xl shadow-sm p-5 flex justify-between items-center"
          >
            <div>
              <h2 className="font-semibold">{ngo.organizationName}</h2>
              <p className="text-sm text-neutral-500">{ngo.address}</p>
              <p className="text-sm text-neutral-500">
                {ngo.contactName} — {ngo.contactEmail}
              </p>
              {ngo.status === "REJECTED" && ngo.rejectionReason && (
                <p className="text-sm text-red-500 mt-1">
                  Reason: {ngo.rejectionReason}
                </p>
              )}
            </div>
            {ngo.status === "PENDING" && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleApprove(ngo.id)}
                  className="bg-primary-500 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-primary-600"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(ngo.id)}
                  className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  const load = () => {
    getAllUsers()
      .then((res) => setUsers(res.data))
      .catch((err) =>
        setError(err.response?.data?.error || "Could not load users."),
      );
  };

  useEffect(load, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove ${name}'s account? This cannot be undone.`))
      return;
    await deleteUser(id);
    load();
  };

  return (
    <div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-left text-neutral-500">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Verified</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-3">{u.name}</td>
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.verified ? "Yes" : "No"}</td>
                <td className="p-3">
                  {u.role !== "ADMIN" && (
                    <button
                      onClick={() => handleDelete(u.id, u.name)}
                      className="text-red-500 text-xs"
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

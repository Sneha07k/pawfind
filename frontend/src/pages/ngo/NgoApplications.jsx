import { useEffect, useState } from "react";
import {
  approveApplication,
  getNgoApplications,
  rejectApplication,
} from "../../api/applicationApi";

export default function NgoApplications() {
  const [applications, setApplications] = useState([]);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    getNgoApplications().then((res) => setApplications(res.data));
  };

  useEffect(load, []);

  const handleApprove = async (id) => {
    if (
      !window.confirm(
        "Approve this application? Other pending applications for this pet will be auto-rejected.",
      )
    )
      return;
    await approveApplication(id);
    load();
  };

  const handleReject = async (id) => {
    const reason = window.prompt("Reason for rejection (optional):") || "";
    await rejectApplication(id, reason);
    load();
  };

  const pending = applications.filter((a) => a.status === "PENDING");
  const others = applications.filter((a) => a.status !== "PENDING");

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-primary-600 mb-6">
          Adoption Applications
        </h1>

        <h2 className="font-medium text-neutral-700 mb-3">
          Pending Review ({pending.length})
        </h2>
        <div className="space-y-4 mb-10">
          {pending.length === 0 && (
            <p className="text-neutral-500 text-sm">
              Nothing waiting on you right now.
            </p>
          )}
          {pending.map((app) => (
            <div key={app.id} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {app.fullName} → {app.petName}
                  </h3>
                  <p className="text-sm text-neutral-500">
                    {app.adopterEmail} · {app.phoneNumber}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(app.id)}
                    className="bg-primary-500 text-white px-3 py-1.5 rounded-xl text-sm hover:bg-primary-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(app.id)}
                    className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-sm hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </div>

              <button
                onClick={() => setExpanded(expanded === app.id ? null : app.id)}
                className="text-xs text-primary-600 mt-2"
              >
                {expanded === app.id ? "Hide details" : "View full application"}
              </button>

              {expanded === app.id && (
                <div className="mt-3 text-sm text-neutral-600 space-y-1 border-t pt-3">
                  <p>
                    <strong>Address:</strong> {app.address}
                  </p>
                  <p>
                    <strong>Occupation:</strong> {app.occupation}
                  </p>
                  <p>
                    <strong>House Type:</strong> {app.houseType}
                  </p>
                  {app.previousPetExperience && (
                    <p>
                      <strong>Pet Experience:</strong>{" "}
                      {app.previousPetExperience}
                    </p>
                  )}
                  {app.existingPets && (
                    <p>
                      <strong>Existing Pets:</strong> {app.existingPets}
                    </p>
                  )}
                  <p>
                    <strong>Reason for Adoption:</strong>{" "}
                    {app.reasonForAdoption}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <h2 className="font-medium text-neutral-700 mb-3">History</h2>
        <div className="space-y-2">
          {others.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-xl shadow-sm p-4 flex justify-between items-center text-sm"
            >
              <span>
                {app.fullName} → {app.petName}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

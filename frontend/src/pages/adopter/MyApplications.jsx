import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCertificate, getMyApplications } from "../../api/applicationApi";

const statusStyles = {
  PENDING: "bg-yellow-50 text-yellow-700",
  APPROVED: "bg-primary-50 text-primary-600",
  REJECTED: "bg-red-50 text-red-600",
  AGREEMENT_SIGNED: "bg-accent-400/10 text-accent-500",
  COMPLETED: "bg-primary-100 text-primary-700",
};

export default function MyApplications() {
  const [applications, setApplications] = useState([]);
  const [certificates, setCertificates] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await getMyApplications();

        console.log("Applications:", res.data);

        setApplications(res.data);

        for (const app of res.data) {
          if (app.status === "COMPLETED") {
            try {
              const certRes = await getCertificate(app.id);

              console.log(
                `Certificate for application ${app.id}:`,
                certRes.data,
              );

              setCertificates((prev) => ({
                ...prev,
                [app.id]: certRes.data,
              }));
            } catch (err) {
              console.error(
                `Failed to fetch certificate for application ${app.id}`,
                err,
              );
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch applications", err);
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-primary-600 mb-6">
          My Applications
        </h1>

        {applications.length === 0 && (
          <p className="text-neutral-500">
            You haven't applied to adopt any pets yet.
          </p>
        )}

        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl shadow-sm p-5 flex gap-4"
            >
              {app.petImage && (
                <img
                  src={app.petImage}
                  alt={app.petName}
                  className="w-20 h-20 object-cover rounded-xl"
                />
              )}

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h2 className="font-semibold">{app.petName}</h2>

                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      statusStyles[app.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {app.status.replace("_", " ")}
                  </span>
                </div>

                <p className="text-sm text-neutral-500">{app.ngoName}</p>

                {app.status === "REJECTED" && app.rejectionReason && (
                  <p className="text-sm text-red-500 mt-1">
                    Reason: {app.rejectionReason}
                  </p>
                )}

                <p className="text-xs text-neutral-400 mt-1">
                  Applied {new Date(app.applicationDate).toLocaleDateString()}
                </p>

                {app.status === "APPROVED" && (
                  <Link
                    to={`/applications/${app.id}/sign`}
                    className="inline-block mt-3 bg-primary-500 text-white px-4 py-1.5 rounded-xl text-sm hover:bg-primary-600"
                  >
                    Sign Adoption Agreement
                  </Link>
                )}

                {app.agreementPdfUrl && (
                  <a
                    href={app.agreementPdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 ml-2 text-primary-600 text-sm underline"
                  >
                    Download Agreement
                  </a>
                )}

                {app.status === "COMPLETED" && certificates[app.id] && (
                  <div className="mt-3 bg-primary-50 rounded-xl p-3">
                    <p className="text-sm text-primary-700 font-medium">
                      🎉 Adoption Complete!
                    </p>

                    {certificates[app.id].certificateNumber && (
                      <p className="text-xs text-primary-600 mt-1">
                        Certificate No: {certificates[app.id].certificateNumber}
                      </p>
                    )}

                    {certificates[app.id].pdfUrl ? (
                      <>
                        <a
                          href={certificates[app.id].pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block mt-2 text-sm text-primary-600 underline"
                        >
                          Download Certificate
                        </a>

                        <Link
                          to={`/pets/${app.petId}/share-story`}
                          className="block text-sm text-primary-600 underline mt-2"
                        >
                          Share Your Success Story
                        </Link>
                      </>
                    ) : (
                      <p className="text-xs text-red-500 mt-2">
                        Certificate PDF URL not found.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

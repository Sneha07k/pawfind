import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getPetById } from "../../api/petApi";
import { useAuth } from "../../context/AuthContext";
import QuestionThread from "../../components/QuestionThread";

export default function PetDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [pet, setPet] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    getPetById(id)
      .then((res) => setPet(res.data))
      .catch((err) =>
        setError(err.response?.data?.error || "Could not load this pet."),
      );
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        {error}
      </div>
    );
  }
  if (!pet) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Loading...
      </div>
    );
  }

  const isOwnerNgo = user?.role === "NGO"; // fine-grained "is this YOUR pet" check happens server-side on answer

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-6 py-10">
        <Link to="/browse" className="text-sm text-primary-600">
          ← Back to all pets
        </Link>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mt-4">
          <div className="w-full h-80 bg-neutral-100">
            {pet.images?.length > 0 ? (
              <img
                src={pet.images[activeImage]}
                alt={pet.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                No photos yet
              </div>
            )}
          </div>

          {pet.images?.length > 1 && (
            <div className="flex gap-2 p-3 overflow-x-auto">
              {pet.images.map((url, i) => (
                <img
                  key={url}
                  src={url}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${i === activeImage ? "border-primary-500" : "border-transparent"}`}
                />
              ))}
            </div>
          )}

          <div className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-semibold">{pet.name}</h1>
                <p className="text-neutral-500">
                  {pet.breed || pet.species} · {pet.gender?.toLowerCase()} ·{" "}
                  {pet.age ? `${pet.age} months old` : "age unknown"}
                </p>
                <p className="text-sm text-neutral-400 mt-1">
                  Listed by {pet.ngoName}
                </p>
              </div>
              <span className="text-xs bg-primary-50 text-primary-600 px-3 py-1 rounded-full whitespace-nowrap">
                {pet.status.replace("_", " ")}
              </span>
            </div>

            <div className="flex gap-2 mt-3">
              {pet.vaccinated && (
                <span className="text-xs bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                  Vaccinated
                </span>
              )}
              {pet.sterilized && (
                <span className="text-xs bg-accent-400/10 text-accent-500 px-2 py-0.5 rounded-full">
                  Sterilized
                </span>
              )}
            </div>

            {pet.story && (
              <div className="mt-6">
                <h2 className="font-semibold mb-1">Their Story</h2>
                <p className="text-sm text-neutral-600 whitespace-pre-line">
                  {pet.story}
                </p>
              </div>
            )}

            {pet.healthInfo && (
              <div className="mt-4">
                <h2 className="font-semibold mb-1">Health Information</h2>
                <p className="text-sm text-neutral-600 whitespace-pre-line">
                  {pet.healthInfo}
                </p>
              </div>
            )}

            {pet.status === "AVAILABLE" && (
              <button className="mt-6 w-full bg-primary-500 text-white rounded-xl py-3 font-medium hover:bg-primary-600">
                Apply for Adoption
              </button>
              /* wired up to the real application form in Phase 10 */
            )}
          </div>
        </div>

        <QuestionThread petId={pet.id} isOwnerNgo={isOwnerNgo} />
      </div>
    </div>
  );
}

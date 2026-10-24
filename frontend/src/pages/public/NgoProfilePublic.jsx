import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PetCard from "../../components/PetCard";
import { getPublicNgoProfile } from "../../api/ngoApi";
import { getPetsByNgo } from "../../api/petApi";

export default function NgoProfilePublic() {
  const { id } = useParams();
  const [ngo, setNgo] = useState(null);
  const [pets, setPets] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    getPublicNgoProfile(id)
      .then((res) => setNgo(res.data))
      .catch((err) =>
        setError(
          err.response?.data?.error || "Could not load this organization.",
        ),
      );
    getPetsByNgo(id).then((res) => setPets(res.data));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        {error}
      </div>
    );
  }
  if (!ngo) {
    return (
      <div className="min-h-screen flex items-center justify-center text-neutral-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Link to="/browse" className="text-sm text-primary-600">
          ← Back to all pets
        </Link>

        <div className="bg-white rounded-2xl shadow-sm p-6 mt-4 flex items-center gap-4">
          {ngo.logoUrl ? (
            <img
              src={ngo.logoUrl}
              alt={ngo.organizationName}
              className="w-16 h-16 object-cover rounded-full"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 font-semibold text-xl">
              {ngo.organizationName?.[0]}
            </div>
          )}
          <div>
            <h1 className="text-xl font-semibold">{ngo.organizationName}</h1>
            <p className="text-sm text-neutral-500">{ngo.address}</p>
            <p className="text-xs text-primary-600 mt-1">
              Verified Shelter · {ngo.totalPetsListed} pets listed
            </p>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-primary-600 mt-8 mb-4">
          Pets Available for Adoption
        </h2>

        {pets.length === 0 ? (
          <p className="text-neutral-500">
            This shelter doesn't have any pets available right now.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

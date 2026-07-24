import { useEffect, useState } from "react";
import PetCard from "../../components/PetCard";
import { getMyFavorites } from "../../api/favoriteApi";

export default function MyFavorites() {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMyFavorites()
      .then((res) => setPets(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-2xl font-semibold text-primary-600 mb-6">
          My Favourite Pets
        </h1>

        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : pets.length === 0 ? (
          <p className="text-neutral-500">
            You haven't favourited any pets yet.{" "}
            <a href="/browse" className="text-primary-600 underline">
              Browse pets
            </a>{" "}
            to get started.
          </p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {pets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

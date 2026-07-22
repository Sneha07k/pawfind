import { Link } from "react-router-dom";

export default function PetCard({ pet }) {
  return (
    <Link
      to={`/pets/${pet.id}`}
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow block"
    >
      <div className="w-full h-44 bg-neutral-100">
        {pet.images?.[0] ? (
          <img
            src={pet.images[0]}
            alt={pet.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
            No photo yet
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{pet.name}</h3>
        <p className="text-sm text-neutral-500">
          {pet.breed || pet.species} · {pet.gender?.toLowerCase()}
        </p>
        <p className="text-xs text-neutral-400 mt-1">{pet.ngoName}</p>
        <div className="flex gap-2 mt-2">
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
      </div>
    </Link>
  );
}

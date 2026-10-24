import { useState } from "react";
import { Link } from "react-router-dom";
import FavoriteButton from "./FavoriteButton";

export default function PetCard({ pet }) {
  const [activeImage, setActiveImage] = useState(0);
  const images = pet.images || [];

  const handleDotClick = (e, index) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveImage(index);
  };

  return (
    <Link
      to={`/pets/${pet.id}`}
      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow block relative"
    >
      <div className="w-full h-44 bg-neutral-100 relative">
        {images.length > 0 ? (
          <img
            src={images[activeImage]}
            alt={pet.name}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 text-sm">
            No photo yet
          </div>
        )}

        <FavoriteButton
          petId={pet.id}
          className="absolute top-2 right-2 bg-white/90 rounded-full w-8 h-8 flex items-center justify-center shadow-sm"
        />

        {images.length > 1 && (
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={(e) => handleDotClick(e, i)}
                className={`w-1.5 h-1.5 rounded-full ${i === activeImage ? "bg-white" : "bg-white/50"}`}
                aria-label={`Photo ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold">{pet.name}</h3>
        <p className="text-sm text-neutral-500">
          {pet.breed || pet.species} · {pet.gender?.toLowerCase()}
        </p>
        <Link
          to={`/ngo/${pet.ngoId}`}
          onClick={(e) => e.stopPropagation()}
          className="text-xs text-neutral-400 mt-1 hover:text-primary-600 block"
        >
          {pet.ngoName}
        </Link>
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

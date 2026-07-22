import { useEffect, useState } from "react";
import PetCard from "../../components/PetCard";
import { searchPets } from "../../api/petApi";

export default function BrowsePets() {
  const [pets, setPets] = useState([]);
  const [filters, setFilters] = useState({
    species: "",
    breed: "",
    gender: "",
    minAge: "",
    maxAge: "",
    vaccinated: "",
    location: "",
  });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    searchPets(filters)
      .then((res) => setPets(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []); // initial load, unfiltered

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    load();
  };

  const handleReset = () => {
    const cleared = {
      species: "",
      breed: "",
      gender: "",
      minAge: "",
      maxAge: "",
      vaccinated: "",
      location: "",
    };
    setFilters(cleared);
    searchPets(cleared).then((res) => setPets(res.data));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-semibold text-primary-600 mb-6">
          Find Your New Best Friend
        </h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-sm p-5 mb-8 grid sm:grid-cols-3 lg:grid-cols-4 gap-3"
        >
          <input
            name="species"
            value={filters.species}
            onChange={handleChange}
            placeholder="Species (Dog, Cat...)"
            className="border rounded-xl px-3 py-2 text-sm"
          />
          <input
            name="breed"
            value={filters.breed}
            onChange={handleChange}
            placeholder="Breed"
            className="border rounded-xl px-3 py-2 text-sm"
          />
          <select
            name="gender"
            value={filters.gender}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">Any gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
          </select>
          <select
            name="vaccinated"
            value={filters.vaccinated}
            onChange={handleChange}
            className="border rounded-xl px-3 py-2 text-sm"
          >
            <option value="">Vaccination — any</option>
            <option value="true">Vaccinated only</option>
          </select>
          <input
            name="minAge"
            value={filters.minAge}
            onChange={handleChange}
            type="number"
            placeholder="Min age (months)"
            className="border rounded-xl px-3 py-2 text-sm"
          />
          <input
            name="maxAge"
            value={filters.maxAge}
            onChange={handleChange}
            type="number"
            placeholder="Max age (months)"
            className="border rounded-xl px-3 py-2 text-sm"
          />
          <input
            name="location"
            value={filters.location}
            onChange={handleChange}
            placeholder="Location / area"
            className="border rounded-xl px-3 py-2 text-sm"
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex-1 bg-primary-500 text-white rounded-xl py-2 text-sm hover:bg-primary-600"
            >
              Search
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="px-4 border rounded-xl text-sm"
            >
              Reset
            </button>
          </div>
        </form>

        {loading ? (
          <p className="text-neutral-500">Loading pets...</p>
        ) : pets.length === 0 ? (
          <p className="text-neutral-500">
            No pets match your search right now — try widening your filters.
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

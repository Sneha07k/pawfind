import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { deletePet, getMyPets } from '../../api/petApi'

export default function MyPets() {
  const [pets, setPets] = useState([])
  const [error, setError] = useState('')

  const load = () => {
    getMyPets()
      .then((res) => setPets(res.data))
      .catch((err) => setError(err.response?.data?.error || 'Could not load pets.'))
  }

  useEffect(load, [])

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this pet listing?')) return
    await deletePet(id)
    load()
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-primary-600">My Pets</h1>
        <Link to="/ngo/pets/new" className="bg-primary-500 text-white px-4 py-2 rounded-xl text-sm hover:bg-primary-600">
          + Add Pet
        </Link>
      </div>

      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pets.map((pet) => (
          <div key={pet.id} className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {pet.images?.[0] && (
              <img src={pet.images[0]} alt={pet.name} className="w-full h-40 object-cover" />
            )}
            <div className="p-4">
              <h2 className="font-semibold">{pet.name}</h2>
              <p className="text-sm text-neutral-500">{pet.species} · {pet.breed}</p>
              <p className="text-xs mt-1 inline-block bg-primary-50 text-primary-600 px-2 py-0.5 rounded-full">
                {pet.status}
              </p>
              <div className="flex gap-3 mt-3 text-sm">
                <Link to={`/ngo/pets/${pet.id}/edit`} className="text-primary-600">Edit</Link>
                <button onClick={() => handleDelete(pet.id)} className="text-red-500">Delete</button>
              </div>
            </div>
          </div>
        ))}
        {pets.length === 0 && <p className="text-neutral-500">No pets listed yet.</p>}
      </div>
    </div>
  )
}
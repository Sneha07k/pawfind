import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { createPet, getPetById, updatePet, uploadPetImage } from '../../api/petApi'

export default function PetForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { register, handleSubmit, reset } = useForm()
  const [images, setImages] = useState([])
  const [error, setError] = useState('')
  const [petId, setPetId] = useState(id || null)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (isEdit) {
      getPetById(id).then((res) => {
        reset(res.data)
        setImages(res.data.images || [])
      })
    }
  }, [id, isEdit, reset])

  const onSubmit = async (data) => {
    setError('')
    const payload = { ...data, age: data.age ? parseInt(data.age) : null }
    try {
      if (isEdit) {
        await updatePet(id, payload)
        navigate('/ngo/pets')
      } else {
        const res = await createPet(payload)
        setPetId(res.data.id) // stay on page so photos can be added to the new pet
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save pet.')
    }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file || !petId) return
    setUploading(true)
    try {
      const res = await uploadPetImage(petId, file)
      setImages(res.data.images)
    } catch (err) {
      setError(err.response?.data?.error || 'Image upload failed.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-10 px-4">
      <div className="bg-white shadow-md rounded-2xl p-8 max-w-xl mx-auto">
        <h1 className="text-2xl font-semibold text-primary-600 mb-6">
          {isEdit ? 'Edit Pet' : 'Add a New Pet'}
        </h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div>
            <label className="block mb-1 text-sm font-medium">Name</label>
            <input {...register('name', { required: true })} className="w-full border rounded-xl px-3 py-2" />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Species</label>
            <input {...register('species', { required: true })} className="w-full border rounded-xl px-3 py-2" placeholder="Dog, Cat, ..." />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Breed</label>
            <input {...register('breed')} className="w-full border rounded-xl px-3 py-2" />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Gender</label>
              <select {...register('gender')} className="w-full border rounded-xl px-3 py-2">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="UNKNOWN">Unknown</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Age (months)</label>
              <input type="number" {...register('age')} className="w-full border rounded-xl px-3 py-2" />
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('vaccinated')} /> Vaccinated
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" {...register('sterilized')} /> Sterilized
            </label>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Health Information</label>
            <textarea {...register('healthInfo')} className="w-full border rounded-xl px-3 py-2" rows={2} />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Story / Background</label>
            <textarea {...register('story')} className="w-full border rounded-xl px-3 py-2" rows={3} />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Latitude</label>
              <input {...register('latitude')} className="w-full border rounded-xl px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Longitude</label>
              <input {...register('longitude')} className="w-full border rounded-xl px-3 py-2" />
            </div>
          </div>

          <button type="submit" className="w-full bg-primary-500 text-white rounded-xl py-2 mt-2 hover:bg-primary-600">
            {isEdit ? 'Save Changes' : 'Create Pet'}
          </button>
        </form>

        {petId && (
          <div className="mt-8">
            <h2 className="font-medium mb-2">Photos</h2>
            <div className="flex flex-wrap gap-3 mb-3">
              {images.map((url) => (
                <img key={url} src={url} alt="pet" className="w-24 h-24 object-cover rounded-xl" />
              ))}
            </div>
            <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            {!isEdit && (
              <button onClick={() => navigate('/ngo/pets')} className="block mt-4 text-sm text-primary-600">
                Done — back to my pets
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
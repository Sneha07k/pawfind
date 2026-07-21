import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { getMyNgoProfile, saveNgoProfile } from '../../api/ngoApi'

export default function NgoProfileSetup() {
  const { register, handleSubmit, reset, setValue } = useForm()
  const [status, setStatus] = useState(null)
  const [rejectionReason, setRejectionReason] = useState(null)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getMyNgoProfile()
      .then((res) => {
        reset(res.data)
        setStatus(res.data.status)
        setRejectionReason(res.data.rejectionReason)
      })
      .catch(() => {
        // no profile yet — that's fine, this is a first-time setup
      })
  }, [reset])

  const useMyLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setValue('latitude', pos.coords.latitude)
      setValue('longitude', pos.coords.longitude)
    })
  }

  const onSubmit = async (data) => {
    setError('')
    try {
      const res = await saveNgoProfile({
        ...data,
        latitude: data.latitude ? parseFloat(data.latitude) : null,
        longitude: data.longitude ? parseFloat(data.longitude) : null,
      })
      setStatus(res.data.status)
      setSaved(true)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not save profile.')
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-10">
      <div className="bg-white shadow-md rounded-2xl p-8 w-full max-w-lg">
        <h1 className="text-2xl font-semibold text-primary-600 mb-2">Organization Profile</h1>
        <p className="text-sm text-neutral-500 mb-6">
          Tell us about your shelter. An admin will review and approve your account before you can list pets.
        </p>

        {status === 'PENDING' && (
          <div className="bg-yellow-50 text-yellow-700 text-sm rounded-xl p-3 mb-4">
            Your profile is pending admin approval.
          </div>
        )}
        {status === 'APPROVED' && (
          <div className="bg-primary-50 text-primary-600 text-sm rounded-xl p-3 mb-4">
            Your organization is approved! You can now list pets.
          </div>
        )}
        {status === 'REJECTED' && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl p-3 mb-4">
            Your previous submission was rejected{rejectionReason ? `: ${rejectionReason}` : '.'} Please update and resubmit.
          </div>
        )}
        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {saved && <p className="text-primary-600 text-sm mb-3">Profile saved.</p>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <label className="block mb-1 text-sm font-medium">Organization Name</label>
          <input {...register('organizationName', { required: true })} className="w-full border rounded-xl px-3 py-2 mb-3" />

          <label className="block mb-1 text-sm font-medium">Address</label>
          <input {...register('address', { required: true })} className="w-full border rounded-xl px-3 py-2 mb-3" />

          <div className="flex gap-3 mb-1">
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Latitude</label>
              <input {...register('latitude')} className="w-full border rounded-xl px-3 py-2" />
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">Longitude</label>
              <input {...register('longitude')} className="w-full border rounded-xl px-3 py-2" />
            </div>
          </div>
          <button type="button" onClick={useMyLocation} className="text-xs text-primary-600 mb-4">
            Use my current location
          </button>

          <button type="submit" className="w-full bg-primary-500 text-white rounded-xl py-2 hover:bg-primary-600">
            Save Profile
          </button>
        </form>
      </div>
    </div>
  )
}
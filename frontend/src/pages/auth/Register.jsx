import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const onSubmit = async (data) => {
      setServerError('')
      try {
        await registerUser(data)
        navigate('/verify-otp', { state: { email: data.email } })
      } catch (err) {
        setServerError(err.response?.data?.error || 'Registration failed. Please try again.')
      }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-primary-600 mb-6">Join PawFind</h1>
        {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

        <label className="block mb-1 text-sm font-medium">Name</label>
        <input {...register('name', { required: true })} className="w-full border rounded-xl px-3 py-2 mb-3" />

        <label className="block mb-1 text-sm font-medium">Email</label>
        <input {...register('email', { required: true })} type="email" className="w-full border rounded-xl px-3 py-2 mb-3" />

        <label className="block mb-1 text-sm font-medium">Password</label>
        <input {...register('password', { required: true, minLength: 8 })} type="password" className="w-full border rounded-xl px-3 py-2 mb-1" />
        {errors.password && <p className="text-red-500 text-xs mb-3">Password must be at least 8 characters</p>}

        <label className="block mb-1 text-sm font-medium mt-3">I am a...</label>
        <select {...register('role', { required: true })} className="w-full border rounded-xl px-3 py-2 mb-4">
          <option value="ADOPTER">Adopter — looking to adopt a pet</option>
          <option value="NGO">NGO / Shelter — listing pets</option>
        </select>

        <button type="submit" className="w-full bg-primary-500 text-white rounded-xl py-2 hover:bg-primary-600">
          Create Account
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account? <Link to="/login" className="text-primary-600 font-medium">Log in</Link>
        </p>
      </form>
    </div>
  )
}
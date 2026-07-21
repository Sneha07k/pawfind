import { useForm } from 'react-hook-form'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { login } = useAuth()
  const navigate = useNavigate()
  const [serverError, setServerError] = useState('')

  const onSubmit = async (data) => {
    setServerError('')
    try {
      await login(data)
      navigate('/')
    } catch (err) {
      setServerError(err.response?.data?.error || 'Login failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-primary-600 mb-6">Welcome back</h1>
        {serverError && <p className="text-red-500 text-sm mb-4">{serverError}</p>}

        <label className="block mb-1 text-sm font-medium">Email</label>
        <input {...register('email', { required: 'Email is required' })} className="w-full border rounded-xl px-3 py-2 mb-1" type="email" />
        {errors.email && <p className="text-red-500 text-xs mb-3">{errors.email.message}</p>}

        <label className="block mb-1 text-sm font-medium mt-3">Password</label>
        <input {...register('password', { required: 'Password is required' })} className="w-full border rounded-xl px-3 py-2 mb-1" type="password" />
        {errors.password && <p className="text-red-500 text-xs mb-3">{errors.password.message}</p>}

        <button type="submit" className="w-full bg-primary-500 text-white rounded-xl py-2 mt-4 hover:bg-primary-600">
          Log In
        </button>

        <div className="text-right mb-3">
          <Link to="/forgot-password" className="text-xs text-primary-600">Forgot password?</Link>
        </div>

        <p className="text-sm text-center mt-4">
          New here? <Link to="/register" className="text-primary-600 font-medium">Create an account</Link>
        </p>
      </form>
    </div>
  )
}
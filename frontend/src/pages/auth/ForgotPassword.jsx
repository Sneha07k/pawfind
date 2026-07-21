import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { forgotPassword } from '../../api/authApi'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await forgotPassword({ email })
      navigate('/reset-password', { state: { email } })
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-primary-600 mb-2">Forgot password?</h1>
        <p className="text-sm text-neutral-500 mb-6">Enter your email and we'll send you a reset code.</p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border rounded-xl px-3 py-2 mb-4"
          placeholder="you@example.com"
        />

        <button type="submit" className="w-full bg-primary-500 text-white rounded-xl py-2 hover:bg-primary-600">
          Send reset code
        </button>
      </form>
    </div>
  )
}
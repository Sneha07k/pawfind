import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { resetPassword } from '../../api/authApi'

export default function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const [email] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await resetPassword({ email, otp, newPassword })
      setSuccess('Password reset! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1500)
    } catch (err) {
      setError(err.response?.data?.error || 'Could not reset password.')
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-600">
          Please <a href="/forgot-password" className="text-primary-600 underline">start from forgot password</a>.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-primary-600 mb-2">Reset password</h1>
        <p className="text-sm text-neutral-500 mb-6">Code sent to <strong>{email}</strong></p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {success && <p className="text-primary-600 text-sm mb-3">{success}</p>}

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="000000"
          className="w-full border rounded-xl px-3 py-2 mb-4 text-center text-xl tracking-widest"
        />

        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password (min 8 characters)"
          className="w-full border rounded-xl px-3 py-2 mb-4"
        />

        <button type="submit" className="w-full bg-primary-500 text-white rounded-xl py-2 hover:bg-primary-600">
          Reset Password
        </button>
      </form>
    </div>
  )
}
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { resendOtp } from '../../api/authApi'

export default function VerifyOtp() {
  const location = useLocation()
  const navigate = useNavigate()
  const { verifyOtp } = useAuth()
  const [email] = useState(location.state?.email || '')
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')

  const handleVerify = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await verifyOtp({ email, otp })
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP. Please try again.')
    }
  }

  const handleResend = async () => {
    setError('')
    setInfo('')
    try {
      await resendOtp({ email })
      setInfo('A new OTP has been sent to your email.')
    } catch (err) {
      setError(err.response?.data?.error || 'Could not resend OTP.')
    }
  }

  if (!email) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-neutral-600">
          No email found. Please <a href="/register" className="text-primary-600 underline">register</a> first.
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <form onSubmit={handleVerify} className="bg-white shadow-md rounded-2xl p-8 w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-primary-600 mb-2">Verify your email</h1>
        <p className="text-sm text-neutral-500 mb-6">We sent a 6-digit code to <strong>{email}</strong></p>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
        {info && <p className="text-primary-600 text-sm mb-3">{info}</p>}

        <input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          maxLength={6}
          placeholder="000000"
          className="w-full border rounded-xl px-3 py-2 mb-4 text-center text-xl tracking-widest"
        />

        <button type="submit" className="w-full bg-primary-500 text-white rounded-xl py-2 hover:bg-primary-600">
          Verify
        </button>

        <button type="button" onClick={handleResend} className="w-full text-sm text-primary-600 mt-3">
          Resend code
        </button>
      </form>
    </div>
  )
}
import { createContext, useContext, useState } from 'react'
import { loginUser, registerUser, verifyOtp as verifyOtpApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('pawfind_user')
    return stored ? JSON.parse(stored) : null
  })

  const persist = (data) => {
    localStorage.setItem('pawfind_token', data.token)
    localStorage.setItem('pawfind_user', JSON.stringify(data))
    setUser(data)
  }

  const login = async (credentials) => {
    const res = await loginUser(credentials)
    persist(res.data)
    return res.data
  }

  // Registration no longer logs the user in directly — it just triggers the OTP email.
  const register = async (payload) => {
    const res = await registerUser(payload)
    return res.data // { message: "..." }
  }

  const verifyOtp = async (payload) => {
    const res = await verifyOtpApi(payload)
    persist(res.data)
    return res.data
  }

  const logout = () => {
    localStorage.removeItem('pawfind_token')
    localStorage.removeItem('pawfind_user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, verifyOtp, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
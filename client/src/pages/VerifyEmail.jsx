import React, { useEffect, useState, useContext } from 'react'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { API } from '@/config/api'
import { AuthContext } from '@/providers/authProvider'

function VerifyEmail() {
  const location = useLocation()
  const [status, setStatus] = useState('verifying') // 'verifying' | 'success' | 'failed'
  const { updateProfile } = useContext(AuthContext)

  // Extract token from query params
  const queryParams = new URLSearchParams(location.search)
  const token = queryParams.get('token')

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.post(`${API.VERIFY_EMAIL}`, { token })
        if (response.data.success) {
          setStatus('success')
          // Update profile to mark email as verified
          await updateProfile({ email_verified: true })
          setTimeout(() => window.location.href = '/dashboard', 1500)
        } else {
          setStatus('failed')
          setTimeout(() => window.location.href = '/', 1500)
        }
      } catch (error) {
        console.error('Verification error:', error.response?.data || error.message)
        setStatus('failed')
        setTimeout(() => window.location.href = '/', 1500)
      }
    }

    if (token) {
      verifyEmail()
    } else {
        window.location.href = '/'
    }
  }, [token])

  const getMessage = () => {
    if (status === 'verifying') return 'Verifying your email...'
    if (status === 'success') return 'Email verified! Redirecting to dashboard...'
    if (status === 'failed') return 'Verification failed. Redirecting...'
  }

  return (
    <div className="text-lg font-semibold text-center text-gray-700 mt-10">
      {getMessage()}
    </div>
  )
}

export default VerifyEmail

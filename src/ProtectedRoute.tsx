import React from 'react'
import {Navigate} from 'react-router-dom'
import {useAppSelector} from './store/hooks'

export default function ProtectedRoute({children}: {children: React.ReactElement}) {
  const token = useAppSelector((state) => state.auth.accessToken)

  if (!token) {
    return <Navigate to="/" replace/>
  }
  return children
}
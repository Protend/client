/* eslint-disable import/no-anonymous-default-export */
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import useApi from '../services/api'

export default () => {
  const api = useApi()
  const history = useHistory()

  useEffect(() => {
    const doLogout = async () => {
      await api.logout()
      history.push('/login')
    }
    doLogout()
  }, [api, history])

  return null
}

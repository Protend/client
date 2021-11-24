import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import {
  TheContent,
  TheSidebar,
} from './index'

import useApi from '../services/api'

const TheLayout = () => {
  const api = useApi()
  const history = useHistory()

  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkLogin = async () => {
      if (api.getToken()) {
        const result = await api.validateToken()
        if (result.error === '') {
          setLoading(false)
        } else {
          console.log(result.error)
          history.push('/login')
        }
      } else {
        history.push('/login')
      }
    }
    checkLogin()
  }, [api, history])

  return (
    <div className="c-app c-default-layout">
      {!loading && (
        <>
          <TheSidebar/>
          <div className="c-wrapper">
            <div className="c-body">
              <TheContent/>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default TheLayout

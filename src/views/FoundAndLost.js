/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import { useState, useEffect } from 'react'
import {
  CCol,
  CRow,
  CCard,
  CCardBody,
  CDataTable,
  CSwitch,
  CButton
} from '@coreui/react'

import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'

import useApi from '../services/api'

export default () => {
  const api = useApi()

  const [loading, setLoading] = useState(true)
  const [list, setList] = useState([])
  const [photoUrl, setPhotoUrl] = useState('')

  const fields = [
    { label: 'Resolvido', key: 'status', filter: false },
    { label: 'Local Encontrado', key: 'where', sorter: false },
    { label: 'Descrição', key: 'description', sorter: false },
    { label: 'Foto', key: 'photo', sorter: false, filter: false },
    { label: 'Data', key: 'datecreated' },
  ]

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    setLoading(true)
    const result = await api.getFoundAndLost()
    setLoading(false)
    if (result.error === '') {
      setList(result.list)
    } else {
      alert(result.error)
    }
  }

  const handleSwitchClick = async (item) => {
    setLoading(true)
    const result = await api.updateFoundAndLost(item.id)
    setLoading(false)

    if (result.error === '') {
      getList()
    } else {
      alert(result.error)
    }
  }

  const showLightbox = (url) => {
    setPhotoUrl(url)
  }

  return (
    <>
      <CRow>
        <CCol>
          <h2>Achados e Perdidos</h2>

          <CCard>
            <CCardBody>
              <CDataTable
                items={list}
                fields={fields}
                loading={loading}
                noItemsViewSlot=" "
                columnFilter
                sorter
                hover
                striped
                bordered
                pagination
                itemsPerPage={10}
                scopedSlots={{
                  'photo': (item) => (
                    <td>
                      {item.photo && (
                        <CButton
                          color="success"
                          onClick={() => showLightbox(item.photo)}
                        >
                          Visualizar
                        </CButton>
                      )}
                    </td>
                  ),
                  'datecreated': (item) => (
                    <td>
                      {item.datecreated_formatted}
                    </td>
                  ),
                  'status': (item) => (
                    <td>
                      <CSwitch
                        color="success"
                        checked={item.status === 'recovered'}
                        onChange={() => handleSwitchClick(item)}
                      />
                    </td>
                  )
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {photoUrl && (
        <Lightbox
          mainSrc={photoUrl}
          onCloseRequest={() => setPhotoUrl('')}
          reactModalStyle={{ overlay: { zIndex: 9999 } }}
        />
      )}
    </>
  )
}

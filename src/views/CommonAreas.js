/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable import/no-anonymous-default-export */
import { useState, useEffect } from 'react'
import {
  CCol,
  CRow,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
  CDataTable,
  CButtonGroup,
  CFormGroup,
  CLabel,
  CInput,
  CSwitch,
  CInputCheckbox,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import Modal from 'src/components/Modal'

import useApi from '../services/api'

export default () => {
  const api = useApi()

  const [loading, setLoading] = useState(true)
  const [modalLoading, setModalLoading] = useState(false)
  const [list, setList] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalId, setModalId] = useState('')
  const [modalAllowedField, setModalAllowedField] = useState(1)
  const [modalTitleField, setModalTitleField] = useState('')
  const [modalCoverField, setModalCoverField] = useState('')
  const [modalDaysField, setModalDaysField] = useState([])
  const [modalStartTimeField, setModalStartTimeField] = useState('')
  const [modalEndTimeField, setModalEndTimeField] = useState('')

  const fields = [
    { label: 'Status', key: 'allowed', filter: false, sorter: false },
    { label: 'Capa', key: 'cover', filter: false, sorter: false },
    { label: 'Título', key: 'title' },
    { label: 'Funcionamento', key: 'days' },
    { label: 'Inicio', key: 'start_time', filter: false },
    { label: 'Fim', key: 'end_time', filter: false },
    { label: 'Ações', key: 'actions', _style: { width: '1px' }, sorter: false, filter: false }
  ]

  useEffect(() => {
    getList()
  }, [])

  const getList = async () => {
    setLoading(true)
    const result = await api.getAreas()
    setLoading(false)
    if (result.error === '') {
      setList(result.list)
    } else {
      alert(result.error)
    }
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  const handleEditButton = (id) => {
    let index = list.findIndex(v => v.id === id)

    setModalId(list[index]['id'])
    setModalAllowedField(list[index]['allowed'])
    setModalTitleField(list[index]['title'])
    setModalCoverField('')
    setModalDaysField(list[index]['days'].split(','))
    setModalStartTimeField(list[index]['start_time'])
    setModalEndTimeField(list[index]['end_time'])
    setShowModal(true)
  }

  const handleModalSave = async () => {
    if (modalTitleField && modalStartTimeField && modalEndTimeField) {
      setModalLoading(true)

      let result
      let data = {
        allowed: modalAllowedField,
        title: modalTitleField,
        days: modalDaysField.join(','),
        start_time: modalStartTimeField,
        end_time: modalEndTimeField
      }

      if (modalCoverField) {
        data.cover = modalCoverField
      }

      if (modalId === '') {
        result = await api.addArea(data)
      } else {
        result = await api.updateArea(modalId, data)
      }
      setModalLoading(false)

      if (result.error === '') {
        setShowModal(false)
        getList()
      }
    } else {
      alert('Whoops: Todos os campos são obrigátorio!')
    }
  }

  const handleRemoveButton = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir?')) {
      const result = await api.removeArea(id)

      if (result.error === '') {
        getList()
      } else {
        alert(result.error)
      }
    }
  }

  const handleNewButton = () => {
    setModalId('')
    setModalAllowedField(1)
    setModalTitleField('')
    setModalCoverField('')
    setModalDaysField([])
    setModalStartTimeField('')
    setModalEndTimeField('')
    setShowModal(true)
  }

  const handleSwitchClick = async (item) => {
    setLoading(true)
    const result = await api.updateAreaAllowed(item.id)
    setLoading(false)

    if (result.error === '') {
      getList()
    } else {
      alert(result.error)
    }
  }

  const handleModalSwitchClick = () => {
    setModalAllowedField(1 - modalAllowedField)
  }

  const toggleModalDays = (item, event) => {
    let days = [...modalDaysField]

    if (event.target.checked === false) {
      days = days.filter(day => day !== item)
    } else {
      days.push(item)
    }

    setModalDaysField(days)
  }

  return (
    <>
      <CRow>
        <CCol>
          <h2>Áreas Comuns</h2>

          <CCard>
            <CCardHeader>
              <CButton
                color="primary"
                onClick={handleNewButton}
              >
                <CIcon name="cil-check" /> Nova Área
              </CButton>
            </CCardHeader>
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
                  'allowed': (item) => (
                    <td>
                      <CSwitch
                        color="success"
                        checked={item.allowed}
                        onChange={() => handleSwitchClick(item)}
                      />
                    </td>
                  ),
                  'cover': (item) => (
                    <td>
                      <img src={item.cover} width={100} />
                    </td>
                  ),
                  'days': (item) => {
                    let daysWords = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
                    let days = item.days.split(',')
                    let daysString = []

                    for (let i in days) {
                      if (days[i] && daysWords[days[i]]) {
                        daysString.push(daysWords[days[i]])
                      }
                    }

                    return (
                      <td>
                        {daysString.join(', ')}
                      </td>
                    )
                  },
                  'actions': (item) => (
                    <td>
                      <CButtonGroup>
                        <CButton
                          color="info"
                          onClick={() => handleEditButton(item.id)}
                        >
                          Editar
                        </CButton>
                        <CButton
                          color="danger"
                          onClick={() => handleRemoveButton(item.id)}
                        >
                          Excluir
                        </CButton>
                      </CButtonGroup>
                    </td>
                  )
                }}
              />
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>

      <Modal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        handleModalSave={handleModalSave}
        modalLoading={modalLoading}
        modalId={modalId}
      >
        <CFormGroup>
          <CLabel htmlFor="modal-allowed">Status</CLabel>
          <br />
          <CSwitch
            color="success"
            checked={modalAllowedField}
            onChange={handleModalSwitchClick}
          />
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="modal-title">Título</CLabel>
          <CInput
            type="text"
            id="modal-title"
            name="title"
            value={modalTitleField}
            onChange={(e) => setModalTitleField(e.target.value)}
          />
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="modal-cover">Capa</CLabel>
          <CInput
            type="file"
            id="modal-cover"
            name="cover"
            placeholder="Escolha uma capa"
            onChange={(e) => setModalCoverField(e.target.files[0])}
          />
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="modal-allowed">Funcionamento</CLabel>
          <div style={{ marginLeft: '20px' }}>
              <div>
                <CInputCheckbox
                  id="modal-days-0"
                  name="modal-days"
                  value={0}
                  checked={modalDaysField.includes('0')}
                  onChange={(e) => toggleModalDays('0', e)}
                />
                <CLabel htmlFor="modal-days-0">Segunda</CLabel>
              </div>
              <div>
                <CInputCheckbox
                  id="modal-days-1"
                  name="modal-days"
                  value={1}
                  checked={modalDaysField.includes('1')}
                  onChange={(e) => toggleModalDays('1', e)}
                />
                <CLabel htmlFor="modal-days-1">Terça</CLabel>
              </div>
              <div>
                <CInputCheckbox
                  id="modal-days-2"
                  name="modal-days"
                  value={2}
                  checked={modalDaysField.includes('2')}
                  onChange={(e) => toggleModalDays('2', e)}
                />
                <CLabel htmlFor="modal-days-2">Quarta</CLabel>
              </div>
              <div>
                <CInputCheckbox
                  id="modal-days-3"
                  name="modal-days"
                  value={3}
                  checked={modalDaysField.includes('3')}
                  onChange={(e) => toggleModalDays('3', e)}
                />
                <CLabel htmlFor="modal-days-3">Quinta</CLabel>
              </div>
              <div>
                <CInputCheckbox
                  id="modal-days-4"
                  name="modal-days"
                  value={4}
                  checked={modalDaysField.includes('4')}
                  onChange={(e) => toggleModalDays('4', e)}
                />
                <CLabel htmlFor="modal-days-4">Sexta</CLabel>
              </div>
              <div>
                <CInputCheckbox
                  id="modal-days-5"
                  name="modal-days"
                  value={5}
                  checked={modalDaysField.includes('5')}
                  onChange={(e) => toggleModalDays('5', e)}
                />
                <CLabel htmlFor="modal-days-5">Sábado</CLabel>
              </div>
              <div>
                <CInputCheckbox
                  id="modal-days-6"
                  name="modal-days"
                  value={6}
                  checked={modalDaysField.includes('6')}
                  onChange={(e) => toggleModalDays('6', e)}
                />
                <CLabel htmlFor="modal-days-6">Domingo</CLabel>
              </div>
          </div>
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="modal-start-time">Inicio</CLabel>
          <CInput
            type="time"
            id="modal-start-time"
            name="start_time"
            value={modalStartTimeField}
            onChange={(e) => setModalStartTimeField(e.target.value)}
          />
        </CFormGroup>

        <CFormGroup>
          <CLabel htmlFor="modal-end-time">Fim</CLabel>
          <CInput
            type="time"
            id="modal-end-time"
            name="end_time"
            value={modalEndTimeField}
            onChange={(e) => setModalEndTimeField(e.target.value)}
          />
        </CFormGroup>

      </Modal>
    </>
  )
}
